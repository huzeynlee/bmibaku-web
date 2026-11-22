import { NextResponse, type NextRequest } from 'next/server';
import { getRateHistory } from '@/lib/rates';
import { CURRENCY_ORDER } from '@/data/currencies';
import type { CurrencyCode } from '@/types/banking';

const ISO = /^\d{4}-\d{2}-\d{2}$/;

/** GET /api/rates/history?from=YYYY-MM-DD&to=YYYY-MM-DD&currency=USD&page=1 — official archive, parsed. */
export async function GET(request: NextRequest) {
  const p = request.nextUrl.searchParams;
  const from = p.get('from') || undefined;
  const to = p.get('to') || undefined;
  const currency = p.get('currency') || undefined;
  const page = Number(p.get('page') || '1');

  if ((from && !ISO.test(from)) || (to && !ISO.test(to)) || (from && to && from > to)) {
    return NextResponse.json({ error: 'invalid_range' }, { status: 400 });
  }
  if (currency && !CURRENCY_ORDER.includes(currency as CurrencyCode)) {
    return NextResponse.json({ error: 'invalid_currency' }, { status: 400 });
  }
  if (!Number.isInteger(page) || page < 1 || page > 100) {
    return NextResponse.json({ error: 'invalid_page' }, { status: 400 });
  }

  try {
    const data = await getRateHistory({ from, to, currency: currency as CurrencyCode | undefined, page });
    return NextResponse.json(data, { headers: { 'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=3600' } });
  } catch {
    return NextResponse.json({ error: 'source_unavailable' }, { status: 502 });
  }
}
