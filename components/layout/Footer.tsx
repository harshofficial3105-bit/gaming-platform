'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getAllGames } from '@/lib/games';

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
    <footer className="mt-auto border-t border-slate-800/80 bg-[#050811] text-slate-400 font-sans">
      <div className="max-w-[1750px] mx-auto px-4 sm:px-6 py-10 space-y-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Column 1: Brand & Tagline */}
          <div className="space-y-3 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="flex items-center justify-center h-8 w-8 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 p-[1px]">
                <div className="h-full w-full bg-[#050811] rounded-[11px] flex items-center justify-center">
                  <span className="font-mono font-black text-xs text-cyan-400">âš¡</span>
                </div>
              </div>
              <span className="text-base font-black tracking-wider text-white font-display">
                ARCADE<span className="text-cyan-400">HUB</span>
              </span>
            </Link>
            <p className="text-xs text-slate-500 font-mono leading-relaxed">
              The high-performance HTML5 browser gaming network. Instant guest saves, anti-cheat leaderboards, and zero downloads.
            </p>
          </div>

          {/* Column 2: EXPLORE */}
          <div className="space-y-3 font-mono text-xs">
            <h4 className="text-white font-bold tracking-wider uppercase text-[11px]">
              EXPLORE
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="hover:text-cyan-300 transition-colors">
                  â€¢ The Grid
                </Link>
              </li>
              <li>
                <Link href="/#explore" className="hover:text-cyan-300 transition-colors">
                  â€¢ Discover Games
                </Link>
              </li>
              <li>
                <button
                  type="button"
                  onClick={handleGridJump}
                  className="hover:text-cyan-300 transition-colors cursor-pointer text-left"
                >
                  â€¢ Grid Jump (ðŸŽ²)
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: PLAYER */}
          <div className="space-y-3 font-mono text-xs">
            <h4 className="text-white font-bold tracking-wider uppercase text-[11px]">
              PLAYER
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  type="button"
                  onClick={() => handleOpenBookmarks('recent')}
                  className="hover:text-cyan-300 transition-colors cursor-pointer text-left"
                >
                  â€¢ Continue Playing
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleOpenBookmarks('my_list')}
                  className="hover:text-cyan-300 transition-colors cursor-pointer text-left"
                >
                  â€¢ Favorites & My List
                </button>
              </li>
              <li>
                <Link href="/leaderboards" className="hover:text-cyan-300 transition-colors">
                  â€¢ Global Leaderboards
                </Link>
              </li>
              <li>
                <Link href="/profile" className="hover:text-cyan-300 transition-colors">
                  â€¢ Player Profile & Records
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: CREATORS & SUPPORT */}
          <div className="space-y-3 font-mono text-xs">
            <h4 className="text-white font-bold tracking-wider uppercase text-[11px]">
              CREATORS
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/creator/signup" className="text-purple-400 hover:text-purple-300 transition-colors font-bold">
                  â€¢ Become a Creator
                </Link>
              </li>
              <li>
                <Link href="/creator" className="text-purple-400 hover:text-purple-300 transition-colors">
                  â€¢ Creator Studio Portal
                </Link>
              </li>
            </ul>

            <h4 className="text-white font-bold tracking-wider uppercase text-[11px] pt-2">
              SUPPORT
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  type="button"
                  onClick={handleOpenFeedback}
                  className="hover:text-cyan-300 transition-colors cursor-pointer text-left"
                >
                  â€¢ Platform Feedback
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={handleOpenFeedback}
                  className="hover:text-cyan-300 transition-colors cursor-pointer text-left"
                >
                  â€¢ Report an Issue
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800/80 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-slate-500">
          <p>Â© {new Date().getFullYear()} ArcadeHub. Built for instant high-performance play.</p>
          <div className="flex items-center gap-4">
            <Link href="/" className="hover:text-slate-400 cursor-pointer">The Grid</Link>
            <span>â€¢</span>
            <Link href="/leaderboards" className="hover:text-slate-400 cursor-pointer">Leaderboards</Link>
            <span>â€¢</span>
            <Link href="/profile" className="hover:text-slate-400 cursor-pointer">Profile</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}