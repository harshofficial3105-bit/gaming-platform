'use client';

import React from 'react';
import { useNavigation } from './NavigationContext';

interface NavigationSafeAreaProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * NavigationSafeArea
 * Intelligently reserves right-side clearance ONLY for sections that reach the right edge
 * when the Right HUD or Rail is present. Smoothly expands as the user scrolls,
 * preventing any content overlap on Discovery Modes and Hero sections.
 */
export function NavigationSafeArea({ children, className = '' }: NavigationSafeAreaProps) {
  const { navState } = useNavigation();

  const safePaddingClass =
    navState === 'expanded'
      ? 'lg:pr-[280px]'
      : navState === 'collapsing'
      ? 'lg:pr-[96px]'
      : 'lg:pr-0';

  return (
    <div
      className={`w-full transition-[padding] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${safePaddingClass} ${className}`}
    >
      {children}
    </div>
  );
}