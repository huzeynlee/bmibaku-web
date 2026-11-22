import type { Provenance } from '@/types/banking';

const CALC_PAGE: Provenance = { status: 'official-site', source: 'https://bmibaku.az/kredit-kalkulatoru/ and /kreditler-ferdi/', checkedOn: '2026-11-22' };
const HOME_PAGE: Provenance = {
  status: 'needs-verification',
  source: 'https://bmibaku.az/ (home page slider)',
  checkedOn: '2026-11-22',
  note: 'Promotional rates. The cash-loan rate (8%) differs from the product pages (12%).',
};

export type PromoId = 'cash' | 'business' | 'consumer' | 'auto';

/** Home page promotional products, exactly as published in the home page slider. */
export const PROMO_PRODUCTS: { id: PromoId; rate: number | null; termsSlug: string; calcProduct: CreditProductId | null }[] = [
  { id: 'cash', rate: 8, termsSlug: 'kreditler-ferdi', calcProduct: 'cash' },
  { id: 'business', rate: 10, termsSlug: 'kreditler-ferdi', calcProduct: 'business' },
  { id: 'consumer', rate: 12, termsSlug: 'kreditler-ferdi', calcProduct: 'consumer' },
  { id: 'auto', rate: null, termsSlug: 'kreditler-ferdi', calcProduct: 'auto' },
];
export const PROMO_PROVENANCE = HOME_PAGE;

export type CreditProductId = 'auto' | 'realEstate' | 'depositSecured' | 'cash' | 'consumer' | 'gold' | 'creditCard' | 'business';

export type CreditLimit =
  | { kind: 'usd'; usd: number } // "… ABŞ dollarının manat ekvivalentinədək"
  | { kind: 'azn'; azn: number }
  | { kind: 'collateral'; share: number }; // percent of the deposit / gold value

export interface CreditProduct {
  id: CreditProductId;
  /** Lowest published annual rate, percent. */
  rate: number;
  rateIsMinimum: boolean;
  maxTermMonths: number;
  limit: CreditLimit;
  /** Bank service fee, percent (published on /kreditler-ferdi/). Not included in the payment calculation. */
  serviceFee: number;
  provenance: Provenance;
}

/** Products and terms from the official "Kredit Kalkulyatoru" and "Kreditlər" pages. */
export const CREDIT_PRODUCTS: CreditProduct[] = [
  { id: 'cash', rate: 12, rateIsMinimum: true, maxTermMonths: 60, limit: { kind: 'usd', usd: 10000 }, serviceFee: 1, provenance: CALC_PAGE },
  { id: 'consumer', rate: 12, rateIsMinimum: true, maxTermMonths: 60, limit: { kind: 'usd', usd: 10000 }, serviceFee: 1, provenance: CALC_PAGE },
  { id: 'business', rate: 10, rateIsMinimum: true, maxTermMonths: 60, limit: { kind: 'usd', usd: 150000 }, serviceFee: 1, provenance: CALC_PAGE },
  { id: 'auto', rate: 12, rateIsMinimum: true, maxTermMonths: 60, limit: { kind: 'usd', usd: 15000 }, serviceFee: 1, provenance: CALC_PAGE },
  { id: 'realEstate', rate: 12, rateIsMinimum: true, maxTermMonths: 60, limit: { kind: 'usd', usd: 100000 }, serviceFee: 1, provenance: CALC_PAGE },
  { id: 'depositSecured', rate: 10, rateIsMinimum: false, maxTermMonths: 60, limit: { kind: 'collateral', share: 90 }, serviceFee: 1, provenance: CALC_PAGE },
  { id: 'gold', rate: 20, rateIsMinimum: false, maxTermMonths: 36, limit: { kind: 'collateral', share: 70 }, serviceFee: 1, provenance: CALC_PAGE },
  { id: 'creditCard', rate: 22, rateIsMinimum: false, maxTermMonths: 12, limit: { kind: 'azn', azn: 3000 }, serviceFee: 1, provenance: CALC_PAGE },
];

/** Calculator upper bound for collateral-based products (a UI limit, not a bank limit). */
export const COLLATERAL_CALC_MAX_AZN = 100000;
export const CALC_MIN = { amount: 500, termMonths: 3 };
export const DEFAULT_CALC = { productId: 'cash' as CreditProductId, amount: 10000, termMonths: 24 };

export const getCreditProduct = (id: CreditProductId): CreditProduct => CREDIT_PRODUCTS.find((p) => p.id === id) ?? CREDIT_PRODUCTS[0]!;

/** Maximum calculable amount in AZN, using the official USD selling rate for USD-denominated limits. */
export function maxAmountAzn(p: CreditProduct, usdSell: number | null): number {
  if (p.limit.kind === 'azn') return p.limit.azn;
  if (p.limit.kind === 'collateral') return COLLATERAL_CALC_MAX_AZN;
  const rate = usdSell && usdSell > 0 ? usdSell : 1.7;
  return Math.floor((p.limit.usd * rate) / 100) * 100;
}
