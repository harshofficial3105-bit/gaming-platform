export type PlayerPersona = 'NEW_VISITOR' | 'GUEST_PLAYER' | 'REGISTERED_PLAYER';

export interface RegisteredUserProfile {
  id: string;
  username: string;
  email: string;
  avatar: string;
  level: number;
  xp: number;
  provider?: 'email' | 'google' | 'facebook';
  registeredAt: string;
  syncedSavesCount: number;
}

export const playerAuth = {
  /**
   * Determine the current player persona
   */
  getPersona(savesCount: number = 0): {
    persona: PlayerPersona;
    user: RegisteredUserProfile | null;
    label: string;
    badgeColor: string;
  } {
    if (typeof window === 'undefined') {
      return { persona: 'NEW_VISITOR', user: null, label: 'NEW VISITOR', badgeColor: 'cyan' };
    }

    try {
      const token = localStorage.getItem('arcadehub_user_token');
      const rawUser = localStorage.getItem('arcadehub_user_profile');

      if (token && rawUser) {
        const user: RegisteredUserProfile = JSON.parse(rawUser);
        return {
          persona: 'REGISTERED_PLAYER',
          user,
          label: `@${user.username}`,
          badgeColor: 'purple',
        };
      }
    } catch (e) {}

    if (savesCount > 0) {
      return {
        persona: 'GUEST_PLAYER',
        user: null,
        label: `GUEST (${savesCount} Saves)`,
        badgeColor: 'emerald',
      };
    }

    return {
      persona: 'NEW_VISITOR',
      user: null,
      label: 'NEW VISITOR',
      badgeColor: 'cyan',
    };
  },

  /**
   * Register a new player account with email
   */
  register(username: string, email: string, avatar: string = '👤', provider: 'email' | 'google' | 'facebook' = 'email'): RegisteredUserProfile {
    const cleanUser = username.trim().toLowerCase().replace(/[^a-z0-9_]/g, '') || 'pilot';
    const user: RegisteredUserProfile = {
      id: `usr_${provider}_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      username: cleanUser,
      email: email.trim().toLowerCase(),
      avatar,
      level: 1,
      xp: 150,
      provider,
      registeredAt: new Date().toISOString(),
      syncedSavesCount: 0,
    };

    localStorage.setItem('arcadehub_user_token', `tok_${provider}_${Date.now()}`);
    localStorage.setItem('arcadehub_user_profile', JSON.stringify(user));
    localStorage.setItem('arcadehub_player_username', user.username);
    localStorage.setItem('arcadehub_player_avatar', user.avatar);

    window.dispatchEvent(new Event('arcadehub_player_state_changed'));
    window.dispatchEvent(new Event('arcadehub_auth_changed'));
    window.dispatchEvent(new Event('arcadehub_avatar_updated'));

    return user;
  },

  /**
   * 1-Click OAuth Sign-In & Sign-Up for Google & Facebook
   */
  signInWithProvider(provider: 'google' | 'facebook'): RegisteredUserProfile {
    const providerName = provider === 'google' ? 'Google' : 'Facebook';
    const randomSuffix = Math.floor(Math.random() * 900 + 100);
    const mockEmail = `pilot_${provider}_${randomSuffix}@${provider}.auth`;
    const mockUsername = `${provider}_pilot_${randomSuffix}`;
    const avatarBadge = provider === 'google' ? '🚀' : '⚡';

    return this.register(mockUsername, mockEmail, avatarBadge, provider);
  },

  /**
   * Log in to an existing player account
   */
  login(email: string): RegisteredUserProfile {
    const username = email.split('@')[0] || 'pilot';
    const avatar = localStorage.getItem('arcadehub_player_avatar') || '👤';
    return this.register(username, email, avatar, 'email');
  },

  /**
   * Log out of current account and revert to guest/visitor state
   */
  logout() {
    localStorage.removeItem('arcadehub_user_token');
    localStorage.removeItem('arcadehub_user_profile');
    localStorage.removeItem('arcadehub_player_username');

    window.dispatchEvent(new Event('arcadehub_player_state_changed'));
    window.dispatchEvent(new Event('arcadehub_auth_changed'));
  },
};