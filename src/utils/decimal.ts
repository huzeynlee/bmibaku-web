// Fixed-point decimal arithmetic on BigInt (8 fractional digits).
// Used for currency conversion so published rates are applied exactly.

const DIGITS = 8;
const SCALE = 10n ** BigInt(DIGITS);

export type Fixed = bigint;

/** Parses "1234.56" or "1234,56". Returns null for anything else (signs, exponents, text). */
export function parseFixed(input: string): Fixed | null {
  const s = input.trim().replace(/[\s ]/g, '').replace(',', '.');
  if (!/^\d+(\.\d+)?$/.test(s)) return null;
  const [whole = '0', frac = ''] = s.split('.');
  const padded = (frac + '0'.repeat(DIGITS)).slice(0, DIGITS);
  return BigInt(whole) * SCALE + BigInt(padded);
}

/** a / b rounded half-up, for non-negative operands. */
function divRound(a: bigint, b: bigint): bigint {
  if (b === 0n) throw new RangeError('Division by zero');
  return (a * 2n + b) / (2n * b);
}

export const fromInteger = (n: number): Fixed => BigInt(Math.trunc(n)) * SCALE;

export function mul(a: Fixed, b: Fixed): Fixed {
  return divRound(a * b, SCALE);
}

export function div(a: Fixed, b: Fixed): Fixed {
  return divRound(a * SCALE, b);
}

export function roundTo(a: Fixed, digits: number): Fixed {
  const factor = 10n ** BigInt(DIGITS - digits);
  return divRound(a, factor) * factor;
}

export const isZero = (a: Fixed): boolean => a === 0n;

/** Splits a value into integer and fraction strings with `digits` decimals. */
export function toParts(a: Fixed, digits: number): { whole: bigint; fraction: string } {
  const r = roundTo(a, digits);
  const whole = r / SCALE;
  const fraction = (r % SCALE).toString().padStart(DIGITS, '0').slice(0, digits);
  return { whole, fraction };
}

export const MAX_AMOUNT: Fixed = 1_000_000_000n * SCALE;
