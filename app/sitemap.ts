import type { MetadataRoute } from 'next';
import { getAllGames } from '@/lib/games';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const games = getAllGames();

  // 1. Static Root Page
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
  ];

  // 2. Category Pages
  const categories = ['arcade', 'action', 'puzzle', 'strategy', 'sports', 'casual'];
  const categoryPages: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${baseUrl}/categories/${cat}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // 3. Dynamic Game Detail Pages
  const gamePages: MetadataRoute.Sitemap = games.map((game) => ({
    url: `${baseUrl}/games/${game.slug}`,
    lastModified: new Date(game.publishedAt),
    changeFrequency: 'monthly',
    priority: 0.9,
  }));

  return [...staticPages, ...categoryPages, ...gamePages];
}
