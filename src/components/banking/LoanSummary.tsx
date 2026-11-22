import { ArrowRight } from 'lucide-react';
import type { LoanSummary as Summary } from '../../types/banking';
import { useI18n } from '../../i18n';
import { formatMoney, formatNumber } from '../../utils/currency';
import { fmt } from '../../utils/cx';
import { Button, ButtonLink } from '../ui/Button';

interface LoanSummaryProps {
  summary: Summary;
  termsUrl: string;
  onApply: () => void;
}

export function LoanSummary({ summary, termsUrl, onApply }: LoanSummaryProps) {
  const { t, lang } = useI18n();

  const rows: [string, string][] = [
    [t.calc.principal, `${formatMoney(summary.principal, lang)} AZN`],
    [t.calc.rate, `${formatNumber(summary.annualRate, lang)}%`],
    [t.calc.term, fmt(t.calc.termValue, { n: summary.termMonths })],
    [t.calc.total, `${formatMoney(summary.totalPayment, lang)} AZN`],
    [t.calc.interest, `${formatMoney(summary.totalInterest, lang)} AZN`],
  ];

  return (
    <section aria-labelledby="loan-summary-title" className="flex h-full flex-col bg-navy-900 p-6 text-white sm:p-8">
      <h3 id="loan-summary-title" className="text-sm font-semibold text-white/70">
        {t.calc.summary}
      </h3>
      <p className="mt-5 text-sm text-white/70">{t.calc.monthly}</p>
      <p className="mt-1 text-[2.75rem] font-extrabold leading-none tracking-tight tabular-nums sm:text-[3.25rem]" aria-live="polite">
        {formatMoney(summary.monthlyPayment, lang)}
        <span className="ms-2 text-xl font-semibold text-gold-400">AZN</span>
      </p>

      <dl className="mt-7 divide-y divide-white/10 border-y border-white/10 text-sm">
        {rows.map(([k, v]) => (
          <div key={k} className="flex items-center justify-between gap-4 py-3">
            <dt className="text-white/70">{k}</dt>
            <dd className="font-semibold tabular-nums">{v}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-7 flex flex-col gap-2.5 sm:flex-row lg:flex-col xl:flex-row">
        <Button variant="gold" size="lg" onClick={onApply} className="focus-visible:ring-offset-navy-900 sm:flex-1">
          {t.calc.apply}
          <ArrowRight className="size-4 rtl:rotate-180" aria-hidden="true" />
        </Button>
        <ButtonLink href={termsUrl} variant="onDark" size="lg" className="sm:flex-1">
          {t.calc.terms}
        </ButtonLink>
      </div>

      <div className="mt-6 space-y-2 text-[13px] leading-relaxed text-white/65">
        <p>{t.calc.disclaimer}</p>
        <p>{t.calc.fees}</p>
      </div>
    </section>
  );
}
