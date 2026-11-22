'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, Info } from 'lucide-react';
import { useI18n } from '@/i18n/client';
import { localePath } from '@/i18n/config';
import { CALC_MIN, CREDIT_PRODUCTS, DEFAULT_CALC, getCreditProduct, maxAmountAzn, type CreditProductId } from '@/data/loanProducts';
import { summarizeLoan, clamp } from '@/utils/calculations';
import { formatMoney, formatNumber } from '@/utils/currency';
import { cx, fmt } from '@/utils/cx';
import { AnimatedNumber } from '../motion/AnimatedNumber';
import { SliderField } from '../ui/Slider';
import { buttonClass } from '../ui/buttonClass';

const PREVIEW: CreditProductId[] = ['cash', 'consumer', 'business', 'auto'];

interface LoanCalculatorProps {
  /** Official USD selling rate, used to convert USD-denominated limits. */
  usdSell: number | null;
  /** Home page preview: four products, no notes. */
  compact?: boolean;
}

export function LoanCalculator({ usdSell, compact = false }: LoanCalculatorProps) {
  const { t, locale } = useI18n();
  const [productId, setProductId] = useState<CreditProductId>(DEFAULT_CALC.productId);
  const [amount, setAmount] = useState(DEFAULT_CALC.amount);
  const [term, setTerm] = useState(DEFAULT_CALC.termMonths);
  const product = getCreditProduct(productId);
  const maxAmount = maxAmountAzn(product, usdSell);
  const products = compact ? CREDIT_PRODUCTS.filter((p) => PREVIEW.includes(p.id)) : CREDIT_PRODUCTS;
  const SummaryHeading = compact ? 'h3' : 'h2';

  // Deep link: ?product=auto (from the home page tabs).
  useEffect(() => {
    const p = new URLSearchParams(window.location.search).get('product');
    if (p && CREDIT_PRODUCTS.some((x) => x.id === p)) setProductId(p as CreditProductId);
  }, []);

  useEffect(() => {
    setAmount((a) => clamp(a, CALC_MIN.amount, maxAmount));
    setTerm((m) => clamp(m, CALC_MIN.termMonths, product.maxTermMonths));
  }, [maxAmount, product.maxTermMonths]);

  const summary = useMemo(() => summarizeLoan(amount, product.rate, term), [amount, product.rate, term]);
  const principalShare = summary.totalPayment > 0 ? (summary.principal / summary.totalPayment) * 100 : 100;
  const money = (v: number) => `${formatMoney(v, locale)} AZN`;

  const limitText =
    product.limit.kind === 'usd'
      ? fmt(t.calc.usdLimit, { usd: formatNumber(product.limit.usd, locale), azn: formatNumber(maxAmount, locale) })
      : product.limit.kind === 'azn'
        ? `${formatNumber(product.limit.azn, locale)} AZN`
        : fmt(t.calc.noFixedLimit, { max: formatNumber(maxAmount, locale) });

  const applyHref = `${localePath(locale, 'online-kredit-sifarisi')}?product=${productId}&amount=${amount}&term=${term}`;

  return (
    <div className="grid overflow-hidden rounded-2xl border border-line bg-white lg:grid-cols-12">
      <div className="space-y-8 bg-surface p-5 sm:p-8 lg:col-span-7">
        <fieldset>
          <legend className="text-sm font-semibold text-navy-900">{t.calc.product}</legend>
          <div className={cx('mt-3 grid gap-2', compact ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-2 sm:grid-cols-4')}>
            {products.map((p) => {
              const checked = p.id === productId;
              return (
                <label
                  key={p.id}
                  className={cx(
                    'relative flex min-h-[4.5rem] cursor-pointer flex-col justify-between gap-1 rounded-xl border bg-white p-3 transition-[border-color,box-shadow,transform] duration-200 ease-out',
                    'has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-gold-500',
                    checked ? 'border-navy-900 shadow-[0_0_0_1px_#0B1F3A]' : 'border-line hover:-translate-y-0.5 hover:border-slate-300',
                  )}
                >
                  <input type="radio" name="credit-product" value={p.id} checked={checked} onChange={() => setProductId(p.id)} className="sr-only" />
                  <span className="text-[13px] font-semibold leading-tight text-navy-900">{t.creditProducts[p.id]}</span>
                  <span className="text-[13px] text-slate-600 tabular-nums">
                    {p.rateIsMinimum ? fmt(t.calc.rateFrom, { rate: formatNumber(p.rate, locale) }) : `${formatNumber(p.rate, locale)}%`}
                  </span>
                  {checked && <motion.span layoutId={compact ? 'calc-check-c' : 'calc-check'} className="absolute end-2 top-2 size-2 rounded-full bg-gold-500" />}
                </label>
              );
            })}
          </div>
          {!compact && (
            <p className="mt-3 flex gap-2 text-[13px] text-slate-600">
              <Info className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              <span>
                {fmt(t.calc.limit, { amount: limitText, term: product.maxTermMonths })}
              </span>
            </p>
          )}
        </fieldset>

        <SliderField label={t.calc.amount} value={amount} onChange={setAmount} min={CALC_MIN.amount} max={maxAmount} step={100} unit="AZN" format={(v) => formatNumber(v, locale)} />
        <SliderField label={t.calc.term} value={term} onChange={setTerm} min={CALC_MIN.termMonths} max={product.maxTermMonths} step={1} unit={t.common.months} format={(v) => formatNumber(v, locale)} />
      </div>

      <section aria-labelledby="calc-summary" className="relative isolate flex flex-col overflow-hidden bg-navy-900 p-6 text-white sm:p-8 lg:col-span-5">
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(70%_60%_at_100%_0%,rgb(197_155_39/0.16),transparent_60%)]" />
        {/* On its own page the calculator sits right under the h1; in the home preview, under a section h2. */}
        <SummaryHeading id="calc-summary" className="text-sm font-semibold text-white/70">
          {t.calc.summary}
        </SummaryHeading>
        <p className="mt-5 text-sm text-white/70">{t.calc.monthly}</p>
        <p className="mt-1 text-[2.75rem] font-extrabold leading-none tracking-tight tabular-nums sm:text-[3.25rem]">
          <AnimatedNumber value={summary.monthlyPayment} format={(v) => formatMoney(v, locale)} />
          <span className="ms-2 text-xl font-semibold text-gold-400">AZN</span>
        </p>

        <div className="mt-6">
          <p className="text-xs text-white/60">{t.calc.breakdown}</p>
          <div className="mt-2 flex h-2 overflow-hidden rounded-full bg-white/10" aria-hidden="true">
            <motion.span className="h-full bg-white" animate={{ width: `${principalShare}%` }} transition={{ type: 'spring', stiffness: 120, damping: 22 }} />
            <motion.span className="h-full bg-gold-400" animate={{ width: `${100 - principalShare}%` }} transition={{ type: 'spring', stiffness: 120, damping: 22 }} />
          </div>
          <div className="mt-2 flex justify-between text-xs text-white/70 tabular-nums">
            <span className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-white" aria-hidden="true" />
              {t.calc.principal} {Math.round(principalShare)}%
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-gold-400" aria-hidden="true" />
              {t.calc.interest} {100 - Math.round(principalShare)}%
            </span>
          </div>
        </div>

        <dl className="mt-6 divide-y divide-white/10 border-y border-white/10 text-sm">
          {[
            [t.calc.principal, money(summary.principal)],
            [t.calc.rate, `${formatNumber(product.rate, locale)}%`],
            [t.calc.term, fmt(t.calc.termValue, { n: summary.termMonths })],
            [t.calc.total, money(summary.totalPayment)],
            [t.calc.interest, money(summary.totalInterest)],
          ].map(([k, v]) => (
            <div key={k} className="flex items-center justify-between gap-4 py-2.5">
              <dt className="text-white/70">{k}</dt>
              <dd className="font-semibold tabular-nums">{v}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-6 flex flex-col gap-2.5 sm:flex-row lg:flex-col xl:flex-row">
          <Link href={applyHref} className={buttonClass('gold', 'lg', 'focus-visible:ring-offset-navy-900 sm:flex-1')}>
            {t.calc.apply}
            <ArrowRight className="size-4 transition-transform duration-200 group-hover/btn:translate-x-0.5 rtl:rotate-180" aria-hidden="true" />
          </Link>
          <Link href={compact ? localePath(locale, 'kredit-kalkulatoru') : localePath(locale, productId === 'business' ? 'kreditler-korporativ' : 'kreditler-ferdi')} className={buttonClass('onDark', 'lg', 'sm:flex-1')}>
            {compact ? t.home.openCalculator : t.calc.terms}
          </Link>
        </div>
        <div className="mt-5 space-y-1.5 text-[12.5px] leading-relaxed text-white/60">
          <p>{t.calc.disclaimer}</p>
          <p>{t.calc.fees}</p>
        </div>
      </section>
    </div>
  );
}
