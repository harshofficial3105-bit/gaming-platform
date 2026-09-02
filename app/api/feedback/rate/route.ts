import { NextRequest, NextResponse } from 'next/server';
import { gameRatings } from '@/lib/feedback/ratings';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const gameId = searchParams.get('gameId');
    const userId = searchParams.get('userId') || undefined;

    if (!gameId) {
      return NextResponse.json({ error: 'Missing gameId parameter' }, { status: 400 });
    }

    const summary = gameRatings.getSummary(gameId, userId);
    return NextResponse.json({ success: true, summary });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { gameId, userId = 'anonymous_client', rating } = body;

    if (!gameId || typeof rating !== 'number' || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Invalid gameId or rating (must be integer between 1 and 5)' },
        { status: 400 }
      );
    }

    // Set or edit user's rating
    const updatedSummary = gameRatings.setUserRating(gameId, userId, rating);

    return NextResponse.json({
      success: true,
      message: 'Rating recorded successfully',
      summary: updatedSummary,
    });
  } catch (err: any) {
    console.error('Rating API Error:', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const gameId = searchParams.get('gameId');
    const userId = searchParams.get('userId');

    if (!gameId || !userId) {
      return NextResponse.json({ error: 'Missing gameId or userId' }, { status: 400 });
    }

    const updatedSummary = gameRatings.removeUserRating(gameId, userId);
    return NextResponse.json({
      success: true,
      message: 'Rating removed successfully',
      summary: updatedSummary,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}