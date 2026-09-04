'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Gamepad2,
  Search,
  Zap,
  Trophy,
  Users,
  Compass,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { NotificationBell } from '@/components/notifications/NotificationBell';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { useGuestVault } from '@/hooks/useGuestVault';

interface HybridFloatingDockProps {
  isVisible: boolean;
}

export function HybridFloatingDock({ isVisible }: HybridFloatingDockProps) {
  const pathname = usePathname();
  const { avatar } = useGuestVault();
  const [globalMuted, setGlobalMuted] = useState(false);

  useEffect(() => {
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

  const isCustomImageAvatar =
    avatar &&
    (avatar.startsWith('/') ||
      avatar.startsWith('http') ||
      avatar.startsWith('data:'));

  const navLinks = [
    { label: 'Grid', href: '/', icon: Gamepad2, active: pathname === '/' },
    { label: 'Discover', href: '/#explore', icon: Compass, active: false },
    { label: '.IO', href: '/io-arena', icon: Zap, isIo: true, active: pathname === '/io-arena' },
    { label: 'Ranks', href: '/leaderboards', icon: Trophy, active: pathname === '/leaderboards' },
    { label: 'Creators', href: '/creator', icon: Users, active: pathname.startsWith('/creator') },
  ];

  return (
    <div
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-60 transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] font-mono ${
        isVisible
          ? 'opacity-100 translate-y-0 scale-100 blur-0 pointer-events-auto'
          : 'opacity-0 -translate-y-6 scale-95 blur-xs pointer-events-none'
      }`}
    >
      <nav
        aria-label="ArcadeHub Floating Command Dock"
        className="min-h-[54px] flex items-center gap-2 sm:gap-3 px-3.5 sm:px-4 py-2 rounded-full border border-indigo-200/90 dark:border-cyan-500/40 bg-white/95 dark:bg-[#060A18]/95 backdrop-blur-2xl shadow-2xl shadow-indigo-950/25 dark:shadow-[0_8px_32px_rgba(0,240,255,0.2)] text-xs transition-all ring-1 ring-cyan-400/20"
      >
        {/* Left: Compact Brand Pill */}
        <Link
          href="/"
          className="flex items-center gap-1.5 pl-1.5 pr-3 py-1 rounded-full bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 text-white font-black hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-md shadow-cyan-500/20"
        >
          <Gamepad2 className="h-4 w-4" />
          <span className="text-[11px] font-display font-extrabold tracking-wider">
            ARCADE<span className="text-cyan-200">HUB</span>
          </span>
        </Link>

        {/* Separator */}
        <span className="h-4 w-[1px] bg-slate-200 dark:border-slate-800 bg-slate-200 dark:bg-slate-800" />

        {/* Center: Navigation Links */}
        <div className="flex items-center gap-1">
          {navLinks.map((link) => {
            if (link.isIo) {
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-indigo-500/10 to-cyan-500/15 border border-indigo-300 dark:border-indigo-500/50 text-indigo-700 dark:text-cyan-300 hover:border-cyan-400 font-black transition-all text-[11px] shadow-sm ring-1 ring-cyan-400/20"
                >
                  <Zap className="h-3 w-3 text-cyan-400 fill-current animate-pulse" />
                  <span>.IO</span>
                </Link>
              );
            }

            return (
              <Link
                key={link.label}
                href={link.href}
                className={`px-2.5 py-1 rounded-full font-bold text-[11px] transition-all duration-200 ${
                  link.active
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-950/40'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80'
                }`}
              >
                {link.icon && <link.icon className="h-3 w-3 inline mr-1 text-slate-400" />}
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Separator */}
        <span className="h-4 w-[1px] bg-slate-200 dark:bg-slate-800" />

        {/* Right: Tactical Action Controls */}
        <div className="flex items-center gap-1.5">
          {/* Quick Search */}
          <button
            type="button"
            onClick={handleOpenPalette}
            aria-label="Search Games (Ctrl+K)"
            title="Search Games (Ctrl+K)"
            className="p-1.5 rounded-full border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-[#0B1124] text-slate-700 dark:text-slate-300 hover:border-cyan-400 hover:text-cyan-500 active:scale-95 transition-all cursor-pointer"
          >
            <Search className="h-3.5 w-3.5" />
          </button>

          {/* Audio */}
          <button
            type="button"
            onClick={toggleGlobalSound}
            aria-label={globalMuted ? 'Unmute Audio' : 'Mute Audio'}
            title={globalMuted ? 'Unmute Audio' : 'Mute Audio'}
            className="p-1.5 rounded-full border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-[#0B1124] text-slate-700 dark:text-slate-300 hover:border-cyan-400 hover:text-cyan-500 active:scale-95 transition-all cursor-pointer"
          >
            {globalMuted ? (
              <VolumeX className="h-3.5 w-3.5 text-slate-400" />
            ) : (
              <Volume2 className="h-3.5 w-3.5 text-cyan-500" />
            )}
          </button>

          {/* Real-time Notifications Bell */}
          <NotificationBell />

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Profile Emblem */}
          <Link
            href="/profile"
            title="Player Profile"
            aria-label="Player Profile"
            className="flex items-center justify-center h-7 w-7 rounded-full border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-[#050811] hover:border-cyan-400 overflow-hidden text-xs active:scale-95 transition-transform"
          >
            {isCustomImageAvatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={avatar} alt="Avatar" className="h-full w-full object-cover" />
            ) : (
              <span>{avatar || '🤖'}</span>
            )}
          </Link>
        </div>
      </nav>
    </div>
  );
}