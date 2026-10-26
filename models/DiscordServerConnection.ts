import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IDiscordServerConnection extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  entitlementId: mongoose.Types.ObjectId;
  subscriptionId: mongoose.Types.ObjectId;
  discordUserId: string;
  guildId: string;
  guildName: string;
  status: 'pending' | 'connected' | 'removed';
  verifiedAt?: Date;
  removedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const DiscordServerConnectionSchema: Schema<IDiscordServerConnection> = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    entitlementId: {
      type: Schema.Types.ObjectId,
      ref: 'BotEntitlement',
      required: [true, 'Entitlement ID is required'],
      index: true,
    },
    subscriptionId: {
      type: Schema.Types.ObjectId,
      ref: 'Subscription',
      required: [true, 'Subscription ID is required'],
      index: true,
    },
    discordUserId: {
      type: String,
      required: [true, 'Discord user ID is required'],
      index: true,
    },
    guildId: {
      type: String,
      required: [true, 'Guild ID is required'],
      index: true,
    },
    guildName: {
      type: String,
      required: [true, 'Guild name is required'],
    },
    status: {
      type: String,
      enum: ['pending', 'connected', 'removed'],
      default: 'pending',
      index: true,
    },
    verifiedAt: {
      type: Date,
    },
    removedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to prevent duplicate connections for the same entitlement
DiscordServerConnectionSchema.index({ entitlementId: 1, guildId: 1 }, { unique: true });

const DiscordServerConnection: Model<IDiscordServerConnection> = mongoose.models.DiscordServerConnection || mongoose.model<IDiscordServerConnection>('DiscordServerConnection', DiscordServerConnectionSchema);

export default DiscordServerConnection;
