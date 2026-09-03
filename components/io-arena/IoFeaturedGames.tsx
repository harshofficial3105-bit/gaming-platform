'use client';

import React from 'react';
import Link from 'next/link';
import { ExtendedGame } from '@/lib/games';
import { GameImage } from '@/components/ui/GameImage';
import { Flame, Zap, Users, Play, Star, ShieldCheck } from 'lucide-react';

interface IoFeaturedGamesProps {
  games: ExtendedGame[];
}

export function IoFeaturedGames({ games }: IoFeaturedGamesProps) {
  const featured = games.slice(0, 2);

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between border-b border-indigo-200/80 dark:border-indigo-900/60 pb-3">
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center h-7 w-7 rounded-xl bg-gradient-to-tr from-rose-500 to-amber-500 text-black shadow-md">
            <Flame className="h-4 w-4 fill-black" />
          </span>
          <h2 className="text-xl sm:text-2xl font-black font-display text-slate-900 dark:text-white">
            FEATURED IN THE ARENA
          </h2>
        </div>
        <span className="text-xs font-mono text-indigo-600 dark:text-cyan-400 font-bold">
          TOP COMBAT PORTALS
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {featured.map((game, idx) => (
          <div
            key={game.id}
            className="group relative rounded-3xl border border-indigo-300/80 dark:border-indigo-500/40 bg-gradient-to-br from-white via-indigo-50/40 to-white dark:from-[#0D1533] dark:via-[#090E24] dark:to-[#060918] p-5 sm:p-6 shadow-xl shadow-indigo-950/10 dark:shadow-indigo-950/50 hover:border-cyan-400 transition-all duration-300 overflow-hidden flex flex-col justify-between"
          >
            {/* Top Ambient Glow */}
            <div className="absolute -top-16 -right-16 h-40 w-40 rounded-full bg-cyan-500/15 blur-2xl group-hover:bg-cyan-500/25 transition-all pointer-events-none" />

            <div className="space-y-4 relative z-10">
              {/* Media Preview */}
              <div className="relative aspect-[16/9] rounded-2xl overflow-hidden border border-indigo-200 dark:border-indigo-900/80 bg-slate-100 dark:bg-slate-950">
                <GameImage
                  src={game.thumbnailUrl}
                  alt={game.title}
                  priority={idx === 0}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Badges */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <span className="px-3 py-1 rounded-full text-[10px] font-mono font-black uppercase bg-rose-500 text-black shadow-md">
                    FEATURED ARENA
                  </span>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-indigo-950/80 backdrop-blur-md text-cyan-300 border border-indigo-400/40">
                    ★ {game.rating || 4.9}
                  </span>
                </div>

                <div className="absolute bottom-3 right-3">
                  <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-black/75 backdrop-blur-md text-emerald-400 border border-emerald-500/40">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                    <span>{(game.basePlayerCount || 1200).toLocaleString()} Active</span>
                  </span>
                </div>
              </div>

              {/* Information */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-black font-display text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-cyan-400 transition-colors">
                    {game.title}
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-100 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800">
                    {game.category}
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                  {game.description}
                </p>
              </div>
            </div>

            {/* Action CTA */}
            <div className="pt-4 mt-4 border-t border-indigo-100 dark:border-indigo-900/60 relative z-10 flex items-center justify-between font-mono text-xs">
              <span className="text-slate-500 text-[11px]">
                Instant matchmaking
              </span>

              <Link
                href={`/games/${game.slug}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold shadow-md shadow-indigo-950/20 active:scale-95 transition-all cursor-pointer"
              >
                <Play className="h-3.5 w-3.5 fill-white" />
                <span>PLAY NOW →</span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}