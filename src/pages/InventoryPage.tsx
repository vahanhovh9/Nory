import { useState } from 'react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  ResponsiveContainer, Tooltip, ComposedChart, Scatter,
} from 'recharts'
import { ArrowUpRight, ArrowDownRight, ArrowDownLeft, ArrowRight, DotsIcon, ChevronDown } from '../components/icons'

// ─── Types ────────────────────────────────────────────────────────────────────

type VType = 'positive' | 'warning' | 'negative' | 'neutral'

// ─── Data ─────────────────────────────────────────────────────────────────────

const GP_DATA = [
  { day: 'Monday, 27',   actual: 73.5, theoretical: 75.8, stockCount: true  },
  { day: 'Tuesday 28',   actual: 73.2, theoretical: 76.8, stockCount: false },
  { day: 'Wednesday 29', actual: 73.8, theoretical: 77.2, stockCount: true  },
  { day: 'Thursday, 30', actual: 73.6, theoretical: 77.5, stockCount: false },
  { day: 'Friday, 31',   actual: 73.1, theoretical: 77.8, stockCount: true  },
  { day: 'Saturday, 01', actual: 74.0, theoretical: 76.5, stockCount: false },
  { day: 'Sunday, 02',   actual: 74.2, theoretical: 77.9, stockCount: true  },
]

const WASTE_DATA = [
  { week: 'Week 1', waste: 0.70, returned: 0.25 },
  { week: 'Week 2', waste: 0.75, returned: 0.42 },
  { week: 'Week 3', waste: 0.78, returned: 0.38 },
  { week: 'Week 4', waste: 0.65, returned: 0.22 },
  { week: 'Week 5', waste: 0.58, returned: 0.18 },
  { week: 'Week 6', waste: 0.72, returned: 0.35 },
  { week: 'Week 7', waste: 0.78, returned: 0.28 },
  { week: 'Week 8', waste: 0.82, returned: 0.52 },
]

const MENU_ROWS = [
  { name: 'Love Me My Way',          qty: 893, theGP: '72%',  actGP: '70.1%',  theoVsAct: { val: '1.9%',  t: 'warning'  as VType }, waste: '2.42%',  inv: false, variance: { val: '4.34%',  t: 'negative' as VType } },
  { name: 'The Goat',                qty: 516, theGP: '73%',  actGP: '72%',    theoVsAct: { val: '1%',    t: 'warning'  as VType }, waste: '0.21%',  inv: false, variance: { val: '-1.21%', t: 'warning'  as VType } },
  { name: 'Tenders With 2 Dips',     qty: 335, theGP: '78%',  actGP: '80%',    theoVsAct: { val: '2%',    t: 'positive' as VType }, waste: '0.83%',  inv: false, variance: { val: '1,17%',  t: 'positive' as VType } },
  { name: 'Regular fries',            qty: 919, theGP: '80%',  actGP: '74%',    theoVsAct: { val: '6%',    t: 'negative' as VType }, waste: null,     inv: true,  variance: null },
  { name: 'Love Me Raunchy',         qty: 424, theGP: '72%',  actGP: '72%',    theoVsAct: { val: '0%',    t: 'neutral'  as VType }, waste: null,     inv: false, variance: null },
  { name: 'The Nashville Hot Chick', qty: 374, theGP: '73%',  actGP: '74.5%',  theoVsAct: { val: '1.5%',  t: 'positive' as VType }, waste: null,     inv: false, variance: null },
  { name: 'The Wild Thing',          qty: 318, theGP: '76%',  actGP: '74%',    theoVsAct: { val: '2%',    t: 'warning'  as VType }, waste: '0.21%',  inv: false, variance: { val: '2.21%',  t: 'warning'  as VType } },
  { name: 'Nashville Tenders',       qty: 277, theGP: '76%',  actGP: '76.49%', theoVsAct: { val: '0.49%', t: 'positive' as VType }, waste: null,     inv: false, variance: null },
]

const HEATMAP_LOCS = ['Dundrum', 'Liffey Valley', 'Charlotte Way', 'Blanchardstown', 'Millennium Walk', '', '']
const HEATMAP_MONTHS = ['Oct 24', 'Nov 24', 'Dec 24', 'Jan 25', 'Feb 25']
const HEATMAP_VALUES = [
  [73.1, 72.2, 74.5, 72.5, 73.6],
  [76.7, 70.0, 75.2, 70.6, 72.8],
  [73.1, 72.1, 70.12, 74.0, 78.1],
  [78.2, 76.6, 70.4, 72.8, 71.1],
  [70.3, 69.7, 72.0, 68.3, 70.2],
  [74.2, 75.0, 76.1, 77.0, 70.9],
  [72.5, 73.6, 74.2, 75.0, 76.1],
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function heatColor(v: number): { bg: string; text: string } {
  if (v >= 76) return { bg: '#22c55e', text: 'white' }
  if (v >= 74) return { bg: '#4ade80', text: '#262626' }
  if (v >= 72) return { bg: '#86efac', text: '#262626' }
  if (v >= 70) return { bg: '#fdba74', text: '#262626' }
  if (v >= 68) return { bg: '#fb923c', text: 'white' }
  return { bg: '#ef4444', text: 'white' }
}

// ─── Variance chip ─────────────────────────────────────────────────────────

function VChip({ val, t }: { val: string; t: VType }) {
  const configs = {
    positive: { bg: '#f0fdf5', text: '#16a34c', Icon: ArrowUpRight,    iconColor: '#16a34c' },
    warning:  { bg: '#fff7ed', text: '#ea580c', Icon: ArrowDownRight,   iconColor: '#ea580c' },
    negative: { bg: '#fee2e2', text: '#b91c1c', Icon: ArrowDownLeft,    iconColor: '#b91c1c' },
    neutral:  { bg: '#f5f5f5', text: '#737373', Icon: null,             iconColor: '#737373' },
  }
  const { bg, text, Icon, iconColor } = configs[t]
  return (
    <span className="inline-flex items-center gap-0.5 px-1 py-0.5 rounded text-[12px] leading-4 shrink-0" style={{ background: bg, color: text }}>
      {Icon && <Icon size={9} color={iconColor} />}
      {val}
    </span>
  )
}

// ─── KPI card ─────────────────────────────────────────────────────────────────

function KPICard({ label, value, variance, period }: {
  label: string; value: string
  variance?: { val: string; t: VType } | null
  period?: string | null
}) {
  return (
    <div className="flex-1 border border-[#e5e5e5] rounded-xl p-4 flex flex-col gap-3 min-w-0">
      <p className="text-[14px] text-[#525252] leading-4 tracking-[0.5px]">{label}</p>
      <div className="flex items-center gap-4 flex-wrap">
        <span className="text-[24px] font-bold text-[#262626] leading-8 tracking-[0.36px] font-display whitespace-nowrap">{value}</span>
        {variance && (
          <div className="flex items-center gap-2">
            <VChip val={variance.val} t={variance.t} />
            <span className="text-[14px] text-[#525252] leading-5 tracking-[-0.15px] whitespace-nowrap">{period}</span>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── GP chart custom dot ──────────────────────────────────────────────────────

const CustomDot = (props: { cx?: number; cy?: number; payload?: { stockCount: boolean } }) => {
  const { cx = 0, cy = 0, payload } = props
  if (!payload?.stockCount) {
    return <circle cx={cx} cy={cy} r={6} stroke="#735cf6" strokeWidth={2} fill="white" />
  }
  return <circle cx={cx} cy={cy} r={6} fill="#735cf6" />
}

// ─── GP Chart ─────────────────────────────────────────────────────────────────

const GPTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-[#e5e5e5] rounded-lg px-3 py-2 shadow-sm text-[12px]">
      <p className="text-[#a3a3a3] mb-1">{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{ color: p.color }}>{p.name}: {p.value.toFixed(1)}%</p>
      ))}
    </div>
  )
}

function GPChart() {
  return (
    <div className="bg-white border border-[#e5e5e5] rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-3 border-b border-[#e5e5e5]">
        <div className="flex items-center py-4">
          <span className="text-[14px] text-[#262626] tracking-[-0.15px]">GP over time</span>
        </div>
        <button className="flex items-center gap-1.5 px-3 py-2 border border-[#e5e5e5] rounded-lg bg-white text-[14px] text-[#262626] hover:bg-[#fafafa] shadow-[0_1px_1px_rgba(47,62,77,0.04)]">
          See more <ArrowRight size={14} color="#262626" />
        </button>
      </div>

      <div className="p-4" style={{ height: 340 }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={GP_DATA} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
            <CartesianGrid strokeDasharray="0" stroke="#e5e5e5" vertical={false} />
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#525252' }}
            />
            <YAxis
              domain={[65, 85]}
              ticks={[65, 70, 75, 80, 85]}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#525252' }}
              tickFormatter={(v: number) => `${v}%`}
              width={40}
            />
            <Tooltip content={<GPTooltip />} />
            <Line
              type="monotone"
              dataKey="actual"
              name="Actual GP"
              stroke="#735cf6"
              strokeWidth={2}
              dot={<CustomDot />}
              activeDot={{ r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="theoretical"
              name="Theoretical GP"
              stroke="#22c55e"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: '#22c55e' }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 pb-4">
        <div className="flex items-center gap-1.5 px-1 py-1">
          <div className="w-4 h-0.5 bg-[#735cf6]" /><span className="text-[13px] text-[#525252]">Actual GP</span>
        </div>
        <div className="flex items-center gap-1.5 px-1 py-1">
          <div className="w-4 h-0.5 bg-[#22c55e]" /><span className="text-[13px] text-[#525252]">Theoretical GP</span>
        </div>
        <div className="flex items-center gap-1.5 px-1 py-1">
          <div className="w-3 h-3 rounded-full bg-[#735cf6]" /><span className="text-[13px] text-[#525252]">Stock Counts</span>
        </div>
        <div className="flex items-center gap-1.5 px-1 py-1">
          <div className="w-3 h-3 rounded-full border-2 border-[#735cf6]" /><span className="text-[13px] text-[#525252]">No Count</span>
        </div>
      </div>
    </div>
  )
}

// ─── Menu items table ─────────────────────────────────────────────────────────

function InvestigateBtn() {
  return (
    <button className="flex items-center gap-1.5 px-2 py-1 border border-[#e5e5e5] rounded-lg bg-white text-[13px] text-[#262626] hover:bg-[#fafafa] shadow-[0_1px_1px_rgba(47,62,77,0.04)] shrink-0">
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M7 2a5 5 0 1 0 0 10A5 5 0 0 0 7 2zM7 2v3M7 7l2 2" stroke="#262626" strokeWidth="1.2" strokeLinecap="round"/>
        <circle cx="7" cy="11.5" r="0.5" fill="#262626"/>
      </svg>
      Investigate
    </button>
  )
}

function MenuItemsTable() {
  return (
    <div className="border border-[#e5e5e5] rounded-lg overflow-hidden">
      {/* Column headers */}
      <div className="flex border-b border-[#e5e5e5] bg-white">
        <div className="w-[200px] shrink-0 px-2.5 py-3 text-[14px] text-[#525252]">Menu Items</div>
        <div className="flex-1 px-1.5 py-3 text-[14px] text-[#525252] text-right">Sold Quantity</div>
        <div className="flex-1 px-1.5 py-3 text-[14px] text-[#525252] text-right">Theoretical GP</div>
        <div className="flex-1 px-2.5 py-3 text-[14px] text-[#525252]">Actual GP %</div>
        <div className="flex-1 px-2.5 py-3 text-[14px] text-[#525252]">Theo vs Act GP %</div>
        <div className="flex-1 px-2.5 py-3 text-[14px] text-[#525252]">Waste %</div>
        <div className="flex-1 px-2.5 py-3 text-[14px] text-[#525252] text-right">Variance Overall</div>
      </div>

      {/* Rows */}
      {MENU_ROWS.map((row, i) => (
        <div key={row.name} className={`flex items-center border-b border-[#e5e5e5] last:border-b-0 hover:bg-[#fafafa] ${i % 2 === 4 ? 'bg-[#fefce8]' : 'bg-white'}`}>
          <div className="w-[200px] shrink-0 px-2.5 py-3 text-[14px] text-[#262626] tracking-[-0.15px]">{row.name}</div>
          <div className="flex-1 px-1.5 py-3 text-[14px] text-[#262626] text-right tracking-[-0.15px]">{row.qty}</div>
          <div className="flex-1 px-1.5 py-3 text-[14px] text-[#262626] text-right tracking-[-0.15px]">{row.theGP}</div>
          <div className="flex-1 px-2.5 py-3 text-[14px] text-[#262626] tracking-[-0.15px]">{row.actGP}</div>
          <div className="flex-1 px-2.5 py-3">
            <VChip val={row.theoVsAct.val} t={row.theoVsAct.t} />
          </div>
          <div className="flex-1 px-2.5 py-3 flex items-center gap-2">
            {row.inv ? (
              <InvestigateBtn />
            ) : (
              <span className="text-[14px] text-[#262626] tracking-[-0.15px]">{row.waste ?? '–'}</span>
            )}
          </div>
          <div className="flex-1 px-2.5 py-3 flex justify-end">
            {row.variance ? <VChip val={row.variance.val} t={row.variance.t} /> : <span className="text-[14px] text-[#a3a3a3]">–</span>}
          </div>
        </div>
      ))}

      {/* Footer */}
      <div className="flex items-center bg-[#fafafa] border-t border-[#e5e5e5]">
        <div className="w-[200px] shrink-0 px-2.5 py-3" />
        <div className="flex-1 px-1.5 py-3 flex items-center gap-1">
          <span className="text-[14px] text-[#a3a3a3]">SUM</span>
          <span className="flex-1 text-[14px] text-[#525252] text-right">€22.62</span>
        </div>
        <div className="flex-1 px-1.5 py-3 flex items-center gap-1">
          <span className="text-[14px] text-[#a3a3a3]">AVG</span>
          <span className="flex-1 text-[14px] text-[#525252] text-right">75.73%</span>
        </div>
        <div className="flex-1 px-2.5 py-3 flex items-center gap-1">
          <span className="text-[14px] text-[#a3a3a3]">AVG</span>
          <span className="text-[14px] text-[#525252]">73%</span>
        </div>
        <div className="flex-1 px-2.5 py-3 flex items-center gap-1">
          <span className="text-[14px] text-[#a3a3a3]">AVG</span>
          <span className="text-[14px] text-[#525252]">73%</span>
        </div>
        <div className="flex-1 px-2.5 py-3 flex items-center gap-1">
          <span className="text-[14px] text-[#a3a3a3]">AVG</span>
          <span className="text-[14px] text-[#525252]">75.5%</span>
        </div>
        <div className="flex-1 px-2.5 py-3 flex justify-end items-center gap-1">
          <span className="text-[14px] text-[#a3a3a3]">AVG</span>
          <span className="text-[14px] text-[#525252]">-2.33%</span>
        </div>
      </div>
    </div>
  )
}

// ─── Waste overview chart ─────────────────────────────────────────────────────

const WasteTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-[#e5e5e5] rounded-lg px-3 py-2 shadow-sm text-[12px]">
      <p className="text-[#a3a3a3] mb-1">{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{ color: p.color }}>{p.name}: {p.value.toFixed(2)}%</p>
      ))}
    </div>
  )
}

type WasteTab = 'overview' | 'count'

function WastePanel() {
  const [tab, setTab] = useState<WasteTab>('overview')

  return (
    <div className="flex-1 bg-white border border-[#e5e5e5] rounded-xl overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-3 border-b border-[#e5e5e5] h-[52px]">
        <div className="flex items-center gap-0">
          {(['overview', 'count'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-3 py-4 text-[14px] capitalize border-b-2 transition-colors ${
                tab === t ? 'border-[#735cf6] text-[#262626] font-medium' : 'border-transparent text-[#525252] hover:text-[#262626]'
              }`}
            >
              Waste {t === 'overview' ? 'Overview' : 'Count'}
            </button>
          ))}
        </div>
        <button className="flex items-center gap-1.5 px-3 py-2 border border-[#e5e5e5] rounded-lg bg-white text-[14px] text-[#262626] hover:bg-[#fafafa] shadow-[0_1px_1px_rgba(47,62,77,0.04)]">
          Overview <ArrowRight size={14} color="#262626" />
        </button>
      </div>

      <div className="flex-1 p-6 flex flex-col gap-4">
        {/* KPI labels */}
        <div className="flex gap-8">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5">
              <div className="w-3.5 h-3.5 rounded-sm bg-[#735cf6]" />
              <span className="text-[14px] text-[#262626]">Waste Count</span>
            </div>
            <span className="text-[16px] font-semibold text-[#262626]">1.24%</span>
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5">
              <div className="w-3.5 h-0.5 bg-[#f97316]" />
              <span className="text-[14px] text-[#262626]">Returned</span>
            </div>
            <span className="text-[16px] font-semibold text-[#262626]">1.24%</span>
          </div>
        </div>

        {/* Chart */}
        <div className="flex-1 min-h-0" style={{ height: 260 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={WASTE_DATA} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="0" stroke="#e5e5e5" vertical={false} />
              <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#525252' }} />
              <YAxis
                axisLine={false} tickLine={false}
                tick={{ fontSize: 12, fill: '#525252' }}
                tickFormatter={(v: number) => `${(v).toFixed(2)}%`}
                domain={[0, 1]}
                ticks={[0.25, 0.50, 0.75, 1.0]}
                width={40}
              />
              <Tooltip content={<WasteTooltip />} />
              <Line type="monotone" dataKey="waste"    name="Waste"    stroke="#735cf6" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
              <Line type="monotone" dataKey="returned" name="Unknown"  stroke="#f97316" strokeWidth={2} dot={false} activeDot={{ r: 4, fill: '#f97316' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-4">
          <div className="flex items-center gap-1.5"><div className="w-3.5 h-3.5 rounded-sm bg-[#735cf6]" /><span className="text-[13px] text-[#525252]">Waste</span></div>
          <div className="flex items-center gap-1.5"><div className="w-4 h-0.5 bg-[#f97316]" /><span className="text-[13px] text-[#525252]">Unknown</span></div>
        </div>
      </div>
    </div>
  )
}

// ─── GP Heatmap ───────────────────────────────────────────────────────────────

function HeatmapPanel() {
  return (
    <div className="flex-1 bg-white border border-[#e5e5e5] rounded-xl overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-3 border-b border-[#e5e5e5] h-[52px]">
        <div className="flex items-center py-4">
          <span className="text-[14px] text-[#262626] font-medium">GP Heatmap</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 h-8 px-3 border border-[#e5e5e5] rounded-lg bg-white text-[14px] text-[#262626] hover:bg-[#fafafa]">
            Overall <ChevronDown size={14} color="#a3a3a3" />
          </button>
          <button className="flex items-center gap-1.5 px-3 py-2 border border-[#e5e5e5] rounded-lg bg-white text-[14px] text-[#262626] hover:bg-[#fafafa] shadow-[0_1px_1px_rgba(47,62,77,0.04)]">
            Overview <ArrowRight size={14} color="#262626" />
          </button>
        </div>
      </div>

      <div className="flex-1 p-6 overflow-auto">
        <div className="flex">
          {/* Y-axis labels */}
          <div className="w-[100px] shrink-0 flex flex-col">
            <div className="h-[49px]" />{/* spacer for header */}
            {HEATMAP_LOCS.map((loc, i) => (
              <div key={i} className="h-[49px] flex items-center">
                <span className="text-[13px] text-[#525252] leading-4 truncate">{loc}</span>
              </div>
            ))}
          </div>

          {/* Grid */}
          <div className="flex-1 flex flex-col">
            {/* Month headers */}
            <div className="flex h-[49px] items-center">
              {HEATMAP_MONTHS.map(m => (
                <div key={m} className="flex-1 text-center text-[12px] text-[#a3a3a3] px-1 truncate">{m}</div>
              ))}
            </div>

            {/* Heatmap rows */}
            {HEATMAP_VALUES.map((row, ri) => (
              <div key={ri} className="flex h-[49px] gap-1 mb-1">
                {row.map((val, ci) => {
                  const { bg, text } = heatColor(val)
                  return (
                    <div
                      key={ci}
                      className="flex-1 rounded-lg flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity"
                      style={{ background: bg, color: text }}
                      title={`${HEATMAP_LOCS[ri]} – ${HEATMAP_MONTHS[ci]}: ${val}%`}
                    >
                      <span className="text-[13px] font-medium">{val}%</span>
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

type MetricMode = 'COGS' | 'GP'
type DisplayMode = 'amount' | 'pct'

export default function InventoryPage() {
  const [metric, setMetric]   = useState<MetricMode>('GP')
  const [display, setDisplay] = useState<DisplayMode>('amount')

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-8 pt-4 pb-8 flex flex-col gap-6">
        {/* Page subheader */}
        <div className="flex items-center justify-between h-8">
          <h1 className="text-[20px] text-[#262626] font-display leading-6 tracking-[0.38px]">
            Liffey Valley
          </h1>
          <div className="flex items-center gap-2">
            {/* COGS / GP toggle */}
            <div className="flex items-center border border-[#e5e5e5] rounded-lg overflow-hidden bg-white h-8">
              {(['COGS', 'GP'] as MetricMode[]).map(m => (
                <button
                  key={m}
                  onClick={() => setMetric(m)}
                  className={`px-3 h-full text-[13px] transition-colors ${metric === m ? 'bg-[#f5f5f5] text-[#262626] font-medium' : 'text-[#525252] hover:bg-[#fafafa]'}`}
                >
                  {m}
                </button>
              ))}
            </div>

            {/* Amount / Percentage toggle */}
            <div className="flex items-center border border-[#e5e5e5] rounded-lg overflow-hidden bg-white h-8">
              <button
                onClick={() => setDisplay('amount')}
                className={`px-3 h-full text-[13px] flex items-center gap-1 transition-colors ${display === 'amount' ? 'bg-[#f5f5f5] text-[#262626] font-medium' : 'text-[#525252] hover:bg-[#fafafa]'}`}
              >
                <span className="text-[11px]">€</span> Amount
              </button>
              <button
                onClick={() => setDisplay('pct')}
                className={`px-3 h-full text-[13px] flex items-center gap-1 transition-colors ${display === 'pct' ? 'bg-[#f5f5f5] text-[#262626] font-medium' : 'text-[#525252] hover:bg-[#fafafa]'}`}
              >
                <span className="text-[11px]">%</span> Percentage
              </button>
            </div>

            {/* This week */}
            <button className="flex items-center gap-2 h-8 px-3 border border-[#d4d4d4] rounded-lg bg-white text-[14px] text-[#262626] hover:bg-[#fafafa]">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 3h10M2 7h6M2 11h4" stroke="#525252" strokeWidth="1.1" strokeLinecap="round"/></svg>
              This week
            </button>
          </div>
        </div>

        {/* KPI Row */}
        <div className="flex gap-4">
          <KPICard label="Actual sales"    value="€97,474.19" variance={null} period={null} />
          <KPICard label={`Theoretical ${metric}`} value="76.14%"     variance={{ val: '€4,953', t: 'positive' }} period="vs fcast" />
          <KPICard label={`Actual ${metric}`}       value="74.50%"     variance={{ val: '5.61%',  t: 'positive' }} period="vs planned" />
          <KPICard label="Waste"           value="-1.33%"     variance={{ val: '0.46%',  t: 'positive' }} period="vs last period" />
        </div>

        {/* GP over time chart */}
        <GPChart />

        {/* Menu items table */}
        <MenuItemsTable />

        {/* Bottom row: Waste + Heatmap */}
        <div className="flex gap-4" style={{ minHeight: 493 }}>
          <WastePanel />
          <HeatmapPanel />
        </div>
      </div>
    </div>
  )
}
