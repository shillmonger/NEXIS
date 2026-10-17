import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { verifyToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { username, avatar, country, phone, language } = await request.json();

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

    // Update fields
    if (username) {
      user.userName = username;
    }
    if (avatar) {
      user.avatar = avatar;
    }
    if (country !== undefined) {
      user.country = country;
    }
    if (phone !== undefined) {
      user.phone = phone;
    }
    if (language) {
      user.language = language;
    }

    await user.save();

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        username: user.userName,
        avatar: user.avatar,
      },
    });

  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}
