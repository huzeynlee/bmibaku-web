// Input normalization and validation shared by forms (client) and route handlers (server).

/** Removes control characters and collapses whitespace. */
export function sanitizeText(input: unknown, maxLength = 120): string {
  if (typeof input !== 'string') return '';
  return input
    .replace(/[\u0000-\u001f\u007f]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLength);
}

/** Multi-line text: keeps line breaks, strips other control characters. */
export function sanitizeMultiline(input: unknown, maxLength = 3000): string {
  if (typeof input !== 'string') return '';
  return input
    .replace(/\r\n/g, '\n')
    .replace(/[\u0000-\u0009\u000b-\u001f\u007f]/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
    .slice(0, maxLength);
}

/** Letters (any script), spaces, hyphens, apostrophes and dots; at least `minWords` words. */
export function isValidPersonName(input: string, minWords = 1): boolean {
  const s = sanitizeText(input, 120);
  if (s.length < 2 || s.length > 100) return false;
  if (!/^\p{L}[\p{L}\p{M}\s'’.-]*$/u.test(s)) return false;
  return s.split(' ').filter(Boolean).length >= minWords;
}

/** Azerbaijani personal identification number (FİN): 7 Latin letters/digits. */
export function normalizeFin(input: string): string | null {
  const s = input.replace(/\s/g, '').toUpperCase();
  return /^[A-Z0-9]{7}$/.test(s) ? s : null;
}

/**
 * Any Azerbaijani phone number (mobile or landline):
 * +994 12 598 90 05, 994501234567, 050 123 45 67, 501234567 → +994XXXXXXXXX
 */
export function normalizeAzPhone(input: string): string | null {
  let digits = input.replace(/\D/g, '');
  if (digits.startsWith('994')) digits = digits.slice(3);
  else if (digits.startsWith('0')) digits = digits.slice(1);
  return /^[1-9]\d{8}$/.test(digits) ? `+994${digits}` : null;
}

/** +994501234567 → +994 50 123 45 67 */
export function formatAzPhone(e164: string): string {
  const d = e164.replace(/^\+994/, '');
  return `+994 ${d.slice(0, 2)} ${d.slice(2, 5)} ${d.slice(5, 7)} ${d.slice(7, 9)}`;
}

export const isValidEmail = (input: string): boolean => /^[^\s@]{1,64}@[^\s@]{1,190}\.[^\s@]{2,24}$/.test(input.trim());

export function isPositiveAmount(value: string, max = 10_000_000): boolean {
  const s = value.replace(/[\s,]/g, '');
  if (!/^\d+(\.\d{1,2})?$/.test(s)) return false;
  const n = Number(s);
  return n > 0 && n <= max;
}
