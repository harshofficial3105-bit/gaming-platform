'use client';

export interface CreatorUser {
  id: string;
  studioName: string;
  fullName: string;
  email: string;
  createdAt: number;
}

export interface CreatorGame {
  id: string;
  creatorId: string;
  slug: string;
  title: string;
  category: string;
  status: 'published' | 'under_review' | 'draft';
  plays: number;
  rating: number;
  openIssues: number;
  createdAt: number;
}

const CREATOR_SESSION_KEY = 'arcadehub_active_creator_session';
const CREATORS_STORE_KEY = 'arcadehub_registered_creators_db';
const CREATOR_GAMES_STORE_KEY = 'arcadehub_creator_games_db';

/**
 * Get currently authenticated creator session
 */
export function getActiveCreator(): CreatorUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(CREATOR_SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as CreatorUser;
  } catch {
    return null;
  }
}

/**
 * Save active creator session and broadcast event
 */
export function setActiveCreator(user: CreatorUser): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CREATOR_SESSION_KEY, JSON.stringify(user));
  window.dispatchEvent(new Event('arcadehub_creator_auth_changed'));
}

/**
 * Log out creator
 */
export function logoutCreator(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(CREATOR_SESSION_KEY);
  window.dispatchEvent(new Event('arcadehub_creator_auth_changed'));
}

/**
 * Register a new creator account
 */
export function registerCreatorLocal(data: {
  studioName: string;
  fullName: string;
  email: string;
  password: string;
}): { success: boolean; user?: CreatorUser; error?: string } {
  if (typeof window === 'undefined') {
    return { success: false, error: 'Browser environment required.' };
  }

  try {
    const rawStore = localStorage.getItem(CREATORS_STORE_KEY);
    const store: Array<CreatorUser & { passwordHash: string }> = rawStore ? JSON.parse(rawStore) : [];

    // Check if email already registered
    const exists = store.some((c) => c.email.toLowerCase() === data.email.toLowerCase());
    if (exists) {
      return { success: false, error: 'A creator account with this email already exists.' };
    }

    const newCreatorId = `creator_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const newCreator: CreatorUser = {
      id: newCreatorId,
      studioName: data.studioName.trim(),
      fullName: data.fullName.trim(),
      email: data.email.trim().toLowerCase(),
      createdAt: Date.now(),
    };

    store.push({
      ...newCreator,
      passwordHash: data.password, // In a full backend, this is hashed with bcrypt
    });

    localStorage.setItem(CREATORS_STORE_KEY, JSON.stringify(store));
    setActiveCreator(newCreator);

    return { success: true, user: newCreator };
  } catch (err) {
    console.error('Creator Registration Error:', err);
    return { success: false, error: 'Failed to create creator account. Please try again.' };
  }
}

/**
 * Authenticate creator
 */
export function loginCreatorLocal(data: {
  email: string;
  password: string;
}): { success: boolean; user?: CreatorUser; error?: string } {
  if (typeof window === 'undefined') {
    return { success: false, error: 'Browser environment required.' };
  }

  try {
    const rawStore = localStorage.getItem(CREATORS_STORE_KEY);
    const store: Array<CreatorUser & { passwordHash: string }> = rawStore ? JSON.parse(rawStore) : [];

    const found = store.find(
      (c) => c.email.toLowerCase() === data.email.toLowerCase() && c.passwordHash === data.password
    );

    if (!found) {
      return { success: false, error: 'Invalid email or password.' };
    }

    const user: CreatorUser = {
      id: found.id,
      studioName: found.studioName,
      fullName: found.fullName,
      email: found.email,
      createdAt: found.createdAt,
    };

    setActiveCreator(user);
    return { success: true, user };
  } catch (err) {
    console.error('Creator Login Error:', err);
    return { success: false, error: 'Failed to sign in. Please try again.' };
  }
}

/**
 * Get games owned strictly by the specified creatorId (Zero Data Leakage)
 */
export function getGamesByCreator(creatorId: string): CreatorGame[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(CREATOR_GAMES_STORE_KEY);
    if (!raw) return [];
    const allGames: CreatorGame[] = JSON.parse(raw);
    return allGames.filter((g) => g.creatorId === creatorId);
  } catch {
    return [];
  }
}

/**
 * Save a newly ingested game strictly associated with the creatorId
 */
export function addCreatorGame(creatorId: string, game: {
  title: string;
  slug: string;
  category: string;
  status?: 'published' | 'under_review' | 'draft';
}): CreatorGame {
  const newGame: CreatorGame = {
    id: `cgame_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    creatorId,
    slug: game.slug,
    title: game.title,
    category: game.category,
    status: game.status || 'published',
    plays: 0,
    rating: 0,
    openIssues: 0,
    createdAt: Date.now(),
  };

  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem(CREATOR_GAMES_STORE_KEY);
      const allGames: CreatorGame[] = raw ? JSON.parse(raw) : [];
      allGames.push(newGame);
      localStorage.setItem(CREATOR_GAMES_STORE_KEY, JSON.stringify(allGames));
    } catch (e) {
      console.error('Error saving creator game:', e);
    }
  }

  return newGame;
}