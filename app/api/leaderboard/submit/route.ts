import { NextRequest, NextResponse } from 'next/server';
import { leaderboardStore } from '@/lib/leaderboard/store';
import { getGameBySlug } from '@/lib/games';
import { dispatchNotification } from '@/lib/notifications';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      gameId,
      score,
      durationSeconds = 60,
      userId,
      playerName,
      avatar = '🤖',
      country = 'GLOBAL',
      isRegistered = false,
    } = body;

    // 1. Basic validation
    if (!gameId || typeof score !== 'number' || score <= 0) {
      return NextResponse.json({ error: 'Invalid score submission payload' }, { status: 400 });
    }

    // 2. Strict Requirement: Only registered user accounts get a place on the Global Hall of Fame
    if (!isRegistered || !userId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Only registered user accounts are eligible for the Global Hall of Fame. Please sign in or register to publish your score.',
          isGuestBlocked: true,
        },
        { status: 403 }
      );
    }

    // 3. Dynamic Anti-Cheat Rate Scanner
    const game = getGameBySlug(gameId);
    if (game && game.leaderboard) {
      const maxRate = game.leaderboard.maxRatePerSec || 300;
      const duration = Math.max(1, durationSeconds);
      const scoreRate = score / duration;

      if (scoreRate > maxRate) {
        return NextResponse.json(
          {
            success: false,
            error: 'Score validation anomaly detected. Score generation rate exceeded realistic boundaries.',
            isAntiCheatFlagged: true,
          },
          { status: 422 }
        );
      }
    }

    // 4. Submit verified score
    const result = leaderboardStore.submitScore({
      gameId,
      userId,
      playerName: playerName || 'Registered Pilot',
      avatar,
      country,
      score,
      durationSeconds,
      isRegistered: true,
      scoreType: game?.leaderboard?.scoreType || 'highest',
      unitLabel: game?.leaderboard?.unitLabel || 'PTS',
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    // 5. Calculate verified rank and trigger Real-Time Notification
    if (userId) {
      try {
        const rankings = leaderboardStore.getLeaderboard(gameId, 'all-time');
        const rank = rankings.findIndex((r) => r.userId === userId) + 1;

        if (rank > 0) {
          await dispatchNotification({
            userId,
            type: 'rank_update',
            priority: rank <= 10 ? 'high' : 'normal',
            title: `Rank #${rank} on ${game?.title || gameId}!`,
            message: `Your score of ${score.toLocaleString()} PTS placed you at Rank #${rank} on the global leaderboard.`,
            actionUrl: `/leaderboards?game=${gameId}`,
            metadata: {
              game_slug: gameId,
              score,
              new_rank: rank,
            },
          });
        }
      } catch (notifErr) {
        console.warn('[Leaderboard] Notification trigger bypassed:', notifErr);
      }
    }

    return NextResponse.json({
      success: true,
      entry: result.record,
      message: 'Score successfully verified and posted to Global Hall of Fame!',
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}