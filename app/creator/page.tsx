'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getActiveCreator, CreatorUser } from '@/lib/creator/auth';

export default function CreatorGatewayPage() {
  const [creator, setCreator] = useState<CreatorUser | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setCreator(getActiveCreator());
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-8 font-sans">
      
      {/* Hero Welcome */}
      <div className="rounded-3xl border border-purple-500/30 bg-gradient-to-r from-purple-950/40 via-[#0B1120] to-[#070B14] p-8 shadow-2xl space-y-4">
        <div className="flex items-center gap-3 font-mono text-xs text-purple-300">
          <span className="px-2.5 py-1 rounded-full bg-purple-950 border border-purple-500/40 font-bold">
            CREATOR OS v1.0
          </span>
          <span>•</span>
          <span>Zero-Friction HTML5 Publishing</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-white font-display">
          Publish Instant Games to the ArcadeHub Grid
        </h1>

        <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
          Upload your zip bundle, run automated security and AST audits, test in the live SDK sandbox, 
          and track verified telemetry performance metrics for your games.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-4 font-mono text-xs">
          {mounted && creator ? (
            <Link
              href="/creator/dashboard"
              className="px-6 py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold shadow-lg shadow-purple-900/40 transition-all cursor-pointer"
            >
              GO TO STUDIO DASHBOARD ({creator.studioName}) →
            </Link>
          ) : (
            <>
              <Link
                href="/creator/signup"
                className="px-6 py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold shadow-lg shadow-purple-900/40 transition-all cursor-pointer"
              >
                BECOME A CREATOR →
              </Link>
              <Link
                href="/creator/login"
                className="px-6 py-3 rounded-2xl border border-slate-800 bg-[#050811] hover:border-purple-500/40 text-slate-300 transition-colors"
              >
                Sign In to Studio
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Creator Value Props */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 font-sans">
        <div className="rounded-2xl border border-slate-800/80 bg-[#0B1120] p-6 space-y-2.5 shadow-xl">
          <div className="h-10 w-10 rounded-xl bg-purple-950/60 border border-purple-500/40 flex items-center justify-center text-xl text-purple-400">
            ⚡
          </div>
          <h3 className="text-sm font-bold text-white">Instant Distribution</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Direct deployment to the ArcadeHub grid with zero player download friction.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800/80 bg-[#0B1120] p-6 space-y-2.5 shadow-xl">
          <div className="h-10 w-10 rounded-xl bg-cyan-950/60 border border-cyan-500/40 flex items-center justify-center text-xl text-cyan-400">
            🛡️
          </div>
          <h3 className="text-sm font-bold text-white">Automated Security Audits</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Real-time AST parsing, Zip Slip prevention, and sandboxed preview environments.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800/80 bg-[#0B1120] p-6 space-y-2.5 shadow-xl">
          <div className="h-10 w-10 rounded-xl bg-amber-950/60 border border-amber-500/40 flex items-center justify-center text-xl text-amber-400">
            📊
          </div>
          <h3 className="text-sm font-bold text-white">Verified Analytics</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Track real player counts, gameplay durations, average ratings, and community bug reports.
          </p>
        </div>
      </div>

    </div>
  );
}