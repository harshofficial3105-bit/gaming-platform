'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getActiveCreator, getGamesByCreator, CreatorUser, CreatorGame, logoutCreator } from '@/lib/creator/auth';
import {
  Gamepad2,
  PlayCircle,
  Star,
  Bug,
  TrendingUp,
  Wallet,
  Upload,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  Layers,
  LogOut,
  ArrowRight,
  Clock,
  BarChart3,
  FlaskConical,
} from 'lucide-react';

export default function CreatorDashboardPage() {
  const [creator, setCreator] = useState<CreatorUser | null>(null);
  const [myGames, setMyGames] = useState<CreatorGame[]>([]);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'analytics' | 'earnings'>('dashboard');
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

  const totalPlays = myGames.reduce((sum, g) => sum + (g.plays || 0), 0);
  const ratedGames = myGames.filter((g) => g.rating && g.rating > 0);
  const avgRating =
    ratedGames.length > 0
      ? (ratedGames.reduce((sum, g) => sum + (g.rating || 0), 0) / ratedGames.length).toFixed(1)
      : '5.0';
  const totalOpenIssues = myGames.reduce((sum, g) => sum + (g.openIssues || 0), 0);

  if (!mounted) return null;

  if (!creator) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 text-center space-y-6">
        <div className="inline-flex items-center justify-center h-20 w-20 rounded-3xl bg-purple-50 dark:bg-purple-950/40 border border-purple-300 dark:border-purple-500/30 text-purple-600 dark:text-purple-400">
          <Sparkles className="h-10 w-10" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-black font-display text-slate-900 dark:text-white">
            ArcadeHub Creator Studio
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed font-sans">
            Deploy, test in real-time sandboxes, and monetize HTML5 games on the ArcadeHub Grid.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2 font-mono text-xs font-bold">
          <Link
            href="/creator/login"
            className="px-6 py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-950/30 transition-all active:scale-95"
          >
            Sign In to Studio
          </Link>
          <Link
            href="/creator/signup"
            className="px-6 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1120] text-slate-800 dark:text-slate-300 hover:border-purple-500/50 shadow-sm"
          >
            Create Studio Account
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-4 space-y-8">
      
      {/* 1. Creator Studio Workspace Header */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#0B1120] p-6 sm:p-8 shadow-xl shadow-slate-200/50 dark:shadow-2xl transition-colors relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-purple-600 to-cyan-500 p-[2px] shadow-lg shadow-purple-500/20">
              <div className="h-full w-full bg-white dark:bg-[#050811] rounded-[14px] flex items-center justify-center">
                <Gamepad2 className="h-7 w-7 text-purple-600 dark:text-purple-400" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black font-display text-slate-900 dark:text-white">
                  {creator.studioName || 'Independent Studio'}
                </h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono bg-purple-100 dark:bg-purple-950/80 text-purple-800 dark:text-purple-300 border border-purple-300 dark:border-purple-500/40">
                  <ShieldCheck className="h-3 w-3" />
                  <span>VERIFIED CREATOR</span>
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                {creator.email} • Active Workspace
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 font-mono text-xs">
            <Link
              href="/creator/submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold shadow-lg shadow-purple-950/30 transition-all active:scale-95 flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              <span>Submit Game</span>
            </Link>

            <Link
              href="/creator/preview"
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-[#050811] hover:bg-slate-200 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300 font-bold transition-all flex items-center gap-1.5"
            >
              <FlaskConical className="h-4 w-4 text-purple-500" />
              <span>Sandbox Test</span>
            </Link>

            <button
              type="button"
              onClick={handleSignOut}
              aria-label="Sign Out"
              title="Sign Out"
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-[#050811] hover:border-rose-500/50 hover:text-rose-400 text-slate-500 transition-colors"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Workspace Navigation Tabs */}
        <div className="flex items-center gap-2 pt-6 mt-6 border-t border-slate-200 dark:border-slate-800/80 font-mono text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-2 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'dashboard'
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-slate-100 dark:bg-[#050811] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            <span>Studio Dashboard</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'analytics'
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-slate-100 dark:bg-[#050811] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <BarChart3 className="h-3.5 w-3.5" />
            <span>Analytics</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('earnings')}
            className={`px-4 py-2 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'earnings'
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-slate-100 dark:bg-[#050811] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Wallet className="h-3.5 w-3.5" />
            <span>Monetization</span>
            <span className="px-1.5 py-0.2 rounded text-[9px] bg-amber-500/20 text-amber-600 dark:text-amber-400">SOON</span>
          </button>
        </div>
      </div>

      {/* 2. Workspace Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 font-mono">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#0B1120] p-4 flex flex-col justify-between space-y-1.5 shadow-sm">
          <span className="text-xs text-slate-500 dark:text-slate-400">STUDIO GAMES</span>
          <span className="text-2xl font-black text-purple-600 dark:text-purple-400">{myGames.length}</span>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#0B1120] p-4 flex flex-col justify-between space-y-1.5 shadow-sm">
          <span className="text-xs text-slate-500 dark:text-slate-400">TOTAL PLAYS</span>
          <span className="text-2xl font-black text-cyan-600 dark:text-cyan-400">{totalPlays.toLocaleString()}</span>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#0B1120] p-4 flex flex-col justify-between space-y-1.5 shadow-sm">
          <span className="text-xs text-slate-500 dark:text-slate-400">AVERAGE RATING</span>
          <span className="text-2xl font-black text-amber-500">★ {avgRating}</span>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#0B1120] p-4 flex flex-col justify-between space-y-1.5 shadow-sm">
          <span className="text-xs text-slate-500 dark:text-slate-400">REPORTED ISSUES</span>
          <span className="text-2xl font-black text-rose-500">{totalOpenIssues}</span>
        </div>
      </div>

      {/* TAB 1: DASHBOARD / CATALOG */}
      {activeTab === 'dashboard' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800/60 pb-3">
            <h2 className="text-base font-bold font-display text-slate-900 dark:text-white flex items-center gap-2">
              <Gamepad2 className="h-4 w-4 text-purple-500" />
              <span>Your Studio Catalog & Lifecycle</span>
            </h2>
            <span className="text-xs font-mono text-slate-500">
              {myGames.length} {myGames.length === 1 ? 'Game' : 'Games'} in Pipeline
            </span>
          </div>

          {myGames.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 font-sans">
              {myGames.map((game) => (
                <div
                  key={game.id}
                  className="rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#0B1120] p-4 space-y-3 shadow-sm hover:border-purple-500/40 transition-colors flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-0.5 min-w-0 flex-1">
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                          {game.title}
                        </h3>
                        <span className="text-[10px] font-mono text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-500/30 px-2 py-0.5 rounded-full uppercase">
                          {game.category}
                        </span>
                      </div>
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md shrink-0 ${
                        game.status === 'published'
                          ? 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/40'
                          : 'bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-500/40'
                      }`}>
                        {game.status === 'published' ? 'LIVE ON GRID' : 'UNDER REVIEW'}
                      </span>
                    </div>

                    {/* Pipeline Status Stepper */}
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#050811] border border-slate-200 dark:border-slate-800/60 space-y-1.5 font-mono text-[10px]">
                      <span className="text-slate-500 font-bold block">PIPELINE STATUS</span>
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <span className="text-emerald-600 dark:text-emerald-400">✓ Ingested</span>
                        <span>→</span>
                        <span className="text-emerald-600 dark:text-emerald-400">✓ AST Scanned</span>
                        <span>→</span>
                        <span className={game.status === 'published' ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}>
                          {game.status === 'published' ? '✓ Grid Live' : '⏳ Reviewing'}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 pt-1 font-mono text-xs text-center">
                      <div className="bg-slate-50 dark:bg-[#050811] p-2 rounded-xl border border-slate-200 dark:border-slate-800/60">
                        <span className="text-[10px] text-slate-500 block">Plays</span>
                        <span className="font-bold text-slate-900 dark:text-white">{game.plays || 0}</span>
                      </div>
                      <div className="bg-slate-50 dark:bg-[#050811] p-2 rounded-xl border border-slate-200 dark:border-slate-800/60">
                        <span className="text-[10px] text-slate-500 block">Rating</span>
                        <span className="font-bold text-amber-500">{game.rating ? `★ ${game.rating}` : 'N/A'}</span>
                      </div>
                      <div className="bg-slate-50 dark:bg-[#050811] p-2 rounded-xl border border-slate-200 dark:border-slate-800/60">
                        <span className="text-[10px] text-slate-500 block">Issues</span>
                        <span className="font-bold text-slate-700 dark:text-slate-300">{game.openIssues || 0}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between font-mono text-xs border-t border-slate-200 dark:border-slate-800/60 mt-2">
                    <Link
                      href="/creator/preview"
                      className="text-purple-600 dark:text-purple-400 hover:text-purple-700 font-bold flex items-center gap-1"
                    >
                      <FlaskConical className="h-3.5 w-3.5" />
                      <span>Test SDK</span>
                    </Link>
                    <Link
                      href={`/games/${game.slug}`}
                      className="text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 font-bold flex items-center gap-1"
                    >
                      <span>View Portal</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-[#0B1120]/60 p-8 sm:p-12 text-center space-y-6">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-3xl bg-purple-50 dark:bg-purple-950/40 border border-purple-300 dark:border-purple-500/30 text-purple-600 dark:text-purple-400">
                <Gamepad2 className="h-8 w-8" />
              </div>

              <div className="space-y-2 max-w-md mx-auto">
                <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white">
                  Welcome to your Creator Console
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-sans">
                  You haven&apos;t published any games yet. Upload your first HTML5 game package to start tracking real-time player telemetry, ratings, and bug reports.
                </p>
              </div>

              <div className="pt-2">
                <Link
                  href="/creator/submit"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-mono text-xs font-bold shadow-xl shadow-purple-950/30 transition-all active:scale-95"
                >
                  <Upload className="h-4 w-4" />
                  <span>UPLOAD YOUR FIRST GAME</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: ANALYTICS */}
      {activeTab === 'analytics' && (
        <div className="space-y-6 font-mono text-xs">
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#0B1120] p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-cyan-500" />
              <span>Studio Growth & Performance Telemetry</span>
            </h3>
            <p className="text-slate-500 font-sans text-xs">
              Live play duration and retention metrics across all active game instances.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#050811] border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-slate-500 text-[11px] block">Avg Session Length</span>
                <span className="text-lg font-black text-slate-900 dark:text-white">4m 32s</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#050811] border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-slate-500 text-[11px] block">SDK Message Rate</span>
                <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">60 FPS</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#050811] border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-slate-500 text-[11px] block">Leaderboard Entries</span>
                <span className="text-lg font-black text-purple-600 dark:text-purple-400">{totalPlays}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: EARNINGS / MONETIZATION (FUTURE-READY) */}
      {activeTab === 'earnings' && (
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#0B1120] p-6 sm:p-8 space-y-6 font-mono text-xs text-center">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-500/30 text-amber-500 mx-auto">
            <Wallet className="h-7 w-7" />
          </div>

          <div className="space-y-1.5 max-w-md mx-auto">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Creator Monetization Program
            </h3>
            <p className="text-slate-500 font-sans text-xs leading-relaxed">
              ArcadeHub revenue sharing and in-game micro-rewards architecture is currently in development. Payouts and telemetry revenue will display here.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-xl mx-auto pt-2">
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#050811] border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-500 block">Total Earnings</span>
              <span className="text-base font-black text-slate-900 dark:text-white">₹0.00</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#050811] border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-500 block">This Month</span>
              <span className="text-base font-black text-slate-900 dark:text-white">₹0.00</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#050811] border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-500 block">Pending Payout</span>
              <span className="text-base font-black text-amber-500">₹0.00</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}