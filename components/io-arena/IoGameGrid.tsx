'use client';

import React from 'react';
import { ExtendedGame } from '@/lib/games';
import { IoGameCard } from './IoGameCard';
import { Swords, RefreshCw } from 'lucide-react';

interface IoGameGridProps {
  games: ExtendedGame[];
  playerCounts: Record<string, number>;
  onResetFilters?: () => void;
}

export function IoGameGrid({ games, playerCounts, onResetFilters }: IoGameGridProps) {
  if (games.length === 0) {
    return (
      <div className="text-center py-16 rounded-3xl border border-dashed border-indigo-300 dark:border-indigo-800 bg-white/40 dark:bg-[#070A1E]/40 font-mono text-xs text-slate-500 dark:text-indigo-300 space-y-3">
        <div className="flex justify-center">
          <Swords className="h-10 w-10 text-indigo-400" />
        </div>
        <p className="font-bold text-sm text-slate-900 dark:text-white">
          No active battle arenas found in this sector.
        </p>
        <p className="max-w-md mx-auto text-xs text-slate-500">
          Try selecting another category or resetting your arena filters.
        </p>
        {onResetFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all cursor-pointer shadow-md"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Show All Arenas</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5">
      {games.map((game) => (
        <IoGameCard
          key={game.id}
          game={game}
          playerCount={playerCounts[game.id] || game.basePlayerCount || 900}
        />
      ))}
    </div>
  );
}