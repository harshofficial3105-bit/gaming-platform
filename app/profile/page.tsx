'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getAllGames, ExtendedGame } from '@/lib/games';
import { guestVault } from '@/lib/storage/guestVault';
import { getFavorites } from '@/lib/storage/favorites';
import { trophyEngine, EvaluatedTrophy, TrophyCabinetStats } from '@/lib/trophies';
import { TrophyCabinet } from '@/components/vault/TrophyCabinet';
import { GameImage } from '@/components/ui/GameImage';
import { AvatarUploader } from '@/components/profile/AvatarUploader';
import { playerAuth, PlayerPersona, RegisteredUserProfile } from '@/lib/player/auth';

interface SavedRecord {
  game: ExtendedGame;
  highScore: number;
  lastUpdated: number;
}

export default function ProfilePage() {
  const [mounted, setMounted] = useState(false);
  const [records, setRecords] = useState<SavedRecord[]>([]);
  const [favorites, setFavorites] = useState<ExtendedGame[]>([]);
  const [trophies, setTrophies] = useState<EvaluatedTrophy[]>([]);
  const [trophyStats, setTrophyStats] = useState<TrophyCabinetStats | undefined>(undefined);
  const [persona, setPersona] = useState<PlayerPersona>('NEW_VISITOR');
  const [user, setUser] = useState<RegisteredUserProfile | null>(null);
  const [statusNotice, setStatusNotice] = useState<string | null>(null);

  const loadProfileData = () => {
    const allGames = getAllGames();
    const allSaves = guestVault.getAllSaves();
    const favIds = getFavorites();

    const loadedRecords: SavedRecord[] = [];
    allSaves.forEach((s) => {
      const g = allGames.find((game) => game.id === s.gameId || game.slug === s.gameId);
      if (g) {
        loadedRecords.push({
          game: g,
          highScore: typeof s.data?.highScore === 'number' ? s.data.highScore : 0,
          lastUpdated: s.lastUpdated || Date.now(),
        });
      }
    });

    // Space Gem Collector check
    const directSpaceBest = Number(localStorage.getItem('arcadehub_game_space-gem-collector_best_score') || 0);
    const spaceGemGame = allGames.find((g) => g.id === 'space-gem-collector');
    if (directSpaceBest > 0 && spaceGemGame && !loadedRecords.some((r) => r.game.id === 'space-gem-collector')) {
      loadedRecords.push({
        game: spaceGemGame,
        highScore: directSpaceBest,
        lastUpdated: Date.now(),
      });
    }

    loadedRecords.sort((a, b) => b.lastUpdated - a.lastUpdated);
    setRecords(loadedRecords);

    const loadedFavs = allGames.filter((g) => favIds.includes(g.id));
    setFavorites(loadedFavs);

    // Evaluate Dynamic Auto-Scaling Trophies
    const { trophies: evaluated, stats } = trophyEngine.evaluateTrophies();
    setTrophies(evaluated);
    setTrophyStats(stats);

    const personaInfo = playerAuth.getPersona(loadedRecords.length);
    setPersona(personaInfo.persona);
    setUser(personaInfo.user);
  };

  useEffect(() => {
    setMounted(true);
    loadProfileData();

    window.addEventListener('arcadehub_player_state_changed', loadProfileData);
    window.addEventListener('arcadehub_auth_changed', loadProfileData);
    window.addEventListener('arcadehub_favorites_updated', loadProfileData);
    window.addEventListener('arcadehub_trophy_unlocked', loadProfileData);
    window.addEventListener('arcadehub_play_count_updated', loadProfileData);
    return () => {
      window.removeEventListener('arcadehub_player_state_changed', loadProfileData);
      window.removeEventListener('arcadehub_auth_changed', loadProfileData);
      window.removeEventListener('arcadehub_favorites_updated', loadProfileData);
      window.removeEventListener('arcadehub_trophy_unlocked', loadProfileData);
      window.removeEventListener('arcadehub_play_count_updated', loadProfileData);
    };
  }, []);

  const handleOpenAuth = () => {
    window.dispatchEvent(new Event('open_arcadehub_auth'));
  };

  const handleLogout = () => {
    playerAuth.logout();
    loadProfileData();
  };

  const handleExportData = () => {
    try {
      const backup = {
        exportedAt: new Date().toISOString(),
        persona,
        user,
        records: records.map((r) => ({ gameId: r.game.id, title: r.game.title, highScore: r.highScore, lastUpdated: r.lastUpdated })),
        favorites: favorites.map((f) => f.id),
        unlockedTrophies: trophies.filter((t) => t.unlocked).map((t) => t.id),
      };

      const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `arcadehub_player_backup_${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);

      setStatusNotice('Save data exported successfully.');
      setTimeout(() => setStatusNotice(null), 3500);
    } catch (e) {
      console.error('Export error', e);
    }
  };

  const handleResetData = () => {
    if (window.confirm('Are you sure you want to reset all local saves and favorites on this device? This cannot be undone.')) {
      try {
        guestVault.clearAll();
        localStorage.removeItem('arcadehub_favorites');
        localStorage.removeItem('arcadehub_likes');
        loadProfileData();
        window.dispatchEvent(new Event('arcadehub_favorites_updated'));
        window.dispatchEvent(new Event('arcadehub_likes_updated'));
        setStatusNotice('Local progress reset.');
        setTimeout(() => setStatusNotice(null), 3500);
      } catch (e) {
        console.error('Reset error', e);
      }
    }
  };

  if (!mounted) return null;

  const totalScorePoints = records.reduce((acc, curr) => acc + curr.highScore, 0);
  const unlockedTrophiesCount = trophyStats?.unlockedCount ?? trophies.filter((a) => a.unlocked).length;
  const totalTrophiesCount = trophyStats?.totalTrophies ?? trophies.length;

  return (
    <div className="space-y-6 pb-12 font-sans">
      
      {/* 1. Header & Dynamic Persona Banner */}
      <div className={`rounded-3xl border p-6 sm:p-8 shadow-xl transition-all ${
        persona === 'REGISTERED_PLAYER'
          ? 'border-purple-500/50 bg-gradient-to-r from-purple-950/30 via-[#0B1120] to-cyan-950/30'
          : persona === 'GUEST_PLAYER'
          ? 'border-emerald-500/40 bg-gradient-to-r from-emerald-950/20 via-[#0B1120] to-cyan-950/20'
          : 'border-slate-800/80 bg-gradient-to-r from-cyan-950/20 via-[#0B1120] to-slate-900/40'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          
          {/* Avatar Uploader + Dynamic Persona Details */}
          <div className="flex items-center gap-4 sm:gap-5">
            <AvatarUploader />

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black font-display text-white">
                  {persona === 'REGISTERED_PLAYER' ? user?.username : 'Player Profile'}
                </h1>
                
                {persona === 'REGISTERED_PLAYER' ? (
                  <span className="flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-purple-950/80 border border-purple-500/50 text-purple-300 font-mono text-[10px] font-bold">
                    <span>Ã°Å¸â€˜â€˜</span>
                    <span>VERIFIED PILOT</span>
                  </span>
                ) : persona === 'GUEST_PLAYER' ? (
                  <span className="flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 font-mono text-[10px] font-bold">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>GUEST PLAYER</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 font-mono text-[10px] font-bold">
                    <span>Ã°Å¸Å’Â</span>
                    <span>NEW VISITOR</span>
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-400 font-mono">
                {persona === 'REGISTERED_PLAYER'
                  ? `Level ${user?.level || 1} Ã¢â‚¬Â¢ Account active since ${new Date(user?.registeredAt || Date.now()).toLocaleDateString()}`
                  : persona === 'GUEST_PLAYER'
                  ? `${records.length} saved ${records.length === 1 ? 'game record' : 'game records'} stored locally on this device`
                  : 'Welcome to ArcadeHub! Play any game to start recording high scores.'}
              </p>
            </div>
          </div>

          {/* Dynamic Action Buttons */}
          <div className="flex items-center gap-2 font-mono">
            {persona === 'REGISTERED_PLAYER' ? (
              <button
                type="button"
                onClick={handleLogout}
                className="px-4 py-2.5 rounded-xl border border-slate-800 bg-[#050811] hover:border-rose-500/50 hover:text-rose-400 text-slate-400 font-bold text-xs shadow-md cursor-pointer transition-all active:scale-95 flex items-center gap-1.5"
              >
                <span>Ã°Å¸Å¡Âª</span>
                <span>Sign Out</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleOpenAuth}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-bold text-xs shadow-lg shadow-purple-950/40 cursor-pointer transition-all active:scale-95 flex items-center gap-1.5"
              >
                <span>Ã°Å¸â€˜â€˜</span>
                <span>{persona === 'GUEST_PLAYER' ? 'Register Account & Sync Progress' : 'Create Free Account'}</span>
              </button>
            )}
          </div>

        </div>
      </div>

      {statusNotice && (
        <div className="p-3 rounded-xl bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-xs font-mono text-center animate-fade-in">
          Ã¢Å“â€œ {statusNotice}
        </div>
      )}

      {/* 2. Real Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="rounded-2xl border border-slate-800/80 bg-[#0B1120] p-4 flex flex-col justify-between space-y-1.5 shadow-lg">
          <span className="text-xs font-mono text-slate-400">GAMES PLAYED</span>
          <span className="text-2xl font-mono font-black text-cyan-400">{records.length}</span>
        </div>
        <div className="rounded-2xl border border-slate-800/80 bg-[#0B1120] p-4 flex flex-col justify-between space-y-1.5 shadow-lg">
          <span className="text-xs font-mono text-slate-400">TOTAL SCORE POINTS</span>
          <span className="text-2xl font-mono font-black text-amber-400">{totalScorePoints.toLocaleString()}</span>
        </div>
        <div className="rounded-2xl border border-slate-800/80 bg-[#0B1120] p-4 flex flex-col justify-between space-y-1.5 shadow-lg">
          <span className="text-xs font-mono text-slate-400">FAVORITE GAMES</span>
          <span className="text-2xl font-mono font-black text-rose-400">{favorites.length}</span>
        </div>
        <div className="rounded-2xl border border-slate-800/80 bg-[#0B1120] p-4 flex flex-col justify-between space-y-1.5 shadow-lg">
          <span className="text-xs font-mono text-slate-400">TROPHIES UNLOCKED</span>
          <span className="text-2xl font-mono font-black text-purple-400">{unlockedTrophiesCount} / {totalTrophiesCount}</span>
        </div>
      </div>

      {/* 3. Platform Dynamic Scalable Trophy Cabinet */}
      <TrophyCabinet trophies={trophies} stats={trophyStats} />

      {/* 4. Personal Best Records */}
      <div className="rounded-3xl border border-slate-800/80 bg-[#0B1120] p-5 sm:p-6 space-y-4 shadow-xl">
        <h2 className="text-base font-bold font-display text-white flex items-center gap-2 border-b border-slate-800/60 pb-3">
          <span>Ã°Å¸â€œË†</span>
          <span>Personal Best Records</span>
        </h2>

        {records.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {records.map(({ game, highScore, lastUpdated }) => (
              <Link
                key={game.id}
                href={`/games/${game.slug}`}
                className="group flex items-center gap-3 p-3 rounded-2xl border border-slate-800/80 bg-[#050811] hover:border-cyan-400/60 transition-all"
              >
                <div className="relative h-12 w-16 rounded-xl overflow-hidden bg-[#0B1120] shrink-0 border border-slate-800">
                  <GameImage src={game.thumbnailUrl} alt={game.title} className="object-cover" />
                </div>
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="text-xs font-bold text-white group-hover:text-cyan-300 truncate">
                    {game.title}
                  </span>
                  <span className="text-[10px] font-mono text-amber-400 font-bold">
                    BEST: {highScore > 0 ? `${highScore.toLocaleString()} PTS` : 'PLAYED'}
                  </span>
                  <span className="text-[9px] font-mono text-slate-500">
                    Active: {new Date(lastUpdated).toLocaleDateString()}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 space-y-3 font-mono">
            <span className="text-3xl">Ã°Å¸Å¡â‚¬</span>
            <p className="text-xs text-slate-400">No game records yet.</p>
            <Link href="/" className="inline-block px-4 py-2 rounded-xl bg-cyan-500 text-black font-mono font-bold text-xs hover:bg-cyan-400 transition-colors">
              Explore The Grid Ã¢â€ â€™
            </Link>
          </div>
        )}
      </div>

      {/* 5. Player Data & Privacy Management */}
      <div className="rounded-3xl border border-slate-800/80 bg-[#0B1120] p-5 sm:p-6 space-y-4 shadow-xl font-mono text-xs">
        <div className="flex items-center justify-between border-b border-slate-800/60 pb-3">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <span>Ã°Å¸â€ºÂ¡Ã¯Â¸Â</span>
            <span>Data Management & Backup</span>
          </h2>
          <span className="text-[10px] text-slate-500">Local-First Storage</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <p className="text-slate-400 text-xs leading-relaxed max-w-lg font-sans">
            Download a portable JSON backup of your game records and unlocked trophies, or clear local storage on this device.
          </p>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleExportData}
              className="px-4 py-2 rounded-xl bg-[#050811] border border-slate-800 hover:border-cyan-500/50 hover:text-cyan-300 text-slate-300 font-bold transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>Ã°Å¸â€œÂ¥</span>
              <span>Export JSON Backup</span>
            </button>
            <button
              type="button"
              onClick={handleResetData}
              className="px-3.5 py-2 rounded-xl bg-[#050811] border border-slate-800 hover:border-rose-500/50 hover:text-rose-400 text-slate-400 font-bold transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>Ã°Å¸â€”â€˜Ã¯Â¸Â</span>
              <span>Reset Saves</span>
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}