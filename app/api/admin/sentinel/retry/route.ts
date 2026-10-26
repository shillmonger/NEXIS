import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { BotEntitlement, User } from '@/models';
import { requireAuth } from '@/lib/auth-helper';
import { postEntitlement, isSentinelConfigured } from '@/lib/sentinel';

export async function POST(request: NextRequest) {
  try {
    // Authenticate and verify admin role
    const admin = await requireAuth();
    if (admin.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    if (!isSentinelConfigured()) {
      return NextResponse.json(
        { error: 'Sentinel is not configured' },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { entitlementId, userId } = body;

    await connectDB();

    let entitlements;

    // Retry specific entitlement or all failed entitlements for a user
    if (entitlementId) {
      entitlements = await BotEntitlement.findById(entitlementId).populate('paymentId').populate('subscriptionId');
      if (!entitlements) {
        return NextResponse.json(
          { error: 'Entitlement not found' },
          { status: 404 }
        );
      }
      entitlements = [entitlements];
    } else if (userId) {
      const user = await User.findById(userId);
      if (!user) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }
      entitlements = await BotEntitlement.find({
        userId: user._id,
        status: 'active',
        sentinelSyncStatus: { $in: ['pending', 'failed'] },
        sentinelEventId: { $exists: true },
        sentinelRetryCount: { $lt: 5 }, // Limit retries to 5
      }).populate('paymentId').populate('subscriptionId');
    } else {
      return NextResponse.json(
        { error: 'Either entitlementId or userId is required' },
        { status: 400 }
      );
    }

    const results = [];

    for (const entitlement of entitlements) {
      const payment = entitlement.paymentId as any;
      const subscription = entitlement.subscriptionId as any;

      if (!payment || !subscription || !entitlement.sentinelEventId) {
        results.push({
          entitlementId: entitlement._id,
          status: 'skipped',
          reason: 'Missing required data',
        });
        continue;
      }

      // Check retry limit
      if (entitlement.sentinelRetryCount && entitlement.sentinelRetryCount >= 5) {
        results.push({
          entitlementId: entitlement._id,
          status: 'skipped',
          reason: 'Retry limit exceeded',
        });
        continue;
      }

      try {
        const user = await User.findById(entitlement.userId);
        if (!user || !user.discordId) {
          results.push({
            entitlementId: entitlement._id,
            status: 'skipped',
            reason: 'User or Discord ID not found',
          });
          continue;
        }

        const payload = {
          event_id: entitlement.sentinelEventId,
          event: 'paid' as const,
          discord_user_id: user.discordId,
          occurred_at: entitlement.startedAt.toISOString(),
          ref: subscription._id.toString(),
          plan: entitlement.planName,
          amount: payment.amount,
          currency: payment.currency,
          expires_at: entitlement.expiresAt.toISOString(),
        };

        const result = await postEntitlement(payload);

        if (result.success) {
          await BotEntitlement.findByIdAndUpdate(entitlement._id, {
            sentinelSyncStatus: 'synced',
            sentinelSyncedAt: new Date(),
            sentinelSyncError: undefined,
            sentinelRetryCount: 0,
          });
          results.push({
            entitlementId: entitlement._id,
            status: 'success',
            message: result.message,
          });
        } else {
          await BotEntitlement.findByIdAndUpdate(entitlement._id, {
            sentinelSyncStatus: 'failed',
            sentinelSyncError: result.error || 'Unknown error',
            $inc: { sentinelRetryCount: 1 },
          });
          results.push({
            entitlementId: entitlement._id,
            status: 'failed',
            error: result.error,
          });
        }
      } catch (syncError) {
        await BotEntitlement.findByIdAndUpdate(entitlement._id, {
          sentinelSyncStatus: 'failed',
          sentinelSyncError: syncError instanceof Error ? syncError.message : 'Unknown error',
          $inc: { sentinelRetryCount: 1 },
        });
        results.push({
          entitlementId: entitlement._id,
          status: 'failed',
          error: syncError instanceof Error ? syncError.message : 'Unknown error',
        });
      }
    }

    return NextResponse.json({
      message: 'Retry completed',
      results,
    });
  } catch (error) {
    console.error('Error in Sentinel retry endpoint:', error);

    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to retry synchronization' },
      { status: 500 }
    );
  }
}
