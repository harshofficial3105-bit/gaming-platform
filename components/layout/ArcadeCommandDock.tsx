'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getAllGames } from '@/lib/games';
import { getFavorites } from '@/lib/storage/favorites';
import { playerAuth, PlayerPersona } from '@/lib/player/auth';
import { MyGamesPopover } from '@/components/player/MyGamesPopover';

export function ArcadeCommandDock() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isBookmarksOpen, setIsBookmarksOpen] = useState(false);
  const [bookmarksTab, setBookmarksTab] = useState<'my_list' | 'recent' | 'liked'>('my_list');
  const [bookmarksCount, setBookmarksCount] = useState<number>(0);
  const [persona, setPersona] = useState<PlayerPersona>('NEW_VISITOR');
  const [personaLabel, setPersonaLabel] = useState<string>('Guest');
  const [avatar, setAvatar] = useState<string>('🤖');
  const [isJumping, setIsJumping] = useState(false);
  const [globalMuted, setGlobalMuted] = useState(false);

  const syncState = () => {
    try {
      const favs = getFavorites();
      setBookmarksCount(favs.length);

      const personaInfo = playerAuth.getPersona();
      setPersona(personaInfo.persona);
      setPersonaLabel(personaInfo.label);

      const savedAvatar = localStorage.getItem('arcadehub_player_avatar');
      if (savedAvatar) {
        setAvatar(savedAvatar);
      } else {
        setAvatar(personaInfo.persona === 'REGISTERED_PLAYER' ? '👑' : '🤖');
      }

      const soundMuted = localStorage.getItem('arcadehub_global_muted') === 'true';
      setGlobalMuted(soundMuted);
    } catch {}
  };

  useEffect(() => {
    setMounted(true);
    syncState();

    const handleOpenBookmarks = (e: Event) => {
      const custom = e as CustomEvent<{ tab?: 'my_list' | 'recent' | 'liked' }>;
      if (custom.detail?.tab) {
        setBookmarksTab(custom.detail.tab);
      }
      setIsBookmarksOpen(true);
    };

    window.addEventListener('arcadehub_favorites_updated', syncState);
    window.addEventListener('arcadehub_auth_changed', syncState);
    window.addEventListener('arcadehub_avatar_changed', syncState);
    window.addEventListener('open_arcadehub_bookmarks', handleOpenBookmarks);
    return () => {
      window.removeEventListener('arcadehub_favorites_updated', syncState);
      window.removeEventListener('arcadehub_auth_changed', syncState);
      window.removeEventListener('arcadehub_avatar_changed', syncState);
      window.removeEventListener('open_arcadehub_bookmarks', handleOpenBookmarks);
    };
  }, []);

  const handleOpenPalette = () => {
    window.dispatchEvent(new Event('open_arcadehub_search'));
  };

  const toggleGlobalSound = () => {
    const next = !globalMuted;
    setGlobalMuted(next);
    localStorage.setItem('arcadehub_global_muted', String(next));
    window.dispatchEvent(new CustomEvent('arcadehub_sound_toggled', { detail: { isMuted: next } }));
  };

  const handleGridJump = () => {
    setIsJumping(true);
    const games = getAllGames();
    if (games.length === 0) {
      setIsJumping(false);
      return;
    }
    const randomGame = games[Math.floor(Math.random() * games.length)];
    setTimeout(() => {
      setIsJumping(false);
      router.push(`/games/${randomGame.slug}`);
    }, 400);
  };

  const isCustomImageAvatar = avatar.startsWith('data:image');

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#050811]/90 backdrop-blur-md px-2 sm:px-6 py-2.5 transition-all">
      <nav className="max-w-[1750px] mx-auto flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-4 sm:gap-6">
          <Link
            href="/"
            className="group flex items-center gap-2.5 text-white font-display font-black text-lg sm:text-xl tracking-tight transition-transform active:scale-95"
          >
            <span className="flex items-center justify-center h-8 w-8 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-400 text-black font-bold text-sm shadow-lg shadow-purple-950/60 group-hover:scale-105 transition-transform">
              ⚡
            </span>
            <span className="tracking-wider">
              ARCADE<span className="text-cyan-400">HUB</span>
            </span>
          </Link>

          {/* Quick Category Anchors */}
          <div className="hidden lg:flex items-center gap-5 font-mono text-xs text-slate-400">
            <Link href="/" className="hover:text-cyan-400 transition-colors">
              THE GRID
            </Link>
            <Link href="/#explore" className="hover:text-cyan-400 transition-colors">
              DISCOVER
            </Link>
            <Link href="/#compete" className="hover:text-amber-400 transition-colors flex items-center gap-1">
              <span>🏆</span>
              <span>COMPETE</span>
            </Link>
          </div>
        </div>

        {/* Right: Tactical Action Bar */}
        <div className="flex items-center gap-2 sm:gap-2.5 font-mono">
          
          {/* 1. Global Master Sound Button */}
          <button
            type="button"
            onClick={toggleGlobalSound}
            title={globalMuted ? 'Unmute Audio' : 'Mute Master Audio'}
            className="flex items-center justify-center h-9 w-9 rounded-xl border border-slate-800 bg-[#0B1120] hover:border-slate-700 text-slate-300 transition-all active:scale-95 cursor-pointer shadow-md"
          >
            <span className="text-sm">{globalMuted ? '🔇' : '🔊'}</span>
          </button>

          {/* 2. Tactical Icon-Only Search Button */}
          <div className="relative group/search">
            <button
              type="button"
              onClick={handleOpenPalette}
              title="Search Games (Ctrl+K)"
              className="flex items-center justify-center h-9 w-9 rounded-xl border border-slate-800 bg-[#0B1120] hover:border-cyan-400/60 text-slate-300 hover:text-white transition-all active:scale-95 cursor-pointer shadow-md"
            >
              <svg
                className="h-4 w-4 stroke-slate-300 group-hover/search:stroke-cyan-300 transition-colors"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2.5 py-1 rounded-lg bg-[#050811]/95 border border-cyan-500/40 shadow-xl text-[10px] font-bold text-cyan-200 whitespace-nowrap opacity-0 group-hover/search:opacity-100 transition-opacity pointer-events-none z-50">
              SEARCH (Ctrl+K)
            </div>
          </div>

          {/* 3. Bookmark / My Games Popover */}
          <div className="relative">
            <div className="relative group/bookmark">
              <button
                type="button"
                data-bookmark-trigger="true"
                onClick={() => setIsBookmarksOpen(!isBookmarksOpen)}
                title="My Games Library (Ctrl+B)"
                className={`relative flex items-center justify-center h-9 w-9 rounded-xl border transition-all cursor-pointer active:scale-95 shadow-md ${
                  isBookmarksOpen
                    ? 'bg-purple-600 border-purple-400 text-white shadow-purple-950/50'
                    : 'bg-[#181F34] hover:bg-[#222B48] border-slate-700 text-slate-300 hover:text-white'
                }`}
              >
                <svg
                  className={`h-4 w-4 transition-colors ${
                    isBookmarksOpen ? 'stroke-white fill-white' : 'stroke-slate-200 fill-none'
                  }`}
                  viewBox="0 0 24 24"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                </svg>

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

          {/* 4. Grid Jump Random Game (🎲) */}
          <div className="relative group/jump">
            <button
              type="button"
              onClick={handleGridJump}
              disabled={isJumping}
              title="Jump to Random Game (Ctrl+J)"
              className="flex items-center justify-center h-9 w-9 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white shadow-lg shadow-purple-950/40 active:scale-95 transition-all cursor-pointer border border-purple-400/40"
            >
              <span className={`text-base transition-transform ${isJumping ? 'animate-spin' : 'group-hover/jump:scale-125'}`}>
                🎲
              </span>
            </button>
          </div>

          {/* 5. Dynamic Player Persona Badge */}
          <Link
            href="/profile"
            className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-colors ${
              persona === 'REGISTERED_PLAYER'
                ? 'border-purple-500/50 bg-purple-950/30 hover:border-purple-400'
                : persona === 'GUEST_PLAYER'
                ? 'border-emerald-500/40 bg-[#050811]/80 hover:border-emerald-400'
                : 'border-cyan-500/30 bg-[#050811]/80 hover:border-cyan-400'
            }`}
          >
            <span className={`h-2 w-2 rounded-full ${
              persona === 'REGISTERED_PLAYER'
                ? 'bg-purple-400 shadow-[0_0_8px_rgba(168,85,247,0.8)]'
                : persona === 'GUEST_PLAYER'
                ? 'bg-emerald-400 animate-pulse'
                : 'bg-cyan-400'
            }`} />
            <div className="flex flex-col text-left">
              <span className="text-[10px] font-bold text-slate-200 leading-none">
                {persona === 'REGISTERED_PLAYER' ? 'VERIFIED PILOT' : persona === 'GUEST_PLAYER' ? 'GUEST PLAYER' : 'NEW VISITOR'}
              </span>
              <span className={`text-[9px] leading-tight font-bold ${
                persona === 'REGISTERED_PLAYER' ? 'text-purple-300' : persona === 'GUEST_PLAYER' ? 'text-emerald-400' : 'text-cyan-400'
              }`}>
                {mounted ? personaLabel : 'Online'}
              </span>
            </div>
          </Link>

          {/* 6. Player Profile Emblem */}
          <div className="relative group/profile">
            <Link
              href="/profile"
              title="Player Profile"
              className="flex items-center justify-center h-9 w-9 rounded-xl border border-slate-800 bg-[#050811] hover:border-cyan-400/70 text-slate-300 hover:text-cyan-300 transition-all active:scale-95 cursor-pointer overflow-hidden shadow-md"
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
                  {avatar}
                </span>
              )}
            </Link>
          </div>

        </div>

      </nav>
    </header>
  );
}