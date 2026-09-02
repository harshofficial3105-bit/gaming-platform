'use client';

import { useState, useEffect, useCallback } from 'react';
import { guestVault } from '@/lib/storage/guestVault';
import { getAllGames, ExtendedGame } from '@/lib/games';

export interface UserRecord {
  game: ExtendedGame;
  highScore: number;
  lastUpdated: number;
}

export type PlayerPersona = 'NEW_VISITOR' | 'GUEST_PLAYER' | 'REGISTERED_PLAYER';

export interface TrophyItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  progress?: number;
  maxProgress?: number;
}

export interface TrophyStats {
  gamesPlayed: number;
  totalScore: number;
  favoriteCount: number;
  daysActive: number;
}

export function useGuestVault() {
  const [mounted, setMounted] = useState(false);
  const [avatar, setAvatarState] = useState<string>('🤖');
  const [user, setUser] = useState<{ username: string; email?: string; level?: number; registeredAt?: string } | null>(null);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [records, setRecords] = useState<UserRecord[]>([]);

  const loadVaultData = useCallback(() => {
    if (typeof window === 'undefined') return;

    try {
      // 1. Load User Session
      const savedUser = localStorage.getItem('arcadehub_guest_user');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        setUser(parsed);
        if (parsed.avatar) setAvatarState(parsed.avatar);
      } else {
        const savedAvatar = localStorage.getItem('arcadehub_avatar');
        if (savedAvatar) setAvatarState(savedAvatar);
      }

      // 2. Load Bookmarks / Favorites
      const savedBookmarks = localStorage.getItem('arcadehub_favorites');
      if (savedBookmarks) {
        setBookmarkedIds(JSON.parse(savedBookmarks));
      }

      // 3. Load Game Saves / Records
      const allSaves = guestVault.getAllSaves();
      const allGames = getAllGames();
      const loadedRecords: UserRecord[] = [];

      allSaves.forEach((save) => {
        const game = allGames.find((g) => g.id === save.gameId || g.slug === save.gameId);
        if (game) {
          const highScore = typeof save.data?.highScore === 'number' ? save.data.highScore : 0;
          loadedRecords.push({
            game,
            highScore,
            lastUpdated: save.lastUpdated,
          });
        }
      });

      setRecords(loadedRecords);
    } catch (err) {
      console.warn('[useGuestVault] Error loading vault data:', err);
    }
  }, []);

  useEffect(() => {
    setMounted(true);
    loadVaultData();

    const handleVaultChange = () => loadVaultData();
    window.addEventListener('arcadehub:user-change', handleVaultChange);
    window.addEventListener('arcadehub:favorites-change', handleVaultChange);
    window.addEventListener('storage', handleVaultChange);

    return () => {
      window.removeEventListener('arcadehub:user-change', handleVaultChange);
      window.removeEventListener('arcadehub:favorites-change', handleVaultChange);
      window.removeEventListener('storage', handleVaultChange);
    };
  }, [loadVaultData]);

  const setAvatar = (newAvatar: string) => {
    setAvatarState(newAvatar);
    try {
      localStorage.setItem('arcadehub_avatar', newAvatar);
      if (user) {
        const updated = { ...user, avatar: newAvatar };
        localStorage.setItem('arcadehub_guest_user', JSON.stringify(updated));
        setUser(updated);
      }
      window.dispatchEvent(new Event('arcadehub:user-change'));
    } catch {}
  };

  const persona: PlayerPersona = user
    ? 'REGISTERED_PLAYER'
    : records.length > 0
    ? 'GUEST_PLAYER'
    : 'NEW_VISITOR';

  const personaLabel =
    persona === 'REGISTERED_PLAYER'
      ? user?.username || 'Verified Pilot'
      : persona === 'GUEST_PLAYER'
      ? 'Guest Pilot'
      : 'Guest Explorer';

  const favorites = bookmarkedIds;

  // Trophies calculation
  const totalScorePoints = records.reduce((sum, r) => sum + r.highScore, 0);

  const trophies: TrophyItem[] = [
    {
      id: 'first_play',
      title: 'First Flight',
      description: 'Played your first game on the ArcadeHub Grid',
      icon: '🎮',
      unlocked: records.length >= 1,
    },
    {
      id: 'score_10k',
      title: 'Score Hunter',
      description: 'Accumulated over 10,000 total score points',
      icon: '🏆',
      unlocked: totalScorePoints >= 10000,
      progress: Math.min(10000, totalScorePoints),
      maxProgress: 10000,
    },
    {
      id: 'vault_collector',
      title: 'Grid Explorer',
      description: 'Saved at least 3 games to your personal library',
      icon: '⭐',
      unlocked: bookmarkedIds.length >= 3,
      progress: Math.min(3, bookmarkedIds.length),
      maxProgress: 3,
    },
    {
      id: 'veteran',
      title: 'Cyber Ace',
      description: 'Played 4 unique games on the Grid',
      icon: '🚀',
      unlocked: records.length >= 4,
      progress: Math.min(4, records.length),
      maxProgress: 4,
    },
  ];

  const trophyStats: TrophyStats = {
    gamesPlayed: records.length,
    totalScore: totalScorePoints,
    favoriteCount: bookmarkedIds.length,
    daysActive: 1,
  };

  const unlockedTrophiesCount = trophies.filter((t) => t.unlocked).length;
  const totalTrophiesCount = trophies.length;

  const exportVaultBackup = () => {
    const data = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      user,
      avatar,
      favorites: bookmarkedIds,
      saves: guestVault.getAllSaves(),
    };
    return JSON.stringify(data, null, 2);
  };

  const resetVault = () => {
    guestVault.clearAll();
    localStorage.removeItem('arcadehub_favorites');
    localStorage.removeItem('arcadehub_avatar');
    localStorage.removeItem('arcadehub_guest_user');
    setUser(null);
    setAvatarState('🤖');
    setBookmarkedIds([]);
    setRecords([]);
    window.dispatchEvent(new Event('arcadehub:user-change'));
    window.dispatchEvent(new Event('arcadehub:favorites-change'));
  };

  return {
    mounted,
    user,
    persona,
    personaLabel,
    avatar,
    setAvatar,
    bookmarkedIds,
    records,
    favorites,
    trophies,
    trophyStats,
    unlockedTrophiesCount,
    totalTrophiesCount,
    exportVaultBackup,
    resetVault,
  };
}