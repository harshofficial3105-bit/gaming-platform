'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getAllGames, ExtendedGame } from '@/lib/games';
import { getFavorites, toggleFavorite } from '@/lib/storage/favorites';
import { getLikes, toggleLike } from '@/lib/storage/likes';
import { guestVault } from '@/lib/storage/guestVault';
import { playerAuth } from '@/lib/player/auth';
import { GameImage } from '@/components/ui/GameImage';

type TabType = 'my_list' | 'recent' | 'liked';

export function MyGamesModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('my_list');
  const [email, setEmail] = useState('');
  const [favorites, setFavorites] = useState<ExtendedGame[]>([]);
  const [recentGames, setRecentGames] = useState<ExtendedGame[]>([]);
  const [likedGames, setLikedGames] = useState<ExtendedGame[]>([]);
  const [isRegistered, setIsRegistered] = useState(false);
  const [authSuccess, setAuthSuccess] = useState(false);
  const [authLoading, setAuthLoading] = useState<string | null>(null);

  const loadData = () => {
    const allGames = getAllGames();
    const favIds = getFavorites();
    const likedIds = getLikes();
    const saves = guestVault.getAllSaves();

    // 1. My List / Bookmarks
    const favs = allGames.filter((g) => favIds.includes(g.id));
    setFavorites(favs);

    // 2. Recent Played
    const recents: ExtendedGame[] = [];
    saves.forEach((s) => {
      const found = allGames.find((g) => g.id === s.gameId || g.slug === s.gameId);
      if (found && !recents.some((r) => r.id === found.id)) {
        recents.push(found);
      }
    });
    setRecentGames(recents);

    // 3. Liked Games (from profile-aware likes store or 5-star ratings)
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

    // Auth state
    const token = localStorage.getItem('arcadehub_user_token');
    setIsRegistered(Boolean(token));
  };

  useEffect(() => {
    const handleOpen = (e: Event) => {
      const customEvent = e as CustomEvent<{ tab?: TabType }>;
      if (customEvent.detail?.tab) {
        setActiveTab(customEvent.detail.tab);
      }
      setIsOpen(true);
      loadData();
    };

    window.addEventListener('open_arcadehub_bookmarks', handleOpen);
    window.addEventListener('arcadehub_favorites_updated', loadData);
    window.addEventListener('arcadehub_likes_updated', loadData);
    window.addEventListener('arcadehub_auth_changed', loadData);
    return () => {
      window.removeEventListener('open_arcadehub_bookmarks', handleOpen);
      window.removeEventListener('arcadehub_favorites_updated', loadData);
      window.removeEventListener('arcadehub_likes_updated', loadData);
      window.removeEventListener('arcadehub_auth_changed', loadData);
    };
  }, []);

  const handleOAuth = async (provider: 'google' | 'facebook' | 'apple') => {
    setAuthLoading(provider);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      if (provider === 'apple') {
        const randomId = Math.floor(Math.random() * 900 + 100);
        playerAuth.register(`apple_pilot_${randomId}`, `pilot_${randomId}@icloud.com`, '🍎');
      } else {
        playerAuth.signInWithProvider(provider);
      }
      setIsRegistered(true);
      setAuthSuccess(true);
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
    setTimeout(() => setAuthSuccess(false), 1200);
  };

  const handleRemoveFavorite = (gameId: string) => {
    toggleFavorite(gameId);
    loadData();
  };

  const handleRemoveLiked = (gameId: string) => {
    toggleLike(gameId);
    loadData();
  };

  if (!isOpen) return null;

  const currentList =
    activeTab === 'my_list'
      ? favorites
      : activeTab === 'recent'
      ? recentGames
      : likedGames;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-150"
      onClick={() => setIsOpen(false)}
    >
      <div
        className="w-full max-w-[420px] rounded-3xl border border-slate-800 bg-[#0F1424] p-5 sm:p-6 shadow-2xl shadow-purple-950/40 text-slate-100 font-sans space-y-4 max-h-[92vh] flex flex-col justify-between overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 1. Modal Top Bar */}
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
            My games
          </h2>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="text-slate-400 hover:text-white text-base cursor-pointer p-1 rounded-full hover:bg-slate-800 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* 2. Navigation Tabs (My List | Recent | Liked) */}
        <div className="flex items-center border-b border-slate-800/80 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('my_list')}
            className={`flex-1 pb-3 text-center transition-colors cursor-pointer relative ${
              activeTab === 'my_list'
                ? 'text-white font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>My List</span>
            {favorites.length > 0 && (
              <span className="ml-1 text-[10px] text-slate-400">({favorites.length})</span>
            )}
            {activeTab === 'my_list' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('recent')}
            className={`flex-1 pb-3 text-center transition-colors cursor-pointer relative ${
              activeTab === 'recent'
                ? 'text-white font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>Recent</span>
            {recentGames.length > 0 && (
              <span className="ml-1 text-[10px] text-slate-400">({recentGames.length})</span>
            )}
            {activeTab === 'recent' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('liked')}
            className={`flex-1 pb-3 text-center transition-colors cursor-pointer relative ${
              activeTab === 'liked'
                ? 'text-white font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>Liked</span>
            {likedGames.length > 0 && (
              <span className="ml-1 text-[10px] text-slate-400">({likedGames.length})</span>
            )}
            {activeTab === 'liked' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full" />
            )}
          </button>
        </div>

        {/* 3. Main Modal Body */}
        <div className="flex-1 overflow-y-auto space-y-4 py-1 scrollbar-thin">
          
          {/* A. If viewing My List and not registered AND has 0 saves, show the exact screenshot prompt & OAuth buttons */}
          {!isRegistered && activeTab === 'my_list' && favorites.length === 0 ? (
            <div className="space-y-4 py-2 text-center">
              
              {/* Bookmark Icon Emblem */}
              <div className="flex justify-center pt-2">
                <div className="flex items-center justify-center h-14 w-14 rounded-2xl bg-[#181F34] border border-slate-800 text-slate-400 text-2xl shadow-inner">
                  <svg
                    className="h-7 w-7 stroke-slate-300 fill-none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                  </svg>
                </div>
              </div>

              {/* Heading */}
              <div className="space-y-1 max-w-[280px] mx-auto">
                <h3 className="text-base font-bold text-white leading-tight">
                  Create an account to save games to My Games
                </h3>
              </div>

              {/* OAuth Action Buttons */}
              <div className="space-y-2.5 pt-1">
                {/* Google Button */}
                <button
                  type="button"
                  disabled={Boolean(authLoading)}
                  onClick={() => handleOAuth('google')}
                  className="w-full py-2.5 px-4 rounded-full bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2.5 shadow-md"
                >
                  <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
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
                  <span>Sign in with Google</span>
                </button>

                {/* Facebook Button */}
                <button
                  type="button"
                  disabled={Boolean(authLoading)}
                  onClick={() => handleOAuth('facebook')}
                  className="w-full py-2.5 px-4 rounded-full bg-[#1877F2] hover:bg-[#166fe5] text-white font-bold text-xs transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2.5 shadow-md"
                >
                  <svg className="h-4 w-4 shrink-0 fill-white" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  <span>Continue with Facebook</span>
                </button>

                {/* Apple Button */}
                <button
                  type="button"
                  disabled={Boolean(authLoading)}
                  onClick={() => handleOAuth('apple')}
                  className="w-full py-2.5 px-4 rounded-full bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2.5 shadow-md"
                >
                  <svg className="h-4 w-4 shrink-0 fill-black" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.86c.65-.79 1.09-1.89.97-2.99-1 .04-2.14.67-2.81 1.45-.58.67-1.1 1.77-.96 2.85 1.11.09 2.19-.57 2.8-1.31z" />
                  </svg>
                  <span>Continue with Apple</span>
                </button>
              </div>

              {/* Divider */}
              <div className="flex items-center gap-3 py-1">
                <div className="h-[1px] flex-1 bg-slate-800" />
                <span className="text-[10px] text-slate-500 font-bold">OR</span>
                <div className="h-[1px] flex-1 bg-slate-800" />
              </div>

              {/* Email Input & Continue Form */}
              <form onSubmit={handleEmailSubmit} className="space-y-2.5">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full py-2.5 px-4 rounded-xl border border-slate-800 bg-[#050811] text-xs text-white placeholder-slate-500 outline-none focus:border-purple-400 transition-colors"
                />
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-xl bg-[#262F48] hover:bg-[#323D5C] text-slate-300 hover:text-white font-bold text-xs transition-colors cursor-pointer"
                >
                  Continue
                </button>
              </form>

            </div>
          ) : currentList.length > 0 ? (
            /* B. Games List Display */
            <div className="space-y-2.5">
              {currentList.map((game) => (
                <div
                  key={game.id}
                  className="flex items-center justify-between gap-3 p-2.5 rounded-2xl border border-slate-800 bg-[#050811] hover:border-purple-500/50 transition-all"
                >
                  <Link
                    href={`/games/${game.slug}`}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 min-w-0 flex-1 group"
                  >
                    <div className="relative h-12 w-16 rounded-xl overflow-hidden bg-[#0B1120] shrink-0 border border-slate-800">
                      <GameImage src={game.thumbnailUrl} alt={game.title} className="object-cover" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-bold text-white group-hover:text-purple-300 truncate">
                        {game.title}
                      </span>
                      <span className="text-[10px] text-slate-400 capitalize">
                        {game.category} • {game.playTimeMinutes || 3}m
                      </span>
                    </div>
                  </Link>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <Link
                      href={`/games/${game.slug}`}
                      onClick={() => setIsOpen(false)}
                      className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-[11px] shadow-sm active:scale-95 transition-all"
                    >
                      Play
                    </Link>
                    {activeTab === 'my_list' ? (
                      <button
                        type="button"
                        onClick={() => handleRemoveFavorite(game.id)}
                        className="p-1 text-slate-500 hover:text-rose-400 text-xs cursor-pointer"
                        title="Remove from My List"
                      >
                        ✕
                      </button>
                    ) : activeTab === 'liked' ? (
                      <button
                        type="button"
                        onClick={() => handleRemoveLiked(game.id)}
                        className="p-1 text-slate-500 hover:text-rose-400 text-xs cursor-pointer"
                        title="Remove Like"
                      >
                        ✕
                      </button>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* C. Empty State for Tab */
            <div className="py-12 text-center space-y-2 font-mono">
              <span className="text-3xl">🔖</span>
              <p className="text-xs text-slate-300 font-bold">
                {activeTab === 'my_list'
                  ? 'No bookmarked games in My List'
                  : activeTab === 'recent'
                  ? 'No recent games played'
                  : 'No liked games recorded'}
              </p>
              <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
                Use the &ldquo;Add to My List&rdquo; or &ldquo;Like&rdquo; buttons on any game to save your favorites.
              </p>
            </div>
          )}

          {authSuccess && (
            <p className="text-xs text-emerald-400 font-bold text-center animate-in fade-in">
              ✓ Account Connected!
            </p>
          )}

        </div>

      </div>
    </div>
  );
}