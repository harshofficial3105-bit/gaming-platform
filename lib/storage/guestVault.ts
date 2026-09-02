export interface GameSaveEnvelope {
  gameId: string;
  version: string;
  lastUpdated: number;
  data: Record<string, unknown>;
}

const STORAGE_PREFIX = 'arcadehub_save_';

export const guestVault = {
  /**
   * Save game progress to local storage with dedicated best score key
   */
  saveProgress(gameId: string, data: Record<string, unknown>): boolean {
    if (typeof window === 'undefined') return false;

    try {
      const envelope: GameSaveEnvelope = {
        gameId,
        version: '1.0',
        lastUpdated: Date.now(),
        data,
      };

      // 1. Save standard envelope
      localStorage.setItem(
        `${STORAGE_PREFIX}${gameId}`,
        JSON.stringify(envelope)
      );

      // 2. Save dedicated unique best score key
      if (typeof data.highScore === 'number' && Number.isFinite(data.highScore)) {
        localStorage.setItem(
          `arcadehub_game_${gameId}_best_score`,
          data.highScore.toString()
        );
      }

      return true;
    } catch (err) {
      console.warn(`[GuestVault] Failed to save progress for ${gameId}:`, err);
      return false;
    }
  },

  /**
   * Load saved game progress from local storage
   */
  loadProgress(gameId: string): Record<string, unknown> | null {
    if (typeof window === 'undefined') return null;

    try {
      // Check standard envelope
      const raw = localStorage.getItem(`${STORAGE_PREFIX}${gameId}`);
      let result: Record<string, unknown> = {};
      if (raw) {
        const envelope: GameSaveEnvelope = JSON.parse(raw);
        result = envelope.data || {};
      }

      // Check dedicated best score key
      const dedicatedBest = localStorage.getItem(`arcadehub_game_${gameId}_best_score`);
      if (dedicatedBest && !isNaN(Number(dedicatedBest))) {
        const numBest = Number(dedicatedBest);
        const currentHigh = typeof result.highScore === 'number' ? result.highScore : 0;
        result.highScore = Math.max(currentHigh, numBest);
      }

      return Object.keys(result).length > 0 ? result : null;
    } catch (err) {
      console.warn(`[GuestVault] Failed to load progress for ${gameId}:`, err);
      return null;
    }
  },

  /**
   * List all saved games currently stored in the guest vault
   */
  getAllSaves(): GameSaveEnvelope[] {
    if (typeof window === 'undefined') return [];

    const saves: GameSaveEnvelope[] = [];

    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(STORAGE_PREFIX)) {
          const raw = localStorage.getItem(key);
          if (raw) {
            const envelope: GameSaveEnvelope = JSON.parse(raw);
            saves.push(envelope);
          }
        }
      }
    } catch (err) {
      console.warn('[GuestVault] Error listing saves:', err);
    }

    return saves;
  },

  /**
   * Clear progress for a specific game
   */
  deleteSave(gameId: string): boolean {
    if (typeof window === 'undefined') return false;
    try {
      localStorage.removeItem(`${STORAGE_PREFIX}${gameId}`);
      localStorage.removeItem(`arcadehub_game_${gameId}_best_score`);
      return true;
    } catch {
      return false;
    }
  },

  /**
   * Clear all saves from local storage
   */
  clearAll(): boolean {
    if (typeof window === 'undefined') return false;
    try {
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.startsWith(STORAGE_PREFIX) || key.startsWith('arcadehub_game_'))) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach((k) => localStorage.removeItem(k));
      return true;
    } catch {
      return false;
    }
  },
};