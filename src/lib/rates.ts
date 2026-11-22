import 'server-only';
import type { CurrencyCode, CurrencyRate, RatePair, RatesSnapshot } from '@/types/banking';
import { CURRENCY_ORDER, RATES_SNAPSHOT } from '@/data/currencies';

/**
 * Official rates come from the bank's existing rate system on bmibaku.az
 * (WordPress plugin "currency-rate-manager": admin-ajax.php?action=mv_cr_read).
 * The plugin returns rendered HTML tables; they are parsed here into typed data.
 * A published value of 0.0000 means "not quoted" and becomes null.
 */
const SOURCE = process.env.RATES_SOURCE_URL || 'https://bmibaku.az/wp-admin/admin-ajax.php';
const REVALIDATE_SECONDS = 600;

const UNIT_LABEL = /(\d+)\s*([A-ZİI]{3})/i;

function normalizeCode(raw: string): CurrencyCode | null {
  const code = raw.toUpperCase().replace('İ', 'I') as CurrencyCode;
  return CURRENCY_ORDER.includes(code) ? code : null;
}

function pair(buy?: string, sell?: string): RatePair | null {
  if (!buy || !sell) return null;
  if (!/^\d+(\.\d+)?$/.test(buy) || !/^\d+(\.\d+)?$/.test(sell)) return null;
  if (Number(buy) === 0 || Number(sell) === 0) return null;
  return { buy, sell };
}

const stripTags = (s: string) => s.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').trim();

interface ParsedRow {
  date: string | null; // YYYY-MM-DD
  rate: CurrencyRate;
}

/** Parses rows like <tr><td>20.11.2026</td><th>1 USD</th><td>1.6970</td>…</tr>. */
function parseRows(html: string): ParsedRow[] {
  const rows: ParsedRow[] = [];
  for (const [, tr] of html.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/g)) {
    const cells = [...tr!.matchAll(/<(td|th)[^>]*>([\s\S]*?)<\/\1>/g)].map((m) => stripTags(m[2]!));
    const labelIndex = cells.findIndex((c) => UNIT_LABEL.test(c));
    if (labelIndex === -1) continue;
    const [, unit, rawCode] = cells[labelIndex]!.match(UNIT_LABEL)!;
    const code = normalizeCode(rawCode!);
    if (!code) continue;
    const dateCell = cells.slice(0, labelIndex).find((c) => /^\d{2}\.\d{2}\.\d{4}$/.test(c));
    const nums = cells.slice(labelIndex + 1);
    rows.push({
      date: dateCell ? dateCell.split('.').reverse().join('-') : null,
      rate: { code, unit: Number(unit), cash: pair(nums[0], nums[1]), noncash: pair(nums[2], nums[3]) },
    });
  }
  return rows;
}

async function readOnce(url: URL): Promise<string> {
  const res = await fetch(url, {
    headers: { Accept: 'application/json', 'User-Agent': 'bmibaku-web/3.0' },
    next: { revalidate: REVALIDATE_SECONDS },
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`Rates source HTTP ${res.status}`);
  const json = (await res.json()) as { success?: boolean; data?: { html?: string } };
  if (!json.success || typeof json.data?.html !== 'string') throw new Error('Rates source returned no data');
  return json.data.html;
}

/** The source occasionally fails a single request (seen during QA), so retry once. */
async function read(params: Record<string, string>): Promise<string> {
  const url = new URL(SOURCE);
  url.searchParams.set('action', 'mv_cr_read');
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  try {
    return await readOnce(url);
  } catch {
    await new Promise((r) => setTimeout(r, 400));
    return readOnce(url);
  }
}

export type RatesResult = { data: RatesSnapshot; error: boolean };

/** Latest official rates; falls back to the dated snapshot (marked not live) on failure. */
export async function getLatestRates(): Promise<RatesResult> {
  try {
    const html = await read({ mode: 'latest', cr_page: '1' });
    const rows = parseRows(html);
    const date = html.match(/(\d{2})\.(\d{2})\.(\d{4})/);
    if (!rows.length || !date) throw new Error('Unexpected rates markup');
    const items = CURRENCY_ORDER.map((code) => rows.find((r) => r.rate.code === code)?.rate).filter((r): r is CurrencyRate => !!r);
    return {
      data: { asOf: `${date[3]}-${date[2]}-${date[1]}`, live: true, source: { label: 'bmibaku.az', url: 'https://bmibaku.az/valyuta-tarixcesi/' }, items },
      error: false,
    };
  } catch {
    return { data: RATES_SNAPSHOT, error: true };
  }
}

export interface HistoryQuery {
  from?: string;
  to?: string;
  currency?: CurrencyCode;
  page?: number;
}

export interface HistoryPoint {
  date: string;
  code: CurrencyCode;
  unit: number;
  cash: RatePair | null;
  noncash: RatePair | null;
}

export interface HistoryPage {
  points: HistoryPoint[];
  page: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export async function getRateHistory(q: HistoryQuery): Promise<HistoryPage> {
  const page = q.page ?? 1;
  const html = await read({
    mode: 'history',
    cr_page: String(page),
    ...(q.from ? { from: q.from } : {}),
    ...(q.to ? { to: q.to } : {}),
    ...(q.currency ? { currency: q.currency } : {}),
  });
  const points = parseRows(html)
    .filter((r): r is ParsedRow & { date: string } => r.date !== null)
    .map((r) => ({ date: r.date, code: r.rate.code, unit: r.rate.unit, cash: r.rate.cash, noncash: r.rate.noncash }));
  return {
    points,
    page,
    hasNext: new RegExp(`data-page="${page + 1}"`).test(html),
    hasPrev: page > 1 && new RegExp(`data-page="${page - 1}"`).test(html),
  };
}
