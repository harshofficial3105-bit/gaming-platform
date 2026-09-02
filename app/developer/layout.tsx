'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function CreatorStudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const studioLinks = [
    { label: 'Dashboard', href: '/developer/dashboard', icon: '📊' },
    { label: 'Ingestion Pipeline', href: '/developer/submit', icon: '📦' },
    { label: 'SDK Sandbox', href: '/developer/preview', icon: '🧪' },
  ];

  return (
    <div className="min-h-screen bg-[#070B14] text-slate-100 flex flex-col font-sans -mx-2 sm:-mx-4 -my-4 px-4 sm:px-8 py-6">
      
      {/* 1. Dedicated Studio Engineering Header */}
      <header className="rounded-2xl border border-slate-800 bg-[#0B1120] p-4 shadow-xl mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Studio Brand */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-purple-950/60 border border-purple-500/30 text-purple-400 font-mono text-base font-bold">
              ⚙️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-black font-mono text-white tracking-wider">
                  ARCADEHUB <span className="text-purple-400 font-normal">STUDIO</span>
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 font-mono text-[10px] font-bold">
                  SANDBOX ENFORCED
                </span>
              </div>
              <p className="text-xs text-slate-400">
                HTML5 Game Ingestion, Security Auditing & Live SDK Debugger
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
            {studioLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl border transition-all ${
                    isActive
                      ? 'bg-purple-950/70 border-purple-500/50 text-purple-200 font-bold shadow-sm'
                      : 'border-slate-800 bg-[#050811] text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <span>{link.icon}</span>
                  <span>{link.label}</span>
                </Link>
              );
            })}

            <Link
              href="/"
              className="flex items-center gap-1 px-3.5 py-2 rounded-xl border border-slate-800 bg-[#050811] text-cyan-400 hover:text-cyan-300 transition-colors ml-1 font-bold"
            >
              <span>←</span>
              <span>Player Arcade</span>
            </Link>
          </div>

        </div>
      </header>

      {/* 2. Studio Body */}
      <main className="flex-1 w-full max-w-7xl mx-auto space-y-6">
        {children}
      </main>

      {/* 3. Studio Minimal Footer */}
      <footer className="border-t border-slate-800/80 mt-12 py-6 text-center text-xs text-slate-500 font-mono">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 max-w-7xl mx-auto">
          <span>ArcadeHub Developer Platform • Protocol v1.0 Compliant</span>
          <span>Zip Slip & AST Security Scanner Active</span>
        </div>
      </footer>
    </div>
  );
}