import { cx } from '../../utils/cx';

interface LogoProps {
  name: string;
  branch: string;
  dark?: boolean;
}

/**
 * Official Bank Melli Iran emblem (from bmibaku.az, /public/brand/bmi-emblem.png)
 * with a typeset wordmark. The full official lockup is in /public/brand/bmi-logo-lockup.png.
 * The emblem is decorative here: the wordmark text names the bank.
 */
export function Logo({ name, branch, dark }: LogoProps) {
  return (
    <span className="flex min-w-0 items-center gap-3">
      <img src="/brand/bmi-emblem.png" width={44} height={44} alt="" decoding="async" className="size-11 shrink-0 object-contain" />
      <span className="min-w-0 leading-tight">
        <span translate="no" className={cx('block truncate text-[15px] font-bold', dark ? 'text-white' : 'text-navy-900')}>
          {name}
        </span>
        <span className={cx('block truncate text-xs font-medium', dark ? 'text-white/65' : 'text-slate-500')}>{branch}</span>
      </span>
    </span>
  );
}
