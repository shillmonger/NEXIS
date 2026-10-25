import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-helper';
import { OAuthState } from '@/models';
import connectDB from '@/lib/db';
import { randomBytes } from 'crypto';

export async function GET(request: NextRequest) {
  try {
    // Authenticate user - must be logged in to link Discord
    const user = await requireAuth();

    // Check if already has Discord linked
    if (user.discordId) {
      return NextResponse.json(
        { error: 'Discord account already linked' },
        { status: 400 }
      );
    }

    await connectDB();

    // Generate OAuth state for link operation
    const state = randomBytes(32).toString('hex');
    const codeVerifier = randomBytes(32).toString('base64url');
    const codeChallenge = Buffer.from(codeVerifier)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    // Store OAuth state in database
    await OAuthState.create({
      userId: user._id,
      state,
      codeVerifier,
      codeChallenge,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
    });

    // Construct Discord OAuth URL for linking
    const discordAuthUrl = 'https://discord.com/api/oauth2/authorize';
    const params = new URLSearchParams({
      client_id: process.env.DISCORD_CLIENT_ID!,
      redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/auth/discord/link/callback`,
      response_type: 'code',
      scope: 'identify email',
      state,
      code_challenge: codeChallenge,
      code_challenge_method: 'S256',
    });

    return NextResponse.redirect(`${discordAuthUrl}?${params.toString()}`);

  } catch (error) {
    console.error('Discord link initiation error:', error);
    
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to initiate Discord linking' },
      { status: 500 }
    );
  }
}
