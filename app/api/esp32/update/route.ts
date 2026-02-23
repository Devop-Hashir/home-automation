import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Device from '@/models/Device';
import ActivityLog from '@/models/ActivityLog';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { relayNumber, status, deviceId } = await request.json();

    if (!relayNumber && !deviceId) {
      return NextResponse.json(
        { error: 'Relay number or device ID is required' },
        { status: 400 }
      );
    }

    // Find device
    const query = deviceId ? { _id: deviceId } : { relayNumber };
    const device = await Device.findOne(query);

    if (!device) {
      return NextResponse.json({ error: 'Device not found' }, { status: 404 });
    }

    // Update device status
    device.status = status;
    device.lastUpdated = new Date();
    await device.save();

    // Create activity log
    await ActivityLog.create({
      deviceId: device._id,
      deviceName: device.name,
      action: status ? 'ON' : 'OFF',
      triggeredBy: 'Manual',
      userId: device.userId,
    });

    // TODO: Emit WebSocket event
    // io.to(`user:${device.userId}`).emit('device:update', device);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('ESP32 update error:', error);
    return NextResponse.json(
      { error: 'Server error processing ESP32 update' },
      { status: 500 }
    );
  }
}
