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
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/auth/google/callback`,
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

    // Get user info from Google
    const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
      },
    });

    if (!userInfoResponse.ok) {
      return NextResponse.redirect(
        new URL('/auth-page/login?error=user_info_failed', request.url)
      );
    }

    const googleUser = await userInfoResponse.json();

    // Connect to database
    await connectDB();

    // Check if user exists by Google ID
    let user = await User.findOne({ googleId: googleUser.id });

    if (!user) {
      // Check if user exists by email
      user = await User.findOne({ email: googleUser.email.toLowerCase() });

      if (user) {
        // Link Google account to existing user
        user.googleId = googleUser.id;
        user.provider = 'google';
        user.emailVerified = true;
        user.emailVerifiedAt = new Date();
        if (!user.avatar) {
          user.avatar = googleUser.picture;
        }
        await user.save();
      } else {
        // Create new user
        const username = googleUser.name?.replace(/\s+/g, '').toLowerCase() || `user_${Date.now()}`;

        // Check if username exists, if so append random number
        let finalUsername = username;
        let counter = 1;
        while (await User.findOne({ userName: finalUsername })) {
          finalUsername = `${username}${counter}`;
          counter++;
        }

        user = await User.create({
          userName: finalUsername,
          email: googleUser.email.toLowerCase(),
          googleId: googleUser.id,
          provider: 'google',
          emailVerified: true,
          emailVerifiedAt: new Date(),
          avatar: googleUser.picture,
          role: 'user',
          status: 'active',
          agreedToTerms: true,
          lastLoginAt: new Date(),
        });

        // Send welcome email for new Google users
        const appUrl = getAppUrl();
        const dashboardUrl = `${appUrl}/UserDashboard/dashboard`;
        const emailSent = await sendEmail({
          to: googleUser.email,
          subject: 'Welcome to NEXIS! Your Account is Ready',
          html: getWelcomeEmail(finalUsername, dashboardUrl)
        });

        if (!emailSent) {
          console.error('Failed to send welcome email to:', googleUser.email);
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

    // Set last login method cookie
    response.cookies.set('last-login-method', 'google', {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
    });

    return response;

  } catch (error) {
    console.error('Google OAuth callback error:', error);
    return NextResponse.redirect(
      new URL('/auth-page/login?error=server_error', request.url)
    );
  }
}
