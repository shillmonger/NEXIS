import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Payment from '@/models/Payment';
import Subscription from '@/models/Subscription';
import User from '@/models/User';
import { requireAuth } from '@/lib/auth-helper';
import { sendPaymentRejectedEmail } from '@/lib/emails';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ paymentId: string }> }
) {
  try {
    // Authenticate and verify admin role
    const admin = await requireAuth();
    if (admin.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const { paymentId } = await params;
    const body = await request.json();
    const { reason } = body;

    if (!reason || typeof reason !== 'string' || reason.trim().length === 0) {
      return NextResponse.json(
        { error: 'Rejection reason is required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Start a session for transaction
    const session = await Payment.startSession();

    try {
      session.startTransaction();

      // Fetch payment with subscription
      const payment = await Payment.findById(paymentId).session(session);
      if (!payment) {
        await session.abortTransaction();
        return NextResponse.json(
          { error: 'Payment not found' },
          { status: 404 }
        );
      }

      // Check if already processed
      if (payment.status !== 'pending') {
        await session.abortTransaction();
        return NextResponse.json(
          { error: 'Payment has already been processed' },
          { status: 400 }
        );
      }

      // Fetch subscription
      const subscription = await Subscription.findById(payment.subscriptionId).session(session);
      if (!subscription) {
        await session.abortTransaction();
        return NextResponse.json(
          { error: 'Subscription not found' },
          { status: 404 }
        );
      }

      // Update payment status
      payment.status = 'rejected';
      payment.reviewedBy = admin._id;
      payment.reviewedAt = new Date();
      payment.reviewNotes = reason.trim();
      await payment.save({ session });

      // Update subscription status
      subscription.status = 'rejected';
      await subscription.save({ session });

      // Commit transaction
      await session.commitTransaction();

      // Send rejection email to user
      try {
        await sendPaymentRejectedEmail(payment.userEmail, {
          userName: payment.userName,
          planName: payment.planName,
          planType: subscription.planType,
          amount: payment.amount,
          billingPeriod: subscription.billingPeriod,
          reason: reason.trim(),
          subscriptionId: subscription._id.toString(),
          paymentId: payment._id.toString(),
        });
      } catch (emailError) {
        console.error('Error sending rejection email:', emailError);
        // Don't fail the request if email fails
      }

      return NextResponse.json({
        message: 'Payment rejected successfully',
        payment: payment,
        subscription: subscription,
      });
    } catch (transactionError) {
      await session.abortTransaction();
      throw transactionError;
    }
  } catch (error) {
    console.error('Error rejecting payment:', error);
    
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to reject payment' },
      { status: 500 }
    );
  }
}
