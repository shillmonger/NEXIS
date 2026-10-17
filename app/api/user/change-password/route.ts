import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { verifyToken, hashPassword, comparePassword } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { currentPassword, newPassword } = await request.json();

    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    await connectDB();

    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if user has a password (OAuth users don't)
    if (!user.passwordHash) {
      return NextResponse.json(
        { success: false, error: 'OAuth users cannot change password. Please use your OAuth provider.' },
        { status: 400 }
      );
    }

    // Verify current password
    const isPasswordValid = await comparePassword(currentPassword, user.passwordHash);
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, error: 'Current password is incorrect' },
        { status: 400 }
      );
    }

    // Hash new password
    const newPasswordHash = await hashPassword(newPassword);

    // Update password
    user.passwordHash = newPasswordHash;
    await user.save();

    return NextResponse.json({
      success: true,
      message: 'Password updated successfully',
    });

  } catch (error) {
    console.error('Error changing password:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to change password' },
      { status: 500 }
    );
  }
}
