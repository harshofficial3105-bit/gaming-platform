'use client';

import { useEffect, useCallback } from 'react';
import { GameToPortalMessage, SDKEnvelope } from '@/types/sdk';
import { guestVault } from '@/lib/storage/guestVault';

interface UseGameBridgeOptions {
  gameId: string;
  expectedOrigin?: string;
  onScoreUpdate?: (score: number) => void;
  onSaveState?: (state: Record<string, unknown>) => void;
  onGameOver?: (finalScore: number) => void;
}

export function useGameBridge(options: UseGameBridgeOptions) {
  const { gameId, onScoreUpdate, onSaveState, onGameOver } = options;

  const allowedOrigin =
    options.expectedOrigin ||
    (typeof window !== 'undefined' ? window.location.origin : '');

  const handleMessage = useCallback(
    (event: MessageEvent<SDKEnvelope<GameToPortalMessage> | any>) => {
      if (allowedOrigin && event.origin !== allowedOrigin) {
        return;
      }

      const raw = event.data;
      if (!raw || typeof raw !== 'object') {
        return;
      }

      const message: any =
        'protocol' in raw && raw.protocol === 'PORTAL_SDK' && 'data' in raw
          ? raw.data
          : raw;

      if (!message || !message.type) {
        return;
      }

      switch (message.type) {
        case 'SCORE_UPDATE': {
          const score =
            typeof message.score === 'number'
              ? message.score
              : message.payload?.score;
          if (typeof score === 'number') {
            onScoreUpdate?.(score);
          }
          break;
        }

        case 'SAVE_PROGRESS':
        case 'SAVE_STATE': {
          const incoming = message.payload?.data || message.payload || message.data;
          if (incoming && typeof incoming === 'object') {
            const existing = guestVault.loadProgress(gameId) || {};
            
            // Monotonically preserve the true all-time highest score
            const existingHigh = typeof existing.highScore === 'number' ? existing.highScore : 0;
            const incomingHigh = typeof incoming.highScore === 'number' ? incoming.highScore : 0;
            const trueHighScore = Math.max(existingHigh, incomingHigh);

            const mergedData = {
              ...existing,
              ...incoming,
              highScore: trueHighScore,
            };

            guestVault.saveProgress(gameId, mergedData);
            onSaveState?.(mergedData);
          }
          break;
        }

        case 'SDK_READY':
        case 'REQUEST_LOAD_PROGRESS': {
          // Send all-time saved progress to the game iframe
          const savedData = guestVault.loadProgress(gameId) || { highScore: 0 };
          if (event.source && 'postMessage' in event.source) {
            (event.source as Window).postMessage(
              {
                protocol: 'PORTAL_SDK',
                version: 'v1',
                timestamp: Date.now(),
                data: {
                  type: 'LOAD_PROGRESS_RESPONSE',
                  payload: savedData,
                },
              },
              event.origin || '*'
            );
          }
          break;
        }

        case 'GAME_OVER': {
          const score =
            typeof message.score === 'number'
              ? message.score
              : message.payload?.score;
          if (typeof score === 'number') {
            onGameOver?.(score);
          }
          break;
        }

        default:
          break;
      }
    },
    [allowedOrigin, gameId, onScoreUpdate, onSaveState, onGameOver]
  );

  useEffect(() => {
    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [handleMessage]);
}
