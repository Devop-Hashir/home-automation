import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Room from '@/models/Room';
import Device from '@/models/Device';
import { getUserFromRequest } from '@/lib/auth';

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // Find room and verify ownership
    const room = await Room.findOne({
      _id: params.id,
      userId: user.userId,
    });

    if (!room) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 });
    }

    // Unassign all devices from this room
    await Device.updateMany(
      { roomId: params.id },
      { $set: { roomId: null } }
    );

    // Delete room
    await Room.deleteOne({ _id: params.id });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Delete room error:', error);
    return NextResponse.json(
      { error: 'Server error deleting room' },
      { status: 500 }
    );
  }
}
