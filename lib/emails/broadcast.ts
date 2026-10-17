import { escapeHtml, greeting, paragraph, highlight, divider, layout, BRAND } from './shared';

export const getBroadcastEmail = (subject: string, message: string, senderName: string = 'NEXIS Team'): string => {
  const safeSubject = escapeHtml(subject);
  const safeMessage = escapeHtml(message);
  const safeSender = escapeHtml(senderName);

  return layout({
    title: safeSubject,
    preheader: safeSubject,
    content: `
      ${greeting(`Hello from ${BRAND.name}!`)}
      ${paragraph(safeMessage)}
      ${divider()}
      ${paragraph(`This message was sent by ${highlight(safeSender)} on behalf of ${BRAND.name}.`)}
      ${paragraph('If you have any questions, please reach out to our support team.')}
    `,
  });
};
