import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISession extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  device: string;
  browser: string;
  os: string;
  location: string;
  ipAddress: string;
  isActive: boolean;
  lastActivity: Date;
  createdAt: Date;
}

const SessionSchema: Schema<ISession> = new Schema(
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
    os: {
      type: String,
    },
    location: {
      type: String,
    },
    ipAddress: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastActivity: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Session: Model<ISession> = mongoose.model<ISession>('Session', SessionSchema);

export default Session;
