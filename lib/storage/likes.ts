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

export function getLikes(profileId?: string): string[] {
  if (typeof window === 'undefined') return [];
  const targetId = profileId || getActiveProfileKey();
  try {
    const profileKey = `arcadehub_likes_${targetId}`;
    const raw = localStorage.getItem(profileKey);
    let list: string[] = raw ? JSON.parse(raw) : [];

    // Fallback/sync with legacy key
    if (list.length === 0 && targetId === 'guest') {
      const legacyRaw = localStorage.getItem('arcadehub_likes');
      if (legacyRaw) list = JSON.parse(legacyRaw);
    }

    return list;
  } catch {
    return [];
  }
}

export function isLiked(gameId: string, profileId?: string): boolean {
  if (typeof window === 'undefined') return false;
  const targetId = profileId || getActiveProfileKey();
  const currentLikes = getLikes(targetId);
  
  if (currentLikes.includes(gameId)) return true;

  // Check rating store synchronization
  try {
    const vote = localStorage.getItem(`arcadehub_vote_${gameId}`);
    if (vote && Number(vote) >= 4) {
      return true;
    }
  } catch {}

  return false;
}

export function toggleLike(gameId: string, profileId?: string): boolean {
  if (typeof window === 'undefined') return false;
  const targetId = profileId || getActiveProfileKey();
  try {
    const currentlyLiked = isLiked(gameId, targetId);
    const currentList = getLikes(targetId);

    let updatedList: string[];
    if (currentlyLiked) {
      updatedList = currentList.filter((id) => id !== gameId);
      localStorage.removeItem(`arcadehub_vote_${gameId}`);
    } else {
      updatedList = currentList.includes(gameId) ? currentList : [...currentList, gameId];
      localStorage.setItem(`arcadehub_vote_${gameId}`, '5');
    }

    const profileKey = `arcadehub_likes_${targetId}`;
    localStorage.setItem(profileKey, JSON.stringify(updatedList));
    localStorage.setItem('arcadehub_likes', JSON.stringify(updatedList));

    window.dispatchEvent(new CustomEvent('arcadehub_likes_updated', { detail: { gameId, isLiked: !currentlyLiked } }));
    window.dispatchEvent(new Event('arcadehub_rating_updated'));
    return !currentlyLiked;
  } catch (err) {
    console.error('Error toggling like', err);
    return false;
  }
}