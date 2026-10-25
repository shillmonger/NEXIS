import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Payment, Subscription, User } from '@/models';
import { requireAuth } from '@/lib/auth-helper';

export async function GET(request: NextRequest) {
  try {
    // Authenticate and verify admin role
    const user = await requireAuth();
    if (user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    // Build query
    const query: any = {};
    if (status && status !== 'all') {
      query.status = status;
    }

    // Fetch payments with user, subscription, and payment details
    const payments = await Payment.find(query)
      .populate('userId', 'userName email avatar')
      .populate('subscriptionId', 'status planName planType billingPeriod')
      .sort({ createdAt: -1 });

    return NextResponse.json({ payments });
  } catch (error) {
    console.error('Error fetching payments:', error);
    
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to fetch payments' },
      { status: 500 }
    );
  }
}
