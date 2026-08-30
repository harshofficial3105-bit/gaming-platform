import React from 'react';
import Link from 'next/link';
import { Game } from '@/types/game';

interface GameCardProps {
  game: Game;
}

export function GameCard({ game }: GameCardProps) {
  return (
    <Link
      href={`/games/${game.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-xl border border-slate-800 bg-slate-900/60 transition-all duration-300 hover:-translate-y-1.5 hover:border-cyan-500/50 hover:shadow-xl hover:shadow-cyan-500/10"
    >
      {/* Thumbnail Container with 16:9 Aspect Ratio */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-950 flex items-center justify-center">
        {/* Placeholder Graphic / Canvas Simulation */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/40 via-slate-900 to-cyan-950/30 group-hover:scale-105 transition-transform duration-500" />
        
        <div className="relative z-10 flex flex-col items-center justify-center gap-2">
          <span className="text-4xl group-hover:scale-110 transition-transform duration-300">
            {game.category === 'arcade' ? '🚀' : game.category === 'puzzle' ? '🧩' : '⚔️'}
          </span>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Play Game
          </span>
        </div>

        {/* Category Badge */}
        <span className="absolute top-2.5 right-2.5 z-20 rounded-md bg-slate-950/80 px-2.5 py-0.5 text-xs font-medium uppercase tracking-wider text-cyan-400 border border-slate-800 backdrop-blur-sm">
          {game.category}
        </span>
      </div>

      {/* Card Content Details */}
      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-base font-bold text-white group-hover:text-cyan-400 transition-colors">
          {game.title}
        </h3>
        
        <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-slate-400">
          {game.description}
        </p>

        {/* Footer Meta: Developer & Play Action */}
        <div className="mt-auto pt-4 flex items-center justify-between text-xs text-slate-500 border-t border-slate-800/60">
          <span className="truncate">By {game.developer.name}</span>
          <span className="font-semibold text-cyan-400 group-hover:translate-x-0.5 transition-transform">
            PLAY →
          </span>
        </div>
      </div>
    </Link>
  );
}
