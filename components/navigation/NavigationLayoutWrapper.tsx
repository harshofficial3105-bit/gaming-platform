'use client';

import React from 'react';

/**
 * NavigationLayoutWrapper
 * Clean, naturally centered, responsive layout container.
 * Free of artificial right-padding or empty voids, allowing content to use
 * the available width symmetrically with 100% zero layout shift.
 */
export function NavigationLayoutWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col flex-1 relative">
      {children}
    </div>
  );
}