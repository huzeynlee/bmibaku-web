'use client';

import { animate, useInView, useReducedMotion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import type { Locale } from '@/i18n/config';
import { formatNumber } from '@/utils/currency';

interface CountUpProps {
  value: number;
  locale: Locale;
  duration?: number;
  className?: string;
}

/** Counts up once when visible. Server and reduced-motion render the final value. */
export function CountUp({ value, locale, duration = 1.4, className }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -15% 0px' });
  const reduce = useReducedMotion();
  const [shown, setShown] = useState(value);
  const started = useRef(false);

  useEffect(() => {
    if (!inView || reduce || started.current) return;
    started.current = true;
    setShown(0);
    const controls = animate(0, value, { duration, ease: [0.16, 1, 0.3, 1], onUpdate: (v) => setShown(Math.round(v)) });
    return () => controls.stop();
  }, [inView, reduce, value, duration]);

  return (
    <span ref={ref} className={className}>
      <span aria-hidden="true">{formatNumber(shown, locale)}</span>
      <span className="sr-only">{formatNumber(value, locale)}</span>
    </span>
  );
}
