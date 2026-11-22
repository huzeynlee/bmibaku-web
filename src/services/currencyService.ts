import type { CurrencyCode, CurrencyRate, RateHistoryPoint, RateHistoryResult, RatePair, RatesSnapshot } from '../types/banking';
import { CURRENCY_ORDER, RATES_SNAPSHOT } from '../data/currencies';
import { parseFixed } from '../utils/decimal';
import { config } from './config';

const isRecord = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null;
const isIsoDate = (v: unknown): v is string => typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v);

/** A rate pair is accepted only when both sides are positive decimal strings. */
function parsePair(v: unknown): RatePair | null {
  if (!isRecord(v)) return null;
  const { buy, sell } = v;
  if (typeof buy !== 'string' || typeof sell !== 'string') return null;
  const b = parseFixed(buy);
  const s = parseFixed(sell);
  if (b === null || s === null || b === 0n || s === 0n) return null;
  return { buy, sell };
}

function parseRate(v: unknown): CurrencyRate | null {
  if (!isRecord(v) || typeof v.code !== 'string' || !CURRENCY_ORDER.includes(v.code as CurrencyCode)) return null;
  const unit = typeof v.unit === 'number' && v.unit > 0 ? v.unit : 1;
  return { code: v.code as CurrencyCode, unit, cash: parsePair(v.cash), noncash: parsePair(v.noncash) };
}

/**
 * Current rates. Without VITE_RATES_API_URL this returns the dated snapshot
 * (live: false). A malformed API response throws instead of showing guesses.
 */
export async function getCurrentRates(signal?: AbortSignal): Promise<RatesSnapshot> {
  if (!config.ratesUrl) return RATES_SNAPSHOT;
  const res = await fetch(config.ratesUrl, { signal, headers: { Accept: 'application/json' }, credentials: 'omit' });
  if (!res.ok) throw new Error(`Rates request failed: HTTP ${res.status}`);
  const data: unknown = await res.json();
  if (!isRecord(data) || !isIsoDate(data.asOf) || !Array.isArray(data.items)) throw new Error('Malformed rates response');
  const items = data.items.map(parseRate).filter((r): r is CurrencyRate => r !== null);
  const source = isRecord(data.source) && typeof data.source.label === 'string' && typeof data.source.url === 'string'
    ? { label: data.source.label, url: data.source.url }
    : RATES_SNAPSHOT.source;
  return { asOf: data.asOf, live: true, source, items };
}

export interface RateHistoryQuery {
  code: CurrencyCode;
  from: string; // YYYY-MM-DD
  to: string;
}

/** Historical rates. Without VITE_RATES_HISTORY_API_URL: { status: 'unavailable' }. */
export async function getRateHistory(query: RateHistoryQuery, signal?: AbortSignal): Promise<RateHistoryResult> {
  if (!config.ratesHistoryUrl) return { status: 'unavailable' };
  const url = new URL(config.ratesHistoryUrl);
  url.searchParams.set('currency', query.code);
  url.searchParams.set('from', query.from);
  url.searchParams.set('to', query.to);
  const res = await fetch(url, { signal, headers: { Accept: 'application/json' }, credentials: 'omit' });
  if (!res.ok) throw new Error(`History request failed: HTTP ${res.status}`);
  const data: unknown = await res.json();
  if (!isRecord(data) || !Array.isArray(data.points)) throw new Error('Malformed history response');
  const points = data.points
    .map((p): RateHistoryPoint | null =>
      isRecord(p) && isIsoDate(p.date) ? { date: p.date, cash: parsePair(p.cash), noncash: parsePair(p.noncash) } : null,
    )
    .filter((p): p is RateHistoryPoint => p !== null && (p.cash !== null || p.noncash !== null))
    .sort((a, b) => a.date.localeCompare(b.date));
  return { status: 'ok', code: query.code, points };
}
