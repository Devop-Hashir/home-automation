import mongoose, { Schema, Document } from 'mongoose';

export interface IActivityLog extends Document {
  deviceId: mongoose.Types.ObjectId;
  deviceName: string;
  action: 'ON' | 'OFF';
  triggeredBy: 'Web' | 'Voice' | 'Bluetooth' | 'Manual';
  userId: mongoose.Types.ObjectId;
  timestamp: Date;
}

const ActivityLogSchema = new Schema<IActivityLog>({
  deviceId: {
    type: Schema.Types.ObjectId,
    ref: 'Device',
    required: true,
  },
  deviceName: {
    type: String,
    required: true,
  },
  action: {
    type: String,
    enum: ['ON', 'OFF'],
    required: true,
  },
  triggeredBy: {
    type: String,
    enum: ['Web', 'Voice', 'Bluetooth', 'Manual'],
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

ActivityLogSchema.index({ userId: 1, timestamp: -1 });
ActivityLogSchema.index({ deviceId: 1 });

export default mongoose.models.ActivityLog || mongoose.model<IActivityLog>('ActivityLog', ActivityLogSchema);
