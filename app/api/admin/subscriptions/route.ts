import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Subscription, User } from '@/models';

export async function GET() {
  try {
    await connectDB();

    // Fetch all subscriptions with user data
    const subscriptions = await Subscription.find({})
      .sort({ createdAt: -1 })
      .lean();

    // Fetch user data for each subscription
    const subscriptionsWithUsers = await Promise.all(
      subscriptions.map(async (sub) => {
        const user = await User.findById(sub.userId).select('userName email avatar').lean();
        return {
          ...sub,
          user,
        };
      })
    );

    return NextResponse.json({
      success: true,
      subscriptions: subscriptionsWithUsers,
    });
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch subscriptions' },
      { status: 500 }
    );
  }
}
