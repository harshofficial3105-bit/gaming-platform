'use client';

import React from 'react';
import { ExtendedGame } from '@/lib/games';

interface CompatibilityBadgesProps {
  game: ExtendedGame;
}

export function CompatibilityBadges({ game }: CompatibilityBadgesProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
      
      {/* 1. Mobile / Touch Readiness */}
      <span
        className={`flex items-center gap-1.5 px-3 py-1 rounded-xl border ${
          game.isMobileFriendly
            ? 'border-emerald-500/30 bg-emerald-950/40 text-emerald-300'
            : 'border-amber-500/30 bg-amber-950/40 text-amber-300'
        }`}
      >
        <span>{game.isMobileFriendly ? '📱' : '🖥️'}</span>
        <span>{game.isMobileFriendly ? 'Mobile Ready' : 'Desktop Required'}</span>
      </span>

      {/* 2. Session Duration */}
      <span className="flex items-center gap-1.5 px-3 py-1 rounded-xl border border-slate-800 bg-slate-900/60 text-slate-300">
        <span>⏱️</span>
        <span>~{game.playTimeMinutes || 3} Min Sessions</span>
      </span>

      {/* 3. Primary Input Methods */}
      {game.inputs && game.inputs.length > 0 && (
        <span className="flex items-center gap-1.5 px-3 py-1 rounded-xl border border-cyan-500/30 bg-cyan-950/40 text-cyan-300">
          <span>🎮</span>
          <span>{game.inputs.map((i) => i.toUpperCase()).join(' / ')}</span>
        </span>
      )}

      {/* 4. Engine FPS */}
      <span className="px-2.5 py-1 rounded-xl border border-purple-500/30 bg-purple-950/40 text-purple-300">
        ⚡ 60 FPS ENGINE
      </span>

    </div>
  );
}