import { escapeHtml, greeting, paragraph, highlight, divider, callout, layout, BRAND, getBaseUrl } from './shared';

interface PaymentNotificationData {
  userName: string;
  userEmail: string;
  planName: string;
  planType: string;
  amount: number;
  billingPeriod: string;
  paymentMethod: string;
  walletAddress: string;
  transactionId: string;
  proofFileUrl?: string;
  subscriptionId: string;
  paymentId: string;
}

export const getPaymentNotificationEmail = (data: PaymentNotificationData): string => {
  const userName = escapeHtml(data.userName);
  const userEmail = escapeHtml(data.userEmail);
  const planName = escapeHtml(data.planName);
  const planType = escapeHtml(data.planType);
  const amount = data.amount.toFixed(2);
  const billingPeriod = escapeHtml(data.billingPeriod);
  const paymentMethod = escapeHtml(data.paymentMethod);
  const walletAddress = escapeHtml(data.walletAddress);
  const transactionId = escapeHtml(data.transactionId);
  const subscriptionId = escapeHtml(data.subscriptionId);
  const paymentId = escapeHtml(data.paymentId);

  const proofLink = data.proofFileUrl;

  return layout({
    title: 'New Payment Submission - Pending Review',
    preheader: `New payment from ${userName} for ${planName} plan`,
    content: `
      ${callout('<strong>New payment submission requires your review.</strong>', 'info')}
      ${greeting('New Payment Received')}
      ${paragraph(`A new payment has been submitted by ${highlight(userName)} (${userEmail}) for the ${highlight(planName)} plan. Please review the payment details and proof below.`)}
      
      ${divider()}
      
      ${paragraph('<strong>User Information:</strong>')}
      ${paragraph(`Name: ${userName}<br>Email: ${userEmail}`)}
      
      ${paragraph('<strong>Subscription Details:</strong>')}
      ${paragraph(`Plan: ${planName} (${planType})<br>Amount: $${amount}<br>Billing: ${billingPeriod}<br>Subscription ID: ${subscriptionId}`)}
      
      ${paragraph('<strong>Payment Information:</strong>')}
      ${paragraph(`Payment Method: ${paymentMethod}<br>Wallet Address: ${walletAddress}<br>Transaction ID: ${transactionId}<br>Payment ID: ${paymentId}`)}
      
      ${proofLink ? `
        ${paragraph('<strong>Payment Proof:</strong>')}
        ${paragraph(`<a href="${proofLink}" target="_blank" style="color:${BRAND.primary};text-decoration:underline;font-weight:600;">View Payment Proof Screenshot</a>`)}
      ` : ''}
      
      ${divider()}
      
      ${paragraph('Please review this payment in your admin dashboard and either approve or reject the subscription.')}
      ${paragraph('All payment details have been securely stored in the database for your records.')}
    `,
  });
};

export const sendPaymentNotificationEmail = async (
  to: string | string[],
  data: PaymentNotificationData
): Promise<boolean> => {
  const { sendEmail } = await import('../email');
  const html = getPaymentNotificationEmail(data);
  
  const recipients = Array.isArray(to) ? to : [to];
  
  for (const recipient of recipients) {
    const success = await sendEmail(
      recipient,
      `New Payment Submission - ${data.planName} - ${data.userName}`,
      html
    );
    
    if (!success) {
      console.error(`Failed to send payment notification to ${recipient}`);
    }
  }
  
  return true;
};
