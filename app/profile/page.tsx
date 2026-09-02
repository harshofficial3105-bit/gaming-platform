'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useGuestVault } from '@/hooks/useGuestVault';
import { AvatarUploader } from '@/components/profile/AvatarUploader';
import { TrophyCabinet } from '@/components/vault/TrophyCabinet';
import { GameImage } from '@/components/ui/GameImage';
import {
  User,
  ShieldCheck,
  LogOut,
  UserPlus,
  Trophy,
  Database,
  Download,
  Trash2,
  CheckCircle2,
  ArrowRight,
  Gamepad2,
} from 'lucide-react';

export default function ProfilePage() {
  const {
    user,
    persona,
    personaLabel,
    avatar,
    records,
    favorites,
    trophies,
    trophyStats,
    exportVaultBackup,
    resetVault,
    unlockedTrophiesCount,
    totalTrophiesCount,
  } = useGuestVault();

  const [statusNotice, setStatusNotice] = useState<string | null>(null);

  const handleOpenAuth = () => {
    window.dispatchEvent(new Event('open_arcadehub_auth'));
  };

  const handleLogout = () => {
    localStorage.removeItem('arcadehub_guest_user');
    window.dispatchEvent(new Event('arcadehub:user-change'));
    setStatusNotice('Signed out. Local guest session active.');
    setTimeout(() => setStatusNotice(null), 3000);
  };

  const handleExportData = () => {
    const jsonStr = exportVaultBackup();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `arcadehub-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setStatusNotice('Exported game progress and high score backup successfully.');
    setTimeout(() => setStatusNotice(null), 3000);
  };

  const handleResetData = () => {
    if (confirm('Are you sure you want to reset all local game saves and records on this device?')) {
      resetVault();
      setStatusNotice('Local guest data cleared.');
      setTimeout(() => setStatusNotice(null), 3000);
    }
  };

  const totalScorePoints = records.reduce((sum: number, r) => sum + (r.highScore || 0), 0);

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-4">
      
      {/* 1. Player Identity Header */}
      <div className="rounded-3xl border border-slate-800/80 dark:border-slate-800/80 light:border-slate-200 bg-[#0B1120] dark:bg-[#0B1120] light:bg-white p-6 sm:p-8 shadow-2xl relative overflow-hidden transition-colors">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
          
          <div className="flex items-center gap-5">
            {/* Avatar Selector with Live Preset & Upload Switcher */}
            <AvatarUploader />

            <div className="space-y-1.5">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black font-display text-white dark:text-white light:text-slate-900 tracking-tight">
                  {user?.username || (persona === 'GUEST_PLAYER' ? 'Guest Player' : 'Pilot-01')}
                </h1>

                {/* Account Status Badge */}
                {persona === 'REGISTERED_PLAYER' ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono bg-purple-950/80 border border-purple-500/50 text-purple-300">
                    <ShieldCheck className="h-3 w-3 text-purple-400" />
                    <span>VERIFIED PILOT</span>
                  </span>
                ) : persona === 'GUEST_PLAYER' ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono bg-emerald-950/80 border border-emerald-500/40 text-emerald-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>LOCAL VAULT ACTIVE</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono bg-cyan-950/80 border border-cyan-500/30 text-cyan-300">
                    <User className="h-3 w-3 text-cyan-400" />
                    <span>NEW VISITOR</span>
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-600 font-mono">
                {persona === 'REGISTERED_PLAYER'
                  ? `Level ${user?.level || 1} • Account active since ${new Date(user?.registeredAt || Date.now()).toLocaleDateString()}`
                  : persona === 'GUEST_PLAYER'
                  ? `${records.length} saved ${records.length === 1 ? 'game record' : 'game records'} stored locally on this device`
                  : 'Welcome to ArcadeHub! Play any game to start recording high scores.'}
              </p>
            </div>
          </div>

          {/* Dynamic Action Buttons */}
          <div className="flex items-center gap-2 font-mono">
            {persona === 'REGISTERED_PLAYER' ? (
              <button
                type="button"
                onClick={handleLogout}
                className="px-4 py-2.5 rounded-xl border border-slate-800 dark:border-slate-800 light:border-slate-300 bg-[#050811] dark:bg-[#050811] light:bg-slate-100 hover:border-rose-500/50 hover:text-rose-400 text-slate-400 font-bold text-xs shadow-md cursor-pointer transition-all active:scale-95 flex items-center gap-1.5"
              >
                <LogOut className="h-3.5 w-3.5 text-rose-400" />
                <span>Sign Out</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleOpenAuth}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-bold text-xs shadow-lg shadow-purple-950/40 cursor-pointer transition-all active:scale-95 flex items-center gap-1.5"
              >
                <UserPlus className="h-3.5 w-3.5" />
                <span>{persona === 'GUEST_PLAYER' ? 'Register Account & Sync Progress' : 'Create Free Account'}</span>
              </button>
            )}
          </div>

        </div>
      </div>

      {statusNotice && (
        <div className="p-3 rounded-xl bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-xs font-mono text-center animate-fade-in flex items-center justify-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-cyan-400" />
          <span>{statusNotice}</span>
        </div>
      )}

      {/* 2. Real Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="rounded-2xl border border-slate-800/80 dark:border-slate-800/80 light:border-slate-200 bg-[#0B1120] dark:bg-[#0B1120] light:bg-white p-4 flex flex-col justify-between space-y-1.5 shadow-lg">
          <span className="text-xs font-mono text-slate-400 dark:text-slate-400 light:text-slate-600">GAMES PLAYED</span>
          <span className="text-2xl font-mono font-black text-cyan-400">{records.length}</span>
        </div>
        <div className="rounded-2xl border border-slate-800/80 dark:border-slate-800/80 light:border-slate-200 bg-[#0B1120] dark:bg-[#0B1120] light:bg-white p-4 flex flex-col justify-between space-y-1.5 shadow-lg">
          <span className="text-xs font-mono text-slate-400 dark:text-slate-400 light:text-slate-600">TOTAL SCORE POINTS</span>
          <span className="text-2xl font-mono font-black text-amber-400">{totalScorePoints.toLocaleString()}</span>
        </div>
        <div className="rounded-2xl border border-slate-800/80 dark:border-slate-800/80 light:border-slate-200 bg-[#0B1120] dark:bg-[#0B1120] light:bg-white p-4 flex flex-col justify-between space-y-1.5 shadow-lg">
          <span className="text-xs font-mono text-slate-400 dark:text-slate-400 light:text-slate-600">FAVORITE GAMES</span>
          <span className="text-2xl font-mono font-black text-rose-400">{favorites.length}</span>
        </div>
        <div className="rounded-2xl border border-slate-800/80 dark:border-slate-800/80 light:border-slate-200 bg-[#0B1120] dark:bg-[#0B1120] light:bg-white p-4 flex flex-col justify-between space-y-1.5 shadow-lg">
          <span className="text-xs font-mono text-slate-400 dark:text-slate-400 light:text-slate-600">TROPHIES UNLOCKED</span>
          <span className="text-2xl font-mono font-black text-purple-400">{unlockedTrophiesCount} / {totalTrophiesCount}</span>
        </div>
      </div>

      {/* 3. Platform Dynamic Scalable Trophy Cabinet */}
      <TrophyCabinet />

      {/* 4. Personal Best Records */}
      <div className="rounded-3xl border border-slate-800/80 dark:border-slate-800/80 light:border-slate-200 bg-[#0B1120] dark:bg-[#0B1120] light:bg-white p-5 sm:p-6 space-y-4 shadow-xl">
        <h2 className="text-base font-bold font-display text-white dark:text-white light:text-slate-900 flex items-center gap-2 border-b border-slate-800/60 dark:border-slate-800/60 light:border-slate-200 pb-3">
          <Trophy className="h-4 w-4 text-amber-400" />
          <span>Personal Best Records</span>
        </h2>

        {records.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {records.map((rec) => (
              <Link
                key={rec.game.id}
                href={`/games/${rec.game.slug}`}
                className="group flex items-center gap-3 p-3 rounded-2xl border border-slate-800/80 dark:border-slate-800/80 light:border-slate-200 bg-[#050811] dark:bg-[#050811] light:bg-slate-50 hover:border-cyan-400/60 transition-all"
              >
                <div className="relative h-12 w-16 rounded-xl overflow-hidden bg-[#0B1120] shrink-0 border border-slate-800">
                  <GameImage src={rec.game.thumbnailUrl} alt={rec.game.title} className="object-cover" />
                </div>
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="text-xs font-bold text-white dark:text-white light:text-slate-900 group-hover:text-cyan-300 truncate">
                    {rec.game.title}
                  </span>
                  <span className="text-[10px] font-mono text-amber-400 font-bold">
                    BEST: {rec.highScore > 0 ? `${rec.highScore.toLocaleString()} PTS` : 'PLAYED'}
                  </span>
                  <span className="text-[9px] font-mono text-slate-500">
                    Active: {new Date(rec.lastUpdated).toLocaleDateString()}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 space-y-3 font-mono">
            <Gamepad2 className="h-10 w-10 text-slate-600 mx-auto" />
            <p className="text-xs text-slate-400 dark:text-slate-400 light:text-slate-600">No game records yet.</p>
            <Link href="/" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500 text-black font-mono font-bold text-xs hover:bg-cyan-400 transition-colors">
              <span>Explore The Grid</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        )}
      </div>

      {/* 5. Player Data & Privacy Management */}
      <div className="rounded-3xl border border-slate-800/80 dark:border-slate-800/80 light:border-slate-200 bg-[#0B1120] dark:bg-[#0B1120] light:bg-white p-5 sm:p-6 space-y-4 shadow-xl font-mono text-xs">
        <div className="flex items-center justify-between border-b border-slate-800/60 dark:border-slate-800/60 light:border-slate-200 pb-3">
          <h2 className="text-sm font-bold text-white dark:text-white light:text-slate-900 flex items-center gap-2">
            <Database className="h-4 w-4 text-purple-400" />
            <span>Data Management & Backup</span>
          </h2>
          <span className="text-[10px] text-slate-500">Local-First Storage</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <p className="text-slate-400 dark:text-slate-400 light:text-slate-600 text-xs leading-relaxed max-w-lg font-sans">
            Download a portable JSON backup of your game records and unlocked trophies, or clear local storage on this device.
          </p>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleExportData}
              className="px-4 py-2 rounded-xl bg-[#050811] dark:bg-[#050811] light:bg-slate-100 border border-slate-800 dark:border-slate-800 light:border-slate-300 hover:border-cyan-500/50 hover:text-cyan-300 text-slate-300 light:text-slate-700 font-bold transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Download className="h-3.5 w-3.5 text-cyan-400" />
              <span>Export JSON Backup</span>
            </button>
            <button
              type="button"
              onClick={handleResetData}
              className="px-3.5 py-2 rounded-xl bg-[#050811] dark:bg-[#050811] light:bg-slate-100 border border-slate-800 dark:border-slate-800 light:border-slate-300 hover:border-rose-500/50 hover:text-rose-400 text-slate-400 light:text-slate-600 font-bold transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Trash2 className="h-3.5 w-3.5 text-rose-400" />
              <span>Reset Saves</span>
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}