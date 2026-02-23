import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Room from '@/models/Room';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const rooms = await Room.find({ userId: user.userId }).sort({ name: 1 });

    return NextResponse.json({ rooms });
  } catch (error: any) {
    console.error('Get rooms error:', error);
    return NextResponse.json(
      { error: 'Server error fetching rooms' },
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

    const { name } = await request.json();

    if (!name) {
      return NextResponse.json(
        { error: 'Room name is required' },
        { status: 400 }
      );
    }

    const room = await Room.create({
      name,
      userId: user.userId,
    });

    return NextResponse.json({ room }, { status: 201 });
  } catch (error: any) {
    console.error('Create room error:', error);
    return NextResponse.json(
      { error: 'Server error creating room' },
      { status: 500 }
    );
  }
}
