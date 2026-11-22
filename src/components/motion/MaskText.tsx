'use client';

import type { CSSProperties } from 'react';
import { motion } from 'motion/react';
import { EASE_OUT } from './MotionProvider';

interface MaskTextProps {
  lines: string[];
  className?: string;
  lineClassName?: string;
  delay?: number;
  as?: 'h1' | 'h2' | 'p';
  id?: string;
  /** Animate on mount (hero) instead of on scroll. */
  immediate?: boolean;
}

const STAGGER = 0.11;

/** Line-by-line masked reveal: each line slides up from behind its own clip. */
export function MaskText({ lines, className, lineClassName, delay = 0, as = 'h2', id, immediate }: MaskTextProps) {
  if (immediate) {
    // Above the fold: a CSS animation (globals.css → .mask-line) starts with the first paint,
    // so the headline does not wait for JavaScript to load (Largest Contentful Paint).
    const Tag = as;
    return (
      <Tag id={id} className={className}>
        {lines.map((line, i) => (
          <span key={i} className="block overflow-hidden pb-[0.08em]">
            <span className={`mask-line block ${lineClassName ?? ''}`} style={{ animationDelay: `${delay + i * STAGGER}s` } as CSSProperties}>
              {line}
            </span>
          </span>
        ))}
      </Tag>
    );
  }

  const Comp = motion[as];
  return (
    <Comp
      id={id}
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: STAGGER, delayChildren: delay } } }}
    >
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden pb-[0.08em]">
          <motion.span
            data-reveal=""
            className={`block ${lineClassName ?? ''}`}
            variants={{ hidden: { y: '105%' }, show: { y: '0%' } }}
            transition={{ duration: 0.8, ease: EASE_OUT }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </Comp>
  );
}
