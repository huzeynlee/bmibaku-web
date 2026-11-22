import { useId } from 'react';
import { cx } from '../../utils/cx';

interface SegmentedProps<T extends string> {
  label: string;
  value: T;
  onChange: (value: T) => void;
  options: { value: T; label: string; disabled?: boolean }[];
  className?: string;
}

/** Native radio group styled as a segmented control; arrow keys work natively. */
export function Segmented<T extends string>({ label, value, onChange, options, className }: SegmentedProps<T>) {
  const name = useId();
  return (
    <fieldset className={cx('inline-flex rounded-lg bg-slate-100 p-1', className)}>
      <legend className="sr-only">{label}</legend>
      {options.map((o) => (
        <label
          key={o.value}
          className={cx(
            'relative flex h-9 cursor-pointer items-center rounded-md px-3.5 text-sm font-semibold',
            'transition-[background-color,color,box-shadow] duration-200 ease-out',
            'has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-gold-500',
            value === o.value ? 'bg-white text-navy-900 shadow-sm' : 'text-slate-600 hover:text-navy-900',
            o.disabled && 'cursor-not-allowed opacity-50 hover:text-slate-600',
          )}
        >
          <input
            type="radio"
            name={name}
            value={o.value}
            checked={value === o.value}
            disabled={o.disabled}
            onChange={() => onChange(o.value)}
            className="sr-only"
          />
          {o.label}
        </label>
      ))}
    </fieldset>
  );
}
