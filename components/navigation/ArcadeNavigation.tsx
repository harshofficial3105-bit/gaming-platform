'use client';

import React, { useState, useEffect, useRef } from 'react';
import { RightSidebarNavigation } from './RightSidebarNavigation';
import { CompactFloatingNavigation } from './CompactFloatingNavigation';
import { MobileNavigation } from './MobileNavigation';

export type NavigationState = 'expanded' | 'collapsing' | 'floating';

export function ArcadeNavigation() {
  const [navState, setNavState] = useState<NavigationState>('expanded');
  const stateRef = useRef<NavigationState>('expanded');

  useEffect(() => {
    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentY = window.scrollY || window.pageYOffset;
          const currentState = stateRef.current;
          let nextState: NavigationState = currentState;

          // Hysteresis logic preventing flickering and overlap:
          // Downward: 0-90 expanded -> 90-190 collapsing -> >190 floating
          // Upward: <170 drops out of floating into collapsing -> <70 returns to expanded
          if (currentState === 'expanded') {
            if (currentY >= 90 && currentY <= 190) {
              nextState = 'collapsing';
            } else if (currentY > 190) {
              nextState = 'floating';
            }
          } else if (currentState === 'collapsing') {
            if (currentY < 70) {
              nextState = 'expanded';
            } else if (currentY > 190) {
              nextState = 'floating';
            }
          } else if (currentState === 'floating') {
            if (currentY < 70) {
              nextState = 'expanded';
            } else if (currentY < 170) {
              nextState = 'collapsing';
            }
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
        {/* State 1 & 2: Right Gaming HUD (Expanded w-[240px] / Collapsing Rail w-[64px]) */}
        <RightSidebarNavigation navState={navState} />

        {/* State 3: Floating Top Command Dock (Appears safely after scrolling past hero) */}
        <CompactFloatingNavigation isVisible={navState === 'floating'} />
      </div>
    </>
  );
}