import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  userName: string;
  email: string;
  passwordHash?: string;
  emailVerified: boolean;
  emailVerifiedAt?: Date;
  verificationToken?: string;
  resetToken?: string;
  resetTokenExpiry?: Date;
  role: 'user' | 'admin';
  status: 'active' | 'inactive' | 'suspended';
  avatar?: string;
  lastLoginAt?: Date;
  agreedToTerms: boolean;
  createdAt: Date;
  updatedAt: Date;
  provider?: 'local' | 'google' | 'discord';
  googleId?: string;
  discordId?: string;
}

const UserSchema: Schema<IUser> = new Schema(
  {
    userName: {
      type: String,
      required: [true, 'Username is required'],
      trim: true,
      minlength: [3, 'Username must be at least 3 characters'],
      maxlength: [30, 'Username cannot exceed 30 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
    },
    passwordHash: {
      type: String,
      required: false,
    },
    provider: {
      type: String,
      enum: ['local', 'google', 'discord'],
      default: 'local',
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
    discordId: {
      type: String,
      unique: true,
      sparse: true,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerifiedAt: {
      type: Date,
    },
    verificationToken: {
      type: String,
    },
    resetToken: {
      type: String,
    },
    resetTokenExpiry: {
      type: Date,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'suspended'],
      default: 'active',
    },
    avatar: {
      type: String,
    },
    lastLoginAt: {
      type: Date,
    },
    agreedToTerms: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Delete existing model to force schema reload
if (mongoose.models.User) {
  delete mongoose.models.User;
}

const User: Model<IUser> = mongoose.model<IUser>('User', UserSchema);

export default User;