'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Gamepad2,
  Compass,
  Trophy,
  Users,
  Zap,
  Search,
  Volume2,
  VolumeX,
  Bookmark,
  Shuffle,
  ShieldCheck,
  Radio,
  Layers,
  Sparkles,
} from 'lucide-react';
import { useGuestVault } from '@/hooks/useGuestVault';
import { NotificationBell } from '../notifications/NotificationBell';
import { ThemeToggle } from '../theme/ThemeToggle';
import { MyGamesPopover } from '../player/MyGamesPopover';

interface LeftSidebarNavigationProps {
  isVisible: boolean;
}

export function LeftSidebarNavigation({ isVisible }: LeftSidebarNavigationProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [globalMuted, setGlobalMuted] = useState(false);
  const [isBookmarksOpen, setIsBookmarksOpen] = useState(false);
  const [isJumping, setIsJumping] = useState(false);

  const { persona, personaLabel, avatar, bookmarkedIds } = useGuestVault();

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

  const navItems = [
    {
      label: 'The Grid',
      href: '/',
      icon: Gamepad2,
      active: pathname === '/',
      badge: null,
    },
    {
      label: 'Discover',
      href: '/#explore',
      icon: Compass,
      active: false,
      badge: null,
    },
    {
      label: 'Leaderboards',
      href: '/leaderboards',
      icon: Trophy,
      active: pathname === '/leaderboards',
      badge: 'LIVE',
    },
    {
      label: 'Creators',
      href: '/creator',
      icon: Users,
      active: pathname.startsWith('/creator'),
      badge: null,
    },
    {
      label: '.IO Arena',
      href: '/io-arena',
      icon: Zap,
      active: pathname === '/io-arena',
      badge: 'PVP',
      isSpecial: true,
    },
  ];

  return (
    <aside
      aria-label="ArcadeHub Cyber Command Center"
      className={`fixed top-4 left-4 z-40 w-64 rounded-3xl border border-slate-200/90 dark:border-cyan-500/25 bg-white/95 dark:bg-[#070C1E]/95 backdrop-blur-2xl shadow-2xl shadow-indigo-950/15 dark:shadow-[0_12px_40px_rgba(0,240,255,0.12)] p-4 flex flex-col justify-between font-mono overflow-hidden transition-all duration-600 ease-[cubic-bezier(0.34,1.15,0.64,1)] ${
        isVisible
          ? 'h-[calc(100vh-2rem)] opacity-100 translate-x-0 translate-y-0 scale-100 rounded-3xl blur-0 pointer-events-auto'
          : 'h-16 opacity-0 translate-x-[calc(50vw-130px)] -translate-y-4 scale-75 rounded-full blur-xs pointer-events-none'
      }`}
    >
      {/* 1. Header & Brand Console */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-slate-800/80">
          <Link
            href="/"
            className="flex items-center gap-2.5 group/brand font-bold text-lg text-slate-900 dark:text-white tracking-tight"
          >
            <span className="flex items-center justify-center h-9 w-9 rounded-2xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-purple-600 text-white shadow-lg shadow-cyan-500/30 group-hover/brand:scale-105 group-hover/brand:rotate-3 transition-all duration-300">
              <Gamepad2 className="h-5 w-5" />
            </span>
            <div className="flex flex-col">
              <span className="font-display tracking-wider text-xl font-black leading-none">
                ARCADE<span className="text-cyan-500 dark:text-cyan-400">HUB</span>
              </span>
              <span className="text-[9px] font-mono font-bold text-slate-400 dark:text-slate-500 tracking-widest mt-0.5">
                SYSTEM ONLINE
              </span>
            </div>
          </Link>

          {/* Online Pulse Status */}
          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
            <span>LIVE</span>
          </span>
        </div>

        {/* Quick Search Action Pill */}
        <button
          type="button"
          onClick={handleOpenPalette}
          className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0B1124] text-slate-500 hover:text-slate-900 dark:hover:text-white hover:border-cyan-400 dark:hover:border-cyan-500/50 transition-all text-xs cursor-pointer shadow-sm group"
        >
          <span className="flex items-center gap-2">
            <Search className="h-3.5 w-3.5 text-slate-400 group-hover:text-cyan-400 transition-colors" />
            <span>Search games...</span>
          </span>
          <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold">
            Ctrl+K
          </span>
        </button>

        {/* 2. Primary Navigation Links */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`group flex items-center justify-between px-3.5 py-2.5 rounded-2xl font-bold text-xs transition-all duration-200 ${
                  item.isSpecial
                    ? 'bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-cyan-500/10 border border-indigo-200 dark:border-indigo-500/40 text-indigo-700 dark:text-cyan-300 hover:border-cyan-400 shadow-sm ring-1 ring-cyan-400/20'
                    : item.active
                    ? 'bg-gradient-to-r from-purple-600/15 to-cyan-500/15 border border-purple-400/40 dark:border-cyan-400/40 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={`flex items-center justify-center h-7 w-7 rounded-xl transition-all ${
                      item.isSpecial
                        ? 'bg-gradient-to-tr from-cyan-400 to-indigo-600 text-white shadow-sm'
                        : item.active
                        ? 'bg-purple-600 text-white shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400 group-hover:text-cyan-400'
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </span>
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                      item.isSpecial
                        ? 'bg-cyan-400/20 text-cyan-700 dark:text-cyan-300 border border-cyan-400/40 animate-pulse'
                        : 'bg-amber-400/20 text-amber-700 dark:text-amber-300 border border-amber-400/40'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* 3. Middle Tactical Controls */}
      <div className="space-y-3 pt-3 border-t border-slate-200/80 dark:border-slate-800/80">
        
        {/* Quick Action Matrix */}
        <div className="grid grid-cols-3 gap-2">
          {/* Master Sound */}
          <button
            type="button"
            onClick={toggleGlobalSound}
            aria-label={globalMuted ? 'Unmute' : 'Mute'}
            title={globalMuted ? 'Unmute Audio' : 'Mute Master Audio'}
            className="flex flex-col items-center justify-center p-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0B1124] hover:bg-slate-100 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300 transition-all active:scale-95 cursor-pointer"
          >
            {globalMuted ? (
              <VolumeX className="h-4 w-4 text-slate-400" />
            ) : (
              <Volume2 className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
            )}
            <span className="text-[9px] font-bold mt-1 text-slate-500">
              {globalMuted ? 'MUTED' : 'AUDIO'}
            </span>
          </button>

          {/* Random Game */}
          <button
            type="button"
            onClick={handleGridJump}
            disabled={isJumping}
            aria-label="Random Game"
            title="Jump to Random Game"
            className="flex flex-col items-center justify-center p-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0B1124] hover:bg-slate-100 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300 transition-all active:scale-95 cursor-pointer"
          >
            <Shuffle className={`h-4 w-4 text-purple-500 ${isJumping ? 'animate-spin' : ''}`} />
            <span className="text-[9px] font-bold mt-1 text-slate-500">RANDOM</span>
          </button>

          {/* Bookmarks */}
          <button
            type="button"
            data-bookmark-trigger="true"
            onClick={() => setIsBookmarksOpen(!isBookmarksOpen)}
            aria-label="My Vault"
            title="My Vault"
            className="relative flex flex-col items-center justify-center p-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0B1124] hover:bg-slate-100 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300 transition-all active:scale-95 cursor-pointer"
          >
            <Bookmark className="h-4 w-4 text-amber-500" />
            <span className="text-[9px] font-bold mt-1 text-slate-500">VAULT</span>
            {bookmarkedIds.length > 0 && (
              <span className="absolute top-1 right-1 h-3.5 min-w-[14px] px-0.5 rounded-full bg-purple-500 text-[8px] font-bold text-white flex items-center justify-center">
                {bookmarkedIds.length}
              </span>
            )}
          </button>
        </div>

        <MyGamesPopover
          isOpen={isBookmarksOpen}
          onClose={() => setIsBookmarksOpen(false)}
          initialTab="my_list"
        />

        {/* Utility Toggles Row (Notifications + Theme) */}
        <div className="flex items-center justify-between p-2 rounded-2xl bg-slate-50 dark:bg-[#0B1124] border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-1">
            <span className="text-[10px] font-bold text-slate-500 pl-1">ALERT FEED</span>
          </div>
          <div className="flex items-center gap-1.5">
            <NotificationBell />
            <ThemeToggle />
          </div>
        </div>

        {/* 4. Pilot Profile Console Card */}
        <Link
          href="/profile"
          className="flex items-center gap-3 p-2.5 rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-[#090F24] hover:border-cyan-400 dark:hover:border-cyan-500/50 transition-all cursor-pointer group/profile"
        >
          <div className="relative flex items-center justify-center h-9 w-9 rounded-xl bg-white dark:bg-[#050811] border border-slate-200 dark:border-slate-800 overflow-hidden shrink-0 shadow-sm">
            {isCustomImageAvatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={avatar}
                alt="Avatar"
                className="h-full w-full object-cover group-hover/profile:scale-110 transition-transform"
              />
            ) : (
              <span className="text-base">{avatar || 'ðŸ¤–'}</span>
            )}
          </div>

          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-[11px] font-bold text-slate-900 dark:text-white truncate">
              {mounted ? personaLabel : 'Guest Pilot'}
            </span>
            <span className="text-[9px] font-bold text-cyan-600 dark:text-cyan-400 flex items-center gap-1">
              <ShieldCheck className="h-3 w-3" />
              <span>{persona === 'REGISTERED_PLAYER' ? 'VERIFIED' : 'GUEST VAULT'}</span>
            </span>
          </div>
        </Link>

      </div>
    </aside>
  );
}