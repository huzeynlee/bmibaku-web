import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { RateHistoryPoint, RateMode } from '../../types/banking';
import type { Lang } from '../../types/banking';
import { formatDate, formatRate } from '../../utils/currency';

// Validated with the dataviz palette check (light surface): lightness, chroma, CVD and 3:1 contrast pass.
const BUY_COLOR = '#2B5C9E';
const SELL_COLOR = '#A87A12';

interface RateHistoryChartProps {
  points: RateHistoryPoint[];
  mode: RateMode;
  lang: Lang;
  labels: { buy: string; sell: string; title: string };
}

/** Loaded lazily, only when history data exists. The table beside it is the accessible view. */
export default function RateHistoryChart({ points, mode, lang, labels }: RateHistoryChartProps) {
  const data = points
    .filter((p) => p[mode])
    .map((p) => ({ date: p.date, buy: Number(p[mode]!.buy), sell: Number(p[mode]!.sell) }));
  if (data.length < 2) return null;

  return (
    <figure className="rounded-xl border border-line p-3" aria-label={labels.title}>
      <figcaption className="px-1 pb-2 text-sm font-semibold text-navy-900">{labels.title}</figcaption>
      <div className="h-56" dir="ltr">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 12, bottom: 4, left: 4 }}>
            <CartesianGrid stroke="#E2E8F0" vertical={false} />
            <XAxis
              dataKey="date"
              tickFormatter={(d: string) => formatDate(d, lang)}
              tick={{ fontSize: 11, fill: '#64748B' }}
              tickLine={false}
              axisLine={{ stroke: '#E2E8F0' }}
              minTickGap={24}
            />
            <YAxis
              domain={['auto', 'auto']}
              tickFormatter={(v: number) => formatRate(String(v), lang)}
              tick={{ fontSize: 11, fill: '#64748B' }}
              tickLine={false}
              axisLine={false}
              width={56}
            />
            <Tooltip
              formatter={(v) => formatRate(String(v), lang)}
              labelFormatter={(d) => formatDate(String(d), lang)}
              contentStyle={{ borderRadius: 8, borderColor: '#E2E8F0', fontSize: 13 }}
              cursor={{ stroke: '#94A3B8', strokeDasharray: '3 3' }}
            />
            <Legend
              iconType="plainline"
              wrapperStyle={{ fontSize: 13 }}
              formatter={(value: string) => <span style={{ color: '#0F172A' }}>{value}</span>}
            />
            <Line type="monotone" dataKey="buy" name={labels.buy} stroke={BUY_COLOR} strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
            <Line type="monotone" dataKey="sell" name={labels.sell} stroke={SELL_COLOR} strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </figure>
  );
}
