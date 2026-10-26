import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { BotEntitlement } from '@/models';
import { requireAuth } from '@/lib/auth-helper';

export async function GET(request: NextRequest) {
  try {
    // Authenticate user
    const user = await requireAuth();

    await connectDB();

    // Fetch all entitlements with connected servers for the user
    const entitlements = await BotEntitlement.find({
      userId: user._id,
      serverStatus: 'connected',
    })
      .populate('subscriptionId')
      .sort({ serverConnectedAt: -1 });

    // Transform to match the expected connection format
    const connections = entitlements.map((entitlement) => ({
      _id: entitlement._id,
      entitlementId: entitlement._id,
      subscriptionId: entitlement.subscriptionId,
      userId: entitlement.userId,
      discordUserId: entitlement.discordUserId,
      guildId: entitlement.guildId,
      guildName: entitlement.guildName,
      status: entitlement.serverStatus,
      verifiedAt: entitlement.serverConnectedAt,
      removedAt: entitlement.serverRemovedAt,
    }));

    return NextResponse.json({
      connections,
      total: connections.length,
    });
  } catch (error) {
    console.error('Error fetching server connections:', error);

    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to fetch server connections' },
      { status: 500 }
    );
  }
}
