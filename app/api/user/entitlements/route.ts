import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { BotEntitlement } from '@/models';
import { requireAuth } from '@/lib/auth-helper';

export async function GET(request: NextRequest) {
  try {
    // Authenticate user
    const user = await requireAuth();

    await connectDB();

    // Fetch entitlements for the authenticated user
    const entitlements = await BotEntitlement.find({ userId: user._id })
      .populate('subscriptionId')
      .sort({ createdAt: -1 });

    const now = new Date();

    // Filter and transform entitlements
    const validEntitlements = entitlements
      .filter((entitlement) => {
        // Check status
        if (entitlement.status !== 'active') {
          return false;
        }

        // Check expiration date
        if (entitlement.expiresAt && new Date(entitlement.expiresAt) < now) {
          return false;
        }

        return true;
      })
      .map((entitlement) => {
        const subscription = entitlement.subscriptionId as any;
        const subscriptionIdStr = entitlement.subscriptionId.toString();

        // Format subscription ID to look like "SUB-XXXXXXXXXX" (take last 10 chars of ObjectId)
        const formattedSubscriptionId = `SUB-${subscriptionIdStr.slice(-10).toUpperCase()}`;

        return {
          id: entitlement._id.toString(),
          subscriptionId: formattedSubscriptionId,
          botProductId: entitlement.botProductId,
          botName: 'Nexis Bot', // This could be fetched from a products collection in the future
          planName: entitlement.planName,
          planType: entitlement.planType,
          status: entitlement.status,
          startedAt: entitlement.startedAt,
          expiresAt: entitlement.expiresAt,
          createdAt: entitlement.createdAt,
          // Server connection status - will be implemented later with botInstallations collection
          serverName: null,
          serverId: null,
          // Include subscription details
          subscriptionDetails: subscription ? {
            billingPeriod: subscription.billingPeriod,
            amount: subscription.amount,
          } : null,
        };
      });

    return NextResponse.json({
      entitlements: validEntitlements,
      total: validEntitlements.length,
    });
  } catch (error) {
    console.error('Error fetching entitlements:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack');
    console.error('Error message:', error instanceof Error ? error.message : String(error));
    
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to fetch entitlements', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
