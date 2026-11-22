export type Lang = 'az' | 'en' | 'fa';

/**
 * Where a published fact comes from.
 * - `official-site`: copied from bmibaku.az on the date in `checkedOn`.
 * - `needs-verification`: published, but inconsistent or group-level; confirm before launch.
 */
export type VerificationStatus = 'official-site' | 'needs-verification' | 'unavailable';

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
  asOf: string; // YYYY-MM-DD
  /** True when fetched from the bank's rate system at render time. */
  live: boolean;
  source: { label: string; url: string };
  items: CurrencyRate[];
}

export interface LoanSummary {
  principal: number;
  annualRate: number;
  termMonths: number;
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
}
