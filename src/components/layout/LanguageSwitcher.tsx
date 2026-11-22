'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LANGUAGE_NAMES, LOCALES, stripLocale, type Locale } from '@/i18n/config';
import { useI18n } from '@/i18n/client';
import { cx } from '@/utils/cx';

/** Links to the same page in each language. */
export function LanguageSwitcher({ dark = true, className }: { dark?: boolean; className?: string }) {
  const { locale, t } = useI18n();
  const path = stripLocale(usePathname() || '/');
  const hrefFor = (l: Locale) => (l === 'az' ? path : `/${l}${path === '/' ? '/' : path}`);

  return (
    <nav aria-label={t.util.language} className={cx('flex items-center', className)}>
      {LOCALES.map((l, i) => (
        <span key={l} className="flex items-center">
          {i > 0 && (
            <span aria-hidden="true" className={cx('px-0.5', dark ? 'text-white/25' : 'text-slate-300')}>
              |
            </span>
          )}
          <Link
            href={hrefFor(l)}
            hrefLang={LANGUAGE_NAMES[l].htmlLang}
            lang={LANGUAGE_NAMES[l].htmlLang}
            aria-current={l === locale ? 'true' : undefined}
            className={cx(
              'grid h-8 min-w-8 place-items-center rounded px-1.5 text-xs font-semibold tracking-wide transition-colors duration-200 ease-out',
              dark ? 'focus-ring-dark' : 'focus-ring',
              l === locale ? (dark ? 'text-gold-400' : 'text-gold-700') : dark ? 'text-white/70 hover:text-white' : 'text-slate-600 hover:text-navy-900',
            )}
          >
            {LANGUAGE_NAMES[l].label}
            <span className="sr-only"> {LANGUAGE_NAMES[l].name}</span>
          </Link>
        </span>
      ))}
    </nav>
  );
}
