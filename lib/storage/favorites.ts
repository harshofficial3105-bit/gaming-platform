'use client';

function getActiveProfileKey(): string {
  if (typeof window === 'undefined') return 'guest';
  try {
    const raw = localStorage.getItem('arcadehub_user_profile');
    if (raw) {
      const user = JSON.parse(raw);
      if (user.id) return user.id;
    }
  } catch {}
  return 'guest';
}

export function getFavorites(profileId?: string): string[] {
  if (typeof window === 'undefined') return [];
  const targetId = profileId || getActiveProfileKey();
  try {
    const profileKey = `arcadehub_favorites_${targetId}`;
    const raw = localStorage.getItem(profileKey);
    if (raw) return JSON.parse(raw);

    if (targetId === 'guest') {
      const legacyRaw = localStorage.getItem('arcadehub_favorites');
      return legacyRaw ? JSON.parse(legacyRaw) : [];
    }
    return [];
  } catch {
    return [];
  }
}

export function isFavorite(gameId: string, profileId?: string): boolean {
  if (typeof window === 'undefined') return false;
  const targetId = profileId || getActiveProfileKey();
  const current = getFavorites(targetId);
  return current.includes(gameId);
}

export function toggleFavorite(gameId: string, profileId?: string): boolean {
  if (typeof window === 'undefined') return false;
  const targetId = profileId || getActiveProfileKey();
  try {
    const current = getFavorites(targetId);
    const exists = current.includes(gameId);
    const updated = exists ? current.filter((id) => id !== gameId) : [...current, gameId];

    const profileKey = `arcadehub_favorites_${targetId}`;
    localStorage.setItem(profileKey, JSON.stringify(updated));
    localStorage.setItem('arcadehub_favorites', JSON.stringify(updated));

    window.dispatchEvent(new CustomEvent('arcadehub_favorites_updated', { detail: { gameId, isFavorite: !exists } }));
    return !exists;
  } catch (err) {
    console.error('Error toggling favorite', err);
    return false;
  }
}