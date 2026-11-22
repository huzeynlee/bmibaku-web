import type { CSSProperties } from 'react';
import { cx } from '../../utils/cx';

interface BankCardProps {
  label: string;
  /** Flat cards skip the 3D tilt (used in dense layouts). */
  flat?: boolean;
  className?: string;
}

/**
 * MİLLİ KART card drawn in CSS/SVG. ISO ID-1 proportions (85.6 × 53.98 mm).
 * Carries the official BMI emblem; no real card number, cardholder or payment-network mark.
 * Type scales with the card through container query units.
 */
export function BankCard({ label, flat, className }: BankCardProps) {
  return (
    <div
      role="img"
      aria-label={label}
      className={cx('card-scene', flat && 'card-flat', className)}
      style={{ containerType: 'inline-size' } as CSSProperties}
    >
      <div
        className="card-3d relative aspect-[85.6/53.98] w-full overflow-hidden rounded-[4.2cqw] text-white shadow-[0_32px_60px_-24px_rgb(7_22_41/0.6),0_14px_28px_-14px_rgb(7_22_41/0.45)]"
        style={{ background: 'linear-gradient(135deg, #1D3A63 0%, #0B1F3A 46%, #071629 100%)' }}
      >
        {/* Surface reflection and engraved rings */}
        <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(112deg,rgb(255_255_255/0.18)_0%,rgb(255_255_255/0.05)_28%,transparent_46%)]" />
        <div aria-hidden="true" className="absolute -end-[18%] -top-[42%] aspect-square w-[70%] rounded-full border border-gold-400/20" />
        <div aria-hidden="true" className="absolute -end-[8%] -top-[30%] aspect-square w-[52%] rounded-full border border-gold-400/10" />
        <div aria-hidden="true" className="absolute inset-0 rounded-[inherit] ring-1 ring-inset ring-white/10" />

        <div dir="ltr" className="relative flex h-full flex-col justify-between p-[7cqw]">
          <div className="flex items-start justify-between">
            <span translate="no" className="text-[5.4cqw] font-extrabold leading-none tracking-[0.22em]">
              MİLLİ KART
            </span>
            <img src="/brand/bmi-emblem.png" width={128} height={128} alt="" decoding="async" className="-mt-[1.5cqw] w-[10cqw]" />
          </div>

          <svg viewBox="0 0 48 36" className="w-[13cqw]" aria-hidden="true">
            <defs>
              <linearGradient id="chip-gold" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#E9CF72" />
                <stop offset="0.55" stopColor="#C59B27" />
                <stop offset="1" stopColor="#9C7A1E" />
              </linearGradient>
            </defs>
            <rect x="0.5" y="0.5" width="47" height="35" rx="6" fill="url(#chip-gold)" stroke="#7A5C0E" strokeOpacity="0.5" />
            <path d="M16 1v34M32 1v34M1 12h15M32 12h15M1 24h15M32 24h15M16 18h16" stroke="#7A5C0E" strokeOpacity="0.55" fill="none" />
          </svg>

          <div>
            <p className="font-mono text-[5cqw] leading-none tracking-[0.16em] text-white/85">•••• •••• •••• ••••</p>
            <p className="mt-[3cqw] text-[2.8cqw] font-semibold uppercase leading-none tracking-[0.2em] text-white/60">
              Bank Melli İran · Bakı
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
