'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { getAllGames } from '@/lib/games';

export function MobileBottomDock() {
  const router = useRouter();
  const pathname = usePathname();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isJumping, setIsJumping] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
    };
  }, []);

  const handleGridJump = () => {
    setIsJumping(true);
    const allGames = getAllGames();
    if (!allGames || allGames.length === 0) return;

    const currentSlug = pathname.startsWith('/games/') ? pathname.replace('/games/', '') : '';
    const availableGames = allGames.filter((g) => g.slug !== currentSlug);
    const targetPool = availableGames.length > 0 ? availableGames : allGames;

    const randomGame = targetPool[Math.floor(Math.random() * targetPool.length)];

    setTimeout(() => {
      setIsJumping(false);
      router.push(`/games/${randomGame.slug}`);
    }, 200);
  };

  const handleOpenBookmarks = () => {
    window.dispatchEvent(new Event('open_arcadehub_bookmarks'));
  };

  if (isFullscreen) {
    return null;
  }

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 px-3 pb-3 pt-1 pointer-events-none">
      <div className="pointer-events-auto max-w-md mx-auto relative flex items-center justify-around h-14 px-2 rounded-2xl border border-slate-800 bg-[#0B1120]/95 backdrop-blur-2xl shadow-2xl shadow-black/80">
        
        <Link
          href="/"
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
            pathname === '/' ? 'text-cyan-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <span className="text-base leading-none">⚡</span>
          <span className="text-[10px] font-mono mt-1">Grid</span>
        </Link>

        <Link
          href="/#explore"
          className="flex flex-col items-center justify-center flex-1 py-1 text-slate-400 hover:text-slate-200 transition-all"
        >
          <span className="text-base leading-none">🧭</span>
          <span className="text-[10px] font-mono mt-1">Discover</span>
        </Link>

        {/* Center: Elevated Glowing GRID JUMP Button */}
        <div className="relative -top-4 flex items-center justify-center px-1">
          <button
            type="button"
            onClick={handleGridJump}
            disabled={isJumping}
            className="flex items-center justify-center h-12 w-12 rounded-full bg-gradient-to-tr from-cyan-500 via-blue-600 to-purple-600 p-[1.5px] shadow-lg shadow-cyan-500/30 active:scale-90 transition-transform cursor-pointer"
            aria-label="Launch Random Game"
          >
            <div className="h-full w-full bg-[#050811] rounded-full flex items-center justify-center">
              <span className={`text-xl ${isJumping ? 'animate-spin' : ''}`}>🎲</span>
            </div>
          </button>
        </div>

        <button
          type="button"
          onClick={handleOpenBookmarks}
          className="flex flex-col items-center justify-center flex-1 py-1 text-slate-400 hover:text-slate-200 transition-all cursor-pointer"
        >
          <span className="text-base leading-none">🔖</span>
          <span className="text-[10px] font-mono mt-1">Saved</span>
        </button>

        <Link
          href="/profile"
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
            pathname === '/profile' ? 'text-cyan-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <span className="text-base leading-none">🤖</span>
          <span className="text-[10px] font-mono mt-1">Profile</span>
        </Link>

      </div>
    </div>
  );
}