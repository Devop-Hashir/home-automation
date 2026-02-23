import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Device from '@/models/Device';
import { getUserFromRequest } from '@/lib/auth';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { name, roomId, type } = await request.json();

    // Find device and verify ownership
    const device = await Device.findOne({
      _id: params.id,
      userId: user.userId,
    });

    if (!device) {
      return NextResponse.json({ error: 'Device not found' }, { status: 404 });
    }

    // Update device
    if (name) device.name = name;
    if (roomId !== undefined) device.roomId = roomId;
    if (type) device.type = type;
    device.lastUpdated = new Date();

    await device.save();

    return NextResponse.json({ device });
  } catch (error: any) {
    console.error('Update device error:', error);
    return NextResponse.json(
      { error: 'Server error updating device' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // Find device and verify ownership
    const device = await Device.findOne({
      _id: params.id,
      userId: user.userId,
    });

    if (!device) {
      return NextResponse.json({ error: 'Device not found' }, { status: 404 });
    }

    await Device.deleteOne({ _id: params.id });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Delete device error:', error);
    return NextResponse.json(
      { error: 'Server error deleting device' },
      { status: 500 }
    );
  }
}
