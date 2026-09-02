'use client';

import React, { useState, useEffect } from 'react';
import { isFavorite, toggleFavorite } from '@/lib/storage/favorites';
import { isLiked, toggleLike } from '@/lib/storage/likes';

interface GameActionBarProps {
  gameId: string;
  gameTitle: string;
}

export function GameActionBar({ gameId }: GameActionBarProps) {
  const [bookmarked, setBookmarked] = useState(false);
  const [liked, setLiked] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const loadState = () => {
    setBookmarked(isFavorite(gameId));
    setLiked(isLiked(gameId));
  };

  useEffect(() => {
    loadState();

    window.addEventListener('arcadehub_favorites_updated', loadState);
    window.addEventListener('arcadehub_likes_updated', loadState);
    window.addEventListener('arcadehub_auth_changed', loadState);
    return () => {
      window.removeEventListener('arcadehub_favorites_updated', loadState);
      window.removeEventListener('arcadehub_likes_updated', loadState);
      window.removeEventListener('arcadehub_auth_changed', loadState);
    };
  }, [gameId]);

  const handleBookmarkClick = () => {
    const nextState = toggleFavorite(gameId);
    setBookmarked(nextState);
    setFeedbackMsg(nextState ? 'Added to My List' : 'Removed from My List');
    setTimeout(() => setFeedbackMsg(null), 2000);

    // If added as guest, open bookmarks modal to offer account sync if they want
    if (nextState) {
      window.dispatchEvent(
        new CustomEvent('open_arcadehub_bookmarks', { detail: { tab: 'my_list' } })
      );
    }
  };

  const handleLikeClick = () => {
    const nextState = toggleLike(gameId);
    setLiked(nextState);
    setFeedbackMsg(nextState ? 'Game Liked 👍' : 'Like removed');
    setTimeout(() => setFeedbackMsg(null), 2000);
  };

  const handleOpenMyGames = () => {
    window.dispatchEvent(new Event('open_arcadehub_bookmarks'));
  };

  return (
    <div className="w-full flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl border border-slate-800/80 bg-[#0B1120] font-sans">
      
      {/* Left: Bookmark & Like Action Buttons */}
      <div className="flex items-center gap-2">
        
        {/* 🔖 Bookmark / Add to My List */}
        <button
          type="button"
          onClick={handleBookmarkClick}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer active:scale-95 shadow-md ${
            bookmarked
              ? 'bg-purple-600 hover:bg-purple-500 text-white border border-purple-400/50 shadow-purple-950/40'
              : 'bg-[#181F34] hover:bg-[#222B48] border border-slate-700 text-slate-300 hover:text-white'
          }`}
        >
          <svg
            className={`h-4 w-4 transition-colors ${
              bookmarked ? 'stroke-white fill-white' : 'stroke-slate-300 fill-none'
            }`}
            viewBox="0 0 24 24"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
          </svg>
          <span>{bookmarked ? 'In My List' : 'Add to My List'}</span>
        </button>

        {/* 👍 Like Button */}
        <button
          type="button"
          onClick={handleLikeClick}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer active:scale-95 shadow-md ${
            liked
              ? 'bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-400/50 shadow-emerald-950/40'
              : 'bg-[#181F34] hover:bg-[#222B48] border border-slate-700 text-slate-300 hover:text-white'
          }`}
        >
          <span className="text-sm leading-none">👍</span>
          <span>{liked ? 'Liked' : 'Like'}</span>
        </button>

      </div>

      {/* Right: Feedback message & Quick My Games Link */}
      <div className="flex items-center gap-3">
        {feedbackMsg && (
          <span className="text-xs font-mono font-bold text-cyan-300 bg-cyan-950/60 border border-cyan-500/30 px-2.5 py-1 rounded-lg animate-in fade-in">
            ✓ {feedbackMsg}
          </span>
        )}

        <button
          type="button"
          onClick={handleOpenMyGames}
          className="text-xs font-mono text-slate-400 hover:text-purple-300 transition-colors flex items-center gap-1 cursor-pointer"
        >
          <span>Open My Games</span>
          <span>➔</span>
        </button>
      </div>

    </div>
  );
}