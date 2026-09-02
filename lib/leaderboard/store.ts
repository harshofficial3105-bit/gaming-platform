export interface LeaderboardRecord {
  id: string;
  gameId: string;
  userId: string;
  playerName: string;
  avatar: string;
  country: string;
  score: number;
  durationSeconds?: number;
  isRegistered: boolean;
  submittedAt: string;
  scoreType?: 'highest' | 'lowest';
  unitLabel?: string;
}

export interface PlatformPilotRanking {
  userId: string;
  playerName: string;
  avatar: string;
  country: string;
  platformPoints: number;
  gamesParticipated: number;
  topFinishesCount: number;
  bestRank: number;
}

export interface TrendingCompetition {
  gameId: string;
  activeEntriesCount: number;
  topScore: number;
  lastActive: string;
}

// Runtime storage cache for real verified scores
let runtimeScores: LeaderboardRecord[] = [
  {
    id: 'lead_seed_1',
    gameId: 'space-gem-collector',
    userId: 'pilot_seed_1',
    playerName: 'HyperPilot_99',
    avatar: '👑',
    country: 'GLOBAL',
    score: 14250,
    durationSeconds: 120,
    isRegistered: true,
    submittedAt: new Date(Date.now() - 3600000).toISOString(),
    scoreType: 'highest',
    unitLabel: 'PTS',
  },
  {
    id: 'lead_seed_2',
    gameId: 'cyber-track-2026',
    userId: 'pilot_seed_2',
    playerName: 'NeonRacer_X',
    avatar: '🏎️',
    country: 'GLOBAL',
    score: 18600,
    durationSeconds: 150,
    isRegistered: true,
    submittedAt: new Date(Date.now() - 7200000).toISOString(),
    scoreType: 'highest',
    unitLabel: 'PTS',
  },
  {
    id: 'lead_seed_3',
    gameId: 'neon-grid-breaker',
    userId: 'pilot_seed_1',
    playerName: 'HyperPilot_99',
    avatar: '👑',
    country: 'GLOBAL',
    score: 5400,
    durationSeconds: 90,
    isRegistered: true,
    submittedAt: new Date(Date.now() - 10800000).toISOString(),
    scoreType: 'highest',
    unitLabel: 'PTS',
  },
  {
    id: 'lead_seed_4',
    gameId: 'void-runner',
    userId: 'pilot_seed_3',
    playerName: 'GravitySurfer',
    avatar: '🚀',
    country: 'GLOBAL',
    score: 3200,
    durationSeconds: 110,
    isRegistered: true,
    submittedAt: new Date(Date.now() - 14400000).toISOString(),
    scoreType: 'highest',
    unitLabel: 'M',
  },
];

export const leaderboardStore = {
  /**
   * Submit a verified score from a registered user
   */
  submitScore(record: Omit<LeaderboardRecord, 'id' | 'submittedAt'>): { success: boolean; error?: string; record?: LeaderboardRecord } {
    if (!record.isRegistered || !record.userId) {
      return {
        success: false,
        error: 'Only registered user accounts are eligible for the Global Hall of Fame.',
      };
    }

    const newRecord: LeaderboardRecord = {
      ...record,
      id: `lead_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      submittedAt: new Date().toISOString(),
      scoreType: record.scoreType || 'highest',
    };

    // Check if player already has an existing score for this game
    const existingIndex = runtimeScores.findIndex(
      (s) => s.gameId === record.gameId && (s.userId === record.userId || s.playerName === record.playerName)
    );

    if (existingIndex >= 0) {
      const existing = runtimeScores[existingIndex];
      const isBetter = record.scoreType === 'lowest' 
        ? record.score < existing.score 
        : record.score > existing.score;

      if (isBetter) {
        runtimeScores[existingIndex] = newRecord;
      }
    } else {
      runtimeScores.push(newRecord);
    }

    return { success: true, record: newRecord };
  },

  /**
   * Get real leaderboard rankings for a specific game
   */
  getLeaderboard(gameId: string, timeframe: 'all-time' | 'weekly' | 'daily' = 'all-time'): LeaderboardRecord[] {
    const now = Date.now();
    const ONE_DAY = 24 * 60 * 60 * 1000;
    const ONE_WEEK = 7 * ONE_DAY;

    const filtered = runtimeScores.filter((entry) => {
      if (entry.gameId !== gameId) return false;
      if (!entry.isRegistered) return false;

      const entryTime = new Date(entry.submittedAt).getTime();
      if (timeframe === 'daily' && now - entryTime > ONE_DAY) return false;
      if (timeframe === 'weekly' && now - entryTime > ONE_WEEK) return false;

      return true;
    });

    const isLowest = filtered[0]?.scoreType === 'lowest';

    // Sort order
    return filtered.sort((a, b) => {
      if (isLowest) {
        return a.score - b.score || new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime();
      }
      return b.score - a.score || new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime();
    });
  },

  /**
   * Calculate Platform-Wide Rankings using Fair Normalized Points (Percentile/Rank-based)
   */
  getPlatformRankings(): PlatformPilotRanking[] {
    // 1. Group records by gameId
    const gameGroups: Record<string, LeaderboardRecord[]> = {};
    runtimeScores.forEach((r) => {
      if (!gameGroups[r.gameId]) gameGroups[r.gameId] = [];
      gameGroups[r.gameId].push(r);
    });

    // 2. Compute points for each pilot across each game
    const pilotMap: Record<string, {
      userId: string;
      playerName: string;
      avatar: string;
      country: string;
      platformPoints: number;
      gamesParticipated: number;
      topFinishesCount: number;
      bestRank: number;
    }> = {};

    Object.keys(gameGroups).forEach((gId) => {
      const sortedGameScores = leaderboardStore.getLeaderboard(gId, 'all-time');
      const totalParticipants = sortedGameScores.length;

      sortedGameScores.forEach((entry, rankIndex) => {
        const rank = rankIndex + 1;
        let points = 50; // Participation

        if (rank === 1) points = 1000;
        else if (rank === 2) points = 750;
        else if (rank === 3) points = 500;
        else {
          const percentile = (rank / totalParticipants) * 100;
          if (percentile <= 10) points = 300;
          else if (percentile <= 25) points = 150;
        }

        if (!pilotMap[entry.userId]) {
          pilotMap[entry.userId] = {
            userId: entry.userId,
            playerName: entry.playerName,
            avatar: entry.avatar,
            country: entry.country,
            platformPoints: 0,
            gamesParticipated: 0,
            topFinishesCount: 0,
            bestRank: rank,
          };
        }

        pilotMap[entry.userId].platformPoints += points;
        pilotMap[entry.userId].gamesParticipated += 1;
        if (rank <= 3) pilotMap[entry.userId].topFinishesCount += 1;
        pilotMap[entry.userId].bestRank = Math.min(pilotMap[entry.userId].bestRank, rank);
      });
    });

    return Object.values(pilotMap).sort((a, b) => b.platformPoints - a.platformPoints);
  },

  /**
   * Get newest verified records across all games
   */
  getRecentVerifiedRecords(limit = 20): LeaderboardRecord[] {
    return [...runtimeScores]
      .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
      .slice(0, limit);
  },

  /**
   * Get trending competitions based on activity
   */
  getTrendingCompetitions(): TrendingCompetition[] {
    const counts: Record<string, { count: number; topScore: number; lastActive: string }> = {};

    runtimeScores.forEach((r) => {
      if (!counts[r.gameId]) {
        counts[r.gameId] = { count: 0, topScore: r.score, lastActive: r.submittedAt };
      }
      counts[r.gameId].count++;
      counts[r.gameId].topScore = Math.max(counts[r.gameId].topScore, r.score);
      if (new Date(r.submittedAt).getTime() > new Date(counts[r.gameId].lastActive).getTime()) {
        counts[r.gameId].lastActive = r.submittedAt;
      }
    });

    return Object.keys(counts)
      .map((gId) => ({
        gameId: gId,
        activeEntriesCount: counts[gId].count,
        topScore: counts[gId].topScore,
        lastActive: counts[gId].lastActive,
      }))
      .sort((a, b) => b.activeEntriesCount - a.activeEntriesCount);
  },

  /**
   * Get specific player platform statistics
   */
  getPlayerStats(userId: string): { platformPoints: number; globalRank: number; topFinishesCount: number; gamesParticipated: number } {
    const rankings = this.getPlatformRankings();
    const rankIndex = rankings.findIndex((p) => p.userId === userId);

    if (rankIndex >= 0) {
      const pilot = rankings[rankIndex];
      return {
        platformPoints: pilot.platformPoints,
        globalRank: rankIndex + 1,
        topFinishesCount: pilot.topFinishesCount,
        gamesParticipated: pilot.gamesParticipated,
      };
    }

    return {
      platformPoints: 0,
      globalRank: 0,
      topFinishesCount: 0,
      gamesParticipated: 0,
    };
  },
};