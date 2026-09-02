'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ExtendedGame } from '@/lib/games';
import { GameImage } from '@/components/ui/GameImage';
import { isFavorite, toggleFavorite } from '@/lib/storage/favorites';
import { Heart, Flame, Star } from 'lucide-react';

interface GamePortalProps {
  game: ExtendedGame;
  priority?: boolean;
}

export function GamePortal({ game, priority = false }: GamePortalProps) {
  const [playsCount, setPlaysCount] = useState<number>(1);
  const [liveRating, setLiveRating] = useState<number>(game.rating || 4.8);
  const [favorited, setFavorited] = useState<boolean>(false);

  const loadData = () => {
    try {
      const playKey = `arcadehub_game_${game.id}_plays`;
      const savedPlays = Number(localStorage.getItem(playKey) || 0);
      setPlaysCount(Math.max(1, savedPlays));
    } catch {
      setPlaysCount(1);
    }
    setFavorited(isFavorite(game.id));
  };

  useEffect(() => {
    loadData();

    const handleRatingUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<{ gameId: string; average: number }>;
      if (customEvent.detail && customEvent.detail.gameId === game.id) {
        setLiveRating(customEvent.detail.average);
      }
    };

    const handleFavUpdate = () => {
      setFavorited(isFavorite(game.id));
    };

    window.addEventListener('arcadehub_play_count_updated', loadData);
    window.addEventListener('arcadehub_rating_updated', handleRatingUpdate);
    window.addEventListener('arcadehub_favorites_updated', handleFavUpdate);
    return () => {
      window.removeEventListener('arcadehub_play_count_updated', loadData);
      window.removeEventListener('arcadehub_rating_updated', handleRatingUpdate);
      window.removeEventListener('arcadehub_favorites_updated', handleFavUpdate);
    };
  }, [game.id]);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const nextState = toggleFavorite(game.id);
    setFavorited(nextState);
  };

  const formatPlays = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1).replace(/\.0$/, '')}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1).replace(/\.0$/, '')}K`;
    return num.toString();
  };

  const releaseYear = new Date(game.publishedAt || '2026-08-30').getFullYear();

  return (
    <Link
      href={`/games/${game.slug}`}
      className="group relative block w-full aspect-[4/3] rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-200 dark:border-transparent hover:border-purple-500 hover:ring-2 hover:ring-purple-500/50 hover:shadow-[0_12px_36px_rgba(168,85,247,0.3)] transition-all duration-300 transform hover:-translate-y-1.5 cursor-pointer bg-white dark:bg-[#0B1120] shadow-sm"
    >
      {/* 1. Full-Bleed Game Thumbnail */}
      <GameImage
        src={game.thumbnailUrl}
        alt={game.title}
        priority={priority}
        className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
      />

      {/* 2. Top-Right 1-Click Favorite Heart Button */}
      <button
        type="button"
        onClick={handleFavoriteClick}
        aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
        title={favorited ? 'Remove from favorites' : 'Add to favorites'}
        className={`absolute top-2.5 right-2.5 z-30 flex items-center justify-center h-7 w-7 rounded-full backdrop-blur-md border transition-all cursor-pointer active:scale-90 ${
          favorited
            ? 'bg-rose-950/90 border-rose-500 text-rose-400 opacity-100 shadow-md shadow-rose-950/50'
            : 'bg-black/60 border-white/20 text-slate-300 opacity-0 group-hover:opacity-100 hover:bg-rose-950/80 hover:text-rose-400 hover:border-rose-500/60'
        }`}
      >
        <Heart className={`h-3.5 w-3.5 ${favorited ? 'fill-rose-400 text-rose-400' : 'text-white'}`} />
      </button>

      {/* 3. Default Title Pill on Bottom-Right */}
      <div className="absolute bottom-2.5 right-2.5 group-hover:opacity-0 transition-opacity duration-200 pointer-events-none">
        <span className="px-2.5 py-1 rounded-xl bg-black/80 dark:bg-black/75 backdrop-blur-md border border-white/20 dark:border-white/10 text-white font-sans font-bold text-[10px] sm:text-xs shadow-lg">
          {game.title}
        </span>
      </div>

      {/* 4. HOVER OVERLAY HUD */}
      <div className="absolute inset-0 bg-gradient-to-t from-purple-950/95 via-indigo-950/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 sm:p-4 text-white z-20 pointer-events-none">
        
        {/* Game Title */}
        <h3 className="text-sm sm:text-base font-black font-display text-white tracking-tight drop-shadow-md truncate">
          {game.title}
        </h3>

        {/* Metadata Row */}
        <div className="flex items-center gap-2 mt-1.5 font-mono text-[10px] sm:text-[11px]">
          
          {/* Category Pill */}
          <span className="px-2.5 py-0.5 rounded-full bg-indigo-900/90 border border-indigo-400/40 text-white font-bold capitalize shadow-sm">
            {game.category}
          </span>

          {/* Year */}
          <span className="text-slate-200 font-bold">
            {releaseYear}
          </span>

          {/* Plays */}
          <span className="flex items-center gap-1 text-white font-bold">
            <Flame className="h-3 w-3 text-cyan-400" />
            <span>{formatPlays(playsCount)}</span>
          </span>

          {/* Likes / Rating */}
          <span className="flex items-center gap-1 text-white font-bold">
            <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
            <span>{liveRating > 0 ? liveRating.toFixed(1) : '4.8'}</span>
          </span>

        </div>

      </div>
    </Link>
  );
}