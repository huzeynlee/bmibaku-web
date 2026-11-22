import { lazy, Suspense, useEffect, useId, useRef, useState, type FormEvent } from 'react';
import { CalendarSearch, ExternalLink as ExternalIcon, LoaderCircle } from 'lucide-react';
import type { CurrencyCode, RateHistoryPoint, RateMode } from '../../types/banking';
import { useI18n } from '../../i18n';
import { CURRENCY_ORDER } from '../../data/currencies';
import { LINKS } from '../../data/banking';
import { getRateHistory } from '../../services/currencyService';
import { formatDate, formatRate, toIsoDate } from '../../utils/currency';
import { fmt } from '../../utils/cx';
import { Drawer } from '../ui/Drawer';
import { Button, ExternalLink, buttonClass } from '../ui/Button';
import { Field, FieldError, Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Segmented } from '../ui/Segmented';

const RateHistoryChart = lazy(() => import('./RateHistoryChart'));

type State =
  | { status: 'idle' | 'loading' | 'unavailable' | 'error' }
  | { status: 'ok'; code: CurrencyCode; points: RateHistoryPoint[] };

const DAY = 86_400_000;

export function RateHistoryDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t, lang } = useI18n();
  const ids = { currency: useId(), from: useId(), to: useId(), form: useId() };
  const today = toIsoDate(new Date());
  const [code, setCode] = useState<CurrencyCode>('USD');
  const [from, setFrom] = useState(() => toIsoDate(new Date(Date.now() - 30 * DAY)));
  const [to, setTo] = useState(today);
  const [mode, setMode] = useState<RateMode>('cash');
  const [rangeError, setRangeError] = useState<string>();
  const [state, setState] = useState<State>({ status: 'idle' });
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => () => abortRef.current?.abort(), []);

  const load = async (e?: FormEvent) => {
    e?.preventDefault();
    if (from > to) return setRangeError(t.history.rangeError);
    if (to > today) return setRangeError(t.history.futureError);
    if ((Date.parse(to) - Date.parse(from)) / DAY > 366) return setRangeError(t.history.tooLong);
    setRangeError(undefined);
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setState({ status: 'loading' });
    try {
      const res = await getRateHistory({ code, from, to }, controller.signal);
      setState(res.status === 'ok' ? { status: 'ok', code: res.code, points: res.points } : { status: 'unavailable' });
    } catch (err) {
      if (!(err instanceof DOMException && err.name === 'AbortError')) setState({ status: 'error' });
    }
  };

  // Check availability as soon as the drawer opens.
  useEffect(() => {
    if (open && state.status === 'idle') void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const rows = state.status === 'ok' ? [...state.points].reverse() : [];

  return (
    <Drawer open={open} onClose={onClose} labelledBy="history-title" closeLabel={t.history.close}>
      <div className="border-b border-line p-6 pe-16">
        <h2 id="history-title" className="text-xl font-bold text-navy-900">
          {t.history.title}
        </h2>
        <p className="mt-1 text-sm text-slate-600">{t.history.lead}</p>

        <form id={ids.form} onSubmit={load} noValidate className="mt-5 grid grid-cols-2 gap-3">
          <Field id={ids.currency} label={t.history.currency} className="col-span-2">
            <Select id={ids.currency} value={code} onChange={(e) => setCode(e.target.value as CurrencyCode)}>
              {CURRENCY_ORDER.map((c) => (
                <option key={c} value={c}>
                  {c} · {t.rates.names[c]}
                </option>
              ))}
            </Select>
          </Field>
          <Field id={ids.from} label={t.history.from}>
            <Input id={ids.from} type="date" max={today} value={from} onChange={(e) => setFrom(e.target.value)} invalid={!!rangeError} />
          </Field>
          <Field id={ids.to} label={t.history.to}>
            <Input id={ids.to} type="date" max={today} value={to} onChange={(e) => setTo(e.target.value)} invalid={!!rangeError} />
          </Field>
          {rangeError && (
            <div className="col-span-2">
              <FieldError id={`${ids.form}-error`}>{rangeError}</FieldError>
            </div>
          )}
          <Button type="submit" variant="primary" className="col-span-2" aria-disabled={state.status === 'loading'}>
            {state.status === 'loading' && <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />}
            {t.history.show}
          </Button>
        </form>
      </div>

      <div className="flex-1 p-6" aria-live="polite">
        {state.status === 'loading' && <p className="text-sm text-slate-600">{t.history.loading}</p>}

        {state.status === 'unavailable' && (
          <div className="rounded-xl border border-dashed border-slate-300 p-6 text-center">
            <CalendarSearch className="mx-auto size-7 text-slate-400" aria-hidden="true" />
            <h3 className="mt-3 font-semibold text-navy-900">{t.history.unavailableTitle}</h3>
            <p className="mt-2 text-sm text-slate-600">{t.history.unavailableText}</p>
            <ExternalLink href={LINKS.rateHistory} showIcon={false} className={buttonClass('secondary', 'md', 'mt-5')}>
              {t.history.openOfficial}
              <ExternalIcon className="size-4" aria-hidden="true" />
            </ExternalLink>
          </div>
        )}

        {state.status === 'error' && <p className="text-sm font-medium text-danger">{t.history.error}</p>}

        {state.status === 'ok' && rows.length === 0 && <p className="text-sm text-slate-600">{t.history.empty}</p>}

        {state.status === 'ok' && rows.length > 0 && (
          <div className="space-y-4">
            <Segmented<RateMode>
              label={t.converter.mode}
              value={mode}
              onChange={setMode}
              options={[
                { value: 'cash', label: t.rates.cash },
                { value: 'noncash', label: t.rates.noncash },
              ]}
            />
            <Suspense fallback={null}>
              <RateHistoryChart
                points={state.points}
                mode={mode}
                lang={lang}
                labels={{ buy: t.rates.buy, sell: t.rates.sell, title: fmt(t.history.chart, { code: state.code }) }}
              />
            </Suspense>
            <div className="overflow-hidden rounded-xl border border-line">
              <table className="w-full text-sm">
                <caption className="sr-only">{fmt(t.history.chart, { code: state.code })}</caption>
                <thead className="bg-slate-50 text-slate-600">
                  <tr>
                    <th scope="col" className="px-4 py-2.5 text-start font-semibold">
                      {t.history.date}
                    </th>
                    <th scope="col" className="px-4 py-2.5 text-end font-semibold">
                      {t.rates.buy}
                    </th>
                    <th scope="col" className="px-4 py-2.5 text-end font-semibold">
                      {t.rates.sell}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {rows.map((p) => {
                    const pair = p[mode];
                    return (
                      <tr key={p.date}>
                        <th scope="row" className="px-4 py-2.5 text-start font-medium text-navy-900 tabular-nums">
                          {formatDate(p.date, lang)}
                        </th>
                        <td className="px-4 py-2.5 text-end tabular-nums">{pair ? formatRate(pair.buy, lang) : t.rates.unavailable}</td>
                        <td className="px-4 py-2.5 text-end tabular-nums">{pair ? formatRate(pair.sell, lang) : t.rates.unavailable}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </Drawer>
  );
}
