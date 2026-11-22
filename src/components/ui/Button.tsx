import { forwardRef, type AnchorHTMLAttributes, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { ExternalLink as ExternalIcon } from 'lucide-react';
import { cx } from '../../utils/cx';
import { useI18n } from '../../i18n';

export type ButtonVariant = 'primary' | 'gold' | 'secondary' | 'ghost' | 'onDark';
export type ButtonSize = 'sm' | 'md' | 'lg';

const BASE =
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-semibold ' +
  'transition-[background-color,border-color,color,box-shadow,transform] duration-200 ease-out ' +
  'active:translate-y-px disabled:pointer-events-none disabled:opacity-60 aria-disabled:pointer-events-none';

const VARIANTS: Record<ButtonVariant, string> = {
  primary: 'focus-ring bg-navy-900 text-white hover:bg-navy-800 hover:shadow-md hover:shadow-navy-900/15',
  gold: 'focus-ring bg-gold-500 text-navy-950 hover:bg-gold-400 hover:shadow-md hover:shadow-gold-500/25',
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

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant, size, className, type = 'button', ...rest },
  ref,
) {
  return <button ref={ref} type={type} className={buttonClass(variant, size, className)} {...rest} />;
});

interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export function ButtonLink({ variant, size, className, ...rest }: LinkProps) {
  return <a className={buttonClass(variant, size, className)} {...rest} />;
}

interface ExternalLinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'target' | 'rel'> {
  children: ReactNode;
  showIcon?: boolean;
  iconClassName?: string;
}

/** Third-party link: new tab, no opener/referrer, announced to screen readers. */
export function ExternalLink({ children, showIcon = true, iconClassName, ...rest }: ExternalLinkProps) {
  const { t } = useI18n();
  return (
    <a target="_blank" rel="noopener noreferrer" {...rest}>
      {children}
      {showIcon && (
        <ExternalIcon className={cx('ms-1.5 inline size-3.5 shrink-0 align-[-2px] opacity-70', iconClassName)} aria-hidden="true" />
      )}
      <span className="sr-only"> {t.common.newTab}</span>
    </a>
  );
}
