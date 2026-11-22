'use client';

import { AnimatePresence, motion } from 'motion/react';
import { lazy, Suspense, useRef, useState, type FormEvent } from 'react';
import { ChevronLeft, ChevronRight, LoaderCircle, RotateCcw } from 'lucide-react';
import type { CurrencyCode, RateMode } from '@/types/banking';
import type { HistoryPage } from '@/lib/rates';
import { useI18n } from '@/i18n/client';
import { CURRENCY_ORDER } from '@/data/currencies';
import { formatDate, formatRate, toIsoDate } from '@/utils/currency';
import { fmt } from '@/utils/cx';
import { buttonClass } from '../ui/buttonClass';
import { Field, FieldError, Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Segmented } from '../ui/Segmented';

const RateHistoryChart = lazy(() => import('./RateHistoryChart'));

type Status = 'idle' | 'loading' | 'error';
interface Filters {
  from: string;
  to: string;
  currency: '' | CurrencyCode;
}

/** Explorer for the bank's official rate archive (proxied by /api/rates/history). */
export function RateHistory({ initial }: { initial: HistoryPage | null }) {
  const { t, locale } = useI18n();
  const today = toIsoDate(new Date());
  const [filters, setFilters] = useState<Filters>({ from: '', to: '', currency: '' });
  const [data, setData] = useState<HistoryPage | null>(initial);
  const [status, setStatus] = useState<Status>(initial ? 'idle' : 'error');
  const [rangeError, setRangeError] = useState<string>();
  const [mode, setMode] = useState<RateMode>('cash');
  const abort = useRef<AbortController | null>(null);

  async function load(f: Filters, page = 1) {
    abort.current?.abort();
    const ctrl = new AbortController();
    abort.current = ctrl;
    setStatus('loading');
    const qs = new URLSearchParams({ page: String(page) });
    if (f.from) qs.set('from', f.from);
    if (f.to) qs.set('to', f.to);
    if (f.currency) qs.set('currency', f.currency);
    try {
      const res = await fetch(`/api/rates/history?${qs}`, { signal: ctrl.signal });
      if (!res.ok) throw new Error(String(res.status));
      setData((await res.json()) as HistoryPage);
      setStatus('idle');
    } catch (e) {
      if (!(e instanceof DOMException && e.name === 'AbortError')) setStatus('error');
    }
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (filters.from && filters.to && filters.from > filters.to) return setRangeError(t.history.rangeError);
    if ((filters.to && filters.to > today) || (filters.from && filters.from > today)) return setRangeError(t.history.futureError);
    setRangeError(undefined);
    void load(filters);
  };

  const reset = () => {
    const empty: Filters = { from: '', to: '', currency: '' };
    setFilters(empty);
    setRangeError(undefined);
    void load(empty);
  };

  const points = data?.points ?? [];
  const singleCurrency = filters.currency && points.length > 1 ? filters.currency : null;

  return (
    <div className="space-y-6">
      <form onSubmit={onSubmit} noValidate className="grid gap-4 rounded-2xl border border-line bg-white p-5 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_auto] lg:items-end">
        <Field id="h-from" label={t.history.from}>
          <Input id="h-from" type="date" max={today} value={filters.from} onChange={(e) => setFilters({ ...filters, from: e.target.value })} invalid={!!rangeError} />
        </Field>
        <Field id="h-to" label={t.history.to}>
          <Input id="h-to" type="date" max={today} value={filters.to} onChange={(e) => setFilters({ ...filters, to: e.target.value })} invalid={!!rangeError} />
        </Field>
        <Field id="h-cur" label={t.history.currency}>
          <Select id="h-cur" value={filters.currency} onChange={(e) => setFilters({ ...filters, currency: e.target.value as Filters['currency'] })}>
            <option value="">{t.history.allCurrencies}</option>
            {CURRENCY_ORDER.map((c) => (
              <option key={c} value={c}>
                {c === 'IRR' ? '100' : '1'} {c} · {t.rates.names[c]}
              </option>
            ))}
          </Select>
        </Field>
        <div className="flex gap-2">
          <button type="submit" className={buttonClass('primary', 'lg', 'flex-1 lg:flex-none')} aria-disabled={status === 'loading'}>
            {status === 'loading' && <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />}
            {t.history.show}
          </button>
          <button type="button" onClick={reset} className={buttonClass('secondary', 'lg')} aria-label={t.history.reset}>
            <RotateCcw className="size-4" aria-hidden="true" />
          </button>
        </div>
        {rangeError && (
          <div className="sm:col-span-2 lg:col-span-4">
            <FieldError id="h-range-error">{rangeError}</FieldError>
          </div>
        )}
      </form>

      <div aria-live="polite" aria-busy={status === 'loading'}>
        {status === 'error' && <p className="rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-800">{t.history.error}</p>}
        {status !== 'error' && points.length === 0 && <p className="rounded-lg border border-dashed border-slate-300 bg-white px-4 py-6 text-center text-sm text-slate-600">{t.history.empty}</p>}

        {points.length > 0 && (
          <div className={status === 'loading' ? 'opacity-60 transition-opacity' : 'transition-opacity'}>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <Segmented<RateMode>
                label={t.converter.mode}
                value={mode}
                onChange={setMode}
                options={[
                  { value: 'cash', label: t.rates.cash },
                  { value: 'noncash', label: t.rates.noncash },
                ]}
              />
              {!singleCurrency && <p className="text-[13px] text-slate-500">{t.history.chartHint}</p>}
            </div>

            {singleCurrency && (
              <div className="mb-5">
                <Suspense fallback={<div className="h-72 animate-pulse rounded-xl bg-slate-100" />}>
                  <RateHistoryChart points={points} mode={mode} locale={locale} labels={{ buy: t.rates.buy, sell: t.rates.sell, title: fmt(t.history.chart, { code: singleCurrency }) }} />
                </Suspense>
              </div>
            )}

            <div className="overflow-hidden rounded-xl border border-line bg-white">
              <div className="overflow-x-auto" tabIndex={0} role="region" aria-label={t.history.title}>
                <table className="w-full min-w-[30rem] border-collapse text-sm">
                  <thead className="bg-navy-900 text-white">
                    <tr>
                      <th scope="col" className="px-4 py-3 text-start font-semibold">{t.history.date}</th>
                      <th scope="col" className="px-4 py-3 text-start font-semibold">{t.rates.currency}</th>
                      <th scope="col" className="px-4 py-3 text-end font-semibold">{t.rates.buy}</th>
                      <th scope="col" className="px-4 py-3 text-end font-semibold">{t.rates.sell}</th>
                    </tr>
                  </thead>
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.tbody key={`${data?.page}-${filters.currency}-${mode}-${points[0]?.date}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }} className="divide-y divide-line">
                      {points.map((p) => {
                        const pair = p[mode];
                        return (
                          <tr key={`${p.date}-${p.code}`} className="transition-colors duration-200 hover:bg-slate-50">
                            <th scope="row" className="px-4 py-2.5 text-start font-medium text-navy-900 tabular-nums">{formatDate(p.date, locale)}</th>
                            <td className="px-4 py-2.5 font-medium text-navy-900 tabular-nums">
                              {p.unit} {p.code}
                            </td>
                            <td className="px-4 py-2.5 text-end tabular-nums text-slate-700">{pair ? formatRate(pair.buy, locale) : <span className="text-slate-500">{t.rates.unavailable}</span>}</td>
                            <td className="px-4 py-2.5 text-end tabular-nums text-slate-700">{pair ? formatRate(pair.sell, locale) : <span className="text-slate-500">{t.rates.unavailable}</span>}</td>
                          </tr>
                        );
                      })}
                    </motion.tbody>
                  </AnimatePresence>
                </table>
              </div>
            </div>

            {(data?.hasPrev || data?.hasNext) && (
              <nav aria-label={t.history.title} className="mt-4 flex items-center justify-between gap-3">
                <button type="button" disabled={!data?.hasPrev} onClick={() => data && load(filters, data.page - 1)} className={buttonClass('secondary', 'md')}>
                  <ChevronLeft className="size-4 rtl:rotate-180" aria-hidden="true" />
                  {t.common.previous}
                </button>
                <span className="text-sm text-slate-600 tabular-nums">{fmt(t.history.page, { n: data?.page ?? 1 })}</span>
                <button type="button" disabled={!data?.hasNext} onClick={() => data && load(filters, data.page + 1)} className={buttonClass('secondary', 'md')}>
                  {t.common.next}
                  <ChevronRight className="size-4 rtl:rotate-180" aria-hidden="true" />
                </button>
              </nav>
            )}
            <p className="mt-4 text-[13px] text-slate-500">{t.history.source}</p>
          </div>
        )}
      </div>
    </div>
  );
}
