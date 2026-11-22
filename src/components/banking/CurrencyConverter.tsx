import { useId, useMemo, useState } from 'react';
import { ArrowDownUp } from 'lucide-react';
import type { CurrencyCode, CurrencyRate, RateMode } from '../../types/banking';
import { useI18n } from '../../i18n';
import { useCurrencyConverter, type ConversionDirection } from '../../hooks/useCurrencyConverter';
import { formatDate, formatFixed, formatRate } from '../../utils/currency';
import { fmt } from '../../utils/cx';
import { FieldError, fieldClass } from '../ui/Input';
import { Segmented } from '../ui/Segmented';
import { Select } from '../ui/Select';

interface CurrencyConverterProps {
  items: CurrencyRate[];
  asOf: string;
}

export function CurrencyConverter({ items, asOf }: CurrencyConverterProps) {
  const { t, lang } = useI18n();
  const ids = { amount: useId(), currency: useId(), result: useId() };
  const available = useMemo(() => items.filter((r) => r.cash || r.noncash), [items]);
  const [code, setCode] = useState<CurrencyCode>(available[0]?.code ?? 'USD');
  const [mode, setMode] = useState<RateMode>('cash');
  const [direction, setDirection] = useState<ConversionDirection>('toForeign');
  const [amount, setAmount] = useState('1000');

  const rate = available.find((r) => r.code === code);
  const result = useCurrencyConverter(rate, mode, direction, amount);

  if (!rate) {
    return (
      <div className="rounded-2xl border border-line bg-white p-6">
        <h3 className="text-lg font-bold text-navy-900">{t.converter.title}</h3>
        <p className="mt-3 text-sm text-slate-600">{t.converter.noCurrencies}</p>
      </div>
    );
  }

  const toForeign = direction === 'toForeign';
  const inputError =
    result.status === 'invalid' ? t.converter.invalid : result.status === 'too-large' ? t.converter.tooLarge : undefined;

  const currencySelect = (
    <Select
      id={ids.currency}
      aria-label={t.converter.currency}
      value={code}
      onChange={(e) => setCode(e.target.value as CurrencyCode)}
      wrapperClassName="w-28 shrink-0"
    >
      {available.map((r) => (
        <option key={r.code} value={r.code}>
          {r.code}
        </option>
      ))}
    </Select>
  );
  const azn = (
    <span translate="no" className="grid h-12 w-28 shrink-0 place-items-center rounded-lg border border-line bg-slate-50 text-[15px] font-semibold text-navy-900">
      AZN
    </span>
  );

  return (
    <div className="flex h-full flex-col rounded-2xl border border-line bg-white p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-lg font-bold text-navy-900">{t.converter.title}</h3>
        <Segmented<RateMode>
          label={t.converter.mode}
          value={mode}
          onChange={setMode}
          options={[
            { value: 'cash', label: t.rates.cash, disabled: !rate.cash },
            { value: 'noncash', label: t.rates.noncash, disabled: !rate.noncash },
          ]}
        />
      </div>

      <div className="mt-5">
        <label htmlFor={ids.amount} className="text-sm font-semibold text-navy-900">
          {t.converter.give}
        </label>
        <div className="mt-1.5 flex gap-2">
          <input
            id={ids.amount}
            name="converter-amount"
            type="text"
            inputMode="decimal"
            autoComplete="off"
            spellCheck={false}
            value={amount}
            onChange={(e) => setAmount(e.target.value.replace(/[^\d.,]/g, ''))}
            aria-invalid={inputError ? true : undefined}
            aria-describedby={inputError ? `${ids.amount}-error` : undefined}
            className={fieldClass(!!inputError, 'min-w-0 flex-1 text-lg font-semibold tabular-nums')}
          />
          {toForeign ? azn : currencySelect}
        </div>
        {inputError && <FieldError id={`${ids.amount}-error`}>{inputError}</FieldError>}
      </div>

      <div className="relative my-3 flex justify-center">
        <span aria-hidden="true" className="absolute inset-x-0 top-1/2 h-px bg-line" />
        <button
          type="button"
          onClick={() => setDirection((d) => (d === 'toForeign' ? 'toAzn' : 'toForeign'))}
          aria-label={t.converter.swap}
          className="focus-ring relative grid size-11 place-items-center rounded-full border border-line bg-white text-navy-900 transition-[background-color,transform] duration-200 ease-out hover:bg-navy-50 active:rotate-180"
        >
          <ArrowDownUp className="size-4" aria-hidden="true" />
        </button>
      </div>

      <div>
        <p id={ids.result} className="text-sm font-semibold text-navy-900">
          {t.converter.get}
        </p>
        <div className="mt-1.5 flex gap-2">
          <output
            aria-labelledby={ids.result}
            aria-live="polite"
            className="flex h-12 min-w-0 flex-1 items-center truncate rounded-lg bg-navy-900 px-3.5 text-lg font-bold text-white tabular-nums"
          >
            {result.status === 'ok' ? formatFixed(result.result, lang, 2) : '—'}
          </output>
          {toForeign ? currencySelect : azn}
        </div>
      </div>

      <dl className="mt-auto space-y-1.5 border-t border-line pt-4 text-[13px] text-slate-600" aria-live="polite">
        <div className="flex flex-wrap justify-between gap-x-3">
          <dt>{t.converter.direction}</dt>
          <dd className="font-medium text-navy-900">{fmt(toForeign ? t.converter.sellsTo : t.converter.buysFrom, { code })}</dd>
        </div>
        <div className="flex flex-wrap justify-between gap-x-3">
          <dt>{t.converter.applied}</dt>
          <dd className="font-medium text-navy-900 tabular-nums">
            {result.status === 'ok'
              ? `${rate.unit} ${code} = ${formatRate(result.rate, lang)} AZN · ${toForeign ? t.converter.bankSells : t.converter.bankBuys}`
              : result.status === 'rate-unavailable'
                ? t.converter.rateUnavailable
                : '—'}
          </dd>
        </div>
      </dl>
      <p className="mt-1.5 text-[13px] text-slate-500 tabular-nums">{fmt(t.rates.updated, { date: formatDate(asOf, lang) })}</p>
    </div>
  );
}
