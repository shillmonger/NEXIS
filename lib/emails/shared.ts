/* -------------------------------------------------------------------------- */
/*  Brand config                                                              */
/* -------------------------------------------------------------------------- */

export const getBaseUrl = () => process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export const BRAND = {
  name: 'NEXIS',
  tagline: 'Web3 Community Operating System',
  primary: '#7c3aed',
  primaryDark: '#6d28d9',
  text: '#1f2937',
  muted: '#4b5563',
  subtle: '#6b7280',
  border: '#e5e7eb',
  page: '#f4f4f7',
  panel: '#f9fafb',
  font: "'Segoe UI', Tahoma, Geneva, Verdana, Arial, sans-serif",
};

/**
 * Social links. Update the URLs to your real accounts.
 *
 * Icons must be PNG (Gmail/Outlook block inline SVG and strip most CSS).
 * They are loaded from icons8 by default. To self-host instead, put four
 * 64x64 white PNGs in /public/email/ (discord.png, x.png, whatsapp.png,
 * telegram.png) and swap the `icon` values to `${getBaseUrl()}/email/<name>.png`.
 */
export const SOCIALS = [
  {
    name: 'Discord',
    url: process.env.NEXT_PUBLIC_DISCORD_URL || 'https://discord.gg/nexis',
    icon: 'https://img.icons8.com/ios-filled/64/ffffff/discord-logo.png',
  },
  {
    name: 'X',
    url: process.env.NEXT_PUBLIC_X_URL || 'https://x.com/nexis',
    icon: 'https://img.icons8.com/ios-filled/64/ffffff/twitterx--v1.png',
  },
  {
    name: 'WhatsApp',
    url: process.env.NEXT_PUBLIC_WHATSAPP_URL || 'https://chat.whatsapp.com/nexis',
    icon: 'https://img.icons8.com/ios-filled/64/ffffff/whatsapp.png',
  },
  {
    name: 'Telegram',
    url: process.env.NEXT_PUBLIC_TELEGRAM_URL || 'https://t.me/nexis',
    icon: 'https://img.icons8.com/ios-filled/64/ffffff/telegram-app.png',
  },
];

export const SUPPORT_URL = process.env.SUPPORT_URL || `mailto:${process.env.SUPPORT_EMAIL || 'support@nexis.app'}`;

/* -------------------------------------------------------------------------- */
/*  Shared building blocks                                                    */
/* -------------------------------------------------------------------------- */

export const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

export const greeting = (text: string) =>
  `<h1 style="margin:0 0 16px 0;font-family:${BRAND.font};font-size:22px;line-height:1.3;font-weight:700;color:${BRAND.text};">${text}</h1>`;

export const paragraph = (html: string) =>
  `<p style="margin:0 0 16px 0;font-family:${BRAND.font};font-size:15px;line-height:1.6;color:${BRAND.muted};">${html}</p>`;

export const highlight = (text: string) =>
  `<strong style="color:${BRAND.primary};font-weight:600;">${text}</strong>`;

/** Bulletproof button (works in Outlook too). */
export const button = (label: string, href: string) => `
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:8px 0 24px 0;">
    <tr>
      <td align="center" bgcolor="${BRAND.primary}" style="border-radius:8px;background-color:${BRAND.primary};">
        <a href="${href}" target="_blank"
           style="display:inline-block;padding:13px 28px;font-family:${BRAND.font};font-size:14px;font-weight:600;letter-spacing:0.3px;color:#ffffff;text-decoration:none;border-radius:8px;">
          ${label}
        </a>
      </td>
    </tr>
  </table>`;

/** Callout box with a coloured left bar. */
export const callout = (html: string, tone: 'info' | 'warning' | 'neutral' = 'neutral') => {
  const tones = {
    info: { bg: '#eff6ff', bar: '#3b82f6', text: '#1e40af' },
    warning: { bg: '#fef2f2', bar: '#ef4444', text: '#991b1b' },
    neutral: { bg: '#f5f3ff', bar: BRAND.primary, text: '#4c1d95' },
  }[tone];
  return `
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 16px 0;">
    <tr>
      <td width="4" bgcolor="${tones.bar}" style="width:4px;background-color:${tones.bar};font-size:0;line-height:0;">&nbsp;</td>
      <td bgcolor="${tones.bg}" style="background-color:${tones.bg};padding:12px 16px;font-family:${BRAND.font};font-size:13px;line-height:1.55;color:${tones.text};">
        ${html}
      </td>
    </tr>
  </table>`;
};

export const divider = () =>
  `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:8px 0 24px 0;"><tr><td height="1" style="height:1px;line-height:1px;font-size:1px;background-color:${BRAND.border};">&nbsp;</td></tr></table>`;

/** Numbered steps. Fixed-size table cells keep the circles perfectly round. */
export const steps = (items: { title: string; description: string }[]) => `
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
         style="margin:0 0 24px 0;background-color:${BRAND.panel};border:1px solid ${BRAND.border};border-radius:10px;">
    <tr>
      <td style="padding:20px 20px 6px 20px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
          ${items
            .map(
              (item, i) => `
          <tr>
            <td width="40" valign="top" style="width:40px;padding:0 0 14px 0;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td width="26" height="26" align="center" valign="middle" bgcolor="${BRAND.primary}"
                      style="width:26px;height:26px;background-color:${BRAND.primary};border-radius:13px;font-family:${BRAND.font};font-size:12px;font-weight:700;line-height:26px;color:#ffffff;text-align:center;">
                    ${i + 1}
                  </td>
                </tr>
              </table>
            </td>
            <td valign="top" style="padding:3px 0 14px 0;font-family:${BRAND.font};font-size:14px;line-height:1.5;color:#374151;">
              <strong style="color:${BRAND.text};font-weight:600;">${item.title}</strong><br />
              <span style="color:${BRAND.subtle};">${item.description}</span>
            </td>
          </tr>`
            )
            .join('')}
        </table>
      </td>
    </tr>
  </table>`;

export const socialIcons = () => `
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="margin:0 auto 16px auto;">
    <tr>
      ${SOCIALS.map(
        (s) => `
      <td style="padding:0 6px;">
        <a href="${s.url}" target="_blank" title="${s.name}" style="text-decoration:none;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td width="36" height="36" align="center" valign="middle" bgcolor="${BRAND.primary}"
                  style="width:36px;height:36px;background-color:${BRAND.primary};border-radius:18px;">
                <img src="${s.icon}" alt="${s.name}" width="18" height="18"
                     style="display:block;border:0;outline:none;width:18px;height:18px;margin:0 auto;" />
              </td>
            </tr>
          </table>
        </a>
      </td>`
      ).join('')}
    </tr>
  </table>`;

interface LayoutOptions {
  title: string;
  preheader: string;
  content: string;
}

/** One layout for every email so they always match. */
export const layout = ({ title, preheader, content }: LayoutOptions): string => {
  const baseUrl = getBaseUrl();
  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light">
  <meta name="supported-color-schemes" content="light">
  <title>${title}</title>
  <style>
    body { margin: 0; padding: 0; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { border: 0; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; }
    a { color: ${BRAND.primary}; }
    @media only screen and (max-width: 620px) {
      .container { width: 100% !important; border-radius: 0 !important; }
      .px { padding-left: 20px !important; padding-right: 20px !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:${BRAND.page};">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${preheader}</div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${BRAND.page}" style="background-color:${BRAND.page};">
    <tr>
      <td align="center" style="padding:24px 12px;">

        <table role="presentation" class="container" width="560" cellpadding="0" cellspacing="0" border="0"
               style="width:100%;max-width:560px;background-color:#ffffff;border:1px solid ${BRAND.border};border-radius:12px;overflow:hidden;">

          <!-- Header -->
          <tr>
            <td align="center" bgcolor="${BRAND.primaryDark}"
                style="background-color:${BRAND.primaryDark};background-image:linear-gradient(135deg,#6d28d9 0%,#8b5cf6 100%);padding:24px 30px;">
              <img src="${baseUrl}/nexis.jpeg" alt="${BRAND.name}" width="72" height="72"
                   style="display:block;margin:0 auto;width:72px;height:72px;border-radius:12px;" />
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td class="px" style="padding:32px 36px 12px 36px;">
              ${content}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td class="px" align="center" bgcolor="${BRAND.panel}"
                style="background-color:${BRAND.panel};border-top:1px solid ${BRAND.border};padding:24px 36px;">
              ${socialIcons()}
              <p style="margin:0 0 6px 0;font-family:${BRAND.font};font-size:12px;line-height:1.5;color:${BRAND.subtle};text-align:center;">
                &copy; ${new Date().getFullYear()} ${BRAND.name} &middot; ${BRAND.tagline}
              </p>
              <p style="margin:0;font-family:${BRAND.font};font-size:12px;line-height:1.5;color:${BRAND.subtle};text-align:center;">
                Need help? <a href="${SUPPORT_URL}" style="color:${BRAND.primary};text-decoration:none;font-weight:600;">Contact Support</a>
              </p>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>
</body>
</html>`;
};
