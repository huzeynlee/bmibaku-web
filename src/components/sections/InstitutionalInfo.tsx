import { useEffect, useState } from 'react';
import { Calculator, Check, Copy, FileSearch, Landmark } from 'lucide-react';
import { useI18n } from '../../i18n';
import { INSTITUTION, LINKS } from '../../data/banking';
import { formatLongDate } from '../../utils/currency';
import { fmt } from '../../utils/cx';
import { ExternalLink } from '../ui/Button';
import { SectionHeader } from '../ui/SectionHeader';

function CopyButton({ value, label }: { value: string; label: string }) {
  const { t } = useI18n();
  const [state, setState] = useState<'idle' | 'copied' | 'failed'>('idle');

  useEffect(() => {
    if (state === 'idle') return;
    const timer = window.setTimeout(() => setState('idle'), 2000);
    return () => window.clearTimeout(timer);
  }, [state]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setState('copied');
    } catch {
      setState('failed');
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={copy}
        aria-label={`${t.common.copy}: ${label}`}
        className="focus-ring grid size-9 shrink-0 place-items-center rounded-md text-slate-500 transition-colors duration-200 ease-out hover:bg-navy-50 hover:text-navy-900"
      >
        {state === 'copied' ? <Check className="size-4 text-success" aria-hidden="true" /> : <Copy className="size-4" aria-hidden="true" />}
      </button>
      <span className="sr-only" aria-live="polite">
        {state === 'copied' ? t.common.copied : state === 'failed' ? t.common.copyFailed : ''}
      </span>
    </>
  );
}

const REFS = ['cbar', 'cbi', 'bmi', 'adif'] as const;

export function InstitutionalInfo() {
  const { t, lang } = useI18n();
  const f = t.institution.fields;
  const r = INSTITUTION.requisites;
  const rows: { label: string; value: string; copy?: boolean; mono?: boolean }[] = [
    { label: f.fullName, value: INSTITUTION.fullName },
    { label: f.founded, value: formatLongDate(INSTITUTION.founded, lang) },
    { label: f.license, value: fmt(t.institution.licenseValue, { number: INSTITUTION.license.number, date: formatLongDate(INSTITUTION.license.date, lang) }) },
    { label: f.taxId, value: r.taxId, copy: true, mono: true },
    { label: f.bankCode, value: r.bankCode, copy: true, mono: true },
    { label: f.swift, value: r.swift, copy: true, mono: true },
    { label: f.correspondent, value: r.correspondentAccount, copy: true, mono: true },
  ];

  return (
    <section id="institution" aria-labelledby="institution-title" className="section-y border-t border-line bg-white">
      <div className="container-page">
        <SectionHeader id="institution-title" eyebrow={t.institution.eyebrow} title={t.institution.title} lead={t.institution.lead} />

        <div className="mt-10 grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-600">{t.institution.requisites}</h3>
            <dl className="mt-4 divide-y divide-line border-y border-line">
              {rows.map((row) => (
                <div key={row.label} className="grid gap-1 py-3.5 sm:grid-cols-[minmax(0,15rem)_1fr] sm:items-center sm:gap-6">
                  <dt className="text-sm text-slate-600">{row.label}</dt>
                  <dd className="flex min-w-0 items-center justify-between gap-3">
                    <span dir={row.mono ? 'ltr' : undefined} translate={row.mono ? 'no' : undefined} className="min-w-0 break-all text-[15px] font-semibold text-navy-900 tabular-nums">
                      {row.value}
                    </span>
                    {row.copy && <CopyButton value={row.value} label={row.label} />}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="space-y-8 lg:col-span-5">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-600">{t.institution.regulators}</h3>
              <ul className="mt-4 divide-y divide-line border-y border-line">
                {REFS.map((key) => (
                  <li key={key}>
                    <ExternalLink
                      href={LINKS.references[key]}
                      className="focus-ring flex items-center gap-3 rounded-lg py-3.5 text-[15px] font-medium text-navy-900 transition-colors duration-200 ease-out hover:text-navy-700"
                      iconClassName="ms-auto"
                    >
                      <Landmark className="size-4 shrink-0 text-gold-700" aria-hidden="true" />
                      <span className="min-w-0">{t.institution.refs[key]}</span>
                    </ExternalLink>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-600">{t.institution.tools}</h3>
              <ul className="mt-4 divide-y divide-line border-y border-line">
                <li>
                  <ExternalLink
                    href={LINKS.concessionCalculator}
                    className="focus-ring flex items-center gap-3 rounded-lg py-3.5 text-[15px] font-medium text-navy-900 hover:text-navy-700"
                    iconClassName="ms-auto"
                  >
                    <Calculator className="size-4 shrink-0 text-gold-700" aria-hidden="true" />
                    {t.util.concession}
                  </ExternalLink>
                </li>
                <li>
                  <ExternalLink
                    href={LINKS.creditRegistry}
                    className="focus-ring flex items-center gap-3 rounded-lg py-3.5 text-[15px] font-medium text-navy-900 hover:text-navy-700"
                    iconClassName="ms-auto"
                  >
                    <FileSearch className="size-4 shrink-0 text-gold-700" aria-hidden="true" />
                    {t.util.registry}
                  </ExternalLink>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
