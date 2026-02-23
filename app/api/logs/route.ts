import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import ActivityLog from '@/models/ActivityLog';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const skip = (page - 1) * limit;

    const [logs, total] = await Promise.all([
      ActivityLog.find({ userId: user.userId })
        .sort({ timestamp: -1 })
        .skip(skip)
        .limit(limit),
      ActivityLog.countDocuments({ userId: user.userId }),
    ]);

    const pages = Math.ceil(total / limit);

    return NextResponse.json({
      logs,
      total,
      page,
      pages,
    });
  } catch (error: any) {
    console.error('Get logs error:', error);
    return NextResponse.json(
      { error: 'Server error fetching logs' },
      { status: 500 }
    );
  }
}
