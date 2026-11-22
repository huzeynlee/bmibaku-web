import { useMemo } from 'react';
import type { LoanInput, LoanSummary } from '../types/banking';
import { CALCULATOR_PRODUCTS } from '../data/loanProducts';
import { summarizeLoan } from '../utils/calculations';

/** Payment summary for the calculator. Products without a published rate fall back to the first calculable one. */
export function useLoanCalculator(input: LoanInput): LoanSummary {
  return useMemo(() => {
    const product = CALCULATOR_PRODUCTS.find((p) => p.id === input.productId) ?? CALCULATOR_PRODUCTS[0];
    return summarizeLoan(input.amount, product?.annualRate ?? 0, input.termMonths);
  }, [input.productId, input.amount, input.termMonths]);
}
