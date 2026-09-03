'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Gamepad2,
  Search,
  Zap,
  Trophy,
  Sparkles,
  User,
  X,
  Menu,
  Volume2,
  VolumeX,
  Compass,
} from 'lucide-react';
import { useGuestVault } from '@/hooks/useGuestVault';
import { NotificationBell } from '../notifications/NotificationBell';
import { ThemeToggle } from '../theme/ThemeToggle';

export function MobileNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const { persona, personaLabel, avatar } = useGuestVault();

  const handleOpenPalette = () => {
    setIsOpen(false);
    window.dispatchEvent(new Event('open-command-palette'));
  };

  return (
    <>
      <div className="flex lg:hidden items-center justify-between w-full px-3 py-2.5 bg-white/90 dark:bg-[#050811]/90 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800">
        <Link
          href="/"
          className="flex items-center gap-2 font-mono font-bold text-lg text-slate-900 dark:text-white"
        >
          <span className="flex items-center justify-center h-8 w-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-purple-600 text-white shadow-md">
            <Gamepad2 className="h-4 w-4" />
          </span>
          <span className="font-display tracking-wider text-base">
            ARCADE<span className="text-cyan-500 dark:text-cyan-400">HUB</span>
          </span>
        </Link>

        <div className="flex items-center gap-1.5 font-mono">
          <button
            type="button"
            onClick={handleOpenPalette}
            aria-label="Search"
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-[#0B1120] text-slate-700 dark:text-slate-300"
          >
            <Search className="h-4 w-4" />
          </button>

          <NotificationBell />

          <ThemeToggle />

          <button
            type="button"
            onClick={() => setIsOpen(true)}
            aria-label="Open Mobile Menu"
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-[#0B1120] text-slate-700 dark:text-slate-300 active:scale-95"
          >
            <Menu className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Mobile Slide-Out Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm animate-in fade-in duration-200 font-sans">
          <div
            className="w-full max-w-xs h-full bg-white dark:bg-[#080D1E] border-l border-slate-200 dark:border-slate-800 p-6 flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-250"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                <div className="flex items-center gap-2">
                  <Gamepad2 className="h-5 w-5 text-cyan-500" />
                  <span className="font-black font-display text-slate-900 dark:text-white">
                    NAVIGATION
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close Menu"
                  className="p-1 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Pilot Card */}
              <Link
                href="/profile"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-[#0D1530] border border-slate-200 dark:border-slate-800 hover:border-cyan-400"
              >
                <div className="h-10 w-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-lg">
                  {avatar || 'Ã°Å¸Â¤â€“'}
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">
                    {personaLabel || 'Guest Pilot'}
                  </div>
                  <div className="text-[10px] font-mono text-cyan-600 dark:text-cyan-400 font-bold">
                    {persona === 'REGISTERED_PLAYER' ? 'Verified Account' : 'Guest Vault'}
                  </div>
                </div>
              </Link>

              {/* Nav Links */}
              <div className="space-y-1.5 font-mono text-xs font-bold">
                <Link
                  href="/"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-cyan-500"
                >
                  <Compass className="h-4 w-4 text-cyan-500" />
                  <span>The Grid</span>
                </Link>

                <Link
                  href="/#explore"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-cyan-500"
                >
                  <Gamepad2 className="h-4 w-4 text-indigo-500" />
                  <span>Discover Games</span>
                </Link>

                <Link
                  href="/io-arena"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-500/40 text-indigo-800 dark:text-cyan-300"
                >
                  <Zap className="h-4 w-4 text-cyan-400 animate-pulse" />
                  <span>.IO Game Arena</span>
                </Link>

                <Link
                  href="/leaderboards"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-amber-500"
                >
                  <Trophy className="h-4 w-4 text-amber-500" />
                  <span>Global Leaderboards</span>
                </Link>

                <Link
                  href="/creator"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-purple-500"
                >
                  <Sparkles className="h-4 w-4 text-purple-500" />
                  <span>Creator Studio</span>
                </Link>
              </div>
            </div>

            {/* Footer */}
            <div className="pt-6 border-t border-slate-200 dark:border-slate-800 text-[11px] font-mono text-slate-500 space-y-2">
              <div className="flex items-center justify-between">
                <span>ArcadeHub v2.0</span>
                <span className="flex items-center gap-1 text-emerald-500">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
                  Online
                </span>
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
}