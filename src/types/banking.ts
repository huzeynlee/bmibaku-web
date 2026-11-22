export type Lang = 'az' | 'en' | 'fa';

/**
 * Where a published fact comes from.
 * - `official-site`: copied from bmibaku.az on the date in `checkedOn`.
 * - `needs-verification`: supplied as draft content; confirm before publishing.
 */
export type VerificationStatus = 'official-site' | 'needs-verification';

export interface Provenance {
  status: VerificationStatus;
  source?: string;
  checkedOn?: string; // YYYY-MM-DD
  note?: string;
}

export type CurrencyCode = 'USD' | 'EUR' | 'IRR' | 'AED' | 'RUB';
export type RateMode = 'cash' | 'noncash';

/** Decimal strings ("1.6970") keep the exact published values. */
export interface RatePair {
  buy: string;
  sell: string;
}

export interface CurrencyRate {
  code: CurrencyCode;
  /** Rates are quoted in AZN per `unit` units of the currency (100 for IRR). */
  unit: number;
  cash: RatePair | null;
  noncash: RatePair | null;
}

export interface RatesSnapshot {
  /** Publication date of the rates, YYYY-MM-DD. */
  asOf: string;
  /** True only when the data came from a live rates API. */
  live: boolean;
  source: { label: string; url: string };
  items: CurrencyRate[];
}

export interface RateHistoryPoint {
  date: string; // YYYY-MM-DD
  cash: RatePair | null;
  noncash: RatePair | null;
}

export type RateHistoryResult =
  | { status: 'unavailable' }
  | { status: 'ok'; code: CurrencyCode; points: RateHistoryPoint[] };

export type LoanProductId = 'cash' | 'business' | 'consumer' | 'auto';

export interface LoanProduct {
  id: LoanProductId;
  /** Starting annual rate in percent; null when no published rate exists. */
  annualRate: number | null;
  /** Official page with the product terms. */
  termsUrl: string;
  provenance: Provenance;
}

export interface LoanInput {
  productId: LoanProductId;
  amount: number;
  termMonths: number;
}

export interface LoanSummary {
  principal: number;
  annualRate: number;
  termMonths: number;
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
}

export interface LoanApplicationPayload {
  firstName: string;
  lastName: string;
  /** E.164, e.g. +994501234567 */
  phone: string;
  productId: LoanProductId;
  amount: number;
  termMonths: number;
  consent: true;
  consentAt: string; // ISO timestamp
  locale: Lang;
}

export type LoanApplicationResult = { mode: 'live'; reference: string } | { mode: 'demo' };
