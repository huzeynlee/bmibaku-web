'use client';

import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { CircleAlert, CircleCheck, LoaderCircle, Phone, ShieldCheck } from 'lucide-react';
import type { FormField } from '@/content/types';
import { useI18n } from '@/i18n/client';
import { CONTACT } from '@/data/banking';
import { cx, fmt } from '@/utils/cx';
import { formatAzPhone, isPositiveAmount, isValidPersonName, normalizeAzPhone, normalizeFin } from '@/utils/validation';
import { Field, FieldError, Input, describedBy } from '../ui/Input';
import { Select } from '../ui/Select';
import { buttonClass } from '../ui/buttonClass';

/** Field order of the official form on /online-kredit-sifarisi/. */
const KEYS = ['fullName', 'fin', 'amount', 'currency', 'term', 'workplace', 'salary', 'phone', 'purpose', 'consentRegistry', 'consentAsan'] as const;
type Key = (typeof KEYS)[number];
type TextKey = Exclude<Key, 'consentRegistry' | 'consentAsan'>;
type Values = Record<TextKey, string> & { consentRegistry: boolean; consentAsan: boolean };
type Status = { kind: 'idle' | 'submitting' | 'not-configured' | 'error' } | { kind: 'success'; reference: string };

const EMPTY: Values = { fullName: '', fin: '', amount: '', currency: 'AZN', term: '', workplace: '', salary: '', phone: '', purpose: '', consentRegistry: false, consentAsan: false };
const TERMS = [6, 12, 18, 24, 36, 60];

/** Consent label minus the checkbox caption ("TƏSDİQLƏ"), as published. */
const consentText = (f: FormField | undefined) => (f?.consentText || f?.label || '').replace(/^\s*(TƏSDİQLƏ|CONFIRM|APPROVE)\s*/i, '');

export function CreditApplicationForm({ fields, productNames }: { fields: FormField[]; productNames: Record<string, string> }) {
  const { t, locale } = useI18n();
  const spec = Object.fromEntries(KEYS.map((k, i) => [k, fields[i]])) as Record<Key, FormField | undefined>;
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<Key, string>>>({});
  const [status, setStatus] = useState<Status>({ kind: 'idle' });
  const refs = useRef<Partial<Record<Key, HTMLInputElement | HTMLSelectElement | null>>>({});
  const honeypot = useRef<HTMLInputElement>(null);

  // Prefill from the calculator: ?product=&amount=&term=
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const amount = q.get('amount');
    const term = Number(q.get('term'));
    const product = q.get('product');
    setValues((v) => ({
      ...v,
      amount: amount && /^\d+$/.test(amount) ? amount : v.amount,
      term: term ? String(TERMS.reduce((best, x) => (Math.abs(x - term) < Math.abs(best - term) ? x : best), TERMS[0]!)) : v.term,
      purpose: product && productNames[product] ? productNames[product]! : v.purpose,
    }));
  }, [productNames]);

  const set = <K extends Key>(key: K, value: Values[K]) => {
    setValues((v) => ({ ...v, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const validate = () => {
    const e: Partial<Record<Key, string>> = {};
    if (!isValidPersonName(values.fullName, 2)) e.fullName = t.apply.errors.name;
    if (!normalizeFin(values.fin)) e.fin = t.apply.errors.fin;
    if (!isPositiveAmount(values.amount)) e.amount = t.apply.errors.number;
    if (!values.currency) e.currency = t.apply.errors.required;
    if (!values.term) e.term = t.apply.errors.required;
    if (values.workplace.trim().length < 2) e.workplace = t.apply.errors.required;
    if (!isPositiveAmount(values.salary)) e.salary = t.apply.errors.number;
    if (!normalizeAzPhone(values.phone)) e.phone = t.apply.errors.phone;
    if (values.purpose.trim().length < 2) e.purpose = t.apply.errors.required;
    if (!values.consentRegistry) e.consentRegistry = t.apply.errors.consent;
    if (!values.consentAsan) e.consentAsan = t.apply.errors.consent;
    return e;
  };

  const onSubmit = async (ev: FormEvent) => {
    ev.preventDefault();
    if (status.kind === 'submitting') return;
    const e = validate();
    setErrors(e);
    const first = KEYS.find((k) => e[k]);
    if (first) {
      refs.current[first]?.focus();
      return;
    }
    setStatus({ kind: 'submitting' });
    try {
      const res = await fetch('/api/credit-application', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, term: Number(values.term), locale, website: honeypot.current?.value ?? '' }),
      });
      if (res.status === 503) return setStatus({ kind: 'not-configured' });
      const data = (await res.json().catch(() => ({}))) as { reference?: string; fields?: Key[] };
      if (res.status === 422 && data.fields?.length) {
        setErrors(Object.fromEntries(data.fields.map((f) => [f, t.apply.errors.required])));
        setStatus({ kind: 'idle' });
        return;
      }
      if (!res.ok || !data.reference) throw new Error();
      setStatus({ kind: 'success', reference: data.reference });
      setValues(EMPTY);
    } catch {
      setStatus({ kind: 'error' });
    }
  };

  const errorCount = Object.values(errors).filter(Boolean).length;
  const bind = (key: Key) => ({
    ref: (el: HTMLInputElement | HTMLSelectElement | null) => {
      refs.current[key] = el;
    },
    invalid: !!errors[key],
    'aria-describedby': describedBy(`ca-${key}`, errors[key]),
    'aria-required': true,
  });
  const label = (key: Key, fallback: string) => spec[key]?.label || fallback;

  if (status.kind === 'success' || status.kind === 'not-configured') {
    const ok = status.kind === 'success';
    return (
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-line bg-white p-8 text-center sm:p-12" role="status">
        {ok ? <CircleCheck className="mx-auto size-12 text-success" aria-hidden="true" /> : <CircleAlert className="mx-auto size-12 text-warning" aria-hidden="true" />}
        <h2 className="mt-4 text-2xl font-bold text-navy-900">{ok ? t.apply.successTitle : t.apply.notConfiguredTitle}</h2>
        <p className="mx-auto mt-3 max-w-md text-slate-600">{ok ? fmt(t.apply.successText, { id: status.reference }) : t.apply.notConfiguredText}</p>
        <div className="mt-8 flex flex-col justify-center gap-2.5 sm:flex-row">
          {!ok && (
            <a href={CONTACT.phones[0].href} className={buttonClass('gold', 'lg')} dir="ltr">
              <Phone className="size-4" aria-hidden="true" />
              {CONTACT.phones[0].display}
            </a>
          )}
          <button type="button" onClick={() => setStatus({ kind: 'idle' })} className={buttonClass('secondary', 'lg')}>
            {ok ? t.apply.newApplication : t.common.previous}
          </button>
        </div>
      </motion.div>
    );
  }

  const textField = (key: TextKey, opts: { type?: string; inputMode?: 'text' | 'numeric' | 'decimal' | 'tel'; autoComplete?: string; className?: string; dir?: 'ltr' } = {}) => (
    <Field id={`ca-${key}`} label={label(key, key)} error={errors[key]} required requiredLabel={t.apply.required} className={opts.className}>
      <Input
        id={`ca-${key}`}
        name={key}
        type={opts.type ?? 'text'}
        inputMode={opts.inputMode}
        autoComplete={opts.autoComplete ?? 'off'}
        dir={opts.dir}
        value={values[key]}
        onChange={(e) => set(key, e.target.value)}
        {...bind(key)}
      />
    </Field>
  );

  return (
    <form noValidate onSubmit={onSubmit} className="rounded-2xl border border-line bg-white p-5 sm:p-8">
      <AnimatePresence>
        {(errorCount > 0 || status.kind === 'error') && (
          <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mb-6 flex gap-2 overflow-hidden rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-800" role="alert">
            <CircleAlert className="mt-px size-4 shrink-0" aria-hidden="true" />
            {status.kind === 'error' ? `${t.apply.errorTitle}. ${t.apply.errorText}` : fmt(t.apply.errors.summary, { count: errorCount })}
          </motion.p>
        )}
      </AnimatePresence>

      <div className="grid gap-5 sm:grid-cols-2">
        {textField('fullName', { autoComplete: 'name', className: 'sm:col-span-2' })}
        {textField('fin', { autoComplete: 'off', dir: 'ltr' })}
        <Field id="ca-phone" label={label('phone', t.contact.phone)} error={errors.phone} required requiredLabel={t.apply.required}>
          <Input
            id="ca-phone"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            dir="ltr"
            placeholder="+994 50 123 45 67…"
            value={values.phone}
            onChange={(e) => set('phone', e.target.value)}
            onBlur={() => {
              const n = normalizeAzPhone(values.phone);
              if (n) set('phone', formatAzPhone(n));
            }}
            className="tabular-nums rtl:text-end"
            {...bind('phone')}
          />
        </Field>
        {textField('workplace', { autoComplete: 'organization' })}
        {textField('salary', { inputMode: 'decimal' })}
        {textField('amount', { inputMode: 'decimal' })}
        <Field id="ca-currency" label={label('currency', t.rates.currency)} error={errors.currency} required requiredLabel={t.apply.required}>
          <Select id="ca-currency" name="currency" value={values.currency} onChange={(e) => set('currency', e.target.value)} {...bind('currency')}>
            {['AZN', 'USD', 'EUR'].map((c) => (
              <option key={c}>{c}</option>
            ))}
          </Select>
        </Field>
        <Field id="ca-term" label={label('term', t.calc.term)} error={errors.term} required requiredLabel={t.apply.required}>
          <Select id="ca-term" name="term" value={values.term} onChange={(e) => set('term', e.target.value)} {...bind('term')}>
            <option value="" disabled>
              —
            </option>
            {TERMS.map((n) => (
              <option key={n} value={n}>
                {fmt(t.calc.termValue, { n })}
              </option>
            ))}
          </Select>
        </Field>
        {textField('purpose', {})}

        {(['consentRegistry', 'consentAsan'] as const).map((key) => (
          <div key={key} className="sm:col-span-2">
            <label
              className={cx(
                'flex cursor-pointer items-start gap-3 rounded-lg border p-4 text-sm leading-relaxed text-slate-700 transition-colors duration-200',
                'has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-gold-500',
                errors[key] ? 'border-danger' : 'border-line hover:border-slate-300',
              )}
            >
              <input
                ref={(el) => {
                  refs.current[key] = el;
                }}
                type="checkbox"
                name={key}
                checked={values[key]}
                onChange={(e) => set(key, e.target.checked)}
                aria-invalid={errors[key] ? true : undefined}
                aria-describedby={errors[key] ? `ca-${key}-error` : undefined}
                className="mt-0.5 size-5 shrink-0 accent-navy-900"
              />
              <span>{consentText(spec[key])}</span>
            </label>
            {errors[key] && <FieldError id={`ca-${key}-error`}>{errors[key]}</FieldError>}
          </div>
        ))}
      </div>

      {/* Honeypot for bots; hidden from people and assistive technology. */}
      <input ref={honeypot} type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -start-[9999px] size-px opacity-0" />

      <p className="mt-6 flex gap-2.5 text-[13px] leading-relaxed text-slate-600">
        <ShieldCheck className="mt-px size-4 shrink-0 text-success" aria-hidden="true" />
        {t.apply.security}
      </p>
      <button type="submit" aria-disabled={status.kind === 'submitting'} className={buttonClass('primary', 'lg', 'mt-6 w-full sm:w-auto')}>
        {status.kind === 'submitting' && <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />}
        {status.kind === 'submitting' ? t.apply.submitting : t.apply.submit}
      </button>
    </form>
  );
}
