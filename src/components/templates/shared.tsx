import Link from 'next/link';
import { ArrowUpRight, Mail, Phone } from 'lucide-react';
import type { Dictionary } from '@/i18n/az';
import { localePath, type Locale } from '@/i18n/config';
import type { Block, PageContent } from '@/content/types';
import { ICONS } from '@/content/icons';
import { pageExcerpt, pageTitle } from '@/content/load';
import { INSTITUTION_GROUPS, ROUTES, ancestry, childrenOf, getRoute, groupRoutes, type RouteDef } from '@/content/routes';
import { CONTACT, LINKS } from '@/data/banking';
import { formatDate } from '@/utils/currency';
import { fmt } from '@/utils/cx';
import { SITE_URL } from '@/lib/site';
import type { Crumb } from '../layout/Breadcrumbs';
import type { SectionNavGroup, SectionNavItem } from '../layout/SectionNav';
import { GoldRule } from '../motion/Motif';
import { Reveal, Stagger, StaggerItem } from '../motion/Reveal';
import { buttonClass } from '../ui/buttonClass';

export { SITE_URL };

export function crumbsFor(slug: string, locale: Locale, t: Dictionary): Crumb[] {
  const chain = ancestry(slug);
  return [{ label: t.common.home, href: localePath(locale) }, ...chain.map((r) => ({ label: pageTitle(r.slug, locale), href: localePath(locale, r.slug) }))];
}

/** Moves a leading introductory paragraph into the hero. */
export function liftIntro(blocks: Block[]): { intro: string | null; rest: Block[] } {
  const first = blocks[0];
  if (first?.type === 'paragraph') {
    const text = first.html.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
    if (text.length > 40 && text.length < 420 && !/<a\s/.test(first.html)) return { intro: text, rest: blocks.slice(1) };
  }
  return { intro: null, rest: blocks };
}

export function SourceMeta({ page, t, locale }: { page: PageContent; t: Dictionary; locale: Locale }) {
  return (
    <span className="inline-flex flex-wrap items-center gap-x-2 gap-y-1">
      <span className="tabular-nums">{fmt(t.common.sourceUpdated, { date: formatDate(page.modified.slice(0, 10), locale) })}</span>
      <span aria-hidden="true">·</span>
      <a href={page.sourceUrl} target="_blank" rel="noopener noreferrer" className="focus-ring-dark rounded underline decoration-white/30 underline-offset-4 hover:text-white">
        {t.common.source_page}
        <span className="sr-only"> {t.common.newTab}</span>
      </a>
    </span>
  );
}

export function RouteTiles({ routes, locale, title, columns = 3 }: { routes: RouteDef[]; locale: Locale; t: Dictionary; title?: string; columns?: 2 | 3 }) {
  if (!routes.length) return null;
  return (
    <section aria-label={title}>
      {title && (
        <Reveal>
          <h2 className="text-xl font-bold text-navy-900">{title}</h2>
        </Reveal>
      )}
      <Stagger as="ul" className={`mt-5 grid gap-3 sm:grid-cols-2 ${columns === 3 ? 'lg:grid-cols-3' : ''}`}>
        {routes.map((r) => {
          const Icon = ICONS[r.icon];
          const excerpt = pageExcerpt(r.slug, locale, 110);
          return (
            <StaggerItem as="li" key={r.slug}>
              <Link
                href={localePath(locale, r.slug)}
                className="focus-ring group flex h-full flex-col gap-5 rounded-xl border border-line bg-white p-5 transition-[border-color,box-shadow,transform] duration-300 ease-out hover:-translate-y-1 hover:border-navy-900/20 hover:shadow-[0_18px_40px_-24px_rgb(11_31_58/0.45)]"
              >
                <span className="flex items-start justify-between">
                  <span className="grid size-11 place-items-center rounded-lg bg-navy-900 text-gold-400 transition-transform duration-300 ease-out group-hover:-rotate-3 group-hover:scale-105">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <ArrowUpRight className="size-5 text-slate-400 transition-[transform,color] duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-navy-900 rtl:-scale-x-100" aria-hidden="true" />
                </span>
                <span>
                  <span className="block font-semibold text-navy-900">{pageTitle(r.slug, locale)}</span>
                  {excerpt && <span className="mt-1.5 line-clamp-3 block text-sm leading-relaxed text-slate-600">{excerpt}</span>}
                </span>
              </Link>
            </StaggerItem>
          );
        })}
      </Stagger>
    </section>
  );
}

const navItem = (r: RouteDef, locale: Locale, depth = 0): SectionNavItem => ({ slug: r.slug, href: localePath(locale, r.slug), title: pageTitle(r.slug, locale), icon: r.icon, depth });

/** Contextual navigation groups for a page, or null when the page has none. */
export function navGroupsFor(slug: string, locale: Locale, t: Dictionary): SectionNavGroup[] | null {
  const route = getRoute(slug);
  if (!route) return null;
  if (route.section === 'individual') {
    const items = childrenOf('ferdi-bankciliq').map((r) => navItem(r, locale));
    const at = items.findIndex((i) => i.slug === 'plastik-kartlar-ferdi') + 1;
    items.splice(at, 0, { slug: 'atm', href: LINKS.atms, title: t.nav.atm, icon: 'Building2', depth: 0, external: true });
    return [{ label: t.nav.individual, items }];
  }
  if (route.section === 'corporate') {
    const items = childrenOf('korporativ-bankciliq').flatMap((r) => [navItem(r, locale), ...childrenOf(r.slug).map((c) => navItem(c, locale, 1))]);
    return [{ label: t.nav.corporate, items }];
  }
  if (route.section === 'institution' || route.section === 'property') {
    const branch = new Set(ancestry(slug).map((r) => r.slug));
    return INSTITUTION_GROUPS.map((g) => ({
      label: t.groups[g],
      items: groupRoutes(g).flatMap((r) => [navItem(r, locale), ...(branch.has(r.slug) ? childrenOf(r.slug).map((c) => navItem(c, locale, 1)) : [])]),
    }));
  }
  return null;
}

export function siblingsOf(slug: string): RouteDef[] {
  const route = getRoute(slug);
  if (!route?.parent) return [];
  return ROUTES.filter((r) => r.parent === route.parent && r.slug !== slug).slice(0, 3);
}

export function CtaBand({ t, locale }: { t: Dictionary; locale: Locale }) {
  return (
    <section className="relative isolate overflow-hidden bg-navy-900 text-white">
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(50%_120%_at_10%_0%,rgb(197_155_39/0.18),transparent_60%)]" />
      <div className="container-page flex flex-col gap-8 py-14 md:flex-row md:items-center md:justify-between">
        <Reveal className="max-w-xl">
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">{t.cta.title}</h2>
          <GoldRule className="mt-4 w-16" />
          <p className="mt-4 text-white/75">{t.cta.text}</p>
        </Reveal>
        <Reveal delay={0.1} className="flex flex-wrap gap-3">
          <a href={CONTACT.phones[0].href} className={buttonClass('gold', 'lg', 'focus-visible:ring-offset-navy-900')} dir="ltr">
            <Phone className="size-4" aria-hidden="true" />
            {CONTACT.phones[0].display}
          </a>
          <a href={`mailto:${CONTACT.email}`} className={buttonClass('onDark', 'lg')}>
            <Mail className="size-4" aria-hidden="true" />
            {CONTACT.email}
          </a>
          <Link href={localePath(locale, 'contact')} className={buttonClass('onDark', 'lg')}>
            {t.cta.contactPage}
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
