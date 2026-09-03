'use client';

import React from 'react';
import {
  Zap,
  Crosshair,
  Car,
  Swords,
  Brain,
  Radio,
  Grid3X3,
} from 'lucide-react';

export type ArenaCategoryType =
  | 'all'
  | 'shooting'
  | 'racing'
  | 'battle'
  | 'strategy'
  | 'classic'
  | 'board';

interface IoArenaCategoriesProps {
  selectedCategory: ArenaCategoryType;
  onSelectCategory: (cat: ArenaCategoryType) => void;
  counts: Record<ArenaCategoryType, number>;
}

const ARENA_CATEGORIES = [
  { id: 'all' as const, label: 'ALL GAMES', icon: Zap, desc: 'Complete arena roster' },
  { id: 'battle' as const, label: 'BATTLE', icon: Swords, desc: 'Arena combat & PvP' },
  { id: 'shooting' as const, label: 'SHOOTING', icon: Crosshair, desc: 'Fast combat action' },
  { id: 'racing' as const, label: 'RACING', icon: Car, desc: 'High-speed speedways' },
  { id: 'classic' as const, label: 'CLASSIC .IO', icon: Radio, desc: 'Traditional .io arena' },
  { id: 'strategy' as const, label: 'STRATEGY', icon: Brain, desc: 'Tactical mind games' },
  { id: 'board' as const, label: 'BOARD & CASUAL', icon: Grid3X3, desc: 'Turn-based duels' },
];

export function IoArenaCategories({
  selectedCategory,
  onSelectCategory,
  counts,
}: IoArenaCategoriesProps) {
  return (
    <div className="space-y-3 font-mono">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-black uppercase tracking-wider text-indigo-700 dark:text-cyan-400 flex items-center gap-1.5">
          <Swords className="h-3.5 w-3.5 text-cyan-400" />
          <span>ARENA BATTLE SECTORS</span>
        </h3>
        <span className="text-[11px] text-slate-500">Instant Filter Active</span>
      </div>

      {/* Horizontally scrollable category pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none w-full">
        {ARENA_CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          const Icon = cat.icon;
          const count = counts[cat.id] || 0;

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelectCategory(cat.id)}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl whitespace-nowrap transition-all duration-200 cursor-pointer font-bold text-xs ${
                isSelected
                  ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 text-white shadow-lg shadow-indigo-950/30 ring-2 ring-cyan-400'
                  : 'bg-white/80 dark:bg-[#080D21]/80 backdrop-blur-md border border-indigo-200 dark:border-indigo-900/60 text-slate-700 dark:text-indigo-200 hover:border-indigo-400 dark:hover:border-indigo-600 hover:text-indigo-950 dark:hover:text-white shadow-sm'
              }`}
            >
              <Icon className={`h-4 w-4 ${isSelected ? 'text-cyan-300' : 'text-indigo-500 dark:text-cyan-400'}`} />
              <span>{cat.label}</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                  isSelected
                    ? 'bg-black/40 text-cyan-200'
                    : 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}