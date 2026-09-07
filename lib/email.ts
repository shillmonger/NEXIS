import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || '465'),
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendEmail = async (
  to: string,
  subject: string,
  html: string
): Promise<boolean> => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html,
    });
    return true;
  } catch (error) {
    console.error('Email sending error:', error);
    return false;
  }
};

export const getVerificationEmail = (firstName: string, verificationUrl: string): string => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify Your Email - NEXIS</title>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #1f2937; background-color: #f9fafb; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); }
        .header { background: linear-gradient(135deg, #7c3aed 0%, #8b5cf6 50%, #a78bfa 100%); padding: 40px 30px; text-align: center; }
        .logo { font-size: 32px; font-weight: 900; color: white; letter-spacing: -1px; margin: 0; }
        .logo span { color: #c4b5fd; }
        .content { padding: 40px 30px; }
        .greeting { font-size: 24px; font-weight: 700; color: #1f2937; margin: 0 0 20px 0; }
        .text { font-size: 16px; color: #4b5563; margin: 0 0 16px 0; }
        .text strong { color: #7c3aed; }
        .button { display: inline-block; padding: 16px 32px; background: linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%); color: white !important; text-decoration: none; border-radius: 12px; margin: 24px 0; font-weight: 600; font-size: 16px; transition: all 0.3s ease; box-shadow: 0 4px 14px 0 rgba(124, 58, 237, 0.39); }
        .button:hover { transform: translateY(-2px); box-shadow: 0 6px 20px 0 rgba(124, 58, 237, 0.23); }
        .divider { height: 1px; background: #e5e7eb; margin: 30px 0; }
        .features { background: #f3f4f6; border-radius: 12px; padding: 24px; margin: 24px 0; }
        .feature-item { display: flex; align-items: center; margin-bottom: 12px; }
        .feature-item:last-child { margin-bottom: 0; }
        .feature-icon { width: 24px; height: 24px; background: #7c3aed; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 12px; flex-shrink: 0; }
        .feature-icon svg { width: 14px; height: 14px; fill: white; }
        .feature-text { font-size: 14px; color: #374151; font-weight: 500; }
        .footer { background: #f9fafb; padding: 24px 30px; text-align: center; border-top: 1px solid #e5e7eb; }
        .footer-text { font-size: 13px; color: #6b7280; margin: 0 0 8px 0; }
        .footer-link { color: #7c3aed; text-decoration: none; font-weight: 500; }
        .footer-link:hover { text-decoration: underline; }
        .security { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; margin: 24px 0; border-radius: 0 8px 8px 0; }
        .security-text { font-size: 14px; color: #92400e; margin: 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 class="logo">NEX<span>IS</span></h1>
        </div>
        <div class="content">
          <h2 class="greeting">Welcome, ${firstName}!</h2>
          <p class="text">Thank you for joining <strong>NEXIS</strong> — your Web3 Community Operating System.</p>
          <p class="text">Your account has been successfully created. You're one step away from automating your Discord community with powerful moderation bots, NFT holder verification, prediction markets, and XP leaderboards.</p>
          <p class="text">Please verify your email address to activate your account and unlock all features:</p>
          <a href="${verificationUrl}" class="button" style="color: white !important;">VERIFY MY EMAIL</a>
          <div class="security">
            <p class="security-text">🔒 For your security, this verification link is unique to your account and expires in 24 hours. If you did not create an account on NEXIS, you can safely ignore this email.</p>
          </div>
          <div class="features">
            <div class="feature-item">
              <div class="feature-icon">
                <svg viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
              <div class="feature-text">Auto-Moderation Bots — 24/7 server protection</div>
            </div>
            <div class="feature-item">
              <div class="feature-icon">
                <svg viewBox="0 0 24 24"><path d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
              </div>
              <div class="feature-text">Wallet Verification — Secure NXAE holder access</div>
            </div>
            <div class="feature-item">
              <div class="feature-icon">
                <svg viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
              </div>
              <div class="feature-text">Arena Predictions — Compete for XP rewards</div>
            </div>
          </div>
          <div class="divider"></div>
          <p class="text">Once verified, you'll have access to your personal dashboard where you can deploy bots, manage subscriptions, and track your community's growth.</p>
          <p class="text">We're excited to have you on board!</p>
        </div>
        <div class="footer">
          <p class="footer-text">© ${new Date().getFullYear()} NEXIS — Web3 Community Operating System</p>
          <p class="footer-text">Need help? <a href="#" class="footer-link">Contact Support</a></p>
        </div>
      </div>
    </body>
    </html>
  `;
};

export const getForgotPasswordEmail = (firstName: string, resetUrl: string): string => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reset Your Password - NEXIS</title>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #1f2937; background-color: #f9fafb; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); }
        .header { background: linear-gradient(135deg, #7c3aed 0%, #8b5cf6 50%, #a78bfa 100%); padding: 40px 30px; text-align: center; }
        .logo { font-size: 32px; font-weight: 900; color: white; letter-spacing: -1px; margin: 0; }
        .logo span { color: #c4b5fd; }
        .content { padding: 40px 30px; }
        .greeting { font-size: 24px; font-weight: 700; color: #1f2937; margin: 0 0 20px 0; }
        .text { font-size: 16px; color: #4b5563; margin: 0 0 16px 0; }
        .text strong { color: #7c3aed; }
        .button { display: inline-block; padding: 16px 32px; background: linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%); color: white !important; text-decoration: none; border-radius: 12px; margin: 24px 0; font-weight: 600; font-size: 16px; transition: all 0.3s ease; box-shadow: 0 4px 14px 0 rgba(124, 58, 237, 0.39); }
        .button:hover { transform: translateY(-2px); box-shadow: 0 6px 20px 0 rgba(124, 58, 237, 0.23); }
        .divider { height: 1px; background: #e5e7eb; margin: 30px 0; }
        .warning { background: #fee2e2; border-left: 4px solid #ef4444; padding: 16px; margin: 24px 0; border-radius: 0 8px 8px 0; }
        .warning-text { font-size: 14px; color: #991b1b; margin: 0; }
        .info { background: #dbeafe; border-left: 4px solid #3b82f6; padding: 16px; margin: 24px 0; border-radius: 0 8px 8px 0; }
        .info-text { font-size: 14px; color: #1e40af; margin: 0; }
        .footer { background: #f9fafb; padding: 24px 30px; text-align: center; border-top: 1px solid #e5e7eb; }
        .footer-text { font-size: 13px; color: #6b7280; margin: 0 0 8px 0; }
        .footer-link { color: #7c3aed; text-decoration: none; font-weight: 500; }
        .footer-link:hover { text-decoration: underline; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 class="logo">NEX<span>IS</span></h1>
        </div>
        <div class="content">
          <h2 class="greeting">Password Reset Request</h2>
          <p class="text">Hello <strong>${firstName}</strong>,</p>
          <p class="text">We received a request to reset the password for your <strong>NEXIS</strong> account.</p>
          <p class="text">If you made this request, you can securely create a new password by clicking the button below:</p>
          <a href="${resetUrl}" class="button" style="color: white !important;">RESET MY PASSWORD</a>
          <div class="info">
            <p class="info-text">ℹ️ This password reset link is valid for 1 hour. Once you create a new password, you'll be able to access your Discord community dashboard immediately.</p>
          </div>
          <div class="warning">
            <p class="warning-text">⚠️ For your protection, please do not share this link with anyone. Our team will never ask you to send your password by email, message, or any other communication channel.</p>
          </div>
          <div class="divider"></div>
          <p class="text">If you did not request a password reset, no action is required. Your current password will remain unchanged, and you can safely ignore this email.</p>
          <p class="text">If you continue receiving unexpected password reset emails, we recommend checking the security of your email account and contacting our support team.</p>
          <p class="text">Thank you for helping us keep your account secure.</p>
        </div>
        <div class="footer">
          <p class="footer-text">© ${new Date().getFullYear()} NEXIS — Web3 Community Operating System</p>
          <p class="footer-text">Need help? <a href="#" class="footer-link">Contact Support</a></p>
        </div>
      </div>
    </body>
    </html>
  `;
};

export const getWelcomeEmail = (firstName: string, dashboardUrl: string): string => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to NEXIS - Account Verified</title>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #1f2937; background-color: #f9fafb; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); }
        .header { background: linear-gradient(135deg, #7c3aed 0%, #8b5cf6 50%, #a78bfa 100%); padding: 40px 30px; text-align: center; }
        .logo { font-size: 32px; font-weight: 900; color: white; letter-spacing: -1px; margin: 0; }
        .logo span { color: #c4b5fd; }
        .content { padding: 40px 30px; }
        .greeting { font-size: 24px; font-weight: 700; color: #1f2937; margin: 0 0 20px 0; }
        .text { font-size: 16px; color: #4b5563; margin: 0 0 16px 0; }
        .text strong { color: #7c3aed; }
        .button { display: inline-block; padding: 16px 32px; background: linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%); color: white !important; text-decoration: none; border-radius: 12px; margin: 24px 0; font-weight: 600; font-size: 16px; transition: all 0.3s ease; box-shadow: 0 4px 14px 0 rgba(124, 58, 237, 0.39); }
        .button:hover { transform: translateY(-2px); box-shadow: 0 6px 20px 0 rgba(124, 58, 237, 0.23); }
        .divider { height: 1px; background: #e5e7eb; margin: 30px 0; }
        .steps { background: #f3f4f6; border-radius: 12px; padding: 24px; margin: 24px 0; }
        .step-item { display: flex; align-items: flex-start; margin-bottom: 16px; }
        .step-item:last-child { margin-bottom: 0; }
        .step-number { width: 28px; height: 28px; background: #7c3aed; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 12px; flex-shrink: 0; font-weight: 700; color: white; font-size: 14px; }
        .step-text { font-size: 14px; color: #374151; font-weight: 500; line-height: 1.5; }
        .step-text strong { color: #7c3aed; }
        .celebration { background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%); border-radius: 12px; padding: 24px; margin: 24px 0; text-align: center; }
        .celebration-icon { font-size: 48px; margin-bottom: 12px; }
        .celebration-text { font-size: 18px; font-weight: 600; color: #065f46; margin: 0; }
        .footer { background: #f9fafb; padding: 24px 30px; text-align: center; border-top: 1px solid #e5e7eb; }
        .footer-text { font-size: 13px; color: #6b7280; margin: 0 0 8px 0; }
        .footer-link { color: #7c3aed; text-decoration: none; font-weight: 500; }
        .footer-link:hover { text-decoration: underline; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 class="logo">NEX<span>IS</span></h1>
        </div>
        <div class="content">
          <div class="celebration">
            <div class="celebration-icon">🎉</div>
            <p class="celebration-text">Your Account Has Been Verified!</p>
          </div>
          <h2 class="greeting">Welcome to NEXIS, ${firstName}!</h2>
          <p class="text">Great news — your email address has been successfully verified, and your <strong>NEXIS</strong> account is now active.</p>
          <p class="text">You now have access to the complete Web3 Community Operating System for Discord. Your dashboard is the central hub where you can deploy moderation bots, verify NXAE holders, manage prediction markets, and track XP leaderboards.</p>
          <p class="text">To help you get started, we recommend completing these steps:</p>
          <div class="steps">
            <div class="step-item">
              <div class="step-number">1</div>
              <div class="step-text"><strong>Complete your profile</strong> — Update your account information and preferences.</div>
            </div>
            <div class="step-item">
              <div class="step-number">2</div>
              <div class="step-text"><strong>Connect your Discord server</strong> — Link your community to enable bot deployment.</div>
            </div>
            <div class="step-item">
              <div class="step-number">3</div>
              <div class="step-text"><strong>Deploy moderation bots</strong> — Set up automated protection for your server.</div>
            </div>
            <div class="step-item">
              <div class="step-number">4</div>
              <div class="step-text"><strong>Verify NXAE holders</strong> — Enable wallet-based role assignment.</div>
            </div>
            <div class="step-item">
              <div class="step-number">5</div>
              <div class="step-text"><strong>Explore Arena predictions</strong> — Compete in prediction markets for XP rewards.</div>
            </div>
          </div>
          <a href="${dashboardUrl}" class="button" style="color: white !important;">GO TO MY DASHBOARD</a>
          <div class="divider"></div>
          <p class="text">We're excited to have you on board! NEXIS is designed to make Discord community management seamless, secure, and engaging.</p>
          <p class="text">From your dashboard, you can monitor bot health, track community engagement, manage subscription plans, and access real-time analytics.</p>
          <p class="text">Welcome to the future of Web3 community automation!</p>
        </div>
        <div class="footer">
          <p class="footer-text">© ${new Date().getFullYear()} NEXIS — Web3 Community Operating System</p>
          <p class="footer-text">Need help? <a href="#" class="footer-link">Contact Support</a></p>
        </div>
      </div>
    </body>
    </html>
  `;
};