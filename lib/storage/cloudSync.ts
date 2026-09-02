import { guestVault, GameSaveEnvelope } from './guestVault';

/**
 * Synchronizes local guest saves to the remote PostgreSQL cloud storage
 */
export async function syncGuestVaultToCloud(jwtToken?: string): Promise<{ success: boolean; syncedCount: number }> {
  if (typeof window === 'undefined') {
    return { success: false, syncedCount: 0 };
  }

  const allSaves: GameSaveEnvelope[] = guestVault.getAllSaves();
  if (allSaves.length === 0) {
    return { success: true, syncedCount: 0 };
  }

  let synced = 0;

  for (const save of allSaves) {
    try {
      const res = await fetch('/api/games/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(jwtToken ? { Authorization: `Bearer ${jwtToken}` } : {}),
        },
        body: JSON.stringify({
          gameId: save.gameId,
          score: typeof save.data?.highScore === 'number' ? save.data.highScore : 0,
          customData: save.data,
        }),
      });

      if (res.ok) {
        synced++;
      }
    } catch (err) {
      console.warn(`[CloudSync] Failed to sync save for ${save.gameId}:`, err);
    }
  }

  return { success: true, syncedCount: synced };
}