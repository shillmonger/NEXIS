import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Subscription, Payment, BotEntitlement } from '@/models';
import { requireAuth } from '@/lib/auth-helper';

export async function GET(request: NextRequest) {
  try {
    // Authenticate user
    const user = await requireAuth();

    await connectDB();

    // Fetch subscriptions for the authenticated user
    const subscriptions = await Subscription.find({ userId: user._id })
      .populate('paymentId')
      .sort({ createdAt: -1 });

    // Map backend status to frontend status
    const statusMap: Record<string, 'active' | 'expired' | 'cancelled' | 'pending' | 'rejected'> = {
      'active': 'active',
      'expired': 'expired',
      'cancelled': 'cancelled',
      'rejected': 'rejected',
      'pending_payment': 'pending',
      'pending_review': 'pending',
    };

    // Transform subscriptions to match frontend interface
    const transformedSubscriptions = subscriptions.map((sub) => {
      const status = statusMap[sub.status] || 'pending';
      const startDate = sub.startDate
        ? new Date(sub.startDate).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          }).toUpperCase()
        : new Date(sub.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          }).toUpperCase();

      const expirationDate = sub.endDate
        ? new Date(sub.endDate).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          }).toUpperCase()
        : 'N/A';

      // Format subscription ID to look like "SUB-XXXXXXXXXX"
      const subIdStr = sub._id.toString();
      const formattedSubscriptionId = `SUB-${subIdStr.slice(-10).toUpperCase()}`;

      return {
        id: formattedSubscriptionId,
        planName: sub.planName,
        status,
        startDate,
        expirationDate,
        autoRenew: false, // Will be implemented later
        connectedServers: 0, // Will be implemented later
        serverLimit: 0, // Will be implemented later
        price: sub.amount,
        billingCycle: sub.billingPeriod,
        _raw: sub, // Include raw data for debugging
      };
    });

    // Fetch payments for the user
    const payments = await Payment.find({ userId: user._id })
      .populate('subscriptionId')
      .sort({ createdAt: -1 });

    // Transform payments to match frontend interface
    const transformedPayments = payments.map((payment) => {
      const paymentStatusMap: Record<string, 'Paid' | 'Failed' | 'Pending'> = {
        'verified': 'Paid',
        'rejected': 'Failed',
        'pending': 'Pending',
      };

      // Format subscription ID if available
      let formattedSubscriptionId: string | undefined;
      if (payment.subscriptionId?._id) {
        const subIdStr = payment.subscriptionId._id.toString();
        formattedSubscriptionId = `SUB-${subIdStr.slice(-10).toUpperCase()}`;
      }

      return {
        id: payment._id.toString(),
        invoiceId: payment.transactionId,
        date: new Date(payment.createdAt).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }).toUpperCase(),
        amount: payment.amount,
        method: payment.paymentMethod,
        status: paymentStatusMap[payment.status] || 'Pending',
        proofFileUrl: payment.proofFileUrl,
        subscriptionId: formattedSubscriptionId,
      };
    });

    // Generate activity history from subscriptions
    const activityHistory = subscriptions.map((sub) => {
      const actionMap: Record<string, 'Created' | 'Renewed' | 'Upgraded' | 'Cancelled' | 'Expired'> = {
        'active': 'Created',
        'rejected': 'Cancelled',
        'cancelled': 'Cancelled',
        'expired': 'Expired',
        'pending_payment': 'Created',
        'pending_review': 'Created',
      };

      const expirationDate = sub.endDate
        ? new Date(sub.endDate).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          }).toUpperCase()
        : 'N/A';

      // Format subscription ID
      const subIdStr = sub._id.toString();
      const formattedSubscriptionId = `SUB-${subIdStr.slice(-10).toUpperCase()}`;

      return {
        id: formattedSubscriptionId,
        planName: sub.planName,
        action: actionMap[sub.status] || 'Created',
        date: new Date(sub.createdAt).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }).toUpperCase(),
        expirationDate,
      };
    });

    return NextResponse.json({
      subscriptions: transformedSubscriptions,
      payments: transformedPayments,
      history: activityHistory,
    });
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to fetch subscriptions' },
      { status: 500 }
    );
  }
}
