import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { requireAuth } from '@/lib/auth-helper';

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
    const { status } = body;

    // Validate status
    if (!status || !['active', 'suspended', 'inactive'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be active, suspended, or inactive' },
        { status: 400 }
      );
    }

    await connectDB();

    // Find and update user
    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Prevent admin from suspending themselves
    if (user._id.toString() === currentUser._id.toString()) {
      return NextResponse.json(
        { error: 'Cannot modify your own account' },
        { status: 400 }
      );
    }

    user.status = status;
    await user.save();

    return NextResponse.json({
      message: `User ${status === 'suspended' ? 'suspended' : status === 'active' ? 'activated' : 'updated'} successfully`,
      user: {
        id: user._id.toString(),
        status: status === 'suspended' ? 'Blocked' : status === 'active' ? 'Active' : 'Inactive',
      },
    });
  } catch (error) {
    console.error('Error updating user status:', error);
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to update user status' },
      { status: 500 }
    );
  }
}
