'use client';

import React from 'react';
import Link from 'next/link';
import { Zap, Swords, ArrowRight, Trophy, Users, ShieldAlert } from 'lucide-react';

export function IoArenaPortal() {
  return (
    <section className="relative overflow-hidden rounded-3xl sm:rounded-[36px] border border-indigo-400/40 dark:border-cyan-500/40 bg-gradient-to-r from-indigo-950 via-[#0C122C] to-[#060918] text-white p-6 sm:p-10 shadow-2xl shadow-indigo-950/40 group">
      
      {/* Dynamic Cosmic Battlefield Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl group-hover:bg-cyan-500/30 transition-all pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#6366f120_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        
        {/* Left Copy */}
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-400/50 text-cyan-300 font-mono text-[11px] font-bold">
            <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>STANDALONE DESTINATION AVAILABLE</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black font-display tracking-tight text-white flex items-center gap-3">
            <span>🎯 ENTER THE IO ARENA</span>
          </h2>

          <div className="font-mono text-xs sm:text-sm font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-300 tracking-wider uppercase">
            COMPETE • SURVIVE • DOMINATE
          </div>

          <p className="text-xs sm:text-sm text-indigo-100/85 leading-relaxed font-sans">
            Jump into our dedicated multiplayer combat world. Fast-paced browser arenas, real-time matchmaking, live PvP leaderboards, and zero downloads.
          </p>
        </div>

        {/* Right CTA Box */}
        <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center gap-3 w-full lg:w-auto font-mono text-xs shrink-0">
          <Link
            href="/io-arena"
            className="flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-600 hover:from-cyan-300 hover:to-purple-500 text-black font-black text-sm shadow-xl shadow-cyan-500/25 active:scale-95 transition-all cursor-pointer"
          >
            <span>ENTER THE ARENA</span>
            <ArrowRight className="h-4 w-4 stroke-[3]" />
          </Link>

          <div className="flex items-center justify-center gap-3 text-slate-300 text-[11px]">
            <span className="flex items-center gap-1">
              <Users className="h-3 w-3 text-emerald-400" />
              <span>Multiplayer PvP</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Trophy className="h-3 w-3 text-amber-400" />
              <span>Global Ranks</span>
            </span>
          </div>
        </div>

      </div>

    </section>
  );
}