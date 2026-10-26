import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { DiscordServerConnection, BotEntitlement, User } from '@/models';
import { createHmac, timingSafeEqual } from 'crypto';

const SENTINEL_WEBHOOK_SECRET = process.env.SENTINEL_WEBHOOK_SECRET;
const TIMESTAMP_TOLERANCE_SECONDS = 300; // 5 minutes

interface SentinelWebhookPayload {
  event_id: string;
  event: 'server_added' | 'server_removed' | 'paid' | 'renewed' | 'cancelled';
  discord_user_id: string;
  guild_id: string;
  guild_name?: string;
  ref?: string;
  occurred_at: string;
}

/**
 * Verifies Sentinel webhook signature using timing-safe comparison
 */
function verifySignature(timestamp: string, signature: string, body: string): boolean {
  if (!SENTINEL_WEBHOOK_SECRET) {
    console.error('SENTINEL_WEBHOOK_SECRET not configured');
    return false;
  }

  // Validate signature format
  if (!signature.startsWith('sha256=')) {
    console.error('Invalid signature format');
    return false;
  }

  // Validate timestamp is a number
  const timestampNum = parseInt(timestamp, 10);
  if (isNaN(timestampNum)) {
    console.error('Invalid timestamp format');
    return false;
  }

  // Check timestamp is within tolerance window (5 minutes)
  const now = Math.floor(Date.now() / 1000);
  if (Math.abs(now - timestampNum) > TIMESTAMP_TOLERANCE_SECONDS) {
    console.error('Timestamp outside tolerance window');
    return false;
  }

  const message = `${timestamp}.${body}`;
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
    console.error('Error during signature comparison:', error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get signature headers
    const timestamp = request.headers.get('X-Sentinels-Timestamp');
    const signature = request.headers.get('X-Sentinels-Signature');

    if (!timestamp || !signature) {
      console.error('Missing signature headers');
      return NextResponse.json(
        { error: 'Missing signature headers' },
        { status: 401 }
      );
    }

    // Get raw body for signature verification
    const rawBody = await request.text();

    // Verify signature
    if (!verifySignature(timestamp, signature, rawBody)) {
      console.error('Invalid webhook signature');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    const payload: SentinelWebhookPayload = JSON.parse(rawBody);

    // Validate required payload fields
    if (!payload.event_id || !payload.event || !payload.discord_user_id || !payload.guild_id) {
      console.error('Missing required payload fields');
      return NextResponse.json(
        { error: 'Invalid payload' },
        { status: 400 }
      );
    }

    // Validate event type
    const validEvents = ['server_added', 'server_removed', 'paid', 'renewed', 'cancelled'];
    if (!validEvents.includes(payload.event)) {
      console.error(`Invalid event type: ${payload.event}`);
      return NextResponse.json(
        { error: 'Invalid event type' },
        { status: 400 }
      );
    }

    await connectDB();

    // Handle different event types
    if (payload.event === 'server_added') {
      await handleServerAdded(payload);
    } else if (payload.event === 'server_removed') {
      await handleServerRemoved(payload);
    } else {
      // Ignore other events (paid, renewed, cancelled are handled elsewhere)
      console.log(`Ignoring event type: ${payload.event}`);
      return NextResponse.json({ received: true });
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error processing Sentinel webhook:', error);
    return NextResponse.json(
      { error: 'Failed to process webhook' },
      { status: 500 }
    );
  }
}

async function handleServerAdded(payload: SentinelWebhookPayload) {
  const { event_id, discord_user_id, guild_id, guild_name, ref, occurred_at } = payload;

  // Find user by Discord ID
  const user = await User.findOne({ discordId: discord_user_id });
  if (!user) {
    console.log(`User not found for Discord ID: ${discord_user_id}`);
    return;
  }

  // Find entitlement by subscription ref if provided
  let entitlement = null;
  if (ref) {
    entitlement = await BotEntitlement.findOne({
      subscriptionId: ref,
      userId: user._id,
    });
  }

  if (!entitlement) {
    console.log(`Entitlement not found for ref: ${ref}`);
    return;
  }

  // Check if connection already exists
  const existingConnection = await DiscordServerConnection.findOne({
    entitlementId: entitlement._id,
    guildId: guild_id,
  });

  if (existingConnection && existingConnection.status === 'connected') {
    console.log(`Connection already exists for guild ${guild_id}`);
    return;
  }

  // Create or update connection
  await DiscordServerConnection.findOneAndUpdate(
    { entitlementId: entitlement._id, guildId: guild_id },
    {
      userId: user._id,
      entitlementId: entitlement._id,
      subscriptionId: entitlement.subscriptionId,
      discordUserId: discord_user_id,
      guildId: guild_id,
      guildName: guild_name || 'Unknown Server',
      status: 'connected',
      verifiedAt: new Date(occurred_at),
      removedAt: undefined,
    },
    { upsert: true, new: true, runValidators: true }
  );

  console.log(`Server added: ${guild_name} (${guild_id}) for user ${user._id}`);
}

async function handleServerRemoved(payload: SentinelWebhookPayload) {
  const { guild_id, discord_user_id, occurred_at } = payload;

  // Find user by Discord ID
  const user = await User.findOne({ discordId: discord_user_id });
  if (!user) {
    console.log(`User not found for Discord ID: ${discord_user_id}`);
    return;
  }

  // Update connection status to removed
  const connection = await DiscordServerConnection.findOneAndUpdate(
    {
      userId: user._id,
      guildId: guild_id,
      status: 'connected',
    },
    {
      status: 'removed',
      removedAt: new Date(occurred_at),
    },
    { new: true }
  );

  if (connection) {
    console.log(`Server removed: ${guild_id} for user ${user._id}`);
  } else {
    console.log(`No active connection found for guild ${guild_id}`);
  }
}
