'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { getAllGames, ExtendedGame } from '@/lib/games';
import { GameImage } from '@/components/ui/GameImage';

export function CommandPaletteModal() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [games, setGames] = useState<ExtendedGame[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setGames(getAllGames());

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    const handleOpenEvent = () => setIsOpen(true);

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('open_arcadehub_search', handleOpenEvent);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('open_arcadehub_search', handleOpenEvent);
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setGames(getAllGames());
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
    } else {
      setQuery('');
      setActiveFilter(null);
    }
  }, [isOpen]);

  const filteredGames = useMemo(() => {
    const q = query.toLowerCase().trim();

    return games.filter((game) => {
      if (activeFilter === 'quick' && game.playTimeMinutes > 4) return false;
      if (activeFilter === 'puzzle' && game.category !== 'puzzle' && !game.moods?.includes('challenging')) return false;
      if (activeFilter === 'mobile' && !game.isMobileFriendly) return false;
      if (activeFilter === 'compete' && !game.moods?.includes('competitive')) return false;

      if (!q) return true;

      const inTitle = game.title.toLowerCase().includes(q);
      const inDesc = game.description.toLowerCase().includes(q);
      const inCategory = game.category.toLowerCase().includes(q);
      const inTags = game.tags.some((t) => t.toLowerCase().includes(q));

      return inTitle || inDesc || inCategory || inTags;
    });
  }, [games, query, activeFilter]);

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < filteredGames.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filteredGames.length - 1));
    } else if (e.key === 'Enter' && filteredGames[selectedIndex]) {
      e.preventDefault();
      const targetGame = filteredGames[selectedIndex];
      setIsOpen(false);
      router.push(`/games/${targetGame.slug}`);
    }
  };

  if (!isOpen) return null;

  const filterChips = [
    { id: 'quick', label: '⚡ < 5 min' },
    { id: 'puzzle', label: '🧩 Puzzles' },
    { id: 'mobile', label: '📱 Mobile Ready' },
    { id: 'compete', label: '🏆 Competitive' },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Search Games"
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-3 bg-black/80 backdrop-blur-xl animate-fade-in font-sans"
      onClick={() => setIsOpen(false)}
    >
      <div
        className="w-full max-w-2xl rounded-3xl border border-slate-800 bg-[#0B1120] shadow-2xl overflow-hidden flex flex-col font-mono"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Search Input Box */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-800/80 bg-[#050811]">
          <span className="text-base text-cyan-400">🔍</span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleInputKeyDown}
            placeholder="Search games by title, category, mood, or tags..."
            className="flex-1 bg-transparent text-sm text-white placeholder-slate-500 outline-none font-sans"
          />
          <kbd className="px-2 py-0.5 rounded-lg border border-slate-800 bg-slate-900 text-[10px] text-slate-400 font-bold font-mono">
            ESC
          </kbd>
        </div>

        {/* Quick Filter Chips Row */}
        <div className="flex flex-wrap items-center gap-1.5 px-4 py-2.5 border-b border-slate-800/60 bg-[#0B1120] text-xs">
          <span className="text-[10px] text-slate-500 font-bold mr-1">FILTERS:</span>
          {filterChips.map((chip) => {
            const isActive = activeFilter === chip.id;
            return (
              <button
                key={chip.id}
                type="button"
                onClick={() => {
                  setActiveFilter(isActive ? null : chip.id);
                  setSelectedIndex(0);
                }}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-cyan-500 text-black font-bold shadow-md shadow-cyan-500/20'
                    : 'bg-[#050811] text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {chip.label}
              </button>
            );
          })}
        </div>

        {/* Search Results List */}
        <div className="max-h-80 sm:max-h-96 overflow-y-auto p-2 space-y-1 divide-y divide-slate-800/40">
          {filteredGames.length > 0 ? (
            filteredGames.map((game, idx) => {
              const isSelected = selectedIndex === idx;
              return (
                <button
                  key={game.id}
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    router.push(`/games/${game.slug}`);
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full flex items-center justify-between p-2.5 rounded-2xl text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900/90 border border-cyan-500/40 shadow-sm'
                      : 'hover:bg-slate-900/50 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative h-11 w-16 rounded-xl overflow-hidden bg-[#050811] shrink-0 border border-slate-800">
                      <GameImage src={game.thumbnailUrl} alt={game.title} className="object-cover" />
                    </div>

                    <div className="flex flex-col min-w-0 font-sans">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold truncate ${isSelected ? 'text-cyan-300' : 'text-white'}`}>
                          {game.title}
                        </span>
                        <span className="px-1.5 py-0.2 rounded text-[9px] uppercase tracking-wider bg-slate-900 border border-slate-800 text-cyan-400 font-mono">
                          {game.category}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 truncate">
                        {game.description}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 text-[10px] font-mono">
                    <span className="text-slate-400">⏱️ {game.playTimeMinutes}m</span>
                    <span className="text-slate-400">{game.isMobileFriendly ? '📱' : '💻'}</span>
                    <span className={`font-bold ${isSelected ? 'text-cyan-400' : 'text-slate-500'}`}>
                      [PLAY ▶]
                    </span>
                  </div>
                </button>
              );
            })
          ) : (
            <div className="py-10 text-center space-y-1">
              <p className="text-xs text-slate-400">No games match &ldquo;{query}&rdquo;</p>
              <p className="text-[10px] text-slate-500">Try searching for &ldquo;Arcade&rdquo;, &ldquo;Racing&rdquo;, or &ldquo;Void&rdquo;</p>
            </div>
          )}
        </div>

        {/* Bottom Keyboard Navigation Hint Bar */}
        <div className="px-4 py-2 border-t border-slate-800/80 bg-[#050811] flex items-center justify-between text-[10px] text-slate-500">
          <div className="flex items-center gap-3">
            <span>Use <kbd className="text-slate-400">↑</kbd> <kbd className="text-slate-400">↓</kbd> to navigate</span>
            <span>•</span>
            <span>Press <kbd className="text-slate-400">↵ Enter</kbd> to launch</span>
          </div>
          <span className="text-cyan-400 font-bold">{filteredGames.length} Games</span>
        </div>

      </div>
    </div>
  );
}