import React from 'react';

/**
 * NavigationLayoutWrapper
 * Provides a permanently stable layout geometry for the main website content.
 * Does NOT animate or change padding on scroll, ensuring 100% zero layout shift.
 */
export function NavigationLayoutWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:pl-[272px] lg:pr-8 flex flex-col flex-1">
      {children}
    </div>
  );
}