import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Schedule from '@/models/Schedule';
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

    // Find schedule and verify ownership
    const schedule = await Schedule.findOne({
      _id: params.id,
      userId: user.userId,
    });

    if (!schedule) {
      return NextResponse.json({ error: 'Schedule not found' }, { status: 404 });
    }

    await Schedule.deleteOne({ _id: params.id });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Delete schedule error:', error);
    return NextResponse.json(
      { error: 'Server error deleting schedule' },
      { status: 500 }
    );
  }
}
