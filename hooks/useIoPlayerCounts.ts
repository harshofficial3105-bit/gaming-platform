'use client';

import { useState, useEffect } from 'react';

/**
 * useIoPlayerCounts
 * Future-ready hook that supplies live multiplayer counts.
 * Currently uses simulated presence jitter; architected to seamlessly
 * subscribe to Supabase Realtime Channels `game:presence:${gameId}`.
 */
export function useIoPlayerCounts(initialCounts: Record<string, number> = {}) {
  const [counts, setCounts] = useState<Record<string, number>>(initialCounts);

  useEffect(() => {
    // Jitter active player presence periodically to simulate live arena matchmaking
    const interval = setInterval(() => {
      setCounts((prev) => {
        const next = { ...prev };
        Object.keys(next).forEach((key) => {
          const delta = Math.floor(Math.random() * 7) - 3; // -3 to +3
          next[key] = Math.max(50, next[key] + delta);
        });
        return next;
      });
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  const getCount = (gameId: string, fallback: number = 850) => {
    if (counts[gameId] !== undefined) return counts[gameId];
    return fallback;
  };

  return { counts, getCount };
}