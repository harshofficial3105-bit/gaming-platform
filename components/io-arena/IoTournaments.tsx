'use client';

import React from 'react';
import { Trophy, Calendar, Clock, Sparkles, Swords, ArrowRight } from 'lucide-react';

export function IoTournaments() {
  return (
    <section className="rounded-3xl border border-indigo-200/80 dark:border-indigo-900/60 bg-gradient-to-br from-indigo-50/70 via-purple-50/40 to-white dark:from-[#0B1028] dark:via-[#070A1E] dark:to-[#040612] p-6 sm:p-8 shadow-xl shadow-indigo-950/10 dark:shadow-indigo-950/30 space-y-5 font-mono">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-indigo-100 dark:border-indigo-900/50 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-amber-500" />
            <h3 className="text-base font-black uppercase tracking-wider text-slate-900 dark:text-white">
              UPCOMING ARENA EVENTS &amp; TOURNAMENTS
            </h3>
          </div>
          <p className="text-xs text-slate-500 font-sans">
            Competitive prize pools, global seasonal brackets, and live spectator streams.
          </p>
        </div>

        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-500/30">
          <Sparkles className="h-3 w-3" />
          <span>COMING SOON • SEASON 1</span>
        </span>
      </div>

      {/* Featured Tournament Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-center p-5 sm:p-6 rounded-2xl bg-white/90 dark:bg-[#070C22] border border-indigo-200 dark:border-indigo-900/80">
        
        <div className="lg:col-span-2 space-y-2">
          <div className="flex items-center gap-2 text-[11px] text-cyan-600 dark:text-cyan-400 font-bold">
            <Swords className="h-3.5 w-3.5" />
            <span>GLOBAL ARENA BRACKET #01</span>
          </div>

          <h4 className="text-lg sm:text-xl font-black font-display text-slate-900 dark:text-white">
            WEEKEND CYBER CUP: 100-WARRIOR BATTLE ROYALE
          </h4>

          <p className="text-xs text-slate-600 dark:text-slate-400 font-sans leading-relaxed">
            Elimination rounds across Cyber Battle .IO and Orbit Clash .IO. Earn verified season points, exclusive profile halos, and hall of fame medals.
          </p>
        </div>

        <div className="flex flex-col items-start lg:items-end justify-between space-y-3 font-mono">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#040716] border border-slate-200 dark:border-indigo-950 text-left lg:text-right w-full sm:w-auto">
            <span className="text-[10px] text-slate-500 block">COUNTDOWN</span>
            <span className="text-base font-black text-cyan-600 dark:text-cyan-400 flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              <span>02D : 14H : 30M</span>
            </span>
          </div>

          <button
            type="button"
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span>PRE-REGISTER</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

      </div>

    </section>
  );
}