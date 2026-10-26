import { describe, it, expect, beforeEach, vi } from 'vitest';
import { NextRequest } from 'next/server';

// Set environment variable before importing the route
process.env.SENTINEL_WEBHOOK_SECRET = 'test-secret-key';

// Mock the database and dependencies
vi.mock('@/lib/db', () => ({
  __esModule: true,
  default: vi.fn().mockResolvedValue({}),
}));

vi.mock('@/models', () => ({
  User: {
    findOne: vi.fn(),
  },
  BotEntitlement: {
    findOne: vi.fn(),
  },
}));

describe('GET /api/entitlements', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return 401 if signature headers are missing', async () => {
    const { GET } = await import('./route');
    const request = new NextRequest('http://localhost:3000/api/entitlements?discord_user_id=123');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe('Missing authentication headers');
  });

  it('should return 401 if signature is invalid', async () => {
    const { GET } = await import('./route');
    const request = new NextRequest(
      'http://localhost:3000/api/entitlements?discord_user_id=123'
    );
    request.headers.set('X-Sentinels-Timestamp', Math.floor(Date.now() / 1000).toString());
    request.headers.set('X-Sentinels-Signature', 'invalid-signature');

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe('Invalid signature');
  });

  it('should return 400 if discord_user_id is missing', async () => {
    const { GET } = await import('./route');
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const hmac = require('crypto').createHmac('sha256', 'test-secret-key');
    hmac.update(timestamp);
    const signature = `sha256=${hmac.digest('hex')}`;

    const request = new NextRequest('http://localhost:3000/api/entitlements');
    request.headers.set('X-Sentinels-Timestamp', timestamp);
    request.headers.set('X-Sentinels-Signature', signature);

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('discord_user_id is required');
  });

  it('should return 404 if user not found', async () => {
    const { User } = await import('@/models');
    vi.mocked(User.findOne).mockResolvedValue(null);

    const { GET } = await import('./route');
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const hmac = require('crypto').createHmac('sha256', 'test-secret-key');
    hmac.update(timestamp);
    const signature = `sha256=${hmac.digest('hex')}`;

    const request = new NextRequest(
      'http://localhost:3000/api/entitlements?discord_user_id=123456789'
    );
    request.headers.set('X-Sentinels-Timestamp', timestamp);
    request.headers.set('X-Sentinels-Signature', signature);

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toBe('User not found');
  });

  it('should return 404 if no active entitlement found', async () => {
    const { User, BotEntitlement } = await import('@/models');

    vi.mocked(User.findOne).mockResolvedValue({
      _id: 'user123',
      discordId: '123456789',
    });

    const mockQuery = {
      sort: vi.fn().mockResolvedValue(null),
    };
    vi.mocked(BotEntitlement.findOne).mockReturnValue(mockQuery as any);

    const { GET } = await import('./route');
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const hmac = require('crypto').createHmac('sha256', 'test-secret-key');
    hmac.update(timestamp);
    const signature = `sha256=${hmac.digest('hex')}`;

    const request = new NextRequest(
      'http://localhost:3000/api/entitlements?discord_user_id=123456789'
    );
    request.headers.set('X-Sentinels-Timestamp', timestamp);
    request.headers.set('X-Sentinels-Signature', signature);

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toBe('No active entitlement found');
  });

  it('should return entitlement data for valid user with active entitlement', async () => {
    const { User, BotEntitlement } = await import('@/models');

    const mockUser = {
      _id: 'user123',
      discordId: '123456789',
    };

    const mockEntitlement = {
      planName: 'Growth',
      expiresAt: new Date('2026-11-26T14:22:50.999Z'),
    };

    vi.mocked(User.findOne).mockResolvedValue(mockUser);

    const mockQuery = {
      sort: vi.fn().mockResolvedValue(mockEntitlement),
    };
    vi.mocked(BotEntitlement.findOne).mockReturnValue(mockQuery as any);

    const { GET } = await import('./route');
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const hmac = require('crypto').createHmac('sha256', 'test-secret-key');
    hmac.update(timestamp);
    const signature = `sha256=${hmac.digest('hex')}`;

    const request = new NextRequest(
      'http://localhost:3000/api/entitlements?discord_user_id=123456789'
    );
    request.headers.set('X-Sentinels-Timestamp', timestamp);
    request.headers.set('X-Sentinels-Signature', signature);

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.status).toBe('active');
    expect(data.plan).toBe('Growth');
    expect(data.expires_at).toBe('2026-11-26T14:22:50.999Z');
  });

  it('should handle expired entitlements by returning 404', async () => {
    const { User, BotEntitlement } = await import('@/models');

    vi.mocked(User.findOne).mockResolvedValue({
      _id: 'user123',
      discordId: '123456789',
    });

    // Simulate MongoDB query not finding any active entitlements
    const mockQuery = {
      sort: vi.fn().mockResolvedValue(null),
    };
    vi.mocked(BotEntitlement.findOne).mockReturnValue(mockQuery as any);

    const { GET } = await import('./route');
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const hmac = require('crypto').createHmac('sha256', 'test-secret-key');
    hmac.update(timestamp);
    const signature = `sha256=${hmac.digest('hex')}`;

    const request = new NextRequest(
      'http://localhost:3000/api/entitlements?discord_user_id=123456789'
    );
    request.headers.set('X-Sentinels-Timestamp', timestamp);
    request.headers.set('X-Sentinels-Signature', signature);

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toBe('No active entitlement found');
  });

  it('should reject timestamps outside tolerance window', async () => {
    const { GET } = await import('./route');
    const oldTimestamp = Math.floor(Date.now() / 1000) - 600; // 10 minutes ago
    const hmac = require('crypto').createHmac('sha256', 'test-secret-key');
    hmac.update(oldTimestamp.toString());
    const signature = `sha256=${hmac.digest('hex')}`;

    const request = new NextRequest(
      'http://localhost:3000/api/entitlements?discord_user_id=123456789'
    );
    request.headers.set('X-Sentinels-Timestamp', oldTimestamp.toString());
    request.headers.set('X-Sentinels-Signature', signature);

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe('Invalid signature');
  });
});
