/**
 * Navigation Experiment Configuration
 * Allows 100% reversible toggling between the CrazyGames-style interaction model
 * and the previous Right HUD system.
 *
 * To revert instantly, set ACTIVE_NAV_MODE = 'previous_hud';
 */
export type NavExperimentMode = 'crazygames' | 'previous_hud';

export const ACTIVE_NAV_MODE: NavExperimentMode = 'crazygames';