import Link from 'next/link';
import { ArrowUpRight, Clock, ExternalLink as ExternalIcon, Mail, MapPin, Phone } from 'lucide-react';
import type { Dictionary } from '@/i18n/az';
import { localePath, type Locale } from '@/i18n/config';
import type { Block, ResolvedPage } from '@/content/types';
import { childrenOf, type RouteDef } from '@/content/routes';
import { loadPage, pageExcerpt, pageTitle } from '@/content/load';
import { CONTACT, INSTITUTION, LINKS } from '@/data/banking';
import { CREDIT_PRODUCTS } from '@/data/loanProducts';
import type { RatesSnapshot } from '@/types/banking';
import type { HistoryPage } from '@/lib/rates';
import { formatDate, formatLongDate } from '@/utils/currency';
import { fmt } from '@/utils/cx';
import { Blocks } from '../blocks/Blocks';
import { Gallery } from '../blocks/Gallery';
import { PageHero } from '../layout/PageHero';
import { FallbackNotice } from '../layout/Notices';
import { BankCard } from '../banking/BankCard';
import { LoanCalculator } from '../banking/LoanCalculator';
import { RateHistory } from '../banking/RateHistory';
import { RatesPanel } from '../banking/RatesPanel';
import { CreditApplicationForm } from '../banking/CreditApplicationForm';
import { ContactForm } from '../banking/ContactForm';
import { GoldRule } from '../motion/Motif';
import { Reveal, Stagger, StaggerItem } from '../motion/Reveal';
import { buttonClass } from '../ui/buttonClass';
import { CopyValue } from '../ui/CopyValue';
import { CtaBand, RouteTiles, SITE_URL, SourceMeta, crumbsFor, liftIntro } from './shared';
import { EmptyState, eyebrowFor } from './ContentTemplate';

interface Props {
  route: RouteDef;
  page: ResolvedPage;
  locale: Locale;
  t: Dictionary;
}

function Hero({ route, page, locale, t, description, size }: Props & { description?: string | null; size?: 'compact' | 'large' }) {
  return (
    <PageHero
      section={route.section}
      eyebrow={eyebrowFor(route, t)}
      title={page.content.heroTitle ?? page.content.title}
      description={description}
      crumbs={crumbsFor(route.slug, locale, t)}
      breadcrumbLabel={t.common.breadcrumb}
      siteUrl={SITE_URL}
      meta={<SourceMeta page={page.content} t={t} locale={locale} />}
      size={size}
    />
  );
}

const Container = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => <div className={`container-page py-12 md:py-16 ${className}`}>{children}</div>;

/* ------------------------------------------------------------------ Overview */

export function OverviewTemplate(props: Props) {
  const { route, page, locale, t } = props;
  const { intro, rest } = liftIntro(page.content.blocks);
  const children = childrenOf(route.slug);
  const individual = route.section === 'individual';
  return (
    <>
      <Hero {...props} description={intro ?? t.sections[route.section === 'individual' ? 'individual' : 'corporate'].intro} size="large" />
      <Container>
        {page.fallback && <FallbackNotice t={t} />}
        <RouteTiles routes={children} locale={locale} t={t} title={t.common.inThisSection} />
        <div className="mt-16 grid items-center gap-10 lg:grid-cols-12">
          <div className="min-w-0 lg:col-span-7">
            <Blocks blocks={rest.filter((b) => b.type !== 'links' && b.type !== 'image')} t={t} />
          </div>
          <div className="lg:col-span-5">
            {individual ? (
              <Reveal variant="scale">
                <div className="relative overflow-hidden rounded-2xl bg-navy-900 p-8 text-white">
                  <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(60%_60%_at_100%_0%,rgb(197_155_39/0.2),transparent_60%)]" />
                  <BankCard label={t.home.card} interactive delay={0.2} className="relative mx-auto w-full max-w-xs" />
                  <p className="relative mt-8 text-sm leading-relaxed text-white/75">{pageExcerpt('plastik-kartlar-ferdi', locale, 200)}</p>
                  <Link href={localePath(locale, 'plastik-kartlar-ferdi')} className={buttonClass('onDark', 'md', 'relative mt-5')}>
                    {pageTitle('plastik-kartlar-ferdi', locale)}
                    <ArrowUpRight className="size-4 rtl:-scale-x-100" aria-hidden="true" />
                  </Link>
                </div>
              </Reveal>
            ) : (
              <Reveal variant="scale">
                <div className="rounded-2xl border border-line bg-white p-8">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gold-700">{t.nav.tools}</p>
                  <ul className="mt-4 divide-y divide-line">
                    {['kreditler-korporativ', 'nagdsiz-emeliyyatlar-korporativ', 'bank-tarifleri-korporativ', 'kredit-kalkulatoru'].map((s) => (
                      <li key={s}>
                        <Link href={localePath(locale, s)} className="focus-ring group flex items-center justify-between gap-3 rounded py-3.5 font-medium text-navy-900">
                          {pageTitle(s, locale)}
                          <ArrowUpRight className="size-4 text-slate-400 transition-[transform,color] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-navy-900 rtl:-scale-x-100" aria-hidden="true" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            )}
          </div>
        </div>
      </Container>
      <CtaBand t={t} locale={locale} />
    </>
  );
}

/* ------------------------------------------------------------------ Institutional hub */

export function HubTemplate(props: Props & { groups: { label: string; routes: RouteDef[] }[]; reportYears: number[]; latestReport: string | null }) {
  const { page, locale, t, groups, reportYears, latestReport } = props;
  const { intro, rest } = liftIntro(page.content.blocks);
  const r = INSTITUTION.requisites;
  const f = t.institution.fields;
  const rows: [string, string, boolean][] = [
    [f.fullName, INSTITUTION.fullName, false],
    [f.founded, formatLongDate(INSTITUTION.founded, locale), false],
    [f.license, fmt(t.institution.licenseValue, { number: INSTITUTION.license.number, date: formatLongDate(INSTITUTION.license.date, locale) }), false],
    [f.taxId, r.taxId, true],
    [f.bankCode, r.bankCode, true],
    [f.swift, r.swift, true],
    [f.correspondent, r.correspondentAccount, true],
  ];
  const timeline = [
    { year: '1993', text: t.timeline.founded },
    ...(reportYears.length ? [{ year: String(Math.min(...reportYears)), text: t.timeline.reports }] : []),
    ...(latestReport ? [{ year: latestReport.slice(0, 4), text: `${t.timeline.latestReport} (${formatDate(latestReport, locale)})` }] : []),
  ];

  return (
    <>
      <Hero {...props} description={intro ?? t.sections.institution.intro} size="large" />
      <Container>
        {page.fallback && <FallbackNotice t={t} />}
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="min-w-0 space-y-12 lg:col-span-8">
            {groups.map((g, i) => (
              <section key={g.label} aria-labelledby={`grp-${i}`}>
                <Reveal>
                  <h2 id={`grp-${i}`} className="flex items-center gap-3 text-xl font-bold text-navy-900">
                    <span className="text-sm font-bold text-gold-700 tabular-nums">0{i + 1}</span>
                    {g.label}
                  </h2>
                </Reveal>
                <GoldRule className="mt-3 w-full opacity-40" delay={0.1} />
                <Stagger as="ul" className="mt-2 divide-y divide-line">
                  {g.routes.map((route) => (
                    <StaggerItem as="li" key={route.slug}>
                      <Link href={localePath(locale, route.slug)} className="focus-ring group flex items-center gap-4 rounded-lg py-4 transition-colors duration-200 hover:bg-white">
                        <span className="min-w-0 flex-1">
                          <span className="block font-semibold text-navy-900">{pageTitle(route.slug, locale)}</span>
                          {childrenOf(route.slug).length > 0 && (
                            <span className="mt-1 block text-[13px] text-slate-500">{childrenOf(route.slug).map((c) => pageTitle(c.slug, locale)).join(' · ')}</span>
                          )}
                        </span>
                        <ArrowUpRight className="size-5 shrink-0 text-slate-400 transition-[transform,color] duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-navy-900 rtl:-scale-x-100" aria-hidden="true" />
                      </Link>
                    </StaggerItem>
                  ))}
                </Stagger>
              </section>
            ))}
            {rest.length > 0 && <Blocks blocks={rest.filter((b) => b.type !== 'table')} t={t} />}
          </div>

          <aside className="space-y-8 lg:col-span-4">
            <Reveal variant="scale" className="rounded-2xl border border-line bg-white p-6">
              <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-600">{t.institution.requisites}</h2>
              <dl className="mt-4 divide-y divide-line">
                {rows.map(([k, v, copy]) => (
                  <div key={k} className="py-3">
                    <dt className="text-[13px] text-slate-500">{k}</dt>
                    <dd className="mt-0.5 flex items-center justify-between gap-2 text-sm font-semibold text-navy-900">
                      <span dir={copy ? 'ltr' : undefined} className="min-w-0 break-all tabular-nums">
                        {v}
                      </span>
                      {copy && <CopyValue value={v} label={k} />}
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>

            <Reveal variant="scale" delay={0.1} className="rounded-2xl bg-navy-900 p-6 text-white">
              <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-gold-400">{t.timeline.title}</h2>
              <ol className="relative mt-5 space-y-6 border-s border-white/15 ps-5">
                {timeline.map((item) => (
                  <li key={item.year + item.text} className="relative">
                    <span aria-hidden="true" className="absolute -start-[1.6rem] top-1.5 size-2.5 rounded-full bg-gold-400 ring-4 ring-navy-900" />
                    <p className="text-2xl font-extrabold tabular-nums">{item.year}</p>
                    <p className="mt-1 text-sm leading-relaxed text-white/75">{item.text}</p>
                  </li>
                ))}
              </ol>
            </Reveal>
          </aside>
        </div>
      </Container>
      <CtaBand t={t} locale={locale} />
    </>
  );
}

/* ------------------------------------------------------------------ Gallery */

export function GalleryTemplate(props: Props) {
  const { page, t, locale } = props;
  const images = page.content.blocks.flatMap((b) => (b.type === 'gallery' ? b.images : []));
  return (
    <>
      <Hero {...props} description={t.sections.gallery.intro} />
      <Container>{images.length ? <Gallery images={images} /> : <EmptyState text={t.common.emptySource} />}</Container>
      <CtaBand t={t} locale={locale} />
    </>
  );
}

/* ------------------------------------------------------------------ Contact */

export function ContactTemplate(props: Props) {
  const { page, t } = props;
  const form = page.content.forms.find((f) => f.kind === 'elementor-form');
  const topics = form?.fields.find((f) => f.type === 'select')?.options ?? [];
  const map = page.content.blocks.find((b) => b.type === 'map');
  const rest = page.content.blocks.filter((b) => b.type !== 'form' && b.type !== 'map');
  const cards = [
    { icon: MapPin, label: t.contact.address, value: t.footer.address, href: CONTACT.mapUrl, external: true },
    { icon: Phone, label: t.contact.phones, value: CONTACT.phones.map((p) => p.display).join('\n'), href: CONTACT.phones[0].href },
    { icon: Mail, label: t.contact.email, value: CONTACT.email, href: `mailto:${CONTACT.email}` },
    { icon: Clock, label: t.contact.hours, value: t.contact.hoursValue },
  ];
  return (
    <>
      <Hero {...props} description={t.sections.contact.intro} />
      <Container>
        <Stagger className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((c) => (
            <StaggerItem key={c.label} className="rounded-2xl border border-line bg-white p-5">
              <c.icon className="size-5 text-gold-700" aria-hidden="true" />
              <p className="mt-4 text-[13px] text-slate-500">{c.label}</p>
              {c.href ? (
                <a href={c.href} {...(c.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})} className="focus-ring mt-1 block whitespace-pre-line rounded font-semibold text-navy-900 underline-offset-4 hover:underline" dir={c.icon === Phone ? 'ltr' : undefined}>
                  {c.value}
                </a>
              ) : (
                <p className="mt-1 font-semibold text-navy-900">{c.value}</p>
              )}
            </StaggerItem>
          ))}
        </Stagger>

        <div className="mt-12 grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Reveal>
              <ContactForm topics={topics} />
            </Reveal>
          </div>
          <div className="space-y-6 lg:col-span-5">
            <div className="rounded-2xl border border-line bg-white p-6">
              <p className="text-[13px] text-slate-500">{t.contact.swift}</p>
              <p className="mt-1 flex items-center justify-between gap-2 text-lg font-bold text-navy-900">
                <span dir="ltr" className="tabular-nums">
                  {INSTITUTION.requisites.swift}
                </span>
                <CopyValue value={INSTITUTION.requisites.swift} label={t.contact.swift} />
              </p>
            </div>
            {rest.length > 0 && (
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">{t.contact.officialContent}</p>
                {page.fallback && <FallbackNotice t={t} />}
                <Blocks blocks={rest} t={t} />
              </div>
            )}
          </div>
        </div>
        {map && map.type === 'map' && (
          <div className="mt-12">
            <Blocks blocks={[map]} t={t} />
          </div>
        )}
      </Container>
    </>
  );
}

/* ------------------------------------------------------------------ Calculator */

export function CalculatorTemplate(props: Props & { usdSell: number | null }) {
  const { page, t, locale, usdSell } = props;
  const accordion = page.content.blocks.filter((b): b is Extract<Block, { type: 'accordion' }> => b.type === 'accordion');
  return (
    <>
      <Hero {...props} description={t.calc.lead} />
      <Container>
        <Reveal variant="fade">
          <LoanCalculator usdSell={usdSell} />
        </Reveal>
        <div className="mt-6 space-y-2 text-[13px] text-slate-600">
          <p>{t.calc.sourceNote}</p>
          <p className="font-medium text-warning">{t.calc.discrepancy}</p>
        </div>
        <div className="mt-14 grid gap-10 lg:grid-cols-12">
          <div className="min-w-0 lg:col-span-8">
            <h2 className="text-2xl font-bold text-navy-900">{t.calc.officialTerms}</h2>
            <GoldRule className="mt-3 w-16" />
            <div className="mt-6">
              {page.fallback && <FallbackNotice t={t} />}
              <Blocks blocks={accordion} t={t} />
            </div>
          </div>
          <aside className="lg:col-span-4">
            <a href={LINKS.legacyCalculator} target="_blank" rel="noopener noreferrer" className="focus-ring group block rounded-2xl border border-dashed border-slate-300 bg-white p-6 transition-colors hover:border-navy-900/30">
              <p className="font-semibold text-navy-900">{t.calc.legacyCalculator}</p>
              <p className="mt-1 break-all text-[13px] text-slate-500">api.bmibaku.az</p>
              <ExternalIcon className="mt-4 size-4 text-slate-400 group-hover:text-navy-900" aria-hidden="true" />
              <span className="sr-only"> {t.common.newTab}</span>
            </a>
          </aside>
        </div>
      </Container>
      <CtaBand t={t} locale={locale} />
    </>
  );
}

/* ------------------------------------------------------------------ Credit application */

export function ApplicationTemplate(props: Props & { formFields: import('@/content/types').FormField[] }) {
  const { page, t, formFields } = props;
  const extra = page.content.blocks.filter((b) => b.type === 'accordion');
  const productNames = Object.fromEntries(CREDIT_PRODUCTS.map((p) => [p.id, t.creditProducts[p.id]]));
  return (
    <>
      <Hero {...props} description={t.apply.lead} />
      <Container>
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="min-w-0 lg:col-span-8">
            {page.fallback && <FallbackNotice t={t} />}
            <CreditApplicationForm fields={formFields} productNames={productNames} />
          </div>
          <aside className="space-y-6 lg:col-span-4">
            <Reveal variant="scale" className="rounded-2xl bg-navy-900 p-6 text-white">
              <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-gold-400">{t.apply.stepsTitle}</h2>
              <ol className="mt-5 space-y-5">
                {t.apply.steps.map((s, i) => (
                  <li key={s} className="flex gap-4">
                    <span className="grid size-8 shrink-0 place-items-center rounded-full bg-gold-500 text-sm font-bold text-navy-950 tabular-nums">{i + 1}</span>
                    <span className="pt-1 text-sm leading-relaxed text-white/80">{s}</span>
                  </li>
                ))}
              </ol>
            </Reveal>
            {extra.length > 0 && <Blocks blocks={extra} t={t} />}
          </aside>
        </div>
      </Container>
    </>
  );
}

/* ------------------------------------------------------------------ Rates history */

export function RatesTemplate(props: Props & { latest: RatesSnapshot; latestError: boolean; history: HistoryPage | null }) {
  const { t, locale, latest, latestError, history } = props;
  return (
    <>
      <Hero {...props} description={t.history.lead} />
      <Container>
        <RatesPanel data={latest} error={latestError} />
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-navy-900">{t.history.title}</h2>
          <GoldRule className="mt-3 w-16" />
          <div className="mt-6">
            <RateHistory initial={history} />
          </div>
        </div>
      </Container>
      <CtaBand t={t} locale={locale} />
    </>
  );
}

/* ------------------------------------------------------------------ Property */

/** Splits property content into listing cards: each gallery closes one listing. */
function toListings(blocks: Block[]): Block[][] {
  const listings: Block[][] = [];
  let current: Block[] = [];
  for (const b of blocks) {
    current.push(b);
    if (b.type === 'gallery') {
      listings.push(current);
      current = [];
    }
  }
  if (current.some((b) => b.type !== 'heading')) listings.push(current);
  return listings;
}

export function PropertyTemplate(props: Props) {
  const { route, page, t, locale } = props;
  const children = childrenOf(route.slug);
  const listings = children.length ? [] : toListings(page.content.blocks.filter((b) => b.type !== 'links'));
  return (
    <>
      <Hero {...props} description={t.sections.property.intro} />
      <Container>
        {page.fallback && <FallbackNotice t={t} />}
        {children.length > 0 && <RouteTiles routes={children} locale={locale} t={t} />}
        {!children.length && listings.length === 0 && <EmptyState text={t.property.empty} />}
        <div className="space-y-10">
          {listings.map((blocks, i) => (
            <Reveal key={i} variant="rise" className="rounded-2xl border border-line bg-white p-5 sm:p-8">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.14em] text-gold-700">{fmt(t.property.listing, { n: i + 1 })}</p>
              <Blocks blocks={blocks} t={t} />
            </Reveal>
          ))}
        </div>
        <div className="mt-12 rounded-2xl bg-navy-50 p-6 sm:flex sm:items-center sm:justify-between sm:gap-6">
          <div>
            <p className="font-semibold text-navy-900">{t.property.inquiry}</p>
            <p className="mt-1 text-sm text-slate-600">{t.property.inquiryText}</p>
          </div>
          <div className="mt-4 flex flex-wrap gap-2 sm:mt-0">
            <a href={CONTACT.phones[0].href} className={buttonClass('primary', 'md')} dir="ltr">
              <Phone className="size-4" aria-hidden="true" />
              {CONTACT.phones[0].display}
            </a>
            <a href={`mailto:${CONTACT.email}`} className={buttonClass('secondary', 'md')}>
              <Mail className="size-4" aria-hidden="true" />
              {CONTACT.email}
            </a>
          </div>
        </div>
      </Container>
    </>
  );
}

/** Helper for the hub: years and latest date in the financial statements archive. */
export function reportFacts(locale: Locale): { years: number[]; latest: string | null } {
  const page = loadPage('maliyye-hesabatlari', locale) ?? loadPage('maliyye-hesabatlari', 'az');
  const docs = page?.content.documents ?? [];
  const years = docs.map((d) => d.year).filter((y): y is number => !!y);
  const dates = docs.flatMap((d) => d.dates).sort();
  return { years, latest: dates[dates.length - 1] ?? null };
}
