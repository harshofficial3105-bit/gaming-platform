'use client';

import React, { useState, useMemo } from 'react';
import { getIoArenaGames, ExtendedGame } from '@/lib/games';
import { useIoPlayerCounts } from '@/hooks/useIoPlayerCounts';
import { FeaturedIoGame } from './FeaturedIoGame';
import { IoGameFilters, IoCategoryFilter } from './IoGameFilters';
import { IoGameCard } from './IoGameCard';
import { Zap, Users, Sparkles, Swords, Globe2 } from 'lucide-react';

export function IoArenaContainer() {
  const [selectedCategory, setSelectedCategory] = useState<IoCategoryFilter>('all');
  const allIoGames = useMemo(() => getIoArenaGames(), []);

  // Initial player counts map
  const initialCounts = useMemo(() => {
    const map: Record<string, number> = {};
    allIoGames.forEach((g) => {
      map[g.id] = g.basePlayerCount || 950;
    });
    return map;
  }, [allIoGames]);

  const { getCount } = useIoPlayerCounts(initialCounts);

  // Filtered games
  const filteredGames = useMemo(() => {
    if (selectedCategory === 'all') return allIoGames;
    return allIoGames.filter(
      (g) =>
        g.category.toLowerCase() === selectedCategory.toLowerCase() ||
        (g.tags && g.tags.includes(selectedCategory.toLowerCase()))
    );
  }, [allIoGames, selectedCategory]);

  // Compute category game counts
  const categoryCounts = useMemo(() => {
    const counts: Record<IoCategoryFilter, number> = {
      all: allIoGames.length,
      shooting: allIoGames.filter((g) => g.category === 'shooting' || g.tags?.includes('shooting')).length,
      racing: allIoGames.filter((g) => g.category === 'racing' || g.tags?.includes('racing')).length,
      board: allIoGames.filter((g) => g.category === 'board' || g.tags?.includes('board')).length,
      action: allIoGames.filter((g) => g.category === 'action' || g.tags?.includes('action')).length,
      puzzle: allIoGames.filter((g) => g.category === 'puzzle' || g.tags?.includes('puzzle')).length,
      battle: allIoGames.filter((g) => g.category === 'battle' || g.tags?.includes('battle')).length,
      strategy: allIoGames.filter((g) => g.category === 'strategy' || g.tags?.includes('strategy')).length,
      survival: allIoGames.filter((g) => g.category === 'survival' || g.tags?.includes('survival')).length,
    };
    return counts;
  }, [allIoGames]);

  // Featured .IO game (e.g. cyber-battle-io or first in list)
  const featuredGame = allIoGames.find((g) => g.id === 'cyber-battle-io') || allIoGames[0];
  const gridGames = allIoGames;

  // Calculate total online players across arena
  const totalArenaPlayers = allIoGames.reduce((sum, g) => sum + getCount(g.id, g.basePlayerCount || 900), 0);

  return (
    <section
      id="io-arena"
      className="relative rounded-3xl sm:rounded-[36px] overflow-hidden p-5 sm:p-8 lg:p-10 transition-all border border-indigo-300/60 dark:border-indigo-500/30 bg-gradient-to-b from-indigo-50/70 via-purple-50/40 to-slate-50 dark:from-[#0B102B] dark:via-[#070A1E] dark:to-[#040612] shadow-2xl shadow-indigo-950/20 dark:shadow-indigo-950/50 scroll-mt-24 space-y-8"
    >
      {/* 1. Dynamic Arena Energy Aura & Radial Atmosphere */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-indigo-500/10 dark:bg-indigo-600/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-cyan-500/10 dark:bg-cyan-500/15 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-20 left-10 w-[450px] h-[450px] bg-purple-500/10 dark:bg-purple-600/15 rounded-full blur-[120px] pointer-events-none" />

      {/* Decorative Arena Grid Rings */}
      <div className="absolute inset-0 bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:28px_28px] opacity-15 dark:opacity-20 pointer-events-none" />

      {/* 2. Arena Brand Header */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-indigo-200/80 dark:border-indigo-900/60 pb-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 font-mono">
            <span className="flex items-center justify-center h-7 w-7 rounded-xl bg-gradient-to-tr from-cyan-400 to-indigo-600 text-white shadow-lg shadow-cyan-500/30">
              <Zap className="h-4 w-4 fill-white" />
            </span>
            <span className="text-xs font-black tracking-widest text-indigo-600 dark:text-cyan-400 uppercase">
              ARCADEHUB.IO MULTIPLAYER
            </span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black font-display text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
            <span>.IO GAME ARENA</span>
            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950/80 border border-indigo-300 dark:border-indigo-500/40 text-indigo-700 dark:text-cyan-300">
              LIVE PVP
            </span>
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-indigo-200 font-mono">
            Fast • Competitive • Multiplayer • Jump into the arena
          </p>
        </div>

        {/* Live Arena Telemetry Badge */}
        <div className="flex items-center gap-2 font-mono text-xs">
          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/90 dark:bg-[#0E1533]/90 backdrop-blur-md border border-indigo-200 dark:border-indigo-500/40 shadow-md">
            <Users className="h-4 w-4 text-emerald-500" />
            <span className="font-bold text-slate-900 dark:text-white">
              {totalArenaPlayers.toLocaleString()}
            </span>
            <span className="text-slate-500 dark:text-indigo-300 text-[11px]">
              Players Online
            </span>
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse ml-1" />
          </div>
        </div>
      </div>

      {/* 3. Featured .IO Arena Spotlight */}
      {featuredGame && (
        <div className="relative z-10">
          <FeaturedIoGame
            game={featuredGame}
            playerCount={getCount(featuredGame.id, featuredGame.basePlayerCount || 1480)}
          />
        </div>
      )}

      {/* 4. Category Filter Matrix */}
      <div className="relative z-10 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300 flex items-center gap-1.5">
            <Swords className="h-3.5 w-3.5 text-cyan-500" />
            <span>SELECT BATTLE SECTOR</span>
          </h3>
          <span className="text-[11px] font-mono text-slate-500 dark:text-indigo-400">
            Showing {filteredGames.length} Arenas
          </span>
        </div>

        <IoGameFilters
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          counts={categoryCounts}
        />
      </div>

      {/* 5. Responsive .IO Games Grid (4 / 3 / 2 / 1) */}
      <div className="relative z-10">
        {filteredGames.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {filteredGames.map((game) => (
              <IoGameCard
                key={game.id}
                game={game}
                playerCount={getCount(game.id, game.basePlayerCount || 850)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 rounded-3xl border border-dashed border-indigo-300 dark:border-indigo-800 bg-white/40 dark:bg-[#070A1E]/40 font-mono text-xs text-slate-500 dark:text-indigo-300 space-y-2">
            <p className="font-bold">No active arenas in this category right now.</p>
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-500 transition-colors cursor-pointer"
            >
              Browse All Arenas
            </button>
          </div>
        )}
      </div>

    </section>
  );
}