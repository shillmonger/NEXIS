import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IBotEntitlement extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  userEmail: string;
  userName: string;
  subscriptionId: mongoose.Types.ObjectId;
  paymentId: mongoose.Types.ObjectId;
  botProductId: string;
  planName: string;
  planType: string;
  status: 'active' | 'expired' | 'revoked';
  startedAt: Date;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const BotEntitlementSchema: Schema<IBotEntitlement> = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    userEmail: {
      type: String,
      required: [true, 'User email is required'],
    },
    userName: {
      type: String,
      required: [true, 'User name is required'],
    },
    subscriptionId: {
      type: Schema.Types.ObjectId,
      ref: 'Subscription',
      required: [true, 'Subscription ID is required'],
      unique: true,
      index: true,
    },
    paymentId: {
      type: Schema.Types.ObjectId,
      ref: 'Payment',
      required: [true, 'Payment ID is required'],
    },
    botProductId: {
      type: String,
      required: [true, 'Bot product ID is required'],
      index: true,
    },
    planName: {
      type: String,
      required: [true, 'Plan name is required'],
    },
    planType: {
      type: String,
      required: [true, 'Plan type is required'],
    },
    status: {
      type: String,
      enum: ['active', 'expired', 'revoked'],
      default: 'active',
      index: true,
    },
    startedAt: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    expiresAt: {
      type: Date,
      required: [true, 'Expiration date is required'],
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index to prevent duplicate entitlements for the same subscription
BotEntitlementSchema.index({ subscriptionId: 1 }, { unique: true });

// Delete existing model to force schema reload
if (mongoose.models.BotEntitlement) {
  delete mongoose.models.BotEntitlement;
}

const BotEntitlement: Model<IBotEntitlement> = mongoose.model<IBotEntitlement>('BotEntitlement', BotEntitlementSchema);

export default BotEntitlement;
