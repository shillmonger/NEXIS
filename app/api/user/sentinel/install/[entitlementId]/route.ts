import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { BotEntitlement, User } from '@/models';
import { requireAuth } from '@/lib/auth-helper';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ entitlementId: string }> }
) {
  try {
    // Authenticate user
    const user = await requireAuth();

    const { entitlementId } = await params;

    await connectDB();

    // Fetch the entitlement
    const entitlement = await BotEntitlement.findOne({
      _id: entitlementId,
      userId: user._id,
    }).populate('subscriptionId');

    if (!entitlement) {
      return NextResponse.json(
        { error: 'Entitlement not found' },
        { status: 404 }
      );
    }

    // Check if entitlement is active
    if (entitlement.status !== 'active') {
      return NextResponse.json(
        { error: 'Entitlement is not active' },
        { status: 400 }
      );
    }

    // Check if entitlement has expired
    const now = new Date();
    if (entitlement.expiresAt && new Date(entitlement.expiresAt) < now) {
      return NextResponse.json(
        { error: 'Entitlement has expired' },
        { status: 400 }
      );
    }

    // Check if entitlement is synchronized with Sentinel
    if (entitlement.sentinelSyncStatus !== 'synced') {
      return NextResponse.json(
        { error: 'Entitlement is not yet synchronized with Sentinel', syncStatus: entitlement.sentinelSyncStatus },
        { status: 400 }
      );
    }

    // Check if user has linked Discord
    if (!user.discordId) {
      return NextResponse.json(
        { error: 'You must link your Discord account before installing the bot' },
        { status: 400 }
      );
    }

    // Get Sentinel configuration
    const sentinelBaseUrl = process.env.SENTINEL_API_BASE_URL;
    const returnUrl = process.env.SENTINEL_RETURN_URL;

    if (!sentinelBaseUrl) {
      console.error('SENTINEL_API_BASE_URL not configured');
      return NextResponse.json(
        { error: 'Sentinel service is not configured' },
        { status: 503 }
      );
    }

    if (!returnUrl) {
      console.error('SENTINEL_RETURN_URL not configured');
      return NextResponse.json(
        { error: 'Sentinel return URL is not configured' },
        { status: 503 }
      );
    }

    // Use the same ref as the entitlement sync (subscription ID)
    const subscription = entitlement.subscriptionId as any;
    const ref = subscription._id.toString();

    // Construct Sentinel /add URL with query parameters
    const sentinelAddUrl = new URL(`${sentinelBaseUrl}/add`);
    sentinelAddUrl.searchParams.set('ref', ref);
    sentinelAddUrl.searchParams.set('return', returnUrl);

    // Return the Sentinel URL for client-side navigation
    return NextResponse.json({
      redirectUrl: sentinelAddUrl.toString(),
    });
  } catch (error) {
    console.error('Error initiating Sentinel installation:', error);

    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to initiate installation' },
      { status: 500 }
    );
  }
}
