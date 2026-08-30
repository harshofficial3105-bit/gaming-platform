export interface GameSaveEnvelope {
  gameId: string;
  version: string;
  lastUpdated: number;
  data: Record<string, unknown>;
}

const STORAGE_PREFIX = 'arcadehub_save_';

export const guestVault = {
  /**
   * Save game progress to local storage
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

      localStorage.setItem(
        `${STORAGE_PREFIX}${gameId}`,
        JSON.stringify(envelope)
      );
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
      const raw = localStorage.getItem(`${STORAGE_PREFIX}${gameId}`);
      if (!raw) return null;

      const envelope: GameSaveEnvelope = JSON.parse(raw);
      return envelope.data || null;
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
            saves.push(JSON.parse(raw));
          }
        }
      }
    } catch (err) {
      console.warn('[GuestVault] Failed to read all saves:', err);
    }
    return saves;
  },

  /**
   * Clear progress for a specific game
   */
  clearProgress(gameId: string): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(`${STORAGE_PREFIX}${gameId}`);
  },
};
