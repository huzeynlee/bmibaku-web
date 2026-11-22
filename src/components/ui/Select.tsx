import { forwardRef, type SelectHTMLAttributes } from 'react';
import { ChevronDown } from 'lucide-react';
import { cx } from '../../utils/cx';
import { fieldClass } from './Input';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  invalid?: boolean;
  wrapperClassName?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { invalid, className, wrapperClassName, children, ...rest },
  ref,
) {
  return (
    <div className={cx('relative', wrapperClassName)}>
      <select
        ref={ref}
        aria-invalid={invalid || undefined}
        className={fieldClass(invalid, cx('cursor-pointer appearance-none pe-10 font-medium', className))}
        {...rest}
      >
        {children}
      </select>
      <ChevronDown
        className="pointer-events-none absolute end-3 top-1/2 size-4 -translate-y-1/2 text-slate-500"
        aria-hidden="true"
      />
    </div>
  );
});
