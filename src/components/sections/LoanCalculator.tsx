import type { Dispatch, SetStateAction } from 'react';
import { Info } from 'lucide-react';
import type { LoanInput } from '../../types/banking';
import { useI18n } from '../../i18n';
import { CALCULATOR_PRODUCTS, LOAN_LIMITS, getLoanProduct } from '../../data/loanProducts';
import { useLoanCalculator } from '../../hooks/useLoanCalculator';
import { formatNumber } from '../../utils/currency';
import { cx } from '../../utils/cx';
import { SectionHeader } from '../ui/SectionHeader';
import { SliderField } from '../ui/Slider';
import { LoanSummary } from '../banking/LoanSummary';
import { PRODUCT_ICONS } from '../banking/ProductShowcase';

interface LoanCalculatorProps {
  loan: LoanInput;
  setLoan: Dispatch<SetStateAction<LoanInput>>;
  onApply: () => void;
}

export function LoanCalculator({ loan, setLoan, onApply }: LoanCalculatorProps) {
  const { t, lang } = useI18n();
  const summary = useLoanCalculator(loan);
  const fmtInt = (v: number) => formatNumber(v, lang);

  return (
    <section id="calculator" aria-labelledby="calc-title" className="section-y border-t border-line bg-white">
      <div className="container-page">
        <SectionHeader id="calc-title" eyebrow={t.calc.eyebrow} title={t.calc.title} lead={t.calc.lead} />

        <div className="mt-10 grid overflow-hidden rounded-2xl border border-line lg:grid-cols-12">
          <div className="space-y-8 bg-surface p-5 sm:p-8 lg:col-span-7">
            <fieldset>
              <legend className="text-sm font-semibold text-navy-900">{t.calc.type}</legend>
              <div className="mt-3 grid grid-cols-3 gap-2 sm:gap-3">
                {CALCULATOR_PRODUCTS.map((p) => {
                  const Icon = PRODUCT_ICONS[p.id];
                  const checked = p.id === loan.productId;
                  return (
                    <label
                      key={p.id}
                      className={cx(
                        'relative flex cursor-pointer flex-col gap-2 rounded-xl border bg-white p-3 sm:p-4',
                        'transition-[border-color,box-shadow] duration-200 ease-out',
                        'has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-gold-500',
                        checked ? 'border-navy-900 shadow-[0_0_0_1px_#0B1F3A]' : 'border-line hover:border-slate-300',
                      )}
                    >
                      <input
                        type="radio"
                        name="loan-product"
                        value={p.id}
                        checked={checked}
                        onChange={() => setLoan((l) => ({ ...l, productId: p.id }))}
                        className="sr-only"
                      />
                      <Icon className={cx('size-5', checked ? 'text-gold-700' : 'text-slate-500')} aria-hidden="true" />
                      <span className="text-sm font-semibold leading-tight text-navy-900">{t.products[p.id].short}</span>
                      <span className="text-[13px] text-slate-600 tabular-nums">{formatNumber(p.annualRate, lang)}%</span>
                    </label>
                  );
                })}
              </div>
              <p className="mt-3 flex gap-2 text-[13px] text-slate-600">
                <Info className="mt-px size-4 shrink-0" aria-hidden="true" />
                {t.calc.autoNote}
              </p>
            </fieldset>

            <SliderField
              label={t.calc.amount}
              value={loan.amount}
              onChange={(amount) => setLoan((l) => ({ ...l, amount }))}
              {...LOAN_LIMITS.amount}
              unit="AZN"
              format={fmtInt}
            />
            <SliderField
              label={t.calc.term}
              value={loan.termMonths}
              onChange={(termMonths) => setLoan((l) => ({ ...l, termMonths }))}
              {...LOAN_LIMITS.term}
              unit={t.common.months}
              format={fmtInt}
            />
          </div>

          <div className="lg:col-span-5">
            <LoanSummary summary={summary} termsUrl={getLoanProduct(loan.productId).termsUrl} onApply={onApply} />
          </div>
        </div>
      </div>
    </section>
  );
}
