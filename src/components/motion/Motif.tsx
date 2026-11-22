'use client';

import { motion } from 'motion/react';
import { EASE_OUT } from './MotionProvider';

export type MotifKind = 'colonnade' | 'grid' | 'cards' | 'building' | 'frames' | 'compass' | 'chart';

/**
 * Original architectural line drawings for page heroes. Lines draw in once;
 * decorative only (aria-hidden). Stroke colors come from currentColor.
 */
const PATHS: Record<MotifKind, string[]> = {
  // Pediment, entablature and six columns: institutional pages.
  colonnade: [
    'M40 150 L300 70 L560 150',
    'M40 165 H560',
    'M60 180 H540',
    'M90 180 V420 M150 180 V420 M210 180 V420 M390 180 V420 M450 180 V420 M510 180 V420',
    'M70 420 H530 M50 440 H550',
    'M270 420 V250 Q300 205 330 250 V420',
  ],
  // Analytical grid with a measured rise: corporate banking.
  grid: [
    'M40 420 H560 M40 340 H560 M40 260 H560 M40 180 H560 M40 100 H560',
    'M120 60 V440 M240 60 V440 M360 60 V440 M480 60 V440',
    'M40 380 L160 330 L260 350 L360 250 L460 270 L560 150',
  ],
  // Stacked card outlines: individual banking.
  cards: [
    'M140 140 h260 a18 18 0 0 1 18 18 v150 a18 18 0 0 1 -18 18 h-260 a18 18 0 0 1 -18 -18 v-150 a18 18 0 0 1 18 -18 z',
    'M200 200 h260 a18 18 0 0 1 18 18 v150 a18 18 0 0 1 -18 18 h-260 a18 18 0 0 1 -18 -18 v-150 a18 18 0 0 1 18 -18 z',
    'M220 250 h44 v32 h-44 z',
    'M220 330 H420',
  ],
  // Facade with windows: property sales.
  building: [
    'M140 430 V150 L300 80 L460 150 V430 Z',
    'M190 190 h50 v50 h-50 z M275 190 h50 v50 h-50 z M360 190 h50 v50 h-50 z',
    'M190 280 h50 v50 h-50 z M275 280 h50 v50 h-50 z M360 280 h50 v50 h-50 z',
    'M270 430 V365 h60 V430 M100 430 H500',
  ],
  // Offset frames: gallery.
  frames: ['M120 110 H380 V330 H120 Z', 'M220 170 H480 V390 H220 Z', 'M150 300 L230 230 L300 290 L340 255 L380 300'],
  // Compass rose: contact.
  compass: ['M300 80 A170 170 0 1 1 299.9 80', 'M300 120 L330 250 L300 420 L270 250 Z', 'M130 250 H470', 'M300 250 m-8 0 a8 8 0 1 0 16 0 a8 8 0 1 0 -16 0'],
  // Axis and trend: tools.
  chart: ['M80 80 V420 H540', 'M80 360 L180 320 L260 340 L340 240 L420 260 L520 150', 'M520 150 m-6 0 a6 6 0 1 0 12 0 a6 6 0 1 0 -12 0'],
};

export function Motif({ kind, className, delay = 0.2 }: { kind: MotifKind; className?: string; delay?: number }) {
  return (
    <svg viewBox="0 0 600 500" fill="none" aria-hidden="true" className={className}>
      {PATHS[kind].map((d, i) => (
        <motion.path
          key={i}
          d={d}
          stroke="currentColor"
          strokeWidth={i === PATHS[kind].length - 1 && (kind === 'grid' || kind === 'chart') ? 2 : 1}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.6, delay: delay + i * 0.14, ease: EASE_OUT }}
        />
      ))}
    </svg>
  );
}

/** A thin gold rule that draws from the start edge. */
export function GoldRule({ className, delay = 0 }: { className?: string; delay?: number }) {
  return (
    <motion.span
      aria-hidden="true"
      className={`block h-px origin-left bg-gold-500 rtl:origin-right ${className ?? ''}`}
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.9, delay, ease: EASE_OUT }}
    />
  );
}
