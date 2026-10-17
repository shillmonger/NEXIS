import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';

export async function GET() {
  try {
    await connectDB();

    // Get random users with avatars
    const users = await User.aggregate([
      { $match: { avatar: { $exists: true, $ne: null } } },
      { $sample: { size: 5 } },
      { $project: { avatar: 1, userName: 1 } }
    ]);

    return NextResponse.json({
      success: true,
      users,
    });
  } catch (error) {
    console.error('Error fetching random users:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}
