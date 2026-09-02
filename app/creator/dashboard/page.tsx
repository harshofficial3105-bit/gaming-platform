'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getActiveCreator, getGamesByCreator, CreatorUser, CreatorGame, logoutCreator } from '@/lib/creator/auth';

export default function CreatorDashboardPage() {
  const [creator, setCreator] = useState<CreatorUser | null>(null);
  const [myGames, setMyGames] = useState<CreatorGame[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const active = getActiveCreator();
    setCreator(active);

    if (active) {
      const owned = getGamesByCreator(active.id);
      setMyGames(owned);
    }

    const handleAuthChange = () => {
      const updated = getActiveCreator();
      setCreator(updated);
      if (updated) {
        setMyGames(getGamesByCreator(updated.id));
      } else {
        setMyGames([]);
      }
    };

    window.addEventListener('arcadehub_creator_auth_changed', handleAuthChange);
    return () => window.removeEventListener('arcadehub_creator_auth_changed', handleAuthChange);
  }, []);

  const handleSignOut = () => {
    logoutCreator();
    setCreator(null);
    setMyGames([]);
  };

  if (!mounted) return null;

  // 1. ACCESS PROTECTION GATEWAY (When Visitor / Unauthenticated)
  if (!creator) {
    return (
      <div className="max-w-md mx-auto py-16 px-4 text-center font-sans space-y-6">
        <div className="rounded-3xl border border-purple-500/30 bg-[#0B1120] p-8 shadow-2xl space-y-6">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-3xl bg-purple-950/60 border border-purple-500/40 text-purple-400 text-3xl font-mono">
            🛠️
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-black text-white font-display">
              CREATOR CONSOLE
            </h1>
            <p className="text-xs text-slate-400 leading-relaxed">
              Build, publish, and track verified telemetry analytics for your HTML5 games.
            </p>
          </div>

          <div className="space-y-3 pt-2 font-mono text-xs">
            <Link
              href="/creator/login"
              className="block w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold transition-all shadow-lg shadow-purple-900/40"
            >
              SIGN IN TO CONSOLE →
            </Link>
            <Link
              href="/creator/signup"
              className="block w-full py-3 rounded-xl border border-slate-800 bg-[#050811] hover:border-slate-700 text-slate-300 font-bold transition-colors"
            >
              BECOME A CREATOR
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Calculate real metrics strictly from this creator's uploaded games
  const totalPlays = myGames.reduce((acc, g) => acc + (g.plays || 0), 0);
  const totalOpenIssues = myGames.reduce((acc, g) => acc + (g.openIssues || 0), 0);
  const avgRating = myGames.length > 0 
    ? (myGames.reduce((acc, g) => acc + (g.rating || 0), 0) / myGames.length).toFixed(1)
    : '0.0';

  return (
    <div className="space-y-6 font-sans pb-12">
      
      {/* 1. Authenticated Welcome Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black font-display text-white">
              Welcome back, <span className="text-purple-400">{creator.studioName}</span>
            </h1>
          </div>
          <p className="text-xs font-mono text-slate-400 mt-0.5">
            Studio ID: <span className="text-slate-300">{creator.id}</span> • Account: {creator.email}
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <Link
            href="/creator/preview"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-800 bg-[#050811] hover:border-cyan-500/50 hover:text-cyan-300 text-slate-300 font-bold transition-all cursor-pointer"
          >
            <span>🔬</span>
            <span>Live Sandbox</span>
          </Link>
          <Link
            href="/creator/submit"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold shadow-md cursor-pointer transition-all active:scale-95"
          >
            <span>+</span>
            <span>UPLOAD NEW GAME</span>
          </Link>
          <button
            type="button"
            onClick={handleSignOut}
            className="px-3 py-2 rounded-xl border border-slate-800 bg-[#050811] hover:border-rose-500/50 hover:text-rose-400 text-slate-400 font-bold transition-colors cursor-pointer"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* 2. Real Telemetry Overview Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
        <div className="rounded-2xl border border-slate-800/80 bg-[#0B1120] p-4 flex flex-col justify-between space-y-2 shadow-lg">
          <span className="text-xs text-slate-400">PUBLISHED GAMES</span>
          <span className="text-2xl font-black text-purple-400">{myGames.length}</span>
        </div>
        <div className="rounded-2xl border border-slate-800/80 bg-[#0B1120] p-4 flex flex-col justify-between space-y-2 shadow-lg">
          <span className="text-xs text-slate-400">TOTAL PLAYS</span>
          <span className="text-2xl font-black text-cyan-400">{totalPlays.toLocaleString()}</span>
        </div>
        <div className="rounded-2xl border border-slate-800/80 bg-[#0B1120] p-4 flex flex-col justify-between space-y-2 shadow-lg">
          <span className="text-xs text-slate-400">AVERAGE RATING</span>
          <span className="text-2xl font-black text-amber-400">{avgRating} ★</span>
        </div>
        <div className="rounded-2xl border border-slate-800/80 bg-[#0B1120] p-4 flex flex-col justify-between space-y-2 shadow-lg">
          <span className="text-xs text-slate-400">REPORTED ISSUES</span>
          <span className="text-2xl font-black text-rose-400">{totalOpenIssues}</span>
        </div>
      </div>

      {/* 3. Studio Catalog & Pipeline Lifecycle */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800/60 pb-3">
          <h2 className="text-base font-bold font-display text-white flex items-center gap-2">
            <span>🎮</span>
            <span>Your Studio Catalog & Lifecycle</span>
          </h2>
          <span className="text-xs font-mono text-slate-400">
            {myGames.length} {myGames.length === 1 ? 'Game' : 'Games'} in Studio
          </span>
        </div>

        {myGames.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 font-sans">
            {myGames.map((game) => (
              <div
                key={game.id}
                className="rounded-2xl border border-slate-800/80 bg-[#0B1120] p-4 space-y-3 shadow-lg hover:border-purple-500/40 transition-colors flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-0.5">
                      <h3 className="text-sm font-bold text-white truncate">
                        {game.title}
                      </h3>
                      <span className="text-[10px] font-mono text-purple-300 bg-purple-950/60 border border-purple-500/30 px-2 py-0.5 rounded-full uppercase">
                        {game.category}
                      </span>
                    </div>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md ${
                      game.status === 'published'
                        ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/40'
                        : 'bg-amber-950/80 text-amber-400 border border-amber-500/40'
                    }`}>
                      {game.status === 'published' ? 'LIVE ON GRID' : 'UNDER REVIEW'}
                    </span>
                  </div>

                  {/* Submission Pipeline Stepper */}
                  <div className="p-2.5 rounded-xl bg-[#050811] border border-slate-800/60 space-y-1.5 font-mono text-[10px]">
                    <span className="text-slate-400 font-bold block">PIPELINE STATUS</span>
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <span className="text-emerald-400">✓ Ingested</span>
                      <span>➔</span>
                      <span className="text-emerald-400">✓ AST Scanned</span>
                      <span>➔</span>
                      <span className={game.status === 'published' ? 'text-emerald-400' : 'text-amber-400'}>
                        {game.status === 'published' ? '✓ Grid Live' : '⏳ Reviewing'}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-1 font-mono text-xs text-center">
                    <div className="bg-[#050811] p-2 rounded-xl border border-slate-800/60">
                      <span className="text-[10px] text-slate-500 block">Plays</span>
                      <span className="font-bold text-white">{game.plays || 0}</span>
                    </div>
                    <div className="bg-[#050811] p-2 rounded-xl border border-slate-800/60">
                      <span className="text-[10px] text-slate-500 block">Rating</span>
                      <span className="font-bold text-amber-400">{game.rating ? `${game.rating}★` : 'N/A'}</span>
                    </div>
                    <div className="bg-[#050811] p-2 rounded-xl border border-slate-800/60">
                      <span className="text-[10px] text-slate-500 block">Issues</span>
                      <span className="font-bold text-slate-300">{game.openIssues || 0}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between font-mono text-xs border-t border-slate-800/60 mt-2">
                  <Link
                    href="/creator/preview"
                    className="text-purple-400 hover:text-purple-300 font-bold flex items-center gap-1"
                  >
                    <span>🔬 Test SDK</span>
                  </Link>
                  <Link
                    href={`/games/${game.slug}`}
                    className="text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1"
                  >
                    <span>View Portal ➔</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State Onboarding Card (Zero Fake Numbers) */
          <div className="rounded-3xl border border-dashed border-slate-800 bg-[#0B1120]/60 p-8 sm:p-12 text-center space-y-6">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-3xl bg-purple-950/40 border border-purple-500/30 text-purple-400 text-3xl">
              🎮
            </div>

            <div className="space-y-2 max-w-md mx-auto">
              <h3 className="text-lg font-bold font-display text-white">
                Welcome to your Creator Console
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                You haven&apos;t published any games yet. Upload your first HTML5 game package to start tracking real-time player telemetry, ratings, and bug reports.
              </p>
            </div>

            <div className="pt-2">
              <Link
                href="/creator/submit"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-mono text-xs font-bold shadow-xl shadow-purple-950/50 transition-all active:scale-95"
              >
                <span>🚀</span>
                <span>UPLOAD YOUR FIRST GAME</span>
              </Link>
            </div>

            {/* Quick 3-Step Requirements Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 max-w-2xl mx-auto text-left font-mono text-xs border-t border-slate-800/80">
              <div className="bg-[#050811] p-3.5 rounded-2xl border border-slate-800 space-y-1">
                <span className="text-purple-400 font-bold">1. Package ZIP</span>
                <p className="text-[11px] text-slate-400">Bundle HTML5, JS, and CSS with entry point <code className="text-cyan-400">index.html</code></p>
              </div>
              <div className="bg-[#050811] p-3.5 rounded-2xl border border-slate-800 space-y-1">
                <span className="text-purple-400 font-bold">2. Manifest.json</span>
                <p className="text-[11px] text-slate-400">Define title, orientation, dimensions, and control schemes</p>
              </div>
              <div className="bg-[#050811] p-3.5 rounded-2xl border border-slate-800 space-y-1">
                <span className="text-purple-400 font-bold">3. Sandbox Test</span>
                <p className="text-[11px] text-slate-400">Run automated AST security scanner and live preview</p>
              </div>
            </div>

          </div>
        )}
      </div>

    </div>
  );
}