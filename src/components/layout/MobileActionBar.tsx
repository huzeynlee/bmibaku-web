import { Lock, TrendingUp } from 'lucide-react';
import { useI18n } from '../../i18n';
import { LINKS } from '../../data/banking';

/** Phone-only bar; the app shell adds matching bottom padding so it never covers content. */
export function MobileActionBar() {
  const { t } = useI18n();
  return (
    <nav
      aria-label={t.mobileBar.label}
      className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-white/95 px-4 pt-2.5 backdrop-blur-xl md:hidden"
      style={{ paddingBottom: 'max(0.625rem, env(safe-area-inset-bottom))' }}
    >
      <ul className="grid grid-cols-2 gap-2.5">
        <li>
          <a
            href={LINKS.internetBanking}
            className="focus-ring flex h-14 flex-col items-center justify-center gap-1 rounded-lg bg-navy-900 px-2 text-[13px] font-semibold text-white transition-colors duration-200 ease-out hover:bg-navy-800"
          >
            <Lock className="size-4 shrink-0 text-gold-400" aria-hidden="true" />
            <span className="max-w-full truncate">{t.mobileBar.ib}</span>
          </a>
        </li>
        <li>
          <a
            href="#rates"
            className="focus-ring flex h-14 flex-col items-center justify-center gap-1 rounded-lg border border-line bg-white px-2 text-[13px] font-semibold text-navy-900 transition-colors duration-200 ease-out hover:bg-navy-50"
          >
            <TrendingUp className="size-4 shrink-0 text-gold-700" aria-hidden="true" />
            <span className="max-w-full truncate">{t.mobileBar.rates}</span>
          </a>
        </li>
      </ul>
    </nav>
  );
}
