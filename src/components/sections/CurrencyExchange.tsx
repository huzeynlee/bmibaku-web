import { useState } from 'react';
import { History, Radio } from 'lucide-react';
import { useI18n } from '../../i18n';
import { useRates } from '../../hooks/useRates';
import { formatDate } from '../../utils/currency';
import { cx, fmt } from '../../utils/cx';
import { Button, ExternalLink } from '../ui/Button';
import { SectionHeader } from '../ui/SectionHeader';
import { CurrencyConverter } from '../banking/CurrencyConverter';
import { ExchangeTable } from '../banking/ExchangeTable';
import { RateHistoryDrawer } from '../banking/RateHistoryDrawer';

export function CurrencyExchange() {
  const { t, lang } = useI18n();
  const rates = useRates();
  const [historyOpen, setHistoryOpen] = useState(false);

  return (
    <section id="rates" aria-labelledby="rates-title" className="section-y">
      <div className="container-page">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeader id="rates-title" eyebrow={t.rates.eyebrow} title={t.rates.title} lead={t.rates.lead} />
          <Button variant="secondary" onClick={() => setHistoryOpen(true)} className="self-start md:self-auto">
            <History className="size-4" aria-hidden="true" />
            {t.rates.history}
          </Button>
        </div>

        {rates.status === 'loading' && (
          <p className="mt-10 text-sm text-slate-600" aria-live="polite">
            {t.rates.loading}
          </p>
        )}
        {rates.status === 'error' && (
          <p className="mt-10 rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-800" role="alert">
            {t.rates.loadError}
          </p>
        )}

        {rates.status === 'ready' && (
          <>
            <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px] text-slate-600">
              <span className="font-semibold text-navy-900 tabular-nums">{fmt(t.rates.updated, { date: formatDate(rates.data.asOf, lang) })}</span>
              <span>
                {t.rates.source}{' '}
                <ExternalLink href={rates.data.source.url} className="focus-ring rounded font-medium text-navy-900 underline underline-offset-4">
                  {rates.data.source.label}
                </ExternalLink>
              </span>
              <span
                className={cx(
                  'inline-flex items-center gap-1.5 rounded-md px-2 py-1 font-medium',
                  rates.data.live ? 'bg-green-50 text-success' : 'bg-slate-100 text-slate-700',
                )}
              >
                <Radio className="size-3.5" aria-hidden="true" />
                {rates.data.live ? t.rates.live : t.rates.snapshot}
              </span>
            </div>

            <div className="mt-5 grid gap-6 lg:grid-cols-12">
              <div className="min-w-0 lg:col-span-7">
                <ExchangeTable items={rates.data.items} caption={t.rates.title} />
                <p className="mt-3 text-[13px] text-slate-500">{t.rates.note}</p>
              </div>
              <div className="lg:col-span-5">
                <CurrencyConverter items={rates.data.items} asOf={rates.data.asOf} />
              </div>
            </div>
          </>
        )}
      </div>
      <RateHistoryDrawer open={historyOpen} onClose={() => setHistoryOpen(false)} />
    </section>
  );
}
