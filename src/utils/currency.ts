import type { Lang } from '../types/banking';
import { parseFixed, toParts, type Fixed } from './decimal';

/**
 * Number locale per interface language.
 * Financial figures use Latin digits and "." decimals in every language, as the
 * bank publishes them. Chrome ships no Azerbaijani number data, so "az" maps to
 * en-US explicitly instead of producing different output per browser.
 */
const NUMBER_LOCALE: Record<Lang, string> = {
  az: 'en-US',
  en: 'en-US',
  fa: 'fa-IR-u-nu-latn',
};

const cache = new Map<string, Intl.NumberFormat>();
function nf(lang: Lang, min: number, max: number): Intl.NumberFormat {
  const key = `${lang}|${min}|${max}`;
  let f = cache.get(key);
  if (!f) {
    f = new Intl.NumberFormat(NUMBER_LOCALE[lang], { minimumFractionDigits: min, maximumFractionDigits: max });
    cache.set(key, f);
  }
  return f;
}

export const formatNumber = (v: number, lang: Lang, digits = 0): string => nf(lang, digits, digits).format(v);
export const formatMoney = (v: number, lang: Lang): string => nf(lang, 2, 2).format(v);

/** Formats a fixed-point value exactly (no float conversion). */
export function formatFixed(v: Fixed, lang: Lang, digits: number): string {
  const { whole, fraction } = toParts(v, digits);
  const wholeText = nf(lang, 0, 0).format(whole);
  if (digits === 0) return wholeText;
  const decimal = nf(lang, 1, 1).formatToParts(1.5).find((p) => p.type === 'decimal')?.value ?? '.';
  return `${wholeText}${decimal}${fraction}`;
}

/** Formats a published rate string ("1.6970") with fixed decimals. */
export function formatRate(rate: string, lang: Lang, digits = 4): string {
  const v = parseFixed(rate);
  return v === null ? '—' : formatFixed(v, lang, digits);
}

const AZ_MONTHS = ['yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun', 'iyul', 'avqust', 'sentyabr', 'oktyabr', 'noyabr', 'dekabr'];

function parseIsoDate(iso: string): Date {
  const [y = 1970, m = 1, d = 1] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}

/** Short date: 22.11.2026 (az), 22 Nov 2026 (en), Persian calendar (fa). */
export function formatDate(iso: string, lang: Lang): string {
  const date = parseIsoDate(iso);
  if (lang === 'az') {
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    return `${dd}.${mm}.${date.getFullYear()}`;
  }
  const locale = lang === 'en' ? 'en-GB' : 'fa-IR-u-nu-latn';
  return new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short', year: 'numeric' }).format(date);
}

/** Long date: 29 yanvar 1993. */
export function formatLongDate(iso: string, lang: Lang): string {
  const date = parseIsoDate(iso);
  if (lang === 'az') return `${date.getDate()} ${AZ_MONTHS[date.getMonth()]} ${date.getFullYear()}`;
  const locale = lang === 'en' ? 'en-GB' : 'fa-IR-u-nu-latn';
  return new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'long', year: 'numeric' }).format(date);
}

export function toIsoDate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
