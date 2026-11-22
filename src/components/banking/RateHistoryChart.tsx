'use client';

import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { RateMode } from '@/types/banking';
import type { Locale } from '@/i18n/config';
import type { HistoryPoint } from '@/lib/rates';
import { formatDate, formatRate } from '@/utils/currency';

// Validated with the dataviz palette check (light surface): lightness, chroma, CVD and 3:1 contrast pass.
const BUY = '#2B5C9E';
const SELL = '#A87A12';

/** Loaded lazily, only when a single currency with data is selected. The table is the accessible view. */
export default function RateHistoryChart({ points, mode, locale, labels }: { points: HistoryPoint[]; mode: RateMode; locale: Locale; labels: { buy: string; sell: string; title: string } }) {
  const data = [...points]
    .filter((p) => p[mode])
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((p) => ({ date: p.date, buy: Number(p[mode]!.buy), sell: Number(p[mode]!.sell) }));
  if (data.length < 2) return null;

  return (
    <figure className="rounded-xl border border-line bg-white p-4" aria-label={labels.title}>
      <figcaption className="px-1 pb-3 text-sm font-semibold text-navy-900">{labels.title}</figcaption>
      <div className="h-64" dir="ltr">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 12, bottom: 4, left: 4 }}>
            <CartesianGrid stroke="#E2E8F0" vertical={false} />
            <XAxis dataKey="date" tickFormatter={(d: string) => formatDate(d, locale)} tick={{ fontSize: 11, fill: '#64748B' }} tickLine={false} axisLine={{ stroke: '#E2E8F0' }} minTickGap={28} />
            <YAxis domain={['auto', 'auto']} tickFormatter={(v: number) => formatRate(String(v), locale)} tick={{ fontSize: 11, fill: '#64748B' }} tickLine={false} axisLine={false} width={58} />
            <Tooltip
              formatter={(v) => formatRate(String(v), locale)}
              labelFormatter={(d) => formatDate(String(d), locale)}
              contentStyle={{ borderRadius: 10, borderColor: '#E2E8F0', fontSize: 13 }}
              cursor={{ stroke: '#94A3B8', strokeDasharray: '3 3' }}
            />
            <Legend iconType="plainline" wrapperStyle={{ fontSize: 13 }} formatter={(value: string) => <span style={{ color: '#0F172A' }}>{value}</span>} />
            <Line type="monotone" dataKey="buy" name={labels.buy} stroke={BUY} strokeWidth={2} dot={false} activeDot={{ r: 4 }} animationDuration={1200} />
            <Line type="monotone" dataKey="sell" name={labels.sell} stroke={SELL} strokeWidth={2} dot={false} activeDot={{ r: 4 }} animationDuration={1200} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </figure>
  );
}
