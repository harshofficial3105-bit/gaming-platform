'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getAllGames } from '@/lib/games';
import {
  Gamepad2,
  Compass,
  Shuffle,
  History,
  Bookmark,
  Trophy,
  User,
  Sparkles,
  MessageSquare,
  AlertTriangle,
} from 'lucide-react';

export function Footer() {
  const router = useRouter();

  const handleOpenFeedback = () => {
    window.dispatchEvent(new Event('open_arcadehub_feedback'));
  };

  const handleOpenBookmarks = (tab: 'my_list' | 'recent') => {
    window.dispatchEvent(
      new CustomEvent('open_arcadehub_bookmarks', { detail: { tab } })
    );
  };

  const handleGridJump = () => {
    const allGames = getAllGames();
    if (allGames.length > 0) {
      const randomGame = allGames[Math.floor(Math.random() * allGames.length)];
      router.push(`/games/${randomGame.slug}`);
    }
  };

  return (
    <footer className="mt-auto border-t border-slate-800/80 dark:border-slate-800/80 light:border-slate-200 bg-[#050811] dark:bg-[#050811] light:bg-white text-slate-400 dark:text-slate-400 light:text-slate-600 font-sans transition-colors">
      <div className="max-w-[1750px] mx-auto px-4 sm:px-6 py-10 space-y-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Column 1: Brand & Tagline */}
          <div className="space-y-3 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="flex items-center justify-center h-8 w-8 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 p-[1px]">
                <div className="h-full w-full bg-[#050811] dark:bg-[#050811] light:bg-white rounded-[11px] flex items-center justify-center">
                  <Gamepad2 className="h-4 w-4 text-cyan-400" />
                </div>
              </div>
              <span className="text-base font-black tracking-wider text-white dark:text-white light:text-slate-900 font-display">
                ARCADE<span className="text-cyan-400">HUB</span>
              </span>
            </Link>
            <p className="text-xs text-slate-500 font-mono leading-relaxed">
              The high-performance HTML5 browser gaming network. Instant guest saves, anti-cheat leaderboards, and zero downloads.
            </p>
          </div>

          {/* Column 2: EXPLORE */}
          <div className="space-y-3 font-mono text-xs">
            <h4 className="text-white dark:text-white light:text-slate-900 font-bold tracking-wider uppercase text-[11px]">
              EXPLORE
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="hover:text-cyan-300 dark:hover:text-cyan-300 light:hover:text-indigo-600 transition-colors flex items-center gap-1.5">
                  <Compass className="h-3.5 w-3.5 text-cyan-400" />
                  <span>The Grid</span>
                </Link>
              </li>
              <li>
                <Link href="/#explore" className="hover:text-cyan-600 dark:hover:text-cyan-300 transition-colors flex items-center gap-1.5">
                  <Gamepad2 className="h-3.5 w-3.5 text-cyan-500" />
                  <span>Discover Games</span>
                </Link>
              </li>
              <li>
                <Link href="/io-arena" className="hover:text-cyan-600 dark:hover:text-cyan-300 transition-colors flex items-center gap-1.5 font-bold text-indigo-600 dark:text-cyan-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  <span>.IO Game Arena</span>
                </Link>
              </li>
              <li>
                <button
                  type="button"
                  onClick={handleGridJump}
                  className="hover:text-cyan-300 dark:hover:text-cyan-300 light:hover:text-indigo-600 transition-colors cursor-pointer text-left flex items-center gap-1.5"
                >
                  <Shuffle className="h-3.5 w-3.5 text-purple-400" />
                  <span>Grid Jump (Random)</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: PLAYER */}
          <div className="space-y-3 font-mono text-xs">
            <h4 className="text-white dark:text-white light:text-slate-900 font-bold tracking-wider uppercase text-[11px]">
              PLAYER
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  type="button"
                  onClick={() => handleOpenBookmarks('recent')}
                  className="hover:text-cyan-300 dark:hover:text-cyan-300 light:hover:text-indigo-600 transition-colors cursor-pointer text-left flex items-center gap-1.5"
                >
                  <History className="h-3.5 w-3.5 text-slate-400" />
                  <span>Continue Playing</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleOpenBookmarks('my_list')}
                  className="hover:text-cyan-300 dark:hover:text-cyan-300 light:hover:text-indigo-600 transition-colors cursor-pointer text-left flex items-center gap-1.5"
                >
                  <Bookmark className="h-3.5 w-3.5 text-purple-400" />
                  <span>Favorites & My Library</span>
                </button>
              </li>
              <li>
                <Link href="/leaderboards" className="hover:text-cyan-300 dark:hover:text-cyan-300 light:hover:text-indigo-600 transition-colors flex items-center gap-1.5">
                  <Trophy className="h-3.5 w-3.5 text-amber-400" />
                  <span>Global Leaderboards</span>
                </Link>
              </li>
              <li>
                <Link href="/profile" className="hover:text-cyan-300 dark:hover:text-cyan-300 light:hover:text-indigo-600 transition-colors flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-cyan-400" />
                  <span>Player Profile & Records</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: CREATORS & SUPPORT */}
          <div className="space-y-3 font-mono text-xs">
            <h4 className="text-white dark:text-white light:text-slate-900 font-bold tracking-wider uppercase text-[11px]">
              CREATORS
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/creator/signup" className="text-purple-400 hover:text-purple-300 transition-colors font-bold flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-purple-400" />
                  <span>Become a Creator</span>
                </Link>
              </li>
              <li>
                <Link href="/creator" className="text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1.5">
                  <Gamepad2 className="h-3.5 w-3.5 text-purple-400" />
                  <span>Creator Studio Portal</span>
                </Link>
              </li>
            </ul>

            <h4 className="text-white dark:text-white light:text-slate-900 font-bold tracking-wider uppercase text-[11px] pt-2">
              SUPPORT
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  type="button"
                  onClick={handleOpenFeedback}
                  className="hover:text-cyan-300 dark:hover:text-cyan-300 light:hover:text-indigo-600 transition-colors cursor-pointer text-left flex items-center gap-1.5"
                >
                  <MessageSquare className="h-3.5 w-3.5 text-slate-400" />
                  <span>Platform Feedback</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={handleOpenFeedback}
                  className="hover:text-cyan-300 dark:hover:text-cyan-300 light:hover:text-indigo-600 transition-colors cursor-pointer text-left flex items-center gap-1.5"
                >
                  <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />
                  <span>Report an Issue</span>
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800/80 dark:border-slate-800/80 light:border-slate-200 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-slate-500">
          <p>Ã‚Â© {new Date().getFullYear()} ArcadeHub. Built for instant high-performance play.</p>
          <div className="flex items-center gap-4">
            <Link href="/" className="hover:text-slate-400 cursor-pointer">The Grid</Link>
            <span>Ã¢â‚¬Â¢</span>
            <Link href="/leaderboards" className="hover:text-slate-400 cursor-pointer">Leaderboards</Link>
            <span>Ã¢â‚¬Â¢</span>
            <Link href="/profile" className="hover:text-slate-400 cursor-pointer">Profile</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}