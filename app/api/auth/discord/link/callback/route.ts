import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { User, OAuthState } from '@/models';
import { requireAuth } from '@/lib/auth-helper';

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
