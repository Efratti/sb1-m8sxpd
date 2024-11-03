import { NextResponse } from 'next/server';
import { queries } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import crypto from 'crypto';

export async function GET() {
  try {
    const events = queries.getAllEvents();
    return NextResponse.json(events);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const json = await request.json();
    const eventId = crypto.randomUUID();

    const event = queries.createEvent({
      id: eventId,
      ...json,
      userId: session.user.id,
    });

    return NextResponse.json(event);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create event' },
      { status: 500 }
    );
  }
}