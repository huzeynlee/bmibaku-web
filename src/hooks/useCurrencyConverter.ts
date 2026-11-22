import { useMemo } from 'react';
import type { CurrencyRate, RateMode } from '../types/banking';
import { div, fromInteger, isZero, mul, MAX_AMOUNT, parseFixed, roundTo, type Fixed } from '../utils/decimal';

export type ConversionDirection = 'toForeign' | 'toAzn';

export type ConversionResult =
  | { status: 'ok'; amount: Fixed; result: Fixed; rate: string; side: 'buy' | 'sell' }
  | { status: 'invalid' | 'too-large' | 'rate-unavailable' };

/**
 * AZN → foreign uses the bank's selling rate; foreign → AZN uses its buying rate.
 * Rates are AZN per `unit` units, so: foreign = AZN × unit / sell, AZN = foreign × buy / unit.
 */
export function convert(rate: CurrencyRate, mode: RateMode, direction: ConversionDirection, amountInput: string): ConversionResult {
  const amount = parseFixed(amountInput);
  if (amount === null || isZero(amount)) return { status: 'invalid' };
  if (amount >= MAX_AMOUNT) return { status: 'too-large' };
  const pair = rate[mode];
  if (!pair) return { status: 'rate-unavailable' };
  const side = direction === 'toForeign' ? 'sell' : 'buy';
  const r = parseFixed(pair[side]);
  if (r === null || isZero(r)) return { status: 'rate-unavailable' };
  const unit = fromInteger(rate.unit);
  const raw = direction === 'toForeign' ? div(mul(amount, unit), r) : div(mul(amount, r), unit);
  return { status: 'ok', amount, result: roundTo(raw, 2), rate: pair[side], side };
}

export function useCurrencyConverter(
  rate: CurrencyRate | undefined,
  mode: RateMode,
  direction: ConversionDirection,
  amountInput: string,
): ConversionResult {
  return useMemo(
    () => (rate ? convert(rate, mode, direction, amountInput) : { status: 'rate-unavailable' }),
    [rate, mode, direction, amountInput],
  );
}
