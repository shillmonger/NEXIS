import { escapeHtml, greeting, paragraph, highlight, divider, callout, layout, BRAND, button } from './shared';

interface PaymentApprovedData {
  userName: string;
  planName: string;
  planType: string;
  amount: number;
  billingPeriod: string;
  startedAt: string;
  expiresAt: string;
  subscriptionId: string;
  paymentId: string;
}

export const getPaymentApprovedEmail = (data: PaymentApprovedData): string => {
  const userName = escapeHtml(data.userName);
  const planName = escapeHtml(data.planName);
  const planType = escapeHtml(data.planType);
  const amount = data.amount.toFixed(2);
  const billingPeriod = escapeHtml(data.billingPeriod);
  const subscriptionId = escapeHtml(data.subscriptionId);
  const paymentId = escapeHtml(data.paymentId);

  const startDate = new Date(data.startedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const expiryDate = new Date(data.expiresAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return layout({
    title: 'Payment Approved - Subscription Activated',
    preheader: `Your ${planName} subscription is now active`,
    content: `
      ${callout('<strong>Your payment has been verified and your subscription is now active!</strong>', 'info')}
      ${greeting('Great News, ' + userName)}
      ${paragraph(`Your payment for the ${highlight(planName)} plan has been successfully verified. Your subscription is now active and you can start using all the premium features.`)}
      
      ${divider()}
      
      ${paragraph('<strong>Subscription Details:</strong>')}
      ${paragraph(`Plan: ${planName} (${planType})<br>Amount: $${amount}<br>Billing: ${billingPeriod}<br>Subscription ID: ${subscriptionId}`)}
      
      ${paragraph('<strong>Active Period:</strong>')}
      ${paragraph(`Start Date: ${startDate}<br>Expiration Date: ${expiryDate}`)}
      
      ${divider()}
      
      ${paragraph('You can now access all the features included in your plan. If you have any questions or need assistance, please don\'t hesitate to contact our support team.')}
      ${paragraph('Thank you for choosing NEXIS!')}
    `,
  });
};

export const sendPaymentApprovedEmail = async (
  to: string,
  data: PaymentApprovedData
): Promise<boolean> => {
  const { sendEmail } = await import('../email');
  const html = getPaymentApprovedEmail(data);
  
  const success = await sendEmail(
    to,
    `Payment Approved - ${data.planName} Subscription Active`,
    html
  );
  
  if (!success) {
    console.error(`Failed to send payment approval email to ${to}`);
  }
  
  return success;
};
