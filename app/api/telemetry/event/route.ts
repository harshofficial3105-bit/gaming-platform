import { NextRequest, NextResponse } from 'next/server';
import { telemetryStore } from '@/lib/telemetry/events';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { gameId, eventType = 'game.start', durationSeconds, score } = body;

    if (!gameId) {
      return NextResponse.json({ error: 'Missing gameId' }, { status: 400 });
    }

    const record = telemetryStore.recordEvent({
      gameId,
      eventType,
      durationSeconds: typeof durationSeconds === 'number' ? durationSeconds : undefined,
      score: typeof score === 'number' ? score : undefined,
    });

    return NextResponse.json({
      success: true,
      recordId: record.id,
      timestamp: record.timestamp,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Telemetry failure' }, { status: 500 });
  }
}