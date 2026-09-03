'use client';

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

export type NavigationState = 'expanded' | 'collapsing' | 'floating';

interface NavigationContextType {
  navState: NavigationState;
  isScrolled: boolean;
}

const NavigationContext = createContext<NavigationContextType>({
  navState: 'expanded',
  isScrolled: false,
});

export function NavigationProvider({ children }: { children: React.ReactNode }) {
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

          // Hysteresis logic preventing flickering:
          // Downward: 0-90 expanded -> 90-190 collapsing -> >190 floating
          // Upward: <170 returns to collapsing -> <70 returns to expanded
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
    <NavigationContext.Provider value={{ navState, isScrolled: navState === 'floating' }}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  return useContext(NavigationContext);
}