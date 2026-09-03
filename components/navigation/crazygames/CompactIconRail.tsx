'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Menu,
  Gamepad2,
  Compass,
  Zap,
  Trophy,
  Users,
  Grid3X3,
  Search,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { NotificationBell } from '@/components/notifications/NotificationBell';
import { useGuestVault } from '@/hooks/useGuestVault';

interface CompactIconRailProps {
  isDrawerOpen: boolean;
  onToggleDrawer: () => void;
}

export function CompactIconRail({ isDrawerOpen, onToggleDrawer }: CompactIconRailProps) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [globalMuted, setGlobalMuted] = useState(false);
  const { avatar } = useGuestVault();

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

  const navItems = [
    { label: 'The Grid', href: '/', icon: Gamepad2, active: pathname === '/' },
    { label: 'Discover', href: '/#explore', icon: Compass, active: false },
    { label: '.IO Arena', href: '/io-arena', icon: Zap, active: pathname === '/io-arena', isSpecial: true },
    { label: 'Leaderboards', href: '/leaderboards', icon: Trophy, active: pathname === '/leaderboards' },
    { label: 'Creator Studio', href: '/creator', icon: Users, active: pathname.startsWith('/creator') },
  ];

  const isCustomImageAvatar =
    avatar &&
    (avatar.startsWith('/') ||
      avatar.startsWith('http') ||
      avatar.startsWith('data:'));

  return (
    <aside
      aria-label="ArcadeHub Navigation Rail"
      className="fixed top-0 left-0 bottom-0 w-[64px] z-40 flex flex-col justify-between items-center py-3 border-r border-slate-200/90 dark:border-cyan-500/20 bg-white/95 dark:bg-[#070A1A]/95 backdrop-blur-2xl shadow-xl shadow-indigo-950/10 dark:shadow-[0_4px_30px_rgba(0,240,255,0.08)] select-none font-mono"
    >
      {/* 1. Top Section: Menu Toggle & Brand Emblem */}
      <div className="flex flex-col items-center gap-3">
        {/* Hamburger / Menu Toggle */}
        <button
          type="button"
          onClick={onToggleDrawer}
          aria-label={isDrawerOpen ? 'Close Navigation Drawer' : 'Open Navigation Drawer'}
          className="group relative flex items-center justify-center h-10 w-10 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0C1226] text-slate-700 dark:text-cyan-300 hover:border-cyan-400 dark:hover:border-cyan-400/60 hover:text-cyan-500 transition-all cursor-pointer shadow-sm active:scale-95"
        >
          <Menu className="h-5 w-5 transition-transform group-hover:scale-110" />
          
          {/* Tooltip */}
          <span className="pointer-events-none absolute left-[72px] z-50 hidden md:block whitespace-nowrap rounded-xl bg-slate-900 dark:bg-[#0B1124] px-3 py-1.5 text-xs font-bold text-white opacity-0 shadow-xl border border-slate-700 dark:border-cyan-500/30 transition-opacity duration-200 group-hover:opacity-100">
            {isDrawerOpen ? 'Close Menu' : 'Browse Categories'}
          </span>
        </button>

        {/* Brand Emblem */}
        <Link
          href="/"
          aria-label="ArcadeHub Home"
          className="group relative flex items-center justify-center h-10 w-10 rounded-2xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-purple-600 text-white shadow-lg shadow-cyan-500/25 transition-transform hover:scale-105 active:scale-95 cursor-pointer"
        >
          <Gamepad2 className="h-5 w-5" />

          {/* Tooltip */}
          <span className="pointer-events-none absolute left-[72px] z-50 hidden md:block whitespace-nowrap rounded-xl bg-slate-900 dark:bg-[#0B1124] px-3 py-1.5 text-xs font-bold text-white opacity-0 shadow-xl border border-slate-700 dark:border-cyan-500/30 transition-opacity duration-200 group-hover:opacity-100">
            ARCADEHUB
          </span>
        </Link>
      </div>

      {/* 2. Middle Section: Primary Icon Stack */}
      <nav className="flex flex-col items-center gap-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`group relative flex items-center justify-center h-10 w-10 rounded-2xl transition-all duration-200 ${
                item.isSpecial
                  ? 'bg-gradient-to-tr from-indigo-500/15 via-purple-500/15 to-cyan-500/20 border border-indigo-300 dark:border-cyan-400/50 text-indigo-700 dark:text-cyan-300 hover:border-cyan-400 shadow-sm ring-1 ring-cyan-400/20'
                  : item.active
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-950/40 ring-1 ring-purple-400'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80'
              }`}
            >
              <Icon className={`h-5 w-5 ${item.isSpecial ? 'animate-pulse text-cyan-500 dark:text-cyan-300' : ''}`} />

              {/* Hover Tooltip */}
              <span className="pointer-events-none absolute left-[72px] z-50 hidden md:block whitespace-nowrap rounded-xl bg-slate-900 dark:bg-[#0B1124] px-3 py-1.5 text-xs font-bold text-white opacity-0 shadow-xl border border-slate-700 dark:border-cyan-500/30 transition-opacity duration-200 group-hover:opacity-100">
                {item.label}
              </span>
            </Link>
          );
        })}

        {/* Categories Drawer Quick-Open Button */}
        <button
          type="button"
          onClick={onToggleDrawer}
          className="group relative flex items-center justify-center h-10 w-10 rounded-2xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-all cursor-pointer"
        >
          <Grid3X3 className="h-5 w-5 text-indigo-500 dark:text-indigo-400 group-hover:scale-110 transition-transform" />

          {/* Hover Tooltip */}
          <span className="pointer-events-none absolute left-[72px] z-50 hidden md:block whitespace-nowrap rounded-xl bg-slate-900 dark:bg-[#0B1124] px-3 py-1.5 text-xs font-bold text-white opacity-0 shadow-xl border border-slate-700 dark:border-cyan-500/30 transition-opacity duration-200 group-hover:opacity-100">
            All Categories
          </span>
        </button>
      </nav>

      {/* 3. Bottom Section: Search, Audio, Theme, Profile */}
      <div className="flex flex-col items-center gap-2">
        {/* Search / Palette Trigger */}
        <button
          type="button"
          onClick={handleOpenPalette}
          aria-label="Search Games (Ctrl+K)"
          className="group relative flex items-center justify-center h-9 w-9 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0C1226] text-slate-500 hover:text-slate-900 dark:hover:text-white hover:border-cyan-400 transition-all cursor-pointer"
        >
          <Search className="h-4 w-4" />
          <span className="pointer-events-none absolute left-[72px] z-50 hidden md:block whitespace-nowrap rounded-xl bg-slate-900 dark:bg-[#0B1124] px-3 py-1.5 text-xs font-bold text-white opacity-0 shadow-xl border border-slate-700 dark:border-cyan-500/30 transition-opacity duration-200 group-hover:opacity-100">
            Search (Ctrl+K)
          </span>
        </button>

        {/* Global Audio Toggle */}
        <button
          type="button"
          onClick={toggleGlobalSound}
          aria-label={globalMuted ? 'Unmute Audio' : 'Mute Audio'}
          className="group relative flex items-center justify-center h-9 w-9 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0C1226] text-slate-500 hover:text-slate-900 dark:hover:text-white hover:border-cyan-400 transition-all cursor-pointer"
        >
          {globalMuted ? (
            <VolumeX className="h-4 w-4 text-slate-400" />
          ) : (
            <Volume2 className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
          )}
          <span className="pointer-events-none absolute left-[72px] z-50 hidden md:block whitespace-nowrap rounded-xl bg-slate-900 dark:bg-[#0B1124] px-3 py-1.5 text-xs font-bold text-white opacity-0 shadow-xl border border-slate-700 dark:border-cyan-500/30 transition-opacity duration-200 group-hover:opacity-100">
            {globalMuted ? 'Audio: Muted' : 'Audio: Active'}
          </span>
        </button>

        {/* Notifications */}
        <NotificationBell />

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Pilot Profile Emblem */}
        <Link
          href="/profile"
          aria-label="Player Profile"
          className="group relative flex items-center justify-center h-9 w-9 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-[#050811] hover:border-cyan-400 overflow-hidden text-xs cursor-pointer shadow-sm transition-transform hover:scale-105"
        >
          {isCustomImageAvatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={avatar} alt="Avatar" className="h-full w-full object-cover" />
          ) : (
            <span>{avatar || '🤖'}</span>
          )}

          {/* Hover Tooltip */}
          <span className="pointer-events-none absolute left-[72px] z-50 hidden md:block whitespace-nowrap rounded-xl bg-slate-900 dark:bg-[#0B1124] px-3 py-1.5 text-xs font-bold text-white opacity-0 shadow-xl border border-slate-700 dark:border-cyan-500/30 transition-opacity duration-200 group-hover:opacity-100">
            Player Profile
          </span>
        </Link>
      </div>
    </aside>
  );
}