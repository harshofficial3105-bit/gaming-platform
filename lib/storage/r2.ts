import { S3Client } from '@aws-sdk/client-s3';

// Initialize S3-compatible client for Cloudflare R2 (Server-Side Only)
const accountId = process.env.R2_ACCOUNT_ID || '';

export const r2Client = new S3Client({
  region: 'auto',
  endpoint: accountId ? `https://${accountId}.r2.cloudflarestorage.com` : undefined,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
  },
});

export const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || 'arcadehub-games';

/**
 * Generate an immutable, creator-isolated object storage path
 * Prevents any creator from overwriting another creator's game assets
 */
export function getCreatorGameStoragePath(
  creatorId: string,
  gameSlug: string,
  version: string = 'v1',
  fileName: string = 'index.html'
): string {
  // Clean paths to prevent directory traversal
  const cleanCreator = creatorId.replace(/[^a-zA-Z0-9_-]/g, '');
  const cleanSlug = gameSlug.replace(/[^a-zA-Z0-9_-]/g, '');
  const cleanVersion = version.replace(/[^a-zA-Z0-9_.-]/g, '');
  const cleanFile = fileName.replace(/^\/+/, '');

  return `creators/${cleanCreator}/games/${cleanSlug}/${cleanVersion}/${cleanFile}`;
}

/**
 * Resolve public CDN asset URL for a published game
 */
export function getGameAssetUrl(gameSlug: string, version: string = 'v1', filePath: string = 'index.html'): string {
  const gamesOrigin = process.env.NEXT_PUBLIC_R2_PUBLIC_URL || process.env.NEXT_PUBLIC_APP_URL || '';
  
  if (!gamesOrigin || gamesOrigin.includes('localhost')) {
    return `/games/${gameSlug}/${filePath}`;
  }

  return `${gamesOrigin}/games/${gameSlug}/${version}/${filePath}`;
}