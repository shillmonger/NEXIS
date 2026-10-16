import { escapeHtml, greeting, paragraph, highlight, button, divider, steps, callout, layout, BRAND } from './shared';

export const getWelcomeEmail = (firstName: string, dashboardUrl: string): string => {
  const name = escapeHtml(firstName);

  return layout({
    title: `Welcome to ${BRAND.name} - Account Verified`,
    preheader: 'Your email is verified and your NEXIS account is now active.',
    content: `
      ${callout('<strong>Your account has been verified.</strong>', 'neutral')}
      ${greeting(`Welcome to ${BRAND.name}, ${name}!`)}
      ${paragraph(`Your email address has been verified and your ${highlight(BRAND.name)} account is now active.`)}
      ${paragraph('Your dashboard is the central hub where you can deploy moderation bots, verify NXAE holders, manage prediction markets and track XP leaderboards.')}
      ${paragraph('To get started, we recommend completing these steps:')}
      ${steps([
        { title: 'Complete your profile', description: 'Update your account information and preferences.' },
        { title: 'Connect your Discord server', description: 'Link your community to enable bot deployment.' },
        { title: 'Deploy moderation bots', description: 'Set up automated protection for your server.' },
        { title: 'Verify NXAE holders', description: 'Enable wallet-based role assignment.' },
        { title: 'Explore Arena predictions', description: 'Compete in prediction markets for XP rewards.' },
      ])}
      ${button('Go to My Dashboard', dashboardUrl)}
      ${divider()}
      ${paragraph('From your dashboard you can monitor bot health, track community engagement, manage your subscription and view real-time analytics.')}
      ${paragraph('We are excited to have you on board!')}
    `,
  });
};
