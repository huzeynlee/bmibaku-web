import 'server-only';
import type { Dictionary } from '@/i18n/az';
import { localePath, type Locale } from '@/i18n/config';
import { LINKS } from '@/data/banking';
import { pageTitle } from './load';
import { INSTITUTION_GROUPS, ROUTES, childrenOf, groupRoutes, type InstitutionGroup } from './routes';
import type { LucideIconName } from './icons';

export interface NavLink {
  slug: string;
  href: string;
  title: string;
  icon: LucideIconName;
  external?: boolean;
}

export interface NavData {
  individual: NavLink[];
  corporate: NavLink[];
  institution: { group: InstitutionGroup; label: string; items: NavLink[] }[];
  tools: NavLink[];
}

const link = (slug: string, icon: LucideIconName, locale: Locale): NavLink => ({ slug, icon, href: localePath(locale, slug), title: pageTitle(slug, locale) });

export function getNav(locale: Locale, t: Dictionary): NavData {
  const individual = childrenOf('ferdi-bankciliq').map((r) => link(r.slug, r.icon, locale));
  // The source sidebar lists "Bankomatlarımız" (external map search) right after plastic cards.
  const cardsIndex = individual.findIndex((l) => l.slug === 'plastik-kartlar-ferdi');
  individual.splice(cardsIndex + 1, 0, { slug: 'atm', href: LINKS.atms, title: t.nav.atm, icon: 'Building2', external: true });

  return {
    individual,
    corporate: ROUTES.filter((r) => r.section === 'corporate' && r.template !== 'overview').map((r) => link(r.slug, r.icon, locale)),
    institution: INSTITUTION_GROUPS.map((group) => ({ group, label: t.groups[group], items: groupRoutes(group).map((r) => link(r.slug, r.icon, locale)) })),
    tools: ['kredit-kalkulatoru', 'online-kredit-sifarisi', 'valyuta-tarixcesi'].map((s) => link(s, ROUTES.find((r) => r.slug === s)!.icon, locale)),
  };
}
