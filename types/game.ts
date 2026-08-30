export type GameCategory = 
  | 'action'
  | 'arcade'
  | 'puzzle'
  | 'strategy'
  | 'sports'
  | 'casual';

export type GameOrientation = 'landscape' | 'portrait' | 'any';

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
}
