import type { CurrencyRate, RatePair } from '../../types/banking';
import { useI18n } from '../../i18n';
import { formatRate } from '../../utils/currency';
import { cx } from '../../utils/cx';

function CurrencyLabel({ rate }: { rate: CurrencyRate }) {
  const { t } = useI18n();
  return (
    <div className="flex min-w-0 items-center gap-3">
      <span translate="no" className="grid h-8 w-12 shrink-0 place-items-center rounded-md bg-navy-50 text-xs font-bold text-navy-900">
        {rate.code}
      </span>
      <span className="min-w-0">
        <span className="block truncate text-sm font-semibold text-navy-900 tabular-nums">
          {rate.unit} {rate.code}
        </span>
        <span className="block truncate text-[13px] text-slate-500">{t.rates.names[rate.code]}</span>
      </span>
    </div>
  );
}

function RateCell({ pair, side, className }: { pair: RatePair | null; side: 'buy' | 'sell'; className?: string }) {
  const { t, lang } = useI18n();
  return (
    <td className={cx('px-4 py-3.5 text-end text-[15px] font-medium tabular-nums', pair ? 'text-navy-900' : 'text-slate-500', className)}>
      {pair ? (
        formatRate(pair[side], lang)
      ) : (
        <>
          <span aria-hidden="true">—</span>
          <span className="sr-only">{t.rates.unavailable}</span>
        </>
      )}
    </td>
  );
}

/** Desktop: one table with cash and non-cash column groups. Phones: one card per currency. */
export function ExchangeTable({ items, caption }: { items: CurrencyRate[]; caption: string }) {
  const { t, lang } = useI18n();

  return (
    <>
      <div className="hidden overflow-hidden rounded-xl border border-line md:block">
        <table className="w-full border-collapse">
          <caption className="sr-only">{caption}</caption>
          <thead className="bg-slate-50 text-[13px] text-slate-600">
            <tr>
              <th scope="col" rowSpan={2} className="px-4 py-3 text-start align-bottom font-semibold">
                {t.rates.currency}
              </th>
              <th scope="colgroup" colSpan={2} className="border-s border-line px-4 pt-3 text-center text-xs font-semibold uppercase tracking-wider">
                {t.rates.cash}
              </th>
              <th scope="colgroup" colSpan={2} className="border-s border-line px-4 pt-3 text-center text-xs font-semibold uppercase tracking-wider">
                {t.rates.noncash}
              </th>
            </tr>
            <tr>
              <th scope="col" className="border-s border-line px-4 pb-3 pt-1 text-end font-medium">
                <span className="sr-only">{t.rates.cashBuy}</span>
                <span aria-hidden="true">{t.rates.buy}</span>
              </th>
              <th scope="col" className="px-4 pb-3 pt-1 text-end font-medium">
                <span className="sr-only">{t.rates.cashSell}</span>
                <span aria-hidden="true">{t.rates.sell}</span>
              </th>
              <th scope="col" className="border-s border-line px-4 pb-3 pt-1 text-end font-medium">
                <span className="sr-only">{t.rates.noncashBuy}</span>
                <span aria-hidden="true">{t.rates.buy}</span>
              </th>
              <th scope="col" className="px-4 pb-3 pt-1 text-end font-medium">
                <span className="sr-only">{t.rates.noncashSell}</span>
                <span aria-hidden="true">{t.rates.sell}</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line bg-white">
            {items.map((rate) => {
              const none = !rate.cash && !rate.noncash;
              return (
                <tr key={rate.code} className="transition-colors duration-200 ease-out hover:bg-slate-50">
                  <th scope="row" className="px-4 py-3 text-start font-normal">
                    <CurrencyLabel rate={rate} />
                  </th>
                  {none ? (
                    <td colSpan={4} className="border-s border-line px-4 py-3.5 text-center text-sm text-slate-500">
                      {t.rates.unavailable}
                    </td>
                  ) : (
                    <>
                      <RateCell pair={rate.cash} side="buy" className="border-s border-line" />
                      <RateCell pair={rate.cash} side="sell" />
                      <RateCell pair={rate.noncash} side="buy" className="border-s border-line" />
                      <RateCell pair={rate.noncash} side="sell" />
                    </>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <ul className="space-y-2.5 md:hidden" aria-label={caption}>
        {items.map((rate) => {
          const none = !rate.cash && !rate.noncash;
          return (
            <li key={rate.code} className="rounded-xl border border-line bg-white p-4">
              <CurrencyLabel rate={rate} />
              {none ? (
                <p className="mt-3 text-sm text-slate-500">{t.rates.unavailableLong}</p>
              ) : (
                <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-line pt-3">
                  {(
                    [
                      ['cash', t.rates.cashBuy, rate.cash, 'buy'],
                      ['cash', t.rates.cashSell, rate.cash, 'sell'],
                      ['noncash', t.rates.noncashBuy, rate.noncash, 'buy'],
                      ['noncash', t.rates.noncashSell, rate.noncash, 'sell'],
                    ] as const
                  ).map(([mode, label, pair, side]) => (
                    <div key={mode + side}>
                      <dt className="text-[13px] text-slate-500">{label}</dt>
                      <dd className="mt-0.5 text-base font-semibold text-navy-900 tabular-nums">
                        {pair ? formatRate(pair[side], lang) : t.rates.unavailable}
                      </dd>
                    </div>
                  ))}
                </dl>
              )}
            </li>
          );
        })}
      </ul>
    </>
  );
}
