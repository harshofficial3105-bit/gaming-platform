'use client';

import React from 'react';
import { ACTIVE_NAV_MODE } from '@/lib/config/navigationMode';
import { CrazyGamesNav } from './crazygames/CrazyGamesNav';
import { useNavigation, NavigationState } from './NavigationContext';
import { RightSidebarNavigation } from './RightSidebarNavigation';
import { CompactFloatingNavigation } from './CompactFloatingNavigation';
import { MobileNavigation } from './MobileNavigation';

export type { NavigationState };

export function ArcadeNavigation() {
  const { navState, isScrolled } = useNavigation();

  // 1. Experimental Mode: CrazyGames-Style Compact Rail + Expandable Overlay Drawer
  if (ACTIVE_NAV_MODE === 'crazygames') {
    return <CrazyGamesNav />;
  }

  // 2. Previous Mode: Right HUD -> Compact Rail -> Floating Top Command Dock
  return (
    <>
      {/* Mobile Navigation (< lg) */}
      <div className="block lg:hidden sticky top-0 z-40">
        <MobileNavigation />
      </div>

      {/* Desktop Navigation (>= lg) */}
      <div className="hidden lg:block">
        <RightSidebarNavigation navState={navState} />
        <CompactFloatingNavigation isVisible={isScrolled} />
      </div>
    </>
  );
}