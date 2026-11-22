import { useRef, useState, type KeyboardEvent } from 'react';
import { ArrowRight, Banknote, Briefcase, Car, ShoppingBag, type LucideIcon } from 'lucide-react';
import type { LoanProductId } from '../../types/banking';
import { useI18n } from '../../i18n';
import { LOAN_PRODUCTS } from '../../data/loanProducts';
import { cx, splitTemplate } from '../../utils/cx';
import { formatNumber } from '../../utils/currency';
import { Button } from '../ui/Button';

export const PRODUCT_ICONS: Record<LoanProductId, LucideIcon> = {
  cash: Banknote,
  business: Briefcase,
  consumer: ShoppingBag,
  auto: Car,
};

interface ProductShowcaseProps {
  onApply: (id: LoanProductId) => void;
  onCalculate: (id: LoanProductId) => void;
  className?: string;
}

/** Tabbed loan products (WAI-ARIA tabs: arrows, Home, End). */
export function ProductShowcase({ onApply, onCalculate, className }: ProductShowcaseProps) {
  const { t, lang, dir } = useI18n();
  const [active, setActive] = useState<LoanProductId>('cash');
  const tabs = useRef<Partial<Record<LoanProductId, HTMLButtonElement | null>>>({});
  const product = LOAN_PRODUCTS.find((p) => p.id === active) ?? LOAN_PRODUCTS[0]!;
  const copy = t.products[active];

  const focusTab = (index: number) => {
    const next = LOAN_PRODUCTS[(index + LOAN_PRODUCTS.length) % LOAN_PRODUCTS.length];
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
    else if (e.key === 'End') focusTab(LOAN_PRODUCTS.length - 1);
    else return;
    e.preventDefault();
  };

  const [before, after] = splitTemplate(t.hero.rateFrom, 'rate');

  return (
    <div className={cx('rounded-2xl border border-line bg-white p-2 shadow-[0_1px_2px_rgb(15_23_42/0.04),0_12px_32px_-16px_rgb(11_31_58/0.18)]', className)}>
      <div role="tablist" aria-label={t.hero.products} className="grid grid-cols-4 gap-1 rounded-xl bg-slate-100 p-1">
        {LOAN_PRODUCTS.map((p, i) => {
          const Icon = PRODUCT_ICONS[p.id];
          const selected = p.id === active;
          return (
            <button
              key={p.id}
              ref={(el) => {
                tabs.current[p.id] = el;
              }}
              type="button"
              role="tab"
              id={`product-tab-${p.id}`}
              aria-selected={selected}
              aria-controls="product-panel"
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(p.id)}
              onKeyDown={(e) => onKeyDown(e, i)}
              className={cx(
                'focus-ring flex min-h-11 min-w-0 flex-col items-center justify-center gap-1 rounded-lg px-1 py-2 text-xs font-semibold sm:flex-row sm:gap-1.5 sm:text-[13px]',
                'transition-[background-color,color,box-shadow] duration-200 ease-out',
                selected ? 'bg-white text-navy-900 shadow-sm' : 'text-slate-600 hover:text-navy-900',
              )}
            >
              <Icon className={cx('size-4 shrink-0', selected && 'text-gold-700')} aria-hidden="true" />
              <span className="max-w-full truncate">{t.products[p.id].short}</span>
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        id="product-panel"
        aria-labelledby={`product-tab-${active}`}
        tabIndex={0}
        className="focus-ring flex min-h-[15.5rem] flex-col rounded-xl px-4 pb-4 pt-5 sm:px-5"
      >
        <h2 className="text-lg font-bold text-navy-900">{copy.name}</h2>
        <p className="mt-1 text-sm text-slate-600">{copy.desc}</p>

        <div className="mt-5" aria-live="polite">
          {product.annualRate !== null ? (
            <p className="text-[15px] font-medium text-slate-600">
              {before}
              <span className="text-5xl font-extrabold leading-none tracking-tight text-navy-900 tabular-nums">
                {formatNumber(product.annualRate, lang)}
                <span className="text-gold-500">%</span>
              </span>
              {after}
            </p>
          ) : (
            <p className="text-xl font-bold leading-snug text-navy-900">{t.hero.rateOnRequest}</p>
          )}
        </div>

        <div className="mt-auto flex flex-wrap gap-2 pt-6">
          <Button variant="gold" onClick={() => onApply(active)}>
            {t.hero.applyShort}
            <ArrowRight className="size-4 rtl:rotate-180" aria-hidden="true" />
          </Button>
          {product.annualRate !== null && (
            <Button variant="secondary" onClick={() => onCalculate(active)}>
              {t.hero.calc}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
