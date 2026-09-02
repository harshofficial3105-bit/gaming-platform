'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Game } from '@/types/game';
import { GameImage } from '@/components/ui/GameImage';

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
    <section className="relative w-full h-full overflow-hidden rounded-3xl border border-slate-800/80 bg-gradient-to-b from-[#0B1120] via-[#050811] to-[#0B1120] p-5 sm:p-7 shadow-xl flex flex-col justify-between space-y-5">
      
      {/* Ambient Glow */}
      <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />

      {/* Top Details & Badges */}
      <div className="relative z-10 space-y-3.5 text-left">
        
        {/* Badges */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 font-mono text-[10px] font-bold text-cyan-300">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping" />
            FEATURED PORTAL
          </span>
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-full border border-cyan-500/40 bg-[#050811] font-mono text-[10px] font-bold text-cyan-300 shadow-sm">
            <span className="text-cyan-400">▶</span>
            <span>{playsCount.toLocaleString()} Plays</span>
          </span>
          <span className="px-2.5 py-1 rounded-full border border-purple-500/30 bg-purple-950/40 font-mono text-[10px] font-bold text-purple-300">
            ⚡ 60 FPS Engine
          </span>
          <span className="px-2.5 py-1 rounded-full border border-slate-800 bg-slate-900/80 font-mono text-[10px] text-slate-300">
            ⏱ ~{featuredGame.playTimeMinutes || 3} min
          </span>
        </div>

        {/* Title & Description */}
        <div className="space-y-1.5">
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white font-sans">
            {featuredGame.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed line-clamp-2">
            {featuredGame.description}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3 pt-1">
          <Link
            href={`/games/${featuredGame.slug}`}
            className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-black font-mono font-black text-xs sm:text-sm shadow-xl shadow-cyan-500/25 active:scale-95 transition-all cursor-pointer"
          >
            <span>PLAY NOW</span>
            <span className="text-base leading-none">➔</span>
          </Link>

          <div className="flex items-center gap-2 px-3 py-2 rounded-2xl border border-slate-800 bg-slate-900/60 font-mono text-xs text-slate-400">
            <span>🎮 {featuredGame.controls.split(' ')[0] || 'Controls'}</span>
            <span>•</span>
            <span>{featuredGame.isMobileFriendly ? '📱 Mobile Ready' : '🖥️ Desktop'}</span>
          </div>
        </div>

      </div>

      {/* Visual Game Preview Lens */}
      <div className="relative z-10 w-full">
        <Link
          href={`/games/${featuredGame.slug}`}
          className="group relative block w-full aspect-[16/9] max-h-[220px] rounded-2xl overflow-hidden border border-slate-800 hover:border-cyan-400 transition-all shadow-xl"
        >
          <GameImage
            src={featuredGame.thumbnailUrl}
            alt={featuredGame.title}
            className="object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-black/30 group-hover:bg-transparent transition-colors flex items-center justify-center">
            <div className="h-12 w-12 rounded-full bg-cyan-500/90 text-black flex items-center justify-center pl-1 shadow-lg shadow-cyan-500/50 group-hover:scale-110 transition-transform">
              ▶
            </div>
          </div>
        </Link>
      </div>

    </section>
  );
}