'use client';

import React, { useState, useEffect } from 'react';
import { trophyEngine } from '@/lib/trophies/trophyEngine';
import { EvaluatedTrophy, TrophyCabinetStats } from '@/lib/trophies/trophyTypes';
import { getAllGames } from '@/lib/games';

interface TrophyCabinetProps {
  trophies?: EvaluatedTrophy[];
  stats?: TrophyCabinetStats;
}

export function TrophyCabinet({ trophies: propTrophies, stats: propStats }: TrophyCabinetProps) {
  const [internalTrophies, setInternalTrophies] = useState<EvaluatedTrophy[]>([]);
  const [internalStats, setInternalStats] = useState<TrophyCabinetStats | null>(null);
  const [totalGamesCount, setTotalGamesCount] = useState<number>(1);
  const [selectedTrophyDetail, setSelectedTrophyDetail] = useState<EvaluatedTrophy | null>(null);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const syncTrophies = () => {
    const catalog = getAllGames();
    setTotalGamesCount(catalog.length);
    const result = trophyEngine.evaluateTrophies();
    setInternalTrophies(result.trophies);
    setInternalStats(result.stats);
  };

  useEffect(() => {
    if (!propTrophies) {
      syncTrophies();
    } else {
      setTotalGamesCount(getAllGames().length);
    }

    window.addEventListener('arcadehub_trophy_unlocked', syncTrophies);
    window.addEventListener('arcadehub_player_state_changed', syncTrophies);
    return () => {
      window.removeEventListener('arcadehub_trophy_unlocked', syncTrophies);
      window.removeEventListener('arcadehub_player_state_changed', syncTrophies);
    };
  }, [propTrophies]);

  const activeTrophies = propTrophies || internalTrophies;
  const activeStats = propStats || internalStats;

  const unlockedCount = activeStats?.unlockedCount ?? activeTrophies.filter((t) => t.unlocked).length;
  const totalTrophies = activeStats?.totalTrophies ?? activeTrophies.length;
  const completionPercentage = activeStats?.completionPercentage ?? (totalTrophies > 0 ? Math.round((unlockedCount / totalTrophies) * 100) : 0);

  return (
    <div className="rounded-3xl border border-slate-800/80 bg-[#0B1120] p-4 sm:p-6 space-y-5 font-sans shadow-2xl">
      
      {/* 1. Cabinet Header & Completion Gauge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center h-8 w-8 rounded-xl bg-purple-950/80 border border-purple-500/40 text-purple-400 font-bold text-sm">
              🏆
            </span>
            <h2 className="text-base sm:text-lg font-black font-display text-white tracking-tight">
              Trophy Cabinet & Platform Milestones
            </h2>
          </div>
          <p className="text-xs font-mono text-slate-400">
            Dynamically scaling across all {totalGamesCount} playable catalog portals
          </p>
        </div>

        {/* Global Trophy Stats */}
        <div className="flex items-center gap-3 font-mono text-xs">
          <div className="bg-[#050811] px-3.5 py-2 rounded-2xl border border-slate-800 flex items-center gap-2">
            <span className="text-amber-400 font-bold">{unlockedCount} / {totalTrophies}</span>
            <span className="text-slate-500">({completionPercentage}%)</span>
          </div>

          <div className="w-24 sm:w-32 h-2.5 rounded-full bg-[#050811] overflow-hidden border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-purple-500 via-indigo-500 to-amber-400 transition-all duration-700"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* 2. Top Tier Featured Badges Preview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
        {activeTrophies.slice(0, 4).map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setSelectedTrophyDetail(t)}
            className={`p-3 rounded-2xl border transition-all text-left cursor-pointer active:scale-95 flex flex-col justify-between space-y-2 ${
              t.unlocked
                ? 'bg-purple-950/20 border-purple-500/40 hover:border-purple-400 shadow-md shadow-purple-950/30'
                : 'bg-[#050811]/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-2xl">{t.icon}</span>
              <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${
                t.unlocked
                  ? 'bg-amber-950/80 text-amber-400 border border-amber-500/40'
                  : 'bg-slate-900 text-slate-500 border border-slate-800'
              }`}>
                {t.unlocked ? 'UNLOCKED' : `${t.percentage}%`}
              </span>
            </div>
            <div>
              <span className="text-white font-bold text-xs block truncate">{t.title}</span>
              <span className="text-[10px] text-slate-400 truncate block">{t.requirementLabel}</span>
            </div>
          </button>
        ))}
      </div>

      {/* 3. Detailed Matrix (Collapsible) */}
      {isExpanded ? (
        <div className="space-y-4 pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {activeTrophies.map((trophy) => {
              const isUnlocked = trophy.unlocked;
              return (
                <div
                  key={trophy.id}
                  onClick={() => setSelectedTrophyDetail(trophy)}
                  className={`relative p-4 rounded-2xl border transition-all cursor-pointer hover:scale-[1.01] flex flex-col justify-between ${
                    isUnlocked
                      ? 'bg-gradient-to-br from-purple-950/30 via-[#0B1120] to-[#070B14] border-purple-500/40 shadow-lg shadow-purple-950/30'
                      : 'bg-[#050811]/80 border-slate-800/80 opacity-75 hover:opacity-100 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    <div className={`flex items-center justify-center h-12 w-12 rounded-2xl text-2xl shrink-0 border ${
                      isUnlocked
                        ? 'bg-purple-950/80 border-purple-500/50 text-purple-200'
                        : 'bg-[#0B1120] border-slate-800 grayscale text-slate-600'
                    }`}>
                      {trophy.icon}
                    </div>

                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="text-xs font-bold text-white truncate font-display">
                          {trophy.title}
                        </h4>
                        {isUnlocked ? (
                          <span className="text-[9px] font-mono bg-amber-950/80 text-amber-400 border border-amber-500/40 px-1.5 py-0.5 rounded font-bold">
                            ✓ UNLOCKED
                          </span>
                        ) : (
                          <span className="text-[9px] font-mono bg-slate-900 text-slate-500 border border-slate-800 px-1.5 py-0.5 rounded font-bold">
                            LOCKED
                          </span>
                        )}
                      </div>

                      <p className="text-[11px] text-slate-400 leading-tight line-clamp-2">
                        {trophy.description}
                      </p>
                    </div>
                  </div>

                  {/* Card Footer: Progress Bar & Dynamic Metadata */}
                  <div className="mt-3 pt-2.5 border-t border-slate-800/60 space-y-1.5 font-mono text-[10px]">
                    <div className="flex items-center justify-between text-slate-400">
                      <span className="truncate text-slate-300">
                        {trophy.requirementLabel}
                      </span>
                      <span className="shrink-0 font-bold text-slate-400">
                        {isUnlocked ? 'Completed' : `${trophy.progress} / ${trophy.target}`}
                      </span>
                    </div>

                    {!isUnlocked && (
                      <div className="h-1.5 w-full rounded-full bg-[#050811] overflow-hidden border border-slate-800">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-indigo-500 transition-all duration-500"
                          style={{ width: `${Math.min(100, trophy.percentage)}%` }}
                        />
                      </div>
                    )}

                    {isUnlocked && trophy.unlockedAt && (
                      <div className="text-[9px] text-amber-400/80 flex items-center justify-between pt-0.5">
                        <span>Unlocked: {new Date(trophy.unlockedAt).toLocaleDateString()}</span>
                        {trophy.historicalUnlockMetadata && (
                          <span className="text-slate-500">
                            ({trophy.historicalUnlockMetadata.platformProgressAtUnlock}% Scope)
                          </span>
                        )}
                      </div>
                    )}

                    <div className="text-[9px] text-slate-500 pt-0.5 flex items-center justify-end">
                      <span>Click for details ➔</span>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>

          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={() => setIsExpanded(false)}
              className="px-6 py-2 rounded-xl border border-slate-800 bg-[#050811] hover:border-purple-500/60 hover:text-purple-300 text-slate-400 font-mono text-xs font-bold transition-all cursor-pointer active:scale-95 shadow-lg"
            >
              ▲ Collapse Trophy Matrix
            </button>
          </div>
        </div>
      ) : (
        <div className="pt-1 flex items-center justify-between text-xs font-mono text-slate-400 bg-[#050811]/60 px-4 py-2.5 rounded-2xl border border-slate-800/80">
          <span>{totalTrophies} dynamic platform achievements active.</span>
          <button
            type="button"
            onClick={() => setIsExpanded(true)}
            className="text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1 cursor-pointer"
          >
            <span>View All Trophies & Breakdown</span>
            <span>➔</span>
          </button>
        </div>
      )}

      {/* 4. Full Detail Inspector Modal */}
      {selectedTrophyDetail && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fade-in"
          onClick={() => setSelectedTrophyDetail(null)}
        >
          <div
            className="w-full max-w-lg rounded-3xl border border-purple-500/40 bg-[#0B1120] p-6 sm:p-8 shadow-2xl font-mono space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3.5">
                <div className="flex items-center justify-center h-14 w-14 rounded-2xl text-3xl bg-purple-950/60 border border-purple-500/40 shadow-lg">
                  {selectedTrophyDetail.icon}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    {selectedTrophyDetail.title}
                  </h3>
                  <span className="text-[11px] text-purple-300 uppercase tracking-wider font-bold">
                    Category: {selectedTrophyDetail.category.replace('_', ' ')}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedTrophyDetail(null)}
                className="text-slate-400 hover:text-white text-xs cursor-pointer p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3.5 text-xs text-slate-300">
              <div className="bg-[#050811] p-3.5 rounded-2xl border border-slate-800 space-y-1.5">
                <span className="text-[10px] text-slate-500 uppercase font-bold">Achievement Goal:</span>
                <p className="text-white text-xs leading-relaxed">
                  {selectedTrophyDetail.description}
                </p>
              </div>

              <div className="bg-[#050811] p-3.5 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex justify-between items-center text-slate-400">
                  <span>Requirement:</span>
                  <span className="font-bold text-cyan-300">{selectedTrophyDetail.requirementLabel}</span>
                </div>
                <div className="flex justify-between items-center text-slate-400">
                  <span>Current Standing:</span>
                  <span className="font-bold text-white">
                    {selectedTrophyDetail.unlocked ? 'COMPLETED (100%)' : `${selectedTrophyDetail.progress} / ${selectedTrophyDetail.target} (${selectedTrophyDetail.percentage}%)`}
                  </span>
                </div>
                <div className="flex justify-between items-center text-slate-400">
                  <span>Status:</span>
                  <span className={selectedTrophyDetail.unlocked ? 'text-amber-400 font-bold' : 'text-slate-500'}>
                    {selectedTrophyDetail.unlocked ? '✓ UNLOCKED & RECORDED' : 'IN PROGRESS'}
                  </span>
                </div>
                {selectedTrophyDetail.unlockedAt && (
                  <div className="flex justify-between items-center text-slate-400 pt-1 border-t border-slate-800/80">
                    <span>Unlock Date:</span>
                    <span className="text-amber-300 font-bold">
                      {new Date(selectedTrophyDetail.unlockedAt).toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelectedTrophyDetail(null)}
              className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer active:scale-95"
            >
              Close Inspector
            </button>
          </div>
        </div>
      )}

    </div>
  );
}