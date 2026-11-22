import { cx } from '@/utils/cx';

// Shared by server and client components (kept out of any 'use client' module).

export type ButtonVariant = 'primary' | 'gold' | 'secondary' | 'ghost' | 'onDark';
export type ButtonSize = 'sm' | 'md' | 'lg';

const BASE =
  'group/btn inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-semibold ' +
  'transition-[background-color,border-color,color,box-shadow,transform] duration-200 ease-out ' +
  'active:translate-y-px disabled:pointer-events-none disabled:opacity-60 aria-disabled:pointer-events-none';

const VARIANTS: Record<ButtonVariant, string> = {
  primary: 'focus-ring bg-navy-900 text-white hover:-translate-y-px hover:bg-navy-800 hover:shadow-lg hover:shadow-navy-900/20',
  gold: 'focus-ring bg-gold-500 text-navy-950 hover:-translate-y-px hover:bg-gold-400 hover:shadow-lg hover:shadow-gold-500/30',
  secondary: 'focus-ring border border-line bg-white text-navy-900 hover:border-navy-900/30 hover:bg-navy-50',
  ghost: 'focus-ring text-navy-900 hover:bg-navy-50',
  onDark: 'focus-ring-dark border border-white/25 text-white hover:border-white/50 hover:bg-white/10',
};

const SIZES: Record<ButtonSize, string> = {
  sm: 'h-9 px-3.5 text-sm',
  md: 'h-11 px-5 text-sm',
  lg: 'h-12 px-6 text-[15px]',
};

export function buttonClass(variant: ButtonVariant = 'primary', size: ButtonSize = 'md', className?: string): string {
  return cx(BASE, VARIANTS[variant], SIZES[size], className);
}
