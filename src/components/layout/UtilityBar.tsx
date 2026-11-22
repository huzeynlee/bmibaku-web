import { Calculator, Clock, FileSearch } from 'lucide-react';
import { LANGUAGES, useI18n } from '../../i18n';
import { LINKS } from '../../data/banking';
import { cx } from '../../utils/cx';
import { ExternalLink } from '../ui/Button';

export function LanguageSwitcher({ dark = true, className }: { dark?: boolean; className?: string }) {
  const { lang, setLang, t } = useI18n();
  return (
    <div role="group" aria-label={t.util.language} className={cx('flex items-center', className)}>
      {LANGUAGES.map((l, i) => (
        <span key={l.code} className="flex items-center">
          {i > 0 && (
            <span aria-hidden="true" className={cx('px-0.5', dark ? 'text-white/25' : 'text-slate-300')}>
              |
            </span>
          )}
          <button
            type="button"
            lang={l.code}
            aria-pressed={lang === l.code}
            onClick={() => setLang(l.code)}
            className={cx(
              'grid h-8 min-w-8 place-items-center rounded px-1.5 text-xs font-semibold tracking-wide transition-colors duration-200 ease-out',
              dark ? 'focus-ring-dark' : 'focus-ring',
              lang === l.code
                ? dark
                  ? 'text-gold-400'
                  : 'text-gold-700'
                : dark
                  ? 'text-white/70 hover:text-white'
                  : 'text-slate-600 hover:text-navy-900',
            )}
          >
            {l.label}
            <span className="sr-only"> {l.name}</span>
          </button>
        </span>
      ))}
    </div>
  );
}

const linkCls = 'focus-ring-dark inline-flex items-center gap-1.5 rounded transition-colors duration-200 ease-out hover:text-white';

export function UtilityBar() {
  const { t } = useI18n();
  return (
    <div className="bg-navy-950 text-[13px] text-white/75">
      <div className="container-page flex h-10 items-center justify-between gap-4">
        <p className="flex min-w-0 items-center gap-2">
          <Clock className="size-3.5 shrink-0 text-gold-400" aria-hidden="true" />
          <span className="truncate tabular-nums">{t.util.hours}</span>
          <span aria-hidden="true" className="hidden text-white/25 sm:inline">
            |
          </span>
          <span className="hidden truncate sm:inline">{t.util.weekend}</span>
        </p>
        <div className="flex shrink-0 items-center gap-5">
          <nav aria-label={t.util.links} className="hidden items-center gap-5 lg:flex">
            <ExternalLink href={LINKS.concessionCalculator} className={linkCls} showIcon={false}>
              <Calculator className="size-3.5" aria-hidden="true" />
              {t.util.concession}
            </ExternalLink>
            <ExternalLink href={LINKS.creditRegistry} className={linkCls} showIcon={false}>
              <FileSearch className="size-3.5" aria-hidden="true" />
              {t.util.registry}
            </ExternalLink>
          </nav>
          <LanguageSwitcher />
        </div>
      </div>
    </div>
  );
}
