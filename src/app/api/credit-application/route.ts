import { NextResponse, type NextRequest } from 'next/server';
import { forward, guardFormRequest } from '@/lib/forms';
import { isPositiveAmount, isValidPersonName, normalizeAzPhone, normalizeFin, sanitizeText } from '@/utils/validation';

export const runtime = 'nodejs';

const CURRENCIES = ['AZN', 'USD', 'EUR'];
const TERMS = [6, 12, 18, 24, 36, 60];

/**
 * Credit application intake. Validates server-side and forwards to
 * CREDIT_APPLICATION_ENDPOINT. Without it, nothing is accepted (503) and
 * the page tells the user to apply by phone or at the branch.
 */
export async function POST(request: NextRequest) {
  const guard = await guardFormRequest(request, 'credit');
  if (!guard.ok) return guard.response;
  const b = guard.body;

  const fullName = sanitizeText(b.fullName, 120);
  const fin = normalizeFin(sanitizeText(b.fin, 20));
  const amount = sanitizeText(b.amount, 20);
  const currency = sanitizeText(b.currency, 3);
  const term = Number(b.term);
  const workplace = sanitizeText(b.workplace, 160);
  const salary = sanitizeText(b.salary, 20);
  const phone = normalizeAzPhone(sanitizeText(b.phone, 30));
  const purpose = sanitizeText(b.purpose, 300);

  const errors: string[] = [];
  if (!isValidPersonName(fullName, 2)) errors.push('fullName');
  if (!fin) errors.push('fin');
  if (!isPositiveAmount(amount)) errors.push('amount');
  if (!CURRENCIES.includes(currency)) errors.push('currency');
  if (!TERMS.includes(term)) errors.push('term');
  if (workplace.length < 2) errors.push('workplace');
  if (!isPositiveAmount(salary)) errors.push('salary');
  if (!phone) errors.push('phone');
  if (purpose.length < 2) errors.push('purpose');
  if (b.consentRegistry !== true) errors.push('consentRegistry');
  if (b.consentAsan !== true) errors.push('consentAsan');
  if (errors.length) return NextResponse.json({ error: 'validation', fields: errors }, { status: 422 });

  const endpoint = process.env.CREDIT_APPLICATION_ENDPOINT?.trim();
  if (!endpoint) return NextResponse.json({ error: 'not_configured' }, { status: 503 });

  try {
    const reference = await forward(endpoint, process.env.CREDIT_APPLICATION_TOKEN, {
      type: 'credit-application',
      submittedAt: new Date().toISOString(),
      locale: sanitizeText(b.locale, 2),
      applicant: { fullName, fin, phone, workplace, salary: Number(salary.replace(/[\s,]/g, '')) },
      credit: { amount: Number(amount.replace(/[\s,]/g, '')), currency, termMonths: term, purpose },
      consents: { creditRegistryAndBureau: true, asanFinans: true, consentedAt: new Date().toISOString() },
    });
    return NextResponse.json({ reference });
  } catch {
    return NextResponse.json({ error: 'backend_unavailable' }, { status: 502 });
  }
}
