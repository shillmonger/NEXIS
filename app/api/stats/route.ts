import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { User } from '@/models';

export async function GET() {
  try {
    await connectDB();

    // Get various user statistics
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ status: 'active' });
    const verifiedUsers = await User.countDocuments({ emailVerified: true });

    // Get unique countries
    const countries = await User.distinct('country', {
      $and: [
        { country: { $ne: null } },
        { country: { $ne: '' } }
      ]
    });

    return NextResponse.json({
      success: true,
      stats: {
        totalUsers,
        activeUsers,
        verifiedUsers,
        countries: countries.length,
      },
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
