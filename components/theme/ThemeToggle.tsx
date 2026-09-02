'use client';

import React from 'react';
import { useTheme } from './ThemeProvider';
import { Sun, Moon } from 'lucide-react';

export function ThemeToggle() {
  const { theme, toggleTheme, mounted } = useTheme();

  return (
    <div className="relative group/theme">
      <button
        type="button"
        onClick={toggleTheme}
        aria-label={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        className="flex items-center justify-center h-9 w-9 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-[#0B1120] hover:bg-slate-200 dark:hover:border-cyan-400 text-slate-700 dark:text-slate-300 transition-all active:scale-95 cursor-pointer shadow-sm"
      >
        {!mounted ? (
          <Moon className="h-4 w-4" />
        ) : theme === 'dark' ? (
          <Sun className="h-4 w-4 text-amber-400 transition-transform group-hover/theme:rotate-90 duration-300" />
        ) : (
          <Moon className="h-4 w-4 text-indigo-600 transition-transform group-hover/theme:-rotate-12 duration-300" />
        )}
      </button>
      <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2.5 py-1 rounded-lg bg-white dark:bg-[#050811]/95 border border-slate-200 dark:border-cyan-500/40 shadow-xl text-[10px] font-bold text-slate-800 dark:text-cyan-200 whitespace-nowrap opacity-0 group-hover/theme:opacity-100 transition-opacity pointer-events-none z-50">
        {theme === 'dark' ? 'LIGHT THEME' : 'DARK THEME'}
      </div>
    </div>
  );
}