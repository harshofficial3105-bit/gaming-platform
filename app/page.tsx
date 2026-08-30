import React from 'react';
import Link from 'next/link';
import { getAllGames } from '@/lib/games';
import { GameCard } from '@/components/ui/GameCard';

export default function HomePage() {
  const games = getAllGames();

  return (
    <div className="space-y-10">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/40 p-8 sm:p-12 shadow-2xl">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-400">
            <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
            100% Free • No Downloads • Instant Play
          </div>
          
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            Play Instant Web Games in Your Browser.
          </h1>
          
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Discover lightweight, high-performance HTML5 games optimized for both desktop and mobile. Zero installations, zero lag, pure gameplay.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Link
              href="#catalog"
              className="rounded-lg bg-cyan-500 px-5 py-2.5 text-sm font-bold text-slate-950 hover:bg-cyan-400 transition-all shadow-lg shadow-cyan-500/25 active:scale-95"
            >
              Browse All Games
            </Link>
          </div>
        </div>

        {/* Decorative Ambient Glow */}
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute -right-10 -bottom-10 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl" />
      </section>

      {/* Catalog Grid Section */}
      <section id="catalog" className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-xl font-extrabold text-white tracking-tight">
              Featured Games
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Curated, fast-loading browser titles
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
            <span className="rounded-full bg-cyan-500/10 border border-cyan-500/30 px-3 py-1 text-xs font-semibold text-cyan-400 cursor-pointer">
              All ({games.length})
            </span>
            <span className="rounded-full bg-slate-900 border border-slate-800 px-3 py-1 text-xs font-medium text-slate-400 hover:text-white cursor-pointer transition-colors">
              Arcade
            </span>
            <span className="rounded-full bg-slate-900 border border-slate-800 px-3 py-1 text-xs font-medium text-slate-400 hover:text-white cursor-pointer transition-colors">
              Action
            </span>
            <span className="rounded-full bg-slate-900 border border-slate-800 px-3 py-1 text-xs font-medium text-slate-400 hover:text-white cursor-pointer transition-colors">
              Puzzle
            </span>
          </div>
        </div>

        {/* Dynamic Responsive Game Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {games.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      </section>

    </div>
  );
}
