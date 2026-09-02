export type GameCategory =
  | 'shooting'
  | 'racing'
  | 'board'
  | 'action'
  | 'puzzle'
  | 'battle'
  | 'strategy'
  | 'survival'
  | 'arcade'
  | 'casual'
  | 'sports'
  | 'adventure';

export type GameOrientation = 'landscape' | 'portrait' | 'any';

// Intent & Hardware Compatibility Types
export type PlayMood = 'quick' | 'challenging' | 'relaxing' | 'competitive';
export type InputMethod = 'touch' | 'keyboard' | 'mouse' | 'gamepad';

export interface LeaderboardConfig {
  enabled: boolean;
  scoreType: 'highest' | 'lowest';
  scoringMode: 'points' | 'time' | 'distance';
  maxRatePerSec?: number;
  minDurationSeconds?: number;
  unitLabel?: string;
}

export interface Game {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: GameCategory;
  tags: string[];
  thumbnailUrl: string;
  entryUrl: string;
  developer: {
    name: string;
    websiteUrl?: string;
  };
  dimensions: {
    width: number;
    height: number;
  };
  orientation: GameOrientation;
  controls: string;
  isFeatured?: boolean;
  publishedAt: string;

  // Extended Intent & Compatibility Metadata
  playTimeMinutes: number;
  moods: PlayMood[];
  inputs: InputMethod[];
  isMobileFriendly: boolean;
  featuredBadge?: string;

  // Dynamic Leaderboard & Anti-Cheat Metadata
  leaderboard?: LeaderboardConfig;

  // .IO Game Arena Metadata
  isIoGame?: boolean;
  multiplayerMode?: '1v1' | 'battle-royale' | 'co-op' | 'ffa';
  basePlayerCount?: number;
  serverRegions?: string[];
  isTrendingIo?: boolean;
}