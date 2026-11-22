import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { cx } from '@/utils/cx';

export interface Crumb {
  label: string;
  href?: string;
}

/** Breadcrumb trail with BreadcrumbList structured data. */
export function Breadcrumbs({ items, label, dark, siteUrl }: { items: Crumb[]; label: string; dark?: boolean; siteUrl: string }) {
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.label, ...(c.href ? { item: `${siteUrl}${c.href}` } : {}) })),
  };
  return (
    <nav aria-label={label}>
      <ol className={cx('flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[13px]', dark ? 'text-white/65' : 'text-slate-500')}>
        {items.map((c, i) => {
          const last = i === items.length - 1;
          return (
            <li key={`${c.label}-${i}`} className="flex items-center gap-1.5">
              {c.href && !last ? (
                <Link
                  href={c.href}
                  className={cx('rounded underline-offset-4 transition-colors duration-200 hover:underline', dark ? 'focus-ring-dark hover:text-white' : 'focus-ring hover:text-navy-900')}
                >
                  {c.label}
                </Link>
              ) : (
                <span aria-current={last ? 'page' : undefined} className={cx(last && (dark ? 'text-white' : 'text-navy-900'), 'font-medium')}>
                  {c.label}
                </span>
              )}
              {!last && <ChevronRight className="size-3.5 opacity-60 rtl:rotate-180" aria-hidden="true" />}
            </li>
          );
        })}
      </ol>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
    </nav>
  );
}
