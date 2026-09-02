export type TrophyCategory =
  | 'getting_started'
  | 'exploration'
  | 'collection'
  | 'scores'
  | 'activity'
  | 'competition';

export interface TrophyEvaluationContext {
  totalGames: number;
  uniqueGamesPlayed: number;
  favoritesCount: number;
  scoreSupportedGames: number;
  personalBestCount: number;
  totalScoreSum: number;
  activeDaysCount: number;
  totalSessions: number;
  leaderboardStats: {
    hasEntry: boolean;
    bestRank?: number;
    isTop100: boolean;
    isTop25: boolean;
    isTop10: boolean;
    isTop1: boolean;
  };
}

export interface TrophyDefinition {
  id: string;
  title: string;
  description: string;
  category: TrophyCategory;
  icon: string;
  evaluator: (context: TrophyEvaluationContext) => {
    target: number;
    current: number;
    percentage: number;
    isMet: boolean;
    requirementLabel: string;
  };
}

export interface UnlockedTrophyRecord {
  trophyId: string;
  unlockedAt: string;
  platformProgressAtUnlock: number;
  totalGamesAtUnlock: number;
  gamesPlayedAtUnlock: number;
  metadata?: Record<string, unknown>;
}

export interface EvaluatedTrophy {
  id: string;
  title: string;
  description: string;
  category: TrophyCategory;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  progress: number;
  target: number;
  percentage: number;
  requirementLabel: string;
  historicalUnlockMetadata?: UnlockedTrophyRecord;
}

export interface TrophyCabinetStats {
  totalTrophies: number;
  unlockedCount: number;
  completionPercentage: number;
  categoryBreakdown: Record<TrophyCategory, { total: number; unlocked: number }>;
}