import { useState } from 'react'
import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid,
  ResponsiveContainer, Tooltip,
} from 'recharts'
import { FilterIcon, DotsIcon, ArrowUpRight, ArrowDownRight } from '../components/icons'
import type { Period } from '../App'

// ─── Exact design-system colors ────────────────────────────────────────────────
const C = {
  grape1:  '#735cf6',
  grape3:  '#b9b5fd',
  grape4:  '#eae9fe',
  orange1: '#f97316',
  orange3: '#fdba74',
  orange4: '#fed7aa',
}

// ─── Multi-period data ────────────────────────────────────────────────────────

type ChartRow = { day: string; actual: number; forecast: number; avgCheck: number }

const CHART_DATA: Record<Period, ChartRow[]> = {
  'Today': [
    { day: '9 am',  actual: 1240,  forecast: 1050, avgCheck: 22 },
    { day: '11 am', actual: 2180,  forecast: 1900, avgCheck: 24 },
    { day: '1 pm',  actual: 4350,  forecast: 3900, avgCheck: 28 },
    { day: '3 pm',  actual: 2980,  forecast: 2600, avgCheck: 25 },
    { day: '5 pm',  actual: 1920,  forecast: 1750, avgCheck: 23 },
    { day: '7 pm',  actual: 3650,  forecast: 3200, avgCheck: 27 },
    { day: '9 pm',  actual: 2100,  forecast: 1900, avgCheck: 24 },
  ],
  'This week': [
    { day: 'Mon, 13', actual: 2500, forecast: 2100, avgCheck: 20 },
    { day: 'Tue, 14', actual: 2200, forecast: 2550, avgCheck: 19 },
    { day: 'Wed, 15', actual: 4900, forecast: 5650, avgCheck: 21 },
    { day: 'Thu, 16', actual: 6100, forecast: 6500, avgCheck: 23 },
    { day: 'Fri, 17', actual: 7200, forecast: 7500, avgCheck: 25 },
    { day: 'Sat, 18', actual: 6800, forecast: 5900, avgCheck: 21 },
    { day: 'Sun, 19', actual: 8500, forecast: 7600, avgCheck: 26 },
  ],
  'This month': [
    { day: 'Week 1', actual: 38200, forecast: 35000, avgCheck: 22 },
    { day: 'Week 2', actual: 42100, forecast: 39500, avgCheck: 24 },
    { day: 'Week 3', actual: 39800, forecast: 38000, avgCheck: 23 },
    { day: 'Week 4', actual: 48100, forecast: 44200, avgCheck: 26 },
  ],
  'This quarter': [
    { day: 'January',  actual: 152000, forecast: 140000, avgCheck: 23 },
    { day: 'February', actual: 168000, forecast: 155000, avgCheck: 24 },
    { day: 'March',    actual: 195000, forecast: 178000, avgCheck: 25 },
  ],
  'This year': [
    { day: 'Jan', actual: 152000, forecast: 140000, avgCheck: 23 },
    { day: 'Feb', actual: 168000, forecast: 155000, avgCheck: 24 },
    { day: 'Mar', actual: 195000, forecast: 178000, avgCheck: 25 },
    { day: 'Apr', actual: 182000, forecast: 168000, avgCheck: 24 },
    { day: 'May', actual: 210000, forecast: 192000, avgCheck: 26 },
    { day: 'Jun', actual: 220000, forecast: 205000, avgCheck: 26 },
    { day: 'Jul', actual: 198000, forecast: 185000, avgCheck: 25 },
    { day: 'Aug', actual: 205000, forecast: 190000, avgCheck: 25 },
    { day: 'Sep', actual: 215000, forecast: 200000, avgCheck: 26 },
    { day: 'Oct', actual: 228000, forecast: 210000, avgCheck: 26 },
    { day: 'Nov', actual: 235000, forecast: 220000, avgCheck: 27 },
    { day: 'Dec', actual: 242000, forecast: 225000, avgCheck: 28 },
  ],
}

interface PeriodKPI { sales: string; salesChip: string; avgCheck: string; dwell: string }
const PERIOD_KPIS: Record<Period, PeriodKPI> = {
  'Today':        { sales: '€14,420',   salesChip: '€4,210', avgCheck: '€24.80', dwell: '54min' },
  'This week':    { sales: '€100,449',  salesChip: '€27,355', avgCheck: '€25.92', dwell: '58min' },
  'This month':   { sales: '€435,220',  salesChip: '€38,120', avgCheck: '€26.10', dwell: '61min' },
  'This quarter': { sales: '€1,280,000', salesChip: '€125,000', avgCheck: '€25.80', dwell: '59min' },
  'This year':    { sales: '€4,920,000', salesChip: '€480,000', avgCheck: '€25.60', dwell: '57min' },
}

// Channel breakdown for table
type Channel = 'Dine in' | 'Pick-up' | 'Delivery'
interface ChannelRow { channel: Channel; actualBadge: string; actualBadgeType: 'positive' | 'negative'; actual: string; forecasted: string; checkBadge: string; checkBadgeType: 'positive' | 'negative'; avgCheck: string }

const TABLE_ROWS: Record<Period, ChannelRow[]> = {
  'Today': [
    { channel: 'Dine in',  actualBadge: '$88', actualBadgeType: 'positive', actual: '€10,420', forecasted: '€9,800',  checkBadge: '$88', checkBadgeType: 'positive', avgCheck: '€27.10' },
    { channel: 'Pick-up',  actualBadge: '3%',  actualBadgeType: 'negative', actual: '€2,480',  forecasted: '€890',    checkBadge: '$88', checkBadgeType: 'positive', avgCheck: '€20.10' },
    { channel: 'Delivery', actualBadge: '2%',  actualBadgeType: 'negative', actual: '€1,520',  forecasted: '€500',    checkBadge: '$88', checkBadgeType: 'positive', avgCheck: '€27.80' },
  ],
  'This week': [
    { channel: 'Dine in',  actualBadge: '$96', actualBadgeType: 'positive', actual: '€337,020', forecasted: '€237,020', checkBadge: '$96', checkBadgeType: 'positive', avgCheck: '€26.41' },
    { channel: 'Pick-up',  actualBadge: '4%',  actualBadgeType: 'negative', actual: '€18,525',  forecasted: '€1,515',   checkBadge: '$96', checkBadgeType: 'positive', avgCheck: '€19.49' },
    { channel: 'Delivery', actualBadge: '5%',  actualBadgeType: 'negative', actual: '€79,997',  forecasted: '€2,261',   checkBadge: '$96', checkBadgeType: 'positive', avgCheck: '€26.48' },
  ],
  'This month': [
    { channel: 'Dine in',  actualBadge: '$92', actualBadgeType: 'positive', actual: '€1,340,200', forecasted: '€1,190,000', checkBadge: '$92', checkBadgeType: 'positive', avgCheck: '€26.80' },
    { channel: 'Pick-up',  actualBadge: '2%',  actualBadgeType: 'negative', actual: '€74,100',    forecasted: '€6,200',     checkBadge: '$92', checkBadgeType: 'positive', avgCheck: '€20.10' },
    { channel: 'Delivery', actualBadge: '3%',  actualBadgeType: 'negative', actual: '€319,900',   forecasted: '€9,040',     checkBadge: '$92', checkBadgeType: 'positive', avgCheck: '€27.20' },
  ],
  'This quarter': [
    { channel: 'Dine in',  actualBadge: '$90', actualBadgeType: 'positive', actual: '€3,840,200', forecasted: '€3,540,000', checkBadge: '$90', checkBadgeType: 'positive', avgCheck: '€26.50' },
    { channel: 'Pick-up',  actualBadge: '1%',  actualBadgeType: 'negative', actual: '€220,000',   forecasted: '€18,000',    checkBadge: '$90', checkBadgeType: 'positive', avgCheck: '€19.90' },
    { channel: 'Delivery', actualBadge: '2%',  actualBadgeType: 'negative', actual: '€960,000',   forecasted: '€27,000',    checkBadge: '$90', checkBadgeType: 'positive', avgCheck: '€27.00' },
  ],
  'This year': [
    { channel: 'Dine in',  actualBadge: '$88', actualBadgeType: 'positive', actual: '€14,760,000', forecasted: '€13,600,000', checkBadge: '$88', checkBadgeType: 'positive', avgCheck: '€26.20' },
    { channel: 'Pick-up',  actualBadge: '1%',  actualBadgeType: 'negative', actual: '€840,000',    forecasted: '€69,000',     checkBadge: '$88', checkBadgeType: 'positive', avgCheck: '€19.60' },
    { channel: 'Delivery', actualBadge: '2%',  actualBadgeType: 'negative', actual: '€3,600,000',  forecasted: '€104,000',    checkBadge: '$88', checkBadgeType: 'positive', avgCheck: '€26.80' },
  ],
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmtK(n: number) {
  if (n >= 1000000) return `€${(n / 1000000).toFixed(2)}M`
  if (n >= 1000) return `€${(n / 1000).toFixed(1)}k`
  return `€${n}`
}

// ─── Shared badge ─────────────────────────────────────────────────────────────

function Badge({ value, type }: { value: string; type: 'positive' | 'negative' }) {
  const isPos = type === 'positive'
  return (
    <span className={`inline-flex items-center gap-0.5 px-1 py-0.5 rounded text-[12px] leading-4 shrink-0 ${isPos ? 'bg-[#f0fdf5] text-[#16a34c]' : 'bg-[#fee2e2] text-[#b91c1c]'}`}>
      {isPos ? <ArrowUpRight size={9} color="#16a34c" /> : <ArrowDownRight size={9} color="#b91c1c" />}
      {value}
    </span>
  )
}

// ─── KPI cards ────────────────────────────────────────────────────────────────

function SalesKPICard({ title, amount, varianceValue, varianceLabel, varianceType, channels, barPcts }: {
  title: string; amount: string; varianceValue: string; varianceLabel: string
  varianceType: 'positive' | 'negative'
  channels: Array<{ label: string; value: string; color: string }>
  barPcts: [number, number, number]
}) {
  return (
    <div className="flex-1 min-w-0 bg-white border border-[#e5e5e5] rounded-xl p-4 flex flex-col gap-3.5">
      <div className="flex flex-col gap-2">
        <p className="text-[14px] text-[#525252] leading-4 tracking-[0.5px]">{title}</p>
        <div className="flex items-center gap-4 flex-wrap">
          <span className="text-[24px] font-bold text-[#262626] leading-8 tracking-[0.36px] font-display">{amount}</span>
          <div className="flex items-center gap-2">
            <Badge value={varianceValue} type={varianceType} />
            <span className="text-[14px] text-[#525252] leading-5 tracking-[-0.15px] whitespace-nowrap">{varianceLabel}</span>
          </div>
        </div>
      </div>
      <div className="flex gap-4">
        {channels.map(ch => (
          <div key={ch.label} className="flex-1 min-w-0 flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm shrink-0" style={{ background: ch.color }} />
              <span className="text-[14px] text-[#525252] leading-4 tracking-[0.5px] truncate">{ch.label}</span>
            </div>
            <span className="text-[16px] text-[#262626] leading-5">{ch.value}</span>
          </div>
        ))}
      </div>
      <div className="flex gap-0.5 h-5">
        {barPcts.map((pct, i) => (
          <div key={i} className="h-full rounded-sm" style={{ width: `${pct}%`, background: channels[i].color }} />
        ))}
      </div>
    </div>
  )
}

// ─── Filter panel ─────────────────────────────────────────────────────────────

const ALL_CHANNELS: Channel[] = ['Dine in', 'Pick-up', 'Delivery']

function FilterDropdown({ activeChannels, onChange, onClose }: {
  activeChannels: Channel[]
  onChange: (ch: Channel[]) => void
  onClose: () => void
}) {
  const [local, setLocal] = useState<Channel[]>(activeChannels)

  const toggle = (ch: Channel) => {
    setLocal(prev => prev.includes(ch) ? prev.filter(c => c !== ch) : [...prev, ch])
  }

  return (
    <div className="absolute right-0 top-[calc(100%+4px)] bg-white border border-[#e5e5e5] rounded-xl shadow-[0_4px_16px_rgba(0,0,0,0.08)] z-50 w-56 p-4 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="text-[14px] font-medium text-[#262626]">Filter by channel</span>
        <button onClick={onClose} className="text-[12px] text-[#a3a3a3] hover:text-[#525252]">✕</button>
      </div>
      <div className="flex flex-col gap-2">
        {ALL_CHANNELS.map(ch => (
          <label key={ch} className="flex items-center gap-2 cursor-pointer group">
            <input
              type="checkbox"
              checked={local.includes(ch)}
              onChange={() => toggle(ch)}
              className="w-4 h-4 rounded border-[#d4d4d4] accent-[#735cf6]"
            />
            <span className="text-[14px] text-[#262626] leading-5">{ch}</span>
          </label>
        ))}
      </div>
      <div className="flex items-center justify-between pt-2 border-t border-[#e5e5e5]">
        <button onClick={() => setLocal(ALL_CHANNELS)} className="text-[13px] text-[#735cf6] hover:underline">Reset</button>
        <button
          onClick={() => { onChange(local); onClose() }}
          className="px-3 py-1.5 bg-[#735cf6] text-white rounded-lg text-[13px] hover:bg-[#6248e8]"
        >
          Apply
        </button>
      </div>
    </div>
  )
}

// ─── Chart tooltip ─────────────────────────────────────────────────────────────

const ChartTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-[#e5e5e5] rounded-lg px-3 py-2 shadow-sm text-[12px]">
      <p className="text-[#a3a3a3] mb-1">{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{ color: p.color }}>{p.name}: {fmtK(p.value)}</p>
      ))}
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function SalesPage({ period }: { period: Period }) {
  const [activeTab, setActiveTab] = useState<'sales' | 'orders'>('sales')
  const [filterOpen, setFilterOpen] = useState(false)
  const [activeChannels, setActiveChannels] = useState<Channel[]>(ALL_CHANNELS)

  const chartData = CHART_DATA[period]
  const kpi = PERIOD_KPIS[period]
  const tableRows = TABLE_ROWS[period].filter(r => activeChannels.includes(r.channel))
  const hasFilter = activeChannels.length < ALL_CHANNELS.length

  const periodLabel = period === 'Today' ? 'today' : period.toLowerCase()

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-4 pt-4 pb-8 flex flex-col gap-6">
        {/* Page header */}
        <div className="flex items-center justify-between h-8">
          <h1 className="text-[20px] text-[#262626] font-display leading-6 tracking-[0.38px]">Sales</h1>
          <div className="flex items-center gap-2 relative">
            {/* Active filter chips */}
            {hasFilter && activeChannels.map(ch => (
              <button
                key={ch}
                onClick={() => setActiveChannels(prev => prev.filter(c => c !== ch))}
                className="flex items-center gap-1 px-2 py-1 bg-[#f0edff] border border-[#c4b5fd] rounded-lg text-[12px] text-[#735cf6] hover:bg-[#e9e3ff]"
              >
                {ch} ✕
              </button>
            ))}
            <div className="relative">
              <button
                onClick={() => setFilterOpen(o => !o)}
                className={`flex items-center gap-2 px-3 h-8 border rounded-lg text-[14px] text-[#262626] hover:bg-[#fafafa] ${hasFilter ? 'bg-[#f0edff] border-[#c4b5fd] text-[#735cf6]' : 'bg-white border-[#d4d4d4]'}`}
              >
                <FilterIcon size={14} color={hasFilter ? '#735cf6' : '#525252'} />
                Filter {hasFilter ? `(${activeChannels.length})` : ''}
              </button>
              {filterOpen && (
                <FilterDropdown
                  activeChannels={activeChannels}
                  onChange={setActiveChannels}
                  onClose={() => setFilterOpen(false)}
                />
              )}
            </div>
          </div>
        </div>

        {/* KPI Row */}
        <div className="flex gap-4 items-stretch">
          <SalesKPICard
            title={`Sales to date (${periodLabel})`}
            amount={kpi.sales}
            varianceValue={kpi.salesChip}
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
            amount={kpi.avgCheck}
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
          <div className="w-[209px] shrink-0 bg-white border border-[#e5e5e5] rounded-xl p-4 flex flex-col gap-2">
            <p className="text-[14px] text-[#525252] leading-4 tracking-[0.5px]">Dwell time</p>
            <span className="text-[24px] font-bold text-[#262626] leading-8 font-display">{kpi.dwell}</span>
          </div>
        </div>

        {/* Chart + Table */}
        <div className="bg-white border border-[#e5e5e5] rounded-xl overflow-hidden">
          {/* Tabs */}
          <div className="flex items-center justify-between px-3 border-b border-[#e5e5e5] h-[52px]">
            <div className="flex">
              {(['sales', 'orders'] as const).map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)} className={`flex items-center justify-center px-3 h-full text-[14px] capitalize border-b-2 transition-colors ${activeTab === tab ? 'border-[#735cf6] text-[#262626] font-medium' : 'border-transparent text-[#525252] hover:text-[#262626]'}`}>
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <button className="px-3 h-8 border border-[#e5e5e5] rounded-lg text-[14px] text-[#262626] bg-white hover:bg-[#fafafa] shadow-[0_1px_1px_rgba(47,62,77,0.04)]">Add Forecast</button>
              <button className="flex items-center justify-center w-8 h-8 border border-[#e5e5e5] rounded-lg bg-white hover:bg-[#fafafa]"><DotsIcon size={14} color="#525252" /></button>
            </div>
          </div>

          {activeTab === 'sales' ? (
            <>
              {/* Chart */}
              <div className="px-4 pt-2 pb-4 flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-[14px] font-medium text-[#262626]">Sales vs Forecast</span>
                  <span className="text-[14px] text-[#525252]">{period}</span>
                </div>
                <div style={{ height: 240 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={chartData} barGap={2} barCategoryGap="30%" margin={{ top: 4, right: 32, bottom: 0, left: 0 }}>
                      <CartesianGrid strokeDasharray="0" stroke="#e5e5e5" vertical={false} />
                      <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#525252' }} />
                      <YAxis yAxisId="left" orientation="left" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#525252' }} tickFormatter={(v: number) => v >= 1000 ? `$${(v/1000).toFixed(0)}k` : `$${v}`} width={42} />
                      <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#525252' }} tickFormatter={(v: number) => `$${v}`} domain={[0, 40]} ticks={[0, 10, 20, 30, 40]} width={32} />
                      <Tooltip content={<ChartTooltip />} />
                      <Bar yAxisId="left" dataKey="actual"   name="actual"   fill={C.grape1} radius={[2,2,0,0]} maxBarSize={32} />
                      <Bar yAxisId="left" dataKey="forecast" name="forecast" fill={C.grape3} radius={[2,2,0,0]} maxBarSize={32} />
                      <Line yAxisId="right" type="monotone" dataKey="avgCheck" name="avgCheck" stroke={C.orange1} strokeWidth={2} dot={false} activeDot={{ r: 4, fill: C.orange1, strokeWidth: 0 }} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex items-center justify-center gap-1">
                  <div className="flex items-center gap-1.5 px-1 py-1"><div className="w-3.5 h-3.5 rounded-sm bg-[#735cf6]" /><span className="text-[13px] text-[#525252]">Actual</span></div>
                  <div className="flex items-center gap-1.5 px-1 py-1"><div className="w-3.5 h-3.5 rounded-sm bg-[#b9b5fd]" /><span className="text-[13px] text-[#525252]">Forecast</span></div>
                  <div className="flex items-center gap-1.5 px-1 py-1"><div className="w-3.5 h-1.5 rounded-sm bg-[#f97316]" /><span className="text-[13px] text-[#525252]">Avg Check Size</span></div>
                </div>
              </div>

              {/* Table */}
              <div className="border-t border-[#e5e5e5]">
                <div className="flex border-b border-[#e5e5e5]">
                  <div className="flex-1 px-4 py-3 text-[14px] text-[#525252]">Channel</div>
                  <div className="w-[273px] flex items-center gap-1 px-1.5 py-3 text-[14px] text-[#525252] border-r border-dashed border-[#e5e5e5]">Actual <div className="w-3.5 h-3.5 rounded-sm bg-[#735cf6] ml-1" /></div>
                  <div className="w-[273px] flex items-center gap-1 px-1.5 py-3 text-[14px] text-[#525252] border-r border-[#e5e5e5]">Forecasted <div className="w-3.5 h-3.5 rounded-sm bg-[#b9b5fd] ml-1" /></div>
                  <div className="w-[273px] flex items-center gap-1 px-1.5 py-3 text-[14px] text-[#525252] border-r border-dashed border-[#e5e5e5]">Avg Check Size <div className="w-3.5 h-1.5 rounded-sm bg-[#f97316] ml-1" /></div>
                </div>
                {tableRows.length > 0 ? tableRows.map(row => (
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
                )) : (
                  <div className="px-4 py-8 text-center text-[14px] text-[#a3a3a3]">No channels selected — use the filter to show data</div>
                )}
                {tableRows.length > 0 && (
                  <div className="flex bg-[#fafafa]">
                    <div className="flex-1 px-4 py-3" />
                    <div className="w-[273px] flex items-center gap-1.5 px-1.5 py-3 border-r border-dashed border-[#e5e5e5]">
                      <Badge value="+13%" type="positive" />
                      <span className="text-[14px] text-[#a3a3a3] ml-1">SUM</span>
                      <span className="flex-1 text-[14px] text-[#525252] text-right">{kpi.sales}</span>
                    </div>
                    <div className="w-[273px] flex items-center gap-1.5 px-1.5 py-3 border-r border-[#e5e5e5]">
                      <span className="text-[14px] text-[#a3a3a3]">SUM</span>
                      <span className="flex-1 text-[14px] text-[#525252] text-right">—</span>
                    </div>
                    <div className="w-[273px] flex items-center gap-1.5 px-1.5 py-3 border-r border-dashed border-[#e5e5e5]">
                      <Badge value="+13%" type="positive" />
                      <span className="text-[14px] text-[#a3a3a3] ml-1">SUM</span>
                      <span className="flex-1 text-[14px] text-[#525252] text-right">{kpi.avgCheck}</span>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-64 text-[14px] text-[#a3a3a3]">Orders data coming soon</div>
          )}
        </div>
      </div>
    </div>
  )
}
