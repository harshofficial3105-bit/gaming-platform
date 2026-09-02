'use client';

import React, { useState, useEffect } from 'react';

export function NetworkStatusBanner() {
  const [isOffline, setIsOffline] = useState(false);
  const [reconnected, setReconnected] = useState(false);

  useEffect(() => {
    // Initial check
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      setIsOffline(true);
    }

    const handleOffline = () => {
      setIsOffline(true);
      setReconnected(false);
    };

    const handleOnline = () => {
      setIsOffline(false);
      setReconnected(true);
      const timer = setTimeout(() => setReconnected(false), 3000);
      return () => clearTimeout(timer);
    };

    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);

    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  if (!isOffline && !reconnected) return null;

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 pointer-events-none animate-in fade-in slide-in-from-top-2 duration-300">
      <div
        className={`pointer-events-auto flex items-center gap-2 px-4 py-2 rounded-2xl border font-mono text-xs shadow-2xl backdrop-blur-xl ${
          isOffline
            ? 'border-amber-500/50 bg-amber-950/90 text-amber-200 shadow-amber-900/40'
            : 'border-emerald-500/50 bg-emerald-950/90 text-emerald-200 shadow-emerald-900/40'
        }`}
      >
        <span className="text-sm">{isOffline ? 'âš¡' : 'âœ“'}</span>
        <span className="font-bold">
          {isOffline
            ? 'GRID OFFLINE â€¢ LOCAL CACHE & LOCAL SAVES ACTIVE'
            : 'GRID CONNECTION RESTORED â€¢ ONLINE'}
        </span>
      </div>
    </div>
  );
}