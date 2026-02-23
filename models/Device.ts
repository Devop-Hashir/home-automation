import mongoose, { Schema, Document } from 'mongoose';

export interface IDevice extends Document {
  name: string;
  roomId: mongoose.Types.ObjectId | null;
  relayNumber: number;
  status: boolean;
  type: 'Light' | 'Fan' | 'Outlet' | 'Other';
  userId: mongoose.Types.ObjectId;
  lastUpdated: Date;
  createdAt: Date;
}

const DeviceSchema = new Schema<IDevice>({
  name: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 50,
  },
  roomId: {
    type: Schema.Types.ObjectId,
    ref: 'Room',
    default: null,
  },
  relayNumber: {
    type: Number,
    required: true,
    min: 1,
    max: 16,
  },
  status: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String,
    enum: ['Light', 'Fan', 'Outlet', 'Other'],
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Compound unique index for userId + relayNumber
DeviceSchema.index({ userId: 1, relayNumber: 1 }, { unique: true });
DeviceSchema.index({ userId: 1 });

export default mongoose.models.Device || mongoose.model<IDevice>('Device', DeviceSchema);
