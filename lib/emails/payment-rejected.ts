import { escapeHtml, greeting, paragraph, highlight, divider, callout, layout, BRAND } from './shared';

interface PaymentRejectedData {
  userName: string;
  planName: string;
  planType: string;
  amount: number;
  billingPeriod: string;
  reason: string;
  subscriptionId: string;
  paymentId: string;
}

export const getPaymentRejectedEmail = (data: PaymentRejectedData): string => {
  const userName = escapeHtml(data.userName);
  const planName = escapeHtml(data.planName);
  const planType = escapeHtml(data.planType);
  const amount = data.amount.toFixed(2);
  const billingPeriod = escapeHtml(data.billingPeriod);
  const reason = escapeHtml(data.reason);
  const subscriptionId = escapeHtml(data.subscriptionId);
  const paymentId = escapeHtml(data.paymentId);

  return layout({
    title: 'Payment Rejected - Action Required',
    preheader: `Your payment for ${planName} was not approved`,
    content: `
      ${callout('<strong>Your payment could not be verified.</strong>', 'warning')}
      ${greeting('Important Update, ' + userName)}
      ${paragraph(`We regret to inform you that your payment for the ${highlight(planName)} plan could not be verified and has been rejected. Please review the details below.`)}
      
      ${divider()}
      
      ${paragraph('<strong>Subscription Details:</strong>')}
      ${paragraph(`Plan: ${planName} (${planType})<br>Amount: $${amount}<br>Billing: ${billingPeriod}<br>Subscription ID: ${subscriptionId}`)}
      
      ${paragraph('<strong>Rejection Reason:</strong>')}
      ${paragraph(`<em>${reason}</em>`)}
      
      ${divider()}
      
      ${paragraph('If you believe this is an error, please submit a new payment with correct details or contact our support team for assistance.')}
      ${paragraph('Thank you for your understanding.')}
    `,
  });
};

export const sendPaymentRejectedEmail = async (
  to: string,
  data: PaymentRejectedData
): Promise<boolean> => {
  const { sendEmail } = await import('../email');
  const html = getPaymentRejectedEmail(data);

  const success = await sendEmail({
    to,
    subject: `Payment Rejected - ${data.planName} - Action Required`,
    html
  });

  if (!success) {
    console.error(`Failed to send payment rejection email to ${to}`);
  }

  return success;
};
