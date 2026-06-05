'use client';

import { useState, useEffect } from 'react';

export interface UseFloatingWidgetReturn {
  showFloatingWidget: boolean;
  setShowFloatingWidget: (show: boolean) => void;
  isDesktop: boolean;
}

export function useFloatingWidget(): UseFloatingWidgetReturn {
  const [showFloatingWidget, setShowFloatingWidget] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  // Detect desktop vs mobile
  useEffect(() => {
    const checkDesktop = () => {
      // md breakpoint in Tailwind is 768px
      setIsDesktop(window.innerWidth >= 768);
    };

    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  // Detect tab visibility change
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && isDesktop) {
        setShowFloatingWidget(true);
      } else {
        setShowFloatingWidget(false);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isDesktop]);

  return {
    showFloatingWidget,
    setShowFloatingWidget,
    isDesktop,
  };
}
