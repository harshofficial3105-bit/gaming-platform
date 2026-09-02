'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ExtendedGame } from '@/lib/games';
import { useGameBridge } from '@/hooks/useGameBridge';
import { isFavorite, toggleFavorite } from '@/lib/storage/favorites';
import { isLiked, toggleLike } from '@/lib/storage/likes';

interface GamePlayerProps {
  game: ExtendedGame;
}

export function GamePlayer({ game }: GamePlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPortraitMobile, setIsPortraitMobile] = useState(false);
  const [isSoundOn, setIsSoundOn] = useState(true);
  const [bookmarked, setBookmarked] = useState(false);
  const [liked, setLiked] = useState(false);

  // Initialize Sandbox Iframe Storage & Handshake Bridge
  useGameBridge({ gameId: game.id });

  const sendBestScoreToIframe = useCallback(() => {
    const directBest = Number(localStorage.getItem(`arcadehub_game_${game.id}_best_score`) || 0);
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage({
        type: 'ARCADEHUB_LOAD_BEST_SCORE',
        gameId: game.id,
        score: directBest,
      }, '*');
    }
  }, [game.id]);

  // Sync bookmark and liked states
  const syncSocialStates = useCallback(() => {
    setBookmarked(isFavorite(game.id));
    setLiked(isLiked(game.id));
  }, [game.id]);

  useEffect(() => {
    syncSocialStates();

    window.addEventListener('arcadehub_favorites_updated', syncSocialStates);
    window.addEventListener('arcadehub_likes_updated', syncSocialStates);
    window.addEventListener('arcadehub_rating_updated', syncSocialStates);
    window.addEventListener('arcadehub_auth_changed', syncSocialStates);
    return () => {
      window.removeEventListener('arcadehub_favorites_updated', syncSocialStates);
      window.removeEventListener('arcadehub_likes_updated', syncSocialStates);
      window.removeEventListener('arcadehub_rating_updated', syncSocialStates);
      window.removeEventListener('arcadehub_auth_changed', syncSocialStates);
    };
  }, [syncSocialStates]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = Boolean(
        document.fullscreenElement ||
        (document as unknown as { webkitFullscreenElement?: Element }).webkitFullscreenElement ||
        (document as unknown as { mozFullScreenElement?: Element }).mozFullScreenElement
      );
      setIsFullscreen(isCurrentlyFullscreen);
    };

    const checkOrientation = () => {
      const isPortrait = window.innerHeight > window.innerWidth;
      const isMobile = window.innerWidth <= 768;
      setIsPortraitMobile(game.orientation === 'landscape' && isPortrait && isMobile);
    };

    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      const isIframeFocused = activeEl === iframeRef.current || activeEl?.tagName === 'IFRAME';
      const isContainerFocused = containerRef.current?.contains(activeEl);

      if (isIframeFocused || isContainerFocused || isFullscreen) {
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space', ' '].includes(e.key) || e.keyCode === 32) {
          e.preventDefault();
        }
      }
    };

    const handleWheel = (e: WheelEvent) => {
      if (isFullscreen) {
        e.preventDefault();
      }
    };

    checkOrientation();

    const mediaQuery = window.matchMedia('(orientation: portrait)');
    mediaQuery.addEventListener('change', checkOrientation);
    window.addEventListener('resize', checkOrientation);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    window.addEventListener('keydown', handleGlobalKeyDown, { capture: true });

    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
    }

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
  }, [game.orientation, isFullscreen]);

  const handleFocus = () => {
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.focus();
    }
  };

  const handleRestart = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (iframeRef.current) {
      iframeRef.current.src = `${game.entryUrl}?v=${Date.now()}`;
    }
  };

  const toggleSound = (e: React.SyntheticEvent) => {
    e.preventDefault();
    const nextState = !isSoundOn;
    setIsSoundOn(nextState);
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage({ type: 'MUTE_AUDIO', isMuted: !nextState }, '*');
    }
  };

  const toggleFullscreen = useCallback(() => {
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

  const handleBookmarkToggle = () => {
    const next = toggleFavorite(game.id);
    setBookmarked(next);
  };

  const handleLikeToggle = () => {
    const next = toggleLike(game.id);
    setLiked(next);
  };

  const gameWidth = game.dimensions?.width || 800;
  const gameHeight = game.dimensions?.height || 500;
  const aspectRatioStyle = {
    aspectRatio: `${gameWidth} / ${gameHeight}`,
  };

  return (
    <div className="w-full flex flex-col items-center space-y-3">
      
      {/* 1. Game Canvas Container */}
      <div
        ref={containerRef}
        onClick={handleFocus}
        onMouseEnter={handleFocus}
        onDoubleClick={toggleFullscreen}
        style={aspectRatioStyle}
        className="relative w-full max-h-[66vh] overflow-hidden rounded-xl sm:rounded-2xl border border-slate-800/90 bg-black shadow-2xl group cursor-pointer touch-none [&:fullscreen]:aspect-auto [&:fullscreen]:w-screen [&:fullscreen]:h-screen [&:fullscreen]:rounded-none [&:fullscreen]:border-0 [&:fullscreen]:max-h-none"
      >
        {/* Mobile Orientation Warning */}
        {isPortraitMobile && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-slate-950/95 p-6 text-center backdrop-blur-md space-y-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 animate-pulse">
              📱
            </div>
            <div className="space-y-1 max-w-xs">
              <h4 className="text-base font-bold text-white tracking-tight font-sans">Rotate Your Phone</h4>
              <p className="text-xs text-slate-400 leading-relaxed font-mono">
                This game is designed for landscape mode. Rotate for full-screen arcade action.
              </p>
            </div>
            <button
              onClick={() => setIsPortraitMobile(false)}
              className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-bold text-slate-300 active:scale-95 transition-transform font-mono"
            >
              Play in Portrait Anyway
            </button>
          </div>
        )}

        <iframe
          ref={iframeRef}
          src={`${game.entryUrl}?v=20260901_5`}
          title={game.title}
          onLoad={sendBestScoreToIframe}
          className="h-full w-full border-0 block"
          sandbox="allow-scripts allow-same-origin allow-pointer-lock"
          allow="fullscreen; gamepad; autoplay"
          loading="eager"
        />
      </div>

      {/* 2. Unified Premium Controls & Social Action Bar */}
      <div className="w-full flex flex-wrap items-center justify-between gap-2.5 px-1 font-sans text-xs">
        
        {/* Left: Tactical Gaming Controls */}
        <div className="flex items-center gap-2 font-mono">
          {/* Restart */}
          <button
            type="button"
            onClick={handleRestart}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-800 bg-[#0B1120] hover:border-slate-700 hover:text-white text-slate-300 font-bold transition-all active:scale-95 cursor-pointer shadow-md"
          >
            <span>🔄</span>
            <span>Restart</span>
          </button>

          {/* Sound */}
          <button
            type="button"
            onClick={toggleSound}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border font-bold transition-all active:scale-95 cursor-pointer shadow-md ${
              isSoundOn
                ? 'bg-cyan-950/40 border-cyan-500/40 text-cyan-300'
                : 'bg-[#0B1120] border-slate-800 text-slate-400'
            }`}
          >
            <span>{isSoundOn ? '🔊' : '🔇'}</span>
            <span>{isSoundOn ? 'Sound On' : 'Muted'}</span>
          </button>

          {/* Fullscreen */}
          <button
            type="button"
            onClick={toggleFullscreen}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-800 bg-[#0B1120] hover:border-cyan-500/40 text-slate-300 hover:text-cyan-300 font-bold transition-all active:scale-95 cursor-pointer shadow-md"
          >
            <span>{isFullscreen ? '✕' : '⛶'}</span>
            <span>{isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}</span>
          </button>
        </div>

        {/* Right: Social & Bookmark Actions (100% Synchronized) */}
        <div className="flex items-center gap-2">
          {/* Add to My List / In My List */}
          <button
            type="button"
            onClick={handleBookmarkToggle}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer active:scale-95 shadow-md ${
              bookmarked
                ? 'bg-purple-600 hover:bg-purple-500 text-white border border-purple-400/50 shadow-purple-950/40'
                : 'bg-[#181F34] hover:bg-[#222B48] border border-slate-700 text-slate-300 hover:text-white'
            }`}
          >
            <svg
              className={`h-3.5 w-3.5 transition-colors ${
                bookmarked ? 'stroke-white fill-white' : 'stroke-slate-300 fill-none'
              }`}
              viewBox="0 0 24 24"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            </svg>
            <span>{bookmarked ? 'In My List' : 'Add to My List'}</span>
          </button>

          {/* Like / Liked */}
          <button
            type="button"
            onClick={handleLikeToggle}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer active:scale-95 shadow-md ${
              liked
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-400/50 shadow-emerald-950/40'
                : 'bg-[#181F34] hover:bg-[#222B48] border border-slate-700 text-slate-300 hover:text-white'
            }`}
          >
            <span className="text-xs leading-none">👍</span>
            <span>{liked ? 'Liked' : 'Like'}</span>
          </button>
        </div>

      </div>

    </div>
  );
}