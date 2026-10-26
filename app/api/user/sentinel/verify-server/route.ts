import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { BotEntitlement, User } from '@/models';
import { requireAuth } from '@/lib/auth-helper';
import { getServers } from '@/lib/sentinel';

export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const user = await requireAuth();

    const body = await request.json();
    const { entitlementId, guildId } = body;

    if (!entitlementId || !guildId) {
      return NextResponse.json(
        { error: 'entitlementId and guildId are required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Fetch the entitlement
    const entitlement = await BotEntitlement.findOne({
      _id: entitlementId,
      userId: user._id,
    });

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

    // Check if user has linked Discord
    if (!user.discordId) {
      return NextResponse.json(
        { error: 'You must link your Discord account before verifying server connections' },
        { status: 400 }
      );
    }

    // Check if entitlement already has server connected
    if (entitlement.serverStatus === 'connected' && entitlement.guildId === guildId) {
      return NextResponse.json({
        success: true,
        message: 'Server already connected',
        entitlement,
      });
    }

    // Query Sentinel /servers to verify the server
    const sentinelResult = await getServers(user.discordId);

    if (!sentinelResult.success || !sentinelResult.servers) {
      return NextResponse.json(
        { error: 'Failed to verify server with Sentinel', details: sentinelResult.error },
        { status: 500 }
      );
    }

    // Find the server in Sentinel's response
    const sentinelServer = sentinelResult.servers.find(
      (server) => server.guild_id === guildId
    );

    if (!sentinelServer) {
      return NextResponse.json(
        { error: 'Server not found in Sentinel records' },
        { status: 404 }
      );
    }

    // Verify the server owner matches the authenticated user's Discord ID
    if (sentinelServer.owner_id !== user.discordId) {
      return NextResponse.json(
        { error: 'Server ownership verification failed' },
        { status: 403 }
      );
    }

    // Verify the ref matches the subscription
    if (sentinelServer.ref && sentinelServer.ref !== entitlement.subscriptionId.toString()) {
      return NextResponse.json(
        { error: 'Server reference does not match entitlement subscription' },
        { status: 400 }
      );
    }

    // Update the entitlement with server connection
    const updatedEntitlement = await BotEntitlement.findByIdAndUpdate(
      entitlement._id,
      {
        discordUserId: user.discordId,
        guildId,
        guildName: sentinelServer.guild_name,
        serverStatus: 'connected',
        serverConnectedAt: new Date(),
        serverRemovedAt: undefined,
      },
      { new: true, runValidators: true }
    );

    return NextResponse.json({
      success: true,
      message: 'Server connection verified successfully',
      entitlement: updatedEntitlement,
    });
  } catch (error) {
    console.error('Error verifying server connection:', error);

    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to verify server connection' },
      { status: 500 }
    );
  }
}
