import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth-helper';
import Session from '@/models/Session';

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const sessions = await Session.find({ userId: user._id, isActive: true })
      .sort({ lastActivity: -1 })
      .limit(10);

    return NextResponse.json({
      success: true,
      sessions,
    });
  } catch (error) {
    console.error('Error fetching sessions:', error);
    return NextResponse.json(
      { success: false, error: 'An error occurred' },
      { status: 500 }
    );
  }
}
