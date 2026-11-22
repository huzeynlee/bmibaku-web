import { ArrowUpRight } from 'lucide-react';
import { useI18n } from '../../i18n';
import { LINKS } from '../../data/banking';
import { getLoanProduct } from '../../data/loanProducts';
import { formatNumber } from '../../utils/currency';
import { splitTemplate } from '../../utils/cx';
import { SectionHeader } from '../ui/SectionHeader';
import { corporateLinks } from '../layout/serviceLinks';

export function CorporateBanking() {
  const { t, lang } = useI18n();
  const links = corporateLinks(t);
  const rate = getLoanProduct('business').annualRate;
  const [before, after] = splitTemplate(t.hero.rateFrom, 'rate');

  return (
    <section id="corporate" aria-labelledby="corporate-title" className="section-y bg-navy-900 text-white">
      <div className="container-page grid gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <SectionHeader id="corporate-title" eyebrow={t.corporate.eyebrow} title={t.corporate.title} lead={t.corporate.lead} dark />
          {rate !== null && (
            <div className="mt-8 border-t border-white/15 pt-6">
              <p className="text-sm font-semibold text-white/70">{t.corporate.highlight}</p>
              <p className="mt-2 text-[15px] text-white/75">
                {before}
                <span className="text-5xl font-extrabold leading-none tracking-tight text-white tabular-nums">
                  {formatNumber(rate, lang)}
                  <span className="text-gold-400">%</span>
                </span>
                {after}
              </p>
            </div>
          )}
        </div>

        <div className="lg:col-span-7">
          <ul className="grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-2">
            {links.map((l, i) => (
              <li key={l.key} className={i === links.length - 1 && links.length % 2 === 1 ? 'sm:col-span-2' : undefined}>
                <a
                  href={l.href}
                  className="focus-ring-dark group flex h-full flex-col gap-4 bg-navy-900 p-6 transition-colors duration-200 ease-out hover:bg-navy-800"
                >
                  <span className="flex items-start justify-between">
                    <l.icon className="size-6 text-gold-400" aria-hidden="true" />
                    <ArrowUpRight
                      className="size-5 text-white/40 transition-[transform,color] duration-200 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white rtl:-scale-x-100"
                      aria-hidden="true"
                    />
                  </span>
                  <span>
                    <span className="block text-base font-semibold text-white">{l.title}</span>
                    <span className="mt-1 block text-sm text-white/70">{l.desc}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
          <a
            href={LINKS.corporate.overview}
            className="focus-ring-dark mt-6 inline-flex min-h-6 items-center gap-1.5 rounded text-sm font-semibold text-white underline-offset-4 hover:underline"
          >
            {t.corporate.all}
            <ArrowUpRight className="size-4 rtl:-scale-x-100" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}
