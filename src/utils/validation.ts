// Input normalization and validation for the loan application form.

/** Azerbaijani mobile operator prefixes. */
export const AZ_MOBILE_PREFIXES = ['10', '50', '51', '55', '60', '70', '77', '99'] as const;

/** Removes control characters and collapses whitespace. */
export function sanitizeText(input: string, maxLength = 60): string {
  return input
    .replace(/[\u0000-\u001f\u007f]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLength);
}

/** Letters (any script), spaces, hyphens and apostrophes; 2–50 characters. */
export function isValidName(input: string): boolean {
  const s = sanitizeText(input, 80);
  return s.length >= 2 && s.length <= 50 && /^\p{L}[\p{L}\p{M}\s'’-]*$/u.test(s);
}

/**
 * Accepts +994 50 123 45 67, 994501234567, 050 123 45 67, 501234567.
 * Returns E.164 (+994501234567) or null.
 */
export function normalizeAzMobile(input: string): string | null {
  let digits = input.replace(/\D/g, '');
  if (digits.startsWith('994')) digits = digits.slice(3);
  else if (digits.startsWith('0')) digits = digits.slice(1);
  if (digits.length !== 9) return null;
  const prefix = digits.slice(0, 2);
  if (!(AZ_MOBILE_PREFIXES as readonly string[]).includes(prefix)) return null;
  return `+994${digits}`;
}

/** +994501234567 → +994 50 123 45 67 */
export function formatAzMobile(e164: string): string {
  const d = e164.replace(/^\+994/, '');
  return `+994 ${d.slice(0, 2)} ${d.slice(2, 5)} ${d.slice(5, 7)} ${d.slice(7, 9)}`;
}

export function isIntegerInRange(value: string, min: number, max: number): boolean {
  if (!/^\d+$/.test(value.trim())) return false;
  const n = Number(value);
  return Number.isSafeInteger(n) && n >= min && n <= max;
}
