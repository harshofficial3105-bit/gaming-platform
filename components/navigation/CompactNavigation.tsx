'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Gamepad2,
  Search,
  Zap,
  Trophy,
  Sparkles,
  Compass,
  Shuffle,
} from 'lucide-react';
import { NotificationBell } from '../notifications/NotificationBell';
import { ThemeToggle } from '../theme/ThemeToggle';
import { useGuestVault } from '@/hooks/useGuestVault';

export function CompactNavigation() {
  const router = useRouter();
  const { avatar } = useGuestVault();
  const [isJumping, setIsJumping] = useState(false);

  const handleOpenPalette = () => {
    window.dispatchEvent(new Event('open-command-palette'));
  };

  const handleGridJump = () => {
    setIsJumping(true);
    const games = [
      'cyber-battle-io',
      'space-gem-collector',
      'cyber-track-2026',
      'orbit-clash-io',
      'neon-grid-breaker',
      'void-runner',
    ];
    const randomGame = games[Math.floor(Math.random() * games.length)];
    setTimeout(() => {
      setIsJumping(false);
      router.push(`/games/${randomGame}`);
    }, 400);
  };

  const isCustomImageAvatar =
    avatar &&
    (avatar.startsWith('/') ||
      avatar.startsWith('http') ||
      avatar.startsWith('data:'));

  return (
    <div className="flex items-center justify-center w-full px-2 sm:px-4 py-2">
      <div className="flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 rounded-full border border-indigo-200/90 dark:border-cyan-500/40 bg-white/85 dark:bg-[#060A18]/90 backdrop-blur-2xl shadow-2xl shadow-slate-300/60 dark:shadow-[0_8px_32px_rgba(0,240,255,0.18)] transition-all font-mono text-xs">
        
        {/* Compact Brand Icon Pill */}
        <Link
          href="/"
          title="ArcadeHub Home"
          aria-label="ArcadeHub Home"
          className="flex items-center gap-1.5 pl-1 pr-2.5 py-1 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-black hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-sm"
        >
          <Gamepad2 className="h-4 w-4" />
          <span className="text-[11px] font-display font-extrabold hidden sm:inline tracking-wider">
            ARCADE<span className="text-cyan-200">HUB</span>
          </span>
        </Link>

        {/* Separator */}
        <span className="h-4 w-[1px] bg-slate-200 dark:bg-slate-800" />

        {/* Compact Navigation Pills */}
        <div className="flex items-center gap-1">
          <Link
            href="/"
            title="The Grid"
            className="px-2.5 py-1 rounded-xl text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-slate-100 dark:hover:bg-slate-900 font-bold transition-all text-[11px]"
          >
            GRID
          </Link>

          <Link
            href="/#explore"
            title="Discover Games"
            className="hidden md:flex px-2.5 py-1 rounded-xl text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-slate-100 dark:hover:bg-slate-900 font-bold transition-all text-[11px]"
          >
            DISCOVER
          </Link>

          {/* Compact .IO Arena Pill */}
          <Link
            href="/#io-arena"
            title=".IO Multiplayer Arena"
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-gradient-to-r from-indigo-500/10 to-cyan-500/10 border border-indigo-300 dark:border-indigo-500/40 text-indigo-700 dark:text-cyan-300 hover:border-cyan-400 font-black transition-all text-[11px]"
          >
            <Zap className="h-3 w-3 text-cyan-400 fill-current animate-pulse" />
            <span>.IO</span>
          </Link>

          <Link
            href="/leaderboards"
            title="Leaderboards"
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl text-slate-700 dark:text-slate-300 hover:text-amber-500 font-bold transition-all text-[11px]"
          >
            <Trophy className="h-3.5 w-3.5 text-amber-500" />
            <span className="hidden sm:inline">RANKS</span>
          </Link>

          <Link
            href="/creator"
            title="Creator Studio"
            className="hidden lg:flex items-center gap-1 px-2.5 py-1 rounded-xl text-slate-700 dark:text-slate-300 hover:text-purple-500 font-bold transition-all text-[11px]"
          >
            <Sparkles className="h-3.5 w-3.5 text-purple-500" />
            <span>STUDIO</span>
          </Link>
        </div>

        {/* Separator */}
        <span className="h-4 w-[1px] bg-slate-200 dark:bg-slate-800" />

        {/* Compact Tactical Tools */}
        <div className="flex items-center gap-1">
          
          {/* Quick Search */}
          <button
            type="button"
            onClick={handleOpenPalette}
            aria-label="Search (Ctrl+K)"
            title="Search (Ctrl+K)"
            className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-[#0B1120] hover:border-cyan-400 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all active:scale-95 cursor-pointer"
          >
            <Search className="h-3.5 w-3.5" />
          </button>

          {/* Random Game Shuffle */}
          <button
            type="button"
            onClick={handleGridJump}
            disabled={isJumping}
            aria-label="Random Game"
            title="Random Game"
            className="hidden sm:flex p-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <Shuffle className={`h-3.5 w-3.5 ${isJumping ? 'animate-spin' : ''}`} />
          </button>

          {/* Realtime Notification Bell */}
          <NotificationBell />

          {/* Dark / Light Mode Toggle */}
          <ThemeToggle />

          {/* Profile Emblem */}
          <Link
            href="/profile"
            title="Player Profile"
            aria-label="Player Profile"
            className="flex items-center justify-center h-8 w-8 rounded-full border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-[#050811] hover:border-cyan-400 overflow-hidden text-xs active:scale-95 transition-transform"
          >
            {isCustomImageAvatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={avatar} alt="Avatar" className="h-full w-full object-cover" />
            ) : (
              <span>{avatar || '🤖'}</span>
            )}
          </Link>

        </div>

      </div>
    </div>
  );
}