import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { User, OAuthState, BotEntitlement, Payment, Subscription } from '@/models';
import { requireAuth } from '@/lib/auth-helper';
import { postEntitlement, isSentinelConfigured } from '@/lib/sentinel';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    if (error) {
      return NextResponse.redirect(
        new URL(`/UserDashboard/settings?error=${encodeURIComponent(error)}`, request.url)
      );
    }

    if (!code || !state) {
      return NextResponse.redirect(
        new URL('/UserDashboard/settings?error=missing_parameters', request.url)
      );
    }

    await connectDB();

    // Verify OAuth state exists and is not expired
    const oauthState = await OAuthState.findOne({ state });
    if (!oauthState) {
      return NextResponse.redirect(
        new URL('/UserDashboard/settings?error=invalid_state', request.url)
      );
    }

    if (new Date(oauthState.expiresAt) < new Date()) {
      await OAuthState.deleteOne({ state });
      return NextResponse.redirect(
        new URL('/UserDashboard/settings?error=expired_state', request.url)
      );
    }

    // Get the user from the OAuth state
    const user = await User.findById(oauthState.userId);
    if (!user) {
      await OAuthState.deleteOne({ state });
      return NextResponse.redirect(
        new URL('/UserDashboard/settings?error=user_not_found', request.url)
      );
    }

    // Exchange code for tokens
    const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id: process.env.DISCORD_CLIENT_ID!,
        client_secret: process.env.DISCORD_CLIENT_SECRET!,
        redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/auth/discord/link/callback`,
        grant_type: 'authorization_code',
        code_verifier: oauthState.codeVerifier,
      }),
    });

    // Clean up OAuth state
    await OAuthState.deleteOne({ state });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('Token exchange failed:', errorText);
      return NextResponse.redirect(
        new URL('/UserDashboard/settings?error=token_exchange_failed', request.url)
      );
    }

    const tokens = await tokenResponse.json();

    // Get user info from Discord
    const userInfoResponse = await fetch('https://discord.com/api/users/@me', {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
      },
    });

    if (!userInfoResponse.ok) {
      return NextResponse.redirect(
        new URL('/UserDashboard/settings?error=user_info_failed', request.url)
      );
    }

    const discordUser = await userInfoResponse.json();

    // Check if Discord ID is already linked to another account
    const existingUser = await User.findOne({ discordId: discordUser.id });
    if (existingUser && existingUser._id.toString() !== user._id.toString()) {
      return NextResponse.redirect(
        new URL('/UserDashboard/settings?error=discord_already_linked', request.url)
      );
    }

    // Link Discord account to user
    user.discordId = discordUser.id;
    user.emailVerified = true;
    user.emailVerifiedAt = new Date();
    if (!user.avatar) {
      user.avatar = discordUser.avatar
        ? `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png`
        : `https://cdn.discordapp.com/embed/avatars/${discordUser.discriminator % 5}.png`;
    }
    await user.save();

    // Attempt to sync pending entitlements to Sentinel
    // This handles the case where a user's payment was approved before they linked Discord
    if (isSentinelConfigured()) {
      try {
        // Find active entitlements that haven't been synced yet
        const pendingEntitlements = await BotEntitlement.find({
          userId: user._id,
          status: 'active',
          sentinelSyncStatus: { $in: ['pending', 'failed'] },
          sentinelEventId: { $exists: true },
        }).populate('paymentId').populate('subscriptionId');

        console.log(`Found ${pendingEntitlements.length} pending entitlements to sync for user ${user._id}`);

        for (const entitlement of pendingEntitlements) {
          const payment = entitlement.paymentId as any;
          const subscription = entitlement.subscriptionId as any;

          if (!payment || !subscription || !entitlement.sentinelEventId) {
            console.log(`Skipping entitlement ${entitlement._id} - missing required data`);
            continue;
          }

          try {
            const payload = {
              event_id: entitlement.sentinelEventId,
              event: 'paid' as const,
              discord_user_id: user.discordId!,
              occurred_at: entitlement.startedAt.toISOString(),
              ref: subscription._id.toString(),
              plan: entitlement.planName,
              amount: payment.amount,
              currency: payment.currency,
              expires_at: entitlement.expiresAt.toISOString(),
            };

            const result = await postEntitlement(payload);

            if (result.success) {
              const updateResult = await BotEntitlement.findByIdAndUpdate(
                entitlement._id,
                {
                  sentinelSyncStatus: 'synced',
                  sentinelSyncedAt: new Date(),
                  sentinelSyncError: undefined,
                  sentinelRetryCount: 0,
                },
                { new: true, runValidators: true }
              );
              if (!updateResult) {
                console.error(`Sentinel: Failed to update entitlement ${entitlement._id} after successful sync`);
              } else {
                console.log(`Sentinel: Successfully synced pending entitlement ${entitlement.sentinelEventId}`);
              }
            } else {
              const updateResult = await BotEntitlement.findByIdAndUpdate(
                entitlement._id,
                {
                  sentinelSyncStatus: 'failed',
                  sentinelSyncError: result.error || 'Unknown error',
                },
                { new: true, runValidators: true }
              );
              if (updateResult) {
                await BotEntitlement.findByIdAndUpdate(entitlement._id, {
                  $inc: { sentinelRetryCount: 1 },
                });
              }
              console.error(`Sentinel: Failed to sync pending entitlement ${entitlement.sentinelEventId}:`, result.error);
            }
          } catch (syncError) {
            const updateResult = await BotEntitlement.findByIdAndUpdate(
              entitlement._id,
              {
                sentinelSyncStatus: 'failed',
                sentinelSyncError: syncError instanceof Error ? syncError.message : 'Unknown error',
              },
              { new: true, runValidators: true }
            );
            if (updateResult) {
              await BotEntitlement.findByIdAndUpdate(entitlement._id, {
                $inc: { sentinelRetryCount: 1 },
              });
            }
            console.error(`Sentinel sync error for entitlement ${entitlement._id}:`, syncError);
          }
        }
      } catch (error) {
        console.error('Error syncing pending entitlements after Discord link:', error);
        // Don't fail the Discord link if sync fails
      }
    }

    // Generate new token and redirect to settings with success
    return NextResponse.redirect(
      new URL('/UserDashboard/settings?success=discord_linked', request.url)
    );

  } catch (error) {
    console.error('Discord link callback error:', error);
    return NextResponse.redirect(
      new URL('/UserDashboard/settings?error=server_error', request.url)
    );
  }
}
