'use client';

import React from 'react';
import Link from 'next/link';
import { Trophy, Gamepad2, Award, Info, AlertTriangle, Sparkles, CheckCircle2 } from 'lucide-react';
import { NotificationItemData } from '@/types/notification';

interface NotificationItemProps {
  notification: NotificationItemData;
  onRead: (id: string) => void;
  onCloseDropdown: () => void;
}

export function NotificationItem({ notification, onRead, onCloseDropdown }: NotificationItemProps) {
  const { id, type, priority, title, message, action_url, is_read, created_at } = notification;

  // Format relative time (e.g. "5m ago", "2h ago")
  const getRelativeTime = (dateStr: string) => {
    try {
      const now = Date.now();
      const past = new Date(dateStr).getTime();
      const diffSec = Math.floor((now - past) / 1000);

      if (diffSec < 60) return 'Just now';
      if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
      if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
      return `${Math.floor(diffSec / 86400)}d ago`;
    } catch {
      return 'Recent';
    }
  };

  // Select clean Lucide icon based on type
  const getIcon = () => {
    switch (type) {
      case 'rank_update':
        return <Trophy className="h-4 w-4 text-amber-400" />;
      case 'new_game':
        return <Gamepad2 className="h-4 w-4 text-cyan-400" />;
      case 'achievement':
        return <Award className="h-4 w-4 text-purple-400" />;
      case 'admin_update':
      case 'creator_update':
        return priority === 'high' ? (
          <AlertTriangle className="h-4 w-4 text-rose-400" />
        ) : (
          <Sparkles className="h-4 w-4 text-indigo-400" />
        );
      default:
        return <Info className="h-4 w-4 text-slate-400" />;
    }
  };

  const handleClick = () => {
    if (!is_read) {
      onRead(id);
    }
    onCloseDropdown();
  };

  const content = (
    <div
      onClick={handleClick}
      className={`group relative flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
        !is_read
          ? 'bg-slate-900/80 dark:bg-slate-900/80 light:bg-indigo-50/70 border-cyan-500/30 light:border-indigo-200 hover:border-cyan-400/60'
          : 'bg-[#080D1A]/50 dark:bg-[#080D1A]/50 light:bg-white/60 border-slate-800/80 light:border-slate-200 hover:border-slate-700 light:hover:border-slate-300'
      }`}
    >
      {/* Type Icon Container */}
      <div
        className={`flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-lg border ${
          type === 'rank_update'
            ? 'bg-amber-950/40 border-amber-500/30'
            : type === 'new_game'
            ? 'bg-cyan-950/40 border-cyan-500/30'
            : type === 'achievement'
            ? 'bg-purple-950/40 border-purple-500/30'
            : 'bg-slate-900 border-slate-700'
        }`}
      >
        {getIcon()}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <h4
            className={`text-xs font-bold truncate ${
              !is_read
                ? 'text-white dark:text-white light:text-slate-900'
                : 'text-slate-300 dark:text-slate-300 light:text-slate-700'
            }`}
          >
            {title}
          </h4>
          <span className="text-[10px] font-mono text-slate-500 dark:text-slate-500 light:text-slate-400 flex-shrink-0">
            {getRelativeTime(created_at)}
          </span>
        </div>

        <p className="text-[11px] text-slate-400 dark:text-slate-400 light:text-slate-600 line-clamp-2 mt-0.5 leading-relaxed">
          {message}
        </p>

        {/* Priority Badge if High */}
        {priority === 'high' && (
          <span className="inline-flex items-center gap-1 mt-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-rose-950/60 border border-rose-500/40 text-rose-300">
            Priority Update
          </span>
        )}
      </div>

      {/* Unread Indicator Dot */}
      {!is_read && (
        <span className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(0,240,255,0.8)] flex-shrink-0 mt-1" />
      )}
    </div>
  );

  if (action_url) {
    return (
      <Link href={action_url} className="block">
        {content}
      </Link>
    );
  }

  return content;
}