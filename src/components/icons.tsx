// Shared SVG icon components matching the Nory design system

export const ChevronDown = ({ size = 16, color = '#262626' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <path d="M4 6.5L8 10.5L12 6.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const ChevronUp = ({ size = 16, color = '#262626' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <path d="M4 9.5L8 5.5L12 9.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const ChevronLeft = ({ size = 16, color = '#262626' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <path d="M9.5 4L5.5 8L9.5 12" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const ChevronRight = ({ size = 16, color = '#262626' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <path d="M6.5 4L10.5 8L6.5 12" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const CaretUpDown = ({ size = 16, color = '#262626' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <path d="M5.5 6.5L8 4L10.5 6.5M5.5 9.5L8 12L10.5 9.5" stroke={color} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const CollapseLeft = ({ size = 16, color = '#262626' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <path d="M9 4L5 8L9 12M13 4L9 8L13 12" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const ShopIcon = ({ size = 16, color = '#262626' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <path d="M2 6.5h12M2 6.5l1.5-3h9L14 6.5M2 6.5v6a.5.5 0 0 0 .5.5h11a.5.5 0 0 0 .5-.5v-6M6 13V9.5a2 2 0 0 1 4 0V13" stroke={color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const InsightsIcon = ({ size = 16, color = '#262626' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <rect x="2" y="2" width="12" height="9" rx="1" stroke={color} strokeWidth="1.2" />
    <path d="M5 14h6M8 11v3" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
    <path d="M5 8.5V7M8 8.5V5.5M11 8.5V6.5" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
  </svg>
)

export const UsersIcon = ({ size = 16, color = '#262626' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <circle cx="6" cy="5.5" r="2.5" stroke={color} strokeWidth="1.2" />
    <path d="M1 14c0-2.761 2.239-5 5-5s5 2.239 5 5" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
    <path d="M11 7.5a2 2 0 1 0 0-4M15 14c0-2.209-1.791-4-4-4" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
  </svg>
)

export const CountsWasteIcon = ({ size = 16, color = '#262626' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <path d="M3 3h4v4H3zM9 3h4v4H9zM3 9h4v4H3zM9 9h4v4H9z" stroke={color} strokeWidth="1.2" strokeLinejoin="round" />
  </svg>
)

export const PurchasesIcon = ({ size = 16, color = '#262626' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <path d="M13.5 5.5l-1.5-3h-8l-1.5 3v7a1 1 0 0 0 1 1h9a1 1 0 0 0 1-1v-7z" stroke={color} strokeWidth="1.2" strokeLinejoin="round" />
    <path d="M2.5 5.5h11M6 5.5v1.5a2 2 0 0 0 4 0V5.5" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
  </svg>
)

export const TransfersIcon = ({ size = 16, color = '#262626' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <path d="M2 5.5h12M11 2.5l3 3-3 3M14 10.5H2M5 7.5l-3 3 3 3" stroke={color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const InventorySetupIcon = ({ size = 16, color = '#262626' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <rect x="3" y="2" width="10" height="12" rx="1" stroke={color} strokeWidth="1.2" />
    <path d="M5.5 5.5h5M5.5 8h5M5.5 10.5h3" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
  </svg>
)

export const ChatIcon = ({ size = 16, color = '#262626' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <path d="M14 8c0 3.314-2.686 6-6 6a5.97 5.97 0 0 1-2.887-.738L2 14l.738-3.113A5.97 5.97 0 0 1 2 8c0-3.314 2.686-6 6-6s6 2.686 6 6z" stroke={color} strokeWidth="1.2" strokeLinejoin="round" />
  </svg>
)

export const CalendarIcon = ({ size = 16, color = '#262626' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <rect x="2" y="3" width="12" height="11" rx="1" stroke={color} strokeWidth="1.2" />
    <path d="M2 7h12M5.5 2v2M10.5 2v2" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
  </svg>
)

export const FilterIcon = ({ size = 16, color = '#262626' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <path d="M2.5 4.5h11M4.5 8h7M6.5 11.5h3" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

export const NorySparkle = ({ size = 16, color = '#735cf6' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <path d="M8 1.5L9 6H13.5L10 8.5L11 13L8 10.5L5 13L6 8.5L2.5 6H7L8 1.5Z" fill={color} />
    <path d="M13 1L13.5 3H15L13.75 4L14.5 6L13 5L11.5 6L12.25 4L11 3H12.5L13 1Z" fill={color} opacity="0.6" />
  </svg>
)

export const StarFilled = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <path
      d="M8 2L9.6 6H14L10.5 8.5L11.8 13L8 10.5L4.2 13L5.5 8.5L2 6H6.4L8 2Z"
      fill="#F97316"
    />
  </svg>
)

export const StarEmpty = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <path
      d="M8 2L9.6 6H14L10.5 8.5L11.8 13L8 10.5L4.2 13L5.5 8.5L2 6H6.4L8 2Z"
      stroke="#D4D4D4"
      strokeWidth="1.2"
    />
  </svg>
)

export const DotsIcon = ({ size = 16, color = '#a3a3a3' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <circle cx="4" cy="8" r="1.5" fill={color} />
    <circle cx="8" cy="8" r="1.5" fill={color} />
    <circle cx="12" cy="8" r="1.5" fill={color} />
  </svg>
)

export const PencilIcon = ({ size = 16, color = '#262626' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <path d="M11.5 2.5a1.414 1.414 0 0 1 2 2l-8 8L2 14l1.5-3.5 8-8z" stroke={color} strokeWidth="1.2" strokeLinejoin="round" />
  </svg>
)

export const ArrowRight = ({ size = 16, color = '#262626' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <path d="M3 8h10M9 4l4 4-4 4" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const AiEditIcon = ({ size = 16, color = '#262626' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <path d="M8 2.5L9 5.5H12L9.5 7.5L10.5 10.5L8 8.5L5.5 10.5L6.5 7.5L4 5.5H7L8 2.5Z" fill={color} />
    <path d="M12 8l2.5 2.5-4 4-2.5-1 1-2.5L12 8z" stroke={color} strokeWidth="1" strokeLinejoin="round" />
  </svg>
)

export const StarIcon = ({ size = 16, color = '#262626' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <path
      d="M8 2L9.6 6H14L10.5 8.5L11.8 13L8 10.5L4.2 13L5.5 8.5L2 6H6.4L8 2Z"
      stroke={color}
      strokeWidth="1.2"
    />
  </svg>
)

export const XIcon = ({ size = 16, color = '#262626' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <path d="M4 4l8 8M12 4l-8 8" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

export const SearchIcon = ({ size = 16, color = '#a3a3a3' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <circle cx="7" cy="7" r="4.5" stroke={color} strokeWidth="1.2" />
    <path d="M10.5 10.5L13.5 13.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

export const ArrowUpRight = ({ size = 12, color = '#16a34c' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 12 12" fill="none">
    <path d="M3 9L9 3M9 3H4M9 3V8" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const ArrowDownRight = ({ size = 12, color = '#ea580c' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 12 12" fill="none">
    <path d="M3 3L9 9M9 9H4M9 9V4" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const ArrowDownLeft = ({ size = 12, color = '#b91c1c' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 12 12" fill="none">
    <path d="M9 3L3 9M3 9H8M3 9V4" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)
