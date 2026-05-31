import { ChevronLeft, ChevronRight, ChevronDown, CalendarIcon, CaretUpDown, NorySparkle, DotsIcon } from './icons'

interface TopBarProps {
  onAskNory: () => void
}

export default function TopBar({ onAskNory }: TopBarProps) {
  return (
    <div className="flex items-center gap-4 px-4 py-[10px] border-b border-[#e5e5e5] shrink-0 h-[52px] bg-white">
      {/* Left: breadcrumb + date pickers */}
      <div className="flex flex-1 items-center gap-3 min-w-0">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-0 shrink-0">
          <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-[#fafafa] text-[14px] text-[#262626]">
            Insights
            <ChevronDown color="#a3a3a3" size={14} />
          </button>
          <span className="text-[16px] text-[#d4d4d4] mx-1">/</span>
          <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-[#fafafa] text-[14px] text-[#262626] font-medium">
            Customer Insights
          </button>
        </div>

        {/* Vertical divider */}
        <div className="w-px h-6 bg-[#e5e5e5] shrink-0" />

        {/* Date range picker */}
        <div className="flex items-center shrink-0">
          {/* Prev arrow */}
          <button className="flex items-center justify-center w-8 h-8 border border-[#e5e5e5] rounded-l-lg bg-white hover:bg-[#fafafa] shadow-[0_1px_2px_rgba(47,62,77,0.04)]">
            <ChevronLeft size={14} color="#525252" />
          </button>

          {/* Date input */}
          <div className="flex items-center gap-2 px-3 h-8 bg-white border-t border-b border-[#e5e5e5]">
            <CalendarIcon size={14} color="#525252" />
            <span className="text-[14px] text-[#262626] tracking-[-0.15px]">This week</span>
            <CaretUpDown size={14} color="#a3a3a3" />
          </div>

          {/* Next arrow */}
          <button className="flex items-center justify-center w-8 h-8 border border-[#e5e5e5] rounded-r-lg bg-white hover:bg-[#fafafa] shadow-[0_1px_2px_rgba(47,62,77,0.04)]">
            <ChevronRight size={14} color="#525252" />
          </button>
        </div>

        {/* Compare period */}
        <div className="flex items-center gap-2 px-3 h-8 bg-white border border-[#d4d4d4] rounded-lg cursor-pointer hover:bg-[#fafafa]">
          <span className="text-[14px] text-[#262626] tracking-[-0.15px]">This week</span>
          <CaretUpDown size={14} color="#a3a3a3" />
        </div>
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={onAskNory}
          className="flex items-center gap-1.5 px-3 py-2 bg-white border border-[#e5e5e5] rounded-lg text-[14px] text-[#262626] hover:bg-[#fafafa] shadow-[0_1px_1px_rgba(47,62,77,0.04)] transition-colors"
        >
          <NorySparkle size={16} color="#735cf6" />
          Ask Nory
        </button>
        <button className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-[#f5f5f5]">
          <DotsIcon size={16} color="#525252" />
        </button>
      </div>
    </div>
  )
}
