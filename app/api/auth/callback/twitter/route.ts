import { NextRequest, NextResponse } from 'next/server';
import OAuth from 'oauth-1.0a';
import crypto from 'crypto';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { generateToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const oauthToken = searchParams.get('oauth_token');
    const oauthVerifier = searchParams.get('oauth_verifier');
    const denied = searchParams.get('denied');

    if (denied) {
      return NextResponse.redirect(
        new URL(`/auth-page/login?error=twitter_denied`, request.url)
      );
    }

    if (!oauthToken || !oauthVerifier) {
      return NextResponse.redirect(
        new URL('/auth-page/login?error=twitter_callback_error', request.url)
      );
    }

    const oauthTokenSecret = request.cookies.get('twitter_oauth_token_secret')?.value;

    if (!oauthTokenSecret) {
      return NextResponse.redirect(
        new URL('/auth-page/login?error=twitter_session_expired', request.url)
      );
    }

    const oauth = new OAuth({
      consumer: {
        key: process.env.TWITTER_CONSUMER_KEY!,
        secret: process.env.TWITTER_CONSUMER_SECRET!,
      },
      signature_method: 'HMAC-SHA1',
      hash_function: (base_string, key) => {
        return crypto
          .createHmac('sha1', key)
          .update(base_string)
          .digest('base64');
      },
    });

    // Exchange request token for access token
    const oauthTokenObj = {
      key: oauthToken,
      secret: oauthTokenSecret,
    };

    const request_data = {
      url: 'https://api.twitter.com/oauth/access_token',
      method: 'POST',
      data: {
        oauth_verifier: oauthVerifier,
      },
    };

    const headers = oauth.toHeader(oauth.authorize(request_data, oauthTokenObj));

    const response = await fetch(request_data.url, {
      method: request_data.method,
      headers: {
        ...headers,
        'Content-Type': 'application/x-www-form-urlencoded',
      } as unknown as HeadersInit,
      body: new URLSearchParams(request_data.data).toString(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Twitter access token error:', errorText);
      return NextResponse.redirect(
        new URL('/auth-page/login?error=twitter_access_token_failed', request.url)
      );
    }

    const body = await response.text();
    const params = new URLSearchParams(body);
    const accessToken = params.get('oauth_token');
    const accessTokenSecret = params.get('oauth_token_secret');
    const userId = params.get('user_id');
    const screenName = params.get('screen_name');

    if (!accessToken || !accessTokenSecret || !userId || !screenName) {
      return NextResponse.redirect(
        new URL('/auth-page/login?error=twitter_invalid_response', request.url)
      );
    }

    // Get user info from Twitter using API v2
    const verifyRequest = {
      url: 'https://api.twitter.com/2/users/me?user.fields=profile_image_url,username',
      method: 'GET',
    };

    const verifyHeaders = oauth.toHeader(oauth.authorize(verifyRequest, oauthTokenObj));

    const verifyResponse = await fetch(verifyRequest.url, {
      method: verifyRequest.method,
      headers: verifyHeaders as unknown as HeadersInit,
    });

    let twitterUser = null;
    let email = '';
    let avatar = '';

    if (verifyResponse.ok) {
      const data = await verifyResponse.json();
      twitterUser = data.data;
      avatar = twitterUser?.profile_image_url?.replace('_normal', '_400x400') || '';
      console.log('Twitter user data:', data);
    } else {
      // Fallback to v1.1 API
      const v1Request = {
        url: 'https://api.twitter.com/1.1/account/verify_credentials.json',
        method: 'GET',
        data: {
          include_email: 'true',
        },
      };

      const v1Headers = oauth.toHeader(oauth.authorize(v1Request, oauthTokenObj));

      const v1Response = await fetch(v1Request.url, {
        method: v1Request.method,
        headers: v1Headers as unknown as HeadersInit,
      });

      if (v1Response.ok) {
        twitterUser = await v1Response.json();
        email = twitterUser.email || '';
        avatar = twitterUser.profile_image_url_https?.replace('_normal', '_400x400') || '';
        console.log('Twitter v1 user data:', twitterUser);
      } else {
        const errorText = await v1Response.text();
        console.error('Twitter verify credentials error (v1):', errorText);
      }
    }

    // If no avatar from API, construct it from screenName
    if (!avatar && screenName) {
      avatar = `https://unavatar.io/twitter/${screenName}`;
    }

    // Connect to database
    await connectDB();

    // Check if user exists by Twitter ID
    let user = await User.findOne({ twitterId: userId });

    if (!user) {
      // Check if user exists by email (if available)
      if (email) {
        user = await User.findOne({ email: email.toLowerCase() });

        if (user) {
          // Link Twitter account to existing user
          user.twitterId = userId;
          user.provider = 'twitter';
          user.emailVerified = true;
          user.emailVerifiedAt = new Date();
          if (!user.avatar && avatar) {
            user.avatar = avatar;
          }
          await user.save();
        }
      }

      if (!user) {
        // Create new user
        const username = screenName?.replace(/[^a-zA-Z0-9]/g, '').toLowerCase() || `twitter_${userId}`;

        // Check if username exists, if so append random number
        let finalUsername = username;
        let counter = 1;
        while (await User.findOne({ userName: finalUsername })) {
          finalUsername = `${username}${counter}`;
          counter++;
        }

        user = await User.create({
          userName: finalUsername,
          email: email || `${finalUsername}@twitter`,
          twitterId: userId,
          provider: 'twitter',
          emailVerified: !!email,
          emailVerifiedAt: email ? new Date() : undefined,
          avatar: avatar || 'https://github.com/shadcn.png',
          role: 'user',
          status: 'active',
          agreedToTerms: true,
          lastLoginAt: new Date(),
        });
      }
    } else {
      // Update last login
      user.lastLoginAt = new Date();
      await user.save();
    }

    // Generate JWT token
    const jwtToken = generateToken(user._id.toString(), user.email);

    // Create response and set cookie
    const redirectResponse = NextResponse.redirect(
      new URL('/UserDashboard/dashboard', request.url)
    );

    redirectResponse.cookies.set('auth-token', jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    // Clear the temporary cookie
    redirectResponse.cookies.delete('twitter_oauth_token_secret');

    return redirectResponse;

  } catch (error) {
    console.error('Twitter OAuth callback error:', error);
    return NextResponse.redirect(
      new URL('/auth-page/login?error=server_error', request.url)
    );
  }
}
