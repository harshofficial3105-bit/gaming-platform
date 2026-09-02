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
        className="flex items-center justify-center h-9 w-9 rounded-xl border border-slate-800 bg-[#0B1120] dark:bg-[#0B1120] light:bg-slate-100 light:border-slate-300 light:text-slate-700 hover:border-cyan-400 text-slate-300 hover:text-cyan-300 transition-all active:scale-95 cursor-pointer shadow-md"
      >
        {!mounted ? (
          <Moon className="h-4 w-4" />
        ) : theme === 'dark' ? (
          <Sun className="h-4 w-4 text-amber-400 transition-transform group-hover/theme:rotate-90 duration-300" />
        ) : (
          <Moon className="h-4 w-4 text-indigo-600 transition-transform group-hover/theme:-rotate-12 duration-300" />
        )}
      </button>
      <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2.5 py-1 rounded-lg bg-[#050811]/95 dark:bg-[#050811]/95 light:bg-white border border-cyan-500/40 light:border-slate-300 shadow-xl text-[10px] font-bold text-cyan-200 light:text-slate-800 whitespace-nowrap opacity-0 group-hover/theme:opacity-100 transition-opacity pointer-events-none z-50">
        {theme === 'dark' ? 'LIGHT THEME' : 'DARK THEME'}
      </div>
    </div>
  );
}