'use client';

import { useEffect, useCallback } from 'react';
import { GameToPortalMessage, SDKEnvelope } from '@/types/sdk';

interface UseGameBridgeOptions {
  expectedOrigin?: string;
  onScoreUpdate?: (score: number) => void;
  onSaveState?: (state: Record<string, unknown>) => void;
  onGameOver?: (finalScore: number) => void;
}

export function useGameBridge(options: UseGameBridgeOptions = {}) {
  const { onScoreUpdate, onSaveState, onGameOver } = options;

  // Determine allowed origin (in production: R2 storage domain; in dev: current origin)
  const allowedOrigin =
    options.expectedOrigin ||
    (typeof window !== 'undefined' ? window.location.origin : '');

  const handleMessage = useCallback(
    (event: MessageEvent<SDKEnvelope<GameToPortalMessage> | GameToPortalMessage | { type: string; payload?: { score?: number; data?: Record<string, unknown> }; score?: number }>) => {
      // 1. Strict Origin Verification
      if (allowedOrigin && event.origin !== allowedOrigin) {
        return; // Discard unauthorized cross-origin messages
      }

      const raw = event.data;
      if (!raw || typeof raw !== 'object') {
        return;
      }

      // Extract message from envelope if wrapped, or use raw data
      const message: any = 'protocol' in raw && raw.protocol === 'PORTAL_SDK' && 'data' in raw
        ? raw.data
        : raw;

      if (!message || !message.type) {
        return;
      }

      // 2. Dispatch validated game events
      switch (message.type) {
        case 'SCORE_UPDATE': {
          const score = typeof message.score === 'number'
            ? message.score
            : message.payload?.score;
          if (typeof score === 'number') {
            onScoreUpdate?.(score);
          }
          break;
        }

        case 'SAVE_PROGRESS':
        case 'SAVE_STATE': {
          const data = message.payload?.data || message.payload || message.data;
          if (data && typeof data === 'object') {
            onSaveState?.(data as Record<string, unknown>);
          }
          break;
        }

        case 'GAME_OVER': {
          const score = typeof message.score === 'number'
            ? message.score
            : message.payload?.score;
          if (typeof score === 'number') {
            onGameOver?.(score);
          }
          break;
        }

        case 'SDK_READY':
          break;

        default:
          break;
      }
    },
    [allowedOrigin, onScoreUpdate, onSaveState, onGameOver]
  );

  useEffect(() => {
    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [handleMessage]);
}
