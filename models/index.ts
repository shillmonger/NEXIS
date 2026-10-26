// Central model registry to ensure correct initialization order in serverless environments
// Import all models here to ensure they're registered before use

import './User';
import './Subscription';
import './Payment';
import './BotEntitlement';
import './Session';
import './LoginHistory';
import './OAuthState';
import './WebhookEventLog';

// Re-export models for convenience
export { default as User } from './User';
export { default as Subscription } from './Subscription';
export { default as Payment } from './Payment';
export { default as BotEntitlement } from './BotEntitlement';
export { default as Session } from './Session';
export { default as LoginHistory } from './LoginHistory';
export { default as OAuthState } from './OAuthState';
export { default as WebhookEventLog } from './WebhookEventLog';
