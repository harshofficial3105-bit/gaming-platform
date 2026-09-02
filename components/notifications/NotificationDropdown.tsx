'use client';

import React, { useRef, useEffect } from 'react';
import { Bell, CheckCheck, Sparkles, Loader2 } from 'lucide-react';
import { NotificationItem } from './NotificationItem';
import { NotificationItemData } from '@/types/notification';

interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItemData[];
  loading: boolean;
  unreadCount: number;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  isGuest: boolean;
}

export function NotificationDropdown({
  isOpen,
  onClose,
  notifications,
  loading,
  unreadCount,
  onMarkAsRead,
  onMarkAllAsRead,
  isGuest,
}: NotificationDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className="absolute top-full right-0 mt-2.5 w-[360px] sm:w-[400px] max-w-[calc(100vw-24px)] rounded-2xl border border-slate-200 dark:border-slate-800/90 bg-white/95 dark:bg-[#0B1120]/95 backdrop-blur-xl shadow-2xl shadow-slate-300 dark:shadow-cyan-950/30 z-50 overflow-hidden flex flex-col max-h-[480px] animate-in fade-in zoom-in-95 duration-150"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/80 dark:bg-[#050811]/50">
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900 dark:text-white">
            Notifications
          </h3>
          {unreadCount > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-100 dark:bg-cyan-500/20 text-cyan-800 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-500/40">
              {unreadCount} new
            </span>
          )}
        </div>

        {unreadCount > 0 && !isGuest && (
          <button
            type="button"
            onClick={onMarkAllAsRead}
            className="flex items-center gap-1 text-[11px] font-mono text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 transition-colors cursor-pointer"
          >
            <CheckCheck className="h-3.5 w-3.5" />
            <span>Mark all read</span>
          </button>
        )}
      </div>

      {/* Body List */}
      <div className="flex-1 overflow-y-auto p-2.5 space-y-2">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 text-slate-500">
            <Loader2 className="h-6 w-6 animate-spin text-cyan-500 mb-2" />
            <span className="text-xs font-mono">Synchronizing Realtime...</span>
          </div>
        ) : isGuest ? (
          // Guest State
          <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
            <div className="h-10 w-10 rounded-xl bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-500/30 flex items-center justify-center mb-3">
              <Sparkles className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
            </div>
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
              Guest Mode Active
            </h4>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 max-w-[260px] leading-relaxed mb-4">
              Sign in or create an account to receive real-time leaderboard rank changes, tournament announcements, and trophy rewards!
            </p>
          </div>
        ) : notifications.length === 0 ? (
          // Empty State
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <div className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center mb-2">
              <Bell className="h-5 w-5 text-slate-400" />
            </div>
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">
              All Caught Up!
            </h4>
            <p className="text-[11px] text-slate-500 mt-0.5">
              No new alerts or rank changes right now.
            </p>
          </div>
        ) : (
          notifications.map((notif) => (
            <NotificationItem
              key={notif.id}
              notification={notif}
              onRead={onMarkAsRead}
              onCloseDropdown={onClose}
            />
          ))
        )}
      </div>

      {/* Footer info bar */}
      <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50 dark:bg-[#050811]/70 flex items-center justify-between text-[10px] font-mono text-slate-500">
        <span className="flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Realtime Active
        </span>
        <span>ArcadeHub Feed</span>
      </div>
    </div>
  );
}