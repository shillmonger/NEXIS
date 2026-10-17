import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { sendEmail } from '@/lib/email';
import { getBroadcastEmail } from '@/lib/emails/broadcast';

export async function POST(request: NextRequest) {
  try {
    const { subject, body, sendToAll, selectedUserIds, attachment } = await request.json();

    await connectDB();

    // Get recipients
    let recipients: any[];
    if (sendToAll) {
      recipients = await User.find({ status: 'active', emailVerified: true });
    } else {
      recipients = await User.find({ _id: { $in: selectedUserIds } });
    }

    if (recipients.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No valid recipients found' },
        { status: 400 }
      );
    }

    // Send emails
    const emailPromises = recipients.map(async (user) => {
      const emailHtml = getBroadcastEmail(subject, body, 'NEXIS Admin');
      
      const emailOptions: any = {
        to: user.email,
        subject: subject,
        html: emailHtml,
      };

      // Add attachment if provided
      if (attachment) {
        emailOptions.attachments = [
          {
            filename: attachment.filename,
            content: attachment.content,
            encoding: 'base64',
          }
        ];
      }

      await sendEmail(emailOptions);
    });

    await Promise.all(emailPromises);

    return NextResponse.json({
      success: true,
      message: `Email sent to ${recipients.length} recipient(s)`,
    });
  } catch (error) {
    console.error('Error sending broadcast email:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send email' },
      { status: 500 }
    );
  }
}
