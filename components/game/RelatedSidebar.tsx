'use client';

import React from 'react';
import Link from 'next/link';
import { ExtendedGame } from '@/lib/games';

interface RelatedSidebarProps {
  games: ExtendedGame[];
  title?: string;
}

export function RelatedSidebar({ games, title = 'RELATED GAMES' }: RelatedSidebarProps) {
  return (
    <aside className="w-full xl:w-72 shrink-0 rounded-2xl border border-slate-800/80 bg-slate-950/60 p-4 backdrop-blur-md space-y-4 h-fit">
      {/* Header */}
      <div className="flex items-center gap-2 text-slate-300 font-bold text-xs uppercase tracking-wider px-1">
        <span className="text-cyan-400">🎮</span>
        <span>{title}</span>
      </div>

      {/* Cards List */}
      <div className="space-y-2">
        {games.map((game) => (
          <Link
            key={game.id}
            href={`/games/${game.slug}`}
            className="flex items-center gap-3 rounded-xl border border-slate-800/60 bg-slate-900/40 p-2.5 hover:border-cyan-500/40 hover:bg-slate-900/90 transition-all group"
          >
            {/* Thumbnail Box */}
            <div className="h-14 w-20 shrink-0 overflow-hidden rounded-lg bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-800 relative flex items-center justify-center group-hover:scale-105 transition-transform">
              <span className="text-xl">
                {game.category === 'racing' ? '🏎️' :
                 game.category === 'puzzle' ? '🧩' :
                 game.category === 'action' ? '⚔️' :
                 game.category === 'adventure' ? '🤠' :
                 game.category === 'sports' ? '🏀' : '🚀'}
              </span>
            </div>

            {/* Title & Info */}
            <div className="flex-1 min-w-0 space-y-1">
              <h4 className="text-xs font-bold text-slate-200 truncate group-hover:text-cyan-400 transition-colors">
                {game.title}
              </h4>
              <div className="flex items-center justify-between text-[11px]">
                <span className="capitalize text-slate-400">{game.category}</span>
                <div className="flex items-center gap-1 font-semibold text-amber-400">
                  <span>★</span>
                  <span>{game.rating || 4.5}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* View More Games Button */}
      <Link
        href="/"
        className="flex items-center justify-center gap-2 w-full rounded-xl border border-slate-800 bg-slate-900/80 py-2.5 text-xs font-bold text-slate-300 hover:border-slate-700 hover:bg-slate-800 hover:text-white transition-all group"
      >
        <span>View More Games</span>
        <span className="group-hover:translate-x-0.5 transition-transform">→</span>
      </Link>
    </aside>
  );
}
