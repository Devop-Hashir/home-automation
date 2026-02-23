import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Schedule from '@/models/Schedule';
import Device from '@/models/Device';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const schedules = await Schedule.find({ userId: user.userId }).populate('deviceId');

    return NextResponse.json({ schedules });
  } catch (error: any) {
    console.error('Get schedules error:', error);
    return NextResponse.json(
      { error: 'Server error fetching schedules' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { deviceId, time, action } = await request.json();

    if (!deviceId || !time || !action) {
      return NextResponse.json(
        { error: 'Device ID, time, and action are required' },
        { status: 400 }
      );
    }

    // Verify device ownership
    const device = await Device.findOne({
      _id: deviceId,
      userId: user.userId,
    });

    if (!device) {
      return NextResponse.json({ error: 'Device not found' }, { status: 404 });
    }

    const schedule = await Schedule.create({
      deviceId,
      userId: user.userId,
      time,
      action,
    });

    return NextResponse.json({ schedule }, { status: 201 });
  } catch (error: any) {
    console.error('Create schedule error:', error);
    return NextResponse.json(
      { error: 'Server error creating schedule' },
      { status: 500 }
    );
  }
}
