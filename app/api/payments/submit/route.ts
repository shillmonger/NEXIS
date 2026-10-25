import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Subscription, Payment, User } from '@/models';
import { requireAuth } from '@/lib/auth-helper';
import { sendPaymentNotificationEmail } from '@/lib/emails';
import { uploadImage } from '@/lib/cloudinary';

// Validate file type and size
const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const user = await requireAuth();

    // Parse form data
    const formData = await request.formData();
    const botProductId = formData.get('botProductId') as string;
    const planName = formData.get('planName') as string;
    const planType = formData.get('planType') as string;
    const amount = formData.get('amount') as string;
    const billingPeriod = formData.get('billingPeriod') as string;
    const paymentMethod = formData.get('paymentMethod') as string;
    const walletAddress = formData.get('walletAddress') as string;
    const transactionId = formData.get('transactionId') as string;
    const proofFile = formData.get('proofFile') as File | null;

    // Validate required fields
    if (!botProductId || !planName || !planType || !amount || !billingPeriod || !paymentMethod || !transactionId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate amount
    const amountNumber = parseFloat(amount);
    if (isNaN(amountNumber) || amountNumber <= 0) {
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
      );
    }

    // Validate transaction ID
    if (!transactionId.trim()) {
      return NextResponse.json(
        { error: 'Transaction ID is required' },
        { status: 400 }
      );
    }

    // Handle file upload if provided
    let proofFileUrl: string | undefined;
    let proofFileName: string | undefined;
    let proofFilePublicId: string | undefined;

    if (proofFile) {
      // Validate file type
      if (!ALLOWED_TYPES.includes(proofFile.type)) {
        return NextResponse.json(
          { error: 'Only PNG, JPG, or WEBP images are allowed' },
          { status: 400 }
        );
      }

      // Validate file size
      if (proofFile.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: 'File size exceeds 5MB limit' },
          { status: 400 }
        );
      }

      // Upload to Cloudinary
      try {
        const uploadResult = await uploadImage(proofFile, 'payment-proofs');
        proofFileUrl = uploadResult.url;
        proofFilePublicId = uploadResult.publicId;
        proofFileName = proofFile.name;
      } catch (uploadError) {
        console.error('Cloudinary upload error:', uploadError);
        return NextResponse.json(
          { error: 'Failed to upload proof file' },
          { status: 500 }
        );
      }
    }

    // Connect to database
    await connectDB();

    // Check if transaction ID already exists
    const existingPayment = await Payment.findOne({ transactionId: transactionId.trim() });
    if (existingPayment) {
      return NextResponse.json(
        { error: 'Transaction ID already exists' },
        { status: 409 }
      );
    }

    // Create subscription record
    const subscription = new Subscription({
      userId: user._id,
      userEmail: user.email,
      userName: user.userName,
      botProductId,
      planName,
      planType,
      amount: amountNumber,
      billingPeriod,
      status: 'pending_payment',
    });

    await subscription.save();

    // Create payment record
    const payment = new Payment({
      userId: user._id,
      userEmail: user.email,
      userName: user.userName,
      subscriptionId: subscription._id,
      botProductId,
      planName,
      amount: amountNumber,
      currency: 'USD',
      paymentMethod,
      walletAddress: walletAddress || undefined,
      transactionId: transactionId.trim(),
      proofFileUrl,
      proofFileName,
      proofFilePublicId,
      status: 'pending',
    });

    await payment.save();

    // Link payment to subscription
    subscription.paymentId = payment._id;
    subscription.status = 'pending_review';
    await subscription.save();

    // Send notification email to all admin users
    try {
      const adminUsers = await User.find({ role: 'admin', status: 'active' });
      const adminEmails = adminUsers.map((admin) => admin.email);

      if (adminEmails.length > 0) {
        await sendPaymentNotificationEmail(adminEmails, {
          userName: user.userName,
          userEmail: user.email,
          planName,
          planType,
          amount: amountNumber,
          billingPeriod,
          paymentMethod,
          walletAddress: walletAddress || 'N/A',
          transactionId: transactionId.trim(),
          proofFileUrl,
          subscriptionId: subscription._id.toString(),
          paymentId: payment._id.toString(),
        });
      }
    } catch (emailError) {
      console.error('Error sending admin notification email:', emailError);
      // Don't fail the request if email fails
    }

    return NextResponse.json(
      {
        message: 'Payment submitted successfully',
        subscriptionId: subscription._id,
        paymentId: payment._id,
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Payment submission error:', error);
    
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: 'An error occurred during payment submission' },
      { status: 500 }
    );
  }
}
