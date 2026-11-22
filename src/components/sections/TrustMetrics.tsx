import { ArrowUpRight } from 'lucide-react';
import { useI18n } from '../../i18n';
import { LINKS, METRICS } from '../../data/banking';
import { formatNumber } from '../../utils/currency';
import { SectionHeader } from '../ui/SectionHeader';

export function TrustMetrics() {
  const { t, lang } = useI18n();
  return (
    <section id="about" aria-labelledby="about-title" className="section-y border-y border-line bg-white">
      <div className="container-page grid gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-4">
          <SectionHeader id="about-title" eyebrow={t.metrics.eyebrow} title={t.metrics.title} lead={t.metrics.lead} />
          <a
            href={LINKS.about}
            className="focus-ring mt-6 inline-flex min-h-6 items-center gap-1.5 rounded text-sm font-semibold text-navy-900 underline-offset-4 hover:underline"
          >
            {t.metrics.more}
            <ArrowUpRight className="size-4 rtl:-scale-x-100" aria-hidden="true" />
          </a>
        </div>

        <dl className="grid gap-x-10 sm:grid-cols-2 lg:col-span-8">
          {METRICS.map((m) => {
            const copy = t.metrics[m.id];
            // A year is not a quantity: no thousands separator.
            const value = m.id === 'since' ? String(m.value) : formatNumber(m.value, lang);
            return (
              <div key={m.id} className="flex flex-col border-t border-line py-7">
                <dt className="order-2 mt-3 text-[15px] font-semibold text-navy-900">{copy.label}</dt>
                <dd className="order-1 text-5xl font-extrabold leading-none tracking-tight text-navy-900 tabular-nums md:text-6xl">
                  {value}
                  {m.suffix && <span className="text-gold-500">{m.suffix}</span>}
                  {m.id === 'history' && <span className="ms-2 text-2xl font-bold text-slate-500">{t.metrics.yearsUnit}</span>}
                </dd>
                <dd className="order-3 mt-1 text-[13px] text-slate-500">{copy.note}</dd>
              </div>
            );
          })}
        </dl>
      </div>
    </section>
  );
}
