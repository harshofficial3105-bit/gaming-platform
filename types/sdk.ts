// ==============================================================================
// PORTAL SDK PROTOCOL v1 (postMessage Schemas)
// ==============================================================================

// 1. Messages sent from CHILD (Game) -> PARENT (Portal)
export type GameToPortalMessage =
  | { type: 'SDK_READY'; version: string }
  | { type: 'GAME_STARTED' }
  | { type: 'GAME_OVER'; score: number }
  | { type: 'SCORE_UPDATE'; score: number }
  | { type: 'SAVE_PROGRESS'; payload: Record<string, unknown> }
  | { type: 'REQUEST_LOAD_PROGRESS' };

// 2. Messages sent from PARENT (Portal) -> CHILD (Game)
export type PortalToGameMessage =
  | { type: 'PAUSE_GAME' }
  | { type: 'RESUME_GAME' }
  | { type: 'LOAD_PROGRESS_RESPONSE'; payload: Record<string, unknown> | null }
  | { type: 'MUTE_AUDIO'; isMuted: boolean };

// 3. Wrapper Envelope with Versioning
export interface SDKEnvelope<T> {
  protocol: 'PORTAL_SDK';
  version: 'v1';
  timestamp: number;
  data: T;
}
