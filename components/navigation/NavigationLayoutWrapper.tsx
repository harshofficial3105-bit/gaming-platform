'use client';

import React from 'react';
import { ACTIVE_NAV_MODE } from '@/lib/config/navigationMode';

/**
 * NavigationLayoutWrapper
 * Provides safe margin padding for the navigation while keeping the main content
 * responsive and centered.
 *
 * In hybrid_experimental mode:
 * - Permanent lg:pl-20 safe area for the 64px left rail.
 * - Entire right side remains wide open (Quick Fun and Relax & Chill never covered).
 * - Zero content reflow when the 300px drawer opens as an overlay.
 *
 * In previous_hud mode:
 * - Centered max-w-[1536px] container.
 */
export function NavigationLayoutWrapper({ children }: { children: React.ReactNode }) {
  if (ACTIVE_NAV_MODE === 'hybrid_experimental') {
    return (
      <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:pl-20 lg:pr-8 flex flex-col flex-1 relative">
        {children}
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col flex-1 relative">
      {children}
    </div>
  );
}