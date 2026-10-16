import { escapeHtml, greeting, paragraph, highlight, button, callout, divider, layout, BRAND } from './shared';

export const getVerificationEmail = (firstName: string, verificationUrl: string): string => {
  const name = escapeHtml(firstName);

  return layout({
    title: `Verify Your Email - ${BRAND.name}`,
    preheader: 'Confirm your email address to activate your NEXIS account.',
    content: `
      ${greeting(`Welcome, ${name}!`)}
      ${paragraph(`Thank you for joining ${highlight(BRAND.name)}, your ${BRAND.tagline}.`)}
      ${paragraph(
        'Your account has been created. You are one step away from automating your Discord community with moderation bots, NFT holder verification, prediction markets and XP leaderboards.'
      )}
      ${paragraph('Please verify your email address to activate your account:')}
      ${button('Verify My Email', verificationUrl)}
      ${callout(
        'This verification link is unique to your account and expires in 24 hours. If you did not create a NEXIS account, you can safely ignore this email.',
        'info'
      )}
      ${divider()}
      ${paragraph('Once verified, you will have access to your dashboard where you can deploy bots, manage subscriptions and track your community&rsquo;s growth.')}
      ${paragraph('We are excited to have you on board!')}
    `,
  });
};
