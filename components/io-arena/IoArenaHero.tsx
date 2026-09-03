'use client';

import React from 'react';
import Link from 'next/link';
import { Swords, Zap, Trophy, ShieldAlert, Sparkles, Flame, Radio } from 'lucide-react';

export function IoArenaHero() {
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative overflow-hidden rounded-3xl sm:rounded-[40px] border border-indigo-400/30 dark:border-cyan-500/30 bg-gradient-to-b from-indigo-900/30 via-[#070B1F] to-[#040714] text-white p-6 sm:p-12 lg:p-16 shadow-2xl shadow-indigo-950/40">
      
      {/* 1. Digital Battlefield Ambient Energy Core */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-gradient-to-b from-cyan-500/20 via-indigo-600/15 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-20 w-[450px] h-[450px] bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-[450px] h-[450px] bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Cyber Battlefield Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#6366f115_1px,transparent_1px),linear-gradient(to_bottom,#6366f115_1px,transparent_1px)] bg-[size:32px_32px] opacity-25 pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
        
        {/* Arena Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-indigo-950/90 via-[#0C1433] to-indigo-950/90 border border-indigo-400/50 shadow-lg shadow-cyan-500/10 font-mono text-xs">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
          </span>
          <span className="text-cyan-300 font-bold tracking-widest uppercase">
            ARCADEHUB MULTIPLAYER BATTLEFIELD
          </span>
          <span className="text-indigo-400">•</span>
          <span className="text-slate-300">LOW-LATENCY SERVERS</span>
        </div>

        {/* Main Heading & Tagline */}
        <div className="space-y-3">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black font-display tracking-tight text-white drop-shadow-[0_4px_24px_rgba(0,240,255,0.3)]">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-indigo-200">
              🎯 IO ARENA
            </span>
          </h1>

          <div className="font-mono text-xs sm:text-base font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-400 uppercase">
            COMPETE • SURVIVE • DOMINATE
          </div>

          <p className="text-sm sm:text-base text-slate-300 dark:text-indigo-200/90 max-w-2xl mx-auto leading-relaxed font-sans pt-1">
            Discover fast-paced .io games built for instant action, competitive multiplayer, and endless replayability. Zero installs, zero wait times.
          </p>
        </div>

        {/* Hero Actions */}
        <div className="flex flex-wrap items-center justify-center gap-3.5 pt-3 font-mono text-xs font-bold">
          <button
            type="button"
            onClick={() => scrollToSection('arena-grid')}
            className="flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-600 hover:from-cyan-300 hover:to-purple-500 text-black font-black text-xs sm:text-sm shadow-xl shadow-cyan-500/25 active:scale-95 transition-all cursor-pointer"
          >
            <Swords className="h-4 w-4 fill-black" />
            <span>EXPLORE GAMES</span>
          </button>

          <button
            type="button"
            onClick={() => scrollToSection('arena-ranks')}
            className="flex items-center gap-2 px-6 py-3.5 rounded-2xl border border-indigo-400/40 bg-indigo-950/50 hover:bg-indigo-900/60 text-indigo-200 hover:text-white shadow-lg transition-all active:scale-95 cursor-pointer"
          >
            <Trophy className="h-4 w-4 text-amber-400" />
            <span>VIEW ARENA RANKS</span>
          </button>
        </div>

        {/* Quick Arena Telemetry Highlights */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 max-w-2xl mx-auto font-mono text-xs text-left">
          <div className="p-3 rounded-2xl bg-indigo-950/40 border border-indigo-500/20">
            <span className="text-[10px] text-slate-400 block">GAME TICK RATE</span>
            <span className="text-sm font-black text-cyan-400">60 FPS REALTIME</span>
          </div>
          <div className="p-3 rounded-2xl bg-indigo-950/40 border border-indigo-500/20">
            <span className="text-[10px] text-slate-400 block">AVG PING</span>
            <span className="text-sm font-black text-emerald-400">&lt; 25ms GLOBAL</span>
          </div>
          <div className="p-3 rounded-2xl bg-indigo-950/40 border border-indigo-500/20">
            <span className="text-[10px] text-slate-400 block">ANTI-CHEAT</span>
            <span className="text-sm font-black text-purple-300">ACTIVE REPLAY</span>
          </div>
          <div className="p-3 rounded-2xl bg-indigo-950/40 border border-indigo-500/20">
            <span className="text-[10px] text-slate-400 block">ARENA MODES</span>
            <span className="text-sm font-black text-amber-400">FFA • 1V1 • CO-OP</span>
          </div>
        </div>

      </div>
    </section>
  );
}