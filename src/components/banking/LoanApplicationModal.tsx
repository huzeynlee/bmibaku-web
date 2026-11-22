import { useEffect, useId, useRef, useState, type FormEvent } from 'react';
import { CircleAlert, CircleCheck, ExternalLink as ExternalIcon, FlaskConical, LoaderCircle, Phone, ShieldCheck } from 'lucide-react';
import type { LoanApplicationPayload, LoanProductId } from '../../types/banking';
import { useI18n } from '../../i18n';
import { CONTACT, LINKS } from '../../data/banking';
import { LOAN_LIMITS, LOAN_PRODUCTS } from '../../data/loanProducts';
import { isDemoMode, submitLoanApplication } from '../../services/applicationService';
import { formatNumber } from '../../utils/currency';
import { cx, fmt } from '../../utils/cx';
import { formatAzMobile, isIntegerInRange, isValidName, normalizeAzMobile, sanitizeText } from '../../utils/validation';
import { Modal } from '../ui/Modal';
import { Button, ButtonLink, ExternalLink, buttonClass } from '../ui/Button';
import { Field, FieldError, Input, describedBy } from '../ui/Input';
import { Select } from '../ui/Select';

export interface ApplicationPrefill {
  productId: LoanProductId;
  amount: number;
  termMonths: number;
}

type FieldKey = 'firstName' | 'lastName' | 'phone' | 'amount' | 'term' | 'consent';
const ORDER: FieldKey[] = ['firstName', 'lastName', 'phone', 'amount', 'term', 'consent'];

interface FormState {
  firstName: string;
  lastName: string;
  phone: string;
  productId: LoanProductId;
  amount: string;
  term: string;
  consent: boolean;
}

type Status = { kind: 'idle' } | { kind: 'submitting' } | { kind: 'error' } | { kind: 'demo' } | { kind: 'success'; reference: string };

const initial = (p: ApplicationPrefill): FormState => ({
  firstName: '',
  lastName: '',
  phone: '',
  productId: p.productId,
  amount: String(p.amount),
  term: String(p.termMonths),
  consent: false,
});

interface Props {
  open: boolean;
  prefill: ApplicationPrefill;
  onClose: () => void;
}

/** Form data lives only in component state; it is never written to storage. */
export function LoanApplicationModal({ open, prefill, onClose }: Props) {
  const { t, lang } = useI18n();
  const uid = useId();
  const id = (k: string) => `${uid}-${k}`;
  const [form, setForm] = useState<FormState>(() => initial(prefill));
  const [errors, setErrors] = useState<Partial<Record<FieldKey, string>>>({});
  const [status, setStatus] = useState<Status>({ kind: 'idle' });
  const refs = useRef<Partial<Record<FieldKey, HTMLInputElement | null>>>({});
  const abortRef = useRef<AbortController | null>(null);
  const demo = isDemoMode();

  useEffect(() => {
    if (open) {
      setForm(initial(prefill));
      setErrors({});
      setStatus({ kind: 'idle' });
    } else {
      abortRef.current?.abort();
    }
  }, [open, prefill]);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (key in errors) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const validate = (): Partial<Record<FieldKey, string>> => {
    const e: Partial<Record<FieldKey, string>> = {};
    const { amount, term } = LOAN_LIMITS;
    if (!isValidName(form.firstName)) e.firstName = t.apply.errors.firstName;
    if (!isValidName(form.lastName)) e.lastName = t.apply.errors.lastName;
    if (!normalizeAzMobile(form.phone)) e.phone = t.apply.errors.phone;
    if (!isIntegerInRange(form.amount, amount.min, amount.max))
      e.amount = fmt(t.apply.errors.amount, { min: formatNumber(amount.min, lang), max: formatNumber(amount.max, lang) });
    if (!isIntegerInRange(form.term, term.min, term.max)) e.term = fmt(t.apply.errors.term, { min: term.min, max: term.max });
    if (!form.consent) e.consent = t.apply.errors.consent;
    return e;
  };

  const onSubmit = async (ev: FormEvent) => {
    ev.preventDefault();
    if (status.kind === 'submitting') return;
    const e = validate();
    setErrors(e);
    const first = ORDER.find((k) => e[k]);
    if (first) {
      refs.current[first]?.focus();
      return;
    }
    const phone = normalizeAzMobile(form.phone);
    if (!phone) return;
    const payload: LoanApplicationPayload = {
      firstName: sanitizeText(form.firstName, 50),
      lastName: sanitizeText(form.lastName, 50),
      phone,
      productId: form.productId,
      amount: Number(form.amount),
      termMonths: Number(form.term),
      consent: true,
      consentAt: new Date().toISOString(),
      locale: lang,
    };
    setStatus({ kind: 'submitting' });
    abortRef.current = new AbortController();
    try {
      const res = await submitLoanApplication(payload, abortRef.current.signal);
      setStatus(res.mode === 'live' ? { kind: 'success', reference: res.reference } : { kind: 'demo' });
    } catch (err) {
      if (!(err instanceof DOMException && err.name === 'AbortError')) setStatus({ kind: 'error' });
    }
  };

  const errorCount = Object.values(errors).filter(Boolean).length;
  const busy = status.kind === 'submitting';
  const bind = (key: FieldKey) => ({
    ref: (el: HTMLInputElement | null) => {
      refs.current[key] = el;
    },
    invalid: !!errors[key],
    'aria-describedby': describedBy(id(key), errors[key], key === 'phone' ? t.apply.phoneHint : undefined),
  });

  const resultView = (status.kind === 'success' || status.kind === 'demo') && (
    <div className="p-7 text-center sm:p-10" role="status">
      {status.kind === 'success' ? (
        <CircleCheck className="mx-auto size-12 text-success" aria-hidden="true" />
      ) : (
        <CircleAlert className="mx-auto size-12 text-warning" aria-hidden="true" />
      )}
      <h2 id={id('title')} className="mt-4 text-2xl font-bold text-navy-900">
        {status.kind === 'success' ? t.apply.successTitle : t.apply.demoTitle}
      </h2>
      <p className="mx-auto mt-3 max-w-sm text-slate-600">
        {status.kind === 'success' ? fmt(t.apply.successText, { id: status.reference }) : t.apply.demoText}
      </p>
      <div className="mt-8 flex flex-col justify-center gap-2.5 sm:flex-row">
        {status.kind === 'demo' && (
          <>
            <ButtonLink href={LINKS.officialLoanForm} variant="gold" size="lg">
              {t.apply.officialForm}
              <ExternalIcon className="size-4" aria-hidden="true" />
            </ButtonLink>
            <ButtonLink href={CONTACT.phones[0].href} variant="secondary" size="lg" dir="ltr">
              <Phone className="size-4" aria-hidden="true" />
              {CONTACT.phones[0].display}
            </ButtonLink>
          </>
        )}
        <Button variant={status.kind === 'success' ? 'primary' : 'ghost'} size="lg" onClick={onClose}>
          {t.apply.done}
        </Button>
      </div>
    </div>
  );

  return (
    <Modal open={open} onClose={onClose} labelledBy={id('title')} closeLabel={t.apply.close}>
      {resultView || (
        <form noValidate onSubmit={onSubmit} className="p-6 sm:p-8">
          <h2 id={id('title')} className="pe-10 text-2xl font-bold text-navy-900">
            {t.apply.title}
          </h2>
          <p className="mt-2 text-[15px] text-slate-600">{t.apply.lead}</p>

          {demo && (
            <p className="mt-4 flex gap-2.5 rounded-lg border border-warning/30 bg-amber-50 px-3.5 py-3 text-[13px] text-amber-900">
              <FlaskConical className="mt-px size-4 shrink-0 text-warning" aria-hidden="true" />
              <span>
                <strong className="font-semibold">{t.apply.demoBadge}.</strong> {t.apply.demoNotice}
              </span>
            </p>
          )}

          <div aria-live="polite">
            {errorCount > 0 && (
              <p className="mt-4 flex gap-2 rounded-lg bg-red-50 px-3.5 py-3 text-sm font-medium text-red-800">
                <CircleAlert className="mt-px size-4 shrink-0" aria-hidden="true" />
                {fmt(t.apply.errors.summary, { count: errorCount })}
              </p>
            )}
            {status.kind === 'error' && (
              <p className="mt-4 flex gap-2 rounded-lg bg-red-50 px-3.5 py-3 text-sm font-medium text-red-800">
                <CircleAlert className="mt-px size-4 shrink-0" aria-hidden="true" />
                {t.apply.errors.network}
              </p>
            )}
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <Field id={id('firstName')} label={t.apply.firstName} error={errors.firstName} required requiredLabel={t.apply.required}>
              <Input
                id={id('firstName')}
                name="given-name"
                autoComplete="given-name"
                maxLength={50}
                value={form.firstName}
                onChange={(e) => update('firstName', e.target.value)}
                aria-required="true"
                {...bind('firstName')}
              />
            </Field>
            <Field id={id('lastName')} label={t.apply.lastName} error={errors.lastName} required requiredLabel={t.apply.required}>
              <Input
                id={id('lastName')}
                name="family-name"
                autoComplete="family-name"
                maxLength={50}
                value={form.lastName}
                onChange={(e) => update('lastName', e.target.value)}
                aria-required="true"
                {...bind('lastName')}
              />
            </Field>
            <Field
              id={id('phone')}
              label={t.apply.phone}
              hint={t.apply.phoneHint}
              error={errors.phone}
              required
              requiredLabel={t.apply.required}
              className="sm:col-span-2"
            >
              <Input
                id={id('phone')}
                name="tel"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                dir="ltr"
                maxLength={20}
                placeholder="+994 50 123 45 67…"
                value={form.phone}
                onChange={(e) => update('phone', e.target.value)}
                onBlur={() => {
                  const n = normalizeAzMobile(form.phone);
                  if (n) update('phone', formatAzMobile(n));
                }}
                aria-required="true"
                className="tabular-nums rtl:text-end"
                {...bind('phone')}
              />
            </Field>
            <Field id={id('product')} label={t.apply.product} className="sm:col-span-2">
              <Select id={id('product')} name="loan-product" value={form.productId} onChange={(e) => update('productId', e.target.value as LoanProductId)}>
                {LOAN_PRODUCTS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {t.products[p.id].name}
                    {p.annualRate !== null ? ` · ${p.annualRate}%` : ''}
                  </option>
                ))}
              </Select>
            </Field>
            <Field id={id('amount')} label={t.apply.amount} error={errors.amount} required requiredLabel={t.apply.required}>
              <Input
                id={id('amount')}
                name="loan-amount"
                type="text"
                inputMode="numeric"
                autoComplete="off"
                value={form.amount}
                onChange={(e) => update('amount', e.target.value.replace(/\D/g, ''))}
                aria-required="true"
                className="tabular-nums"
                {...bind('amount')}
              />
            </Field>
            <Field id={id('term')} label={t.apply.term} error={errors.term} required requiredLabel={t.apply.required}>
              <Input
                id={id('term')}
                name="loan-term"
                type="text"
                inputMode="numeric"
                autoComplete="off"
                value={form.term}
                onChange={(e) => update('term', e.target.value.replace(/\D/g, ''))}
                aria-required="true"
                className="tabular-nums"
                {...bind('term')}
              />
            </Field>

            <div className="sm:col-span-2">
              <label
                className={cx(
                  'flex cursor-pointer items-start gap-3 rounded-lg border p-3.5 text-sm text-slate-700 transition-colors duration-200 ease-out',
                  'has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-gold-500',
                  errors.consent ? 'border-danger' : 'border-line hover:border-slate-300',
                )}
              >
                <input
                  ref={(el) => {
                    refs.current.consent = el;
                  }}
                  type="checkbox"
                  name="consent"
                  checked={form.consent}
                  onChange={(e) => update('consent', e.target.checked)}
                  aria-invalid={errors.consent ? true : undefined}
                  aria-describedby={errors.consent ? id('consent-error') : undefined}
                  className="mt-0.5 size-5 shrink-0 accent-navy-900"
                />
                {t.apply.consent}
              </label>
              {errors.consent && <FieldError id={id('consent-error')}>{errors.consent}</FieldError>}
            </div>
          </div>

          <p className="mt-5 flex gap-2 text-[13px] text-slate-600">
            <ShieldCheck className="mt-px size-4 shrink-0 text-success" aria-hidden="true" />
            {t.apply.privacy}
          </p>

          <Button type="submit" variant="primary" size="lg" aria-disabled={busy} className="mt-6 w-full">
            {busy && <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />}
            {busy ? t.apply.submitting : t.apply.submit}
          </Button>
          {demo && (
            <p className="mt-3 text-center text-[13px] text-slate-600">
              <ExternalLink href={LINKS.officialLoanForm} className={cx(buttonClass('ghost', 'sm'), 'underline underline-offset-4')}>
                {t.apply.officialForm}
              </ExternalLink>
            </p>
          )}
        </form>
      )}
    </Modal>
  );
}
