'use client';

import React from 'react';
import { useNavigation, NavigationState } from './NavigationContext';
import { RightSidebarNavigation } from './RightSidebarNavigation';
import { CompactFloatingNavigation } from './CompactFloatingNavigation';
import { MobileNavigation } from './MobileNavigation';

export type { NavigationState };

export function ArcadeNavigation() {
  const { navState, isScrolled } = useNavigation();

  return (
    <>
      {/* 1. Mobile & Tablet Navigation (< lg) */}
      <div className="block lg:hidden sticky top-0 z-40">
        <MobileNavigation />
      </div>

      {/* 2. Desktop Navigation (>= lg) */}
      <div className="hidden lg:block">
        {/* State 1 & 2: Right Gaming HUD (Expanded w-[240px] / Collapsing Rail w-[64px]) */}
        <RightSidebarNavigation navState={navState} />

        {/* State 3: Floating Top Command Dock (Appears safely after scrolling past hero) */}
        <CompactFloatingNavigation isVisible={isScrolled} />
      </div>
    </>
  );
}