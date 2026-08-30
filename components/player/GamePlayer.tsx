'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Game } from '@/types/game';
import { useGameBridge } from '@/hooks/useGameBridge';

interface GamePlayerProps {
  game: Game;
}

export function GamePlayer({ game }: GamePlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPortraitMobile, setIsPortraitMobile] = useState(false);
  const [liveScore, setLiveScore] = useState<number | null>(null);

  // Connect secure postMessage bridge with origin validation
  useGameBridge({
    onScoreUpdate: (score) => {
      setLiveScore(score);
    },
    onGameOver: (finalScore) => {
      setLiveScore(finalScore);
    },
  });

  useEffect(() => {
    // 1. Cross-browser fullscreen state synchronization
    const handleFullscreenChange = () => {
      const isFs = Boolean(
        document.fullscreenElement ||
        (document as unknown as { webkitFullscreenElement?: Element }).webkitFullscreenElement ||
        (document as unknown as { mozFullScreenElement?: Element }).mozFullScreenElement
      );
      setIsFullscreen(isFs);
    };

    // 2. Mobile Device Orientation Detection
    const checkOrientation = () => {
      const isMobile = window.innerWidth < 768 || window.matchMedia('(pointer: coarse)').matches;
      const isPortrait = window.matchMedia('(orientation: portrait)').matches;
      setIsPortraitMobile(isMobile && isPortrait && game.orientation === 'landscape');
    };

    checkOrientation();
    const mediaQuery = window.matchMedia('(orientation: portrait)');
    mediaQuery.addEventListener('change', checkOrientation);
    window.addEventListener('resize', checkOrientation);

    // 3. Global Scroll-Lock on Game Keys
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
        return;
      }

      const scrollKeys = ['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
      if (scrollKeys.includes(e.code) || [' ', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
      }
    };

    // 4. Container wheel trap
    const container = containerRef.current;
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
    };

    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    window.addEventListener('keydown', handleGlobalKeyDown, { capture: true, passive: false });

    return () => {
      if (container) {
        container.removeEventListener('wheel', handleWheel);
      }
      mediaQuery.removeEventListener('change', checkOrientation);
      window.removeEventListener('resize', checkOrientation);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      window.removeEventListener('keydown', handleGlobalKeyDown, { capture: true });
    };
  }, [game.orientation]);

  const handleFocus = () => {
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.focus();
    }
  };

  const handleRestart = (e: React.SyntheticEvent) => {
    e.preventDefault();
    setLiveScore(0);
    if (iframeRef.current) {
      iframeRef.current.src = game.entryUrl;
    }
  };

  // Instant down-stroke fullscreen toggle
  const toggleFullscreen = useCallback((e?: React.SyntheticEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    const elem = containerRef.current as (HTMLDivElement & {
      webkitRequestFullscreen?: () => Promise<void>;
      mozRequestFullScreen?: () => Promise<void>;
    }) | null;

    if (!elem) return;

    const isCurrentlyFullscreen = Boolean(
      document.fullscreenElement ||
      (document as unknown as { webkitFullscreenElement?: Element }).webkitFullscreenElement ||
      (document as unknown as { mozFullScreenElement?: Element }).mozFullScreenElement
    );

    if (!isCurrentlyFullscreen) {
      if (elem.requestFullscreen) {
        elem.requestFullscreen().catch(() => {});
      } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
      } else if (elem.mozRequestFullScreen) {
        elem.mozRequestFullScreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      } else if ((document as unknown as { webkitExitFullscreen?: () => Promise<void> }).webkitExitFullscreen) {
        (document as unknown as { webkitExitFullscreen: () => Promise<void> }).webkitExitFullscreen();
      }
    }
  }, []);

  const aspectRatioStyle = {
    aspectRatio: `${game.dimensions.width} / ${game.dimensions.height}`,
  };

  return (
    <div className="space-y-2 sm:space-y-3 -mx-4 sm:mx-0">
      {/* Game Player Container */}
      <div
        ref={containerRef}
        onClick={handleFocus}
        onMouseEnter={handleFocus}
        style={aspectRatioStyle}
        className="relative w-full overflow-hidden border-y sm:border sm:rounded-xl border-slate-800 bg-black shadow-2xl group cursor-pointer touch-none [&:fullscreen]:aspect-auto [&:fullscreen]:w-screen [&:fullscreen]:h-screen [&:fullscreen]:rounded-none [&:fullscreen]:border-0"
      >
        {/* Mobile Orientation Warning Overlay */}
        {isPortraitMobile && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-slate-950/95 p-6 text-center backdrop-blur-md space-y-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 animate-pulse">
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <div className="space-y-1 max-w-xs">
              <h4 className="text-base font-bold text-white tracking-tight">Rotate Your Phone</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                This game is designed for landscape mode. Rotate for full-screen arcade action.
              </p>
            </div>
            <button
              onPointerDown={(e) => {
                e.preventDefault();
                setIsPortraitMobile(false);
              }}
              className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-300 active:scale-95 transition-transform"
            >
              Play in Portrait Anyway
            </button>
          </div>
        )}

        <iframe
          ref={iframeRef}
          src={game.entryUrl}
          title={game.title}
          className="h-full w-full border-0"
          sandbox="allow-scripts allow-same-origin allow-pointer-lock"
          allow="fullscreen; gamepad; autoplay"
          loading="eager"
        />
      </div>

      {/* Mobile-First Action Bar */}
      <div className="mx-4 sm:mx-0 flex items-center justify-between rounded-lg border border-slate-800/80 bg-slate-900/70 px-3.5 py-2 sm:px-4 sm:py-2.5 backdrop-blur-sm">
        
        {/* Status & Live Score Display */}
        <div className="flex items-center gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="hidden sm:inline">Secure Sandbox</span>
          </div>

          {liveScore !== null && (
            <div className="flex items-center gap-1.5 rounded bg-slate-800 px-2 py-0.5 border border-slate-700 font-mono text-cyan-400 font-bold">
              <span>SCORE:</span>
              <span className="text-white">{liveScore}</span>
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Instant Restart Button */}
          <button
            type="button"
            onPointerDown={handleRestart}
            title="Restart Game"
            className="flex items-center justify-center h-8 w-8 sm:h-auto sm:w-auto sm:px-3 sm:py-1.5 rounded-md border border-slate-700 bg-slate-800 text-xs font-semibold text-slate-300 hover:bg-slate-700 hover:text-white transition-all active:scale-90 cursor-pointer select-none"
          >
            <svg className="h-4 w-4 sm:mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span className="hidden sm:inline">Restart</span>
          </button>

          {/* Instant PointerDown Fullscreen Button */}
          <button
            type="button"
            onPointerDown={toggleFullscreen}
            className="flex items-center gap-1.5 rounded-md border border-cyan-500/30 bg-cyan-500/10 px-3.5 py-1.5 text-xs font-semibold text-cyan-400 hover:bg-cyan-500 hover:text-black transition-all active:scale-90 cursor-pointer select-none"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isFullscreen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              )}
            </svg>
            <span>{isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}</span>
          </button>
        </div>

      </div>
    </div>
  );
}
