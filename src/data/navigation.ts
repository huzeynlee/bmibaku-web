import { LINKS } from './banking';

export type NavKey = 'home' | 'individual' | 'corporate' | 'about' | 'gallery' | 'contact';
export type IndividualServiceKey = 'currentAccount' | 'cards' | 'deposits' | 'loans' | 'tariffs';
export type CorporateServiceKey = 'currentAccount' | 'noncash' | 'deposits' | 'loans' | 'transfers';
export type QuickServiceKey = 'cards' | 'transfers' | 'atm' | 'property';

export interface NavItem {
  key: NavKey;
  href: string;
  /** Section on this page; used for the active indicator. */
  sectionId?: string;
  /** Group of service links shown in a dropdown. */
  menu?: 'individual' | 'corporate';
}

export const NAV_ITEMS: NavItem[] = [
  { key: 'home', href: '#top', sectionId: 'top' },
  { key: 'individual', href: '#individual', sectionId: 'individual', menu: 'individual' },
  { key: 'corporate', href: '#corporate', sectionId: 'corporate', menu: 'corporate' },
  { key: 'about', href: '#about', sectionId: 'about' },
  { key: 'gallery', href: LINKS.gallery },
  { key: 'contact', href: '#contact', sectionId: 'contact' },
];

export const INDIVIDUAL_SERVICES: IndividualServiceKey[] = ['currentAccount', 'cards', 'deposits', 'loans', 'tariffs'];
export const CORPORATE_SERVICES: CorporateServiceKey[] = ['currentAccount', 'noncash', 'deposits', 'loans', 'transfers'];
export const QUICK_SERVICES: QuickServiceKey[] = ['cards', 'transfers', 'atm', 'property'];

export const SECTION_IDS = ['top', 'about', 'rates', 'calculator', 'individual', 'corporate', 'services', 'institution', 'contact'];
