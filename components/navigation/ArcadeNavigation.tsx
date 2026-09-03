'use client';

import React, { useState, useEffect, useRef } from 'react';
import { LeftSidebarNavigation } from './LeftSidebarNavigation';
import { CompactFloatingNavigation } from './CompactFloatingNavigation';
import { MobileNavigation } from './MobileNavigation';

export type NavigationState = 'expanded' | 'collapsing' | 'floating';

export function ArcadeNavigation() {
  const [navState, setNavState] = useState<NavigationState>('expanded');
  const [mounted, setMounted] = useState(false);
  const stateRef = useRef<NavigationState>('expanded');

  useEffect(() => {
    setMounted(true);

    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentY = window.scrollY || window.pageYOffset;
          const currentState = stateRef.current;
          let nextState: NavigationState = currentState;

          if (currentY < 70) {
            nextState = 'expanded';
          } else if (currentY >= 70 && currentY <= 150) {
            nextState = 'collapsing';
          } else if (currentY > 150) {
            nextState = 'floating';
          }

          if (nextState !== currentState) {
            stateRef.current = nextState;
            setNavState(nextState);
          }

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      {/* 1. Mobile & Tablet Navigation (< lg) */}
      <div className="block lg:hidden sticky top-0 z-40">
        <MobileNavigation />
      </div>

      {/* 2. Desktop Navigation (>= lg) */}
      <div className="hidden lg:block">
        {/* State 1 & 2: Left Sidebar (Expanded / Collapsing Rail) */}
        <LeftSidebarNavigation navState={navState} />

        {/* State 3: Floating Top Command Dock */}
        <CompactFloatingNavigation isVisible={navState === 'floating'} />
      </div>
    </>
  );
}