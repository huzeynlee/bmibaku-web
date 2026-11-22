'use client';

import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';
import { CircleAlert } from 'lucide-react';
import { cx } from '../../utils/cx';

export const fieldClass = (invalid?: boolean, className?: string): string =>
  cx(
    'h-12 w-full rounded-lg border bg-white px-3.5 text-[15px] text-ink placeholder:text-slate-500',
    'transition-[border-color,box-shadow] duration-200 ease-out',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500',
    invalid ? 'border-danger' : 'border-line hover:border-slate-300',
    className,
  );

interface FieldProps {
  id: string;
  label: ReactNode;
  hint?: string;
  error?: string;
  required?: boolean;
  requiredLabel?: string;
  children: ReactNode;
  className?: string;
}

/** Label, control, hint and an error that uses an icon and text, not only color. */
export function Field({ id, label, hint, error, required, requiredLabel, children, className }: FieldProps) {
  return (
    <div className={className}>
      <label htmlFor={id} className="block text-sm font-semibold text-navy-900">
        {label}
        {required && (
          <>
            <span aria-hidden="true" className="ms-0.5 text-danger">
              *
            </span>
            {requiredLabel && <span className="sr-only"> ({requiredLabel})</span>}
          </>
        )}
      </label>
      <div className="mt-1.5">{children}</div>
      {hint && !error && (
        <p id={`${id}-hint`} className="mt-1.5 text-[13px] text-slate-500">
          {hint}
        </p>
      )}
      {error && <FieldError id={`${id}-error`}>{error}</FieldError>}
    </div>
  );
}

export function FieldError({ id, children }: { id: string; children: ReactNode }) {
  return (
    <p id={id} className="mt-1.5 flex items-start gap-1.5 text-[13px] font-medium text-danger">
      <CircleAlert className="mt-px size-4 shrink-0" aria-hidden="true" />
      <span>{children}</span>
    </p>
  );
}

export const describedBy = (id: string, error?: string, hint?: string): string | undefined =>
  error ? `${id}-error` : hint ? `${id}-hint` : undefined;

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input({ invalid, className, ...rest }, ref) {
  return <input ref={ref} aria-invalid={invalid || undefined} className={fieldClass(invalid, className)} {...rest} />;
});
