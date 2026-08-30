import { guestVault } from './guestVault';

export const cloudSync = {
  /**
   * Migrate all local guest saves to the user's Supabase account
   */
  async syncGuestVaultToCloud(accessToken: string): Promise<{ synced: number; errors: number }> {
    const saves = guestVault.getAllSaves();
    let synced = 0;
    let errors = 0;

    for (const save of saves) {
      try {
        const res = await fetch('/api/games/save', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            gameId: save.gameId,
            saveData: save.data,
            version: save.version,
          }),
        });

        if (res.ok) {
          synced++;
        } else {
          errors++;
        }
      } catch (err) {
        console.warn(`[CloudSync] Failed to sync ${save.gameId}:`, err);
        errors++;
      }
    }

    return { synced, errors };
  },
};
