import Link from 'next/link';
import { ArrowUpRight, Building2, CreditCard, Megaphone, MonitorSmartphone, Send, UserRoundSearch, type LucideIcon } from 'lucide-react';
import type { Dictionary } from '@/i18n/az';
import { localePath, type Locale } from '@/i18n/config';
import { childrenOf } from '@/content/routes';
import { ICONS } from '@/content/icons';
import { loadPage, pageExcerpt, pageTitle } from '@/content/load';
import { LINKS, METRICS } from '@/data/banking';
import { formatNumber } from '@/utils/currency';
import { CountUp } from '../motion/CountUp';
import { MaskText } from '../motion/MaskText';
import { GoldRule } from '../motion/Motif';
import { Reveal, Stagger, StaggerItem } from '../motion/Reveal';
import { buttonClass } from '../ui/buttonClass';

function SectionHead({ id, eyebrow, title, lead, dark }: { id: string; eyebrow: string; title: string; lead?: string; dark?: boolean }) {
  return (
    <div className="max-w-2xl">
      <Reveal variant="slide">
        <p className={`flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.14em] ${dark ? 'text-gold-400' : 'text-gold-700'}`}>
          <span aria-hidden="true" className="h-px w-8 bg-gold-500" />
          {eyebrow}
        </p>
      </Reveal>
      <MaskText id={id} lines={[title]} className={`mt-3 text-[2rem] font-bold leading-tight tracking-tight md:text-[2.25rem] lg:text-[2.5rem] ${dark ? 'text-white' : 'text-navy-900'}`} />
      {lead && (
        <Reveal delay={0.15}>
          <p className={`mt-4 text-base leading-relaxed md:text-[17px] ${dark ? 'text-white/75' : 'text-slate-600'}`}>{lead}</p>
        </Reveal>
      )}
    </div>
  );
}

export { SectionHead };

/* Heritage metrics: editorial 2×2 with count-up numbers. */
export function Metrics({ t, locale }: { t: Dictionary; locale: Locale }) {
  return (
    <section id="about" aria-labelledby="about-title" className="section-y border-y border-line bg-white">
      <div className="container-page grid gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-4">
          <SectionHead id="about-title" eyebrow={t.metrics.eyebrow} title={t.metrics.title} lead={t.metrics.lead} />
          <Reveal delay={0.2}>
            <Link href={localePath(locale, 'haqqimizda')} className="focus-ring group mt-6 inline-flex min-h-6 items-center gap-1.5 rounded text-sm font-semibold text-navy-900">
              {t.metrics.more}
              <ArrowUpRight className="size-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 rtl:-scale-x-100" aria-hidden="true" />
            </Link>
          </Reveal>
        </div>
        <Stagger as="dl" className="grid gap-x-10 sm:grid-cols-2 lg:col-span-8">
          {METRICS.map((m) => {
            const copy = t.metrics[m.id];
            const format = (n: number) => (m.id === 'since' ? String(n) : formatNumber(n, locale));
            return (
              <StaggerItem key={m.id} className="flex flex-col border-t border-line py-7">
                <dt className="order-2 mt-3 text-[15px] font-semibold text-navy-900">{copy.label}</dt>
                <dd className="order-1 text-5xl font-extrabold leading-none tracking-tight text-navy-900 tabular-nums md:text-6xl">
                  {m.id === 'since' ? format(m.value) : <CountUp value={m.value} locale={locale} />}
                  {m.suffix && <span className="text-gold-500">{m.suffix}</span>}
                  {m.id === 'history' && <span className="ms-2 text-2xl font-bold text-slate-500">{t.metrics.yearsUnit}</span>}
                </dd>
                <dd className="order-3 mt-1 text-[13px] text-slate-500">{copy.note}</dd>
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}

/* Individual (light) and corporate (navy) overviews side by side. */
export function Segments({ t, locale }: { t: Dictionary; locale: Locale }) {
  const panel = (slug: 'ferdi-bankciliq' | 'korporativ-bankciliq', dark: boolean) => {
    const section = slug === 'ferdi-bankciliq' ? 'individual' : 'corporate';
    return (
      <Reveal variant="mask" className={`flex flex-col rounded-2xl p-6 sm:p-8 ${dark ? 'bg-navy-900 text-white' : 'border border-line bg-white'}`}>
        <p className={`text-xs font-semibold uppercase tracking-[0.14em] ${dark ? 'text-gold-400' : 'text-gold-700'}`}>{t.sections[section].eyebrow}</p>
        <h3 className={`mt-3 text-2xl font-bold ${dark ? 'text-white' : 'text-navy-900'}`}>{pageTitle(slug, locale)}</h3>
        <p className={`mt-2 text-[15px] ${dark ? 'text-white/70' : 'text-slate-600'}`}>{t.sections[section].intro}</p>
        <ul className={`mt-6 divide-y ${dark ? 'divide-white/10 border-y border-white/10' : 'divide-line border-y border-line'}`}>
          {childrenOf(slug).map((r) => {
            const Icon = ICONS[r.icon];
            return (
              <li key={r.slug}>
                <Link href={localePath(locale, r.slug)} className={`group flex items-center gap-3 rounded py-3 text-[15px] font-medium transition-colors ${dark ? 'focus-ring-dark text-white/90 hover:text-white' : 'focus-ring text-navy-900'}`}>
                  <Icon className={`size-4 shrink-0 ${dark ? 'text-gold-400' : 'text-gold-700'}`} aria-hidden="true" />
                  <span className="flex-1">{pageTitle(r.slug, locale)}</span>
                  <ArrowUpRight className="size-4 opacity-40 transition-[transform,opacity] duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100 rtl:-scale-x-100" aria-hidden="true" />
                </Link>
              </li>
            );
          })}
        </ul>
        <Link href={localePath(locale, slug)} className={buttonClass(dark ? 'onDark' : 'secondary', 'md', 'mt-6 self-start')}>
          {t.nav.overview}
        </Link>
      </Reveal>
    );
  };
  return (
    <section aria-labelledby="segments-title" className="section-y">
      <div className="container-page">
        <SectionHead id="segments-title" eyebrow={t.home.segmentsEyebrow} title={t.home.segmentsTitle} />
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {panel('ferdi-bankciliq', false)}
          {panel('korporativ-bankciliq', true)}
        </div>
      </div>
    </section>
  );
}

/* The four quick services of the original home page, plus online payments. */
export function QuickServices({ t, locale }: { t: Dictionary; locale: Locale }) {
  const items: { slug: string; icon: LucideIcon; title?: string; href?: string }[] = [
    { slug: 'plastik-kartlar-ferdi', icon: CreditCard },
    { slug: 'pul-kocurmeleri-ferdi', icon: Send },
    { slug: 'atm', icon: Building2, title: t.nav.atm, href: LINKS.atms },
    { slug: 'emlak-satisi', icon: Building2 },
    { slug: 'online-xidmetler', icon: MonitorSmartphone },
  ];
  return (
    <section id="services" aria-labelledby="services-title" className="section-y border-t border-line bg-white">
      <div className="container-page">
        <SectionHead id="services-title" eyebrow={t.home.servicesEyebrow} title={t.home.servicesTitle} />
        <Stagger as="ul" className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {items.map((i) => {
            const external = !!i.href;
            const cls =
              'focus-ring group flex h-full flex-col gap-8 rounded-xl border border-line bg-surface p-5 transition-[border-color,box-shadow,transform,background-color] duration-300 ease-out hover:-translate-y-1 hover:border-navy-900/20 hover:bg-white hover:shadow-[0_18px_40px_-24px_rgb(11_31_58/0.45)]';
            const body = (
              <>
                <span className="flex items-start justify-between">
                  <span className="grid size-11 place-items-center rounded-lg bg-navy-900 text-gold-400 transition-transform duration-300 group-hover:-rotate-3 group-hover:scale-105">
                    <i.icon className="size-5" aria-hidden="true" />
                  </span>
                  <ArrowUpRight className="size-5 text-slate-400 transition-[transform,color] duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-navy-900 rtl:-scale-x-100" aria-hidden="true" />
                </span>
                <span className="font-semibold text-navy-900">{i.title ?? pageTitle(i.slug, locale)}</span>
              </>
            );
            return (
              <StaggerItem as="li" key={i.slug}>
                {external ? (
                  <a href={i.href} target="_blank" rel="noopener noreferrer" className={cls}>
                    {body}
                    <span className="sr-only"> {t.common.newTab}</span>
                  </a>
                ) : (
                  <Link href={localePath(locale, i.slug)} className={cls}>
                    {body}
                  </Link>
                )}
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}

/* Announcements and vacancies from the institutional pages. */
export function News({ t, locale }: { t: Dictionary; locale: Locale }) {
  const announcements = loadPage('elanlar', locale)?.content.blocks.filter((b) => b.type !== 'heading') ?? [];
  const vacancy = pageExcerpt('vakansiyalar', locale, 220);
  return (
    <section aria-labelledby="news-title" className="section-y">
      <div className="container-page">
        <SectionHead id="news-title" eyebrow={t.home.newsEyebrow} title={t.home.newsTitle} />
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <Reveal className="flex flex-col rounded-2xl border border-line bg-white p-6 sm:p-8">
            <Megaphone className="size-6 text-gold-700" aria-hidden="true" />
            <h3 className="mt-4 text-xl font-bold text-navy-900">{t.home.announcements}</h3>
            <p className="mt-2 flex-1 text-[15px] text-slate-600">{announcements.length ? pageExcerpt('elanlar', locale, 220) : t.home.noAnnouncements}</p>
            <Link href={localePath(locale, 'elanlar')} className={buttonClass('secondary', 'md', 'mt-6 self-start')}>
              {pageTitle('elanlar', locale)}
            </Link>
          </Reveal>
          <Reveal delay={0.1} className="flex flex-col rounded-2xl bg-navy-900 p-6 text-white sm:p-8">
            <UserRoundSearch className="size-6 text-gold-400" aria-hidden="true" />
            <h3 className="mt-4 text-xl font-bold">{t.home.vacancies}</h3>
            <GoldRule className="mt-3 w-12" />
            <p className="mt-4 flex-1 text-[15px] leading-relaxed text-white/75">{vacancy ?? t.common.emptySource}</p>
            <Link href={localePath(locale, 'vakansiyalar')} className={buttonClass('onDark', 'md', 'mt-6 self-start')}>
              {t.home.vacancyCta}
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
