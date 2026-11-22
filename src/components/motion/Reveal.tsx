'use client';

import { motion, type Variants } from 'motion/react';
import type { ReactNode } from 'react';
import { EASE_OUT } from './MotionProvider';

export type RevealVariant = 'rise' | 'fade' | 'mask' | 'scale' | 'slide';

const VARIANTS: Record<RevealVariant, Variants> = {
  rise: { hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0 } },
  fade: { hidden: { opacity: 0 }, show: { opacity: 1 } },
  // Clip from the bottom edge: used for images and large panels.
  mask: { hidden: { clipPath: 'inset(0 0 100% 0)' }, show: { clipPath: 'inset(0 0 0% 0)' } },
  scale: { hidden: { opacity: 0, scale: 0.96 }, show: { opacity: 1, scale: 1 } },
  slide: { hidden: { opacity: 0, x: -16 }, show: { opacity: 1, x: 0 } },
};

interface RevealProps {
  children: ReactNode;
  variant?: RevealVariant;
  delay?: number;
  duration?: number;
  className?: string;
  as?: 'div' | 'section' | 'li' | 'article' | 'span';
}

/**
 * Animates once when scrolled into view. Content is always in the DOM;
 * a <noscript> rule in the layout keeps it visible without JavaScript.
 */
export function Reveal({ children, variant = 'rise', delay = 0, duration = 0.6, className, as = 'div' }: RevealProps) {
  const Comp = motion[as];
  return (
    <Comp
      data-reveal=""
      className={className}
      variants={VARIANTS[variant]}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ duration, delay, ease: EASE_OUT }}
    >
      {children}
    </Comp>
  );
}

/** Staggers direct children that use <StaggerItem>. */
export function Stagger({ children, className, gap = 0.07, as = 'div' }: { children: ReactNode; className?: string; gap?: number; as?: 'div' | 'ul' | 'ol' | 'dl' }) {
  const Comp = motion[as];
  return (
    <Comp
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: gap } } }}
    >
      {children}
    </Comp>
  );
}

export function StaggerItem({ children, className, as = 'div' }: { children: ReactNode; className?: string; as?: 'div' | 'li' | 'article' }) {
  const Comp = motion[as];
  return (
    <Comp data-reveal="" className={className} variants={VARIANTS.rise} transition={{ duration: 0.55, ease: EASE_OUT }}>
      {children}
    </Comp>
  );
}
