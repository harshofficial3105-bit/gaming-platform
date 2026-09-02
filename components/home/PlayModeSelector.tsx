'use client';

import React, { useState, useEffect } from 'react';
import { PlayMood } from '@/types/game';

export type ActivePlayMode = PlayMood | 'all';

interface PlayModeSelectorProps {
  activeMode: ActivePlayMode;
  onSelectMode: (mode: ActivePlayMode) => void;
  gameCounts: Record<ActivePlayMode, number>;
}

interface PlayModeOption {
  id: ActivePlayMode;
  title: string;
  subtitle: string;
  icon: string;
  activeBorder: string;
  activeBg: string;
  activeBadge: string;
}

const PLAY_MODES: PlayModeOption[] = [
  {
    id: 'all',
    title: 'All Games',
    subtitle: 'Browse complete grid',
    icon: '🚀',
    activeBorder: 'border-cyan-400',
    activeBg: 'bg-cyan-950/40 shadow-cyan-500/10',
    activeBadge: 'bg-cyan-500 text-black',
  },
  {
    id: 'quick',
    title: 'Quick Fun',
    subtitle: 'Under 5 min sessions',
    icon: '⚡',
    activeBorder: 'border-amber-400',
    activeBg: 'bg-amber-950/40 shadow-amber-500/10',
    activeBadge: 'bg-amber-500 text-black',
  },
  {
    id: 'challenging',
    title: 'Brain Challenge',
    subtitle: 'Strategy & puzzles',
    icon: '🧩',
    activeBorder: 'border-purple-400',
    activeBg: 'bg-purple-950/40 shadow-purple-500/10',
    activeBadge: 'bg-purple-500 text-black',
  },
  {
    id: 'relaxing',
    title: 'Relax & Chill',
    subtitle: 'Low stress flow',
    icon: '🧘',
    activeBorder: 'border-emerald-400',
    activeBg: 'bg-emerald-950/40 shadow-emerald-500/10',
    activeBadge: 'bg-emerald-500 text-black',
  },
  {
    id: 'competitive',
    title: 'Compete',
    subtitle: 'Climb leaderboards',
    icon: '🏆',
    activeBorder: 'border-rose-400',
    activeBg: 'bg-rose-950/40 shadow-rose-500/10',
    activeBadge: 'bg-rose-500 text-black',
  },
];

export function PlayModeSelector({
  activeMode,
  onSelectMode,
  gameCounts,
}: PlayModeSelectorProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleModeClick = (modeId: ActivePlayMode) => {
    onSelectMode(modeId);
    
    // Smooth scroll down to the filtered game catalogue section
    if (typeof window !== 'undefined') {
      const exploreSection = document.getElementById('explore');
      if (exploreSection) {
        const yOffset = -75; // Account for sticky command dock
        const y = exploreSection.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="w-full space-y-3">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
          Discovery Modes
        </h2>
        <span className="text-[11px] font-mono text-slate-500">
          Filter by play intent
        </span>
      </div>

      {/* 2-Column Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {PLAY_MODES.map((mode, idx) => {
          const isSelected = activeMode === mode.id;
          const count = mounted ? (gameCounts[mode.id] || 0) : (gameCounts[mode.id] || 0);
          const isLast = idx === PLAY_MODES.length - 1;

          return (
            <button
              key={mode.id}
              type="button"
              suppressHydrationWarning
              onClick={() => handleModeClick(mode.id)}
              className={`group relative flex flex-col justify-between p-3.5 sm:p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer min-w-0 ${
                isLast ? 'sm:col-span-2' : ''
              } ${
                isSelected
                  ? `${mode.activeBorder} ${mode.activeBg} shadow-lg ring-1 ring-cyan-500/20`
                  : 'border-slate-800/80 bg-[#0B1120] hover:border-slate-700 hover:bg-[#0E1626]'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-2">
                <span className="text-xl sm:text-2xl group-hover:scale-110 transition-transform">
                  {mode.icon}
                </span>

                <span
                  suppressHydrationWarning
                  className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-bold transition-colors ${
                    isSelected
                      ? mode.activeBadge
                      : 'bg-slate-900 border border-slate-800 text-slate-400'
                  }`}
                >
                  {count}
                </span>
              </div>

              <div className="space-y-0.5">
                <span
                  className={`block text-xs sm:text-sm font-bold truncate transition-colors ${
                    isSelected ? 'text-white' : 'text-slate-200 group-hover:text-white'
                  }`}
                >
                  {mode.title}
                </span>

                <span className="block text-[10px] text-slate-400 truncate">
                  {mode.subtitle}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}