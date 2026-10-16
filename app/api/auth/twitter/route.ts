import { NextRequest, NextResponse } from 'next/server';
import OAuth from 'oauth-1.0a';
import crypto from 'crypto';

export async function GET(request: NextRequest) {
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

  const callbackUrl = process.env.TWITTER_CALLBACK_URL || `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/auth/callback/twitter`;

  const request_data = {
    url: 'https://api.twitter.com/oauth/request_token',
    method: 'POST',
    data: {
      oauth_callback: callbackUrl,
    },
  };

  const headers = oauth.toHeader(oauth.authorize(request_data));

  try {
    const response = await fetch(request_data.url, {
      method: request_data.method,
      headers: {
        ...headers,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(request_data.data).toString(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Twitter request token error:', errorText);
      return NextResponse.json(
        { error: 'Failed to get request token from Twitter' },
        { status: 500 }
      );
    }

    const body = await response.text();
    const params = new URLSearchParams(body);
    const oauthToken = params.get('oauth_token');
    const oauthTokenSecret = params.get('oauth_token_secret');

    if (!oauthToken || !oauthTokenSecret) {
      return NextResponse.json(
        { error: 'Invalid response from Twitter' },
        { status: 500 }
      );
    }

    // Store the token secret in a cookie for the callback
    const authResponse = NextResponse.redirect(
      `https://api.twitter.com/oauth/authorize?oauth_token=${oauthToken}`
    );

    authResponse.cookies.set('twitter_oauth_token_secret', oauthTokenSecret, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 10, // 10 minutes
      path: '/',
    });

    return authResponse;
  } catch (error) {
    console.error('Twitter OAuth error:', error);
    return NextResponse.json(
      { error: 'An error occurred during Twitter OAuth' },
      { status: 500 }
    );
  }
}
