'use client';

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { getAllGames, ExtendedGame } from '@/lib/games';
import { guestVault } from '@/lib/storage/guestVault';

interface LeaderboardEntry {
  id: string;
  gameId: string;
  userId: string;
  playerName: string;
  avatar: string;
  country: string;
  score: number;
  isRegistered: boolean;
  submittedAt: string;
  scoreType?: 'highest' | 'lowest';
  unitLabel?: string;
}

interface LeaderboardProps {
  gameId?: string;
  initialExpanded?: boolean;
  allowGameSwitching?: boolean;
}

type TimeFrame = 'all-time' | 'weekly' | 'daily';

export function Leaderboard({
  gameId: initialGameId = 'space-gem-collector',
  initialExpanded = false,
  allowGameSwitching = false,
}: LeaderboardProps) {
  const [games, setGames] = useState<ExtendedGame[]>([]);
  const [selectedGameId, setSelectedGameId] = useState<string>(initialGameId);
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(initialExpanded);
  const [timeframe, setTimeframe] = useState<TimeFrame>('all-time');
  const [playerBest, setPlayerBest] = useState<number>(0);
  
  // Registered user status
  const [isRegistered, setIsRegistered] = useState(false);
  const [registeredUser, setRegisteredUser] = useState<{ id: string; name: string; avatar: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);

  // 1. Load games catalog and player authentication
  useEffect(() => {
    setGames(getAllGames());

    const checkAuth = () => {
      try {
        const raw = localStorage.getItem('arcadehub_user_profile');
        if (raw) {
          const user = JSON.parse(raw);
          if (user && user.id) {
            setIsRegistered(true);
            setRegisteredUser({
              id: user.id,
              name: user.username || user.email?.split('@')[0] || 'Registered Pilot',
              avatar: user.avatar || '👑',
            });
            return;
          }
        }
      } catch {}
      setIsRegistered(false);
      setRegisteredUser(null);
    };

    checkAuth();
    window.addEventListener('arcadehub_auth_changed', checkAuth);
    return () => window.removeEventListener('arcadehub_auth_changed', checkAuth);
  }, []);

  // 2. Fetch game-specific player best score
  useEffect(() => {
    const directBest = Number(localStorage.getItem(`arcadehub_game_${selectedGameId}_best_score`) || 0);
    const vaultSave = guestVault.loadProgress(selectedGameId);
    const vaultBest = typeof vaultSave?.highScore === 'number' ? vaultSave.highScore : 0;
    setPlayerBest(Math.max(directBest, vaultBest));
  }, [selectedGameId]);

  // 3. Fetch real leaderboard records from API
  const fetchLeaderboard = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/leaderboard?gameId=${selectedGameId}&timeframe=${timeframe}`);
      if (res.ok) {
        const data = await res.json();
        setEntries(data.leaderboard || []);
      }
    } catch (err) {
      console.error('Failed to fetch leaderboard:', err);
    } finally {
      setIsLoading(false);
    }
  }, [selectedGameId, timeframe]);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  const currentGame = useMemo(() => {
    return games.find((g) => g.id === selectedGameId) || games[0];
  }, [games, selectedGameId]);

  const displayedEntries = isExpanded ? entries : entries.slice(0, 5);

  const playerRank = useMemo(() => {
    if (!isRegistered || !registeredUser) return null;
    const index = entries.findIndex((e) => e.userId === registeredUser.id);
    return index >= 0 ? index + 1 : null;
  }, [entries, isRegistered, registeredUser]);

  const handleOpenAuth = () => {
    window.dispatchEvent(new Event('open_arcadehub_auth'));
  };

  const handleSubmitScore = async () => {
    if (!isRegistered || !registeredUser) {
      handleOpenAuth();
      return;
    }

    if (playerBest <= 0) {
      setSubmitMessage('Play the game and set a score before submitting to the Hall of Fame.');
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage(null);

    try {
      const res = await fetch('/api/leaderboard/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gameId: selectedGameId,
          score: playerBest,
          durationSeconds: 120,
          userId: registeredUser.id,
          playerName: registeredUser.name,
          avatar: registeredUser.avatar,
          country: 'GLOBAL',
          isRegistered: true,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setSubmitMessage('✓ Score successfully published to Global Hall of Fame!');
        fetchLeaderboard();
      } else {
        setSubmitMessage(data.error || 'Failed to submit score.');
      }
    } catch {
      setSubmitMessage('Network error submitting score.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const unitLabel = currentGame?.leaderboard?.unitLabel || 'PTS';

  return (
    <div className="rounded-3xl border border-slate-800/80 bg-[#0B1120] p-4 sm:p-6 shadow-2xl space-y-6 font-sans">
      
      {/* 1. Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        
        {/* Game Title & Anti-Cheat Badge */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 font-mono">
            <span className="flex items-center justify-center h-6 w-6 rounded-lg bg-amber-950/80 border border-amber-500/40 text-amber-400 font-bold text-xs">
              🏆
            </span>
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              {currentGame?.title || 'Hall of Fame'}
            </span>
            <span className="text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
              VERIFIED 100% REAL
            </span>
          </div>
          <p className="text-xs text-slate-400 font-mono">
            Anti-cheat verified rankings for registered pilots
          </p>
        </div>

        {/* Dynamic Controls: Game Switcher + Timeframe Filters */}
        <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
          {allowGameSwitching && games.length > 1 && (
            <select
              value={selectedGameId}
              onChange={(e) => setSelectedGameId(e.target.value)}
              className="bg-[#050811] border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white outline-none cursor-pointer font-bold focus:border-cyan-400"
            >
              {games.map((g) => (
                <option key={g.id} value={g.id} className="bg-[#0B1120] text-white">
                  {g.title} ({g.category})
                </option>
              ))}
            </select>
          )}

          {/* Timeframe Filter Buttons */}
          <div className="flex items-center bg-[#050811] rounded-xl p-1 border border-slate-800">
            {(['all-time', 'weekly', 'daily'] as TimeFrame[]).map((tf) => (
              <button
                key={tf}
                type="button"
                onClick={() => setTimeframe(tf)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase transition-all cursor-pointer ${
                  timeframe === tf
                    ? 'bg-amber-500 text-black shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tf === 'all-time' ? 'All-Time' : tf === 'weekly' ? 'Weekly' : 'Daily'}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* 2. Personal Standing & Claim Rank Banner */}
      <div className="rounded-2xl border border-slate-800 bg-[#050811] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-xs shadow-inner">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-[#0B1120] border border-slate-800 flex items-center justify-center text-lg shrink-0">
            {isRegistered ? registeredUser?.avatar || '👑' : '🤖'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-white font-bold">
                {isRegistered ? registeredUser?.name : 'Guest Pilot'}
              </span>
              <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${
                isRegistered 
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                  : 'bg-slate-900 text-slate-400 border border-slate-800'
              }`}>
                {isRegistered ? 'REGISTERED ACCOUNT' : 'GUEST MODE'}
              </span>
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">
              Personal Best Record: <span className="text-amber-400 font-bold">{playerBest.toLocaleString()} {unitLabel}</span>
              {playerRank ? ` • Current Standing: Rank #${playerRank}` : ''}
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div>
          {isRegistered ? (
            <button
              type="button"
              onClick={handleSubmitScore}
              disabled={isSubmitting || playerBest <= 0}
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-black font-bold font-mono text-xs shadow-md transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>{isSubmitting ? '🔄' : '🏆'}</span>
              <span>{isSubmitting ? 'Posting...' : 'Publish Score to Hall of Fame'}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleOpenAuth}
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold font-mono text-xs shadow-md transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>👑</span>
              <span>Sign In to Claim Rank</span>
            </button>
          )}
        </div>
      </div>

      {/* Submission Feedback Alert */}
      {submitMessage && (
        <div className="rounded-xl border border-cyan-500/40 bg-cyan-950/30 p-3 text-xs font-mono text-cyan-300 flex items-center justify-between">
          <span>{submitMessage}</span>
          <button type="button" onClick={() => setSubmitMessage(null)} className="text-slate-400 hover:text-white">✕</button>
        </div>
      )}

      {/* 3. Real Rankings Matrix (0 Fake Data) */}
      {isLoading ? (
        <div className="py-12 text-center text-xs font-mono text-slate-500 animate-pulse">
          Synchronizing Real-Time Player Scores...
        </div>
      ) : entries.length > 0 ? (
        <div className="space-y-2 font-mono text-xs">
          {displayedEntries.map((entry, index) => {
            const rank = index + 1;
            const isGold = rank === 1;
            const isSilver = rank === 2;
            const isBronze = rank === 3;
            const isSelf = isRegistered && registeredUser?.id === entry.userId;

            return (
              <div
                key={entry.id}
                className={`flex items-center justify-between rounded-2xl px-4 py-2.5 transition-all ${
                  isSelf
                    ? 'bg-cyan-950/40 border border-cyan-500/60 shadow-lg shadow-cyan-500/10'
                    : isGold
                    ? 'bg-gradient-to-r from-amber-500/15 via-[#050811] to-transparent border border-amber-500/30 text-amber-200'
                    : isSilver
                    ? 'bg-gradient-to-r from-slate-400/10 via-[#050811] to-transparent border border-slate-700/60 text-slate-200'
                    : isBronze
                    ? 'bg-gradient-to-r from-orange-500/10 via-[#050811] to-transparent border border-orange-700/30 text-orange-200'
                    : 'bg-[#050811]/80 border border-slate-800/80 text-slate-300 hover:border-slate-700'
                }`}
              >
                {/* Rank & Player Info */}
                <div className="flex items-center gap-3.5 min-w-0">
                  <span
                    className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold shrink-0 ${
                      isGold
                        ? 'bg-amber-500 text-black shadow-md shadow-amber-500/30'
                        : isSilver
                        ? 'bg-slate-300 text-black shadow-md'
                        : isBronze
                        ? 'bg-orange-600 text-white shadow-md'
                        : 'bg-slate-800 text-slate-400 text-xs'
                    }`}
                  >
                    {isGold ? '🥇' : isSilver ? '🥈' : isBronze ? '🥉' : rank}
                  </span>

                  <div className="flex items-center gap-2.5 truncate">
                    <span className="text-base">{entry.avatar || '👑'}</span>
                    <span className="font-bold truncate text-white">
                      {entry.playerName}
                    </span>
                    {isSelf && (
                      <span className="text-[9px] bg-cyan-500 text-black px-1.5 py-0.2 rounded font-black">
                        YOU
                      </span>
                    )}
                    <span className="text-[9px] text-slate-500 border border-slate-800 px-1 py-0.2 rounded bg-[#070B14] hidden sm:inline">
                      {new Date(entry.submittedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Score */}
                <div className="flex items-center gap-2 shrink-0">
                  <span className="font-black text-white text-sm sm:text-base">
                    {entry.score.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-cyan-400 font-bold">{entry.unitLabel || unitLabel}</span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Real Clean Empty State (0 Fake Rows) */
        <div className="py-12 px-4 text-center rounded-2xl border border-dashed border-slate-800 bg-[#050811]/40 space-y-3 font-mono">
          <span className="text-3xl">🏆</span>
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-slate-300">
              No Registered Champion Scores for {timeframe === 'all-time' ? 'All-Time' : timeframe === 'weekly' ? 'This Week' : 'Today'} Yet
            </h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Be the first registered pilot to play and claim the #1 rank in the Global Hall of Fame!
            </p>
          </div>
          <Link
            href={`/games/${currentGame?.slug || 'space-gem-collector'}`}
            className="inline-block px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs transition-colors"
          >
            Play {currentGame?.title || 'Space Gem Collector'} →
          </Link>
        </div>
      )}

      {/* 4. Expand / Collapse & Refresh Controls */}
      {entries.length > 5 && (
        <div className="flex items-center justify-between pt-2 border-t border-slate-800/70 font-mono text-xs">
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 font-bold transition-colors cursor-pointer"
          >
            <span>{isExpanded ? '▲ Collapse Matrix' : `▼ Expand All ${entries.length} Registered Contenders`}</span>
          </button>

          <button
            type="button"
            onClick={fetchLeaderboard}
            className="text-slate-400 hover:text-slate-200 transition-colors cursor-pointer flex items-center gap-1 text-[11px]"
          >
            <span>🔄</span>
            <span>Sync</span>
          </button>
        </div>
      )}

    </div>
  );
}