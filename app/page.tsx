'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { getAllGames } from '@/lib/games';
import { GameCategory } from '@/types/game';
import { GamePortal } from '@/components/ui/GamePortal';
import { HeroConduit } from '@/components/home/HeroConduit';
import { PlayModeSelector, ActivePlayMode } from '@/components/home/PlayModeSelector';
import { ContinuePlayingShelf } from '@/components/vault/ContinuePlayingShelf';
import { getFavorites } from '@/lib/storage/favorites';
import { Leaderboard } from '@/components/game/Leaderboard';

export type SortOrder = 'popular' | 'rating' | 'newest' | 'alpha';

export default function HomePage() {
  const allGames = useMemo(() => getAllGames(), []);
  const [activeMode, setActiveMode] = useState<ActivePlayMode>('all');
  const [selectedCategory, setSelectedCategory] = useState<GameCategory | 'all' | 'favorites'>('all');
  const [sortBy, setSortBy] = useState<SortOrder>('popular');
  const [searchQuery, setSearchQuery] = useState('');
  const [favoritesList, setFavoritesList] = useState<string[]>([]);
  const [visibleBatchCount, setVisibleBatchCount] = useState<number>(24);

  useEffect(() => {
    setFavoritesList(getFavorites());
    const handleFavUpdate = () => setFavoritesList(getFavorites());
    window.addEventListener('arcadehub_favorites_updated', handleFavUpdate);
    return () => window.removeEventListener('arcadehub_favorites_updated', handleFavUpdate);
  }, []);

  // Reset pagination batch when category, mode, sort, or search changes
  useEffect(() => {
    setVisibleBatchCount(24);
  }, [selectedCategory, activeMode, sortBy, searchQuery]);

  const featuredGame = useMemo(() => {
    return allGames.find((g) => g.id === 'space-gem-collector') || allGames[0];
  }, [allGames]);

  const gameCounts = useMemo(() => {
    const counts: Record<ActivePlayMode, number> = {
      all: allGames.length,
      quick: 0,
      challenging: 0,
      relaxing: 0,
      competitive: 0,
    };

    allGames.forEach((g) => {
      g.moods?.forEach((m) => {
        if (counts[m] !== undefined) counts[m]++;
      });
    });

    return counts;
  }, [allGames]);

  const filteredAndSortedGames = useMemo(() => {
    const filtered = allGames.filter((game) => {
      if (selectedCategory === 'favorites') {
        if (!favoritesList.includes(game.id)) return false;
      } else if (selectedCategory !== 'all' && game.category !== selectedCategory) {
        return false;
      }

      if (activeMode !== 'all') {
        if (!game.moods || !game.moods.includes(activeMode)) {
          return false;
        }
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = game.title.toLowerCase().includes(q);
        const matchesCategory = game.category.toLowerCase().includes(q);
        const matchesTags = game.tags.some((t) => t.toLowerCase().includes(q));
        if (!matchesTitle && !matchesCategory && !matchesTags) return false;
      }

      return true;
    });

    // Apply sorting
    return filtered.sort((a, b) => {
      if (sortBy === 'popular') {
        const playsA = typeof window !== 'undefined' ? Number(localStorage.getItem(`arcadehub_game_${a.id}_plays`) || 0) : 0;
        const playsB = typeof window !== 'undefined' ? Number(localStorage.getItem(`arcadehub_game_${b.id}_plays`) || 0) : 0;
        return playsB - playsA;
      }
      if (sortBy === 'rating') {
        return (b.rating || 4.8) - (a.rating || 4.8);
      }
      if (sortBy === 'newest') {
        const dateA = new Date(a.publishedAt || 0).getTime();
        const dateB = new Date(b.publishedAt || 0).getTime();
        return dateB - dateA;
      }
      if (sortBy === 'alpha') {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });
  }, [allGames, selectedCategory, activeMode, searchQuery, favoritesList, sortBy]);

  const displayedGames = useMemo(() => {
    return filteredAndSortedGames.slice(0, visibleBatchCount);
  }, [filteredAndSortedGames, visibleBatchCount]);

  const hasMoreGames = visibleBatchCount < filteredAndSortedGames.length;

  const handleLoadMore = () => {
    setVisibleBatchCount((prev) => prev + 24);
  };

  const categories: { id: GameCategory | 'all' | 'favorites'; label: string; icon: string }[] = [
    { id: 'all', label: 'All Portals', icon: 'âš¡' },
    { id: 'favorites', label: 'Favorite Games', icon: 'â¤ï¸' },
    { id: 'arcade', label: 'Arcade', icon: 'ðŸ•¹ï¸' },
    { id: 'action', label: 'Action', icon: 'ðŸš€' },
    { id: 'puzzle', label: 'Puzzle', icon: 'ðŸ§©' },
    { id: 'racing', label: 'Racing', icon: 'ðŸŽï¸' },
    { id: 'sports', label: 'Sports', icon: 'âš½' },
    { id: 'adventure', label: 'Adventure', icon: 'ðŸ—ºï¸' },
  ];

  return (
    <div className="space-y-12 sm:space-y-16 pb-12 font-sans">
      
      {/* 1. TOP RESPONSIVE SIDE-BY-SIDE HERO & DISCOVERY SECTORS */}
      {featuredGame && (
        <section className="grid grid-cols-1 xl:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          <div className="xl:col-span-7 flex flex-col">
            <HeroConduit featuredGame={featuredGame} />
          </div>
          <div className="xl:col-span-5 flex flex-col justify-between">
            <PlayModeSelector
              activeMode={activeMode}
              onSelectMode={(mode) => setActiveMode(mode)}
              gameCounts={gameCounts}
            />
          </div>
        </section>
      )}

      {/* 2. Instant Resume Guest Vault Shelf */}
      <ContinuePlayingShelf />

      {/* 3. The Discovery Grid */}
      <section id="explore" className="space-y-6 scroll-mt-24">
        
        {/* Section Header with Dynamic Controls */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 border-b border-slate-800/80 pb-4">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-black font-display text-white flex items-center gap-2">
              <span>EXPLORE THE GRID</span>
              <span className="text-xs font-mono font-normal text-cyan-400 bg-cyan-950/60 border border-cyan-500/30 px-2 py-0.5 rounded-full">
                {filteredAndSortedGames.length} {filteredAndSortedGames.length === 1 ? 'Title' : 'Titles'}
              </span>
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              High-performance browser gaming â€¢ Zero downloads â€¢ Instant guest saves
            </p>
          </div>

          {/* Search + Sort By Control Bar */}
          <div className="flex flex-wrap items-center gap-2.5 font-mono text-xs">
            {/* Sort Selector */}
            <div className="flex items-center gap-1.5 bg-[#0B1120] border border-slate-800/80 rounded-xl px-3 py-2 text-slate-300">
              <span className="text-slate-500 text-[11px]">SORT:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOrder)}
                className="bg-transparent text-white outline-none font-bold cursor-pointer pr-1"
              >
                <option value="popular" className="bg-[#0B1120] text-white">ðŸ”¥ Most Played</option>
                <option value="rating" className="bg-[#0B1120] text-white">â­ Top Rated</option>
                <option value="newest" className="bg-[#0B1120] text-white">âš¡ Newest Releases</option>
                <option value="alpha" className="bg-[#0B1120] text-white">ðŸ”¤ Title A-Z</option>
              </select>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search titles, tags..."
                className="w-full bg-[#0B1120] border border-slate-800/80 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-400 transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2 text-xs text-slate-400 hover:text-white"
                >
                  âœ•
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Scalable Category Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none font-mono text-xs">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-purple-600 text-white font-bold shadow-md shadow-purple-600/30'
                    : 'bg-[#0B1120] border border-slate-800/80 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
                {cat.id === 'favorites' && favoritesList.length > 0 && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-bold ${isSelected ? 'bg-black text-white' : 'bg-rose-950 text-rose-300'}`}>
                    {favoritesList.length}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* The Discovery Games Grid */}
        {displayedGames.length > 0 ? (
          <div className="space-y-8">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
              {displayedGames.map((game, idx) => (
                <GamePortal key={game.id} game={game} priority={idx < 6} />
              ))}
            </div>

            {/* Progressive Batching Pagination Button */}
            {hasMoreGames && (
              <div className="flex flex-col items-center justify-center space-y-2 pt-4 font-mono">
                <button
                  type="button"
                  onClick={handleLoadMore}
                  className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-bold text-xs shadow-xl shadow-purple-950/40 transition-all active:scale-95 cursor-pointer flex items-center gap-2"
                >
                  <span>âš¡</span>
                  <span>LOAD MORE PORTALS ({filteredAndSortedGames.length - visibleBatchCount} REMAINING)</span>
                </button>
                <span className="text-[11px] text-slate-500">
                  Showing {displayedGames.length} of {filteredAndSortedGames.length} Portals
                </span>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-16 rounded-3xl border border-dashed border-slate-800 bg-[#0B1120]/40 space-y-3 font-mono">
            <span className="text-3xl">
              {selectedCategory === 'favorites' ? 'â¤ï¸' : 'ðŸ”'}
            </span>
            <p className="text-sm font-bold text-white">
              {selectedCategory === 'favorites'
                ? 'No favorite games bookmarked yet'
                : `No games found in this category`}
            </p>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              {selectedCategory === 'favorites'
                ? 'Hover over any game card and click the heart icon (ðŸ¤) to save it to your favorites.'
                : 'Try adjusting your search query or selecting a different category filter.'}
            </p>
            {selectedCategory === 'favorites' && (
              <button
                type="button"
                onClick={() => setSelectedCategory('all')}
                className="mt-2 inline-block px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all cursor-pointer"
              >
                Browse All Games â†’
              </button>
            )}
          </div>
        )}

      </section>

      {/* 4. Global Anti-Cheat Tournament Hall */}
      <section id="compete" className="space-y-4 pt-4 scroll-mt-24">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
          <div className="space-y-1">
            <h2 className="text-lg sm:text-xl font-black font-display text-white flex items-center gap-2">
              <span>GLOBAL TOURNAMENT HALL</span>
              <span className="text-[10px] font-mono text-amber-400 bg-amber-950/60 border border-amber-500/30 px-2 py-0.5 rounded-full font-bold">
                LIVE
              </span>
            </h2>
            <p className="text-xs font-mono text-slate-400">
              Verified global leaderboards with anti-cheat replay validation
            </p>
          </div>
        </div>

        <Leaderboard allowGameSwitching={true} initialExpanded={true} />
      </section>

    </div>
  );
}