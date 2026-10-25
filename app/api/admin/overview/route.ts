import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { User, Payment, Subscription, BotEntitlement } from '@/models';
import { requireAuth } from '@/lib/auth-helper';

export async function GET() {
  try {
    // Authenticate and check if admin
    const currentUser = await requireAuth();
    if (currentUser.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 403 }
      );
    }

    await connectDB();

    // User stats
    const totalUsers = await User.countDocuments();
    const suspendedUsers = await User.countDocuments({ status: 'suspended' });
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const usersThisWeek = await User.countDocuments({ createdAt: { $gte: oneWeekAgo } });

    // Payment stats
    const payments = await Payment.find({});
    const totalRevenue = payments
      .filter(p => p.status === 'verified')
      .reduce((sum, p) => sum + p.amount, 0);
    const pendingPayments = await Payment.countDocuments({ status: 'pending' });
    const rejectedPayments = await Payment.countDocuments({ status: 'rejected' });
    const acceptedPayments = await Payment.countDocuments({ status: 'verified' });

    // Subscription stats
    const activeSubscriptions = await Subscription.countDocuments({ status: 'active' });
    const suspendedSubscriptions = await Subscription.countDocuments({ status: 'rejected' });
    const expiredSubscriptions = await Subscription.countDocuments({ status: 'expired' });
    const pendingReviewSubscriptions = await Subscription.countDocuments({ status: 'pending_review' });
    const pendingPaymentSubscriptions = await Subscription.countDocuments({ status: 'pending_payment' });

    // Bot Entitlement stats
    const activeEntitlements = await BotEntitlement.countDocuments({ status: 'active' });
    const expiredEntitlements = await BotEntitlement.countDocuments({ status: 'expired' });
    const revokedEntitlements = await BotEntitlement.countDocuments({ status: 'revoked' });

    // Recent payments for transaction history
    const recentPayments = await Payment.find({})
      .sort({ createdAt: -1 })
      .limit(10)
      .select('userName userEmail planName amount status createdAt');

    return NextResponse.json({
      success: true,
      stats: {
        users: {
          total: totalUsers,
          thisWeek: usersThisWeek,
          suspended: suspendedUsers,
        },
        payments: {
          totalRevenue,
          pending: pendingPayments,
          rejected: rejectedPayments,
          accepted: acceptedPayments,
        },
        subscriptions: {
          active: activeSubscriptions,
          suspended: suspendedSubscriptions,
          expired: expiredSubscriptions,
          pendingReview: pendingReviewSubscriptions,
          pendingPayment: pendingPaymentSubscriptions,
        },
        entitlements: {
          active: activeEntitlements,
          expired: expiredEntitlements,
          revoked: revokedEntitlements,
        },
      },
      recentPayments,
    });
  } catch (error) {
    console.error('Error fetching overview stats:', error);
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to fetch overview stats' },
      { status: 500 }
    );
  }
}
