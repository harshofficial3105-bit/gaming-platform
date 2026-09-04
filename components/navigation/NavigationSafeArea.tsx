'use client';

import React from 'react';
import { useNavigation } from './NavigationContext';
import { ACTIVE_NAV_MODE } from '@/lib/config/navigationMode';

interface NavigationSafeAreaProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * NavigationSafeArea
 * In previous_hud mode:
 * - Reserves right-side clearance for the 240px Right HUD so Discovery Modes are not covered.
 *
 * In hybrid_experimental mode:
 * - Navigation is on the LEFT (64px rail), so NO right-side space is reserved.
 * - Content spans full width naturally, completely eliminating the empty right-side void.
 */
export function NavigationSafeArea({ children, className = '' }: NavigationSafeAreaProps) {
  const { navState } = useNavigation();

  // In hybrid mode, navigation is on the left, so content uses full width with zero right padding
  if (ACTIVE_NAV_MODE === 'hybrid_experimental') {
    return <div className={`w-full ${className}`}>{children}</div>;
  }

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