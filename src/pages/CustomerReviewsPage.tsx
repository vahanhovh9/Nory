import KPICard from '../components/KPICard'
import RatingOverTime from '../components/RatingOverTime'
import ReviewsPanel from '../components/ReviewsPanel'
import RatingsByLocation from '../components/RatingsByLocation'
import { FilterIcon, CaretUpDown } from '../components/icons'

export default function CustomerReviewsPage() {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-8 pt-4 pb-8 flex flex-col gap-6 min-h-full">
        {/* Page header */}
        <div className="flex items-center justify-between h-8">
          <h1 className="text-[20px] font-normal text-[#2f3e4d] leading-6 tracking-[0.38px] font-display">
            Customer Reviews
          </h1>
          <div className="flex items-center gap-2 px-3 h-8 bg-white border border-[#d4d4d4] rounded-lg cursor-pointer hover:bg-[#fafafa]">
            <FilterIcon size={14} color="#525252" />
            <span className="text-[14px] text-[#262626] tracking-[-0.15px]">This week</span>
          </div>
        </div>

        {/* KPI Row */}
        <div className="flex gap-4">
          <KPICard
            label="Rating Total (avg)"
            value="4.51"
            variance="0.12"
            varianceType="positive"
          />
          <KPICard
            label="Ratings in the period"
            value="21"
            variance="2"
            varianceType="warning"
          />
          <KPICard
            label="Response Rate"
            value="78%"
            variance="1.02%"
            varianceType="warning"
          />
        </div>

        {/* Main two-column section */}
        <div className="flex gap-4 min-h-0" style={{ height: 640 }}>
          <div className="flex-1 min-w-0">
            <RatingOverTime />
          </div>
          <div className="flex-1 min-w-0">
            <ReviewsPanel />
          </div>
        </div>

        {/* Rating by location */}
        <RatingsByLocation />
      </div>
    </div>
  )
}
