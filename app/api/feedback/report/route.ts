import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { gameId, issueType, description } = body;

    if (!gameId || !issueType) {
      return NextResponse.json(
        { error: 'Invalid report: gameId and issueType are required' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Diagnostic bug report logged',
      gameId,
      issueType,
      timestamp: Date.now(),
    });
  } catch (err) {
    console.error('Report API Error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}