'use client';

import React, { useState } from 'react';
import { CompactIconRail } from './CompactIconRail';
import { ExpandableNavDrawer } from './ExpandableNavDrawer';
import { MobileNavigation } from '../MobileNavigation';

export function CrazyGamesNav() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <>
      {/* 1. Mobile & Tablet Navigation (< lg) */}
      <div className="block lg:hidden sticky top-0 z-40">
        <MobileNavigation />
      </div>

      {/* 2. Desktop Navigation (>= lg) */}
      <div className="hidden lg:block">
        {/* Default State: Compact 64px Vertical Rail */}
        <CompactIconRail
          isDrawerOpen={isDrawerOpen}
          onToggleDrawer={() => setIsDrawerOpen((prev) => !prev)}
        />

        {/* Expanded State: 280px Overlay Drawer (Zero Layout Shift) */}
        <ExpandableNavDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
        />
      </div>
    </>
  );
}