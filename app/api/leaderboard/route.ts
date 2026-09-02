import { NextRequest, NextResponse } from 'next/server';
import { leaderboardStore } from '@/lib/leaderboard/store';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const mode = searchParams.get('mode');
    const gameId = searchParams.get('gameId');
    const timeframe = (searchParams.get('timeframe') as 'all-time' | 'weekly' | 'daily') || 'all-time';

    // 1. Platform-Wide Rankings Mode
    if (mode === 'platform') {
      const platformRankings = leaderboardStore.getPlatformRankings();
      return NextResponse.json({
        success: true,
        mode: 'platform',
        rankings: platformRankings,
      });
    }

    // 2. Trending Competitions Mode
    if (mode === 'trending') {
      const trending = leaderboardStore.getTrendingCompetitions();
      return NextResponse.json({
        success: true,
        mode: 'trending',
        trending,
      });
    }

    // 3. Recent Verified Feed Mode
    if (mode === 'recent') {
      const recent = leaderboardStore.getRecentVerifiedRecords(20);
      return NextResponse.json({
        success: true,
        mode: 'recent',
        recent,
      });
    }

    // 4. Game-Specific Leaderboard Mode
    if (!gameId) {
      return NextResponse.json({ error: 'Missing gameId or mode parameter' }, { status: 400 });
    }

    const leaderboard = leaderboardStore.getLeaderboard(gameId, timeframe);

    return NextResponse.json({
      success: true,
      gameId,
      timeframe,
      leaderboard,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}