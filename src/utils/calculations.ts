import type { LoanSummary } from '../types/banking';

export const roundMoney = (v: number): number => Math.round((v + Number.EPSILON) * 100) / 100;

/**
 * Fixed-payment (annuity) amortization.
 * r = annual rate / 12, n = months, M = P·r·(1+r)^n / ((1+r)^n − 1); r = 0 → M = P / n.
 */
export function monthlyPayment(principal: number, annualRatePercent: number, months: number): number {
  if (!(principal > 0) || !(months > 0)) return 0;
  const r = annualRatePercent / 100 / 12;
  if (r === 0) return principal / months;
  const growth = Math.pow(1 + r, months);
  return (principal * r * growth) / (growth - 1);
}

export function summarizeLoan(principal: number, annualRatePercent: number, termMonths: number): LoanSummary {
  const monthly = roundMoney(monthlyPayment(principal, annualRatePercent, termMonths));
  const total = roundMoney(monthly * termMonths);
  return {
    principal,
    annualRate: annualRatePercent,
    termMonths,
    monthlyPayment: monthly,
    totalPayment: total,
    totalInterest: roundMoney(Math.max(0, total - principal)),
  };
}

export const clamp = (v: number, min: number, max: number): number => Math.min(max, Math.max(min, v));

/** Rounds to the nearest step and clamps into range. */
export const snap = (v: number, min: number, max: number, step: number): number =>
  clamp(Math.round(v / step) * step, min, max);
