import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ILoginHistory extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  device: string;
  browser: string;
  location: string;
  status: 'success' | 'failed';
  ipAddress: string;
  createdAt: Date;
}

const LoginHistorySchema: Schema<ILoginHistory> = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    device: {
      type: String,
    },
    browser: {
      type: String,
    },
    location: {
      type: String,
    },
    status: {
      type: String,
      enum: ['success', 'failed'],
      default: 'success',
    },
    ipAddress: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const LoginHistory: Model<ILoginHistory> = mongoose.model<ILoginHistory>('LoginHistory', LoginHistorySchema);

export default LoginHistory;
