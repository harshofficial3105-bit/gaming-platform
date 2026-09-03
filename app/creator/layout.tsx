'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { getActiveCreator, logoutCreator, CreatorUser } from '@/lib/creator/auth';
import { NavigationSafeArea } from '@/components/navigation/NavigationSafeArea';
import {
  Cog,
  ShieldCheck,
  LayoutDashboard,
  UploadCloud,
  Code2,
  LogOut,
  LogIn,
  Rocket,
  ArrowLeft,
} from 'lucide-react';

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
    { label: 'Overview', href: '/creator/dashboard', icon: LayoutDashboard },
    { label: 'Upload Game', href: '/creator/submit', icon: UploadCloud },
    { label: 'SDK Sandbox', href: '/creator/preview', icon: Code2 },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070B14] text-slate-900 dark:text-slate-100 flex flex-col font-sans -mx-2 sm:-mx-4 -my-4 px-4 sm:px-8 py-6 transition-colors duration-200">
      
      {/* Dynamic Creator Console Header with Navigation Safe Area */}
      <NavigationSafeArea>
        <header className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-[#0B1120]/95 backdrop-blur-xl p-4 shadow-xl mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Brand & Studio Indicator */}
            <div className="flex items-center gap-3">
              <Link href="/creator" className="flex items-center gap-3 group cursor-pointer">
                <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-purple-100 dark:bg-purple-950/60 border border-purple-300 dark:border-purple-500/30 text-purple-600 dark:text-purple-400 font-mono text-base font-bold group-hover:scale-105 transition-transform">
                  <Cog className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-black font-mono text-slate-900 dark:text-white tracking-wider">
                      ARCADEHUB <span className="text-purple-600 dark:text-purple-400 font-normal">CREATOR CONSOLE</span>
                    </span>
                    {mounted && creator && (
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/80 border border-purple-300 dark:border-purple-500/40 text-purple-700 dark:text-purple-300 font-mono text-[10px] font-bold">
                        <ShieldCheck className="h-3 w-3" />
                        <span>{creator.studioName}</span>
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    HTML5 Game Ingestion, Security Auditing &amp; Verified Telemetry
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
                    const IconComp = link.icon;
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl border transition-all ${
                          isActive
                            ? 'bg-purple-100 dark:bg-purple-950/70 border-purple-400 dark:border-purple-500/50 text-purple-800 dark:text-purple-200 font-bold shadow-sm'
                            : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#050811] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-slate-700'
                        }`}
                      >
                        <IconComp className="h-3.5 w-3.5" />
                        <span>{link.label}</span>
                      </Link>
                    );
                  })}

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#050811] hover:border-rose-400 text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-300 transition-colors cursor-pointer"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/creator/login"
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-[#050811] text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:border-purple-400 transition-colors"
                  >
                    <LogIn className="h-3.5 w-3.5" />
                    <span>Sign In</span>
                  </Link>

                  <Link
                    href="/creator/signup"
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold transition-all shadow-md active:scale-95"
                  >
                    <Rocket className="h-3.5 w-3.5" />
                    <span>Become a Creator</span>
                  </Link>
                </>
              )}

              <Link
                href="/"
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-[#050811] text-cyan-600 dark:text-cyan-400 hover:text-cyan-500 transition-colors ml-1 font-bold"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Player Arcade</span>
              </Link>
            </div>

          </div>
        </header>
      </NavigationSafeArea>

      {/* Studio Workspace Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto space-y-6">
        {children}
      </main>

      {/* Studio Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800/80 mt-12 py-6 text-center text-xs text-slate-500 font-mono">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 max-w-7xl mx-auto">
          <span>ArcadeHub Creator Platform • Protocol v1.0 Compliant</span>
          <span>Zip Slip &amp; AST Security Scanner Enforced</span>
        </div>
      </footer>
    </div>
  );
}