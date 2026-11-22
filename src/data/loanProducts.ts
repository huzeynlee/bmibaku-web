import type { LoanProduct, LoanProductId } from '../types/banking';
import { LINKS } from './banking';

const HOME = { status: 'official-site', source: 'https://bmibaku.az/ (home page slider)', checkedOn: '2026-11-22' } as const;

/** Starting rates as published on the official home page. */
export const LOAN_PRODUCTS: LoanProduct[] = [
  { id: 'cash', annualRate: 8, termsUrl: LINKS.individual.loans, provenance: HOME },
  { id: 'business', annualRate: 10, termsUrl: LINKS.corporate.loans, provenance: HOME },
  { id: 'consumer', annualRate: 12, termsUrl: LINKS.individual.loans, provenance: HOME },
  {
    id: 'auto',
    annualRate: null,
    termsUrl: LINKS.individual.loans,
    provenance: { ...HOME, note: 'No rate is published for car loans. Keep annualRate null until the bank confirms one.' },
  },
];

/** Products with a published rate can be used in the calculator. */
export const CALCULATOR_PRODUCTS = LOAN_PRODUCTS.filter(
  (p): p is LoanProduct & { annualRate: number } => p.annualRate !== null,
);

export const LOAN_LIMITS = {
  amount: { min: 500, max: 50000, step: 100 },
  term: { min: 3, max: 48, step: 1 },
} as const;

export const DEFAULT_LOAN = { productId: 'cash' as LoanProductId, amount: 10000, termMonths: 24 };

export function getLoanProduct(id: LoanProductId): LoanProduct {
  const product = LOAN_PRODUCTS.find((p) => p.id === id);
  if (!product) throw new Error(`Unknown loan product: ${id}`);
  return product;
}
