'use client';

import Link from 'next/link';
import { AnimatePresence, motion } from 'motion/react';
import { useRef, useState, type KeyboardEvent } from 'react';
import { ArrowRight, Banknote, Briefcase, Car, ShoppingBag, type LucideIcon } from 'lucide-react';
import { useI18n } from '@/i18n/client';
import { localePath } from '@/i18n/config';
import { PROMO_PRODUCTS, type PromoId } from '@/data/loanProducts';
import { cx, splitTemplate } from '@/utils/cx';
import { formatNumber } from '@/utils/currency';
import { buttonClass } from '../ui/buttonClass';

export const PROMO_ICONS: Record<PromoId, LucideIcon> = { cash: Banknote, business: Briefcase, consumer: ShoppingBag, auto: Car };

/** Home page loan products as WAI-ARIA tabs (arrows, Home, End). */
export function ProductShowcase({ className }: { className?: string }) {
  const { t, locale, dir } = useI18n();
  const [active, setActive] = useState<PromoId>('cash');
  const tabs = useRef<Partial<Record<PromoId, HTMLButtonElement | null>>>({});
  const product = PROMO_PRODUCTS.find((p) => p.id === active) ?? PROMO_PRODUCTS[0]!;
  const copy = t.products[active];
  const [before, after] = splitTemplate(t.home.rateFrom, 'rate');

  const focusTab = (index: number) => {
    const next = PROMO_PRODUCTS[(index + PROMO_PRODUCTS.length) % PROMO_PRODUCTS.length];
    if (!next) return;
    setActive(next.id);
    tabs.current[next.id]?.focus();
  };
  const onKeyDown = (e: KeyboardEvent, index: number) => {
    const forward = dir === 'rtl' ? 'ArrowLeft' : 'ArrowRight';
    const back = dir === 'rtl' ? 'ArrowRight' : 'ArrowLeft';
    if (e.key === forward) focusTab(index + 1);
    else if (e.key === back) focusTab(index - 1);
    else if (e.key === 'Home') focusTab(0);
    else if (e.key === 'End') focusTab(PROMO_PRODUCTS.length - 1);
    else return;
    e.preventDefault();
  };

  return (
    <div className={cx('rounded-2xl border border-line bg-white/90 p-2 shadow-[0_1px_2px_rgb(15_23_42/0.04),0_24px_48px_-28px_rgb(11_31_58/0.35)] backdrop-blur', className)}>
      <div role="tablist" aria-label={t.home.products} className="relative grid grid-cols-4 gap-1 rounded-xl bg-slate-100 p-1">
        {PROMO_PRODUCTS.map((p, i) => {
          const Icon = PROMO_ICONS[p.id];
          const selected = p.id === active;
          return (
            <button
              key={p.id}
              ref={(el) => {
                tabs.current[p.id] = el;
              }}
              type="button"
              role="tab"
              id={`promo-tab-${p.id}`}
              aria-selected={selected}
              aria-controls="promo-panel"
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(p.id)}
              onKeyDown={(e) => onKeyDown(e, i)}
              className={cx(
                'focus-ring relative flex min-h-11 min-w-0 flex-col items-center justify-center gap-1 rounded-lg px-1 py-2 text-xs font-semibold sm:flex-row sm:gap-1.5 sm:text-[13px]',
                'transition-colors duration-200 ease-out',
                selected ? 'text-navy-900' : 'text-slate-600 hover:text-navy-900',
              )}
            >
              {selected && <motion.span layoutId="promo-tab" className="absolute inset-0 rounded-lg bg-white shadow-sm" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
              <Icon className={cx('relative size-4 shrink-0', selected && 'text-gold-700')} aria-hidden="true" />
              <span className="relative max-w-full truncate">{t.products[p.id].short}</span>
            </button>
          );
        })}
      </div>

      <div role="tabpanel" id="promo-panel" aria-labelledby={`promo-tab-${active}`} tabIndex={0} className="focus-ring flex min-h-[15rem] flex-col rounded-xl px-4 pb-4 pt-5 sm:px-5">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={active} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.22 }}>
            <h2 className="text-lg font-bold text-navy-900">{copy.name}</h2>
            <p className="mt-1 text-sm text-slate-600">{copy.desc}</p>
            <div className="mt-5" aria-live="polite">
              {product.rate !== null ? (
                <p className="text-[15px] font-medium text-slate-600">
                  {before}
                  <span className="text-5xl font-extrabold leading-none tracking-tight text-navy-900 tabular-nums">
                    {formatNumber(product.rate, locale)}
                    <span className="text-gold-500">%</span>
                  </span>
                  {after}
                </p>
              ) : (
                <p className="text-xl font-bold leading-snug text-navy-900">{t.home.rateOnRequest}</p>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
        <p className="mt-3 text-[12px] text-slate-500">{t.home.promoNote}</p>
        <div className="mt-auto flex flex-wrap gap-2 pt-5">
          <Link href={`${localePath(locale, 'online-kredit-sifarisi')}?product=${product.calcProduct ?? product.id}`} className={buttonClass('gold', 'md')}>
            {t.home.applyShort}
            <ArrowRight className="size-4 transition-transform duration-200 group-hover/btn:translate-x-0.5 rtl:rotate-180" aria-hidden="true" />
          </Link>
          {product.calcProduct && (
            <Link href={`${localePath(locale, 'kredit-kalkulatoru')}?product=${product.calcProduct}`} className={buttonClass('secondary', 'md')}>
              {t.home.calc}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
