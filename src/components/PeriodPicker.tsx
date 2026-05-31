import { useState, useRef, useEffect } from 'react'
import { CaretUpDown } from './icons'
import { CalendarIcon } from './icons'
import type { Period } from '../App'

const PERIODS: Period[] = ['Today', 'This week', 'This month', 'This quarter', 'This year']

interface PeriodPickerProps {
  value: Period
  onChange: (p: Period) => void
}

const CheckIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
    <path d="M2 6l3 3 5-5" stroke="#735cf6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

export default function PeriodPicker({ value, onChange }: PeriodPickerProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={ref} className="relative">
      <div
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 h-8 px-3 bg-white border-t border-b border-[#e5e5e5] cursor-pointer hover:bg-[#fafafa] select-none"
      >
        <CalendarIcon size={14} color="#525252" />
        <span className="text-[14px] text-[#262626] tracking-[-0.15px] whitespace-nowrap">{value}</span>
        <CaretUpDown size={14} color="#a3a3a3" />
      </div>

      {open && (
        <div className="absolute top-[calc(100%+4px)] left-0 bg-white border border-[#e5e5e5] rounded-xl shadow-[0_4px_16px_rgba(0,0,0,0.08)] z-50 w-44 py-1 overflow-hidden">
          {PERIODS.map(p => (
            <button
              key={p}
              onClick={() => { onChange(p); setOpen(false) }}
              className={`flex items-center gap-2 w-full px-3 py-2.5 text-left text-[14px] tracking-[-0.15px] hover:bg-[#fafafa] transition-colors ${p === value ? 'text-[#735cf6] font-medium' : 'text-[#262626]'}`}
            >
              <span className="w-3 flex items-center justify-center shrink-0">
                {p === value && <CheckIcon />}
              </span>
              {p}
            </button>
          ))}
          <div className="border-t border-[#e5e5e5] my-1" />
          <button className="flex items-center gap-2 w-full px-3 py-2.5 text-left text-[14px] text-[#525252] hover:bg-[#fafafa] tracking-[-0.15px]">
            <span className="w-3" />
            Custom range…
          </button>
        </div>
      )}
    </div>
  )
}
