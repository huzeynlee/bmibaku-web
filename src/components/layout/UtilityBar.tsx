import { Calculator, Clock, FileSearch } from 'lucide-react';
import type { Dictionary } from '@/i18n/az';
import { LINKS } from '@/data/banking';
import { LanguageSwitcher } from './LanguageSwitcher';
import { NewTabHint } from '../ui/NewTabHint';

const linkCls = 'focus-ring-dark inline-flex min-h-8 items-center gap-1.5 rounded transition-colors duration-200 ease-out hover:text-white';

export function UtilityBar({ t }: { t: Dictionary }) {
  return (
    <div className="bg-navy-950 text-[13px] text-white/75" data-reveal="">
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
            <a href={LINKS.concessionCalculator} target="_blank" rel="noopener noreferrer" className={linkCls}>
              <Calculator className="size-3.5" aria-hidden="true" />
              {t.util.concession}
              <NewTabHint text={t.common.newTab} />
            </a>
            <a href={LINKS.creditRegistry} target="_blank" rel="noopener noreferrer" className={linkCls}>
              <FileSearch className="size-3.5" aria-hidden="true" />
              {t.util.registry}
              <NewTabHint text={t.common.newTab} />
            </a>
          </nav>
          <LanguageSwitcher />
        </div>
      </div>
    </div>
  );
}
