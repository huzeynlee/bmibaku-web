import 'server-only';
import { NextResponse, type NextRequest } from 'next/server';

/**
 * Guard rails shared by form route handlers:
 * same-origin check, JSON only, size limit, honeypot, per-IP rate limit.
 * Personal data is never logged.
 */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const MAX_BYTES = 16_000;
const hits = new Map<string, number[]>();

/**
 * Client IP for rate limiting. The first X-Forwarded-For entry is written by the
 * client and can be spoofed, so use the header set by our own proxy (X-Real-IP)
 * or the last X-Forwarded-For entry, which the nearest proxy appends.
 * Assumes exactly one trusted reverse proxy in front of the app.
 */
function clientIp(request: NextRequest): string {
  const real = request.headers.get('x-real-ip')?.trim();
  if (real) return real;
  const chain = (request.headers.get('x-forwarded-for') || '').split(',').map((s) => s.trim()).filter(Boolean);
  return chain.at(-1) || 'unknown';
}

function rateLimited(key: string): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > MAX_PER_WINDOW;
}

export type GuardResult = { ok: true; body: Record<string, unknown> } | { ok: false; response: NextResponse };

export async function guardFormRequest(request: NextRequest, scope: string): Promise<GuardResult> {
  const fail = (status: number, error: string) => ({ ok: false as const, response: NextResponse.json({ error }, { status }) });

  const origin = request.headers.get('origin');
  let originHost: string | null = null;
  try {
    originHost = origin ? new URL(origin).host : null;
  } catch {
    return fail(403, 'forbidden_origin');
  }
  if (originHost && originHost !== request.headers.get('host')) return fail(403, 'forbidden_origin');
  if (!request.headers.get('content-type')?.includes('application/json')) return fail(415, 'unsupported_media_type');
  if (Number(request.headers.get('content-length') || '0') > MAX_BYTES) return fail(413, 'payload_too_large');

  if (rateLimited(`${scope}:${clientIp(request)}`)) return fail(429, 'rate_limited');

  let body: unknown;
  try {
    // Read as text so the size limit also holds without a Content-Length header.
    const raw = await request.text();
    if (raw.length > MAX_BYTES) return fail(413, 'payload_too_large');
    body = JSON.parse(raw);
  } catch {
    return fail(400, 'invalid_json');
  }
  if (typeof body !== 'object' || body === null || Array.isArray(body)) return fail(400, 'invalid_body');
  const record = body as Record<string, unknown>;
  // Honeypot: real users never fill this hidden field.
  if (typeof record.website === 'string' && record.website.trim() !== '') return fail(400, 'rejected');
  return { ok: true, body: record };
}

/** Forwards a validated payload to the configured backend. Returns its reference. */
export async function forward(endpoint: string, token: string | undefined, payload: unknown): Promise<string> {
  const url = new URL(endpoint);
  if (process.env.NODE_ENV === 'production' && url.protocol !== 'https:') throw new Error('Endpoint must use HTTPS');
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(10_000),
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`Backend HTTP ${res.status}`);
  const data = (await res.json().catch(() => null)) as { reference?: unknown } | null;
  if (typeof data?.reference !== 'string' || !data.reference) throw new Error('Backend returned no reference');
  return data.reference;
}
