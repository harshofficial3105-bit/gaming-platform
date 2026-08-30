'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-tr from-cyan-500 to-indigo-600 font-bold text-white shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              🎮
            </div>
            <span className="text-lg font-extrabold tracking-tight text-white group-hover:text-cyan-400 transition-colors">
              ARCADE<span className="text-cyan-400">HUB</span>
            </span>
          </Link>

          {/* Desktop Category Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              href="/"
              className="rounded-md px-3 py-1.5 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
            >
              All Games
            </Link>
            <Link
              href="/categories/arcade"
              className="rounded-md px-3 py-1.5 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
            >
              Arcade
            </Link>
            <Link
              href="/categories/action"
              className="rounded-md px-3 py-1.5 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
            >
              Action
            </Link>
            <Link
              href="/categories/puzzle"
              className="rounded-md px-3 py-1.5 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
            >
              Puzzle
            </Link>
          </nav>
        </div>

        {/* Right Controls: Sign In Button */}
        <div className="hidden sm:flex items-center gap-3">
          <button
            onClick={() => alert('Authentication will be connected in Phase 6 (Supabase Auth). Anonymous play is active!')}
            className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-slate-800 hover:border-slate-600 transition-all active:scale-95"
          >
            Sign In
          </button>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex md:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="rounded-md p-2 text-slate-400 hover:bg-slate-800 hover:text-white focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="border-b border-slate-800 bg-slate-950 px-4 pt-2 pb-4 md:hidden space-y-1">
          <Link
            href="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block rounded-md px-3 py-2 text-base font-medium text-slate-200 hover:bg-slate-800"
          >
            All Games
          </Link>
          <Link
            href="/categories/arcade"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block rounded-md px-3 py-2 text-base font-medium text-slate-200 hover:bg-slate-800"
          >
            Arcade
          </Link>
          <Link
            href="/categories/action"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block rounded-md px-3 py-2 text-base font-medium text-slate-200 hover:bg-slate-800"
          >
            Action
          </Link>
          <Link
            href="/categories/puzzle"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block rounded-md px-3 py-2 text-base font-medium text-slate-200 hover:bg-slate-800"
          >
            Puzzle
          </Link>
          <div className="pt-2">
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                alert('Authentication will be connected in Phase 6 (Supabase Auth). Anonymous play is active!');
              }}
              className="w-full rounded-lg bg-cyan-600 px-4 py-2 text-center text-sm font-semibold text-white hover:bg-cyan-500"
            >
              Sign In
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
