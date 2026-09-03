'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ExtendedGame } from '@/lib/games';
import { GameImage } from '@/components/ui/GameImage';
import { isFavorite, toggleFavorite } from '@/lib/storage/favorites';
import { Users, Zap, Heart, Flame, Play, Star } from 'lucide-react';

interface IoGameCardProps {
  game: ExtendedGame;
  playerCount: number;
}

export function IoGameCard({ game, playerCount }: IoGameCardProps) {
  const [favorited, setFavorited] = useState(false);

  useEffect(() => {
    setFavorited(isFavorite(game.id));
    const handleFavUpdate = () => setFavorited(isFavorite(game.id));
    window.addEventListener('arcadehub_favorites_updated', handleFavUpdate);
    return () => window.removeEventListener('arcadehub_favorites_updated', handleFavUpdate);
  }, [game.id]);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const nextState = toggleFavorite(game.id);
    setFavorited(nextState);
  };

  const modeLabel =
    game.multiplayerMode === 'battle-royale'
      ? 'Battle Royale'
      : game.multiplayerMode === '1v1'
      ? '1v1 Duel'
      : game.multiplayerMode === 'co-op'
      ? 'Co-Op'
      : 'FFA Arena';

  return (
    <div className="group relative flex flex-col justify-between rounded-3xl border border-indigo-200/80 dark:border-indigo-900/60 bg-gradient-to-b from-white via-indigo-50/20 to-white dark:from-[#0E152C] dark:via-[#090D1C] dark:to-[#0A0F22] p-3 sm:p-3.5 shadow-lg shadow-indigo-950/5 dark:shadow-indigo-950/40 hover:shadow-2xl hover:shadow-indigo-500/20 dark:hover:shadow-indigo-500/30 hover:border-indigo-400 dark:hover:border-cyan-400 transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
      
      {/* Background Hover Aura */}
      <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-cyan-500/10 dark:bg-cyan-500/20 blur-2xl group-hover:bg-purple-500/20 transition-all pointer-events-none" />

      {/* Top Image Box */}
      <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden bg-slate-100 dark:bg-[#050811] border border-indigo-100 dark:border-indigo-950/80">
        <GameImage
          src={game.thumbnailUrl}
          alt={game.title}
          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
        />

        {/* Mode Badge */}
        <div className="absolute top-2 left-2 z-10">
          <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-indigo-950/85 backdrop-blur-md border border-indigo-400/50 text-indigo-200 shadow-md">
            <Users className="h-3 w-3 text-cyan-400" />
            <span>{modeLabel}</span>
          </span>
        </div>

        {/* Favorite Heart Button */}
        <button
          type="button"
          onClick={handleFavoriteClick}
          aria-label={favorited ? 'Remove Favorite' : 'Save Favorite'}
          className={`absolute top-2 right-2 z-20 flex items-center justify-center h-7 w-7 rounded-full backdrop-blur-md border transition-all cursor-pointer ${
            favorited
              ? 'bg-rose-950/90 border-rose-500 text-rose-400 opacity-100'
              : 'bg-black/60 border-white/20 text-white opacity-0 group-hover:opacity-100 hover:bg-rose-950/80 hover:text-rose-400'
          }`}
        >
          <Heart className={`h-3.5 w-3.5 ${favorited ? 'fill-rose-400 text-rose-400' : 'text-white'}`} />
        </button>
      </div>

      {/* Card Body */}
      <div className="pt-3 pb-1 space-y-2 relative z-10">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-black font-display text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-cyan-400 transition-colors truncate">
              {game.title}
            </h3>
            <span className="text-[10px] font-mono uppercase font-bold text-indigo-600 dark:text-indigo-400">
              {game.category}
            </span>
          </div>

          <span className="px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 shrink-0">
            ★ {game.rating || 4.9}
          </span>
        </div>

        {/* Live Active Player Count */}
        <div className="flex items-center justify-between font-mono text-[11px] pt-0.5">
          <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="font-bold text-slate-800 dark:text-slate-200">
              {playerCount.toLocaleString()}
            </span>
            <span className="text-[10px] text-slate-500">playing</span>
          </div>

          <span className="text-[9px] text-slate-500 dark:text-slate-400">
            Global Arena
          </span>
        </div>

        {/* Action Button */}
        <div className="pt-1.5">
          <Link
            href={`/games/${game.slug}`}
            className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-mono font-black text-xs shadow-md shadow-indigo-950/20 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Zap className="h-3.5 w-3.5 fill-current" />
            <span>ENTER ARENA</span>
          </Link>
        </div>
      </div>

    </div>
  );
}