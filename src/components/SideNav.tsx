import { useState } from 'react'
import {
  ChevronUp,
  ChevronDown,
  CaretUpDown,
  CollapseLeft,
  ShopIcon,
  InsightsIcon,
  UsersIcon,
  CountsWasteIcon,
  PurchasesIcon,
  TransfersIcon,
  InventorySetupIcon,
  ChatIcon,
} from './icons'

const navItems = [
  {
    id: 'insights',
    label: 'Insights',
    icon: InsightsIcon,
    children: ['Overview', 'Sales', 'Labour', 'Inventory', 'Customer Reviews', 'P&L', 'Budget'],
  },
  { id: 'schedule', label: 'Schedule & Workforce', icon: UsersIcon },
  { id: 'counts', label: 'Counts & Waste', icon: CountsWasteIcon },
  { id: 'purchases', label: 'Purchases', icon: PurchasesIcon },
  { id: 'transfers', label: 'Transfers', icon: TransfersIcon },
  { id: 'inventory-setup', label: 'Inventory setup', icon: InventorySetupIcon },
  { id: 'chat', label: 'Chat', icon: ChatIcon },
]

export default function SideNav() {
  const [expandedSections, setExpandedSections] = useState<string[]>(['insights'])
  const activeChild = 'Customer Reviews'

  const toggle = (id: string) => {
    setExpandedSections((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
    )
  }

  return (
    <div className="flex flex-col w-[210px] shrink-0 h-full bg-white border-r border-[#e5e5e5]">
      {/* Brand + Controls */}
      <div className="px-3 pt-[10px] pb-3 flex flex-col gap-2 border-b border-[#e5e5e5]">
        {/* Brand row */}
        <div className="flex items-center gap-1">
          <div className="flex flex-1 items-center gap-2 px-2 py-[6px] rounded-lg hover:bg-[#f5f5f5] cursor-pointer min-w-0">
            {/* Mad Egg logo – dark square */}
            <div className="flex items-center justify-center w-8 h-8 rounded-[6px] bg-[#262626] shrink-0 overflow-hidden">
              <span className="text-white text-[10px] font-bold tracking-tight leading-none">ME</span>
            </div>
            <span className="text-[12px] text-[#262626] flex-1 min-w-0 truncate">Mad Egg</span>
            <CaretUpDown color="#a3a3a3" />
          </div>
          <button className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-[#f5f5f5] shrink-0">
            <CollapseLeft color="#a3a3a3" />
          </button>
        </div>

        {/* All locations select */}
        <div className="flex items-center gap-2 h-8 px-3 py-2 rounded-lg border border-[#d4d4d4] bg-white cursor-pointer hover:bg-[#fafafa]">
          <ShopIcon color="#525252" />
          <span className="flex-1 text-[14px] text-[#262626] truncate">All locations</span>
          <CaretUpDown color="#a3a3a3" />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        {navItems.map((item) => {
          const Icon = item.icon
          const isExpanded = expandedSections.includes(item.id)
          const hasChildren = !!item.children

          return (
            <div key={item.id}>
              {/* Parent item */}
              <button
                onClick={() => hasChildren && toggle(item.id)}
                className="flex items-center gap-2 w-full p-2 rounded text-left hover:bg-[#f5f5f5] group"
              >
                <Icon color="#525252" />
                <span className="flex-1 text-[12px] text-[#262626] leading-4">{item.label}</span>
                {hasChildren ? (
                  isExpanded ? (
                    <ChevronUp color="#a3a3a3" />
                  ) : (
                    <ChevronDown color="#a3a3a3" />
                  )
                ) : (
                  <ChevronDown color="#a3a3a3" />
                )}
              </button>

              {/* Children */}
              {hasChildren && isExpanded && item.children && (
                <div>
                  {item.children.map((child) => {
                    const isActive = child === activeChild
                    return (
                      <button
                        key={child}
                        className={`flex items-center gap-2 w-full pl-8 pr-2 py-2 rounded text-left text-[12px] leading-4 ${
                          isActive
                            ? 'bg-[#f5f5f5] text-[#262626] font-medium'
                            : 'text-[#525252] hover:bg-[#fafafa]'
                        }`}
                      >
                        {child}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </nav>
    </div>
  )
}
