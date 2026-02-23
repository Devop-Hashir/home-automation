import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Device from '@/models/Device';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const devices = await Device.find({ userId: user.userId }).populate('roomId');

    return NextResponse.json({ devices });
  } catch (error: any) {
    console.error('Get devices error:', error);
    return NextResponse.json(
      { error: 'Server error fetching devices' },
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

    const { name, roomId, relayNumber, type } = await request.json();

    // Validation
    if (!name || !relayNumber || !type) {
      return NextResponse.json(
        { error: 'Name, relay number, and type are required' },
        { status: 400 }
      );
    }

    if (relayNumber < 1 || relayNumber > 16) {
      return NextResponse.json(
        { error: 'Relay number must be between 1 and 16' },
        { status: 400 }
      );
    }

    // Check for duplicate relay number
    const existingDevice = await Device.findOne({
      userId: user.userId,
      relayNumber,
    });

    if (existingDevice) {
      return NextResponse.json(
        { error: 'Relay number already in use' },
        { status: 409 }
      );
    }

    // Create device
    const device = await Device.create({
      name,
      roomId: roomId || null,
      relayNumber,
      type,
      userId: user.userId,
      status: false,
    });

    return NextResponse.json({ device }, { status: 201 });
  } catch (error: any) {
    console.error('Create device error:', error);
    return NextResponse.json(
      { error: 'Server error creating device' },
      { status: 500 }
    );
  }
}
