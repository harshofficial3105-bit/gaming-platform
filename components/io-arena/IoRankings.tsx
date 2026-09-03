'use client';

import React, { useState } from 'react';
import { Leaderboard } from '@/components/game/Leaderboard';
import { Trophy, Medal, Sparkles, ShieldCheck } from 'lucide-react';

export function IoRankings() {
  const [timeframe, setTimeframe] = useState<'today' | 'week' | 'all'>('all');

  return (
    <section id="arena-ranks" className="space-y-4 scroll-mt-24 font-mono">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-indigo-200/80 dark:border-indigo-900/60 pb-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center h-7 w-7 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-600 text-black shadow-md">
              <Trophy className="h-4 w-4 fill-black" />
            </span>
            <h2 className="text-xl sm:text-2xl font-black font-display text-slate-900 dark:text-white">
              ARENA RANKINGS
            </h2>
          </div>
          <p className="text-xs text-slate-500 font-sans">
            Verified competitive scores across all .IO combat sectors with anti-cheat replay validation.
          </p>
        </div>

        {/* Timeframe Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white dark:bg-[#070B1F] border border-indigo-200 dark:border-indigo-900 text-xs font-bold">
          {(['today', 'week', 'all'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTimeframe(t)}
              className={`px-3 py-1.5 rounded-xl uppercase transition-all cursor-pointer ${
                timeframe === t
                  ? 'bg-gradient-to-r from-indigo-600 to-cyan-500 text-white shadow-md'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {t === 'today' ? 'TODAY' : t === 'week' ? 'THIS WEEK' : 'ALL TIME'}
            </button>
          ))}
        </div>
      </div>

      <Leaderboard allowGameSwitching={true} initialExpanded={true} />
    </section>
  );
}