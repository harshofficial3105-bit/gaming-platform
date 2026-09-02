import { UnlockedTrophyRecord } from './trophyTypes';

const UNLOCKED_TROPHIES_KEY = 'arcadehub_unlocked_trophies';
const ACTIVE_DAYS_KEY = 'arcadehub_active_days';

export const trophyProgress = {
  /**
   * Load all permanently unlocked trophies
   */
  getUnlockedHistory(): Record<string, UnlockedTrophyRecord> {
    if (typeof window === 'undefined') return {};
    try {
      const raw = localStorage.getItem(UNLOCKED_TROPHIES_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  },

  /**
   * Permanently save an unlocked trophy (preserves historical timestamp & stats)
   */
  saveUnlock(
    trophyId: string,
    stats: { platformProgress: number; totalGames: number; gamesPlayed: number },
    metadata?: Record<string, unknown>
  ): UnlockedTrophyRecord {
    const history = this.getUnlockedHistory();

    // If already unlocked, preserve the original unlock date
    if (history[trophyId]) {
      return history[trophyId];
    }

    const record: UnlockedTrophyRecord = {
      trophyId,
      unlockedAt: new Date().toISOString(),
      platformProgressAtUnlock: Math.round(stats.platformProgress),
      totalGamesAtUnlock: stats.totalGames,
      gamesPlayedAtUnlock: stats.gamesPlayed,
      metadata,
    };

    history[trophyId] = record;

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(UNLOCKED_TROPHIES_KEY, JSON.stringify(history));
        window.dispatchEvent(new Event('arcadehub_trophy_unlocked'));
      } catch (e) {
        console.warn('[TrophyProgress] Failed to persist unlock', e);
      }
    }

    return record;
  },

  /**
   * Register today as an active day
   */
  recordActiveDay(): number {
    if (typeof window === 'undefined') return 1;
    try {
      const today = new Date().toISOString().split('T')[0];
      const raw = localStorage.getItem(ACTIVE_DAYS_KEY);
      const days: string[] = raw ? JSON.parse(raw) : [];

      if (!days.includes(today)) {
        days.push(today);
        localStorage.setItem(ACTIVE_DAYS_KEY, JSON.stringify(days));
      }

      return days.length;
    } catch {
      return 1;
    }
  },

  /**
   * Get total unique active days
   */
  getActiveDaysCount(): number {
    if (typeof window === 'undefined') return 1;
    try {
      const raw = localStorage.getItem(ACTIVE_DAYS_KEY);
      const days: string[] = raw ? JSON.parse(raw) : [];
      return Math.max(1, days.length);
    } catch {
      return 1;
    }
  },

  /**
   * Merge guest unlocks into registered player profile
   */
  mergeGuestUnlocks(registeredUserId: string) {
    if (typeof window === 'undefined') return;
    const history = this.getUnlockedHistory();
    try {
      localStorage.setItem(`arcadehub_user_${registeredUserId}_trophies`, JSON.stringify(history));
    } catch (e) {}
  },
};