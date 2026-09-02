'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search,
  Volume2,
  VolumeX,
  Bookmark,
  Shuffle,
  Trophy,
  Sparkles,
  Gamepad2,
  Zap,
} from 'lucide-react';
import { MyGamesPopover } from '../player/MyGamesPopover';
import { useGuestVault } from '@/hooks/useGuestVault';
import { NotificationBell } from '../notifications/NotificationBell';
import { ThemeToggle } from '../theme/ThemeToggle';

export function ExpandedNavigation() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isBookmarksOpen, setIsBookmarksOpen] = useState(false);
  const [bookmarksTab, setBookmarksTab] = useState<'my_list' | 'recent' | 'liked'>('my_list');
  const [globalMuted, setGlobalMuted] = useState(false);
  const [isJumping, setIsJumping] = useState(false);

  const { persona, personaLabel, avatar, bookmarkedIds } = useGuestVault();
  const bookmarksCount = bookmarkedIds.length;

  useEffect(() => {
    setMounted(true);
    try {
      const savedMute = localStorage.getItem('arcadehub_audio_muted');
      if (savedMute !== null) {
        setGlobalMuted(savedMute === 'true');
      }
    } catch {}
  }, []);

  const toggleGlobalSound = () => {
    const nextMute = !globalMuted;
    setGlobalMuted(nextMute);
    try {
      localStorage.setItem('arcadehub_audio_muted', String(nextMute));
      window.dispatchEvent(
        new CustomEvent('arcadehub:audio-toggle', { detail: { muted: nextMute } })
      );
    } catch {}
  };

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
    <div className="w-full px-3 sm:px-6 py-3.5 border-b border-slate-200/80 dark:border-slate-800/80 bg-white/95 dark:bg-[#050811]/90 backdrop-blur-xl transition-all">
      <nav className="max-w-[1750px] mx-auto flex items-center justify-between gap-4">
        
        {/* Left: Brand & Primary Navigation Links */}
        <div className="flex items-center gap-6 xl:gap-8">
          
          {/* Brand Emblem */}
          <Link
            href="/"
            className="flex items-center gap-2.5 group/brand font-mono font-extrabold text-xl sm:text-2xl text-slate-900 dark:text-white tracking-tight cursor-pointer"
          >
            <span className="flex items-center justify-center h-9 w-9 rounded-2xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-purple-600 text-white shadow-lg shadow-cyan-500/30 group-hover/brand:scale-105 group-hover/brand:rotate-3 transition-all duration-300">
              <Gamepad2 className="h-5 w-5" />
            </span>
            <span className="tracking-wider font-display">
              ARCADE<span className="text-cyan-500 dark:text-cyan-400">HUB</span>
            </span>
          </Link>

          {/* Navigation Links with Cyber Energy Hover Effects */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-2 font-mono text-xs">
            
            <Link
              href="/"
              className="px-3.5 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-slate-100 dark:hover:bg-slate-900/60 font-bold transition-all flex items-center gap-1.5"
            >
              <span>THE GRID</span>
            </Link>

            <Link
              href="/#explore"
              className="px-3.5 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-slate-100 dark:hover:bg-slate-900/60 font-bold transition-all flex items-center gap-1.5"
            >
              <span>DISCOVER</span>
            </Link>

            {/* .IO ARENA Spotlight Link */}
            <Link
              href="/#io-arena"
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-50 to-cyan-50 dark:from-indigo-950/50 dark:to-cyan-950/50 border border-indigo-200 dark:border-indigo-500/40 text-indigo-700 dark:text-cyan-300 hover:border-cyan-400 font-black transition-all flex items-center gap-1.5 shadow-sm"
            >
              <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>.IO ARENA</span>
            </Link>

            <Link
              href="/leaderboards"
              className="px-3.5 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-900/60 font-bold transition-all flex items-center gap-1.5"
            >
              <Trophy className="h-3.5 w-3.5 text-amber-500" />
              <span>LEADERBOARDS</span>
            </Link>

            <Link
              href="/creator"
              className="px-3.5 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-slate-100 dark:hover:bg-slate-900/60 font-bold transition-all flex items-center gap-1.5"
            >
              <Sparkles className="h-3.5 w-3.5 text-purple-500" />
              <span>CREATORS</span>
            </Link>

          </div>
        </div>

        {/* Right: Tactical Control Dock */}
        <div className="flex items-center gap-2 font-mono">
          
          {/* Master Sound Button */}
          <button
            type="button"
            onClick={toggleGlobalSound}
            aria-label={globalMuted ? 'Unmute Audio' : 'Mute Master Audio'}
            title={globalMuted ? 'Unmute Audio' : 'Mute Master Audio'}
            className="flex items-center justify-center h-9 w-9 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-[#0B1120] hover:bg-slate-200 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300 transition-all active:scale-95 cursor-pointer shadow-sm"
          >
            {globalMuted ? (
              <VolumeX className="h-4 w-4 text-slate-400" />
            ) : (
              <Volume2 className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
            )}
          </button>

          {/* Search Trigger */}
          <div className="relative group/search">
            <button
              type="button"
              onClick={handleOpenPalette}
              aria-label="Search Games (Ctrl+K)"
              title="Search Games (Ctrl+K)"
              className="flex items-center justify-center h-9 w-9 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-[#0B1120] hover:border-cyan-400 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all active:scale-95 cursor-pointer shadow-sm"
            >
              <Search className="h-4 w-4 stroke-slate-700 dark:stroke-slate-300 group-hover/search:stroke-cyan-500 transition-colors" />
            </button>
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2.5 py-1 rounded-lg bg-white dark:bg-[#050811]/95 border border-slate-200 dark:border-cyan-500/40 shadow-xl text-[10px] font-bold text-slate-800 dark:text-cyan-200 whitespace-nowrap opacity-0 group-hover/search:opacity-100 transition-opacity pointer-events-none z-50">
              SEARCH (Ctrl+K)
            </div>
          </div>

          {/* Bookmark / My Games */}
          <div className="relative">
            <div className="relative group/bookmark">
              <button
                type="button"
                data-bookmark-trigger="true"
                onClick={() => setIsBookmarksOpen(!isBookmarksOpen)}
                aria-label="My Games Library (Ctrl+B)"
                title="My Games Library (Ctrl+B)"
                className={`relative flex items-center justify-center h-9 w-9 rounded-xl border transition-all cursor-pointer active:scale-95 shadow-sm ${
                  isBookmarksOpen
                    ? 'bg-purple-600 border-purple-400 text-white shadow-purple-950/50'
                    : 'bg-slate-100 dark:bg-[#181F34] hover:bg-slate-200 dark:hover:bg-[#222B48] border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Bookmark
                  className={`h-4 w-4 transition-colors ${
                    isBookmarksOpen ? 'stroke-white fill-white' : 'stroke-slate-700 dark:stroke-slate-200 fill-none'
                  }`}
                />

                {bookmarksCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-purple-500 text-[9px] font-bold text-white flex items-center justify-center shadow-sm">
                    {bookmarksCount}
                  </span>
                )}
              </button>
            </div>

            <MyGamesPopover
              isOpen={isBookmarksOpen}
              onClose={() => setIsBookmarksOpen(false)}
              initialTab={bookmarksTab}
            />
          </div>

          {/* Random Game Jump */}
          <div className="relative group/jump">
            <button
              type="button"
              onClick={handleGridJump}
              disabled={isJumping}
              aria-label="Jump to Random Game (Ctrl+J)"
              title="Jump to Random Game (Ctrl+J)"
              className="flex items-center justify-center h-9 w-9 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white shadow-md active:scale-95 transition-all cursor-pointer border border-purple-400/40"
            >
              <Shuffle className={`h-4 w-4 transition-transform ${isJumping ? 'animate-spin' : 'group-hover/jump:scale-125'}`} />
            </button>
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2.5 py-1 rounded-lg bg-white dark:bg-[#050811]/95 border border-slate-200 dark:border-purple-500/40 shadow-xl text-[10px] font-bold text-purple-700 dark:text-purple-200 whitespace-nowrap opacity-0 group-hover/jump:opacity-100 transition-opacity pointer-events-none z-50">
              RANDOM GAME (Ctrl+J)
            </div>
          </div>

          {/* Real-Time Notification Bell */}
          <NotificationBell />

          {/* Dark / Light Mode Toggle */}
          <ThemeToggle />

          {/* Dynamic Pilot Persona Badge */}
          <Link
            href="/profile"
            className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-colors ${
              persona === 'REGISTERED_PLAYER'
                ? 'border-purple-300 dark:border-purple-500/50 bg-purple-50 dark:bg-purple-950/30 text-purple-800 dark:text-purple-300 hover:border-purple-400'
                : persona === 'GUEST_PLAYER'
                ? 'border-emerald-300 dark:border-emerald-500/40 bg-emerald-50 dark:bg-[#050811]/80 text-emerald-800 dark:text-emerald-300 hover:border-emerald-400'
                : 'border-cyan-300 dark:border-cyan-500/30 bg-cyan-50 dark:bg-[#050811]/80 text-cyan-800 dark:text-cyan-300 hover:border-cyan-400'
            }`}
          >
            <span className={`h-2 w-2 rounded-full ${
              persona === 'REGISTERED_PLAYER'
                ? 'bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.8)]'
                : persona === 'GUEST_PLAYER'
                ? 'bg-emerald-500 animate-pulse'
                : 'bg-cyan-500'
            }`} />
            <div className="flex flex-col text-left">
              <span className="text-[10px] font-bold text-slate-800 dark:text-slate-200 leading-none">
                {persona === 'REGISTERED_PLAYER' ? 'VERIFIED PILOT' : persona === 'GUEST_PLAYER' ? 'GUEST PLAYER' : 'NEW VISITOR'}
              </span>
              <span className={`text-[9px] leading-tight font-bold ${
                persona === 'REGISTERED_PLAYER' ? 'text-purple-600 dark:text-purple-300' : persona === 'GUEST_PLAYER' ? 'text-emerald-600 dark:text-emerald-400' : 'text-cyan-600 dark:text-cyan-400'
              }`}>
                {mounted ? personaLabel : 'Online'}
              </span>
            </div>
          </Link>

          {/* Profile Emblem */}
          <div className="relative group/profile">
            <Link
              href="/profile"
              title="Player Profile"
              aria-label="Player Profile"
              className="flex items-center justify-center h-9 w-9 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-[#050811] hover:border-cyan-400 text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-300 transition-all active:scale-95 cursor-pointer overflow-hidden shadow-sm"
            >
              {isCustomImageAvatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={avatar}
                  alt="Avatar"
                  className="h-full w-full object-cover group-hover/profile:scale-110 transition-transform"
                />
              ) : (
                <span className="text-base group-hover/profile:scale-110 transition-transform">
                  {avatar || '🤖'}
                </span>
              )}
            </Link>
          </div>

        </div>

      </nav>
    </div>
  );
}