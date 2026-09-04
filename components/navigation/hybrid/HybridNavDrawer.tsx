'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  X,
  Gamepad2,
  Compass,
  Zap,
  Trophy,
  Users,
  Bookmark,
  Heart,
  Clock,
  Swords,
  Car,
  Puzzle,
  Target,
  Brain,
  ShieldCheck,
  Search,
} from 'lucide-react';
import { useGuestVault } from '@/hooks/useGuestVault';

interface HybridNavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HybridNavDrawer({ isOpen, onClose }: HybridNavDrawerProps) {
  const pathname = usePathname();
  const drawerRef = useRef<HTMLDivElement>(null);
  const { persona, personaLabel, avatar, bookmarkedIds } = useGuestVault();

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const primaryItems = [
    { label: 'The Grid', href: '/', icon: Gamepad2, active: pathname === '/' },
    { label: 'Discover', href: '/#explore', icon: Compass, active: false },
    { label: '.IO Arena', href: '/io-arena', icon: Zap, active: pathname === '/io-arena', badge: 'PVP', isSpecial: true },
    { label: 'Leaderboards', href: '/leaderboards', icon: Trophy, active: pathname === '/leaderboards', badge: 'LIVE' },
    { label: 'Creator Studio', href: '/creator', icon: Users, active: pathname.startsWith('/creator') },
    { label: 'Favorites', href: '/#explore', icon: Heart, active: false, count: bookmarkedIds.length },
    { label: 'Recently Played', href: '/profile', icon: Clock, active: false },
  ];

  const categories = [
    { label: 'Action', href: '/#explore', icon: Swords, color: 'text-rose-500' },
    { label: 'Adventure', href: '/#explore', icon: Compass, color: 'text-amber-500' },
    { label: 'Arcade', href: '/#explore', icon: Gamepad2, color: 'text-cyan-500' },
    { label: 'Driving & Racing', href: '/#explore', icon: Car, color: 'text-orange-500' },
    { label: '.IO Games', href: '/io-arena', icon: Zap, color: 'text-cyan-400', isSpecial: true },
    { label: 'Puzzle', href: '/#explore', icon: Puzzle, color: 'text-purple-500' },
    { label: 'Shooting', href: '/#explore', icon: Target, color: 'text-red-500' },
    { label: 'Strategy', href: '/#explore', icon: Brain, color: 'text-indigo-400' },
  ];

  const isCustomImageAvatar =
    avatar &&
    (avatar.startsWith('/') ||
      avatar.startsWith('http') ||
      avatar.startsWith('data:'));

  return (
    <>
      {/* 1. Backdrop Overlay (Smooth fade, zero layout shift) */}
      <div
        onClick={onClose}
        aria-hidden="true"
        className={`fixed inset-0 z-55 bg-black/65 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* 2. 300px Sliding Drawer */}
      <aside
        ref={drawerRef}
        aria-label="ArcadeHub Full Gaming Navigation Drawer"
        className={`fixed top-0 left-0 bottom-0 w-[300px] z-60 flex flex-col justify-between border-r border-slate-200/90 dark:border-cyan-500/30 bg-white/95 dark:bg-[#060A1E]/95 backdrop-blur-2xl shadow-2xl shadow-cyan-950/20 font-mono transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Header: Brand & Close */}
        <div className="p-4 border-b border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between">
          <Link
            href="/"
            onClick={onClose}
            className="flex items-center gap-2.5 group/brand"
          >
            <span className="flex items-center justify-center h-8 w-8 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-purple-600 text-white shadow-md shadow-cyan-500/25 group-hover/brand:scale-105 transition-transform">
              <Gamepad2 className="h-4 w-4" />
            </span>
            <div className="flex flex-col">
              <span className="font-display tracking-wider text-sm font-black leading-tight text-slate-900 dark:text-white">
                ARCADE<span className="text-cyan-500 dark:text-cyan-400">HUB</span>
              </span>
              <span className="text-[8px] font-bold text-slate-400 dark:text-slate-500 tracking-widest uppercase">
                PLAY. COMPETE. DISCOVER.
              </span>
            </div>
          </Link>

          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close Navigation"
            className="flex items-center justify-center h-8 w-8 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-[#0C1226] text-slate-500 hover:text-slate-900 dark:hover:text-white hover:border-cyan-400 transition-all cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Scrollable Nav Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5 scrollbar-thin scrollbar-thumb-cyan-500/20">
          
          {/* Quick Search Action */}
          <button
            type="button"
            onClick={() => {
              onClose();
              window.dispatchEvent(new Event('open-command-palette'));
            }}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0B1124] text-slate-500 hover:text-slate-900 dark:hover:text-white hover:border-cyan-400 dark:hover:border-cyan-500/50 transition-all text-xs cursor-pointer shadow-sm group"
          >
            <span className="flex items-center gap-2">
              <Search className="h-3.5 w-3.5 text-slate-400 group-hover:text-cyan-400 transition-colors" />
              <span className="text-xs">Search games...</span>
            </span>
            <span className="px-1.5 py-0.5 rounded text-[9px] bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold">
              Ctrl+K
            </span>
          </button>

          {/* Primary Navigation Pathways */}
          <div className="space-y-1">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-2 mb-1">
              Main Menu
            </span>
            {primaryItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                    item.isSpecial
                      ? 'bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-cyan-500/10 border border-indigo-200 dark:border-indigo-500/40 text-indigo-700 dark:text-cyan-300 hover:border-cyan-400 shadow-sm ring-1 ring-cyan-400/20'
                      : item.active
                      ? 'bg-purple-600 text-white shadow-sm ring-1 ring-purple-400'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="h-4 w-4 shrink-0" />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                        item.isSpecial
                          ? 'bg-cyan-400/20 text-cyan-700 dark:text-cyan-300 border border-cyan-400/40 animate-pulse'
                          : 'bg-amber-400/20 text-amber-700 dark:text-amber-300 border border-amber-400/40'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}

                  {item.count !== undefined && item.count > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-purple-500 text-white">
                      {item.count}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Game Categories */}
          <div className="space-y-1 pt-2 border-t border-slate-200/80 dark:border-slate-800/80">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-2 mb-1">
              Game Categories
            </span>
            <div className="grid grid-cols-2 gap-1">
              {categories.map((cat) => {
                const Icon = cat.icon;
                return (
                  <Link
                    key={cat.label}
                    href={cat.href}
                    onClick={onClose}
                    className="flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900/60 transition-colors group"
                  >
                    <Icon className={`h-3.5 w-3.5 ${cat.color} group-hover:scale-110 transition-transform shrink-0`} />
                    <span className="truncate">{cat.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

        </div>

        {/* Bottom Profile Console */}
        <div className="p-4 border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-[#050811]/50 space-y-2">
          <Link
            href="/profile"
            onClick={onClose}
            className="flex items-center gap-2.5 p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#090F24] hover:border-cyan-400 dark:hover:border-cyan-500/50 transition-all cursor-pointer group"
          >
            <div className="relative flex items-center justify-center h-8 w-8 rounded-lg bg-slate-100 dark:bg-[#050811] border border-slate-200 dark:border-slate-800 overflow-hidden shrink-0">
              {isCustomImageAvatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={avatar} alt="Avatar" className="h-full w-full object-cover" />
              ) : (
                <span className="text-sm">{avatar || '🤖'}</span>
              )}
            </div>

            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                {personaLabel || 'Guest Pilot'}
              </span>
              <span className="text-[8px] font-bold text-cyan-600 dark:text-cyan-400 flex items-center gap-0.5">
                <ShieldCheck className="h-2.5 w-2.5" />
                <span>{persona === 'REGISTERED_PLAYER' ? 'VERIFIED' : 'GUEST PILOT'}</span>
              </span>
            </div>
          </Link>
        </div>
      </aside>
    </>
  );
}