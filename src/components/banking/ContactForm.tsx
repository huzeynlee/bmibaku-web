'use client';

import { AnimatePresence, motion } from 'motion/react';
import { useRef, useState, type FormEvent } from 'react';
import { CircleAlert, CircleCheck, ExternalLink as ExternalIcon, LoaderCircle, Mail } from 'lucide-react';
import { useI18n } from '@/i18n/client';
import { CONTACT, LINKS } from '@/data/banking';
import { fmt } from '@/utils/cx';
import { isValidEmail, isValidPersonName, normalizeAzPhone } from '@/utils/validation';
import { Field, Input, describedBy, fieldClass } from '../ui/Input';
import { Select } from '../ui/Select';
import { Segmented } from '../ui/Segmented';
import { buttonClass } from '../ui/buttonClass';

type Kind = 'general' | 'complaint';
type Status = { kind: 'idle' | 'sending' | 'not-configured' | 'error' } | { kind: 'success'; reference: string };
type Key = 'name' | 'email' | 'phone' | 'topic' | 'message';

/** General inquiries and complaints, sent through /api/contact. */
export function ContactForm({ topics }: { topics: string[] }) {
  const { t, locale } = useI18n();
  const [kind, setKind] = useState<Kind>('general');
  const [values, setValues] = useState<Record<Key, string>>({ name: '', email: '', phone: '', topic: topics[0] ?? '', message: '' });
  const [errors, setErrors] = useState<Partial<Record<Key, string>>>({});
  const [status, setStatus] = useState<Status>({ kind: 'idle' });
  const refs = useRef<Partial<Record<Key, HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null>>>({});
  const honeypot = useRef<HTMLInputElement>(null);

  const set = (k: Key, v: string) => {
    setValues((s) => ({ ...s, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const onSubmit = async (ev: FormEvent) => {
    ev.preventDefault();
    const e: Partial<Record<Key, string>> = {};
    if (!isValidPersonName(values.name)) e.name = t.contact.errors.name;
    if (!isValidEmail(values.email)) e.email = t.contact.errors.email;
    if (values.phone && !normalizeAzPhone(values.phone)) e.phone = t.apply.errors.phone;
    if (values.message.trim().length < 10) e.message = t.contact.errors.message;
    setErrors(e);
    const first = (['name', 'email', 'phone', 'message'] as Key[]).find((k) => e[k]);
    if (first) return refs.current[first]?.focus();

    setStatus({ kind: 'sending' });
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, kind, locale, website: honeypot.current?.value ?? '' }),
      });
      if (res.status === 503) return setStatus({ kind: 'not-configured' });
      const data = (await res.json().catch(() => ({}))) as { reference?: string };
      if (!res.ok || !data.reference) throw new Error();
      setStatus({ kind: 'success', reference: data.reference });
    } catch {
      setStatus({ kind: 'error' });
    }
  };

  const bind = (k: Key) => ({
    ref: (el: HTMLInputElement | null) => {
      refs.current[k] = el;
    },
    invalid: !!errors[k],
    'aria-describedby': describedBy(`cf-${k}`, errors[k]),
  });

  if (status.kind === 'success' || status.kind === 'not-configured') {
    const ok = status.kind === 'success';
    return (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-line bg-white p-8 text-center" role="status">
        {ok ? <CircleCheck className="mx-auto size-11 text-success" aria-hidden="true" /> : <CircleAlert className="mx-auto size-11 text-warning" aria-hidden="true" />}
        <h3 className="mt-4 text-xl font-bold text-navy-900">{ok ? t.contact.successTitle : t.contact.notConfiguredTitle}</h3>
        <p className="mx-auto mt-2 max-w-md text-slate-600">{ok ? fmt(t.contact.successText, { id: status.reference }) : t.contact.notConfiguredText}</p>
        <div className="mt-6 flex flex-col justify-center gap-2.5 sm:flex-row">
          <a href={`mailto:${CONTACT.email}`} className={buttonClass('gold', 'md')}>
            <Mail className="size-4" aria-hidden="true" />
            {CONTACT.email}
          </a>
          <button type="button" onClick={() => setStatus({ kind: 'idle' })} className={buttonClass('secondary', 'md')}>
            {t.common.previous}
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <form noValidate onSubmit={onSubmit} className="rounded-2xl border border-line bg-white p-5 sm:p-7">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-lg font-bold text-navy-900">{t.contact.formTitle}</h3>
        <Segmented<Kind>
          label={t.contact.tabsLabel}
          value={kind}
          onChange={setKind}
          options={[
            { value: 'general', label: t.contact.general },
            { value: 'complaint', label: t.contact.complaint },
          ]}
        />
      </div>
      <AnimatePresence initial={false}>
        {kind === 'complaint' && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <p className="mt-4 rounded-lg bg-gold-50 px-4 py-3 text-[13px] leading-relaxed text-navy-900">
              {t.contact.complaintIntro}{' '}
              <a href={LINKS.cbarComplaints} target="_blank" rel="noopener noreferrer" className="font-semibold underline underline-offset-4">
                {t.contact.cbarComplaints}
                <ExternalIcon className="ms-1 inline size-3.5 align-[-2px]" aria-hidden="true" />
                <span className="sr-only"> {t.common.newTab}</span>
              </a>
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {status.kind === 'error' && (
        <p className="mt-4 flex gap-2 rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-800" role="alert">
          <CircleAlert className="mt-px size-4 shrink-0" aria-hidden="true" />
          {t.contact.errorText}
        </p>
      )}

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <Field id="cf-name" label={t.contact.name} error={errors.name} required requiredLabel={t.apply.required}>
          <Input id="cf-name" name="name" autoComplete="name" value={values.name} onChange={(e) => set('name', e.target.value)} aria-required="true" {...bind('name')} />
        </Field>
        <Field id="cf-email" label={t.contact.email} error={errors.email} required requiredLabel={t.apply.required}>
          <Input id="cf-email" name="email" type="email" autoComplete="email" spellCheck={false} dir="ltr" value={values.email} onChange={(e) => set('email', e.target.value)} aria-required="true" className="rtl:text-end" {...bind('email')} />
        </Field>
        <Field id="cf-phone" label={t.contact.phone} error={errors.phone}>
          <Input id="cf-phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" dir="ltr" value={values.phone} onChange={(e) => set('phone', e.target.value)} className="tabular-nums rtl:text-end" {...bind('phone')} />
        </Field>
        <Field id="cf-topic" label={t.contact.topic}>
          <Select id="cf-topic" name="topic" value={values.topic} onChange={(e) => set('topic', e.target.value)}>
            {topics.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </Select>
        </Field>
        <Field id="cf-message" label={t.contact.message} error={errors.message} required requiredLabel={t.apply.required} className="sm:col-span-2">
          <textarea
            ref={(el) => {
              refs.current.message = el;
            }}
            id="cf-message"
            name="message"
            rows={5}
            value={values.message}
            onChange={(e) => set('message', e.target.value)}
            aria-required="true"
            aria-invalid={errors.message ? true : undefined}
            aria-describedby={describedBy('cf-message', errors.message)}
            className={fieldClass(!!errors.message, 'h-auto min-h-32 py-3')}
          />
        </Field>
      </div>
      <input ref={honeypot} type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -start-[9999px] size-px opacity-0" />
      <button type="submit" aria-disabled={status.kind === 'sending'} className={buttonClass('primary', 'lg', 'mt-6 w-full sm:w-auto')}>
        {status.kind === 'sending' && <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />}
        {status.kind === 'sending' ? t.contact.sending : t.contact.send}
      </button>
    </form>
  );
}
