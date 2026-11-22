'use client';

import { MotionConfig } from 'motion/react';
import { useEffect, type ReactNode } from 'react';

/** Global motion defaults: 240ms ease-out, and no motion for users who ask for less. */
export function MotionProvider({ children }: { children: ReactNode }) {
  // Tells the CSS failsafe (globals.css → [data-reveal]) that JavaScript runs,
  // so scroll reveals are left to Motion. Without it, hidden content shows after 5 s.
  useEffect(() => {
    document.documentElement.dataset.motion = 'ready';
  }, []);

  return (
    <MotionConfig reducedMotion="user" transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}>
      {children}
    </MotionConfig>
  );
}

export const EASE_OUT = [0.16, 1, 0.3, 1] as const;
