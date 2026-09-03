'use client';

import React, { useState, useEffect, useRef } from 'react';
import { LeftSidebarNavigation } from './LeftSidebarNavigation';
import { CompactFloatingNavigation } from './CompactFloatingNavigation';
import { MobileNavigation } from './MobileNavigation';

export function ArcadeNavigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const isScrolledRef = useRef(false);

  useEffect(() => {
    setMounted(true);

    let ticking = false;
    const EXPAND_THRESHOLD = 70;
    const COMPACT_THRESHOLD = 140;

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentY = window.scrollY || window.pageYOffset;

          if (!isScrolledRef.current && currentY > COMPACT_THRESHOLD) {
            isScrolledRef.current = true;
            setIsScrolled(true);
            window.dispatchEvent(
              new CustomEvent('arcadehub:nav-transform', { detail: { isScrolled: true } })
            );
          } else if (isScrolledRef.current && currentY < EXPAND_THRESHOLD) {
            isScrolledRef.current = false;
            setIsScrolled(false);
            window.dispatchEvent(
              new CustomEvent('arcadehub:nav-transform', { detail: { isScrolled: false } })
            );
          }

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    // Run initial check
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
        {/* State 1: Before Scroll - Unique Left Sidebar Console */}
        <LeftSidebarNavigation isVisible={!isScrolled} />

        {/* State 2: After Scroll - Floating Compact Horizontal Navigation */}
        <CompactFloatingNavigation isVisible={isScrolled} />
      </div>
    </>
  );
}