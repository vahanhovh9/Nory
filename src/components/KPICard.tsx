import { ArrowUpRight, ArrowDownRight } from './icons'

type VarianceType = 'positive' | 'warning' | 'negative'

interface VarianceBadgeProps {
  value: string
  type: VarianceType
}

function VarianceBadge({ value, type }: VarianceBadgeProps) {
  const configs = {
    positive: {
      bg: 'bg-[#f0fdf5]',
      text: 'text-[#16a34c]',
      Arrow: ArrowUpRight,
      arrowColor: '#16a34c',
    },
    warning: {
      bg: 'bg-[#fff7ed]',
      text: 'text-[#ea580c]',
      Arrow: ArrowUpRight,
      arrowColor: '#ea580c',
    },
    negative: {
      bg: 'bg-[#fee2e2]',
      text: 'text-[#b91c1c]',
      Arrow: ArrowDownRight,
      arrowColor: '#b91c1c',
    },
  }

  const { bg, text, Arrow, arrowColor } = configs[type]

  return (
    <span className={`inline-flex items-center gap-1 px-1 py-0.5 rounded ${bg} ${text} text-[12px] leading-4`}>
      <Arrow size={10} color={arrowColor} />
      {value}
    </span>
  )
}

interface KPICardProps {
  label: string
  value: string
  variance: string
  varianceType: VarianceType
}

export default function KPICard({ label, value, variance, varianceType }: KPICardProps) {
  return (
    <div className="flex-1 bg-white border border-[#e5e5e5] rounded-xl p-4 min-w-0">
      <p className="text-[14px] text-[#525252] leading-5 tracking-[-0.15px] mb-2">{label}</p>
      <div className="flex items-center gap-4">
        <span className="text-[24px] font-bold text-[#262626] leading-8 tracking-[0.36px] font-display">
          {value}
        </span>
        <div className="flex items-center gap-2">
          <VarianceBadge value={variance} type={varianceType} />
          <span className="text-[14px] text-[#525252] leading-5 tracking-[-0.15px] whitespace-nowrap">
            vs last period
          </span>
        </div>
      </div>
    </div>
  )
}
