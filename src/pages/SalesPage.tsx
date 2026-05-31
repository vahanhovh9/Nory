import { useState } from 'react'
import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid,
  ResponsiveContainer, Tooltip,
} from 'recharts'
import { FilterIcon, DotsIcon, ArrowUpRight, ArrowDownRight } from '../components/icons'

// ─── Exact design-system colors from Figma ────────────────────────────────────
const C = {
  grape1:  '#735cf6', // charts/contrast/color-1  — Actual / Dine-in (sales)
  grape3:  '#b9b5fd', // charts/unified/color-3   — Forecast / Pick-up (sales)
  grape4:  '#eae9fe', // charts/unified/color-4   — Delivery (sales)
  orange1: '#f97316', // orange-500 / line color   — Dine-in (avg check)
  orange3: '#fdba74', // orange-300                — Pick-up (avg check)
  orange4: '#fed7aa', // orange-200                — Delivery (avg check)
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const chartData = [
  { day: 'Mon, 13', actual: 2500, forecast: 2100, avgCheck: 20 },
  { day: 'Tue, 14', actual: 2200, forecast: 2550, avgCheck: 19 },
  { day: 'Wed, 15', actual: 4900, forecast: 5650, avgCheck: 21 },
  { day: 'Thu, 16', actual: 6100, forecast: 6500, avgCheck: 23 },
  { day: 'Fri, 17', actual: 7200, forecast: 7500, avgCheck: 25 },
  { day: 'Sat, 18', actual: 6800, forecast: 5900, avgCheck: 21 },
  { day: 'Sun, 19', actual: 8500, forecast: 7600, avgCheck: 26 },
]

const tableRows = [
  {
    channel: 'Dine in',
    actualBadge: '$96', actualBadgeType: 'positive' as const,
    actual: '€337,020',
    forecasted: '€237,020',
    checkBadge: '$96', checkBadgeType: 'positive' as const,
    avgCheck: '€26.41',
  },
  {
    channel: 'Pick-up',
    actualBadge: '4%', actualBadgeType: 'negative' as const,
    actual: '€18,525',
    forecasted: '€1,515',
    checkBadge: '$96', checkBadgeType: 'positive' as const,
    avgCheck: '€19.49',
  },
  {
    channel: 'Delivery',
    actualBadge: '5%', actualBadgeType: 'negative' as const,
    actual: '€79,997',
    forecasted: '€2,261',
    checkBadge: '$96', checkBadgeType: 'positive' as const,
    avgCheck: '€26.48',
  },
]

// ─── Shared badge ─────────────────────────────────────────────────────────────
function Badge({ value, type }: { value: string; type: 'positive' | 'negative' }) {
  const isPos = type === 'positive'
  return (
    <span className={`inline-flex items-center gap-0.5 px-1 py-0.5 rounded text-[12px] leading-4 shrink-0
      ${isPos ? 'bg-[#f0fdf5] text-[#16a34c]' : 'bg-[#fee2e2] text-[#b91c1c]'}`}>
      {isPos
        ? <ArrowUpRight size={9} color="#16a34c" />
        : <ArrowDownRight size={9} color="#b91c1c" />}
      {value}
    </span>
  )
}

// ─── KPI Card with channel bar ─────────────────────────────────────────────────
interface ChannelEntry { label: string; value: string; color: string }

interface SalesKPICardProps {
  title: string
  amount: string
  varianceValue: string
  varianceLabel: string
  varianceType: 'positive' | 'negative'
  channels: ChannelEntry[]
  /** Proportional widths 0-100 for the 3 bar segments */
  barPcts: [number, number, number]
}

function SalesKPICard({
  title, amount, varianceValue, varianceLabel, varianceType,
  channels, barPcts,
}: SalesKPICardProps) {
  return (
    <div className="flex-1 min-w-0 bg-white border border-[#e5e5e5] rounded-xl p-4 flex flex-col gap-3.5">
      {/* Label + amount row */}
      <div className="flex flex-col gap-2">
        <p className="text-[14px] text-[#525252] leading-4 tracking-[0.5px]">{title}</p>
        <div className="flex items-center gap-4">
          <span className="text-[24px] font-bold text-[#262626] leading-8 tracking-[0.36px] font-display whitespace-nowrap">
            {amount}
          </span>
          <div className="flex items-center gap-2">
            <Badge value={varianceValue} type={varianceType} />
            <span className="text-[14px] text-[#525252] leading-5 tracking-[-0.15px] whitespace-nowrap">
              {varianceLabel}
            </span>
          </div>
        </div>
      </div>

      {/* Channel breakdown */}
      <div className="flex gap-4">
        {channels.map((ch) => (
          <div key={ch.label} className="flex-1 min-w-0 flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm shrink-0" style={{ background: ch.color }} />
              <span className="text-[14px] text-[#525252] leading-4 tracking-[0.5px] truncate">{ch.label}</span>
            </div>
            <span className="text-[16px] text-[#262626] leading-5">{ch.value}</span>
          </div>
        ))}
      </div>

      {/* Stacked bar */}
      <div className="flex gap-0.5 h-5">
        {barPcts.map((pct, i) => (
          <div
            key={i}
            className="h-full rounded-sm"
            style={{ width: `${pct}%`, background: channels[i].color }}
          />
        ))}
      </div>
    </div>
  )
}

// ─── Dwell time card ──────────────────────────────────────────────────────────
function DwellTimeCard() {
  return (
    <div className="w-[209px] shrink-0 bg-white border border-[#e5e5e5] rounded-xl p-4 flex flex-col gap-2">
      <p className="text-[14px] text-[#525252] leading-4 tracking-[0.5px]">Dwell time</p>
      <span className="text-[24px] font-bold text-[#262626] leading-8 tracking-[0.36px] font-display">
        58min
      </span>
    </div>
  )
}

// ─── Chart tooltip ────────────────────────────────────────────────────────────
const ChartTooltip = ({
  active, payload, label,
}: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-[#e5e5e5] rounded-lg px-3 py-2 shadow-sm text-[12px]">
      <p className="text-[#a3a3a3] mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }} className="leading-5">
          {p.name}: {p.name === 'avgCheck' ? `€${p.value}` : `€${p.value.toLocaleString()}`}
        </p>
      ))}
    </div>
  )
}

// ─── Sales chart ──────────────────────────────────────────────────────────────
function SalesChart() {
  return (
    <div className="px-4 pt-2 pb-4 flex flex-col gap-4">
      {/* Chart title */}
      <div className="flex items-center gap-3">
        <span className="text-[14px] font-medium text-[#262626]">Sales vs Forecast</span>
        <span className="text-[14px] text-[#525252]">13-19 May</span>
      </div>

      {/* Recharts composed chart */}
      <div style={{ height: 240 }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} barGap={2} barCategoryGap="30%"
            margin={{ top: 4, right: 32, bottom: 0, left: 0 }}>
            <CartesianGrid strokeDasharray="0" stroke="#e5e5e5" vertical={false} />
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#525252' }}
            />
            <YAxis
              yAxisId="left"
              orientation="left"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#525252' }}
              tickFormatter={(v: number) => v === 0 ? '$ 0' : `$${v / 1000}k`}
              domain={[0, 9000]}
              ticks={[0, 2000, 4000, 6000, 8000]}
              width={40}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#525252' }}
              tickFormatter={(v: number) => `$${v}`}
              domain={[0, 40]}
              ticks={[0, 10, 20, 30, 40]}
              width={32}
            />
            <Tooltip content={<ChartTooltip />} />
            <Bar yAxisId="left" dataKey="actual"   name="actual"   fill={C.grape1} radius={[2, 2, 0, 0]} maxBarSize={32} />
            <Bar yAxisId="left" dataKey="forecast" name="forecast" fill={C.grape3} radius={[2, 2, 0, 0]} maxBarSize={32} />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="avgCheck"
              name="avgCheck"
              stroke={C.orange1}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: C.orange1, strokeWidth: 0 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-1">
        {/* Actual */}
        <div className="flex items-center gap-1.5 px-1 py-1 rounded">
          <div className="w-3.5 h-3.5 rounded-sm bg-[#735cf6]" />
          <span className="text-[13px] text-[#525252]">Acutal</span>
        </div>
        {/* Forecast */}
        <div className="flex items-center gap-1.5 px-1 py-1 rounded">
          <div className="w-3.5 h-3.5 rounded-sm bg-[#b9b5fd]" />
          <span className="text-[13px] text-[#525252]">Forecast</span>
        </div>
        {/* Avg Check Size */}
        <div className="flex items-center gap-1.5 px-1 py-1 rounded">
          <div className="w-3.5 h-1.5 rounded-sm bg-[#f97316]" />
          <span className="text-[13px] text-[#525252]">Avg Check Size</span>
        </div>
      </div>
    </div>
  )
}

// ─── Data table ───────────────────────────────────────────────────────────────
function SalesDataTable() {
  return (
    <div className="border-t border-[#e5e5e5]">
      {/* Header row */}
      <div className="flex border-b border-[#e5e5e5]">
        <div className="flex-1 px-4 py-3 text-[14px] text-[#525252]">Channel</div>
        {/* Actual header */}
        <div className="w-[273px] flex items-center gap-1 px-1.5 py-3 text-[14px] text-[#525252] border-r border-dashed border-[#e5e5e5]">
          Actual
          <div className="w-3.5 h-3.5 rounded-sm bg-[#735cf6]" />
        </div>
        {/* Forecasted header */}
        <div className="w-[273px] flex items-center gap-1 px-1.5 py-3 text-[14px] text-[#525252] border-r border-[#e5e5e5]">
          Forecasted
          <div className="w-3.5 h-3.5 rounded-sm bg-[#b9b5fd]" />
        </div>
        {/* Avg Check Size header */}
        <div className="w-[273px] flex items-center gap-1 px-1.5 py-3 text-[14px] text-[#525252] border-r border-dashed border-[#e5e5e5]">
          Avg Check Size
          <div className="w-3.5 h-1.5 rounded-sm bg-[#f97316]" />
        </div>
      </div>

      {/* Data rows */}
      {tableRows.map((row) => (
        <div key={row.channel} className="flex border-b border-[#e5e5e5] hover:bg-[#fafafa]">
          <div className="flex-1 px-4 py-3 text-[14px] text-[#262626] tracking-[-0.15px]">{row.channel}</div>
          <div className="w-[273px] flex items-center gap-1.5 px-1.5 py-3 border-r border-dashed border-[#e5e5e5]">
            <Badge value={row.actualBadge} type={row.actualBadgeType} />
            <span className="flex-1 text-[14px] text-[#262626] text-right tracking-[-0.15px]">{row.actual}</span>
          </div>
          <div className="w-[273px] flex items-center px-1.5 py-3 border-r border-[#e5e5e5]">
            <span className="flex-1 text-[14px] text-[#262626] text-right tracking-[-0.15px]">{row.forecasted}</span>
          </div>
          <div className="w-[273px] flex items-center gap-1.5 px-1.5 py-3 border-r border-dashed border-[#e5e5e5]">
            <Badge value={row.checkBadge} type={row.checkBadgeType} />
            <span className="flex-1 text-[14px] text-[#262626] text-right tracking-[-0.15px]">{row.avgCheck}</span>
          </div>
        </div>
      ))}

      {/* Footer row */}
      <div className="flex bg-[#fafafa]">
        <div className="flex-1 px-4 py-3" />
        <div className="w-[273px] flex items-center gap-1.5 px-1.5 py-3 border-r border-dashed border-[#e5e5e5]">
          <Badge value="+13%" type="positive" />
          <span className="text-[14px] text-[#a3a3a3] ml-1">SUM</span>
          <span className="flex-1 text-[14px] text-[#525252] text-right">€435,542</span>
        </div>
        <div className="w-[273px] flex items-center gap-1.5 px-1.5 py-3 border-r border-[#e5e5e5]">
          <span className="text-[14px] text-[#a3a3a3]">SUM</span>
          <span className="flex-1 text-[14px] text-[#525252] text-right">€112,891</span>
        </div>
        <div className="w-[273px] flex items-center gap-1.5 px-1.5 py-3 border-r border-dashed border-[#e5e5e5]">
          <Badge value="+13%" type="positive" />
          <span className="text-[14px] text-[#a3a3a3] ml-1">SUM</span>
          <span className="flex-1 text-[14px] text-[#525252] text-right">€7,717</span>
        </div>
      </div>
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function SalesPage() {
  const [activeTab, setActiveTab] = useState<'sales' | 'orders'>('sales')

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-4 pt-4 pb-8 flex flex-col gap-6">
        {/* Page header */}
        <div className="flex items-center justify-between h-8">
          <h1 className="text-[20px] font-normal text-[#2f3e4d] leading-6 tracking-[0.38px] font-display">
            Sales
          </h1>
          <button className="flex items-center gap-2 px-3 h-8 bg-white border border-[#d4d4d4] rounded-lg text-[14px] text-[#262626] hover:bg-[#fafafa]">
            <FilterIcon size={14} color="#525252" />
            Filter
          </button>
        </div>

        {/* KPI Row */}
        <div className="flex gap-4 items-stretch">
          <SalesKPICard
            title="Sales to date"
            amount="€100,449"
            varianceValue="€27,355"
            varianceLabel="vs Forecast"
            varianceType="positive"
            channels={[
              { label: 'Dine-in',  value: '73%', color: C.grape1 },
              { label: 'Pick-up',  value: '5%',  color: C.grape3 },
              { label: 'Delivery', value: '22%', color: C.grape4 },
            ]}
            barPcts={[73, 5, 22]}
          />
          <SalesKPICard
            title="Average check size"
            amount="€25.92"
            varianceValue="€2,53"
            varianceLabel="Last Month"
            varianceType="positive"
            channels={[
              { label: 'Dine-in',  value: '€26.41', color: C.orange1 },
              { label: 'Pick-up',  value: '€19.49', color: C.orange3 },
              { label: 'Delivery', value: '€26.48', color: C.orange4 },
            ]}
            barPcts={[36.5, 26.9, 36.6]}
          />
          <DwellTimeCard />
        </div>

        {/* Chart + Table card */}
        <div className="bg-white border border-[#e5e5e5] rounded-xl overflow-hidden">
          {/* Tab bar */}
          <div className="flex items-center justify-between px-3 border-b border-[#e5e5e5] h-[52px]">
            <div className="flex items-center gap-0">
              {(['sales', 'orders'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex items-center justify-center px-3 py-4 text-[14px] capitalize border-b-2 transition-colors ${
                    activeTab === tab
                      ? 'border-[#735cf6] text-[#262626] font-medium'
                      : 'border-transparent text-[#525252] hover:text-[#262626]'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <button className="px-3 h-8 border border-[#e5e5e5] rounded-lg text-[14px] text-[#262626] bg-white hover:bg-[#fafafa] shadow-[0_1px_1px_rgba(47,62,77,0.04)]">
                Add Forecast
              </button>
              <button className="flex items-center justify-center w-8 h-8 border border-[#e5e5e5] rounded-lg bg-white hover:bg-[#fafafa]">
                <DotsIcon size={14} color="#525252" />
              </button>
            </div>
          </div>

          {/* Chart */}
          {activeTab === 'sales' ? (
            <>
              <SalesChart />
              <SalesDataTable />
            </>
          ) : (
            <div className="flex items-center justify-center h-64 text-[14px] text-[#a3a3a3]">
              Orders data coming soon
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
