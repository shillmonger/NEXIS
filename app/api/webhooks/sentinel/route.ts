import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { DiscordServerConnection, BotEntitlement, User, WebhookEventLog } from '@/models';
import { createHmac, timingSafeEqual } from 'crypto';

const SENTINEL_WEBHOOK_SECRET = process.env.SENTINEL_WEBHOOK_SECRET;
const TIMESTAMP_TOLERANCE_SECONDS = 300; // 5 minutes

/**
 * EVENT_ID ASSUMPTION AND TTL STRATEGY
 * 
 * Assumption: Sentinel provides a stable, unique event_id per webhook delivery.
 * This is not explicitly documented in the provided Sentinel contract.
 * 
 * If event_id is NOT stable (e.g., regenerated on retries), the current idempotency
 * strategy will fail to prevent duplicate processing. In that case, an alternative
 * strategy using (event_type + discord_user_id + guild_id + occurred_at) as a
 * composite key would be needed.
 * 
 * TTL Strategy: 30-day TTL on WebhookEventLog records balances:
 * - Sufficient time for Sentinel's retry window (typically 24-48 hours)
 * - Automatic cleanup to prevent unbounded storage growth
 * - Allows re-processing of truly old events if needed
 * 
 * If Sentinel's retry window exceeds 30 days, the TTL should be increased accordingly.
 */

interface SentinelWebhookPayload {
  event_id: string;
  event: 'server_added' | 'server_removed' | 'server_status' | 'low_balance' | 'balance_empty' | 'daily_usage' | 'paid' | 'renewed' | 'cancelled';
  discord_user_id?: string;
  guild_id?: string;
  guild_name?: string;
  ref?: string;
  occurred_at: string;
  status?: string;
  balance?: number;
  usage?: number;
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

    // Validate required payload fields - event_id, event, and occurred_at are always required
    if (!payload.event_id || !payload.event || !payload.occurred_at) {
      console.error('[Webhook] Missing required payload fields: event_id, event, or occurred_at');
      return NextResponse.json(
        { error: 'Invalid payload' },
        { status: 400 }
      );
    }

    // For server events, validate discord_user_id and guild_id
    if (['server_added', 'server_removed', 'server_status'].includes(payload.event)) {
      if (!payload.discord_user_id || !payload.guild_id) {
        console.error(`[Webhook] Event ${payload.event} missing required fields: discord_user_id or guild_id`);
        return NextResponse.json(
          { error: 'Invalid payload for event type' },
          { status: 400 }
        );
      }
    }

    // Validate event type against documented Sentinel events
    const validEvents = ['server_added', 'server_removed', 'server_status', 'low_balance', 'balance_empty', 'daily_usage', 'paid', 'renewed', 'cancelled'];
    if (!validEvents.includes(payload.event)) {
      console.error(`[Webhook] Invalid event type: ${payload.event}`);
      return NextResponse.json(
        { error: 'Invalid event type' },
        { status: 400 }
      );
    }

    await connectDB();

    // Check for duplicate event using event_id for idempotency
    const existingEvent = await WebhookEventLog.findOne({ eventId: payload.event_id });
    if (existingEvent) {
      console.log(`[Webhook] Duplicate event detected: ${payload.event_id} (${payload.event})`);
      return NextResponse.json({ received: true, message: 'Duplicate event' });
    }

    // Handle different event types and track success
    let processingSuccess = false;
    if (payload.event === 'server_added') {
      processingSuccess = await handleServerAdded(payload);
    } else if (payload.event === 'server_removed') {
      processingSuccess = await handleServerRemoved(payload);
    } else if (payload.event === 'server_status') {
      processingSuccess = await handleServerStatus(payload);
    } else if (['low_balance', 'balance_empty', 'daily_usage'].includes(payload.event)) {
      // Persist unimplemented events for later processing in Step 6
      await WebhookEventLog.create({
        eventId: payload.event_id,
        eventType: payload.event,
      });
      console.log(`[Webhook] Event type ${payload.event} persisted for future processing`);
      return NextResponse.json({ received: true, message: 'Event persisted' });
    } else {
      // Payment events (paid, renewed, cancelled) are handled elsewhere
      console.log(`[Webhook] Ignoring event type: ${payload.event}`);
      return NextResponse.json({ received: true });
    }

    // Only log as processed if handling succeeded
    if (processingSuccess) {
      await WebhookEventLog.create({
        eventId: payload.event_id,
        eventType: payload.event,
      });
      return NextResponse.json({ received: true });
    } else {
      // Processing failed - return 500 so Sentinel can retry
      console.error(`[Webhook] Event processing failed: ${payload.event_id} (${payload.event})`);
      return NextResponse.json(
        { error: 'Event processing failed' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error processing Sentinel webhook:', error);
    return NextResponse.json(
      { error: 'Failed to process webhook' },
      { status: 500 }
    );
  }
}

async function handleServerAdded(payload: SentinelWebhookPayload): Promise<boolean> {
  const { event_id, discord_user_id, guild_id, guild_name, ref, occurred_at } = payload;

  if (!discord_user_id || !guild_id) {
    console.error('[Webhook] server_added missing required fields: discord_user_id or guild_id');
    return false;
  }

  // Find user by Discord ID
  const user = await User.findOne({ discordId: discord_user_id });
  if (!user) {
    console.log(`[Webhook] User not found for Discord ID: ${discord_user_id}`);
    return false;
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
    console.log(`[Webhook] Entitlement not found for ref: ${ref} and user: ${user._id}`);
    return false;
  }

  // Check if connection already exists and is connected
  const existingConnection = await DiscordServerConnection.findOne({
    entitlementId: entitlement._id,
    guildId: guild_id,
  });

  if (existingConnection && existingConnection.status === 'connected') {
    console.log(`[Webhook] Connection already exists for guild ${guild_id}, entitlement ${entitlement._id}`);
    return true; // Already in desired state, consider success
  }

  // If connection exists but was removed, check event ordering
  if (existingConnection && existingConnection.status === 'removed') {
    const eventTime = new Date(occurred_at);
    const removedTime = existingConnection.removedAt;
    
    // Only reconnect if the add event is newer than the removal
    if (removedTime && eventTime <= removedTime) {
      console.log(`[Webhook] Ignoring stale server_added event for guild ${guild_id} (event time ${occurred_at} <= removal time ${removedTime.toISOString()})`);
      return true; // Stale event, but not an error
    }
  }

  // Create or update connection
  try {
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

    console.log(`[Webhook] Server added: ${guild_name} (${guild_id}) for user ${user._id}, entitlement ${entitlement._id}`);
    return true;
  } catch (error) {
    console.error(`[Webhook] Database error updating connection for guild ${guild_id}:`, error);
    return false;
  }
}

async function handleServerRemoved(payload: SentinelWebhookPayload): Promise<boolean> {
  const { guild_id, discord_user_id, occurred_at } = payload;

  if (!discord_user_id || !guild_id) {
    console.error('[Webhook] server_removed missing required fields: discord_user_id or guild_id');
    return false;
  }

  // Find user by Discord ID
  const user = await User.findOne({ discordId: discord_user_id });
  if (!user) {
    console.log(`[Webhook] User not found for Discord ID: ${discord_user_id}`);
    return false;
  }

  // Update connection status to removed
  try {
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
      console.log(`[Webhook] Server removed: ${guild_id} for user ${user._id}`);
      return true;
    } else {
      console.log(`[Webhook] No active connection found for guild ${guild_id}, user ${user._id}`);
      return true; // Not an error - connection may already be removed or never existed
    }
  } catch (error) {
    console.error(`[Webhook] Database error updating connection for guild ${guild_id}:`, error);
    return false;
  }
}

async function handleServerStatus(payload: SentinelWebhookPayload): Promise<boolean> {
  const { guild_id, discord_user_id, status, occurred_at } = payload;

  if (!discord_user_id || !guild_id) {
    console.error('[Webhook] server_status missing required fields: discord_user_id or guild_id');
    return false;
  }

  if (!status) {
    console.error('[Webhook] server_status missing status field');
    return false;
  }

  // Map Sentinel status to our status enum if recognized
  const statusMap: Record<string, 'connected' | 'removed'> = {
    'active': 'connected',
    'connected': 'connected',
  };

  const mappedStatus = statusMap[status.toLowerCase()];
  if (!mappedStatus) {
    console.log(`[Webhook] Unrecognized server_status value: ${status} for guild ${guild_id} - ignoring`);
    return true; // Not an error - just ignore unknown status values
  }

  // Find user by Discord ID
  const user = await User.findOne({ discordId: discord_user_id });
  if (!user) {
    console.log(`[Webhook] User not found for Discord ID: ${discord_user_id}`);
    return false;
  }

  // Update connection status
  try {
    const connection = await DiscordServerConnection.findOneAndUpdate(
      {
        userId: user._id,
        guildId: guild_id,
      },
      {
        status: mappedStatus,
        ...(mappedStatus === 'connected' ? { verifiedAt: new Date(occurred_at), removedAt: undefined } : {}),
      },
      { new: true }
    );

    if (connection) {
      console.log(`[Webhook] Server status updated: ${guild_id} -> ${mappedStatus} for user ${user._id}`);
      return true;
    } else {
      console.log(`[Webhook] No connection found for guild ${guild_id}, user ${user._id}`);
      return true; // Not an error - connection may not exist
    }
  } catch (error) {
    console.error(`[Webhook] Database error updating connection for guild ${guild_id}:`, error);
    return false;
  }
}
