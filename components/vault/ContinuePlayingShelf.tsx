'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getAllGames, ExtendedGame } from '@/lib/games';
import { guestVault, GameSaveEnvelope } from '@/lib/storage/guestVault';
import { GameImage } from '@/components/ui/GameImage';

interface SavedGameItem {
  game: ExtendedGame;
  envelope: GameSaveEnvelope;
  highScore: number;
}

export function ContinuePlayingShelf() {
  const [savedItems, setSavedItems] = useState<SavedGameItem[]>([]);
  const [mounted, setMounted] = useState(false);

  const loadSavedGames = () => {
    const allGames = getAllGames();
    const allEnvelopes = guestVault.getAllSaves();

    const items: SavedGameItem[] = [];

    allEnvelopes.forEach((env) => {
      const gameId = env.gameId;
      const data = env.data || {};
      const highScore = typeof data.highScore === 'number' ? data.highScore : 0;

      if (highScore > 0 || data.lastPlayed) {
        const foundGame = allGames.find((g) => g.id === gameId || g.slug === gameId);
        if (foundGame) {
          items.push({ game: foundGame, envelope: env, highScore });
        }
      }
    });

    items.sort((a, b) => b.envelope.lastUpdated - a.envelope.lastUpdated);
    setSavedItems(items);
  };

  useEffect(() => {
    setMounted(true);
    loadSavedGames();

    const handleStorageUpdate = () => loadSavedGames();
    window.addEventListener('arcadehub_progress_saved', handleStorageUpdate);
    window.addEventListener('arcadehub_player_state_changed', handleStorageUpdate);
    return () => {
      window.removeEventListener('arcadehub_progress_saved', handleStorageUpdate);
      window.removeEventListener('arcadehub_player_state_changed', handleStorageUpdate);
    };
  }, []);

  if (!mounted || savedItems.length === 0) {
    return null;
  }

  return (
    <section id="continue-playing" className="space-y-3 pt-1 font-sans">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center h-6 w-6 rounded-lg bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 font-bold text-xs">
            ⚡
          </span>
          <h2 className="text-sm sm:text-base font-bold font-display text-white tracking-wide uppercase">
            Continue Playing
          </h2>
          <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-500/30 px-2 py-0.5 rounded-full font-bold">
            {savedItems.length} {savedItems.length === 1 ? 'Save Active' : 'Saves Active'}
          </span>
        </div>

        <Link
          href="/profile"
          className="text-xs font-mono text-slate-400 hover:text-cyan-300 transition-colors flex items-center gap-1"
        >
          <span>Manage Records</span>
          <span>➔</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {savedItems.map(({ game, envelope, highScore }) => (
          <Link
            key={game.id}
            href={`/games/${game.slug}`}
            className="group relative flex items-center gap-3 p-2.5 rounded-2xl border border-slate-800/80 bg-[#0B1120] hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-950/40 transition-all cursor-pointer active:scale-98 overflow-hidden"
          >
            <div className="relative h-14 w-20 rounded-xl overflow-hidden bg-[#050811] shrink-0 border border-slate-800 group-hover:border-cyan-400/40 transition-colors">
              <GameImage
                src={game.thumbnailUrl}
                alt={game.title}
                className="object-cover group-hover:scale-110 transition-transform duration-300"
              />
            </div>

            <div className="flex-1 min-w-0 font-mono">
              <h3 className="text-xs font-bold text-white truncate group-hover:text-cyan-300 transition-colors">
                {game.title}
              </h3>
              <div className="flex items-center gap-2 mt-0.5 text-[11px]">
                <span className="text-amber-400 font-bold">
                  {highScore > 0 ? `${highScore.toLocaleString()} PTS` : 'Active Save'}
                </span>
              </div>
              <span className="text-[9px] text-slate-500 block truncate mt-0.5">
                Saved {new Date(envelope.lastUpdated).toLocaleDateString()}
              </span>
            </div>

            <span className="text-cyan-400 font-mono text-xs font-bold shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
              ▶
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}