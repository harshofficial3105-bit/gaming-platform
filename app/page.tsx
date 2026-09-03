'use client';

import React, { useState, useMemo } from 'react';
import { HeroConduit } from '@/components/home/HeroConduit';
import { PlayModeSelector, ActivePlayMode } from '@/components/home/PlayModeSelector';
import { ContinuePlayingShelf } from '@/components/vault/ContinuePlayingShelf';
import { GamePortal } from '@/components/ui/GamePortal';
import { IoArenaPortal } from '@/components/io-arena/IoArenaPortal';
import { Leaderboard } from '@/components/game/Leaderboard';
import { getAllGames, ExtendedGame } from '@/lib/games';
import { useGuestVault } from '@/hooks/useGuestVault';
import {
  Flame,
  Star,
  Sparkles,
  Search,
  X,
  Heart,
  Gamepad2,
  Swords,
  Puzzle,
  Car,
  Trophy,
  Compass,
  Layers,
  ArrowRight,
  Zap,
} from 'lucide-react';

type SortOrder = 'popular' | 'rating' | 'newest' | 'alpha';

export default function HomePage() {
  const [activeMode, setActiveMode] = useState<ActivePlayMode>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<SortOrder>('popular');
  const [visibleBatchCount, setVisibleBatchCount] = useState<number>(12);

  const { bookmarkedIds } = useGuestVault();
  const favoritesList = bookmarkedIds;

  const allGames = useMemo(() => getAllGames(), []);
  const featuredGame = allGames.find((g) => g.isFeatured) || allGames[0];

  // Compute game counts by mood
  const gameCounts = useMemo(() => {
    const counts: Record<ActivePlayMode, number> = {
      all: allGames.length,
      quick: allGames.filter((g) => g.moods?.includes('quick')).length,
      challenging: allGames.filter((g) => g.moods?.includes('challenging')).length,
      relaxing: allGames.filter((g) => g.moods?.includes('relaxing')).length,
      competitive: allGames.filter((g) => g.moods?.includes('competitive')).length,
    };
    return counts;
  }, [allGames]);

  // Filter and Sort Engine for General Catalog Grid
  const filteredAndSortedGames = useMemo(() => {
    let result = [...allGames];

    // 1. Play Mode / Mood Filter
    if (activeMode !== 'all') {
      result = result.filter((g) => g.moods && g.moods.includes(activeMode as any));
    }

    // 2. Category Filter
    if (selectedCategory === 'favorites') {
      result = result.filter((g) => favoritesList.includes(g.id));
    } else if (selectedCategory !== 'all') {
      result = result.filter((g) => g.category.toLowerCase() === selectedCategory.toLowerCase());
    }

    // 3. Search Query (Title, Description, Category, Tags)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (g) =>
          g.title.toLowerCase().includes(q) ||
          g.category.toLowerCase().includes(q) ||
          g.description.toLowerCase().includes(q) ||
          (g.tags && g.tags.some((t: string) => t.toLowerCase().includes(q)))
      );
    }

    // 4. Sorting
    result.sort((a, b) => {
      if (sortBy === 'popular' || sortBy === 'rating') {
        return (b.rating || 0) - (a.rating || 0);
      }
      if (sortBy === 'newest') {
        return new Date(b.publishedAt || 0).getTime() - new Date(a.publishedAt || 0).getTime();
      }
      if (sortBy === 'alpha') {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });

    return result;
  }, [allGames, activeMode, selectedCategory, searchQuery, sortBy, favoritesList]);

  const displayedGames = filteredAndSortedGames.slice(0, visibleBatchCount);
  const hasMoreGames = filteredAndSortedGames.length > visibleBatchCount;

  const handleLoadMore = () => {
    setVisibleBatchCount((prev) => prev + 12);
  };

  const categories = [
    { id: 'all', label: 'All Portals', icon: Layers },
    { id: 'favorites', label: 'Favorite Games', icon: Heart },
    { id: 'arcade', label: 'Arcade', icon: Gamepad2 },
    { id: 'action', label: 'Action', icon: Swords },
    { id: 'puzzle', label: 'Puzzle', icon: Puzzle },
    { id: 'racing', label: 'Racing', icon: Car },
    { id: 'sports', label: 'Sports', icon: Trophy },
    { id: 'adventure', label: 'Adventure', icon: Compass },
  ];

  return (
    <div className="space-y-12">
      
      {/* 1. Hero Command Stage */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-stretch">
        <div className="lg:col-span-2">
          {featuredGame && <HeroConduit featuredGame={featuredGame} />}
        </div>
        <div className="flex flex-col justify-between">
          <PlayModeSelector
            activeMode={activeMode}
            onSelectMode={setActiveMode}
            gameCounts={gameCounts}
          />
        </div>
      </section>

      {/* 2. Instant Resume Guest Vault Shelf */}
      <ContinuePlayingShelf />

      {/* 3. The Discovery Grid */}
      <section id="explore" className="space-y-6 scroll-mt-24">
        
        {/* Section Header with Dynamic Controls */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800/80 pb-4">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-black font-display text-slate-900 dark:text-white flex items-center gap-2">
              <span>EXPLORE THE GRID</span>
              <span className="text-xs font-mono font-normal text-cyan-700 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/60 border border-cyan-200 dark:border-cyan-500/30 px-2 py-0.5 rounded-full">
                {filteredAndSortedGames.length} {filteredAndSortedGames.length === 1 ? 'Title' : 'Titles'}
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              High-performance browser gaming • Zero downloads • Instant guest saves
            </p>
          </div>

          {/* Search + Sort By Control Bar */}
          <div className="flex flex-wrap items-center gap-2.5 font-mono text-xs">
            {/* Sort Selector */}
            <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-[#0B1120] border border-slate-200 dark:border-slate-800/80 rounded-xl px-3 py-2 text-slate-700 dark:text-slate-300 shadow-sm">
              <span className="text-slate-500 text-[11px] font-bold">SORT:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOrder)}
                className="bg-transparent text-slate-900 dark:text-white outline-none font-bold cursor-pointer pr-1"
              >
                <option value="popular" className="bg-white dark:bg-[#0B1120] text-slate-900 dark:text-white">Most Played</option>
                <option value="rating" className="bg-white dark:bg-[#0B1120] text-slate-900 dark:text-white">Top Rated</option>
                <option value="newest" className="bg-white dark:bg-[#0B1120] text-slate-900 dark:text-white">Newest Releases</option>
                <option value="alpha" className="bg-white dark:bg-[#0B1120] text-slate-900 dark:text-white">Title A-Z</option>
              </select>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search titles, tags..."
                className="w-full bg-slate-50 dark:bg-[#0B1120] border border-slate-200 dark:border-slate-800/80 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-500 outline-none focus:border-cyan-400 transition-colors shadow-sm"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear Search"
                  className="absolute right-3 top-2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Scalable Category Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none font-mono text-xs">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            const IconComponent = cat.icon;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-purple-600 text-white font-bold shadow-md shadow-purple-600/30'
                    : 'bg-white dark:bg-[#0B1120] border border-slate-200 dark:border-slate-800/80 text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-slate-700 shadow-sm'
                }`}
              >
                <IconComponent className={`h-4 w-4 ${isSelected ? 'text-white' : 'text-cyan-500 dark:text-cyan-400'}`} />
                <span>{cat.label}</span>
                {cat.id === 'favorites' && favoritesList.length > 0 && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-bold ${isSelected ? 'bg-black text-white' : 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'}`}>
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
                  <Sparkles className="h-4 w-4" />
                  <span>LOAD MORE PORTALS ({filteredAndSortedGames.length - visibleBatchCount} REMAINING)</span>
                </button>
                <span className="text-[11px] text-slate-500">
                  Showing {displayedGames.length} of {filteredAndSortedGames.length} Portals
                </span>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-16 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0B1120]/40 space-y-3 font-mono">
            <div className="flex justify-center">
              {selectedCategory === 'favorites' ? (
                <Heart className="h-10 w-10 text-rose-500" />
              ) : (
                <Gamepad2 className="h-10 w-10 text-cyan-500" />
              )}
            </div>
            <p className="text-sm font-bold text-slate-900 dark:text-white">
              {selectedCategory === 'favorites'
                ? 'No favorite games bookmarked yet'
                : `No games found in this category`}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              {selectedCategory === 'favorites'
                ? 'Hover over any game card and click the bookmark icon to save it to your library.'
                : 'Try adjusting your search query or selecting a different category filter.'}
            </p>
            {selectedCategory === 'favorites' && (
              <button
                type="button"
                onClick={() => setSelectedCategory('all')}
                className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all cursor-pointer"
              >
                <span>Browse All Games</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        )}

      </section>

      {/* 4. 🎯 .IO GAME ARENA (Dedicated Multiplayer Zone) */}
      <IoArenaPortal />

      {/* 5. Global Anti-Cheat Tournament Hall */}
      <section id="compete" className="space-y-4 pt-4 scroll-mt-24">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800/80 pb-3">
          <div className="space-y-1">
            <h2 className="text-lg sm:text-xl font-black font-display text-slate-900 dark:text-white flex items-center gap-2">
              <span>GLOBAL TOURNAMENT HALL</span>
              <span className="text-[10px] font-mono text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-500/30 px-2 py-0.5 rounded-full font-bold">
                LIVE
              </span>
            </h2>
            <p className="text-xs font-mono text-slate-500 dark:text-slate-400">
              Verified global leaderboards with anti-cheat replay validation
            </p>
          </div>
        </div>

        <Leaderboard allowGameSwitching={true} initialExpanded={true} />
      </section>

    </div>
  );
}