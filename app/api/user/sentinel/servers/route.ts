import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { BotEntitlement } from '@/models';
import { requireAuth } from '@/lib/auth-helper';

export async function GET(request: NextRequest) {
  try {
    // Authenticate user
    const user = await requireAuth();

    await connectDB();

    // Fetch all entitlements with connected servers for the authenticated user
    const entitlements = await BotEntitlement.find({
      userId: user._id,
      serverStatus: 'connected',
    })
      .populate('subscriptionId')
      .sort({ serverConnectedAt: -1 });

    console.log('[API /user/sentinel/servers] User ID:', user._id);
    console.log('[API /user/sentinel/servers] Entitlements found:', entitlements.length);
    console.log('[API /user/sentinel/servers] Entitlements:', JSON.stringify(entitlements, null, 2));

    // Transform to match the UI's expected DiscordServer interface
    const servers = entitlements.map((entitlement) => {
      const subscription = entitlement.subscriptionId as any;
      
      // Map serverStatus to botStatus
      const botStatus = entitlement.serverStatus === 'connected' ? 'online' : 'offline';
      
      // Format last activity time
      const lastActivity = entitlement.serverConnectedAt
        ? getTimeAgo(new Date(entitlement.serverConnectedAt))
        : 'Unknown';

      return {
        id: entitlement._id.toString(),
        name: entitlement.guildName || 'Unknown Server',
        icon: 'https://i.postimg.cc/pLhcx2Vd/bitcoin-128.png', // Default icon
        serverId: entitlement.guildId || '',
        botStatus: botStatus as 'online' | 'offline',
        subscriptionPlan: entitlement.planName || 'Unknown',
        memberCount: 0, // Not available in current schema
        lastActivity,
        moderationEventsCount: 0, // Not available in current schema
        healthStatus: 'healthy' as const, // Default to healthy for connected servers
        activity: [], // Not available in current schema
      };
    });

    return NextResponse.json({
      servers,
      total: servers.length,
    });
  } catch (error) {
    console.error('Error fetching servers:', error);

    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to fetch servers' },
      { status: 500 }
    );
  }
}

// Helper function to format time ago
function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} mins ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
