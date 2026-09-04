'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { HybridIconRail } from './HybridIconRail';
import { HybridFloatingDock } from './HybridFloatingDock';
import { HybridNavDrawer } from './HybridNavDrawer';
import { MobileNavigation } from '../MobileNavigation';

export type NavVisualState = 'rail' | 'dock';

export function HybridNavigation() {
  const [navState, setNavState] = useState<NavVisualState>('rail');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const stateRef = useRef<NavVisualState>('rail');
  const isDrawerOpenRef = useRef<boolean>(false);
  isDrawerOpenRef.current = isDrawerOpen;

  const handleScrollRecalculate = useCallback(() => {
    const currentY = window.scrollY || window.pageYOffset;
    const currentState = stateRef.current;
    let nextState = currentState;

    // Proper hysteresis state machine:
    // When rail is active: only switch to dock after scrolling past 220px.
    // When dock is active: only return to rail after scrolling back above 120px.
    // 120px - 220px preserves the active state with zero flickering.
    if (currentState === 'rail' && currentY > 220) {
      nextState = 'dock';
    } else if (currentState === 'dock' && currentY < 120) {
      nextState = 'rail';
    }

    if (nextState !== currentState) {
      stateRef.current = nextState;
      setNavState(nextState);
    }
  }, []);

  useEffect(() => {
    let ticking = false;

    const onScroll = () => {
      // Pause transitions while drawer is open
      if (isDrawerOpenRef.current) return;

      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScrollRecalculate();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return () => window.removeEventListener('scroll', onScroll);
  }, [handleScrollRecalculate]);

  // Recalculate navigation state when drawer closes
  const handleCloseDrawer = useCallback(() => {
    setIsDrawerOpen(false);
    isDrawerOpenRef.current = false;
    setTimeout(() => {
      handleScrollRecalculate();
    }, 50);
  }, [handleScrollRecalculate]);

  return (
    <>
      {/* 1. Mobile & Tablet Navigation (< lg) */}
      <div className="block lg:hidden sticky top-0 z-40">
        <MobileNavigation />
      </div>

      {/* 2. Desktop Hybrid Navigation (>= lg) */}
      <div className="hidden lg:block">
        {/* State 1: Left Compact Icon Rail with Right-Expanding Hover Pills */}
        <HybridIconRail
          isDockActive={navState === 'dock'}
          isDrawerOpen={isDrawerOpen}
          onToggleDrawer={() => setIsDrawerOpen((prev) => !prev)}
        />

        {/* State 2: Centered Floating Top Command Dock (> 220px) */}
        <HybridFloatingDock isVisible={navState === 'dock'} />

        {/* Expandable Full Gaming Drawer (Zero Layout Shift Overlay) */}
        <HybridNavDrawer
          isOpen={isDrawerOpen}
          onClose={handleCloseDrawer}
        />
      </div>
    </>
  );
}