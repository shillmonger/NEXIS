import nodemailer from 'nodemailer';
import { getVerificationEmail, getWelcomeEmail, getForgotPasswordEmail } from './emails';

/* -------------------------------------------------------------------------- */
/*  Transport                                                                 */
/* -------------------------------------------------------------------------- */

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || '465'),
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendEmail = async (options: {
  to: string;
  subject: string;
  html: string;
  attachments?: any[];
}): Promise<boolean> => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: options.to,
      subject: options.subject,
      html: options.html,
      attachments: options.attachments,
    });
    return true;
  } catch (error) {
    console.error('Email sending error:', error);
    return false;
  }
};

/* -------------------------------------------------------------------------- */
/*  Re-export email template functions                                        */
/* -------------------------------------------------------------------------- */
// Email templates are now organized in lib/emails/ folder:
// - shared.ts: Shared building blocks (layout, brand config, components)
// - verification.ts: Email verification template
// - welcome.ts: Welcome email template
// - forgot-password.ts: Password reset template
// - index.ts: Barrel export for easy imports

export { getVerificationEmail, getWelcomeEmail, getForgotPasswordEmail };
