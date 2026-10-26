import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IWebhookEventLog extends Document {
  _id: mongoose.Types.ObjectId;
  eventId: string;
  eventType: string;
  processedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const WebhookEventLogSchema: Schema<IWebhookEventLog> = new Schema(
  {
    eventId: {
      type: String,
      required: [true, 'Event ID is required'],
      unique: true,
      index: true,
    },
    eventType: {
      type: String,
      required: [true, 'Event type is required'],
      index: true,
    },
    processedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// TTL index to automatically delete old logs after 30 days
WebhookEventLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 });

const WebhookEventLog: Model<IWebhookEventLog> = mongoose.models.WebhookEventLog || mongoose.model<IWebhookEventLog>('WebhookEventLog', WebhookEventLogSchema);

export default WebhookEventLog;
