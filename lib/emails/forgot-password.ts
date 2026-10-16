import { escapeHtml, greeting, paragraph, highlight, button, callout, divider, layout, BRAND } from './shared';

export const getForgotPasswordEmail = (firstName: string, resetUrl: string): string => {
  const name = escapeHtml(firstName);

  return layout({
    title: `Reset Your Password - ${BRAND.name}`,
    preheader: 'Use this link to reset your NEXIS password. It expires in 1 hour.',
    content: `
      ${greeting('Password Reset Request')}
      ${paragraph(`Hello ${highlight(name)},`)}
      ${paragraph(`We received a request to reset the password for your ${highlight(BRAND.name)} account. If this was you, click the button below to create a new password:`)}
      ${button('Reset My Password', resetUrl)}
      ${callout('This link is valid for 1 hour. Once you set a new password, you can access your dashboard immediately.', 'info')}
      ${callout('Do not share this link with anyone. The NEXIS team will never ask for your password by email, message or any other channel.', 'warning')}
      ${divider()}
      ${paragraph('If you did not request a password reset, no action is needed. Your current password will stay unchanged.')}
      ${paragraph('If you keep receiving unexpected reset emails, please check the security of your email account and contact our support team.')}
    `,
  });
};
