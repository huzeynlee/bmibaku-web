import { ArrowUpRight, ChevronRight } from 'lucide-react';
import { useI18n } from '../../i18n';
import { LINKS } from '../../data/banking';
import { SectionHeader } from '../ui/SectionHeader';
import { BankCard } from '../banking/BankCard';
import { individualLinks } from '../layout/serviceLinks';

export function IndividualBanking() {
  const { t } = useI18n();
  const links = individualLinks(t);

  return (
    <section id="individual" aria-labelledby="individual-title" className="section-y">
      <div className="container-page grid gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <SectionHeader id="individual-title" eyebrow={t.individual.eyebrow} title={t.individual.title} lead={t.individual.lead} />

          <div className="mt-8 grid grid-cols-[minmax(0,9rem)_1fr] items-center gap-5 rounded-2xl border border-line bg-white p-5 sm:grid-cols-[minmax(0,11rem)_1fr]">
            <BankCard label={t.hero.card} flat />
            <div className="min-w-0">
              <h3 translate="no" className="text-sm font-bold tracking-[0.12em] text-navy-900">
                {t.individual.cardTitle}
              </h3>
              <p className="mt-1.5 text-[13px] leading-relaxed text-slate-600">{t.individual.cardText}</p>
              <a
                href={LINKS.individual.cards}
                className="focus-ring mt-1 inline-flex min-h-6 items-center gap-1 rounded text-[13px] font-semibold text-navy-900 underline-offset-4 hover:underline"
              >
                {t.individual.cardLink}
                <ChevronRight className="size-3.5 rtl:rotate-180" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7">
          <ul className="divide-y divide-line border-y border-line">
            {links.map((l) => (
              <li key={l.key}>
                <a
                  href={l.href}
                  className="focus-ring group flex items-center gap-4 rounded-lg px-2 py-5 transition-colors duration-200 ease-out hover:bg-white sm:px-4"
                >
                  <span className="grid size-11 shrink-0 place-items-center rounded-lg border border-line bg-white text-navy-900 transition-colors duration-200 ease-out group-hover:border-gold-500/50">
                    <l.icon className="size-5" aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-base font-semibold text-navy-900">{l.title}</span>
                    <span className="mt-0.5 block text-sm text-slate-600">{l.desc}</span>
                  </span>
                  <ChevronRight
                    className="size-5 shrink-0 text-slate-400 transition-transform duration-200 ease-out group-hover:translate-x-0.5 group-hover:text-navy-900 rtl:rotate-180 rtl:group-hover:-translate-x-0.5"
                    aria-hidden="true"
                  />
                </a>
              </li>
            ))}
          </ul>
          <a
            href={LINKS.individual.overview}
            className="focus-ring mt-6 inline-flex min-h-6 items-center gap-1.5 rounded text-sm font-semibold text-navy-900 underline-offset-4 hover:underline"
          >
            {t.individual.all}
            <ArrowUpRight className="size-4 rtl:-scale-x-100" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}
