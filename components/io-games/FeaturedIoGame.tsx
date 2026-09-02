'use client';

import React from 'react';
import Link from 'next/link';
import { ExtendedGame } from '@/lib/games';
import { GameImage } from '@/components/ui/GameImage';
import { Zap, Users, Play, Globe, Shield, Swords } from 'lucide-react';

interface FeaturedIoGameProps {
  game: ExtendedGame;
  playerCount: number;
}

export function FeaturedIoGame({ game, playerCount }: FeaturedIoGameProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl border-2 border-indigo-400/40 dark:border-indigo-500/40 bg-gradient-to-br from-indigo-900/40 via-[#0B1128] to-[#060A18] text-white p-5 sm:p-7 shadow-2xl shadow-indigo-950/60 transition-all group">
      
      {/* Dynamic Animated Cosmic Arena Orbs */}
      <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-cyan-500/20 blur-3xl group-hover:bg-cyan-500/30 transition-all pointer-events-none animate-pulse duration-1000" />
      <div className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-purple-600/20 blur-3xl group-hover:bg-purple-600/30 transition-all pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        
        {/* Left: Info & Live Multiplayer Stats (7 Cols) */}
        <div className="lg:col-span-7 space-y-4 text-left">
          
          {/* Header Badges */}
          <div className="flex flex-wrap items-center gap-2 font-mono text-[11px]">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 text-black font-black uppercase tracking-wider shadow-lg shadow-amber-500/20">
              <Swords className="h-3.5 w-3.5 fill-black" />
              <span>FEATURED ARENA</span>
            </span>

            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-950/90 border border-indigo-400/50 text-indigo-200 font-bold">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-emerald-400">{playerCount.toLocaleString()}</span>
              <span>Warriors Online</span>
            </span>

            <span className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-900/80 border border-slate-800 text-slate-300">
              <Globe className="h-3 w-3 text-cyan-400" />
              <span>Multi-Region Servers</span>
            </span>
          </div>

          {/* Title & Description */}
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-4xl font-black font-display tracking-tight text-white drop-shadow-md">
              {game.title}
            </h2>
            <p className="text-xs sm:text-sm text-indigo-100/80 max-w-xl leading-relaxed">
              {game.description}
            </p>
          </div>

          {/* Action CTA & Quick Info */}
          <div className="flex flex-wrap items-center gap-3 pt-1 font-mono">
            <Link
              href={`/games/${game.slug}`}
              className="flex items-center gap-2 px-7 py-3 rounded-2xl bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-600 hover:from-cyan-300 hover:to-purple-500 text-black font-black text-xs sm:text-sm shadow-xl shadow-cyan-500/30 active:scale-95 transition-all cursor-pointer"
            >
              <Zap className="h-4 w-4 fill-black" />
              <span>ENTER BATTLE ARENA</span>
            </Link>

            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-indigo-950/60 border border-indigo-500/30 text-xs text-indigo-200">
              <Users className="h-3.5 w-3.5 text-cyan-400" />
              <span>Real-Time Free For All</span>
            </div>
          </div>

        </div>

        {/* Right: Interactive Lens Preview (5 Cols) */}
        <div className="lg:col-span-5">
          <Link
            href={`/games/${game.slug}`}
            className="group/lens relative block aspect-[16/10] rounded-2xl overflow-hidden border-2 border-indigo-400/50 shadow-2xl shadow-indigo-950/80 cursor-pointer"
          >
            <GameImage
              src={game.thumbnailUrl}
              alt={game.title}
              priority
              className="w-full h-full object-cover group-hover/lens:scale-108 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-indigo-950/30 group-hover/lens:bg-transparent transition-colors flex items-center justify-center">
              <div className="h-14 w-14 rounded-full bg-cyan-400 text-black flex items-center justify-center pl-1 shadow-xl shadow-cyan-400/50 group-hover/lens:scale-110 transition-transform">
                <Play className="h-6 w-6 fill-black" />
              </div>
            </div>
          </Link>
        </div>

      </div>

    </div>
  );
}