import { useEffect, useId, useState } from 'react';
import { snap } from '../../utils/calculations';

interface SliderFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  unit: string;
  format: (v: number) => string;
}

/**
 * Range slider with a synchronized number field. The slider updates instantly;
 * typed values are snapped into range on blur or Enter.
 */
export function SliderField({ label, value, onChange, min, max, step, unit, format }: SliderFieldProps) {
  const id = useId();
  const [draft, setDraft] = useState(String(value));
  useEffect(() => setDraft(String(value)), [value]);

  const commit = () => {
    const n = Number(draft.replace(/[\s,]/g, ''));
    const next = draft.trim() !== '' && Number.isFinite(n) ? snap(n, min, max, step) : value;
    onChange(next);
    setDraft(String(next));
  };

  const fill = ((value - min) / (max - min)) * 100;

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <label htmlFor={`${id}-number`} className="text-sm font-semibold text-navy-900">
          {label}
        </label>
        <div className="flex h-11 items-center rounded-lg border border-line bg-white pe-3 ps-3 transition-colors duration-200 ease-out focus-within:ring-2 focus-within:ring-gold-500 hover:border-slate-300">
          <input
            id={`${id}-number`}
            name={`${id}-number`}
            type="number"
            inputMode="numeric"
            autoComplete="off"
            min={min}
            max={max}
            step={step}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={commit}
            onKeyDown={(e) => {
              if (e.key === 'Enter') commit();
            }}
            className="w-20 bg-transparent text-end text-base font-bold text-navy-900 tabular-nums focus:outline-none"
          />
          <span className="ps-1.5 text-sm font-medium text-slate-500">{unit}</span>
        </div>
      </div>
      <input
        type="range"
        aria-label={label}
        aria-valuetext={`${format(value)} ${unit}`}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="range mt-1"
        style={{ '--fill': `${fill}%` } as React.CSSProperties}
      />
      <div className="flex justify-between text-[13px] text-slate-500 tabular-nums">
        <span>
          {format(min)} {unit}
        </span>
        <span>
          {format(max)} {unit}
        </span>
      </div>
    </div>
  );
}
