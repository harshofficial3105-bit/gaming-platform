import { S3Client } from '@aws-sdk/client-s3';

// 1. Initialize S3-compatible client for Cloudflare R2
const accountId = process.env.R2_ACCOUNT_ID || 'placeholder-account-id';

export const r2Client = new S3Client({
  region: 'auto',
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || 'placeholder-access-key',
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || 'placeholder-secret-key',
  },
});

export const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || 'arcadehub-games';

// 2. Helper to resolve the public CDN URL for a versioned game asset
export function getGameAssetUrl(gameSlug: string, version: string = 'v1', filePath: string = 'index.html'): string {
  // If in local development and no custom CDN origin is set, fallback to local static games
  const gamesOrigin = process.env.NEXT_PUBLIC_GAMES_URL || 'http://localhost:3000';

  // In production: https://games.mygameportal.com/space-gem-collector/v1/index.html
  // In development: http://localhost:3000/games/test-game/index.html
  if (process.env.NODE_ENV === 'development' && gamesOrigin.includes('localhost')) {
    return `/games/test-game/${filePath}`;
  }

  return `${gamesOrigin}/${gameSlug}/${version}/${filePath}`;
}
