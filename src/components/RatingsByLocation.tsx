import { SearchIcon } from './icons'

function StarMini({ filled }: { filled: boolean }) {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      {filled ? (
        <path d="M6 1.5L7.2 4.5H10.5L7.875 6.375L8.85 9.75L6 8L3.15 9.75L4.125 6.375L1.5 4.5H4.8L6 1.5Z" fill="#F97316" />
      ) : (
        <path d="M6 1.5L7.2 4.5H10.5L7.875 6.375L8.85 9.75L6 8L3.15 9.75L4.125 6.375L1.5 4.5H4.8L6 1.5Z" stroke="#D4D4D4" strokeWidth="1" />
      )}
    </svg>
  )
}

function InlineStars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <StarMini key={i} filled={i < Math.round(rating)} />
      ))}
    </div>
  )
}

interface LocationRow {
  name: string
  rating: number
  reviews: number
  change: 'up' | 'down' | 'neutral'
  pct: number
}

const locations: LocationRow[] = [
  { name: 'Dublin – Grafton Street', rating: 4.8, reviews: 8, change: 'up', pct: 92 },
  { name: 'Dublin – Grand Canal Dock', rating: 4.6, reviews: 7, change: 'up', pct: 85 },
  { name: 'Cork – Patrick Street', rating: 4.2, reviews: 4, change: 'down', pct: 78 },
  { name: 'Galway – Shop Street', rating: 3.9, reviews: 2, change: 'neutral', pct: 60 },
]

export default function RatingsByLocation() {
  return (
    <div className="bg-white border border-[#e5e5e5] rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#e5e5e5]">
        <span className="text-[14px] text-[#262626] font-medium">Rating by location</span>
        <div className="flex items-center gap-2 px-3 h-8 border border-[#e5e5e5] rounded-lg bg-[#fafafa]">
          <SearchIcon size={14} color="#a3a3a3" />
          <span className="text-[14px] text-[#a3a3a3] tracking-[-0.15px]">Search by location name</span>
        </div>
      </div>

      {/* Table */}
      <div>
        {/* Column headers */}
        <div className="flex items-center border-b border-[#e5e5e5] bg-[#fafafa]">
          <div className="flex-1 px-6 py-3 text-[14px] text-[#525252]">Location</div>
          <div className="w-[160px] px-4 py-3 text-[14px] text-[#525252] text-center">Rating</div>
          <div className="w-[120px] px-4 py-3 text-[14px] text-[#525252] text-right">Reviews</div>
          <div className="w-[200px] px-4 py-3 text-[14px] text-[#525252] text-right">Response rate</div>
        </div>

        {/* Rows */}
        {locations.map((loc) => (
          <div key={loc.name} className="flex items-center border-b border-[#e5e5e5] last:border-b-0 hover:bg-[#fafafa]">
            <div className="flex-1 px-6 py-3 text-[14px] text-[#262626] tracking-[-0.15px]">
              {loc.name}
            </div>
            <div className="w-[160px] px-4 py-3 flex items-center gap-2 justify-center">
              <InlineStars rating={loc.rating} />
              <span className="text-[14px] text-[#262626] font-medium">{loc.rating.toFixed(1)}</span>
            </div>
            <div className="w-[120px] px-4 py-3 text-[14px] text-[#262626] text-right">
              {loc.reviews}
            </div>
            <div className="w-[200px] px-4 py-3 flex items-center gap-3 justify-end">
              <div className="flex-1 h-1.5 bg-[#e5e5e5] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#735cf6] rounded-full"
                  style={{ width: `${loc.pct}%` }}
                />
              </div>
              <span className="text-[14px] text-[#262626] w-8 text-right">{loc.pct}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
