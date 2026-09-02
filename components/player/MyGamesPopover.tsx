'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { getAllGames, ExtendedGame } from '@/lib/games';
import { getFavorites, toggleFavorite } from '@/lib/storage/favorites';
import { getLikes, toggleLike } from '@/lib/storage/likes';
import { guestVault } from '@/lib/storage/guestVault';
import { playerAuth } from '@/lib/player/auth';
import { GameImage } from '@/components/ui/GameImage';

type TabType = 'my_list' | 'recent' | 'liked';

interface MyGamesPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: TabType;
}

export function MyGamesPopover({ isOpen, onClose, initialTab = 'my_list' }: MyGamesPopoverProps) {
  const [activeTab, setActiveTab] = useState<TabType>(initialTab);
  const [email, setEmail] = useState('');
  const [favorites, setFavorites] = useState<ExtendedGame[]>([]);
  const [recentGames, setRecentGames] = useState<{ game: ExtendedGame; lastPlayed: number; score: number }[]>([]);
  const [likedGames, setLikedGames] = useState<ExtendedGame[]>([]);
  const [isRegistered, setIsRegistered] = useState(false);
  const [authSuccess, setAuthSuccess] = useState(false);
  const [authLoading, setAuthLoading] = useState<string | null>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  const loadData = () => {
    const allGames = getAllGames();
    const favIds = getFavorites();
    const likedIds = getLikes();
    const saves = guestVault.getAllSaves();

    // 1. My List / Bookmarks
    const favs = allGames.filter((g) => favIds.includes(g.id));
    setFavorites(favs);

    // 2. Recent Played (with actual timestamp & scores)
    const recents: { game: ExtendedGame; lastPlayed: number; score: number }[] = [];
    saves.forEach((s) => {
      const found = allGames.find((g) => g.id === s.gameId || g.slug === s.gameId);
      if (found && !recents.some((r) => r.game.id === found.id)) {
        recents.push({
          game: found,
          lastPlayed: s.lastUpdated || Date.now(),
          score: typeof s.data?.highScore === 'number' ? s.data.highScore : 0,
        });
      }
    });

    // Check direct Space Gem Collector score key
    const directSpaceBest = Number(localStorage.getItem('arcadehub_game_space-gem-collector_best_score') || 0);
    const spaceGemGame = allGames.find((g) => g.id === 'space-gem-collector');
    if (spaceGemGame && !recents.some((r) => r.game.id === 'space-gem-collector')) {
      recents.push({
        game: spaceGemGame,
        lastPlayed: Date.now(),
        score: directSpaceBest,
      });
    }

    recents.sort((a, b) => b.lastPlayed - a.lastPlayed);
    setRecentGames(recents);

    // 3. Liked Games
    const liked: ExtendedGame[] = [];
    allGames.forEach((g) => {
      if (likedIds.includes(g.id)) {
        liked.push(g);
      } else {
        const vote = localStorage.getItem(`arcadehub_vote_${g.id}`);
        if (vote && Number(vote) >= 4 && !liked.some((item) => item.id === g.id)) {
          liked.push(g);
        }
      }
    });
    setLikedGames(liked);

    // Auth status
    const token = localStorage.getItem('arcadehub_user_token');
    setIsRegistered(Boolean(token));
  };

  useEffect(() => {
    if (isOpen) {
      loadData();
      if (initialTab) setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        // Only close if click is not on the trigger button itself
        const target = e.target as HTMLElement;
        if (!target.closest('[data-bookmark-trigger]')) {
          onClose();
        }
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleOAuth = async (provider: 'google' | 'facebook' | 'apple') => {
    setAuthLoading(provider);
    try {
      await new Promise((resolve) => setTimeout(resolve, 400));
      if (provider === 'apple') {
        const randomId = Math.floor(Math.random() * 900 + 100);
        playerAuth.register(`apple_pilot_${randomId}`, `pilot_${randomId}@icloud.com`, '🍎');
      } else {
        playerAuth.signInWithProvider(provider);
      }
      setIsRegistered(true);
      setAuthSuccess(true);
      loadData();
      setTimeout(() => setAuthSuccess(false), 1200);
    } catch {}
    setAuthLoading(null);
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    playerAuth.login(email);
    setIsRegistered(true);
    setAuthSuccess(true);
    setEmail('');
    loadData();
    setTimeout(() => setAuthSuccess(false), 1200);
  };

  const handleRemoveFavorite = (e: React.MouseEvent, gameId: string) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(gameId);
    loadData();
  };

  const handleRemoveLiked = (e: React.MouseEvent, gameId: string) => {
    e.preventDefault();
    e.stopPropagation();
    toggleLike(gameId);
    loadData();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* 1. Subtle non-obtrusive backdrop (Home page remains visible behind) */}
      <div
        className="fixed inset-0 z-40 bg-black/25 backdrop-blur-[2px] transition-opacity duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* 2. Compact Navigation-Connected Floating Popover Panel */}
      <div
        ref={popoverRef}
        role="dialog"
        aria-modal="true"
        aria-label="My Games"
        className="fixed sm:absolute top-16 sm:top-full left-3 right-3 sm:left-auto sm:right-0 sm:mt-2 z-50 w-auto sm:w-[480px] max-w-[calc(100vw-24px)] rounded-2xl border border-slate-700/70 bg-[#161B2B]/95 backdrop-blur-2xl shadow-2xl shadow-black/80 text-slate-100 font-sans p-4 sm:p-5 space-y-4 max-h-[calc(100vh-80px)] sm:max-h-[580px] flex flex-col justify-between overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200"
      >
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-base">🔖</span>
            <h2 className="text-sm sm:text-base font-bold text-white tracking-tight">
              My Games
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex items-center justify-center h-7 w-7 rounded-full text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors cursor-pointer text-xs"
            aria-label="Close My Games"
          >
            ✕
          </button>
        </div>

        {/* Navigation Tabs (My List | Recent | Liked) */}
        <div className="flex items-center border-b border-slate-800/80 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('my_list')}
            className={`flex-1 pb-2.5 text-center transition-colors cursor-pointer relative ${
              activeTab === 'my_list'
                ? 'text-white font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>My List</span>
            {favorites.length > 0 && (
              <span className="ml-1 text-[10px] text-purple-300 font-mono">({favorites.length})</span>
            )}
            {activeTab === 'my_list' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('recent')}
            className={`flex-1 pb-2.5 text-center transition-colors cursor-pointer relative ${
              activeTab === 'recent'
                ? 'text-white font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>Recent</span>
            {recentGames.length > 0 && (
              <span className="ml-1 text-[10px] text-cyan-300 font-mono">({recentGames.length})</span>
            )}
            {activeTab === 'recent' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('liked')}
            className={`flex-1 pb-2.5 text-center transition-colors cursor-pointer relative ${
              activeTab === 'liked'
                ? 'text-white font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>Liked</span>
            {likedGames.length > 0 && (
              <span className="ml-1 text-[10px] text-rose-300 font-mono">({likedGames.length})</span>
            )}
            {activeTab === 'liked' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full" />
            )}
          </button>
        </div>

        {/* Main Popover Scrollable Body */}
        <div className="flex-1 overflow-y-auto space-y-3 py-1 scrollbar-thin pr-0.5">
          
          {/* TAB 1: MY LIST */}
          {activeTab === 'my_list' && (
            <div>
              {!isRegistered && favorites.length === 0 ? (
                /* Compact Guest Registration State */
                <div className="space-y-3.5 py-2 text-center">
                  <div className="flex justify-center">
                    <div className="flex items-center justify-center h-12 w-12 rounded-2xl bg-[#1F273D] border border-slate-700/60 text-slate-300 text-xl shadow-inner">
                      <svg
                        className="h-6 w-6 stroke-slate-200 fill-none"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                      </svg>
                    </div>
                  </div>

                  <div className="space-y-1 max-w-[320px] mx-auto">
                    <h3 className="text-sm font-bold text-white leading-tight">
                      Create an account to save games to My Games
                    </h3>
                    <p className="text-[11px] text-slate-400 leading-normal">
                      Save your favorite games and access them across devices.
                    </p>
                  </div>

                  {/* Social 1-Click Buttons */}
                  <div className="space-y-2 pt-1 max-w-[340px] mx-auto">
                    {/* Google */}
                    <button
                      type="button"
                      disabled={Boolean(authLoading)}
                      onClick={() => handleOAuth('google')}
                      className="w-full py-2 px-3 rounded-full bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2 shadow-sm"
                    >
                      <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                        />
                      </svg>
                      <span>Continue with Google</span>
                    </button>

                    {/* Facebook */}
                    <button
                      type="button"
                      disabled={Boolean(authLoading)}
                      onClick={() => handleOAuth('facebook')}
                      className="w-full py-2 px-3 rounded-full bg-[#1877F2] hover:bg-[#166fe5] text-white font-bold text-xs transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2 shadow-sm"
                    >
                      <svg className="h-3.5 w-3.5 shrink-0 fill-white" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                      <span>Continue with Facebook</span>
                    </button>

                    {/* Apple */}
                    <button
                      type="button"
                      disabled={Boolean(authLoading)}
                      onClick={() => handleOAuth('apple')}
                      className="w-full py-2 px-3 rounded-full bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2 shadow-sm"
                    >
                      <svg className="h-3.5 w-3.5 shrink-0 fill-black" viewBox="0 0 24 24">
                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.86c.65-.79 1.09-1.89.97-2.99-1 .04-2.14.67-2.81 1.45-.58.67-1.1 1.77-.96 2.85 1.11.09 2.19-.57 2.8-1.31z" />
                      </svg>
                      <span>Continue with Apple</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2 py-0.5 max-w-[340px] mx-auto">
                    <div className="h-[1px] flex-1 bg-slate-800" />
                    <span className="text-[10px] text-slate-500 font-bold">OR</span>
                    <div className="h-[1px] flex-1 bg-slate-800" />
                  </div>

                  {/* Real Email Form */}
                  <form onSubmit={handleEmailSubmit} className="space-y-2 max-w-[340px] mx-auto">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full py-2 px-3.5 rounded-xl border border-slate-700 bg-[#0B1120] text-xs text-white placeholder-slate-500 outline-none focus:border-purple-400 transition-colors"
                    />
                    <button
                      type="submit"
                      className="w-full py-2 px-4 rounded-xl bg-[#262F48] hover:bg-[#323D5C] text-slate-200 hover:text-white font-bold text-xs transition-colors cursor-pointer shadow-sm"
                    >
                      Continue
                    </button>
                  </form>
                </div>
              ) : favorites.length > 0 ? (
                /* Populated My List */
                <div className="space-y-2">
                  {favorites.map((game) => (
                    <div
                      key={game.id}
                      className="flex items-center justify-between gap-3 p-2 rounded-xl border border-slate-800 bg-[#0B1120] hover:border-purple-500/50 transition-all group"
                    >
                      <Link
                        href={`/games/${game.slug}`}
                        onClick={onClose}
                        className="flex items-center gap-3 min-w-0 flex-1"
                      >
                        <div className="relative h-11 w-14 rounded-lg overflow-hidden bg-[#050811] shrink-0 border border-slate-800">
                          <GameImage src={game.thumbnailUrl} alt={game.title} className="object-cover" />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-xs font-bold text-white group-hover:text-purple-300 truncate">
                            {game.title}
                          </span>
                          <span className="text-[10px] text-slate-400 capitalize font-mono">
                            {game.category} • ~{game.playTimeMinutes || 3}m
                          </span>
                        </div>
                      </Link>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <Link
                          href={`/games/${game.slug}`}
                          onClick={onClose}
                          className="px-2.5 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-[11px] shadow-sm active:scale-95 transition-all flex items-center gap-1"
                        >
                          <span>▶</span>
                          <span>Play</span>
                        </Link>
                        <button
                          type="button"
                          onClick={(e) => handleRemoveFavorite(e, game.id)}
                          className="p-1 text-slate-500 hover:text-rose-400 text-xs cursor-pointer"
                          title="Remove from My List"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* Empty My List State */
                <div className="py-8 text-center space-y-1.5 font-mono">
                  <span className="text-2xl">🔖</span>
                  <p className="text-xs text-slate-300 font-bold">No saved games yet</p>
                  <p className="text-[11px] text-slate-500">
                    Explore ArcadeHub and add games to your list.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: RECENT PLAYED */}
          {activeTab === 'recent' && (
            <div>
              {recentGames.length > 0 ? (
                <div className="space-y-2">
                  {recentGames.map(({ game, lastPlayed, score }) => (
                    <div
                      key={game.id}
                      className="flex items-center justify-between gap-3 p-2 rounded-xl border border-slate-800 bg-[#0B1120] hover:border-cyan-500/50 transition-all group"
                    >
                      <Link
                        href={`/games/${game.slug}`}
                        onClick={onClose}
                        className="flex items-center gap-3 min-w-0 flex-1"
                      >
                        <div className="relative h-11 w-14 rounded-lg overflow-hidden bg-[#050811] shrink-0 border border-slate-800">
                          <GameImage src={game.thumbnailUrl} alt={game.title} className="object-cover" />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-xs font-bold text-white group-hover:text-cyan-300 truncate">
                            {game.title}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {score > 0 ? `Best: ${score.toLocaleString()} PTS` : 'Played'} • {new Date(lastPlayed).toLocaleDateString()}
                          </span>
                        </div>
                      </Link>

                      <Link
                        href={`/games/${game.slug}`}
                        onClick={onClose}
                        className="px-2.5 py-1 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-[11px] shadow-sm active:scale-95 transition-all flex items-center gap-1 shrink-0"
                      >
                        <span>▶</span>
                        <span>Play</span>
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center space-y-1.5 font-mono">
                  <span className="text-2xl">🕒</span>
                  <p className="text-xs text-slate-300 font-bold">No recently played games yet</p>
                  <p className="text-[11px] text-slate-500">
                    Start playing on the grid to build your history.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: LIKED */}
          {activeTab === 'liked' && (
            <div>
              {likedGames.length > 0 ? (
                <div className="space-y-2">
                  {likedGames.map((game) => (
                    <div
                      key={game.id}
                      className="flex items-center justify-between gap-3 p-2 rounded-xl border border-slate-800 bg-[#0B1120] hover:border-rose-500/50 transition-all group"
                    >
                      <Link
                        href={`/games/${game.slug}`}
                        onClick={onClose}
                        className="flex items-center gap-3 min-w-0 flex-1"
                      >
                        <div className="relative h-11 w-14 rounded-lg overflow-hidden bg-[#050811] shrink-0 border border-slate-800">
                          <GameImage src={game.thumbnailUrl} alt={game.title} className="object-cover" />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-xs font-bold text-white group-hover:text-rose-300 truncate">
                            {game.title}
                          </span>
                          <span className="text-[10px] text-slate-400 capitalize font-mono">
                            {game.category} • Liked ❤️
                          </span>
                        </div>
                      </Link>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <Link
                          href={`/games/${game.slug}`}
                          onClick={onClose}
                          className="px-2.5 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-[11px] shadow-sm active:scale-95 transition-all flex items-center gap-1"
                        >
                          <span>▶</span>
                          <span>Play</span>
                        </Link>
                        <button
                          type="button"
                          onClick={(e) => handleRemoveLiked(e, game.id)}
                          className="p-1 text-slate-500 hover:text-rose-400 text-xs cursor-pointer"
                          title="Remove Like"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center space-y-1.5 font-mono">
                  <span className="text-2xl">❤️</span>
                  <p className="text-xs text-slate-300 font-bold">No liked games yet</p>
                  <p className="text-[11px] text-slate-500">
                    Tap the like button on games you enjoy.
                  </p>
                </div>
              )}
            </div>
          )}

          {authSuccess && (
            <p className="text-xs text-emerald-400 font-bold text-center animate-in fade-in py-1">
              ✓ Account Connected!
            </p>
          )}

        </div>

      </div>
    </>
  );
}