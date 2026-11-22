'use client';

import { AnimatePresence, motion } from 'motion/react';
import { useMemo, useState } from 'react';
import { Download, FileText, Search } from 'lucide-react';
import type { DocItem } from '@/content/types';
import { useI18n } from '@/i18n/client';
import { fmt } from '@/utils/cx';

const EXT_LABEL: Record<string, string> = { pdf: 'PDF', doc: 'DOC', docx: 'DOCX', xls: 'XLS', xlsx: 'XLSX', ppt: 'PPT', pptx: 'PPTX', zip: 'ZIP', rar: 'RAR' };

/**
 * Document list. With more than six items it becomes a searchable archive
 * grouped by year (year inferred from the title or the upload path).
 */
export function DocumentArchive({ title, items }: { title: string | null; items: DocItem[] }) {
  const { t } = useI18n();
  const [query, setQuery] = useState('');
  const [year, setYear] = useState<number | 'all'>('all');
  const archive = items.length > 6;

  const years = useMemo(() => [...new Set(items.map((d) => d.year).filter((y): y is number => !!y))].sort((a, b) => b - a), [items]);
  const filtered = useMemo(() => {
    const q = query.trim().toLocaleLowerCase();
    return items.filter((d) => (year === 'all' || d.year === year) && (!q || `${d.title} ${d.year ?? ''}`.toLocaleLowerCase().includes(q)));
  }, [items, query, year]);

  const groups = archive
    ? [...new Set(filtered.map((d) => d.year ?? 0))].sort((a, b) => b - a).map((y) => ({ year: y, docs: filtered.filter((d) => (d.year ?? 0) === y) }))
    : [{ year: 0, docs: filtered }];

  return (
    <section className="rounded-2xl border border-line bg-white">
      <div className="flex flex-col gap-4 border-b border-line p-5 md:flex-row md:items-center md:justify-between">
        <div>
          {title && <h2 className="text-lg font-bold text-navy-900">{title}</h2>}
          <p className="text-[13px] text-slate-500 tabular-nums">{fmt(t.documents.count, { n: filtered.length })}</p>
        </div>
        {archive && (
          <div className="flex flex-col gap-2 sm:flex-row">
            <label className="relative block">
              <span className="sr-only">{t.documents.search}</span>
              <Search className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t.documents.searchPlaceholder}
                autoComplete="off"
                className="h-11 w-full rounded-lg border border-line bg-white pe-3 ps-9 text-sm text-ink transition-[border-color,box-shadow] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 sm:w-60"
              />
            </label>
            {years.length > 1 && (
              <label className="block">
                <span className="sr-only">{t.documents.year}</span>
                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                  className="h-11 w-full cursor-pointer rounded-lg border border-line bg-white px-3 text-sm font-medium text-navy-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 sm:w-40"
                >
                  <option value="all">{t.documents.allYears}</option>
                  {years.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </label>
            )}
          </div>
        )}
      </div>

      {filtered.length === 0 ? (
        <p className="p-6 text-sm text-slate-600" role="status">
          {t.documents.empty}
        </p>
      ) : (
        <div className="divide-y divide-line">
          {groups.map((g) => (
            <div key={g.year}>
              {archive && g.year > 0 && (
                <p className="sticky top-[4.5rem] z-[1] bg-surface/95 px-5 py-2 text-xs font-bold tracking-[0.12em] text-gold-700 backdrop-blur tabular-nums">{g.year}</p>
              )}
              <ul className="divide-y divide-line">
                <AnimatePresence initial={false}>
                  {g.docs.map((d) => (
                    <motion.li key={d.url} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                      <a
                        href={d.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="focus-ring group flex items-center gap-4 px-5 py-3.5 transition-colors duration-200 hover:bg-navy-50"
                      >
                        <span className="grid size-10 shrink-0 place-items-center rounded-lg border border-line bg-surface text-navy-900 transition-colors duration-200 group-hover:border-gold-500/50 group-hover:text-gold-700">
                          <FileText className="size-[18px]" aria-hidden="true" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-sm font-medium text-navy-900 tabular-nums">{d.title}</span>
                          <span className="mt-0.5 block text-xs text-slate-500">{EXT_LABEL[d.ext] ?? d.ext.toUpperCase()}</span>
                        </span>
                        <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-navy-900">
                          <span className="hidden sm:inline">{t.common.download}</span>
                          <Download className="size-4 transition-transform duration-200 group-hover:translate-y-0.5" aria-hidden="true" />
                        </span>
                        <span className="sr-only"> {t.common.newTab}</span>
                      </a>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
