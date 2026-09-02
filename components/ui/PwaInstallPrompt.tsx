'use client';

import React, { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Register Service Worker
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .catch((err) => console.debug('[PWA] ServiceWorker registration bypassed:', err));
    }

    const dismissed = localStorage.getItem('arcadehub_pwa_dismissed');
    if (dismissed) return;

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsVisible(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('arcadehub_pwa_dismissed', 'true');
  };

  if (!isVisible || !deferredPrompt) return null;

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 z-40 max-w-sm w-full animate-fade-in font-sans">
      <div className="rounded-3xl border border-cyan-500/40 bg-[#0B1120]/95 backdrop-blur-md p-4 sm:p-5 shadow-2xl space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center h-10 w-10 rounded-2xl bg-cyan-950/80 border border-cyan-500/50 text-cyan-400 font-bold text-lg shrink-0">
              ⚡
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-white font-display">
                Install ArcadeHub App
              </h4>
              <p className="text-[11px] text-slate-400 font-mono">
                Instant desktop & mobile launch with zero browser frame lag.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleDismiss}
            className="text-slate-400 hover:text-white text-xs font-mono cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="flex items-center gap-2 pt-1 font-mono text-xs">
          <button
            type="button"
            onClick={handleInstall}
            className="flex-1 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-black font-bold transition-all shadow-md active:scale-95 cursor-pointer text-center"
          >
            📥 Install App
          </button>
          <button
            type="button"
            onClick={handleDismiss}
            className="px-3 py-2 rounded-xl border border-slate-800 bg-[#050811] hover:border-slate-700 text-slate-400 font-bold transition-colors cursor-pointer"
          >
            Later
          </button>
        </div>
      </div>
    </div>
  );
}