import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISubscription extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  userEmail: string;
  userName: string;
  botProductId: string;
  planName: string;
  planType: string;
  amount: number;
  billingPeriod: string;
  status: 'pending_payment' | 'pending_review' | 'active' | 'rejected' | 'cancelled' | 'expired';
  paymentId?: mongoose.Types.ObjectId;
  startDate?: Date;
  endDate?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SubscriptionSchema: Schema<ISubscription> = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    userEmail: {
      type: String,
      required: [true, 'User email is required'],
    },
    userName: {
      type: String,
      required: [true, 'User name is required'],
    },
    botProductId: {
      type: String,
      required: [true, 'Bot product ID is required'],
    },
    planName: {
      type: String,
      required: [true, 'Plan name is required'],
    },
    planType: {
      type: String,
      required: [true, 'Plan type is required'],
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
    },
    billingPeriod: {
      type: String,
      required: [true, 'Billing period is required'],
    },
    status: {
      type: String,
      enum: ['pending_payment', 'pending_review', 'active', 'rejected', 'cancelled', 'expired'],
      default: 'pending_payment',
    },
    paymentId: {
      type: Schema.Types.ObjectId,
      ref: 'Payment',
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Delete existing model to force schema reload
if (mongoose.models.Subscription) {
  delete mongoose.models.Subscription;
}

const Subscription: Model<ISubscription> = mongoose.model<ISubscription>('Subscription', SubscriptionSchema);

export default Subscription;
