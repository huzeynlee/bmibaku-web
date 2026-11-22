import {
  ArrowLeftRight,
  Briefcase,
  Building2,
  CreditCard,
  FileText,
  Globe,
  HandCoins,
  MapPin,
  PiggyBank,
  Send,
  TrendingUp,
  Wallet,
  type LucideIcon,
} from 'lucide-react';
import type { Dictionary } from '../../i18n/az';
import { LINKS } from '../../data/banking';
import { CORPORATE_SERVICES, INDIVIDUAL_SERVICES, QUICK_SERVICES } from '../../data/navigation';

export interface ServiceLink {
  key: string;
  title: string;
  desc: string;
  href: string;
  icon: LucideIcon;
}

const INDIVIDUAL_ICONS = { currentAccount: Wallet, cards: CreditCard, deposits: PiggyBank, loans: HandCoins, tariffs: FileText };
const CORPORATE_ICONS = { currentAccount: Briefcase, noncash: ArrowLeftRight, deposits: PiggyBank, loans: TrendingUp, transfers: Globe };
const QUICK_ICONS = { cards: CreditCard, transfers: Send, atm: MapPin, property: Building2 };

export const individualLinks = (t: Dictionary): ServiceLink[] =>
  INDIVIDUAL_SERVICES.map((k) => ({ key: k, ...t.individual.services[k], href: LINKS.individual[k], icon: INDIVIDUAL_ICONS[k] }));

export const corporateLinks = (t: Dictionary): ServiceLink[] =>
  CORPORATE_SERVICES.map((k) => ({ key: k, ...t.corporate.services[k], href: LINKS.corporate[k], icon: CORPORATE_ICONS[k] }));

export const quickLinks = (t: Dictionary): ServiceLink[] =>
  QUICK_SERVICES.map((k) => ({ key: k, ...t.services.items[k], href: LINKS.services[k], icon: QUICK_ICONS[k] }));
