'use client';

import { useReducedMotion, useSpring } from 'motion/react';
import { useEffect, useState } from 'react';

/** Smoothly tweens between values (calculator results). The final value is announced, not every frame. */
export function AnimatedNumber({ value, format, className }: { value: number; format: (n: number) => string; className?: string }) {
  const reduce = useReducedMotion();
  const spring = useSpring(value, { stiffness: 140, damping: 24, mass: 0.6 });
  const [shown, setShown] = useState(value);

  useEffect(() => {
    if (reduce) {
      setShown(value);
      return;
    }
    spring.set(value);
  }, [value, reduce, spring]);

  useEffect(() => spring.on('change', (v) => setShown(v)), [spring]);

  return (
    <span className={className}>
      <span aria-hidden="true">{format(reduce ? value : shown)}</span>
      <span className="sr-only" aria-live="polite">
        {format(value)}
      </span>
    </span>
  );
}
