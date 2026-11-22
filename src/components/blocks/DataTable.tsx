import type { TableCell } from '@/content/types';
import { cx } from '@/utils/cx';

const text = (html: string) => html.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').trim();

/**
 * Source tables in two shapes:
 * - key/value (2 columns, e.g. loan terms): a definition list, readable on phones;
 * - data tables (3+ columns, e.g. tariffs): scrollable table with a sticky first column.
 */
export function DataTable({ rows, label }: { rows: TableCell[][]; label: string }) {
  const maxCols = Math.max(...rows.map((r) => r.reduce((n, c) => n + (c.colspan ?? 1), 0)));
  const nonEmpty = rows.filter((r) => r.some((c) => text(c.html)));

  if (maxCols === 2 && nonEmpty.every((r) => r.length <= 2)) {
    return (
      <dl className="divide-y divide-line overflow-hidden rounded-xl border border-line bg-white">
        {nonEmpty.map((r, i) =>
          r.length === 1 ? (
            <div key={i} className="bg-navy-50 px-5 py-3 text-sm font-semibold text-navy-900" dangerouslySetInnerHTML={{ __html: r[0]!.html }} />
          ) : (
            <div key={i} className="grid gap-1 px-5 py-3.5 transition-colors duration-200 hover:bg-slate-50 sm:grid-cols-[minmax(0,15rem)_1fr] sm:gap-6">
              <dt className="prose-bank text-sm font-semibold text-navy-900" dangerouslySetInnerHTML={{ __html: r[0]!.html }} />
              <dd className="prose-bank text-[15px] text-slate-700" dangerouslySetInnerHTML={{ __html: r[1]!.html }} />
            </div>
          ),
        )}
      </dl>
    );
  }

  const [first, ...rest] = nonEmpty;
  const headerRow = first && (first.every((c) => c.header) || first.every((c) => /^<strong>/.test(c.html) || !c.html));
  const body = headerRow ? rest : nonEmpty;

  return (
    <div className="relative overflow-hidden rounded-xl border border-line bg-white">
      <div className="overflow-x-auto overscroll-x-contain" tabIndex={0} role="region" aria-label={label}>
        <table className="w-full min-w-[36rem] border-collapse text-sm">
          {headerRow && first && (
            <thead className="bg-navy-900 text-white">
              <tr>
                {first.map((c, i) => (
                  <th key={i} scope="col" colSpan={c.colspan} rowSpan={c.rowspan} className="px-4 py-3 text-start align-bottom text-[13px] font-semibold" dangerouslySetInnerHTML={{ __html: text(c.html) }} />
                ))}
              </tr>
            </thead>
          )}
          <tbody className="divide-y divide-line">
            {body.map((r, i) => (
              <tr key={i} className="transition-colors duration-200 hover:bg-slate-50">
                {r.map((c, j) =>
                  j === 0 ? (
                    <th
                      key={j}
                      scope="row"
                      colSpan={c.colspan}
                      rowSpan={c.rowspan}
                      className={cx('sticky start-0 bg-white px-4 py-3 text-start align-top font-semibold text-navy-900 prose-bank', 'shadow-[1px_0_0_#E2E8F0] rtl:shadow-[-1px_0_0_#E2E8F0]')}
                      dangerouslySetInnerHTML={{ __html: c.html }}
                    />
                  ) : (
                    <td key={j} colSpan={c.colspan} rowSpan={c.rowspan} className="prose-bank px-4 py-3 align-top text-slate-700 tabular-nums" dangerouslySetInnerHTML={{ __html: c.html }} />
                  ),
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
