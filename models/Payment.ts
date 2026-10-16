import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPayment extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  userEmail: string;
  userName: string;
  subscriptionId: mongoose.Types.ObjectId;
  botProductId: string;
  planName: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  walletAddress?: string;
  transactionId: string;
  proofFileUrl?: string;
  proofFileName?: string;
  proofFilePublicId?: string;
  status: 'pending' | 'verified' | 'rejected';
  reviewedBy?: mongoose.Types.ObjectId;
  reviewedAt?: Date;
  reviewNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema: Schema<IPayment> = new Schema(
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
    subscriptionId: {
      type: Schema.Types.ObjectId,
      ref: 'Subscription',
      required: [true, 'Subscription ID is required'],
    },
    botProductId: {
      type: String,
      required: [true, 'Bot product ID is required'],
    },
    planName: {
      type: String,
      required: [true, 'Plan name is required'],
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
    },
    currency: {
      type: String,
      default: 'USD',
    },
    paymentMethod: {
      type: String,
      required: [true, 'Payment method is required'],
    },
    walletAddress: {
      type: String,
    },
    transactionId: {
      type: String,
      required: [true, 'Transaction ID is required'],
      unique: true,
    },
    proofFileUrl: {
      type: String,
    },
    proofFileName: {
      type: String,
    },
    proofFilePublicId: {
      type: String,
    },
    status: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'pending',
    },
    reviewedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    reviewedAt: {
      type: Date,
    },
    reviewNotes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Delete existing model to force schema reload
if (mongoose.models.Payment) {
  delete mongoose.models.Payment;
}

const Payment: Model<IPayment> = mongoose.model<IPayment>('Payment', PaymentSchema);

export default Payment;
