import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import { ArrowUpRight, ArrowDownRight, ArrowDownLeft } from './icons'

const chartData = [
  { day: 'M', rating: 4.5 },
  { day: 'T', rating: 4.72 },
  { day: 'W', rating: 5.0 },
  { day: 'T', rating: 4.75 },
  { day: 'F', rating: 4.95 },
  { day: 'S', rating: 4.92 },
  { day: 'S', rating: 4.73 },
]

interface RatingRow {
  label: string
  variance: string
  varianceType: 'positive' | 'warning' | 'negative' | 'neutral-down' | 'neutral-up'
  count: string
  barPct: number
  pctLabel: string
}

const ratingRows: RatingRow[] = [
  { label: '5 Stars', variance: '1', varianceType: 'warning', count: '4', barPct: 100, pctLabel: '89' },
  { label: '4 Stars', variance: '2', varianceType: 'positive', count: '3', barPct: 26, pctLabel: '23' },
  { label: '3 Stars', variance: '1', varianceType: 'neutral-down', count: '–', barPct: 0, pctLabel: '–' },
  { label: '2 Stars', variance: '1', varianceType: 'neutral-down', count: '–', barPct: 0, pctLabel: '–' },
  { label: '1 Star', variance: '1', varianceType: 'negative', count: '1', barPct: 1, pctLabel: '1' },
]

function VarianceChip({ value, type }: { value: string; type: RatingRow['varianceType'] }) {
  const configs = {
    positive: { bg: 'bg-[#f0fdf5]', text: 'text-[#16a34c]', Icon: ArrowUpRight, color: '#16a34c' },
    warning: { bg: 'bg-[#fff7ed]', text: 'text-[#ea580c]', Icon: ArrowDownRight, color: '#ea580c' },
    negative: { bg: 'bg-[#fee2e2]', text: 'text-[#b91c1c]', Icon: ArrowUpRight, color: '#b91c1c' },
    'neutral-down': { bg: 'bg-[#f0fdf5]', text: 'text-[#16a34c]', Icon: ArrowDownRight, color: '#16a34c' },
    'neutral-up': { bg: 'bg-[#fff7ed]', text: 'text-[#ea580c]', Icon: ArrowUpRight, color: '#ea580c' },
  }
  const { bg, text, Icon, color } = configs[type]
  return (
    <span className={`inline-flex items-center gap-0.5 px-1 py-0.5 rounded ${bg} ${text} text-[12px] leading-4 shrink-0`}>
      <Icon size={9} color={color} />
      {value}
    </span>
  )
}

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-[#e5e5e5] rounded-lg px-3 py-2 shadow-sm text-[12px] text-[#262626]">
        <div className="text-[#a3a3a3] mb-0.5">{label}</div>
        <div className="font-semibold">{payload[0].value.toFixed(2)}</div>
      </div>
    )
  }
  return null
}

export default function RatingOverTime() {
  return (
    <div className="flex flex-col bg-white border border-[#e5e5e5] rounded-xl overflow-hidden h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-3 border-b border-[#e5e5e5] shrink-0">
        <div className="flex items-center py-4">
          <span className="text-[14px] text-[#262626] tracking-[-0.15px]">Rating Over Time</span>
        </div>
        {/* Chart controls placeholder */}
        <div className="h-8" />
      </div>

      {/* Chart */}
      <div className="flex-1 min-h-0 p-4">
        <div className="h-full flex flex-col gap-4">
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
                <CartesianGrid
                  strokeDasharray="0"
                  stroke="#e5e5e5"
                  vertical={false}
                  strokeWidth={1}
                />
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 13, fill: '#525252' }}
                  interval={0}
                />
                <YAxis
                  domain={[4.0, 5.0]}
                  ticks={[4.0, 4.25, 4.5, 4.75, 5.0]}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 13, fill: '#525252' }}
                  tickFormatter={(v: number) => v.toString()}
                  width={36}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="linear"
                  dataKey="rating"
                  stroke="#735cf6"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, fill: '#735cf6', strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-2 shrink-0">
            <div className="w-3.5 h-3.5 rounded-[2px] bg-[#735cf6]" />
            <span className="text-[13px] text-[#525252]">Overall Brand</span>
          </div>
        </div>
      </div>

      {/* Ratings table */}
      <div className="border-t border-[#e5e5e5] shrink-0">
        {/* Table header */}
        <div className="flex border-b border-[#e5e5e5]">
          <div className="flex-1 px-6 py-3 text-[14px] text-[#525252]">Rating</div>
          <div className="w-[130px] px-1.5 py-3 text-[14px] text-[#525252] text-right border-r border-dashed border-[#e5e5e5]">Total ratings</div>
          <div className="w-[180px] px-1.5 py-3 text-[14px] text-[#525252] text-right">% of rating</div>
        </div>

        {/* Rows */}
        {ratingRows.map((row) => (
          <div key={row.label} className="flex items-center border-b border-[#e5e5e5] last:border-b-0">
            <div className="flex-1 px-6 py-3 text-[14px] text-[#262626] tracking-[-0.15px]">
              {row.label}
            </div>
            <div className="w-[130px] flex items-center gap-1.5 px-1.5 py-3 border-r border-dashed border-[#e5e5e5]">
              <VarianceChip value={row.variance} type={row.varianceType} />
              <span className="flex-1 text-[14px] text-[#262626] text-right tracking-[-0.15px]">
                {row.count}
              </span>
            </div>
            <div className="w-[180px] flex items-center gap-1 px-1.5 py-3">
              <div className="flex-1 h-4">
                {row.barPct > 0 && (
                  <div
                    className="h-full rounded bg-[#ddd6fe]"
                    style={{ width: `${row.barPct}%` }}
                  />
                )}
              </div>
              <span className="text-[14px] text-[#262626] text-right w-[40px] tracking-[-0.15px]">
                {row.pctLabel}
              </span>
            </div>
          </div>
        ))}

        {/* Footer */}
        <div className="flex items-center bg-[#fafafa]">
          <div className="flex-1 px-6 py-3" />
          <div className="w-[130px] flex items-center gap-2 px-1.5 py-3 border-r border-dashed border-[#e5e5e5]">
            <span className="text-[14px] text-[#a3a3a3]">AVG</span>
            <span className="flex-1 text-[14px] text-[#525252] text-right">4.6</span>
          </div>
          <div className="w-[180px] flex items-center gap-2 px-1.5 py-3">
            <span className="text-[14px] text-[#a3a3a3]">SUM</span>
            <span className="flex-1 text-[14px] text-[#525252] text-right">€994,302</span>
          </div>
        </div>
      </div>
    </div>
  )
}
