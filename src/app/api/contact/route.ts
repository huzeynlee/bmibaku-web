import { NextResponse, type NextRequest } from 'next/server';
import { forward, guardFormRequest } from '@/lib/forms';
import { isValidEmail, isValidPersonName, normalizeAzPhone, sanitizeMultiline, sanitizeText } from '@/utils/validation';

export const runtime = 'nodejs';

/**
 * General inquiries and complaints. Validated server-side and forwarded to
 * CONTACT_ENDPOINT; without it, nothing is accepted (503).
 */
export async function POST(request: NextRequest) {
  const guard = await guardFormRequest(request, 'contact');
  if (!guard.ok) return guard.response;
  const b = guard.body;

  const kind = b.kind === 'complaint' ? 'complaint' : 'general';
  const name = sanitizeText(b.name, 120);
  const email = sanitizeText(b.email, 254);
  const phoneRaw = sanitizeText(b.phone, 30);
  const phone = phoneRaw ? normalizeAzPhone(phoneRaw) : null;
  const topic = sanitizeText(b.topic, 120);
  const message = sanitizeMultiline(b.message, 3000);

  const errors: string[] = [];
  if (!isValidPersonName(name)) errors.push('name');
  if (!isValidEmail(email)) errors.push('email');
  if (phoneRaw && !phone) errors.push('phone');
  if (message.length < 10) errors.push('message');
  if (errors.length) return NextResponse.json({ error: 'validation', fields: errors }, { status: 422 });

  const endpoint = process.env.CONTACT_ENDPOINT?.trim();
  if (!endpoint) return NextResponse.json({ error: 'not_configured' }, { status: 503 });

  try {
    const reference = await forward(endpoint, process.env.CONTACT_TOKEN, {
      type: kind,
      submittedAt: new Date().toISOString(),
      locale: sanitizeText(b.locale, 2),
      contact: { name, email, phone },
      topic,
      message,
    });
    return NextResponse.json({ reference });
  } catch {
    return NextResponse.json({ error: 'backend_unavailable' }, { status: 502 });
  }
}
