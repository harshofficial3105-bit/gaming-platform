import { Game, GameCategory } from '@/types/game';

// Curated Game Catalog Data
export const GAMES_CATALOG: Game[] = [
  {
    id: 'space-gem-collector',
    slug: 'space-gem-collector',
    title: 'Space Gem Collector',
    description: 'Pilot your ship through deep space, dodge cosmic hazards, and harvest glowing energy gems in this fast-paced 60 FPS arcade collector.',
    category: 'arcade',
    tags: ['arcade', 'space', 'retro', '2d', 'casual'],
    thumbnailUrl: '/images/games/space-collector-thumb.png',
    entryUrl: '/games/test-game/index.html',
    developer: {
      name: 'Platform Studio',
      websiteUrl: 'https://github.com'
    },
    dimensions: {
      width: 800,
      height: 500
    },
    orientation: 'any',
    controls: 'Use Mouse or Arrow Keys / WASD to steer the ship and collect gems.',
    isFeatured: true,
    publishedAt: '2026-08-30T00:00:00Z'
  }
];

// --- DATA ACCESS HELPER FUNCTIONS ---

// 1. Get all available games
export function getAllGames(): Game[] {
  return GAMES_CATALOG;
}

// 2. Get a single game by its URL slug (Used for /games/[slug] dynamic routes)
export function getGameBySlug(slug: string): Game | undefined {
  return GAMES_CATALOG.find((game) => game.slug === slug);
}

// 3. Get games filtered by category (Used for category pages)
export function getGamesByCategory(category: GameCategory): Game[] {
  return GAMES_CATALOG.filter((game) => game.category === category);
}

// 4. Get featured games (Used for homepage Hero Carousel)
export function getFeaturedGames(): Game[] {
  return GAMES_CATALOG.filter((game) => game.isFeatured);
}
