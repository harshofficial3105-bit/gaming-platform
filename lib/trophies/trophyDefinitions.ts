import { TrophyDefinition } from './trophyTypes';

export const TROPHY_DEFINITIONS: TrophyDefinition[] = [
  // ==========================================
  // CATEGORY 1: GETTING STARTED
  // ==========================================
  {
    id: 'first_flight',
    title: 'First Flight',
    description: 'Launch and play your first game on the grid',
    category: 'getting_started',
    icon: '🚀',
    evaluator: (ctx) => {
      const target = 1;
      const current = Math.min(target, ctx.uniqueGamesPlayed);
      const isMet = ctx.uniqueGamesPlayed >= target;
      return {
        target,
        current,
        percentage: isMet ? 100 : 0,
        isMet,
        requirementLabel: 'Play 1 game',
      };
    },
  },
  {
    id: 'arcade_explorer',
    title: 'Arcade Explorer',
    description: 'Play 5 different games (or all available if under 5)',
    category: 'getting_started',
    icon: '🎮',
    evaluator: (ctx) => {
      const target = Math.min(5, Math.max(1, ctx.totalGames));
      const current = Math.min(target, ctx.uniqueGamesPlayed);
      const isMet = ctx.uniqueGamesPlayed >= target;
      const percentage = Math.min(100, Math.round((current / target) * 100));
      return {
        target,
        current,
        percentage,
        isMet,
        requirementLabel: `Play ${target} distinct games`,
      };
    },
  },

  // ==========================================
  // CATEGORY 2: PLATFORM EXPLORATION (AUTO-SCALING)
  // ==========================================
  {
    id: 'grid_scout',
    title: 'Grid Scout',
    description: 'Play 10% of all available games on the platform',
    category: 'exploration',
    icon: '🧭',
    evaluator: (ctx) => {
      const target = Math.max(1, Math.ceil(ctx.totalGames * 0.10));
      const current = Math.min(target, ctx.uniqueGamesPlayed);
      const isMet = ctx.uniqueGamesPlayed >= target;
      const ratio = ctx.totalGames > 0 ? (ctx.uniqueGamesPlayed / ctx.totalGames) : 0;
      const percentage = Math.min(100, Math.round((ratio / 0.10) * 100));
      return {
        target,
        current,
        percentage: isMet ? 100 : percentage,
        isMet,
        requirementLabel: `Play 10% of games (${target} total)`,
      };
    },
  },
  {
    id: 'grid_explorer',
    title: 'Grid Explorer',
    description: 'Play 25% of all available games on the platform',
    category: 'exploration',
    icon: '🗺️',
    evaluator: (ctx) => {
      const target = Math.max(1, Math.ceil(ctx.totalGames * 0.25));
      const current = Math.min(target, ctx.uniqueGamesPlayed);
      const isMet = ctx.uniqueGamesPlayed >= target;
      const ratio = ctx.totalGames > 0 ? (ctx.uniqueGamesPlayed / ctx.totalGames) : 0;
      const percentage = Math.min(100, Math.round((ratio / 0.25) * 100));
      return {
        target,
        current,
        percentage: isMet ? 100 : percentage,
        isMet,
        requirementLabel: `Play 25% of games (${target} total)`,
      };
    },
  },
  {
    id: 'grid_pioneer',
    title: 'Grid Pioneer',
    description: 'Play 50% of all available games on the platform',
    category: 'exploration',
    icon: '🌌',
    evaluator: (ctx) => {
      const target = Math.max(1, Math.ceil(ctx.totalGames * 0.50));
      const current = Math.min(target, ctx.uniqueGamesPlayed);
      const isMet = ctx.uniqueGamesPlayed >= target;
      const ratio = ctx.totalGames > 0 ? (ctx.uniqueGamesPlayed / ctx.totalGames) : 0;
      const percentage = Math.min(100, Math.round((ratio / 0.50) * 100));
      return {
        target,
        current,
        percentage: isMet ? 100 : percentage,
        isMet,
        requirementLabel: `Play 50% of games (${target} total)`,
      };
    },
  },
  {
    id: 'grid_master',
    title: 'Grid Master',
    description: 'Play 75% of all available games on the platform',
    category: 'exploration',
    icon: '👑',
    evaluator: (ctx) => {
      const target = Math.max(1, Math.ceil(ctx.totalGames * 0.75));
      const current = Math.min(target, ctx.uniqueGamesPlayed);
      const isMet = ctx.uniqueGamesPlayed >= target;
      const ratio = ctx.totalGames > 0 ? (ctx.uniqueGamesPlayed / ctx.totalGames) : 0;
      const percentage = Math.min(100, Math.round((ratio / 0.75) * 100));
      return {
        target,
        current,
        percentage: isMet ? 100 : percentage,
        isMet,
        requirementLabel: `Play 75% of games (${target} total)`,
      };
    },
  },
  {
    id: 'arcade_legend',
    title: 'Arcade Legend',
    description: 'Play 100% of all available games on the platform',
    category: 'exploration',
    icon: '🏆',
    evaluator: (ctx) => {
      const target = Math.max(1, ctx.totalGames);
      const current = Math.min(target, ctx.uniqueGamesPlayed);
      const isMet = ctx.uniqueGamesPlayed >= target && ctx.totalGames > 0;
      const percentage = Math.min(100, Math.round((ctx.uniqueGamesPlayed / target) * 100));
      return {
        target,
        current,
        percentage: isMet ? 100 : percentage,
        isMet,
        requirementLabel: `Play all ${target} games`,
      };
    },
  },

  // ==========================================
  // CATEGORY 3: COLLECTION / FAVORITES (AUTO-SCALING)
  // ==========================================
  {
    id: 'taste_tester',
    title: 'Taste Tester',
    description: 'Bookmark 3 games to your favorites vault',
    category: 'collection',
    icon: '❤️',
    evaluator: (ctx) => {
      const target = Math.min(3, Math.max(1, ctx.totalGames));
      const current = Math.min(target, ctx.favoritesCount);
      const isMet = ctx.favoritesCount >= target;
      const percentage = Math.min(100, Math.round((current / target) * 100));
      return {
        target,
        current,
        percentage,
        isMet,
        requirementLabel: `Favorite ${target} games`,
      };
    },
  },
  {
    id: 'game_collector',
    title: 'Game Collector',
    description: 'Bookmark 10% of all available games to your vault',
    category: 'collection',
    icon: '💎',
    evaluator: (ctx) => {
      const target = Math.max(1, Math.ceil(ctx.totalGames * 0.10));
      const current = Math.min(target, ctx.favoritesCount);
      const isMet = ctx.favoritesCount >= target;
      const ratio = ctx.totalGames > 0 ? (ctx.favoritesCount / ctx.totalGames) : 0;
      const percentage = Math.min(100, Math.round((ratio / 0.10) * 100));
      return {
        target,
        current,
        percentage: isMet ? 100 : percentage,
        isMet,
        requirementLabel: `Favorite 10% of games (${target} total)`,
      };
    },
  },
  {
    id: 'curator',
    title: 'Curator',
    description: 'Bookmark 25% of all available games to your vault',
    category: 'collection',
    icon: '⭐',
    evaluator: (ctx) => {
      const target = Math.max(1, Math.ceil(ctx.totalGames * 0.25));
      const current = Math.min(target, ctx.favoritesCount);
      const isMet = ctx.favoritesCount >= target;
      const ratio = ctx.totalGames > 0 ? (ctx.favoritesCount / ctx.totalGames) : 0;
      const percentage = Math.min(100, Math.round((ratio / 0.25) * 100));
      return {
        target,
        current,
        percentage: isMet ? 100 : percentage,
        isMet,
        requirementLabel: `Favorite 25% of games (${target} total)`,
      };
    },
  },

  // ==========================================
  // CATEGORY 4: PLATFORM SCORE ACHIEVEMENTS
  // ==========================================
  {
    id: 'score_hunter',
    title: 'Score Hunter',
    description: 'Establish a verified personal best in 3 different scoring games',
    category: 'scores',
    icon: '🥉',
    evaluator: (ctx) => {
      const target = Math.min(3, Math.max(1, ctx.scoreSupportedGames));
      const current = Math.min(target, ctx.personalBestCount);
      const isMet = ctx.personalBestCount >= target;
      const percentage = Math.min(100, Math.round((current / target) * 100));
      return {
        target,
        current,
        percentage,
        isMet,
        requirementLabel: `Score in ${target} games`,
      };
    },
  },
  {
    id: 'score_specialist',
    title: 'Score Specialist',
    description: 'Establish verified personal bests in 10 different games',
    category: 'scores',
    icon: '🥈',
    evaluator: (ctx) => {
      const target = Math.min(10, Math.max(1, ctx.scoreSupportedGames));
      const current = Math.min(target, ctx.personalBestCount);
      const isMet = ctx.personalBestCount >= target;
      const percentage = Math.min(100, Math.round((current / target) * 100));
      return {
        target,
        current,
        percentage,
        isMet,
        requirementLabel: `Score in ${target} games`,
      };
    },
  },
  {
    id: 'score_master',
    title: 'Score Master',
    description: 'Set personal best records in 25% of all scoring games',
    category: 'scores',
    icon: '🥇',
    evaluator: (ctx) => {
      const target = Math.max(1, Math.ceil(ctx.scoreSupportedGames * 0.25));
      const current = Math.min(target, ctx.personalBestCount);
      const isMet = ctx.personalBestCount >= target;
      const ratio = ctx.scoreSupportedGames > 0 ? (ctx.personalBestCount / ctx.scoreSupportedGames) : 0;
      const percentage = Math.min(100, Math.round((ratio / 0.25) * 100));
      return {
        target,
        current,
        percentage: isMet ? 100 : percentage,
        isMet,
        requirementLabel: `Set bests in 25% of scoring games (${target} games)`,
      };
    },
  },
  {
    id: 'high_roller',
    title: 'High Roller',
    description: 'Accumulate a combined total of 1,000+ points across your personal best records',
    category: 'scores',
    icon: '🔥',
    evaluator: (ctx) => {
      const target = 1000;
      const current = Math.min(target, ctx.totalScoreSum);
      const isMet = ctx.totalScoreSum >= target;
      const percentage = Math.min(100, Math.round((current / target) * 100));
      return {
        target,
        current,
        percentage,
        isMet,
        requirementLabel: `Accumulate 1,000 total score points (${ctx.totalScoreSum.toLocaleString()} / 1,000 PTS)`,
      };
    },
  },

  // ==========================================
  // CATEGORY 5: PLAYER ACTIVITY
  // ==========================================
  {
    id: 'quick_start',
    title: 'Quick Start',
    description: 'Launch and complete 3 game sessions',
    category: 'activity',
    icon: '⚡',
    evaluator: (ctx) => {
      const target = 3;
      const current = Math.min(target, ctx.totalSessions);
      const isMet = ctx.totalSessions >= target;
      const percentage = Math.min(100, Math.round((current / target) * 100));
      return {
        target,
        current,
        percentage,
        isMet,
        requirementLabel: `Complete 3 game sessions (${ctx.totalSessions} / 3)`,
      };
    },
  },
  {
    id: 'active_player',
    title: 'Active Pilot',
    description: 'Play games on 3 distinct active days',
    category: 'activity',
    icon: '📅',
    evaluator: (ctx) => {
      const target = 3;
      const current = Math.min(target, ctx.activeDaysCount);
      const isMet = ctx.activeDaysCount >= target;
      const percentage = Math.min(100, Math.round((current / target) * 100));
      return {
        target,
        current,
        percentage,
        isMet,
        requirementLabel: `Play on 3 active days (${ctx.activeDaysCount} / 3 Days)`,
      };
    },
  },
  {
    id: 'regular_pilot',
    title: 'Regular Pilot',
    description: 'Play games on 7 distinct active days',
    category: 'activity',
    icon: '💻',
    evaluator: (ctx) => {
      const target = 7;
      const current = Math.min(target, ctx.activeDaysCount);
      const isMet = ctx.activeDaysCount >= target;
      const percentage = Math.min(100, Math.round((current / target) * 100));
      return {
        target,
        current,
        percentage,
        isMet,
        requirementLabel: `Play on 7 active days (${ctx.activeDaysCount} / 7 Days)`,
      };
    },
  },
  {
    id: 'dedicated_pilot',
    title: 'Dedicated Pilot',
    description: 'Play games on 30 distinct active days',
    category: 'activity',
    icon: '🌟',
    evaluator: (ctx) => {
      const target = 30;
      const current = Math.min(target, ctx.activeDaysCount);
      const isMet = ctx.activeDaysCount >= target;
      const percentage = Math.min(100, Math.round((current / target) * 100));
      return {
        target,
        current,
        percentage,
        isMet,
        requirementLabel: `Play on 30 active days (${ctx.activeDaysCount} / 30 Days)`,
      };
    },
  },

  // ==========================================
  // CATEGORY 6: COMPETITION (LEADERBOARD VERIFIED)
  // ==========================================
  {
    id: 'first_entry',
    title: 'First Entry',
    description: 'Appear on any verified Global Hall of Fame leaderboard',
    category: 'competition',
    icon: '🏅',
    evaluator: (ctx) => {
      const isMet = ctx.leaderboardStats.hasEntry;
      return {
        target: 1,
        current: isMet ? 1 : 0,
        percentage: isMet ? 100 : 0,
        isMet,
        requirementLabel: 'Register verified score on any leaderboard',
      };
    },
  },
  {
    id: 'rising_player',
    title: 'Rising Pilot',
    description: 'Reach Top 100 rank on any Global Hall of Fame leaderboard',
    category: 'competition',
    icon: '🥉',
    evaluator: (ctx) => {
      const isMet = ctx.leaderboardStats.isTop100;
      return {
        target: 1,
        current: isMet ? 1 : 0,
        percentage: isMet ? 100 : 0,
        isMet,
        requirementLabel: 'Rank Top 100 globally',
      };
    },
  },
  {
    id: 'elite_player',
    title: 'Elite Pilot',
    description: 'Reach Top 25 rank on any Global Hall of Fame leaderboard',
    category: 'competition',
    icon: '🥈',
    evaluator: (ctx) => {
      const isMet = ctx.leaderboardStats.isTop25;
      return {
        target: 1,
        current: isMet ? 1 : 0,
        percentage: isMet ? 100 : 0,
        isMet,
        requirementLabel: 'Rank Top 25 globally',
      };
    },
  },
  {
    id: 'champion',
    title: 'Champion',
    description: 'Reach Top 10 rank on any Global Hall of Fame leaderboard',
    category: 'competition',
    icon: '🥇',
    evaluator: (ctx) => {
      const isMet = ctx.leaderboardStats.isTop10;
      return {
        target: 1,
        current: isMet ? 1 : 0,
        percentage: isMet ? 100 : 0,
        isMet,
        requirementLabel: 'Rank Top 10 globally',
      };
    },
  },
  {
    id: 'number_one',
    title: 'Number One',
    description: 'Reach #1 position on any Global Hall of Fame leaderboard',
    category: 'competition',
    icon: '👑',
    evaluator: (ctx) => {
      const isMet = ctx.leaderboardStats.isTop1;
      return {
        target: 1,
        current: isMet ? 1 : 0,
        percentage: isMet ? 100 : 0,
        isMet,
        requirementLabel: 'Claim #1 on global leaderboard',
      };
    },
  },
];