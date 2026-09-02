'use client';

import React from 'react';
import {
  Zap,
  Crosshair,
  Car,
  Grid3X3,
  Swords,
  Puzzle,
  ShieldAlert,
  Castle,
  Footprints,
} from 'lucide-react';

export type IoCategoryFilter =
  | 'all'
  | 'shooting'
  | 'racing'
  | 'board'
  | 'action'
  | 'puzzle'
  | 'battle'
  | 'strategy'
  | 'survival';

interface IoGameFiltersProps {
  selectedCategory: IoCategoryFilter;
  onSelectCategory: (cat: IoCategoryFilter) => void;
  counts: Record<IoCategoryFilter, number>;
}

const IO_CATEGORIES = [
  { id: 'all' as const, label: 'All Arenas', icon: Zap },
  { id: 'battle' as const, label: 'Battle', icon: Swords },
  { id: 'shooting' as const, label: 'Shooting', icon: Crosshair },
  { id: 'racing' as const, label: 'Racing', icon: Car },
  { id: 'survival' as const, label: 'Survival', icon: Footprints },
  { id: 'action' as const, label: 'Action', icon: ShieldAlert },
  { id: 'board' as const, label: 'Board Games', icon: Grid3X3 },
  { id: 'strategy' as const, label: 'Strategy', icon: Castle },
  { id: 'puzzle' as const, label: 'Puzzle', icon: Puzzle },
];

export function IoGameFilters({
  selectedCategory,
  onSelectCategory,
  counts,
}: IoGameFiltersProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none font-mono text-xs w-full">
      {IO_CATEGORIES.map((cat) => {
        const isSelected = selectedCategory === cat.id;
        const IconComponent = cat.icon;
        const count = counts[cat.id] || 0;

        return (
          <button
            key={cat.id}
            type="button"
            onClick={() => onSelectCategory(cat.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-2xl whitespace-nowrap transition-all cursor-pointer font-bold shadow-sm ${
              isSelected
                ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 text-white shadow-lg shadow-indigo-950/40 ring-1 ring-cyan-400'
                : 'bg-white/80 dark:bg-[#0B1024]/80 backdrop-blur-md border border-indigo-200 dark:border-indigo-900/60 text-slate-700 dark:text-indigo-200 hover:border-indigo-400 dark:hover:border-indigo-600 hover:text-indigo-900 dark:hover:text-white'
            }`}
          >
            <IconComponent className={`h-4 w-4 ${isSelected ? 'text-cyan-300' : 'text-indigo-500 dark:text-cyan-400'}`} />
            <span>{cat.label}</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[9px] font-mono ${
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
  );
}