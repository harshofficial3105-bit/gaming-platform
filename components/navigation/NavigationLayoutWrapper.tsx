'use client';

import React from 'react';

/**
 * NavigationLayoutWrapper
 * Permanently reserves 272px on the right side for the Right Gaming HUD.
 * Never modifies padding, width, or margins on scroll, guaranteeing 100% Zero Content Layout Shift.
 */
export function NavigationLayoutWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:pl-8 lg:pr-[272px] flex flex-col flex-1 relative">
      {/* Subtle Right HUD Ambient Composition Overlay (Deliberate Safe Zone) */}
      <div
        aria-hidden="true"
        className="hidden lg:block absolute right-3 top-4 bottom-4 w-[248px] rounded-3xl border border-dashed border-indigo-300/20 dark:border-cyan-500/10 bg-gradient-to-b from-indigo-500/[0.02] via-transparent to-cyan-500/[0.02] pointer-events-none -z-10"
      >
        <div className="absolute inset-0 bg-[radial-gradient(#6366f110_1px,transparent_1px)] [background-size:20px_20px] rounded-3xl" />
      </div>

      {children}
    </div>
  );
}