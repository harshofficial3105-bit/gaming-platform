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
          className={`relative flex items-center justify-center h-9 w-9 rounded-xl border transition-all cursor-pointer active:scale-95 shadow-md ${
            isOpen
              ? 'bg-cyan-950/60 border-cyan-400 text-cyan-300 shadow-cyan-950/50'
              : 'bg-[#0B1120] dark:bg-[#0B1120] light:bg-slate-100 border-slate-800 dark:border-slate-800 light:border-slate-300 text-slate-300 light:text-slate-700 hover:border-cyan-400/70 hover:text-white'
          }`}
        >
          <Bell className="h-4 w-4" />

          {/* Unread Counter Badge */}
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-gradient-to-r from-rose-500 to-amber-500 text-[9px] font-bold text-white shadow-lg shadow-rose-950/60 animate-pulse">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2.5 py-1 rounded-lg bg-[#050811]/95 dark:bg-[#050811]/95 light:bg-white border border-cyan-500/40 light:border-slate-300 shadow-xl text-[10px] font-bold text-cyan-200 light:text-slate-800 whitespace-nowrap opacity-0 group-hover/notif:opacity-100 transition-opacity pointer-events-none z-50">
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