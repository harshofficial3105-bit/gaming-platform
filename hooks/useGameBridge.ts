import { useEffect, useCallback } from 'react';
import { guestVault } from '@/lib/storage/guestVault';

export interface GameBridgeMessage {
  type: string;
  gameId?: string;
  score?: number;
  data?: Record<string, unknown>;
  payload?: {
    score?: number;
    data?: Record<string, unknown>;
    highScore?: number;
    [key: string]: unknown;
  };
  version?: string | number;
}

interface UseGameBridgeProps {
  gameId: string;
  onScoreUpdate?: (score: number) => void;
  onGameOver?: (finalScore: number) => void;
  onSaveState?: (state: Record<string, unknown>) => void;
}

export function useGameBridge({
  gameId,
  onScoreUpdate,
  onGameOver,
  onSaveState,
}: UseGameBridgeProps) {
  
  // Increment play count & dispatch telemetry on game load
  useEffect(() => {
    try {
      // 1. Dynamic local play counter increment
      const playKey = `arcadehub_game_${gameId}_plays`;
      const currentPlays = Number(localStorage.getItem(playKey) || 0);
      const newPlays = currentPlays + 1;
      localStorage.setItem(playKey, String(newPlays));
      window.dispatchEvent(new Event('arcadehub_play_count_updated'));

      // 2. Telemetry event dispatch
      fetch('/api/telemetry/event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gameId,
          eventType: 'game.start',
          timestamp: Date.now(),
        }),
      }).catch(() => {});
    } catch {}
  }, [gameId]);

  const handleMessage = useCallback(
    (event: MessageEvent) => {
      if (!event.data || typeof event.data !== 'object') {
        return;
      }

      const message = event.data as GameBridgeMessage;
      const msgType = message.type;
      const targetGameId = message.gameId || gameId;

      // Extract raw score
      const rawScore = typeof message.score === 'number' 
        ? message.score 
        : typeof message.payload?.score === 'number' 
          ? message.payload.score 
          : typeof message.payload?.highScore === 'number'
            ? message.payload.highScore
            : undefined;

      // Extract saved state data
      const rawData = (message.data && typeof message.data === 'object' ? message.data : undefined) ||
                      (message.payload?.data && typeof message.payload.data === 'object' ? message.payload.data : undefined) ||
                      (message.payload && typeof message.payload === 'object' ? message.payload : undefined);

      switch (msgType) {
        // Direct Best Score event from game
        case 'ARCADEHUB_BEST_SCORE': {
          if (typeof rawScore === 'number' && Number.isFinite(rawScore)) {
            const key = `arcadehub_game_${targetGameId}_best_score`;
            const existing = Number(localStorage.getItem(key) || 0);
            const newBest = Math.max(existing, rawScore);

            localStorage.setItem(key, String(newBest));
            guestVault.saveProgress(targetGameId, { highScore: newBest, lastScore: rawScore });
          }
          break;
        }

        // Handshake & Initial Loading Request from Game
        case 'SDK_READY':
        case 'REQUEST_LOAD_PROGRESS':
        case 'LOAD_STATE_REQUEST': {
          const key = `arcadehub_game_${targetGameId}_best_score`;
          const savedKeyScore = Number(localStorage.getItem(key) || 0);
          const savedVaultData = guestVault.loadProgress(targetGameId) || {};
          const vaultScore = typeof savedVaultData.highScore === 'number' ? savedVaultData.highScore : 0;
          const effectiveBest = Math.max(savedKeyScore, vaultScore);

          if (event.source) {
            (event.source as WindowProxy).postMessage(
              {
                type: 'ARCADEHUB_LOAD_BEST_SCORE',
                gameId: targetGameId,
                score: effectiveBest,
                highScore: effectiveBest,
              },
              '*'
            );
            (event.source as WindowProxy).postMessage(
              {
                type: 'LOAD_PROGRESS_RESPONSE',
                payload: { ...savedVaultData, highScore: effectiveBest },
                data: { ...savedVaultData, highScore: effectiveBest },
              },
              '*'
            );
            (event.source as WindowProxy).postMessage(
              {
                type: 'LOAD_STATE_RESPONSE',
                payload: { ...savedVaultData, highScore: effectiveBest },
                data: { ...savedVaultData, highScore: effectiveBest },
              },
              '*'
            );
          }
          break;
        }

        // Live score updates
        case 'SCORE_UPDATE': {
          if (typeof rawScore === 'number' && Number.isFinite(rawScore)) {
            const key = `arcadehub_game_${targetGameId}_best_score`;
            const existing = Number(localStorage.getItem(key) || 0);
            const currentSave = (guestVault.loadProgress(targetGameId) || {}) as Record<string, unknown>;
            const currentHighScore = typeof currentSave.highScore === 'number' ? currentSave.highScore : 0;
            const newHighScore = Math.max(existing, currentHighScore, rawScore);

            localStorage.setItem(key, String(newHighScore));
            guestVault.saveProgress(targetGameId, {
              ...currentSave,
              highScore: newHighScore,
              lastScore: rawScore,
            });

            onScoreUpdate?.(rawScore);
          }
          break;
        }

        // Game Over
        case 'GAME_OVER': {
          if (typeof rawScore === 'number' && Number.isFinite(rawScore)) {
            const key = `arcadehub_game_${targetGameId}_best_score`;
            const existing = Number(localStorage.getItem(key) || 0);
            const currentSave = (guestVault.loadProgress(targetGameId) || {}) as Record<string, unknown>;
            const currentHighScore = typeof currentSave.highScore === 'number' ? currentSave.highScore : 0;
            const newHighScore = Math.max(existing, currentHighScore, rawScore);

            localStorage.setItem(key, String(newHighScore));
            guestVault.saveProgress(targetGameId, {
              ...currentSave,
              highScore: newHighScore,
              lastScore: rawScore,
            });

            onGameOver?.(rawScore);
          }
          break;
        }

        // State persistence
        case 'SAVE_PROGRESS':
        case 'SAVE_STATE': {
          if (rawData && typeof rawData === 'object') {
            const currentSave = (guestVault.loadProgress(targetGameId) || {}) as Record<string, unknown>;
            const currentHighScore = typeof currentSave.highScore === 'number' ? currentSave.highScore : 0;
            const incomingHighScore = typeof (rawData as any).highScore === 'number' 
              ? (rawData as any).highScore 
              : typeof rawScore === 'number' 
                ? rawScore 
                : 0;

            const key = `arcadehub_game_${targetGameId}_best_score`;
            const existing = Number(localStorage.getItem(key) || 0);
            const mergedHighScore = Math.max(existing, currentHighScore, incomingHighScore);

            localStorage.setItem(key, String(mergedHighScore));
            const updatedData = {
              ...currentSave,
              ...rawData,
              highScore: mergedHighScore,
            };

            guestVault.saveProgress(targetGameId, updatedData);
            onSaveState?.(updatedData);
          }
          break;
        }

        default:
          break;
      }
    },
    [gameId, onScoreUpdate, onGameOver, onSaveState]
  );

  useEffect(() => {
    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [handleMessage]);
}