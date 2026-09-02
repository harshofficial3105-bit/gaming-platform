'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorBoundary({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('ArcadeHub Runtime Exception:', error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 space-y-6 font-sans">
      <div className="rounded-3xl border border-rose-500/40 bg-gradient-to-b from-rose-950/40 via-[#0B1120] to-[#050811] p-8 max-w-md w-full shadow-2xl space-y-5">
        
        {/* Cyber Error Badge */}
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-3xl bg-rose-950/80 border border-rose-500/50 text-rose-400 text-3xl font-mono animate-pulse">
          ⚠️
        </div>

        <div className="space-y-2">
          <h1 className="text-xl sm:text-2xl font-black text-white font-display">
            Signal Interruption
          </h1>
          <p className="text-xs text-slate-400 leading-relaxed font-mono">
            ArcadeHub encountered a runtime exception. Your local guest progress and high scores remain securely preserved.
          </p>
        </div>

        {error.message && (
          <div className="p-3 rounded-xl bg-[#050811] border border-slate-800 text-slate-400 text-[11px] font-mono text-left truncate">
            <span className="text-rose-400 font-bold">Error: </span>
            <span>{error.message}</span>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 font-mono text-xs">
          <button
            type="button"
            onClick={() => reset()}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold transition-all shadow-lg shadow-purple-950/50 cursor-pointer"
          >
            🔄 Try Again
          </button>
          <Link
            href="/"
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-800 bg-[#050811] hover:border-cyan-500/40 text-slate-300 font-bold transition-colors text-center"
          >
            ⚡ Return to Grid
          </Link>
        </div>

      </div>
    </div>
  );
}