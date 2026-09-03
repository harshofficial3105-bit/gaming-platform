'use client';

import React, { useState, useEffect } from 'react';

export function NavigationLayoutWrapper({ children }: { children: React.ReactNode }) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    // Initial check
    const currentY = window.scrollY || window.pageYOffset;
    if (currentY > 140) {
      setIsScrolled(true);
    }

    const handleNavTransform = (e: Event) => {
      const customEvent = e as CustomEvent<{ isScrolled: boolean }>;
      if (customEvent.detail) {
        setIsScrolled(customEvent.detail.isScrolled);
      }
    };

    window.addEventListener('arcadehub:nav-transform', handleNavTransform);
    return () => window.removeEventListener('arcadehub:nav-transform', handleNavTransform);
  }, []);

  return (
    <div
      className={`transition-all duration-500 ease-out w-full flex flex-col flex-1 ${
        isScrolled ? 'lg:pl-0' : 'lg:pl-76'
      }`}
    >
      {children}
    </div>
  );
}