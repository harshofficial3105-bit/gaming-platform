import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // 1. Enable React Strict Mode & Production Compressions
  reactStrictMode: true,
  compress: true, // Enables automatic Gzip & Brotli compression for all text assets

  // 2. Production HTTP Response Headers
  async headers() {
    return [
      {
        // Apply to all static assets (Images, Fonts, Scripts in /public and _next/static)
        source: '/:all*(svg|jpg|png|webp|woff2|css|js)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Global Security Headers for all routes
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
