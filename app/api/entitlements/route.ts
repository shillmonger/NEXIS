import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { BotEntitlement, User } from '@/models';
import { createHmac, timingSafeEqual } from 'crypto';

const SENTINEL_WEBHOOK_SECRET = process.env.SENTINEL_WEBHOOK_SECRET;
const TIMESTAMP_TOLERANCE_SECONDS = 300; // 5 minutes

/**
 * Verifies Sentinel request signature using timing-safe comparison
 * Uses the same mechanism as the webhook for consistency
 */
function verifySignature(timestamp: string, signature: string): boolean {
  if (!SENTINEL_WEBHOOK_SECRET) {
    console.error('[Entitlements] SENTINEL_WEBHOOK_SECRET not configured');
    return false;
  }

  // Validate signature format
  if (!signature.startsWith('sha256=')) {
    console.error('[Entitlements] Invalid signature format');
    return false;
  }

  // Validate timestamp is a number
  const timestampNum = parseInt(timestamp, 10);
  if (isNaN(timestampNum)) {
    console.error('[Entitlements] Invalid timestamp format');
    return false;
  }

  // Check timestamp is within tolerance window (5 minutes)
  const now = Math.floor(Date.now() / 1000);
  if (Math.abs(now - timestampNum) > TIMESTAMP_TOLERANCE_SECONDS) {
    console.error('[Entitlements] Timestamp outside tolerance window');
    return false;
  }

  // For GET requests, we sign the query string
  const message = `${timestamp}`;
  const hmac = createHmac('sha256', SENTINEL_WEBHOOK_SECRET);
  hmac.update(message);
  const expectedSignature = `sha256=${hmac.digest('hex')}`;

  // Use timing-safe comparison to prevent timing attacks
  try {
    const signatureBuffer = Buffer.from(signature);
    const expectedBuffer = Buffer.from(expectedSignature);

    if (signatureBuffer.length !== expectedBuffer.length) {
      return false;
    }

    return timingSafeEqual(signatureBuffer, expectedBuffer);
  } catch (error) {
    console.error('[Entitlements] Error during signature comparison:', error);
    return false;
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get signature headers for authentication
    const timestamp = request.headers.get('X-Sentinels-Timestamp');
    const signature = request.headers.get('X-Sentinels-Signature');

    if (!timestamp || !signature) {
      console.error('[Entitlements] Missing signature headers');
      return NextResponse.json(
        { error: 'Missing authentication headers' },
        { status: 401 }
      );
    }

    // Verify signature
    if (!verifySignature(timestamp, signature)) {
      console.error('[Entitlements] Invalid signature');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    // Get discord_user_id from query parameters
    const searchParams = request.nextUrl.searchParams;
    const discordUserId = searchParams.get('discord_user_id');

    if (!discordUserId) {
      console.error('[Entitlements] Missing discord_user_id parameter');
      return NextResponse.json(
        { error: 'discord_user_id is required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Find user by Discord ID
    const user = await User.findOne({ discordId: discordUserId });
    if (!user) {
      console.log(`[Entitlements] User not found for Discord ID: ${discordUserId}`);
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Find active entitlement for the user
    const now = new Date();
    const entitlement = await BotEntitlement.findOne({
      userId: user._id,
      status: 'active',
      expiresAt: { $gte: now },
    }).sort({ expiresAt: -1 }); // Get the most recently expiring active entitlement

    if (!entitlement) {
      console.log(`[Entitlements] No active entitlement found for user ${user._id}`);
      return NextResponse.json(
        { error: 'No active entitlement found' },
        { status: 404 }
      );
    }

    // Map plan name to match Sentinel's expected format
    // BotEntitlement stores: 'Basic', 'Growth', 'Pro', 'Enterprise'
    // Sentinel expects same values
    const plan = entitlement.planName;

    // Return in Sentinel's expected format
    return NextResponse.json({
      status: 'active',
      plan: plan,
      expires_at: entitlement.expiresAt.toISOString(),
    });

  } catch (error) {
    console.error('[Entitlements] Error fetching entitlement:', error);
    return NextResponse.json(
      { error: 'Failed to fetch entitlement' },
      { status: 500 }
    );
  }
}
