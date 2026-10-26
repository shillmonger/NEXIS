import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Payment, Subscription, BotEntitlement, User } from '@/models';
import { requireAuth } from '@/lib/auth-helper';
import { sendPaymentApprovedEmail } from '@/lib/emails';
import { postEntitlement, isSentinelConfigured } from '@/lib/sentinel';
import { randomUUID } from 'crypto';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ paymentId: string }> }
) {
  try {
    // Authenticate and verify admin role
    const admin = await requireAuth();
    if (admin.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const { paymentId } = await params;

    await connectDB();

    // Start a session for transaction
    const session = await Payment.startSession();

    try {
      session.startTransaction();

      // Fetch payment with subscription
      const payment = await Payment.findById(paymentId).session(session);
      if (!payment) {
        await session.abortTransaction();
        return NextResponse.json(
          { error: 'Payment not found' },
          { status: 404 }
        );
      }

      // Check if already processed
      if (payment.status !== 'pending') {
        await session.abortTransaction();
        return NextResponse.json(
          { error: 'Payment has already been processed' },
          { status: 400 }
        );
      }

      // Fetch subscription
      const subscription = await Subscription.findById(payment.subscriptionId).session(session);
      if (!subscription) {
        await session.abortTransaction();
        return NextResponse.json(
          { error: 'Subscription not found' },
          { status: 404 }
        );
      }

      // Fetch user to check for Discord ID
      const user = await User.findById(payment.userId).session(session);
      if (!user) {
        await session.abortTransaction();
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }

      // Check if entitlement already exists
      const existingEntitlement = await BotEntitlement.findOne({
        subscriptionId: subscription._id,
      }).session(session);

      if (existingEntitlement) {
        await session.abortTransaction();
        return NextResponse.json(
          { error: 'Entitlement already exists for this subscription' },
          { status: 400 }
        );
      }

      // Calculate expiration date based on billing period
      const startedAt = new Date();
      const expiresAt = new Date(startedAt);

      switch (subscription.billingPeriod.toLowerCase()) {
        case 'monthly':
        case 'month':
          expiresAt.setMonth(expiresAt.getMonth() + 1);
          break;
        case 'quarterly':
        case '3 months':
          expiresAt.setMonth(expiresAt.getMonth() + 3);
          break;
        case 'yearly':
        case 'annual':
        case 'year':
          expiresAt.setFullYear(expiresAt.getFullYear() + 1);
          break;
        default:
          // Default to 1 month
          expiresAt.setMonth(expiresAt.getMonth() + 1);
      }

      // Generate unique event ID for Sentinel
      const sentinelEventId = randomUUID();

      // Determine initial sync status based on Discord availability
      const hasDiscordId = !!user.discordId;
      const initialSyncStatus = hasDiscordId ? 'pending' : 'pending';

      // Create bot entitlement
      const entitlement = new BotEntitlement({
        userId: payment.userId,
        userEmail: payment.userEmail,
        userName: payment.userName,
        subscriptionId: subscription._id,
        paymentId: payment._id,
        botProductId: payment.botProductId,
        planName: payment.planName,
        planType: subscription.planType,
        status: 'active',
        startedAt,
        expiresAt,
        // Sentinel synchronization fields
        sentinelEventId,
        sentinelSyncStatus: initialSyncStatus,
        sentinelRetryCount: 0,
      });

      await entitlement.save({ session });

      // Update payment status
      payment.status = 'verified';
      payment.reviewedBy = admin._id;
      payment.reviewedAt = new Date();
      await payment.save({ session });

      // Update subscription status
      subscription.status = 'active';
      subscription.startDate = startedAt;
      subscription.endDate = expiresAt;
      await subscription.save({ session });

      // Commit transaction
      await session.commitTransaction();

      // Send approval email to user
      try {
        await sendPaymentApprovedEmail(payment.userEmail, {
          userName: payment.userName,
          planName: payment.planName,
          planType: subscription.planType,
          amount: payment.amount,
          billingPeriod: subscription.billingPeriod,
          startedAt: startedAt.toISOString(),
          expiresAt: expiresAt.toISOString(),
          subscriptionId: subscription._id.toString(),
          paymentId: payment._id.toString(),
        });
      } catch (emailError) {
        console.error('Error sending approval email:', emailError);
        // Don't fail the request if email fails
      }

      // Attempt Sentinel synchronization after transaction commits
      // This is done outside the transaction to avoid blocking on external API
      if (hasDiscordId && isSentinelConfigured()) {
        try {
          const payload = {
            event_id: sentinelEventId,
            event: 'paid' as const,
            discord_user_id: user.discordId!,
            occurred_at: startedAt.toISOString(),
            ref: subscription._id.toString(),
            plan: payment.planName,
            amount: payment.amount,
            currency: payment.currency,
            expires_at: expiresAt.toISOString(),
          };

          const result = await postEntitlement(payload);

          if (result.success) {
            // Update entitlement sync status
            const updateResult = await BotEntitlement.findByIdAndUpdate(
              entitlement._id,
              {
                sentinelSyncStatus: 'synced',
                sentinelSyncedAt: new Date(),
                sentinelSyncError: undefined,
              },
              { new: true, runValidators: true }
            );
            if (!updateResult) {
              console.error(`Sentinel: Failed to update entitlement ${entitlement._id} after successful sync`);
            } else {
              console.log(`Sentinel: Successfully synced entitlement ${sentinelEventId}`);
            }
          } else {
            // Mark as failed but keep payment approved
            const updateResult = await BotEntitlement.findByIdAndUpdate(
              entitlement._id,
              {
                sentinelSyncStatus: 'failed',
                sentinelSyncError: result.error || 'Unknown error',
              },
              { new: true, runValidators: true }
            );
            if (!updateResult) {
              console.error(`Sentinel: Failed to update entitlement ${entitlement._id} after sync failure`);
            }
            console.error(`Sentinel: Failed to sync entitlement ${sentinelEventId}:`, result.error);
          }
        } catch (syncError) {
          // Mark as failed but keep payment approved
          const updateResult = await BotEntitlement.findByIdAndUpdate(
            entitlement._id,
            {
              sentinelSyncStatus: 'failed',
              sentinelSyncError: syncError instanceof Error ? syncError.message : 'Unknown error',
            },
            { new: true, runValidators: true }
          );
          if (!updateResult) {
            console.error(`Sentinel: Failed to update entitlement ${entitlement._id} after sync error`);
          }
          console.error('Sentinel sync error:', syncError);
        }
      } else if (!hasDiscordId) {
        console.log(`Sentinel: Skipping sync - user ${user._id} has not linked Discord`);
      } else {
        console.log('Sentinel: Not configured - entitlement marked as pending');
      }

      return NextResponse.json({
        message: 'Payment approved successfully',
        payment: payment,
        subscription: subscription,
        entitlement: entitlement,
      });
    } catch (transactionError) {
      await session.abortTransaction();
      throw transactionError;
    }
  } catch (error) {
    console.error('Error approving payment:', error);
    
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to approve payment' },
      { status: 500 }
    );
  }
}
