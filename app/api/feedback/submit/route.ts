import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, subject, message, pageUrl, browserInfo } = body;

    if (!type || !subject || !message) {
      return NextResponse.json(
        { error: 'Feedback type, subject, and message are required.' },
        { status: 400 }
      );
    }

    // Structured logging / Database persistence envelope
    const feedbackEnvelope = {
      id: `fb_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      type,
      subject: subject.trim(),
      message: message.trim(),
      pageUrl: pageUrl || 'Unknown',
      browserInfo: browserInfo || 'Unknown',
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    console.log('[Feedback API] Received new platform feedback:', feedbackEnvelope);

    return NextResponse.json({
      success: true,
      message: 'Feedback received successfully. Thank you for helping improve ArcadeHub!',
      id: feedbackEnvelope.id,
    });
  } catch (err) {
    console.error('Feedback Submit Error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}