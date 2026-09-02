'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { getActiveCreator, logoutCreator, CreatorUser } from '@/lib/creator/auth';

export default function CreatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [creator, setCreator] = useState<CreatorUser | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setCreator(getActiveCreator());

    const handleAuthChange = () => {
      setCreator(getActiveCreator());
    };

    window.addEventListener('arcadehub_creator_auth_changed', handleAuthChange);
    return () => window.removeEventListener('arcadehub_creator_auth_changed', handleAuthChange);
  }, []);

  const handleLogout = () => {
    logoutCreator();
    router.push('/creator/login');
  };

  const creatorLinks = [
    { label: 'Overview', href: '/creator/dashboard', icon: '📊' },
    { label: 'Upload Game', href: '/creator/submit', icon: '📦' },
    { label: 'SDK Sandbox', href: '/creator/preview', icon: '🧪' },
  ];

  return (
    <div className="min-h-screen bg-[#070B14] text-slate-100 flex flex-col font-sans -mx-2 sm:-mx-4 -my-4 px-4 sm:px-8 py-6">
      
      {/* Dynamic Creator Console Header */}
      <header className="rounded-2xl border border-slate-800 bg-[#0B1120] p-4 shadow-xl mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Brand & Studio Indicator */}
          <div className="flex items-center gap-3">
            <Link href="/creator" className="flex items-center gap-3 group cursor-pointer">
              <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-purple-950/60 border border-purple-500/30 text-purple-400 font-mono text-base font-bold group-hover:scale-105 transition-transform">
                ⚙️
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-base font-black font-mono text-white tracking-wider">
                    ARCADEHUB <span className="text-purple-400 font-normal">CREATOR CONSOLE</span>
                  </span>
                  {mounted && creator && (
                    <span className="px-2 py-0.5 rounded-full bg-purple-950/80 border border-purple-500/40 text-purple-300 font-mono text-[10px] font-bold">
                      🏢 {creator.studioName}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400">
                  HTML5 Game Ingestion, Security Auditing & Verified Telemetry
                </p>
              </div>
            </Link>
          </div>

          {/* Navigation Controls */}
          <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
            {mounted && creator ? (
              <>
                {creatorLinks.map((link) => {
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

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center gap-1 px-3 py-2 rounded-xl border border-slate-800 bg-[#050811] hover:border-rose-500/40 text-slate-400 hover:text-rose-300 transition-colors cursor-pointer"
                >
                  <span>🚪</span>
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/creator/login"
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-800 bg-[#050811] text-slate-300 hover:text-white hover:border-purple-500/40 transition-colors"
                >
                  <span>🔐</span>
                  <span>Sign In</span>
                </Link>

                <Link
                  href="/creator/signup"
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold transition-all shadow-md"
                >
                  <span>🚀</span>
                  <span>Become a Creator</span>
                </Link>
              </>
            )}

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

      {/* Studio Workspace Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto space-y-6">
        {children}
      </main>

      {/* Studio Footer */}
      <footer className="border-t border-slate-800/80 mt-12 py-6 text-center text-xs text-slate-500 font-mono">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 max-w-7xl mx-auto">
          <span>ArcadeHub Creator Platform • Protocol v1.0 Compliant</span>
          <span>Zip Slip & AST Security Scanner Enforced</span>
        </div>
      </footer>
    </div>
  );
}