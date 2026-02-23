import mongoose, { Schema, Document } from 'mongoose';

export interface ISchedule extends Document {
  deviceId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  time: string;
  action: 'ON' | 'OFF';
  enabled: boolean;
  createdAt: Date;
}

const ScheduleSchema = new Schema<ISchedule>({
  deviceId: {
    type: Schema.Types.ObjectId,
    ref: 'Device',
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  time: {
    type: String,
    required: true,
    match: /^([01]\d|2[0-3]):([0-5]\d)$/,
  },
  action: {
    type: String,
    enum: ['ON', 'OFF'],
    required: true,
  },
  enabled: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

ScheduleSchema.index({ userId: 1 });
ScheduleSchema.index({ enabled: 1, time: 1 });

export default mongoose.models.Schedule || mongoose.model<ISchedule>('Schedule', ScheduleSchema);
