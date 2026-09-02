import { Game } from '@/types/game';

export interface ExtendedGame extends Game {
  rating?: number;
}

export const BASE_GAMES_CATALOG: ExtendedGame[] = [
  {
    id: 'space-gem-collector',
    slug: 'space-gem-collector',
    title: 'Space Gem Collector',
    description: 'Pilot your ship through deep space, dodge cosmic hazards, and harvest glowing energy gems in this fast-paced 60 FPS arcade collector.',
    category: 'arcade',
    tags: ['arcade', 'space', 'retro', '2d', 'casual', 'high score'],
    dimensions: { width: 800, height: 500 },
    orientation: 'landscape',
    controls: 'Use Mouse or Arrow Keys / WASD to steer the ship and collect gems.',
    entryUrl: '/games/test-game/index.html',
    thumbnailUrl: '/thumbnails/space-gem-collector.svg',
    developer: { name: 'Platform Studio', websiteUrl: 'https://arcadehub.com' },
    publishedAt: '2026-08-30T00:00:00Z',
    rating: 4.8,
    playTimeMinutes: 3,
    moods: ['quick', 'competitive'],
    inputs: ['touch', 'keyboard', 'mouse'],
    isMobileFriendly: true,
    featuredBadge: '60 FPS Space Gem',
    leaderboard: {
      enabled: true,
      scoreType: 'highest',
      scoringMode: 'points',
      maxRatePerSec: 150,
      unitLabel: 'PTS',
    },
  },
  {
    id: 'cyber-track-2026',
    slug: 'cyber-track-2026',
    title: 'Cyber Track 2026',
    description: 'High-speed neon highway racing. Dodge hyper-speed traffic, push your vehicle past 180 MPH, and set new platform distance records.',
    category: 'racing',
    tags: ['racing', 'cyberpunk', 'retro', 'speed', 'synthwave'],
    dimensions: { width: 800, height: 500 },
    orientation: 'landscape',
    controls: 'Use Left/Right Arrow Keys, A/D, or Touch Tap to steer across lanes.',
    entryUrl: '/games/cyber-track-2026/index.html',
    thumbnailUrl: '/thumbnails/speed-racing.svg',
    developer: { name: 'HyperDrive Studio', websiteUrl: 'https://arcadehub.com' },
    publishedAt: '2026-09-01T00:00:00Z',
    rating: 4.9,
    playTimeMinutes: 4,
    moods: ['challenging', 'quick', 'competitive'],
    inputs: ['touch', 'keyboard'],
    isMobileFriendly: true,
    featuredBadge: 'Neon Speed',
    leaderboard: {
      enabled: true,
      scoreType: 'highest',
      scoringMode: 'distance',
      maxRatePerSec: 250,
      unitLabel: 'PTS',
    },
  },
  {
    id: 'neon-grid-breaker',
    slug: 'neon-grid-breaker',
    title: 'Neon Grid Breaker',
    description: 'Synthwave-infused brick deconstruction. Control the quantum paddle, shatter neon energy blocks, and clear multi-colored grid matrices.',
    category: 'puzzle',
    tags: ['puzzle', 'breakout', 'arcade', 'retro', 'physics'],
    dimensions: { width: 800, height: 500 },
    orientation: 'landscape',
    controls: 'Use Mouse Movement, Touch Drag, or Left/Right Arrow Keys to control the paddle.',
    entryUrl: '/games/neon-grid-breaker/index.html',
    thumbnailUrl: '/thumbnails/block-puzzle.svg',
    developer: { name: 'Quantum Block Labs', websiteUrl: 'https://arcadehub.com' },
    publishedAt: '2026-09-01T12:00:00Z',
    rating: 4.7,
    playTimeMinutes: 5,
    moods: ['relaxing', 'quick'],
    inputs: ['touch', 'keyboard', 'mouse'],
    isMobileFriendly: true,
    featuredBadge: 'Retro Synth',
    leaderboard: {
      enabled: true,
      scoreType: 'highest',
      scoringMode: 'points',
      maxRatePerSec: 200,
      unitLabel: 'PTS',
    },
  },
  {
    id: 'void-runner',
    slug: 'void-runner',
    title: 'Void Runner',
    description: 'Defy physics in a gravity-flipping cyber universe. Invert gravity to run along ceilings, evade lasers, and sprint through the endless void.',
    category: 'action',
    tags: ['action', 'runner', 'gravity', 'fast-paced', 'cyber'],
    dimensions: { width: 800, height: 500 },
    orientation: 'landscape',
    controls: 'Press Space, Up Arrow, W, or Tap Screen to flip gravity between floor and ceiling.',
    entryUrl: '/games/void-runner/index.html',
    thumbnailUrl: '/thumbnails/neon-runner.svg',
    developer: { name: 'Void Dynamic Games', websiteUrl: 'https://arcadehub.com' },
    publishedAt: '2026-09-02T00:00:00Z',
    rating: 4.9,
    playTimeMinutes: 4,
    moods: ['challenging', 'competitive'],
    inputs: ['touch', 'keyboard', 'mouse'],
    isMobileFriendly: true,
    featuredBadge: 'Gravity Flip',
    leaderboard: {
      enabled: true,
      scoreType: 'highest',
      scoringMode: 'distance',
      maxRatePerSec: 200,
      unitLabel: 'M',
    },
  },
];

export function getAllGames(): ExtendedGame[] {
  if (typeof window === 'undefined') {
    return BASE_GAMES_CATALOG;
  }

  try {
    const customRaw = localStorage.getItem('arcadehub_creator_games_db');
    if (customRaw) {
      const customGames: any[] = JSON.parse(customRaw);
      const formattedCustom: ExtendedGame[] = customGames.map((cg) => ({
        id: cg.id,
        slug: cg.slug || cg.id,
        title: cg.title,
        description: cg.description || 'Community Creator Title',
        category: (cg.category as any) || 'arcade',
        tags: cg.tags || ['creator', 'arcade'],
        dimensions: cg.dimensions || { width: 800, height: 500 },
        orientation: cg.orientation || 'landscape',
        controls: cg.controls || 'Use Mouse / Keyboard to play.',
        entryUrl: cg.entryUrl || '/games/test-game/index.html',
        thumbnailUrl: cg.thumbnailUrl || '/thumbnails/space-gem-collector.svg',
        developer: { name: cg.studioName || 'Independent Studio', websiteUrl: 'https://arcadehub.com' },
        publishedAt: cg.submittedAt || new Date().toISOString(),
        rating: 5.0,
        playTimeMinutes: 5,
        moods: ['quick', 'challenging'],
        inputs: ['keyboard', 'mouse'],
        isMobileFriendly: true,
        leaderboard: cg.leaderboard || {
          enabled: true,
          scoreType: 'highest',
          scoringMode: 'points',
          unitLabel: 'PTS',
        },
      }));

      const existingIds = new Set(BASE_GAMES_CATALOG.map((g) => g.id));
      const filteredCustom = formattedCustom.filter((g) => !existingIds.has(g.id));
      return [...BASE_GAMES_CATALOG, ...filteredCustom];
    }
  } catch (e) {}

  return BASE_GAMES_CATALOG;
}

export function getGameBySlug(slug: string): ExtendedGame | undefined {
  const games = getAllGames();
  return games.find((game) => game.slug === slug || game.id === slug);
}