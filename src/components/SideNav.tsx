import { useState } from 'react'
import type { Page } from '../App'
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

interface ChildItem {
  label: string
  page: Page | null
}

interface NavItem {
  id: string
  label: string
  icon: React.ComponentType<{ size?: number; color?: string }>
  page?: Page
  children?: ChildItem[]
}

const navItems: NavItem[] = [
  {
    id: 'insights',
    label: 'Insights',
    icon: InsightsIcon,
    children: [
      { label: 'Overview',          page: 'overview' },
      { label: 'Sales',             page: 'sales' },
      { label: 'Labour',            page: 'labour' },
      { label: 'Inventory',         page: 'inventory' },
      { label: 'Customer Reviews',  page: 'customer-reviews' },
      { label: 'P&L',               page: 'pl' },
      { label: 'Budget',            page: 'budget' },
    ],
  },
  { id: 'schedule',  label: 'Schedule & Workforce', icon: UsersIcon, page: 'schedule' },
  { id: 'counts',    label: 'Counts & Waste',        icon: CountsWasteIcon },
  { id: 'purchases', label: 'Purchases',             icon: PurchasesIcon, page: 'purchases' },
  { id: 'transfers', label: 'Transfers',             icon: TransfersIcon },
  { id: 'inventory-setup', label: 'Inventory setup', icon: InventorySetupIcon },
  { id: 'chat',      label: 'Chat',                  icon: ChatIcon },
]

// Pages that are fully implemented and navigable
const LIVE_PAGES = new Set<Page>(['sales', 'customer-reviews', 'schedule', 'purchases'])

interface SideNavProps {
  currentPage: Page
  onNavigate: (page: Page) => void
}

export default function SideNav({ currentPage, onNavigate }: SideNavProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>(['insights'])

  const toggle = (id: string) => {
    setExpandedSections((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
    )
  }

  return (
    <div className="flex flex-col w-[210px] shrink-0 h-full bg-white border-r border-[#e5e5e5]">
      {/* Brand + Controls */}
      <div className="px-3 pt-[10px] pb-3 flex flex-col gap-2 border-b border-[#e5e5e5]">
        <div className="flex items-center gap-1">
          <div className="flex flex-1 items-center gap-2 px-2 py-[6px] rounded-lg hover:bg-[#f5f5f5] cursor-pointer min-w-0">
            <div className="flex items-center justify-center w-8 h-8 rounded-[6px] bg-[#262626] shrink-0">
              <span className="text-white text-[10px] font-bold tracking-tight leading-none">ME</span>
            </div>
            <span className="text-[12px] text-[#262626] flex-1 min-w-0 truncate">Mad Egg</span>
            <CaretUpDown color="#a3a3a3" />
          </div>
          <button className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-[#f5f5f5] shrink-0">
            <CollapseLeft color="#a3a3a3" />
          </button>
        </div>

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

          // Parent is "live" if it navigates to an implemented page,
          // or if it has at least one implemented child
          const parentIsLive =
            (item.page && LIVE_PAGES.has(item.page)) ||
            item.children?.some(c => c.page && LIVE_PAGES.has(c.page)) ||
            false

          const parentColor = parentIsLive ? '#262626' : '#c0c0c0'
          const chevronColor = parentIsLive ? '#a3a3a3' : '#d4d4d4'
          const canClick = !!(item.page && LIVE_PAGES.has(item.page)) || !!item.children

          return (
            <div key={item.id}>
              <button
                onClick={() => {
                  if (item.page && LIVE_PAGES.has(item.page)) { onNavigate(item.page); return }
                  if (item.children) toggle(item.id)
                }}
                className={`flex items-center gap-2 w-full p-2 rounded text-left ${
                  canClick ? 'hover:bg-[#f5f5f5]' : 'cursor-default'
                } ${currentPage === item.page ? 'bg-[#f5f5f5]' : ''}`}
              >
                <Icon color={parentIsLive ? '#525252' : '#d4d4d4'} />
                <span
                  className="flex-1 text-[12px] leading-4 tracking-[-0.3px]"
                  style={{ color: parentColor }}
                >
                  {item.label}
                </span>
                {item.children
                  ? isExpanded ? <ChevronUp color={chevronColor} /> : <ChevronDown color={chevronColor} />
                  : null}
              </button>

              {item.children && isExpanded && (
                <div>
                  {item.children.map((child) => {
                    const isActive = child.page === currentPage
                    const childIsLive = !!(child.page && LIVE_PAGES.has(child.page))
                    return (
                      <button
                        key={child.label}
                        onClick={() => childIsLive && child.page && onNavigate(child.page)}
                        className={`flex items-center w-full pl-8 pr-2 py-2 rounded text-left text-[12px] leading-4 transition-colors ${
                          isActive
                            ? 'bg-[#f5f5f5] font-medium'
                            : childIsLive
                              ? 'hover:bg-[#fafafa] cursor-pointer'
                              : 'cursor-default'
                        }`}
                        style={{ color: isActive ? '#262626' : childIsLive ? '#525252' : '#c0c0c0' }}
                      >
                        {child.label}
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
