'use client';

import React, { useState, useMemo } from 'react';
import { getIoArenaGames, ExtendedGame } from '@/lib/games';
import { useIoPlayerCounts } from '@/hooks/useIoPlayerCounts';
import { IoArenaHero } from '@/components/io-arena/IoArenaHero';
import { IoFeaturedGames } from '@/components/io-arena/IoFeaturedGames';
import { IoArenaCategories, ArenaCategoryType } from '@/components/io-arena/IoArenaCategories';
import { IoGameGrid } from '@/components/io-arena/IoGameGrid';
import { IoArenaActivity } from '@/components/io-arena/IoArenaActivity';
import { IoRankings } from '@/components/io-arena/IoRankings';
import { IoTournaments } from '@/components/io-arena/IoTournaments';

export default function IoArenaPage() {
  const [selectedCategory, setSelectedCategory] = useState<ArenaCategoryType>('all');
  const allIoGames = useMemo(() => getIoArenaGames(), []);

  // Compute live simulated presence jitter
  const initialCounts = useMemo(() => {
    const map: Record<string, number> = {};
    allIoGames.forEach((g) => {
      map[g.id] = g.basePlayerCount || 950;
    });
    return map;
  }, [allIoGames]);

  const { counts: playerCounts } = useIoPlayerCounts(initialCounts);

  // Filtered games
  const filteredGames = useMemo(() => {
    if (selectedCategory === 'all') return allIoGames;
    if (selectedCategory === 'classic') {
      return allIoGames.filter(
        (g) => g.tags?.includes('classic') || g.tags?.includes('snake') || g.tags?.includes('retro')
      );
    }
    if (selectedCategory === 'board') {
      return allIoGames.filter((g) => g.category === 'board' || g.category === 'casual');
    }
    return allIoGames.filter(
      (g) =>
        g.category.toLowerCase() === selectedCategory.toLowerCase() ||
        (g.tags && g.tags.includes(selectedCategory.toLowerCase()))
    );
  }, [allIoGames, selectedCategory]);

  // Compute counts for each category
  const categoryCounts = useMemo(() => {
    const counts: Record<ArenaCategoryType, number> = {
      all: allIoGames.length,
      battle: allIoGames.filter((g) => g.category === 'battle' || g.tags?.includes('battle')).length,
      shooting: allIoGames.filter((g) => g.category === 'shooting' || g.tags?.includes('shooting')).length,
      racing: allIoGames.filter((g) => g.category === 'racing' || g.tags?.includes('racing')).length,
      strategy: allIoGames.filter((g) => g.category === 'strategy' || g.tags?.includes('strategy')).length,
      classic: allIoGames.filter((g) => g.tags?.includes('classic') || g.tags?.includes('snake')).length,
      board: allIoGames.filter((g) => g.category === 'board' || g.category === 'casual').length,
    };
    return counts;
  }, [allIoGames]);

  return (
    <div className="space-y-12 py-2">
      
      {/* 1. Immersive Hero Stage */}
      <IoArenaHero />

      {/* 2. Featured In The Arena */}
      <IoFeaturedGames games={allIoGames} />

      {/* 3. Category Filter Matrix */}
      <div id="arena-grid" className="space-y-6 scroll-mt-24">
        <IoArenaCategories
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          counts={categoryCounts}
        />

        {/* 4. Arena Game Grid */}
        <IoGameGrid
          games={filteredGames}
          playerCounts={playerCounts}
          onResetFilters={() => setSelectedCategory('all')}
        />
      </div>

      {/* 5. Live Arena Activity & Server Topology */}
      <IoArenaActivity />

      {/* 6. Arena Rankings Leaderboard */}
      <IoRankings />

      {/* 7. Future Tournament Architecture Preview */}
      <IoTournaments />

    </div>
  );
}