import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Device from '@/models/Device';
import ActivityLog from '@/models/ActivityLog';
import { getUserFromRequest } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { deviceId, status, triggeredBy = 'Web' } = await request.json();

    if (!deviceId || status === undefined) {
      return NextResponse.json(
        { error: 'Device ID and status are required' },
        { status: 400 }
      );
    }

    // Find device and verify ownership
    const device = await Device.findOne({
      _id: deviceId,
      userId: user.userId,
    });

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
      triggeredBy,
      userId: user.userId,
    });

    // Send command to ESP32
    try {
      const esp32Client = (await import('@/lib/esp32Client')).default;
      await esp32Client.sendCommand(device.relayNumber, status ? 'ON' : 'OFF');
    } catch (error) {
      console.error('Failed to send command to ESP32:', error);
      // Continue anyway - database is updated
    }

    // TODO: Emit WebSocket event
    // io.to(`user:${user.userId}`).emit('device:update', device);

    return NextResponse.json({ success: true, device });
  } catch (error: any) {
    console.error('Update device status error:', error);
    return NextResponse.json(
      { error: 'Server error updating device status' },
      { status: 500 }
    );
  }
}
