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
} from 'lucide-react';
import { useGuestVault } from '@/hooks/useGuestVault';
import { NotificationBell } from '../notifications/NotificationBell';
import { ThemeToggle } from '../theme/ThemeToggle';
import { MyGamesPopover } from '../player/MyGamesPopover';
import { NavigationState } from './ArcadeNavigation';

interface LeftSidebarNavigationProps {
  navState: NavigationState;
}

export function LeftSidebarNavigation({ navState }: LeftSidebarNavigationProps) {
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
      label: 'Creator Studio',
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

  const isExpanded = navState === 'expanded';
  const isCollapsing = navState === 'collapsing';
  const isFloating = navState === 'floating';

  return (
    <aside
      aria-label="ArcadeHub Left Command Center"
      className={`fixed top-4 left-4 z-40 rounded-3xl border border-slate-200/90 dark:border-cyan-500/25 bg-white/95 dark:bg-[#070C1E]/95 backdrop-blur-2xl shadow-2xl shadow-indigo-950/15 dark:shadow-[0_12px_40px_rgba(0,240,255,0.12)] p-3.5 flex flex-col justify-between font-mono overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        isExpanded
          ? 'w-[248px] h-[calc(100vh-2rem)] opacity-100 translate-x-0 translate-y-0 scale-100 blur-0 pointer-events-auto'
          : isCollapsing
          ? 'w-[72px] h-[calc(100vh-2rem)] opacity-100 translate-x-0 translate-y-0 scale-100 blur-0 pointer-events-auto'
          : 'w-[72px] h-20 opacity-0 translate-x-[calc(50vw-130px)] -translate-y-4 scale-75 rounded-full blur-xs pointer-events-none'
      }`}
    >
      {/* 1. Header & Brand Console */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-slate-800/80">
          <Link
            href="/"
            className="flex items-center gap-2.5 group/brand font-bold text-lg text-slate-900 dark:text-white tracking-tight overflow-hidden"
          >
            <span className="flex items-center justify-center h-9 w-9 rounded-2xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-purple-600 text-white shadow-lg shadow-cyan-500/30 group-hover/brand:scale-105 transition-all shrink-0">
              <Gamepad2 className="h-5 w-5" />
            </span>

            {/* Brand Title (Fades smoothly when collapsing) */}
            <div
              className={`flex flex-col transition-all duration-300 ${
                isExpanded ? 'opacity-100 max-w-[175px]' : 'opacity-0 max-w-0 overflow-hidden'
              }`}
            >
              <span className="font-display tracking-wider text-lg font-black leading-none whitespace-nowrap">
                ARCADE<span className="text-cyan-500 dark:text-cyan-400">HUB</span>
              </span>
              <span className="text-[8px] font-mono font-bold text-slate-400 dark:text-slate-500 tracking-widest mt-0.5 whitespace-nowrap">
                PLAYER COMMAND
              </span>
            </div>
          </Link>

          {/* System Online Status Pill (Only in expanded state) */}
          {isExpanded && (
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30 shrink-0">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
              <span>LIVE</span>
            </span>
          )}
        </div>

        {/* Quick Search Action Pill */}
        <button
          type="button"
          onClick={handleOpenPalette}
          className={`w-full flex items-center rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0B1124] text-slate-500 hover:text-slate-900 dark:hover:text-white hover:border-cyan-400 dark:hover:border-cyan-500/50 transition-all text-xs cursor-pointer shadow-sm group ${
            isExpanded ? 'px-3 py-2 justify-between' : 'p-2 justify-center'
          }`}
          title="Search games (Ctrl+K)"
        >
          <span className="flex items-center gap-2">
            <Search className="h-3.5 w-3.5 text-slate-400 group-hover:text-cyan-400 transition-colors shrink-0" />
            {isExpanded && <span className="whitespace-nowrap">Search games...</span>}
          </span>
          {isExpanded && (
            <span className="px-1.5 py-0.2 rounded text-[9px] bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold">
              Ctrl+K
            </span>
          )}
        </button>

        {/* 2. Primary Navigation Links */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href}
                title={!isExpanded ? item.label : undefined}
                className={`group flex items-center rounded-2xl font-bold text-xs transition-all duration-200 ${
                  isExpanded ? 'px-3 py-2.5 justify-between' : 'p-2 justify-center'
                } ${
                  item.isSpecial
                    ? 'bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-cyan-500/10 border border-indigo-200 dark:border-indigo-500/40 text-indigo-700 dark:text-cyan-300 hover:border-cyan-400 shadow-sm ring-1 ring-cyan-400/20'
                    : item.active
                    ? 'bg-gradient-to-r from-purple-600/15 to-cyan-500/15 border border-purple-400/40 dark:border-cyan-400/40 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={`flex items-center justify-center h-7 w-7 rounded-xl transition-all shrink-0 ${
                      item.isSpecial
                        ? 'bg-gradient-to-tr from-cyan-400 to-indigo-600 text-white shadow-sm'
                        : item.active
                        ? 'bg-purple-600 text-white shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400 group-hover:text-cyan-400'
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </span>

                  {/* Nav Label (Smoothly hidden when collapsing) */}
                  <span
                    className={`transition-all duration-300 whitespace-nowrap ${
                      isExpanded ? 'opacity-100 max-w-[120px]' : 'opacity-0 max-w-0 overflow-hidden'
                    }`}
                  >
                    {item.label}
                  </span>
                </div>

                {item.badge && isExpanded && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[9px] font-bold uppercase shrink-0 ${
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
        <div className={`grid gap-1.5 ${isExpanded ? 'grid-cols-3' : 'grid-cols-1'}`}>
          {/* Master Sound */}
          <button
            type="button"
            onClick={toggleGlobalSound}
            aria-label={globalMuted ? 'Unmute' : 'Mute'}
            title={globalMuted ? 'Unmute Audio' : 'Mute Master Audio'}
            className="flex flex-col items-center justify-center p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0B1124] hover:bg-slate-100 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300 transition-all active:scale-95 cursor-pointer"
          >
            {globalMuted ? (
              <VolumeX className="h-3.5 w-3.5 text-slate-400" />
            ) : (
              <Volume2 className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-400" />
            )}
            {isExpanded && (
              <span className="text-[8px] font-bold mt-0.5 text-slate-500">
                {globalMuted ? 'MUTED' : 'AUDIO'}
              </span>
            )}
          </button>

          {/* Random Game */}
          <button
            type="button"
            onClick={handleGridJump}
            disabled={isJumping}
            aria-label="Random Game"
            title="Jump to Random Game"
            className="flex flex-col items-center justify-center p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0B1124] hover:bg-slate-100 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300 transition-all active:scale-95 cursor-pointer"
          >
            <Shuffle className={`h-3.5 w-3.5 text-purple-500 ${isJumping ? 'animate-spin' : ''}`} />
            {isExpanded && <span className="text-[8px] font-bold mt-0.5 text-slate-500">RANDOM</span>}
          </button>

          {/* Bookmarks */}
          <button
            type="button"
            data-bookmark-trigger="true"
            onClick={() => setIsBookmarksOpen(!isBookmarksOpen)}
            aria-label="My Vault"
            title="My Vault"
            className="relative flex flex-col items-center justify-center p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0B1124] hover:bg-slate-100 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300 transition-all active:scale-95 cursor-pointer"
          >
            <Bookmark className="h-3.5 w-3.5 text-amber-500" />
            {isExpanded && <span className="text-[8px] font-bold mt-0.5 text-slate-500">VAULT</span>}
            {bookmarkedIds.length > 0 && (
              <span className="absolute top-0.5 right-0.5 h-3 min-w-[12px] px-0.5 rounded-full bg-purple-500 text-[8px] font-bold text-white flex items-center justify-center">
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
        <div className={`flex items-center rounded-2xl bg-slate-50 dark:bg-[#0B1124] border border-slate-200 dark:border-slate-800 p-1.5 ${
          isExpanded ? 'justify-between' : 'flex-col gap-1.5'
        }`}>
          {isExpanded && <span className="text-[9px] font-bold text-slate-500 pl-1">ALERTS</span>}
          <div className="flex items-center gap-1">
            <NotificationBell />
            <ThemeToggle />
          </div>
        </div>

        {/* 4. Pilot Profile Console Card */}
        <Link
          href="/profile"
          className={`flex items-center rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-[#090F24] hover:border-cyan-400 dark:hover:border-cyan-500/50 transition-all cursor-pointer group/profile ${
            isExpanded ? 'p-2 gap-2.5' : 'p-1.5 justify-center'
          }`}
          title="Player Profile"
        >
          <div className="relative flex items-center justify-center h-8 w-8 rounded-xl bg-white dark:bg-[#050811] border border-slate-200 dark:border-slate-800 overflow-hidden shrink-0 shadow-sm">
            {isCustomImageAvatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={avatar}
                alt="Avatar"
                className="h-full w-full object-cover group-hover/profile:scale-110 transition-transform"
              />
            ) : (
              <span className="text-sm">{avatar || 'Ã°Å¸Â¤â€“'}</span>
            )}
          </div>

          {isExpanded && (
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-[10px] font-bold text-slate-900 dark:text-white truncate">
                {mounted ? personaLabel : 'Guest Pilot'}
              </span>
              <span className="text-[8px] font-bold text-cyan-600 dark:text-cyan-400 flex items-center gap-1">
                <ShieldCheck className="h-2.5 w-2.5" />
                <span>{persona === 'REGISTERED_PLAYER' ? 'VERIFIED' : 'GUEST VAULT'}</span>
              </span>
            </div>
          )}
        </Link>

      </div>
    </aside>
  );
}