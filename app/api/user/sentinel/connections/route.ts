import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { DiscordServerConnection } from '@/models';
import { requireAuth } from '@/lib/auth-helper';

export async function GET(request: NextRequest) {
  try {
    // Authenticate user
    const user = await requireAuth();

    await connectDB();

    // Fetch all server connections for the user
    const connections = await DiscordServerConnection.find({
      userId: user._id,
      status: 'connected',
    })
      .populate('entitlementId')
      .populate('subscriptionId')
      .sort({ verifiedAt: -1 });

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
