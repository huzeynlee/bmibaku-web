import Link from 'next/link';
import { Lock, TrendingUp } from 'lucide-react';
import type { Dictionary } from '@/i18n/az';
import { localePath, type Locale } from '@/i18n/config';
import { LINKS } from '@/data/banking';

const item =
  'focus-ring flex h-14 flex-col items-center justify-center gap-1 rounded-lg px-2 text-[13px] font-semibold transition-colors duration-200 ease-out';

/** Phone-only bar; the layout adds matching bottom padding so it never covers content. */
export function MobileActionBar({ t, locale }: { t: Dictionary; locale: Locale }) {
  return (
    <nav
      aria-label={t.mobileBar.label}
      className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-white/95 px-4 pt-2.5 backdrop-blur-xl md:hidden"
      style={{ paddingBottom: 'max(0.625rem, env(safe-area-inset-bottom))' }}
    >
      <ul className="grid grid-cols-2 gap-2.5">
        <li>
          <a href={LINKS.internetBanking} className={`${item} bg-navy-900 text-white hover:bg-navy-800`}>
            <Lock className="size-4 shrink-0 text-gold-400" aria-hidden="true" />
            <span className="max-w-full truncate">{t.mobileBar.ib}</span>
          </a>
        </li>
        <li>
          <Link href={`${localePath(locale)}#rates`} className={`${item} border border-line bg-white text-navy-900 hover:bg-navy-50`}>
            <TrendingUp className="size-4 shrink-0 text-gold-700" aria-hidden="true" />
            <span className="max-w-full truncate">{t.mobileBar.rates}</span>
          </Link>
        </li>
      </ul>
    </nav>
  );
}
