import type { Page, Period } from '../App'
import { ChevronLeft, ChevronRight, ChevronDown, AiIcon, DotsIcon } from './icons'
import PeriodPicker from './PeriodPicker'

interface BreadcrumbEntry {
  parent: string
  child: string
  childHasDropdown: boolean
  grandchild?: string
  grandchildHasDropdown?: boolean
}

const breadcrumbs: Record<Page, BreadcrumbEntry> = {
  'schedule':         { parent: 'Insights',   child: 'Schedule',          childHasDropdown: false },
  'sales':            { parent: 'Insights',   child: 'Sales',             childHasDropdown: true  },
  'customer-reviews': { parent: 'Insights',   child: 'Customer Insights', childHasDropdown: false },
  'overview':         { parent: 'Insights',   child: 'Overview',          childHasDropdown: false },
  'labour':           { parent: 'Insights',   child: 'Labour',            childHasDropdown: false },
  'inventory':        { parent: 'Insights',   child: 'Inventory',         childHasDropdown: false, grandchild: 'Liffey Valley', grandchildHasDropdown: true },
  'pl':               { parent: 'Insights',   child: 'P&L',               childHasDropdown: false },
  'budget':           { parent: 'Insights',   child: 'Budget',            childHasDropdown: false },
  'purchases':        { parent: 'Purchases',  child: 'Place orders',      childHasDropdown: false },
}

// Pages with a simple TopBar (no date picker / Ask Nory)
const SIMPLE_PAGES: Page[] = ['purchases']

interface TopBarProps {
  page: Page
  period: Period
  onPeriodChange: (p: Period) => void
  onAskNory: () => void
  askNoryOpen: boolean
}

export default function TopBar({ page, period, onPeriodChange, onAskNory, askNoryOpen }: TopBarProps) {
  const { parent, child, childHasDropdown, grandchild, grandchildHasDropdown } = breadcrumbs[page] ?? breadcrumbs['overview']
  const isSimple = SIMPLE_PAGES.includes(page)

  return (
    <div className="flex items-center gap-4 px-4 py-[10px] border-b border-[#e5e5e5] shrink-0 h-[52px] bg-white">
      {/* Left */}
      <div className="flex flex-1 items-center gap-3 min-w-0">
        {/* Breadcrumbs */}
        <div className="flex items-center shrink-0">
          <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-[#fafafa] text-[14px] text-[#262626]">
            {parent}
            <ChevronDown color="#a3a3a3" size={14} />
          </button>
          <span className="text-[16px] text-[#d4d4d4] mx-1">/</span>
          <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-[#fafafa] text-[14px] text-[#262626] font-medium">
            {child}
            {childHasDropdown && <ChevronDown color="#a3a3a3" size={14} />}
          </button>
          {grandchild && (
            <>
              <span className="text-[16px] text-[#d4d4d4] mx-1">/</span>
              <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-[#fafafa] text-[14px] text-[#262626] font-medium">
                {grandchild}
                {grandchildHasDropdown && <ChevronDown color="#a3a3a3" size={14} />}
              </button>
            </>
          )}
        </div>

        {/* Date picker — hidden for simple pages */}
        {!isSimple && (
          <>
            <div className="w-px h-6 bg-[#e5e5e5] shrink-0" />
            <div className="flex items-center shrink-0">
              <button className="flex items-center justify-center w-8 h-8 border border-[#e5e5e5] rounded-l-lg bg-white hover:bg-[#fafafa] shadow-[0_1px_2px_rgba(47,62,77,0.04)]">
                <ChevronLeft size={14} color="#525252" />
              </button>
              <PeriodPicker value={period} onChange={onPeriodChange} />
              <button className="flex items-center justify-center w-8 h-8 border border-[#e5e5e5] rounded-r-lg bg-white hover:bg-[#fafafa] shadow-[0_1px_2px_rgba(47,62,77,0.04)]">
                <ChevronRight size={14} color="#525252" />
              </button>
            </div>
          </>
        )}
      </div>

      {/* Right — Hey, Nory shown on every page */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={onAskNory}
          aria-pressed={askNoryOpen}
          className={
            askNoryOpen
              // Pressed / selected: brighter lavender bg, dark icon+text, purple border
              ? 'flex items-center gap-2 px-3.5 py-2 rounded-lg text-[14px] font-medium text-[#5b21b6] bg-[#ede9fe] border border-[#735cf6] transition-all'
              // Default: solid purple gradient, white icon+text, transparent border (no layout shift), no shadow
              : 'flex items-center gap-2 px-3.5 py-2 rounded-lg text-[14px] font-medium text-white bg-gradient-to-r from-[#735cf6] to-[#9b6cf8] border border-transparent hover:from-[#6248e8] hover:to-[#8a5cf0] transition-all'
          }
        >
          <AiIcon size={16} color={askNoryOpen ? '#5b21b6' : '#ffffff'} />
          Hey, Nory
        </button>
        <button className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-[#f5f5f5]">
          <DotsIcon size={16} color="#525252" />
        </button>
      </div>
    </div>
  )
}
