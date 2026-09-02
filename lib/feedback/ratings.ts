export interface GameRatingSummary {
  gameId: string;
  averageRating: number;
  totalRatings: number;
  breakdown: Record<number, number>; // { 5: count, 4: count, 3: count, 2: count, 1: count }
  userRating?: number;
}

// In-memory per-user rating registry: { [gameId]: { [userId]: ratingNumber } }
const userRatingsStore: Record<string, Record<string, number>> = {
  'space-gem-collector': {
    'pilot_alpha': 5,
    'pilot_beta': 5,
    'pilot_gamma': 4,
    'pilot_delta': 5,
  },
};

export const gameRatings = {
  /**
   * Get dynamic aggregated rating summary for a game (optionally with user's specific rating)
   */
  getSummary(gameId: string, userId?: string): GameRatingSummary {
    const gameVotes = userRatingsStore[gameId] || {};
    const voteList = Object.values(gameVotes);

    if (voteList.length === 0) {
      return {
        gameId,
        averageRating: 0,
        totalRatings: 0,
        breakdown: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
        userRating: userId ? gameVotes[userId] : undefined,
      };
    }

    const total = voteList.length;
    const sum = voteList.reduce((acc, curr) => acc + curr, 0);
    const average = Number((sum / total).toFixed(1));

    const breakdown: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    voteList.forEach((r) => {
      if (breakdown[r] !== undefined) breakdown[r]++;
    });

    return {
      gameId,
      averageRating: average,
      totalRatings: total,
      breakdown,
      userRating: userId ? gameVotes[userId] : undefined,
    };
  },

  /**
   * Set or update a user's rating for a game (supports editing anytime)
   */
  setUserRating(gameId: string, userId: string, rating: number): GameRatingSummary {
    if (!userRatingsStore[gameId]) {
      userRatingsStore[gameId] = {};
    }

    const clampedRating = Math.max(1, Math.min(5, Math.round(rating)));
    userRatingsStore[gameId][userId] = clampedRating;

    return this.getSummary(gameId, userId);
  },

  /**
   * Remove a user's rating for a game
   */
  removeUserRating(gameId: string, userId: string): GameRatingSummary {
    if (userRatingsStore[gameId] && userRatingsStore[gameId][userId]) {
      delete userRatingsStore[gameId][userId];
    }
    return this.getSummary(gameId, userId);
  },
};