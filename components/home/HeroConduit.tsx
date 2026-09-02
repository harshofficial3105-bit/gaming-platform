'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Game } from '@/types/game';
import { GameImage } from '@/components/ui/GameImage';
import { Play, Flame, Sparkles, Clock, Gamepad2, Smartphone, Monitor } from 'lucide-react';

interface HeroConduitProps {
  featuredGame: Game;
}

export function HeroConduit({ featuredGame }: HeroConduitProps) {
  const [playsCount, setPlaysCount] = useState<number>(1);

  useEffect(() => {
    const loadPlays = () => {
      try {
        const playKey = `arcadehub_game_${featuredGame.id}_plays`;
        const saved = Number(localStorage.getItem(playKey) || 0);
        setPlaysCount(Math.max(1, saved));
      } catch (e) {
        setPlaysCount(1);
      }
    };
    loadPlays();

    window.addEventListener('arcadehub_play_count_updated', loadPlays);
    return () => window.removeEventListener('arcadehub_play_count_updated', loadPlays);
  }, [featuredGame.id]);

  return (
    <section className="relative w-full h-full overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#0B1120] p-5 sm:p-7 shadow-xl shadow-slate-200/60 dark:shadow-cyan-950/20 flex flex-col justify-between space-y-5 transition-colors">
      
      {/* Ambient Glow */}
      <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />

      {/* Top Details & Badges */}
      <div className="relative z-10 space-y-3.5 text-left">
        
        {/* Badges */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-cyan-300 dark:border-cyan-500/30 bg-cyan-50 dark:bg-cyan-500/10 font-mono text-[10px] font-bold text-cyan-800 dark:text-cyan-300">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-500 animate-ping" />
            FEATURED PORTAL
          </span>
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-full border border-cyan-300 dark:border-cyan-500/40 bg-white dark:bg-[#050811] font-mono text-[10px] font-bold text-cyan-800 dark:text-cyan-300 shadow-sm">
            <Flame className="h-3 w-3 text-cyan-500" />
            <span>{playsCount.toLocaleString()} Plays</span>
          </span>
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-full border border-purple-300 dark:border-purple-500/30 bg-purple-50 dark:bg-purple-950/40 font-mono text-[10px] font-bold text-purple-800 dark:text-purple-300">
            <Sparkles className="h-3 w-3 text-purple-500" />
            <span>60 FPS Engine</span>
          </span>
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 font-mono text-[10px] text-slate-700 dark:text-slate-300">
            <Clock className="h-3 w-3 text-slate-400" />
            <span>~{featuredGame.playTimeMinutes || 3} min</span>
          </span>
        </div>

        {/* Title & Description */}
        <div className="space-y-1.5">
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white font-sans">
            {featuredGame.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2">
            {featuredGame.description}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3 pt-1">
          <Link
            href={`/games/${featuredGame.slug}`}
            className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-mono font-black text-xs sm:text-sm shadow-xl shadow-cyan-500/25 active:scale-95 transition-all cursor-pointer"
          >
            <span>PLAY NOW</span>
            <Play className="h-3.5 w-3.5 fill-white stroke-white" />
          </Link>

          <div className="flex items-center gap-2 px-3 py-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 font-mono text-xs text-slate-700 dark:text-slate-400">
            <span className="flex items-center gap-1">
              <Gamepad2 className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-400" />
              <span>{featuredGame.controls.split(' ')[0] || 'Controls'}</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              {featuredGame.isMobileFriendly ? (
                <>
                  <Smartphone className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Mobile Ready</span>
                </>
              ) : (
                <>
                  <Monitor className="h-3.5 w-3.5 text-slate-400" />
                  <span>Desktop</span>
                </>
              )}
            </span>
          </div>
        </div>

      </div>

      {/* Visual Game Preview Lens */}
      <div className="relative z-10 w-full">
        <Link
          href={`/games/${featuredGame.slug}`}
          className="group relative block w-full aspect-[16/9] max-h-[220px] rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 hover:border-cyan-400 dark:hover:border-cyan-400 transition-all shadow-md"
        >
          <GameImage
            src={featuredGame.thumbnailUrl}
            alt={featuredGame.title}
            className="object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors flex items-center justify-center">
            <div className="h-12 w-12 rounded-full bg-cyan-500 text-white flex items-center justify-center pl-0.5 shadow-lg shadow-cyan-500/50 group-hover:scale-110 transition-transform">
              <Play className="h-5 w-5 fill-white stroke-white" />
            </div>
          </div>
        </Link>
      </div>

    </section>
  );
}