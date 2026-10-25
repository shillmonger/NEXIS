import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { User } from '@/models';
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

    // Fetch all users
    const users = await User.find({}).select('-passwordHash -verificationToken -resetToken -resetTokenExpiry').sort({ createdAt: -1 });

    // Transform users to match frontend expectations
    const transformedUsers = users.map((user) => ({
      id: user._id.toString(),
      _id: user._id.toString(),
      fullName: user.userName,
      email: user.email,
      username: user.userName,
      status: user.status === 'suspended' ? 'Blocked' : user.status === 'active' ? 'Active' : 'Inactive',
      role: user.role,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
      profileImage: user.avatar,
      emailVerified: user.emailVerified,
    }));

    // Calculate stats
    const totalUsers = users.length;
    const activeUsers = users.filter((u) => u.status === 'active').length;
    const blockedUsers = users.filter((u) => u.status === 'suspended').length;
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const usersThisWeek = users.filter((u) => new Date(u.createdAt) >= oneWeekAgo).length;

    return NextResponse.json({
      success: true,
      users: transformedUsers,
      stats: {
        totalUsers,
        activeUsers,
        blockedUsers,
        usersThisWeek,
      },
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}
