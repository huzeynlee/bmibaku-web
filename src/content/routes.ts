import type { LucideIconName } from './icons';

export type Section = 'individual' | 'corporate' | 'institution' | 'property' | 'gallery' | 'contact' | 'tools';

export type Template =
  | 'overview' // audience landing (Fərdi / Korporativ)
  | 'hub' // institutional hub (Haqqımızda)
  | 'content' // generic page: prose, tables, documents
  | 'gallery'
  | 'contact'
  | 'calculator'
  | 'application'
  | 'rates'
  | 'property';

export type InstitutionGroup = 'about' | 'governance' | 'financial' | 'other';

export interface RouteDef {
  slug: string;
  section: Section;
  template: Template;
  parent?: string;
  group?: InstitutionGroup;
  icon: LucideIconName;
}

/**
 * Every published route of the site. Slugs are the original bmibaku.az slugs,
 * so AZ URLs stay identical. Order defines navigation order.
 */
export const ROUTES: RouteDef[] = [
  // Individual banking
  { slug: 'ferdi-bankciliq', section: 'individual', template: 'overview', icon: 'UserRound' },
  { slug: 'cari-hesablar-ferdi', section: 'individual', template: 'content', parent: 'ferdi-bankciliq', icon: 'Wallet' },
  { slug: 'plastik-kartlar-ferdi', section: 'individual', template: 'content', parent: 'ferdi-bankciliq', icon: 'CreditCard' },
  { slug: 'emanetler-ferdi', section: 'individual', template: 'content', parent: 'ferdi-bankciliq', icon: 'PiggyBank' },
  { slug: 'kreditler-ferdi', section: 'individual', template: 'content', parent: 'ferdi-bankciliq', icon: 'HandCoins' },
  { slug: 'pul-kocurmeleri-ferdi', section: 'individual', template: 'content', parent: 'ferdi-bankciliq', icon: 'Send' },
  { slug: 'online-xidmetler', section: 'individual', template: 'content', parent: 'ferdi-bankciliq', icon: 'MonitorSmartphone' },
  { slug: 'bank-tarifleri-ferdi', section: 'individual', template: 'content', parent: 'ferdi-bankciliq', icon: 'ReceiptText' },

  // Corporate banking
  { slug: 'korporativ-bankciliq', section: 'corporate', template: 'overview', icon: 'Building2' },
  { slug: 'cari-hesablar-korporativ', section: 'corporate', template: 'content', parent: 'korporativ-bankciliq', icon: 'Briefcase' },
  { slug: 'nagdsiz-emeliyyatlar-korporativ', section: 'corporate', template: 'content', parent: 'korporativ-bankciliq', icon: 'ArrowLeftRight' },
  { slug: 'akkreditivin-verilmesi', section: 'corporate', template: 'content', parent: 'nagdsiz-emeliyyatlar-korporativ', icon: 'FileCheck2' },
  { slug: 'senedler-toplusu', section: 'corporate', template: 'content', parent: 'nagdsiz-emeliyyatlar-korporativ', icon: 'Files' },
  { slug: 'bank-zemanetinin-verilmesi', section: 'corporate', template: 'content', parent: 'nagdsiz-emeliyyatlar-korporativ', icon: 'ShieldCheck' },
  { slug: 'depozitler-korporativ', section: 'corporate', template: 'content', parent: 'korporativ-bankciliq', icon: 'Landmark' },
  { slug: 'kreditler-korporativ', section: 'corporate', template: 'content', parent: 'korporativ-bankciliq', icon: 'TrendingUp' },
  { slug: 'bank-tarifleri-korporativ', section: 'corporate', template: 'content', parent: 'korporativ-bankciliq', icon: 'ReceiptText' },

  // Institutional hub
  { slug: 'haqqimizda', section: 'institution', template: 'hub', icon: 'Landmark' },
  { slug: 'bank-ve-onun-fealiyyeti', section: 'institution', template: 'content', parent: 'haqqimizda', group: 'about', icon: 'Landmark' },
  { slug: 'inkisaf-strategiyasi', section: 'institution', template: 'content', parent: 'bank-ve-onun-fealiyyeti', group: 'about', icon: 'Compass' },
  { slug: 'meqsed-ve-hedefler', section: 'institution', template: 'content', parent: 'bank-ve-onun-fealiyyeti', group: 'about', icon: 'Target' },
  { slug: 'bankin-bisness-felsefesi', section: 'institution', template: 'content', parent: 'bank-ve-onun-fealiyyeti', group: 'about', icon: 'Lightbulb' },
  { slug: 'bankin-sehmdari', section: 'institution', template: 'content', parent: 'haqqimizda', group: 'about', icon: 'Users' },
  { slug: 'idare-heyati-struktur', section: 'institution', template: 'content', parent: 'haqqimizda', group: 'about', icon: 'Network' },
  { slug: 'departamentler', section: 'institution', template: 'content', parent: 'haqqimizda', group: 'about', icon: 'LayoutGrid' },

  { slug: 'kapitalin-strukturu-ve-adekvatligi', section: 'institution', template: 'content', parent: 'haqqimizda', group: 'governance', icon: 'Scale' },
  { slug: 'daxili-komiteler-ve-kenar-auditor', section: 'institution', template: 'content', parent: 'haqqimizda', group: 'governance', icon: 'ClipboardCheck' },
  { slug: 'risklerinin-idaraedilmesi', section: 'institution', template: 'content', parent: 'haqqimizda', group: 'governance', icon: 'ShieldHalf' },
  { slug: 'risk-siyaseti', section: 'institution', template: 'content', parent: 'risklerinin-idaraedilmesi', group: 'governance', icon: 'ScrollText' },
  { slug: 'risk-idaraetme-strukturu-ve-selahiyyetleri', section: 'institution', template: 'content', parent: 'risklerinin-idaraedilmesi', group: 'governance', icon: 'Network' },
  { slug: 'kredit-riski-melumatlari', section: 'institution', template: 'content', parent: 'risklerinin-idaraedilmesi', group: 'governance', icon: 'FileBarChart' },
  { slug: 'likvidlik-riski-melumatlari', section: 'institution', template: 'content', parent: 'risklerinin-idaraedilmesi', group: 'governance', icon: 'Droplets' },
  { slug: 'bazar-risklerinin-olculmesi', section: 'institution', template: 'content', parent: 'risklerinin-idaraedilmesi', group: 'governance', icon: 'LineChart' },
  { slug: 'valyuta-movqeyi', section: 'institution', template: 'content', parent: 'risklerinin-idaraedilmesi', group: 'governance', icon: 'Coins' },
  { slug: 'stress-testlesdirme-ve-ssenariler', section: 'institution', template: 'content', parent: 'risklerinin-idaraedilmesi', group: 'governance', icon: 'Activity' },
  { slug: 'prudensial-normativler', section: 'institution', template: 'content', parent: 'risklerinin-idaraedilmesi', group: 'governance', icon: 'Gauge' },
  { slug: 'kredit-bolgusu', section: 'institution', template: 'content', parent: 'risklerinin-idaraedilmesi', group: 'governance', icon: 'PieChart' },

  { slug: 'maliyye-veziyyeti-gostericileri', section: 'institution', template: 'content', parent: 'haqqimizda', group: 'financial', icon: 'BarChart3' },
  { slug: 'balans', section: 'institution', template: 'content', parent: 'maliyye-veziyyeti-gostericileri', group: 'financial', icon: 'Scale' },
  { slug: 'menfeet-zerer', section: 'institution', template: 'content', parent: 'maliyye-veziyyeti-gostericileri', group: 'financial', icon: 'TrendingUp' },
  { slug: 'kapitalda-deyisiklikler-haqqinda-hesabat', section: 'institution', template: 'content', parent: 'maliyye-veziyyeti-gostericileri', group: 'financial', icon: 'FileSpreadsheet' },
  { slug: 'pul-vesaitlerinin-hereketi', section: 'institution', template: 'content', parent: 'maliyye-veziyyeti-gostericileri', group: 'financial', icon: 'ArrowLeftRight' },
  { slug: 'maliyye-hesabatlari', section: 'institution', template: 'content', parent: 'haqqimizda', group: 'financial', icon: 'FileText' },

  { slug: 'emlak-satisi', section: 'property', template: 'property', parent: 'haqqimizda', group: 'other', icon: 'Building' },
  { slug: 'yasayis-evleri-menziller', section: 'property', template: 'property', parent: 'emlak-satisi', group: 'other', icon: 'Home' },
  { slug: 'qeyri-yasayis-obyektleri', section: 'property', template: 'property', parent: 'emlak-satisi', group: 'other', icon: 'Warehouse' },
  { slug: 'avtomobiller', section: 'property', template: 'property', parent: 'emlak-satisi', group: 'other', icon: 'Car' },
  { slug: 'elanlar', section: 'institution', template: 'content', parent: 'haqqimizda', group: 'other', icon: 'Megaphone' },
  { slug: 'vakansiyalar', section: 'institution', template: 'content', parent: 'haqqimizda', group: 'other', icon: 'BriefcaseBusiness' },

  // Standalone
  { slug: 'foto-qalereya', section: 'gallery', template: 'gallery', icon: 'Images' },
  { slug: 'contact', section: 'contact', template: 'contact', icon: 'Phone' },
  { slug: 'kredit-kalkulatoru', section: 'tools', template: 'calculator', icon: 'Calculator' },
  { slug: 'online-kredit-sifarisi', section: 'tools', template: 'application', icon: 'FilePen' },
  { slug: 'valyuta-tarixcesi', section: 'tools', template: 'rates', icon: 'History' },
];

/** Source pages intentionally not published (empty or test pages on bmibaku.az). */
export const EXCLUDED_SOURCE_PAGES = [
  { slug: 'test', reason: 'Empty test page in the source CMS.' },
  { slug: 'portmanat', reason: 'Empty page in the source CMS.' },
  { slug: 'maliyye-veziyyeti-haqqinda-hesabat-13-04-2018', reason: 'Empty page; redirected to /maliyye-hesabatlari/.' },
  { slug: 'index', reason: 'Source homepage; replaced by / (redirected).' },
];

const BY_SLUG = new Map(ROUTES.map((r) => [r.slug, r]));

export const getRoute = (slug: string): RouteDef | undefined => BY_SLUG.get(slug);

/** Parent chain from the top-level section down to the page (excluding home). */
export function ancestry(slug: string): RouteDef[] {
  const chain: RouteDef[] = [];
  let current = BY_SLUG.get(slug);
  while (current) {
    chain.unshift(current);
    current = current.parent ? BY_SLUG.get(current.parent) : undefined;
  }
  return chain;
}

export const childrenOf = (slug: string): RouteDef[] => ROUTES.filter((r) => r.parent === slug);

export const INSTITUTION_GROUPS: InstitutionGroup[] = ['about', 'governance', 'financial', 'other'];

/** Top-level pages of an institutional group (direct children of the hub). */
export const groupRoutes = (group: InstitutionGroup): RouteDef[] =>
  ROUTES.filter((r) => r.group === group && r.parent === 'haqqimizda');

/** Navigation set shown in a page's sidebar. */
export function sidebarFor(slug: string): RouteDef[] {
  const route = BY_SLUG.get(slug);
  if (!route) return [];
  if (route.section === 'individual') return childrenOf('ferdi-bankciliq');
  if (route.section === 'corporate') return ROUTES.filter((r) => r.section === 'corporate' && r.template !== 'overview');
  return [];
}
