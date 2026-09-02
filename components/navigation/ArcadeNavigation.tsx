'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ExpandedNavigation } from './ExpandedNavigation';
import { CompactNavigation } from './CompactNavigation';
import { MobileNavigation } from './MobileNavigation';

export function ArcadeNavigation() {
  const [isCompact, setIsCompact] = useState(false);
  const [mounted, setMounted] = useState(false);
  const isCompactRef = useRef(false);

  useEffect(() => {
    setMounted(true);

    let ticking = false;
    const EXPAND_THRESHOLD = 70;
    const COMPACT_THRESHOLD = 140;

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentY = window.scrollY || window.pageYOffset;

          if (!isCompactRef.current && currentY > COMPACT_THRESHOLD) {
            isCompactRef.current = true;
            setIsCompact(true);
          } else if (isCompactRef.current && currentY < EXPAND_THRESHOLD) {
            isCompactRef.current = false;
            setIsCompact(false);
          }

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    // Initial check
    onScroll();

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      {/* Mobile Navigation Header (< lg) */}
      <div className="block lg:hidden sticky top-0 z-40">
        <MobileNavigation />
      </div>

      {/* Desktop Transforming Header (>= lg) */}
      <div className="hidden lg:block">
        {/* Expanded Navigation (Top of page) */}
        <div
          className={`w-full transition-all duration-300 ease-out ${
            isCompact
              ? 'opacity-0 -translate-y-full pointer-events-none absolute top-0 left-0 right-0'
              : 'opacity-100 translate-y-0 relative z-40'
          }`}
        >
          <ExpandedNavigation />
        </div>

        {/* Compact Floating Gaming Command Dock (After scroll) */}
        <div
          className={`fixed top-3 left-0 right-0 z-50 transition-all duration-300 ease-out flex justify-center pointer-events-none ${
            isCompact
              ? 'opacity-100 translate-y-0 scale-100'
              : 'opacity-0 -translate-y-6 scale-95 pointer-events-none'
          }`}
        >
          <div className="pointer-events-auto">
            <CompactNavigation />
          </div>
        </div>
      </div>
    </>
  );
}