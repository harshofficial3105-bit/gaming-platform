import { GameCategory, GameOrientation } from '@/types/game';

export interface GameManifest {
  title?: string;
  version?: string;
  category?: GameCategory;
  orientation?: GameOrientation;
  dimensions?: {
    width: number;
    height: number;
  };
  controls?: string;
  author?: {
    name: string;
    website?: string;
  };
}

export const manifestValidator = {
  /**
   * Parses and validates raw game.json string
   */
  parseManifest(jsonString: string): { valid: boolean; manifest?: GameManifest; error?: string } {
    try {
      const data = JSON.parse(jsonString);
      if (typeof data !== 'object' || data === null) {
        return { valid: false, error: 'Manifest must be a valid JSON object.' };
      }

      const manifest: GameManifest = {
        title: typeof data.title === 'string' ? data.title : undefined,
        version: typeof data.version === 'string' ? data.version : '1.0.0',
        category: data.category,
        orientation: data.orientation,
        dimensions: data.dimensions && typeof data.dimensions.width === 'number' && typeof data.dimensions.height === 'number'
          ? { width: data.dimensions.width, height: data.dimensions.height }
          : undefined,
        controls: typeof data.controls === 'string' ? data.controls : undefined,
        author: data.author && typeof data.author.name === 'string'
          ? { name: data.author.name, website: data.author.website }
          : undefined,
      };

      return { valid: true, manifest };
    } catch (err: any) {
      return { valid: false, error: `Invalid JSON syntax: ${err.message}` };
    }
  },
};
