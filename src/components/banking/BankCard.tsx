'use client';

import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring, useTransform } from 'motion/react';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { cx } from '@/utils/cx';

interface BankCardProps {
  label: string;
  /** Interactive tilt and entrance (hero). Flat cards are static. */
  interactive?: boolean;
  className?: string;
  delay?: number;
}

/**
 * MİLLİ KART illustration in CSS/SVG (ISO ID-1 proportions). Fictional: no real
 * number, cardholder or payment-network mark. Desktop: tilts toward the pointer;
 * touch devices: one entrance and a slow float. Reduced motion: static.
 */
export function BankCard({ label, interactive = false, className, delay = 0.5 }: BankCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [finePointer, setFinePointer] = useState(false);
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const rx = useSpring(useTransform(py, [0, 1], [12, -12]), { stiffness: 160, damping: 18 });
  const ry = useSpring(useTransform(px, [0, 1], [-16, 16]), { stiffness: 160, damping: 18 });
  const glareX = useTransform(px, [0, 1], ['0%', '100%']);
  const glareY = useTransform(py, [0, 1], ['0%', '100%']);
  const glare = useMotionTemplate`radial-gradient(circle at ${glareX} ${glareY}, rgb(255 255 255 / 0.22), transparent 55%)`;

  useEffect(() => setFinePointer(window.matchMedia('(hover: hover) and (pointer: fine)').matches), []);

  const tilt = interactive && finePointer && !reduce;
  const onMove = (e: React.PointerEvent) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
  };
  const onLeave = () => {
    px.set(0.5);
    py.set(0.5);
  };

  return (
    <div
      ref={ref}
      role="img"
      aria-label={label}
      className={cx('[perspective:1200px]', className)}
      style={{ containerType: 'inline-size' } as CSSProperties}
      onPointerMove={tilt ? onMove : undefined}
      onPointerLeave={tilt ? onLeave : undefined}
    >
      <motion.div
        data-reveal=""
        initial={interactive ? { opacity: 0, rotateX: 28, rotateY: -22, y: 40, z: -120 } : false}
        animate={
          interactive
            ? { opacity: 1, rotateX: 8, rotateY: -14, y: finePointer || reduce ? 0 : [0, -6, 0], z: 0 }
            : undefined
        }
        transition={
          interactive
            ? { duration: 1.1, delay, ease: [0.16, 1, 0.3, 1], y: finePointer || reduce ? { duration: 1.1, delay } : { duration: 6, repeat: Infinity, ease: 'easeInOut', delay: delay + 1.1 } }
            : undefined
        }
        style={{ transformStyle: 'preserve-3d' }}
        className="relative"
      >
       <motion.div style={{ transformStyle: 'preserve-3d', ...(tilt ? { rotateX: rx, rotateY: ry } : {}) }}>
        <div
          className="relative aspect-[85.6/53.98] w-full overflow-hidden rounded-[4.2cqw] text-white shadow-[0_40px_70px_-30px_rgb(7_22_41/0.7),0_16px_30px_-16px_rgb(7_22_41/0.5)]"
          style={{ background: 'linear-gradient(135deg, #1D3A63 0%, #0B1F3A 46%, #071629 100%)' }}
        >
          {/* Brushed-metal texture and engraved rings */}
          <div aria-hidden="true" className="absolute inset-0 opacity-[0.07] [background-image:repeating-linear-gradient(115deg,#fff_0_1px,transparent_1px_4px)]" />
          <div aria-hidden="true" className="absolute -end-[18%] -top-[42%] aspect-square w-[70%] rounded-full border border-gold-400/25" />
          <div aria-hidden="true" className="absolute -end-[8%] -top-[30%] aspect-square w-[52%] rounded-full border border-gold-400/10" />
          <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(112deg,rgb(255_255_255/0.16)_0%,rgb(255_255_255/0.04)_28%,transparent_46%)]" />
          {tilt && <motion.div aria-hidden="true" className="absolute inset-0 mix-blend-soft-light" style={{ background: glare }} />}
          <div aria-hidden="true" className="absolute inset-0 rounded-[inherit] ring-1 ring-inset ring-white/10" />

          <div dir="ltr" className="relative flex h-full flex-col justify-between p-[7cqw]" style={{ transform: 'translateZ(30px)' }}>
            <div className="flex items-start justify-between">
              <span translate="no" className="text-[5.4cqw] font-extrabold leading-none tracking-[0.22em]">
                MİLLİ KART
              </span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/brand/bmi-emblem.png" width={128} height={128} alt="" decoding="async" className="-mt-[1.5cqw] w-[10cqw]" />
            </div>
            <svg viewBox="0 0 48 36" className="w-[13cqw] drop-shadow-[0_2px_3px_rgb(0_0_0/0.35)]" aria-hidden="true">
              <defs>
                <linearGradient id="chip-gold" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#F2DC8A" />
                  <stop offset="0.45" stopColor="#D4AF37" />
                  <stop offset="1" stopColor="#8E6D17" />
                </linearGradient>
              </defs>
              <rect x="0.5" y="0.5" width="47" height="35" rx="6" fill="url(#chip-gold)" stroke="#7A5C0E" strokeOpacity="0.5" />
              <path d="M16 1v34M32 1v34M1 12h15M32 12h15M1 24h15M32 24h15M16 18h16" stroke="#7A5C0E" strokeOpacity="0.55" fill="none" />
            </svg>
            <div>
              <p className="font-mono text-[5cqw] leading-none tracking-[0.16em] text-white/85">•••• •••• •••• ••••</p>
              <p className="mt-[3cqw] text-[2.8cqw] font-semibold uppercase leading-none tracking-[0.2em] text-white/60">Bank Melli İran · Bakı</p>
            </div>
          </div>
        </div>
       </motion.div>
        {/* Soft floor shadow that grounds the card */}
        <div aria-hidden="true" className="absolute inset-x-[10%] -bottom-[9%] -z-10 h-[14%] rounded-[50%] bg-navy-950/25 blur-xl" />
      </motion.div>
    </div>
  );
}
