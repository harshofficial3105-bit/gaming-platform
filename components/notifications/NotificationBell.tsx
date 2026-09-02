'use client';

import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import { useNotifications } from '@/hooks/useNotifications';
import { NotificationDropdown } from './NotificationDropdown';

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const {
    notifications,
    unreadCount,
    loading,
    userId,
    markAsRead,
    markAllAsRead,
  } = useNotifications();

  return (
    <div className="relative">
      <div className="relative group/notif">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          title="Notifications Feed"
          aria-label="Notifications Feed"
          className={`relative flex items-center justify-center h-9 w-9 rounded-xl border transition-all cursor-pointer active:scale-95 shadow-sm ${
            isOpen
              ? 'bg-cyan-50 dark:bg-cyan-950/60 border-cyan-500 dark:border-cyan-400 text-cyan-700 dark:text-cyan-300'
              : 'border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-[#0B1120] text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:border-cyan-400/70 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Bell className="h-4 w-4" />

          {/* Unread Counter Badge */}
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-gradient-to-r from-rose-500 to-amber-500 text-[9px] font-bold text-white shadow-md animate-pulse">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2.5 py-1 rounded-lg bg-white dark:bg-[#050811]/95 border border-slate-200 dark:border-cyan-500/40 shadow-xl text-[10px] font-bold text-slate-800 dark:text-cyan-200 whitespace-nowrap opacity-0 group-hover/notif:opacity-100 transition-opacity pointer-events-none z-50">
          NOTIFICATIONS {unreadCount > 0 ? `(${unreadCount})` : ''}
        </div>
      </div>

      <NotificationDropdown
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        notifications={notifications}
        loading={loading}
        unreadCount={unreadCount}
        onMarkAsRead={markAsRead}
        onMarkAllAsRead={markAllAsRead}
        isGuest={!userId}
      />
    </div>
  );
}