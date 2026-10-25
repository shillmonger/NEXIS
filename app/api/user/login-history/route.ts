import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth-helper';
import { LoginHistory } from '@/models';

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const history = await LoginHistory.find({ userId: user._id })
      .sort({ createdAt: -1 })
      .limit(10);

    return NextResponse.json({
      success: true,
      history,
    });
  } catch (error) {
    console.error('Error fetching login history:', error);
    return NextResponse.json(
      { success: false, error: 'An error occurred' },
      { status: 500 }
    );
  }
}
