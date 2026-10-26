import { createHmac } from 'crypto';

// Sentinel configuration from environment
const SENTINEL_API_BASE_URL = process.env.SENTINEL_API_BASE_URL;
const SENTINEL_API_KEY = process.env.SENTINEL_API_KEY;
const SENTINEL_WEBHOOK_SECRET = process.env.SENTINEL_WEBHOOK_SECRET;

export interface SentinelEntitlementPayload {
  event_id: string;
  event: 'paid' | 'renewed' | 'paused' | 'cancelled' | 'refunded';
  discord_user_id: string;
  occurred_at: string; // ISO-8601 UTC timestamp
  ref: string;
  plan: string;
  amount?: number;
  currency?: string;
  expires_at?: string; // ISO-8601 UTC timestamp
  discord_server_id?: string;
}

export interface SentinelResponse {
  success?: boolean;
  error?: string;
  message?: string;
  data?: any;
}

/**
 * Validates Sentinel configuration
 */
function validateConfig(): void {
  if (!SENTINEL_API_BASE_URL) {
    throw new Error('SENTINEL_API_BASE_URL is not configured');
  }
  if (!SENTINEL_API_KEY) {
    throw new Error('SENTINEL_API_KEY is not configured');
  }
  if (!SENTINEL_WEBHOOK_SECRET) {
    throw new Error('SENTINEL_WEBHOOK_SECRET is not configured');
  }
}

/**
 * Generates HMAC-SHA256 signature for Sentinel API
 * @param timestamp - Unix timestamp in seconds
 * @param body - Raw JSON string of the request body
 * @returns Hex-encoded signature
 */
function generateSignature(timestamp: number, body: string): string {
  if (!SENTINEL_WEBHOOK_SECRET) {
    throw new Error('SENTINEL_WEBHOOK_SECRET is not configured');
  }

  const message = `${timestamp}.${body}`;
  const hmac = createHmac('sha256', SENTINEL_WEBHOOK_SECRET);
  hmac.update(message);
  return `sha256=${hmac.digest('hex')}`;
}

/**
 * Posts entitlement event to Sentinel API
 * @param payload - Entitlement payload
 * @returns Sentinel API response
 */
export async function postEntitlement(
  payload: SentinelEntitlementPayload
): Promise<SentinelResponse> {
  validateConfig();

  const body = JSON.stringify(payload);
  const timestamp = Math.floor(Date.now() / 1000); // Unix timestamp in seconds
  const signature = generateSignature(timestamp, body);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

  try {
    const response = await fetch(`${SENTINEL_API_BASE_URL}/entitlements`, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        'X-Sentinels-Key': SENTINEL_API_KEY!,
        'X-Sentinels-Timestamp': timestamp.toString(),
        'X-Sentinels-Signature': signature,
      },
      body,
    });

    clearTimeout(timeoutId);

    if (response.status === 409) {
      // Duplicate event - treat as success
      console.log('Sentinel: Duplicate event ID, already processed');
      return { success: true, message: 'Event already processed' };
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Sentinel API error: HTTP ${response.status}`, errorText);
      return { success: false, error: `HTTP ${response.status}: ${errorText}` };
    }

    const data = await response.json();
    return { success: true, message: 'Entitlement synchronized successfully', data };

  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        console.error('Sentinel API request timed out');
        return { success: false, error: 'Request timed out' };
      }
      console.error('Sentinel API request error:', error.message);
      return { success: false, error: error.message };
    }

    console.error('Unknown Sentinel API error:', error);
    return { success: false, error: 'Unknown error' };
  }
}

/**
 * Checks if Sentinel is configured
 */
export function isSentinelConfigured(): boolean {
  return !!(
    SENTINEL_API_BASE_URL &&
    SENTINEL_API_KEY &&
    SENTINEL_WEBHOOK_SECRET
  );
}
