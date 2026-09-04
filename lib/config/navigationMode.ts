/**
 * Master Navigation Mode Configuration
 * Allows 100% reversible toggling between the ArcadeHub Hybrid Navigation System
 * and the previous Right HUD system.
 *
 * To revert instantly, set ACTIVE_NAV_MODE = 'previous_hud';
 */
export type NavigationMode = 'hybrid_experimental' | 'previous_hud';

export const ACTIVE_NAV_MODE: NavigationMode = 'hybrid_experimental';