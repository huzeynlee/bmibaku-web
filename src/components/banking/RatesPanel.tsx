'use client';

import { BadgeCheck, CircleAlert } from 'lucide-react';
import type { RatesSnapshot } from '@/types/banking';
import { useI18n } from '@/i18n/client';
import { formatDate } from '@/utils/currency';
import { cx, fmt } from '@/utils/cx';
import { Reveal } from '../motion/Reveal';
import { CurrencyConverter } from './CurrencyConverter';
import { ExchangeTable } from './ExchangeTable';

/** Official rates table and converter, with date and source. */
export function RatesPanel({ data, error }: { data: RatesSnapshot; error: boolean }) {
  const { t, locale } = useI18n();
  return (
    <div>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px] text-slate-600">
        <span className="font-semibold text-navy-900 tabular-nums">{fmt(t.rates.updated, { date: formatDate(data.asOf, locale) })}</span>
        <span>{t.rates.source}</span>
        <span className={cx('inline-flex items-center gap-1.5 rounded-md px-2 py-1 font-medium', data.live ? 'bg-green-50 text-success' : 'bg-slate-100 text-slate-700')}>
          {data.live ? <BadgeCheck className="size-3.5" aria-hidden="true" /> : <CircleAlert className="size-3.5" aria-hidden="true" />}
          {data.live ? t.rates.official : t.rates.snapshot}
        </span>
      </div>
      {error && (
        <p className="mt-3 rounded-lg bg-amber-50 px-4 py-2.5 text-[13px] text-amber-900" role="status">
          {t.rates.loadError}
        </p>
      )}
      <div className="mt-5 grid gap-6 lg:grid-cols-12">
        <Reveal variant="fade" className="min-w-0 lg:col-span-7">
          <ExchangeTable items={data.items} caption={t.rates.title} />
          <p className="mt-3 text-[13px] text-slate-500">{t.rates.note}</p>
        </Reveal>
        <Reveal variant="fade" delay={0.1} className="lg:col-span-5">
          <CurrencyConverter items={data.items} asOf={data.asOf} />
        </Reveal>
      </div>
    </div>
  );
}
