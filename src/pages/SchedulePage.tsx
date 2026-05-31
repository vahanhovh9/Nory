import { useState, useEffect, useRef } from 'react'
import type { Page } from '../App'
import {
  ChevronLeft, ChevronRight, CaretUpDown, DotsIcon, NorySparkle, XIcon, ChevronUp, ChevronDown,
} from '../components/icons'

// ─── Types ────────────────────────────────────────────────────────────────────

type ShiftKind = 'empty' | 'shift' | 'unavailable' | 'holiday' | 'timeoff' | 'ai'
type Weather = 'rain' | 'sun' | 'cloud-sun'
type AIPhase = 'idle' | 'creating' | 'building' | 'done'
type ViewMode = 'week' | 'day'

interface Shift {
  kind: ShiftKind
  role?: string
  time?: string
  compliance?: boolean
  ai?: boolean
}

interface Employee {
  name?: string
  worked?: string
  cap?: string
  isAdd?: boolean
  shifts: Shift[]
}

interface Dept {
  name: string
  summary: string
  hoursPerDay: string[]
  employees: Employee[]
}

interface ShiftModalData {
  employeeName: string
  role: string
  department: string
  station: string
  startTime: string
  endTime: string
  hasCompliance: boolean
  complianceDay?: string
}

// ─── Static data ──────────────────────────────────────────────────────────────

const DAYS = [
  { day: 'Mon', date: 6,  weather: 'rain'      as Weather },
  { day: 'Tue', date: 7,  weather: 'cloud-sun' as Weather },
  { day: 'Wed', date: 8,  weather: 'cloud-sun' as Weather },
  { day: 'Thu', date: 9,  weather: 'sun'       as Weather },
  { day: 'Fri', date: 10, weather: 'sun'       as Weather },
  { day: 'Sat', date: 11, weather: 'cloud-sun' as Weather },
  { day: 'Sun', date: 12, weather: 'sun'       as Weather },
]

const SALES = ['£999', '£1,632', '£4,932', '£1,529', '£1,529', '£1,529', '£1,529']

const WEEK_DAYS = [
  { name: 'Monday',    sales: '£999',   hours: '67h', col: '33%', weather: 'rain'      as Weather },
  { name: 'Tuesday',   sales: '£1,632', hours: '75h', col: '31%', weather: 'cloud-sun' as Weather },
  { name: 'Wednesday', sales: '£1,932', hours: '78h', col: '29%', weather: 'cloud-sun' as Weather },
  { name: 'Thursday',  sales: '£2,529', hours: '84h', col: '30%', weather: 'sun'       as Weather },
  { name: 'Friday',    sales: '£3,529', hours: '96h', col: '32%', weather: 'sun'       as Weather },
  { name: 'Saturday',  sales: '£4,301', hours: '98h', col: '31%', weather: 'cloud-sun' as Weather },
  { name: 'Sunday',    sales: '£2,092', hours: '74h', col: '29%', weather: 'sun'       as Weather },
]

// Shift presets
const E: Shift  = { kind: 'empty' }
const U: Shift  = { kind: 'unavailable' }
const H: Shift  = { kind: 'holiday' }
const T: Shift  = { kind: 'timeoff', time: '12:00 – 18:00' }
const M: Shift  = { kind: 'shift', role: 'Location Manager', time: '13:00 – 22:00' }
const FL13: Shift = { kind: 'shift', role: 'FOH Lead',  time: '13:00 – 22:00' }
const FL12: Shift = { kind: 'shift', role: 'FOH Lead',  time: '12:00 – 22:00' }
const FL8C: Shift = { kind: 'shift', role: 'FOH Lead',  time: '8:00 – 14:00', compliance: true }
const FT13: Shift = { kind: 'shift', role: 'FOH Team',  time: '13:00 – 22:00' }
const FT18: Shift = { kind: 'shift', role: 'FOH Team',  time: '18:00 – 22:00' }
const BOH9: Shift = { kind: 'shift', role: 'Back of House', time: '09:00 – 17:00' }

const DEPTS: Dept[] = [
  {
    name: 'Management', summary: 'Total 100h 0m / 0 shifts',
    hoursPerDay: ['3h 00m', '3h 00m', '3h 30m', '4h 30m', '6h 0m', '6h 0m', '3h 0m'],
    employees: [
      { isAdd: true, shifts: [E, E, E, E, E, E, E] },
      { name: 'Alana Laverty', worked: '0h', cap: '20h', shifts: [E, E, U, U, E, E, T] },
      { name: 'Alana Laverty', worked: '7h', cap: '42h', shifts: [M, M, M, H, M, M, T] },
    ],
  },
  {
    name: 'Front of House', summary: 'Total 0h 0m / 0 shifts',
    hoursPerDay: ['3h 00m', '3h 00m', '3h 30m', '4h 30m', '6h 0m', '6h 0m', '3h 0m'],
    employees: [
      { isAdd: true, shifts: [E, E, E, E, E, E, E] },
      { name: 'Alana Laverty', worked: '7h', cap: '42h', shifts: [FL13, E, FL13, T, FL13, FL13, FL13] },
      { name: 'Alana Laverty', worked: '7h', cap: '42h', shifts: [FT13, FT13, E, E, FT13, FT13, FT13] },
      { name: 'Lisa Marylee',  worked: '7h', cap: '42h', shifts: [E, FL12, FL12, FL8C, FL12, FL12, FL12] },
      { name: 'Alana Laverty', worked: '7h', cap: '42h', shifts: [E, E, FT18, E, FT18, FT18, E] },
    ],
  },
  {
    name: 'Back of House', summary: 'Total 0h 0m / 0 shifts',
    hoursPerDay: ['1h 0m', '4h 30m', '4h 30m', '4h 30m', '3h 0m', '3h 0m', '3h 0m'],
    employees: [
      { isAdd: true, shifts: [E, E, E, E, E, E, E] },
      { name: 'Alana Laverty', worked: '7h', cap: '42h', shifts: [E, BOH9, BOH9, BOH9, BOH9, BOH9, BOH9] },
      { name: 'Alana Laverty', worked: '7h', cap: '42h', shifts: [E, BOH9, BOH9, BOH9, BOH9, E, BOH9] },
    ],
  },
]

// AI-suggested shift presets (added after creation)
const AI_M: Shift  = { kind: 'ai', role: 'Location Manager', time: '09:00 – 17:00', ai: true }
const AI_F: Shift  = { kind: 'ai', role: 'FOH Lead',         time: '10:00 – 18:00', ai: true }
const AI_B: Shift  = { kind: 'ai', role: 'Back of House',     time: '09:00 – 15:00', ai: true }

const DEPT_COLORS: Record<string, { border: string; text: string; bg: string }> = {
  'Management':     { border: '#4ade82', text: '#16a34a', bg: 'rgba(74,222,128,0.08)' },
  'Front of House': { border: '#818cf8', text: '#4f46e5', bg: 'rgba(129,140,248,0.08)' },
  'Back of House':  { border: '#fb923c', text: '#ea580c', bg: 'rgba(251,146,60,0.08)' },
}

const COMPLIANCE_COLORS = { border: '#fb923c', text: '#ea580c', bg: '#fff7ed' }

// ─── Icons ────────────────────────────────────────────────────────────────────

const IconRain = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M4 10c-1.66 0-3-1.34-3-3 0-1.5 1.1-2.77 2.57-2.96A3.5 3.5 0 0 1 7 1.5a3.5 3.5 0 0 1 3.39 2.6C11.84 4.36 13 5.55 13 7c0 1.66-1.34 3-3 3H4z" stroke="#525252" strokeWidth="1.1"/>
    <path d="M5.5 12l-.5 2M8 12l-.5 2M10.5 12l-.5 2" stroke="#525252" strokeWidth="1.1" strokeLinecap="round"/>
  </svg>
)
const IconSun = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="3.2" stroke="#f59e0b" strokeWidth="1.1"/>
    <path d="M8 1.5v2M8 12.5v2M1.5 8h2M12.5 8h2M3.4 3.4l1.4 1.4M11.2 11.2l1.4 1.4M3.4 12.6l1.4-1.4M11.2 4.8l1.4-1.4" stroke="#f59e0b" strokeWidth="1.1" strokeLinecap="round"/>
  </svg>
)
const IconCloudSun = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="11" cy="5.5" r="2.5" stroke="#f59e0b" strokeWidth="1"/>
    <path d="M3.5 11c-1.38 0-2.5-1.12-2.5-2.5a2.5 2.5 0 0 1 2.08-2.46A3 3 0 0 1 5.9 3.5a3 3 0 0 1 2.8 1.9A2 2 0 0 1 10 9.5A2 2 0 0 1 8 11H3.5z" stroke="#94a3b8" strokeWidth="1"/>
  </svg>
)
const WeatherIcon = ({ weather }: { weather: Weather }) =>
  weather === 'rain' ? <IconRain /> : weather === 'sun' ? <IconSun /> : <IconCloudSun />

const IconCalendarAI = ({ color = 'white' }: { color?: string }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <rect x="2" y="3" width="12" height="11" rx="1.5" stroke={color} strokeWidth="1.2"/>
    <path d="M2 7h12M5.5 1.5v3M10.5 1.5v3" stroke={color} strokeWidth="1.2" strokeLinecap="round"/>
    <path d="M11 10.5L11.5 12H13L11.75 12.75L12.25 14L11 13.2L9.75 14L10.25 12.75L9 12H10.5L11 10.5Z" fill={color}/>
  </svg>
)
const IconCalendarCheck = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <rect x="2" y="3" width="12" height="11" rx="1.5" stroke="#525252" strokeWidth="1.2"/>
    <path d="M2 7h12M5.5 1.5v3M10.5 1.5v3" stroke="#525252" strokeWidth="1.2" strokeLinecap="round"/>
    <path d="M5.5 10.5l2 2 3.5-3.5" stroke="#525252" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)
const IconSpinner = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="animate-spin">
    <path d="M8 2a6 6 0 1 1-5.66 4" stroke="#735cf6" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
)
const IconInfo = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="6.5" stroke="#fb923c" strokeWidth="1.2"/>
    <path d="M8 7v5M8 5.5v.5" stroke="#fb923c" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
)
const IconUserAdd = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="6.5" cy="5" r="3" stroke="#525252" strokeWidth="1.2"/>
    <path d="M1 14c0-2.76 2.46-5 5.5-5M12 10v4M10 12h4" stroke="#525252" strokeWidth="1.2" strokeLinecap="round"/>
  </svg>
)
const IconUserProfile = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="6" r="3" stroke="white" strokeWidth="1.2"/>
    <path d="M2 15c0-3.31 2.69-6 6-6s6 2.69 6 6" stroke="white" strokeWidth="1.2" strokeLinecap="round"/>
  </svg>
)
const IconPalmTree = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M7 12V6M7 6c0-2.5 2-4.2 4-3.8M7 6C7 3.5 5 2 3 2.5" stroke="#fb923c" strokeWidth="1.2" strokeLinecap="round"/>
    <path d="M7 6c-1.2-1.2-2.8-1.2-3.8 0M7 6c1.2-1.2 2.8-1.2 3.8 0" stroke="#fb923c" strokeWidth="1.2" strokeLinecap="round"/>
  </svg>
)
const IconTimeClock = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <circle cx="7" cy="7" r="5" stroke="#525252" strokeWidth="1.2"/>
    <path d="M7 4.5v3l1.5 1.5" stroke="#525252" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)
const IconDragHandle = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    {[[4,3],[8,3],[4,7],[8,7],[4,11],[8,11]].map(([x,y],i) => (
      <circle key={i} cx={x} cy={y} r="1.2" fill="#a3a3a3"/>
    ))}
  </svg>
)

// ─── Shift cell ───────────────────────────────────────────────────────────────

function ShiftCell({
  shift, deptName, onClickShift, empName,
}: { shift: Shift; deptName: string; onClickShift?: (data: ShiftModalData) => void; empName?: string }) {
  const deptColors = DEPT_COLORS[deptName] ?? DEPT_COLORS['Management']
  const colors = shift.compliance ? COMPLIANCE_COLORS : deptColors

  if (shift.kind === 'empty') {
    return <div className="flex-1 h-full border-l border-[#e5e5e5]" />
  }

  // AI-suggested shift
  if (shift.kind === 'ai') {
    return (
      <div className="flex-1 h-full border-l border-[#e5e5e5] p-1 min-w-0">
        <div className="h-full rounded-[10px] px-2 py-1.5 flex flex-col justify-center gap-0.5 border border-dashed border-[#735cf6] bg-[#f5f3ff] overflow-hidden relative">
          <div className="absolute top-1 right-1">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M5 1L5.8 3.8H8.5L6.3 5.4L7.2 8L5 6.5L2.8 8L3.7 5.4L1.5 3.8H4.2L5 1Z" fill="#735cf6"/>
            </svg>
          </div>
          <span className="text-[12px] leading-4 font-medium truncate text-[#5b21b6]">{shift.role}</span>
          <span className="text-[11px] leading-4 truncate text-[#6d28d9]">{shift.time}</span>
        </div>
      </div>
    )
  }
  if (shift.kind === 'unavailable') {
    return (
      <div className="flex-1 h-full border-l border-[#e5e5e5] bg-[#fafafa] p-2 flex flex-col justify-center min-w-0">
        <span className="text-[13px] text-[#525252] leading-4 truncate">Unavailable</span>
      </div>
    )
  }
  if (shift.kind === 'holiday') {
    return (
      <div className="flex-1 h-full border-l border-[#e5e5e5] bg-[#fafafa] p-2 flex flex-col justify-center min-w-0">
        <div className="flex items-center gap-1">
          <IconPalmTree />
          <span className="text-[13px] text-[#fb923c] leading-4 truncate">Holidays</span>
        </div>
      </div>
    )
  }
  if (shift.kind === 'timeoff') {
    return (
      <div className="flex-1 h-full border-l border-[#e5e5e5] bg-[#fafafa] p-2 flex flex-col justify-center gap-0.5 min-w-0">
        <div className="flex items-center gap-1">
          <IconTimeClock />
          <span className="text-[13px] text-[#525252] leading-4 truncate">Time off</span>
        </div>
        <span className="text-[12px] text-[#525252] leading-4 pl-5 truncate">{shift.time}</span>
      </div>
    )
  }

  // Regular shift
  const handleClick = () => {
    if (!onClickShift || !shift.role) return
    const dept = deptName
    const station = shift.role
    onClickShift({
      employeeName: empName ?? 'Employee',
      role: shift.role,
      department: dept,
      station,
      startTime: shift.time?.split('–')[0]?.trim() ?? '08:00',
      endTime: shift.time?.split('–')[1]?.trim() ?? '17:00',
      hasCompliance: !!shift.compliance,
      complianceDay: shift.compliance ? 'Thursday and Friday' : undefined,
    })
  }

  return (
    <div
      className="flex-1 h-full border-l border-[#e5e5e5] p-1 min-w-0"
      onClick={handleClick}
    >
      <div
        className={`h-full rounded-[10px] px-2.5 py-1.5 flex flex-col justify-center gap-0.5 border border-dashed overflow-hidden ${onClickShift ? 'cursor-pointer hover:opacity-90 transition-opacity' : ''}`}
        style={{
          borderColor: colors.border,
          background: colors.bg,
          ...(shift.compliance ? { borderStyle: 'solid' } : {}),
        }}
      >
        {shift.compliance && (
          <div className="w-2 h-2 rounded-full bg-[#fb923c] absolute -top-0.5 -right-0.5 hidden" />
        )}
        <span className="text-[13px] leading-4 font-medium truncate" style={{ color: colors.text }}>
          {shift.role}
        </span>
        <span className="text-[12px] leading-4 truncate" style={{ color: colors.text }}>
          {shift.time}
        </span>
      </div>
    </div>
  )
}

// ─── Employee row ─────────────────────────────────────────────────────────────

function EmployeeRow({
  emp, deptName, onClickShift,
}: { emp: Employee; deptName: string; onClickShift: (data: ShiftModalData) => void }) {
  return (
    <div className="flex items-stretch border-b border-[#e5e5e5] h-14">
      <div className="w-40 shrink-0 flex items-center gap-2 px-2 py-2">
        {emp.isAdd ? (
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg border border-[#e5e5e5] flex items-center justify-center bg-white shadow-[0_1px_2px_rgba(47,62,77,0.04)] shrink-0">
              <IconUserAdd />
            </div>
            <span className="text-[13px] text-[#525252]">Add Shift</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-[#d7d6fe] flex items-center justify-center shrink-0">
              <IconUserProfile />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[13px] text-[#262626] leading-4 truncate">{emp.name}</span>
              <span className="text-[12px] text-[#a3a3a3] leading-4">{emp.worked}/{emp.cap}</span>
            </div>
          </div>
        )}
      </div>
      {emp.shifts.map((shift, i) => (
        <ShiftCell
          key={i}
          shift={shift}
          deptName={deptName}
          empName={emp.name}
          onClickShift={shift.kind === 'shift' && !emp.isAdd ? onClickShift : undefined}
        />
      ))}
    </div>
  )
}

// ─── Department section ───────────────────────────────────────────────────────

function DeptSection({
  dept, collapsed, onToggle, onClickShift,
}: {
  dept: Dept
  collapsed: boolean
  onToggle: () => void
  onClickShift: (data: ShiftModalData) => void
}) {
  return (
    <div className="border-b border-[#e5e5e5]">
      <div className="border-b border-[#e5e5e5]">
        <div className="flex items-center px-2 py-1.5 gap-3">
          <button
            onClick={onToggle}
            className="w-6 h-6 rounded-lg border border-[#e5e5e5] flex items-center justify-center bg-white shadow-[0_1px_2px_rgba(47,62,77,0.04)]"
          >
            {collapsed ? <ChevronDown size={12} color="#525252" /> : <ChevronUp size={12} color="#525252" />}
          </button>
          <span className="text-[13px] text-[#262626] font-medium">{dept.name}</span>
          <span className="text-[13px] text-[#525252]">{dept.summary}</span>
        </div>
        <div className="flex pl-40">
          {dept.hoursPerDay.map((h, i) => (
            <div key={i} className="flex-1 flex items-center justify-center py-1.5 min-w-0">
              <span className="text-[12px] text-[#a3a3a3] text-center leading-4">{h}</span>
            </div>
          ))}
        </div>
      </div>
      {!collapsed && dept.employees.map((emp, i) => (
        <EmployeeRow key={i} emp={emp} deptName={dept.name} onClickShift={onClickShift} />
      ))}
    </div>
  )
}

// ─── Shift Edit Modal ─────────────────────────────────────────────────────────

function ShiftModal({ data, onClose }: { data: ShiftModalData; onClose: () => void }) {
  const [startH, setStartH] = useState(data.startTime.split(':')[0]?.replace(/[^0-9]/g, '') ?? '08')
  const [startM, setStartM] = useState(data.startTime.split(':')[1]?.replace(/[^0-9]/g, '') ?? '00')
  const [endH, setEndH] = useState(data.endTime.split(':')[0]?.replace(/[^0-9]/g, '') ?? '17')
  const [endM, setEndM] = useState(data.endTime.split(':')[1]?.replace(/[^0-9]/g, '') ?? '00')
  const [note, setNote] = useState('')

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24" onClick={onClose}>
      <div className="absolute inset-0 bg-black/10" />
      <div
        className="relative w-[421px] bg-[#f5f5f5] border border-[#e5e5e5] rounded-xl overflow-hidden shadow-[0_10px_15px_-3px_rgba(0,0,0,0.10),0_4px_6px_-4px_rgba(0,0,0,0.10)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal header */}
        <div className="flex items-center gap-2 px-3.5 py-2.5">
          <IconDragHandle />
          <div className="w-6 h-6 rounded-[6px] bg-[#d7d6fe] flex items-center justify-center shrink-0">
            <IconUserProfile />
          </div>
          <span className="flex-1 text-[14px] text-[#525252] min-w-0 truncate">{data.employeeName}</span>
          <button
            onClick={onClose}
            className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-[#e5e5e5]"
          >
            <XIcon size={14} color="#525252" />
          </button>
        </div>

        {/* Inner card */}
        <div className="bg-white border border-[#e5e5e5] rounded-lg mx-0 shadow-[0_0_8px_rgba(0,0,0,0.08)]">
          {/* Compliance + time + dept/station */}
          <div className="flex flex-col gap-2.5 p-3">
            {/* Compliance callout */}
            {data.hasCompliance && (
              <div className="bg-[#fff7ed] border border-[#fb923c] rounded-xl p-2 flex gap-2 items-start">
                <div className="bg-[#ffedd5] rounded-lg p-1 shrink-0">
                  <IconInfo />
                </div>
                <div className="flex flex-col gap-1 pt-1">
                  <p className="text-[14px] font-semibold text-[#262626] leading-none">
                    Rest Periods (between days)
                  </p>
                  <p className="text-[14px] text-[#525252] leading-5">
                    {data.employeeName} has no 11 hours rest between {data.complianceDay}. Consider
                    reducing their hours or adjusting the shifts.
                  </p>
                </div>
              </div>
            )}

            {/* Time pickers */}
            <div className="flex items-end gap-4">
              <div className="flex-1 flex flex-col gap-2">
                <span className="text-[14px] text-[#a3a3a3] leading-4 tracking-[0.5px]">Time</span>
                <div className="flex items-center gap-1 h-8 border border-[#d4d4d4] rounded-lg bg-white px-1">
                  <input
                    type="text"
                    value={startH}
                    onChange={e => setStartH(e.target.value.slice(-2))}
                    className="w-7 text-center text-[14px] text-[#262626] bg-transparent border-none outline-none"
                    maxLength={2}
                  />
                  <span className="text-[14px] text-[#262626]">:</span>
                  <input
                    type="text"
                    value={startM}
                    onChange={e => setStartM(e.target.value.slice(-2))}
                    className="w-7 text-center text-[14px] text-[#262626] bg-transparent border-none outline-none"
                    maxLength={2}
                  />
                </div>
              </div>
              <div className="flex-1 flex flex-col gap-2">
                <div className="flex items-center gap-1 h-8 border border-[#d4d4d4] rounded-lg bg-white px-1">
                  <input
                    type="text"
                    value={endH}
                    onChange={e => setEndH(e.target.value.slice(-2))}
                    className="w-7 text-center text-[14px] text-[#262626] bg-transparent border-none outline-none"
                    maxLength={2}
                  />
                  <span className="text-[14px] text-[#262626]">:</span>
                  <input
                    type="text"
                    value={endM}
                    onChange={e => setEndM(e.target.value.slice(-2))}
                    className="w-7 text-center text-[14px] text-[#262626] bg-transparent border-none outline-none"
                    maxLength={2}
                  />
                </div>
              </div>
            </div>

            {/* Department + Station */}
            <div className="flex gap-4 items-start">
              <div className="flex-1 flex flex-col gap-2">
                <span className="text-[14px] text-[#a3a3a3] leading-4">Department</span>
                <div className="flex items-center gap-2 h-8 border border-[#d4d4d4] rounded-lg bg-white px-3">
                  <span className="flex-1 text-[14px] text-[#262626] truncate">{data.department}</span>
                  <CaretUpDown size={14} color="#a3a3a3" />
                </div>
              </div>
              <div className="flex-1 flex flex-col gap-2">
                <span className="text-[14px] text-[#a3a3a3] leading-4">Station</span>
                <div className="flex items-center gap-2 h-8 border border-[#d4d4d4] rounded-lg bg-white px-3">
                  <span className="flex-1 text-[14px] text-[#262626] truncate">{data.station}</span>
                  <CaretUpDown size={14} color="#a3a3a3" />
                </div>
              </div>
            </div>
          </div>

          {/* Note textarea */}
          <div className="border-t border-[#e5e5e5] px-3 py-3 h-16">
            <textarea
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="Add Shift Note..."
              className="w-full h-full text-[14px] text-[#a3a3a3] placeholder:text-[#a3a3a3] bg-transparent border-none outline-none resize-none leading-4 tracking-[0.5px]"
            />
          </div>

          {/* CTA row */}
          <div className="flex items-center justify-between px-3 py-2 border-t border-[#e5e5e5]">
            <div className="flex items-center gap-2 h-8 border border-[#d4d4d4] rounded-lg bg-white px-3">
              <span className="text-[14px] text-[#262626]">Shift Type</span>
              <CaretUpDown size={14} color="#a3a3a3" />
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="px-3 h-8 border border-[#e5e5e5] rounded-lg text-[14px] text-[#262626] bg-white hover:bg-[#fafafa] shadow-[0_1px_1px_rgba(47,62,77,0.04)]"
              >
                Cancel
              </button>
              <button
                onClick={onClose}
                className="px-3 h-8 rounded-lg text-[14px] text-white bg-[#735cf6] hover:bg-[#6248e8] shadow-[0_1px_1px_rgba(47,62,77,0.04)] transition-colors"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── AI week summary card ─────────────────────────────────────────────────────

function WeekCard({ title1, val1, title2, val2, title3, val3, days, showCol }: {
  title1: string; val1: string; title2: string; val2: string
  title3?: string; val3?: string; days: typeof WEEK_DAYS; showCol: boolean
}) {
  return (
    <div className="bg-[#f5f5f5] border border-[#e5e5e5] rounded-2xl overflow-hidden">
      <div className="flex gap-4 px-4 py-2.5">
        <div className="flex-1 flex flex-col gap-2">
          <span className="text-[13px] text-[#525252] leading-4">{title1}</span>
          <span className="text-[20px] text-[#262626] font-medium leading-none">{val1}</span>
        </div>
        <div className="flex-1 flex flex-col gap-2">
          <span className="text-[13px] text-[#525252] leading-4">{title2}</span>
          <span className="text-[20px] text-[#262626] font-medium leading-none">{val2}</span>
        </div>
        {title3 && val3 && (
          <div className="w-20 flex flex-col gap-2">
            <span className="text-[13px] text-[#525252] leading-4">{title3}</span>
            <span className="text-[20px] text-[#262626] font-medium leading-none">{val3}</span>
          </div>
        )}
      </div>
      <div className="border border-[#e5e5e5] rounded-xl overflow-hidden">
        {days.map((d, i) => (
          <div key={d.name} className={`flex items-center px-3 py-3 bg-white gap-4 ${i < days.length - 1 ? 'border-b border-[#e5e5e5]' : ''}`}>
            <div className="flex-1 flex items-center gap-2 min-w-0">
              <span className="flex-1 text-[14px] text-[#262626] leading-4 truncate">{d.name}</span>
              <div className="flex items-center gap-6 shrink-0">
                <span className="text-[14px] text-[#525252] leading-5 tracking-[-0.15px]">{d.sales}</span>
                <div className="flex items-center gap-2">
                  <span className="text-[14px] text-[#525252]">{d.hours}</span>
                  {showCol && <span className="text-[14px] text-[#525252]">{d.col}</span>}
                </div>
                <WeatherIcon weather={d.weather} />
              </div>
            </div>
            <div className="w-px h-5 bg-[#e5e5e5]" />
            <button className="w-6 h-6 rounded-lg border border-[#e5e5e5] flex items-center justify-center bg-white shadow-[0_1px_2px_rgba(47,62,77,0.04)]">
              <ChevronUp size={12} color="#525252" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── AI Panel ─────────────────────────────────────────────────────────────────

function AIPanel({ phase, onCreateSchedule, onClose }: {
  phase: AIPhase
  onCreateSchedule: () => void
  onClose: () => void
}) {
  const bottomRef = useRef<HTMLDivElement>(null)
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [phase])

  return (
    <div className="flex flex-col h-full bg-white border-l border-[#e5e5e5]" style={{ width: 420 }}>
      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-[10px] border-b border-[#e5e5e5] shrink-0 h-[52px]">
        <button onClick={onClose} className="w-8 h-8 border border-[#e5e5e5] rounded-lg flex items-center justify-center bg-white shadow-[0_1px_2px_rgba(47,62,77,0.04)]">
          <XIcon size={14} color="#525252" />
        </button>
        <button className="w-8 h-8 border border-[#e5e5e5] rounded-lg flex items-center justify-center bg-white shadow-[0_1px_2px_rgba(47,62,77,0.04)]">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <rect x="2" y="3" width="5.5" height="10" rx="1" stroke="#525252" strokeWidth="1.2"/>
            <rect x="8.5" y="3" width="5.5" height="10" rx="1" stroke="#525252" strokeWidth="1.2"/>
          </svg>
        </button>
      </div>

      {/* Scroll area */}
      <div className="flex-1 overflow-y-auto pb-24 px-3 pt-3 flex flex-col gap-3">
        <WeekCard title1="Forecast Sales" val1="£20,241" title2="Suggested Hours" val2="372h" days={WEEK_DAYS} showCol={false} />
        <p className="text-[14px] text-[#262626] leading-6 tracking-[-0.15px] px-1">
          Whenever you're ready, click <span className="font-medium">'Create Schedule'</span>, and I'll get
          to work building a schedule that matches your forecasts.
        </p>

        {(phase === 'creating' || phase === 'building' || phase === 'done') && (
          <div className="flex items-center gap-3 px-1.5 py-1.5">
            <div className="p-1">{phase === 'creating' ? <IconSpinner /> : <IconCalendarAI color="#525252" />}</div>
            <span className="text-[14px] text-[#525252] leading-6 tracking-[-0.15px]">Creating Schedule</span>
            {phase === 'creating' && (
              <div className="flex gap-1 ml-1">
                {[0,1,2].map(i => <span key={i} className="typing-dot w-1.5 h-1.5 rounded-full bg-[#735cf6] inline-block" style={{ animationDelay: `${i*0.2}s` }} />)}
              </div>
            )}
          </div>
        )}

        {(phase === 'building' || phase === 'done') && (
          <div className="flex items-center gap-3 px-1.5 py-1.5">
            <div className="p-1">{phase === 'building' ? <IconSpinner /> : <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="#a3a3a3" strokeWidth="1.2" strokeDasharray="3 2"/></svg>}</div>
            <div className="flex items-center gap-1.5">
              <span className={`text-[14px] leading-6 tracking-[-0.15px] ${phase === 'building' ? 'text-[#525252]' : 'text-[#a3a3a3]'}`}>Building a Week</span>
              {phase === 'building' && <div className="flex gap-1">{[0,1,2].map(i => <span key={i} className="typing-dot w-1.5 h-1.5 rounded-full bg-[#735cf6] inline-block" style={{ animationDelay: `${i*0.2}s` }} />)}</div>}
              {phase === 'done' && <ChevronDown size={14} color="#a3a3a3" />}
            </div>
          </div>
        )}

        {phase === 'done' && (
          <WeekCard title1="Forecast Sales" val1="£20,241" title2="Scheduled Hours" val2="346h" title3="COL" val3="27%" days={WEEK_DAYS} showCol={true} />
        )}

        {phase === 'done' && (
          <div className="flex items-center gap-3 px-1.5 py-1.5">
            <div className="p-1"><IconCalendarCheck /></div>
            <span className="text-[14px] text-[#525252] leading-6 tracking-[-0.15px]">Schedule is done</span>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Bottom CTA */}
      <div className="shrink-0 relative">
        <div className="h-10 w-full" style={{ background: 'linear-gradient(to bottom, rgba(255,255,255,0), white)' }} />
        <div className="px-3 pb-3 bg-white">
          <button
            onClick={onCreateSchedule}
            disabled={phase !== 'idle'}
            className="flex items-center w-full rounded-lg overflow-hidden shadow-[0_1px_1px_rgba(47,62,77,0.04)] disabled:opacity-70"
          >
            <div className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-[#735cf6] hover:bg-[#6248e8] transition-colors">
              <IconCalendarAI />
              <span className="text-[14px] text-white leading-4">
                {phase === 'idle' ? 'Create Schedule' : phase === 'creating' ? 'Creating…' : phase === 'building' ? 'Building…' : 'Schedule Created'}
              </span>
            </div>
            <div className="px-2 py-2 bg-[#735cf6] border-l border-[#5e49d3] hover:bg-[#6248e8] transition-colors">
              <ChevronDown size={16} color="white" />
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

// AI-suggested shifts injected after creation: [deptIdx][employeeIdx][dayIdx]
const AI_FILL: Record<string, Record<number, Shift[]>> = {
  'Management': {
    1: [AI_M, AI_M, E, E, AI_M, E, E],    // Alana 0h/20h gets Mon,Tue,Fri suggestions
  },
  'Front of House': {
    2: [AI_F, E, E, E, E, AI_F, E],        // Alana (row3) gets Mon,Sat
    4: [AI_F, AI_F, E, E, E, E, AI_F],     // Alana (row5) gets Mon,Tue,Sun
  },
  'Back of House': {
    1: [E, E, AI_B, AI_B, AI_B, AI_B, E],  // Alana gets Wed-Sat
  },
}

export default function SchedulePage({ onNavigate }: { onNavigate: (page: Page) => void }) {
  const [viewMode, setViewMode] = useState<ViewMode>('week')
  const [aiPhase, setAiPhase] = useState<AIPhase>('idle')
  const [aiVisible, setAiVisible] = useState(false)
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set())
  const [selectedShift, setSelectedShift] = useState<ShiftModalData | null>(null)
  const [published, setPublished] = useState(false)

  // Merge AI suggestions into the dept data once schedule is done
  const depts = DEPTS.map(dept => {
    if (aiPhase !== 'done') return dept
    const fills = AI_FILL[dept.name]
    if (!fills) return dept
    return {
      ...dept,
      employees: dept.employees.map((emp, ei) => {
        const suggested = fills[ei]
        if (!suggested) return emp
        return {
          ...emp,
          shifts: emp.shifts.map((s, si) => (s.kind === 'empty' && suggested[si]?.kind === 'ai') ? suggested[si] : s),
        }
      }),
    }
  })

  const handleCreateSchedule = () => {
    if (aiPhase !== 'idle') return
    setAiVisible(true)
    setAiPhase('creating')
    setTimeout(() => setAiPhase('building'), 1800)
    setTimeout(() => setAiPhase('done'), 4200)
  }

  const handlePublish = () => {
    setPublished(true)
    setTimeout(() => setPublished(false), 4000)
  }

  const toggleDept = (name: string) => {
    setCollapsed(prev => { const n = new Set(prev); n.has(name) ? n.delete(name) : n.add(name); return n })
  }

  const isIdle = aiPhase === 'idle'

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* ── Left: Schedule ── */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden border-r border-[#e5e5e5]">
        {/* Top bar */}
        <div className="flex items-center gap-3 px-4 h-[52px] border-b border-[#e5e5e5] shrink-0 bg-white">
          <button onClick={() => onNavigate('overview')} className="w-8 h-8 border border-[#e5e5e5] rounded-lg flex items-center justify-center bg-white hover:bg-[#fafafa]">
            <ChevronLeft size={14} color="#525252" />
          </button>
          <span className="text-[14px] text-[#262626] font-medium">Schedule</span>

          {/* Week / Day toggle — only in pre-create state */}
          {isIdle && (
            <div className="flex items-center border border-[#e5e5e5] rounded-lg overflow-hidden bg-white h-8">
              {(['week', 'day'] as ViewMode[]).map(v => (
                <button
                  key={v}
                  onClick={() => setViewMode(v)}
                  className={`px-3 h-full text-[14px] capitalize transition-colors ${viewMode === v ? 'bg-[#f5f5f5] text-[#262626] font-medium' : 'text-[#525252] hover:bg-[#fafafa]'}`}
                >
                  {v.charAt(0).toUpperCase() + v.slice(1)}
                </button>
              ))}
            </div>
          )}

          <div className="flex items-center">
            <button className="w-8 h-8 border border-[#e5e5e5] rounded-l-lg flex items-center justify-center bg-white hover:bg-[#fafafa] shadow-[0_1px_2px_rgba(47,62,77,0.04)]">
              <ChevronLeft size={14} color="#525252" />
            </button>
            <div className="flex items-center gap-2 h-8 px-3 bg-white border-t border-b border-[#e5e5e5]">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1" y="2" width="12" height="11" rx="1.5" stroke="#525252" strokeWidth="1.1"/><path d="M1 6h12M4.5 1v2M9.5 1v2" stroke="#525252" strokeWidth="1.1" strokeLinecap="round"/></svg>
              <span className="text-[14px] text-[#262626] tracking-[-0.15px]">20 Oct</span>
              <CaretUpDown size={14} color="#a3a3a3" />
            </div>
            <button className="w-8 h-8 border border-[#e5e5e5] rounded-r-lg flex items-center justify-center bg-white hover:bg-[#fafafa] shadow-[0_1px_2px_rgba(47,62,77,0.04)]">
              <ChevronRight size={14} color="#525252" />
            </button>
          </div>

          <button className="flex items-center gap-2 h-8 px-3 border border-[#e5e5e5] rounded-lg bg-white text-[14px] text-[#262626] hover:bg-[#fafafa]">
            Departments <ChevronDown size={14} color="#a3a3a3" />
          </button>
          <div className="flex-1" />
          <button className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[#f5f5f5]">
            <DotsIcon size={16} color="#525252" />
          </button>
        </div>

        {/* Projections bar */}
        <div className="flex items-center justify-between px-4 h-[52px] border-b border-[#e5e5e5] shrink-0 bg-white">
          <div className="flex items-center gap-2">
            <span className="text-[14px] text-[#262626] tracking-[-0.15px]">Week 32</span>
            <div className="w-px h-4 bg-[#e5e5e5]" />
            <span className="text-[14px] text-[#262626] tracking-[-0.15px]">Projected</span>
            <span className="px-1 py-0.5 rounded bg-[#f5f5f5] text-[12px] text-[#737373]">£4,200</span>
            <span className="px-1 py-0.5 rounded bg-[#f5f5f5] text-[12px] text-[#737373]">0% / £0 / 0h</span>
          </div>
          <div className="flex items-center gap-2">
            {/* Compliance button — only pre-create */}
            {isIdle && (
              <button className="flex items-center gap-2 h-8 px-3 border border-[#e5e5e5] rounded-lg bg-white hover:bg-[#fafafa] shadow-[0_1px_1px_rgba(47,62,77,0.04)]">
                <span className="flex items-center justify-center w-4 h-4 rounded-[6px] bg-[#f97316] text-[10px] text-white font-medium leading-none">1</span>
                <span className="text-[14px] text-[#262626]">Compliance</span>
              </button>
            )}
            <button
              onClick={handleCreateSchedule}
              disabled={!isIdle}
              className="flex items-center gap-2 h-8 px-3 bg-[#735cf6] rounded-lg text-[14px] text-white hover:bg-[#6248e8] transition-colors disabled:opacity-70 shadow-[0_1px_1px_rgba(47,62,77,0.04)]"
            >
              <IconCalendarAI />
              {isIdle ? 'Create Schedule' : aiPhase === 'creating' ? 'Creating…' : aiPhase === 'building' ? 'Building…' : 'Done ✓'}
            </button>
            <button
              onClick={handlePublish}
              className={`flex items-center gap-1.5 h-8 px-3 border rounded-lg text-[14px] shadow-[0_1px_1px_rgba(47,62,77,0.04)] transition-all ${aiPhase === 'done' ? 'border-[#735cf6] bg-[#f5f3ff] text-[#735cf6] hover:bg-[#ede9fe] font-medium' : 'border-[#e5e5e5] bg-white text-[#262626] hover:bg-[#fafafa]'}`}
            >
              Publish {aiPhase === 'done' && '✓'} <ChevronDown size={14} color={aiPhase === 'done' ? '#735cf6' : '#a3a3a3'} />
            </button>
          </div>
        </div>

        {/* Calendar */}
        <div className="flex-1 overflow-y-auto">
          {/* Day headers */}
          <div className="flex border-b border-[#e5e5e5] sticky top-0 bg-white z-10">
            <div className="text-[13px] text-[#525252] w-40 shrink-0 flex items-center px-2 py-2">Days</div>
            {DAYS.map(d => (
              <div key={d.day} className="flex-1 flex items-center justify-between px-2 py-2.5 border-l border-[#e5e5e5] min-w-0">
                <span className="text-[13px] text-[#262626]">{d.day}, {d.date}</span>
                <button className="w-6 h-6 rounded-md flex items-center justify-center hover:bg-[#f5f5f5]">
                  <WeatherIcon weather={d.weather} />
                </button>
              </div>
            ))}
          </div>

          {/* Sales forecast */}
          <div className="flex border-b border-[#e5e5e5] sticky top-10 bg-white z-10">
            <div className="w-40 shrink-0 flex items-center px-2 py-2">
              <span className="text-[13px] text-[#525252]">Sales forecast</span>
            </div>
            {SALES.map((s, i) => (
              <div key={i} className="flex-1 flex items-center justify-center border-l border-[#e5e5e5] py-2 min-w-0">
                <span className="text-[13px] text-[#262626] font-medium truncate px-1">{s}</span>
              </div>
            ))}
          </div>

          {/* Publish success banner */}
          {published && (
            <div className="sticky top-0 z-20 flex items-center gap-2 px-4 py-2.5 bg-[#f0fdf5] border-b border-[#4ade82] text-[14px] text-[#16a34a]">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="6.5" fill="#16a34a"/>
                <path d="M5 8l2.5 2.5 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Schedule published successfully! Your team has been notified.
            </div>
          )}

          {/* AI-suggested shifts legend */}
          {aiPhase === 'done' && (
            <div className="sticky top-0 z-20 flex items-center gap-2 px-4 py-2 bg-[#f5f3ff] border-b border-[#c4b5fd] text-[13px] text-[#5b21b6]">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M6 1L7 4H10L7.5 6L8.5 9L6 7.5L3.5 9L4.5 6L2 4H5L6 1Z" fill="#735cf6"/>
              </svg>
              AI-suggested shifts shown with ✦ — review and adjust before publishing
            </div>
          )}

          {/* Dept sections */}
          {depts.map(dept => (
            <DeptSection
              key={dept.name}
              dept={dept}
              collapsed={collapsed.has(dept.name)}
              onToggle={() => toggleDept(dept.name)}
              onClickShift={setSelectedShift}
            />
          ))}
        </div>
      </div>

      {/* ── Right: AI panel (slides in after Create Schedule) ── */}
      <div
        className="overflow-hidden transition-all duration-300 ease-out flex-none"
        style={{ width: aiVisible ? 420 : 0, opacity: aiVisible ? 1 : 0 }}
      >
        {aiVisible && (
          <AIPanel
            phase={aiPhase}
            onCreateSchedule={handleCreateSchedule}
            onClose={() => { setAiVisible(false); setAiPhase('idle') }}
          />
        )}
      </div>

      {/* ── Shift edit modal ── */}
      {selectedShift && (
        <ShiftModal data={selectedShift} onClose={() => setSelectedShift(null)} />
      )}
    </div>
  )
}
