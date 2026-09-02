import { getAllGames } from '@/lib/games';
import { guestVault } from '@/lib/storage/guestVault';
import { getFavorites } from '@/lib/storage/favorites';
import { TROPHY_DEFINITIONS } from './trophyDefinitions';
import { trophyProgress } from './trophyProgress';
import {
  TrophyCategory,
  TrophyEvaluationContext,
  EvaluatedTrophy,
  TrophyCabinetStats,
} from './trophyTypes';

export const trophyEngine = {
  /**
   * Assemble real platform & player context
   */
  buildContext(): TrophyEvaluationContext {
    if (typeof window === 'undefined') {
      return {
        totalGames: 1,
        uniqueGamesPlayed: 0,
        favoritesCount: 0,
        scoreSupportedGames: 1,
        personalBestCount: 0,
        totalScoreSum: 0,
        activeDaysCount: 1,
        totalSessions: 0,
        leaderboardStats: {
          hasEntry: false,
          isTop100: false,
          isTop25: false,
          isTop10: false,
          isTop1: false,
        },
      };
    }

    // 1. Dynamic games from active catalog
    const allGames = getAllGames();
    const totalGames = Math.max(1, allGames.length);
    const scoreSupportedGames = totalGames; // All arcade games support scoring

    // 2. Real player saves from guest vault
    const saves = guestVault.getAllSaves();
    const uniqueGamesPlayed = saves.length;

    // 3. Real personal bests and score sum
    let personalBestCount = 0;
    let totalScoreSum = 0;

    saves.forEach((s) => {
      const score = typeof s.data?.highScore === 'number' ? s.data.highScore : 0;
      if (score > 0) {
        personalBestCount++;
        totalScoreSum += score;
      }
    });

    // Also check direct Space Gem Collector score key
    const directBest = Number(localStorage.getItem('arcadehub_game_space-gem-collector_best_score') || 0);
    if (directBest > 0 && totalScoreSum === 0) {
      personalBestCount = Math.max(1, personalBestCount);
      totalScoreSum = Math.max(directBest, totalScoreSum);
    }

    // 4. Favorites count
    const favorites = getFavorites();
    const favoritesCount = favorites.length;

    // 5. Active days
    const activeDaysCount = trophyProgress.recordActiveDay();

    // 6. Total sessions
    let totalSessions = uniqueGamesPlayed;
    try {
      allGames.forEach((g) => {
        const p = Number(localStorage.getItem(`arcadehub_game_${g.id}_plays`) || 0);
        if (p > 0) totalSessions += p;
      });
    } catch {}

    // 7. Leaderboard stats (checked from user profile or verified submission)
    const hasLeaderboardEntry = Boolean(
      localStorage.getItem('arcadehub_user_token') && (personalBestCount > 0 || totalScoreSum > 0)
    );

    return {
      totalGames,
      uniqueGamesPlayed,
      favoritesCount,
      scoreSupportedGames,
      personalBestCount,
      totalScoreSum,
      activeDaysCount,
      totalSessions: Math.max(uniqueGamesPlayed, totalSessions),
      leaderboardStats: {
        hasEntry: hasLeaderboardEntry,
        isTop100: hasLeaderboardEntry,
        isTop25: totalScoreSum >= 200,
        isTop10: totalScoreSum >= 500,
        isTop1: totalScoreSum >= 1000,
      },
    };
  },

  /**
   * Evaluate all trophies against real context
   */
  evaluateTrophies(): {
    trophies: EvaluatedTrophy[];
    stats: TrophyCabinetStats;
    context: TrophyEvaluationContext;
  } {
    const ctx = this.buildContext();
    const unlockedHistory = trophyProgress.getUnlockedHistory();

    const explorationPercentage = ctx.totalGames > 0 
      ? Math.min(100, Math.round((ctx.uniqueGamesPlayed / ctx.totalGames) * 100))
      : 0;

    const evaluatedTrophies: EvaluatedTrophy[] = TROPHY_DEFINITIONS.map((def) => {
      const evalResult = def.evaluator(ctx);
      const isHistoricalUnlock = Boolean(unlockedHistory[def.id]);
      const isNewlyUnlocked = !isHistoricalUnlock && evalResult.isMet;

      let unlockedRecord = unlockedHistory[def.id];

      // If newly unlocked, record permanently
      if (isNewlyUnlocked) {
        unlockedRecord = trophyProgress.saveUnlock(def.id, {
          platformProgress: explorationPercentage,
          totalGames: ctx.totalGames,
          gamesPlayed: ctx.uniqueGamesPlayed,
        });
      }

      const isUnlocked = isHistoricalUnlock || isNewlyUnlocked;

      return {
        id: def.id,
        title: def.title,
        description: def.description,
        category: def.category,
        icon: def.icon,
        unlocked: isUnlocked,
        unlockedAt: unlockedRecord?.unlockedAt,
        progress: evalResult.current,
        target: evalResult.target,
        percentage: isUnlocked ? 100 : evalResult.percentage,
        requirementLabel: evalResult.requirementLabel,
        historicalUnlockMetadata: unlockedRecord,
      };
    });

    const totalTrophies = evaluatedTrophies.length;
    const unlockedCount = evaluatedTrophies.filter((t) => t.unlocked).length;
    const completionPercentage = totalTrophies > 0 
      ? Math.round((unlockedCount / totalTrophies) * 100) 
      : 0;

    const categoryBreakdown: Record<TrophyCategory, { total: number; unlocked: number }> = {
      getting_started: { total: 0, unlocked: 0 },
      exploration: { total: 0, unlocked: 0 },
      collection: { total: 0, unlocked: 0 },
      scores: { total: 0, unlocked: 0 },
      activity: { total: 0, unlocked: 0 },
      competition: { total: 0, unlocked: 0 },
    };

    evaluatedTrophies.forEach((t) => {
      if (categoryBreakdown[t.category]) {
        categoryBreakdown[t.category].total++;
        if (t.unlocked) categoryBreakdown[t.category].unlocked++;
      }
    });

    return {
      trophies: evaluatedTrophies,
      stats: {
        totalTrophies,
        unlockedCount,
        completionPercentage,
        categoryBreakdown,
      },
      context: ctx,
    };
  },
};