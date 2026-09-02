'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getAllGames, ExtendedGame } from '@/lib/games';
import { Leaderboard } from '@/components/game/Leaderboard';

interface PlatformRanking {
  userId: string;
  playerName: string;
  avatar: string;
  country: string;
  platformPoints: number;
  gamesParticipated: number;
  topFinishesCount: number;
  bestRank: number;
}

interface TrendingComp {
  gameId: string;
  activeEntriesCount: number;
  topScore: number;
  lastActive: string;
}

interface RecentRecord {
  id: string;
  gameId: string;
  playerName: string;
  avatar: string;
  score: number;
  unitLabel?: string;
  submittedAt: string;
}

type TabMode = 'platform' | 'by-game' | 'trending' | 'recent';

export default function LeaderboardsHubPage() {
  const [activeTab, setActiveTab] = useState<TabMode>('platform');
  const [games, setGames] = useState<ExtendedGame[]>([]);
  const [platformRankings, setPlatformRankings] = useState<PlatformRanking[]>([]);
  const [trending, setTrending] = useState<TrendingComp[]>([]);
  const [recentRecords, setRecentRecords] = useState<RecentRecord[]>([]);
  const [selectedGameId, setSelectedGameId] = useState<string>('space-gem-collector');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const all = getAllGames();
    setGames(all);
    if (all.length > 0) setSelectedGameId(all[0].id);

    const loadPlatformData = async () => {
      setLoading(true);
      try {
        const [platRes, trendRes, recRes] = await Promise.all([
          fetch('/api/leaderboard?mode=platform'),
          fetch('/api/leaderboard?mode=trending'),
          fetch('/api/leaderboard?mode=recent'),
        ]);

        if (platRes.ok) {
          const pData = await platRes.json();
          setPlatformRankings(pData.rankings || []);
        }
        if (trendRes.ok) {
          const tData = await trendRes.json();
          setTrending(tData.trending || []);
        }
        if (recRes.ok) {
          const rData = await recRes.json();
          setRecentRecords(rData.recent || []);
        }
      } catch (err) {
        console.error('Leaderboards load error', err);
      } finally {
        setLoading(false);
      }
    };

    loadPlatformData();
  }, []);

  return (
    <div className="space-y-8 pb-16 font-sans">
      
      {/* 1. Hero Header Banner */}
      <div className="rounded-3xl border border-amber-500/30 bg-gradient-to-r from-amber-950/30 via-[#0B1120] to-[#070B14] p-6 sm:p-8 shadow-2xl space-y-4">
        <div className="flex items-center gap-3 font-mono text-xs text-amber-400">
          <span className="px-2.5 py-1 rounded-full bg-amber-950 border border-amber-500/40 font-bold">
            GLOBAL HALL OF FAME
          </span>
          <span>•</span>
          <span>Anti-Cheat Verified Competitions</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-black text-white font-display">
              ArcadeHub Global Leaderboards
            </h1>
            <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
              Earn normalized Platform Points by ranking in individual games. Climb from Rookie to Grandmaster on the global leaderboard.
            </p>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs">
            <div className="bg-[#050811] px-4 py-2.5 rounded-2xl border border-slate-800 text-center">
              <span className="text-[10px] text-slate-500 block">ACTIVE GAMES</span>
              <span className="text-base font-bold text-cyan-400">{games.length}</span>
            </div>
            <div className="bg-[#050811] px-4 py-2.5 rounded-2xl border border-slate-800 text-center">
              <span className="text-[10px] text-slate-500 block">VERIFIED PILOTS</span>
              <span className="text-base font-bold text-amber-400">{platformRankings.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Interactive Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none font-mono text-xs border-b border-slate-800/80">
        <button
          type="button"
          onClick={() => setActiveTab('platform')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl transition-all cursor-pointer font-bold ${
            activeTab === 'platform'
              ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
              : 'bg-[#0B1120] text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <span>🏆</span>
          <span>Top Platform Pilots</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('by-game')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl transition-all cursor-pointer font-bold ${
            activeTab === 'by-game'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-950/40'
              : 'bg-[#0B1120] text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <span>🎮</span>
          <span>By Individual Game</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('trending')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl transition-all cursor-pointer font-bold ${
            activeTab === 'trending'
              ? 'bg-rose-600 text-white shadow-lg shadow-rose-950/40'
              : 'bg-[#0B1120] text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <span>🔥</span>
          <span>Trending Tournaments</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('recent')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl transition-all cursor-pointer font-bold ${
            activeTab === 'recent'
              ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20'
              : 'bg-[#0B1120] text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <span>🕒</span>
          <span>Recent Verified Feed</span>
        </button>
      </div>

      {/* 3. TAB 1: Platform-Wide Normalized Pilots Ranking */}
      {activeTab === 'platform' && (
        <div className="rounded-3xl border border-slate-800/80 bg-[#0B1120] p-6 shadow-xl space-y-4 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-slate-800/60 pb-3">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <span>🏆</span>
              <span>Platform Championship Standings</span>
            </h2>
            <span className="text-[10px] text-amber-400 bg-amber-950/40 border border-amber-500/30 px-2.5 py-0.5 rounded-full font-bold">
              NORMALIZED POINTS
            </span>
          </div>

          <div className="space-y-2">
            {platformRankings.length > 0 ? (
              platformRankings.map((pilot, idx) => {
                const rank = idx + 1;
                const isGold = rank === 1;
                const isSilver = rank === 2;
                const isBronze = rank === 3;

                return (
                  <div
                    key={pilot.userId}
                    className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                      isGold
                        ? 'border-amber-500/50 bg-amber-950/20'
                        : isSilver
                        ? 'border-slate-400/40 bg-slate-800/20'
                        : isBronze
                        ? 'border-amber-700/40 bg-amber-950/10'
                        : 'border-slate-800/60 bg-[#050811]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-8 font-black text-center text-sm ${
                        isGold ? 'text-amber-400' : isSilver ? 'text-slate-300' : isBronze ? 'text-amber-600' : 'text-slate-500'
                      }`}>
                        #{rank}
                      </span>
                      <span className="text-lg">{pilot.avatar}</span>
                      <div>
                        <span className="font-bold text-white text-xs block">
                          {pilot.playerName}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {pilot.gamesParticipated} {pilot.gamesParticipated === 1 ? 'game played' : 'games played'} • {pilot.topFinishesCount} podium finishes
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-sm font-black text-amber-400 block">
                        {pilot.platformPoints.toLocaleString()} PTS
                      </span>
                      <span className="text-[9px] text-emerald-400">
                        🛡️ VERIFIED PILOT
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-12 text-slate-500">
                No platform championship points recorded yet.
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. TAB 2: By Individual Game */}
      {activeTab === 'by-game' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none font-mono text-xs">
            {games.map((game) => (
              <button
                key={game.id}
                type="button"
                onClick={() => setSelectedGameId(game.id)}
                className={`px-3.5 py-1.5 rounded-xl border transition-all cursor-pointer font-bold whitespace-nowrap ${
                  selectedGameId === game.id
                    ? 'bg-purple-600 text-white border-purple-400 shadow-md'
                    : 'bg-[#0B1120] text-slate-400 hover:text-white border-slate-800'
                }`}
              >
                {game.title}
              </button>
            ))}
          </div>

          <Leaderboard gameId={selectedGameId} initialExpanded={true} />
        </div>
      )}

      {/* 5. TAB 3: Trending Tournaments */}
      {activeTab === 'trending' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 font-mono">
          {trending.map((t) => {
            const game = games.find((g) => g.id === t.gameId);
            if (!game) return null;

            return (
              <div
                key={t.gameId}
                className="rounded-2xl border border-slate-800 bg-[#0B1120] p-5 space-y-3 shadow-lg hover:border-rose-500/40 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-0.5">
                    <h3 className="text-sm font-bold text-white truncate">{game.title}</h3>
                    <span className="text-[10px] text-rose-400 bg-rose-950/60 border border-rose-500/30 px-2 py-0.5 rounded-full uppercase">
                      {game.category}
                    </span>
                  </div>
                  <span className="text-xs text-amber-400 font-bold">🔥 HOT</span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/60 text-xs">
                  <div className="bg-[#050811] p-2 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">Total Entries</span>
                    <span className="font-bold text-white">{t.activeEntriesCount}</span>
                  </div>
                  <div className="bg-[#050811] p-2 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">Record Score</span>
                    <span className="font-bold text-amber-400">{t.topScore.toLocaleString()}</span>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-end">
                  <Link
                    href={`/games/${game.slug}`}
                    className="text-cyan-400 hover:text-cyan-300 font-bold text-xs flex items-center gap-1"
                  >
                    <span>Enter Tournament</span>
                    <span>➔</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 6. TAB 4: Recent Verified Score Feed */}
      {activeTab === 'recent' && (
        <div className="rounded-3xl border border-slate-800/80 bg-[#0B1120] p-6 shadow-xl space-y-4 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-slate-800/60 pb-3">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <span>🕒</span>
              <span>Live Verified Score Stream</span>
            </h2>
            <span className="text-[10px] text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-2 py-0.5 rounded-full">
              REAL-TIME
            </span>
          </div>

          <div className="space-y-2">
            {recentRecords.map((r) => {
              const game = games.find((g) => g.id === r.gameId);
              return (
                <div
                  key={r.id}
                  className="flex items-center justify-between p-3 rounded-2xl border border-slate-800 bg-[#050811]"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-base">{r.avatar}</span>
                    <div>
                      <span className="font-bold text-white text-xs block">{r.playerName}</span>
                      <span className="text-[10px] text-slate-400">
                        Played {game?.title || r.gameId} • {new Date(r.submittedAt).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-bold text-amber-400 block">
                      {r.score.toLocaleString()} {r.unitLabel || 'PTS'}
                    </span>
                    <span className="text-[9px] text-emerald-400">
                      ✓ VERIFIED
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}