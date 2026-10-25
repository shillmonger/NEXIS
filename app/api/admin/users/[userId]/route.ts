import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { User, Subscription, Payment, BotEntitlement } from '@/models';
import { requireAuth } from '@/lib/auth-helper';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    // Authenticate and check if admin
    const currentUser = await requireAuth();
    if (currentUser.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 403 }
      );
    }

    const { userId } = await params;

    await connectDB();

    // Find user
    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Prevent admin from deleting themselves
    if (user._id.toString() === currentUser._id.toString()) {
      return NextResponse.json(
        { error: 'Cannot delete your own account' },
        { status: 400 }
      );
    }

    // Delete related subscriptions and payments
    await Subscription.deleteMany({ userId: user._id });
    await Payment.deleteMany({ userId: user._id });

    // Delete user
    await User.findByIdAndDelete(userId);

    return NextResponse.json({
      message: 'User deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    // Authenticate and check if admin
    const currentUser = await requireAuth();
    if (currentUser.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 403 }
      );
    }

    const { userId } = await params;
    const body = await request.json();
    const { role } = body;

    // Validate role
    if (!role || !['user', 'admin'].includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role. Must be user or admin' },
        { status: 400 }
      );
    }

    await connectDB();

    // Find user
    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Prevent admin from changing their own role
    if (user._id.toString() === currentUser._id.toString()) {
      return NextResponse.json(
        { error: 'Cannot modify your own role' },
        { status: 400 }
      );
    }

    // Update role
    user.role = role;
    await user.save();

    return NextResponse.json({
      message: `User role updated to ${role}`,
      user: {
        id: user._id.toString(),
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Error updating user role:', error);
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to update user role' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    // Authenticate and check if admin
    const currentUser = await requireAuth();
    if (currentUser.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 403 }
      );
    }

    const { userId } = await params;

    await connectDB();

    // Find user with subscriptions
    const user = await User.findById(userId).select('-passwordHash -verificationToken -resetToken -resetTokenExpiry');

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Fetch user's subscriptions with payments and entitlements
    const subscriptions = await Subscription.find({ userId: user._id })
      .populate('paymentId')
      .sort({ createdAt: -1 });

    const payments = await Payment.find({ userId: user._id }).sort({ createdAt: -1 });
    const entitlements = await BotEntitlement.find({ userId: user._id }).sort({ createdAt: -1 });

    // Calculate totals from payments
    const totalDeposit = payments.reduce((sum, p) => sum + p.amount, 0);
    const verifiedPayments = payments.filter(p => p.status === 'verified').length;

    // Transform user data to match frontend expectations
    const transformedUser = {
      id: user._id.toString(),
      _id: user._id.toString(),
      name: user.userName,
      email: user.email,
      username: user.userName,
      status: user.status === 'suspended' ? 'Blocked' : user.status === 'active' ? 'Active' : 'Inactive',
      balance: '0',
      profit: '0',
      totalDeposit,
      totalWithdrawal: 0,
      roles: [user.role],
      country: 'N/A',
      phone: 'N/A',
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
      fullName: user.userName,
      accountBalance: 0,
      welcomeBonus: 0,
      totalProfits: 0,
      referralBonus: 0,
      totalReferrals: 0,
      activeReferrals: 0,
      myReferralId: 'N/A',
      referralId: 'N/A',
      isActive: user.status === 'active',
      profileImage: user.avatar,
      emailVerified: user.emailVerified,
      lastLoginAt: user.lastLoginAt?.toISOString() || null,
      provider: user.provider,
    };

    // Transform subscriptions to match frontend investment structure
    const investments = subscriptions.map((sub) => {
      const startDate = sub.startDate?.toISOString() || sub.createdAt.toISOString();
      const endDate = sub.endDate?.toISOString();
      const daysPassed = endDate ? Math.floor((new Date().getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)) : 0;
      const durationDays = endDate ? Math.floor((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)) : 30;
      const completionPercentage = durationDays > 0 ? Math.min((daysPassed / durationDays) * 100, 100) : 0;

      return {
        id: sub._id.toString(),
        userId: sub.userId.toString(),
        planId: 1,
        planName: sub.planName,
        roiRate: 0,
        investmentAmount: sub.amount,
        durationDays,
        daysPassed,
        profitEarned: 0,
        completionPercentage,
        status: sub.status === 'active' ? 'active' : sub.status === 'pending_review' ? 'pending' : sub.status,
        profitHistory: [],
        startDate,
        endDate: endDate || '',
        lastProfitDate: sub.updatedAt.toISOString(),
        updatedAt: sub.updatedAt.toISOString(),
        billingPeriod: sub.billingPeriod,
        planType: sub.planType,
      };
    });

    return NextResponse.json({
      user: transformedUser,
      investments,
      payments: payments.map((p) => ({
        id: p._id.toString(),
        invoiceId: p.transactionId,
        date: p.createdAt.toISOString(),
        amount: p.amount,
        method: p.paymentMethod,
        status: p.status === 'verified' ? 'Paid' : p.status === 'pending' ? 'Pending' : 'Failed',
        proofFileUrl: p.proofFileUrl,
        subscriptionId: p.subscriptionId.toString(),
      })),
      entitlements: entitlements.map((e) => ({
        id: e._id.toString(),
        botProductId: e.botProductId,
        planName: e.planName,
        status: e.status,
        startedAt: e.startedAt.toISOString(),
        expiresAt: e.expiresAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error('Error fetching user details:', error);
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to fetch user details' },
      { status: 500 }
    );
  }
}
