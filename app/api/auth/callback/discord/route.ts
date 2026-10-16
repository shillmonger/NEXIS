import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { generateToken } from '@/lib/auth';
import { sendEmail, getWelcomeEmail } from '@/lib/email';
import { getAppUrl } from '@/lib/config';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    if (error) {
      return NextResponse.redirect(
        new URL(`/auth-page/login?error=${encodeURIComponent(error)}`, request.url)
      );
    }

    if (!code) {
      return NextResponse.redirect(
        new URL('/auth-page/login?error=no_code', request.url)
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
        redirect_uri: process.env.DISCORD_CALLBACK_URL!,
        grant_type: 'authorization_code',
      }),
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('Token exchange failed:', errorText);
      return NextResponse.redirect(
        new URL('/auth-page/login?error=token_exchange_failed', request.url)
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
        new URL('/auth-page/login?error=user_info_failed', request.url)
      );
    }

    const discordUser = await userInfoResponse.json();

    // Connect to database
    await connectDB();

    // Check if user exists by Discord ID
    let user = await User.findOne({ discordId: discordUser.id });

    if (!user) {
      // Check if user exists by email
      user = await User.findOne({ email: discordUser.email.toLowerCase() });

      if (user) {
        // Link Discord account to existing user
        user.discordId = discordUser.id;
        user.provider = 'discord';
        user.emailVerified = true;
        user.emailVerifiedAt = new Date();
        if (!user.avatar) {
          user.avatar = discordUser.avatar
            ? `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png`
            : `https://cdn.discordapp.com/embed/avatars/${discordUser.discriminator % 5}.png`;
        }
        await user.save();
      } else {
        // Create new user
        const username = discordUser.username?.replace(/\s+/g, '').toLowerCase() || `user_${Date.now()}`;

        // Check if username exists, if so append random number
        let finalUsername = username;
        let counter = 1;
        while (await User.findOne({ userName: finalUsername })) {
          finalUsername = `${username}${counter}`;
          counter++;
        }

        user = await User.create({
          userName: finalUsername,
          email: discordUser.email.toLowerCase(),
          discordId: discordUser.id,
          provider: 'discord',
          emailVerified: true,
          emailVerifiedAt: new Date(),
          avatar: discordUser.avatar
            ? `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png`
            : `https://cdn.discordapp.com/embed/avatars/${discordUser.discriminator % 5}.png`,
          role: 'user',
          status: 'active',
          agreedToTerms: true,
          lastLoginAt: new Date(),
        });

        // Send welcome email for new Discord users
        const appUrl = getAppUrl();
        const dashboardUrl = `${appUrl}/UserDashboard/dashboard`;
        const emailSent = await sendEmail(
          discordUser.email,
          'Welcome to NEXIS! Your Account is Ready',
          getWelcomeEmail(finalUsername, dashboardUrl)
        );

        if (!emailSent) {
          console.error('Failed to send welcome email to:', discordUser.email);
        }
      }
    } else {
      // Update last login
      user.lastLoginAt = new Date();
      await user.save();
    }

    // Generate JWT token
    const token = generateToken(user._id.toString(), user.email);

    // Create response and set cookie
    const response = NextResponse.redirect(
      new URL('/UserDashboard/dashboard', request.url)
    );

    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return response;

  } catch (error) {
    console.error('Discord OAuth callback error:', error);
    return NextResponse.redirect(
      new URL('/auth-page/login?error=server_error', request.url)
    );
  }
}
