import type { ReactNode } from 'react';
import { cx } from '../../utils/cx';

interface SectionHeaderProps {
  id: string;
  eyebrow: string;
  title: string;
  lead?: ReactNode;
  dark?: boolean;
  className?: string;
  as?: 'h2' | 'h3';
}

export function SectionHeader({ id, eyebrow, title, lead, dark, className, as: Heading = 'h2' }: SectionHeaderProps) {
  return (
    <div className={cx('max-w-2xl', className)}>
      <p className={cx('text-xs font-semibold uppercase tracking-[0.14em]', dark ? 'text-gold-400' : 'text-gold-700')}>{eyebrow}</p>
      <Heading
        id={id}
        className={cx(
          'mt-3 text-[2rem] font-bold leading-tight tracking-tight md:text-[2.25rem] lg:text-[2.5rem]',
          dark ? 'text-white' : 'text-navy-900',
        )}
      >
        {title}
      </Heading>
      {lead && <p className={cx('mt-4 text-base leading-relaxed md:text-[17px]', dark ? 'text-white/75' : 'text-slate-600')}>{lead}</p>}
    </div>
  );
}
