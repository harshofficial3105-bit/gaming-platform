'use client';

import React, { useState, useEffect } from 'react';

/**
 * NavigationLayoutWrapper
 * Fixes the after-scrolling layout issue:
 * 1. On widescreen displays (>= 1536px / 1920px), the content is centered at max-w-[1360px] mx-auto.
 *    The 248px Left Sidebar sits inside the 280px left margin with zero collision.
 *    When scrolled, the content remains in the exact same centered position directly beneath the floating dock.
 * 2. On standard laptop displays (1024px to 1535px), content smoothly transitions from lg:pl-[264px]
 *    to lg:pl-0 upon scrolling, eliminating the empty black void on the left and centering under the dock.
 */
export function NavigationLayoutWrapper({ children }: { children: React.ReactNode }) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY || window.pageYOffset;
          if (scrollY > 120) {
            setIsScrolled(true);
          } else if (scrollY < 60) {
            setIsScrolled(false);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className={`w-full max-w-[1360px] mx-auto px-4 sm:px-6 flex flex-col flex-1 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        isScrolled
          ? 'lg:pl-0 lg:pr-0'
          : '2xl:pl-0 lg:pl-[264px] lg:pr-6'
      }`}
    >
      {children}
    </div>
  );
}