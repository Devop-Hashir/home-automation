import mongoose, { Schema, Document } from 'mongoose';

export interface IRoom extends Document {
  name: string;
  userId: mongoose.Types.ObjectId;
  createdAt: Date;
}

const RoomSchema = new Schema<IRoom>({
  name: {
    type: String,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

RoomSchema.index({ userId: 1 });

export default mongoose.models.Room || mongoose.model<IRoom>('Room', RoomSchema);
