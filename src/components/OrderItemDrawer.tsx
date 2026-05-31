import { XIcon, ChevronUp, ChevronDown, DotsIcon } from './icons'

// ─── Types ────────────────────────────────────────────────────────────────────

interface StockBarSplit {
  type: 'split'
  stockQty: string
  orderedQty: string
  unit: string
}

interface StockBarFull {
  type: 'full'
  qty: string
  unit: string
}

interface StockBarLow {
  type: 'low'
  qty: string
  unit: string
}

type StockBar = StockBarSplit | StockBarFull | StockBarLow

interface StockDay {
  label: string
  deliveryDay?: number
  bar: StockBar
  used: string
  iconColor: 'green' | 'orange'
}

interface MenuItem {
  name: string
  usage: string
  pct: string
  barPct: number   // 0-100
}

export interface DrawerItem {
  id: string
  name: string
  supplier: string
  location: string
  deliveryDate: string
  stockDays: StockDay[]
  menuItems: MenuItem[]
}

// ─── Static item data ─────────────────────────────────────────────────────────

export const DRAWER_ITEMS: Record<string, DrawerItem> = {
  beef: {
    id: 'beef',
    name: 'Beef brisket',
    supplier: 'Bidfood',
    location: 'City Centre',
    deliveryDate: 'Wed 21 September',
    stockDays: [
      {
        label: 'Wednesday',
        deliveryDay: 1,
        bar: { type: 'split', stockQty: '2', orderedQty: '15', unit: 'kg' },
        used: '5.3 kg used',
        iconColor: 'green',
      },
      {
        label: 'Thursday',
        bar: { type: 'full', qty: '12.4', unit: 'kg' },
        used: '5.3 kg used',
        iconColor: 'green',
      },
      {
        label: 'Friday',
        deliveryDay: 2,
        bar: { type: 'low', qty: '2', unit: 'kg' },
        used: '5.1 kg used',
        iconColor: 'orange',
      },
    ],
    menuItems: [
      { name: 'Tenders With 2 Dips',  usage: '123 ea', pct: '12.95%', barPct: 100 },
      { name: 'The GOAT',             usage: '123 ea', pct: '12.91%', barPct: 99  },
      { name: 'Wild Thing',           usage: '123 ea', pct: '7.83%',  barPct: 60  },
      { name: 'Nashville Hot Chick',  usage: '123 ea', pct: '5.91%',  barPct: 46  },
      { name: 'total',                usage: '123 ea', pct: '3,76',   barPct: 29  },
    ],
  },
  chicken: {
    id: 'chicken',
    name: 'Chicken breast',
    supplier: 'Bidfood',
    location: 'City Centre',
    deliveryDate: 'Wed 21 September',
    stockDays: [
      {
        label: 'Wednesday',
        deliveryDay: 1,
        bar: { type: 'split', stockQty: '120', orderedQty: '950', unit: 'ea' },
        used: '380 ea used',
        iconColor: 'green',
      },
      {
        label: 'Thursday',
        bar: { type: 'full', qty: '690', unit: 'ea' },
        used: '380 ea used',
        iconColor: 'green',
      },
      {
        label: 'Friday',
        deliveryDay: 2,
        bar: { type: 'low', qty: '180', unit: 'ea' },
        used: '330 ea used',
        iconColor: 'orange',
      },
    ],
    menuItems: [
      { name: 'Nashville Hot Chick',  usage: '380 ea', pct: '40.21%', barPct: 100 },
      { name: 'The GOAT',             usage: '280 ea', pct: '29.63%', barPct: 74  },
      { name: 'Wild Thing',           usage: '160 ea', pct: '16.93%', barPct: 42  },
      { name: 'Tenders With 2 Dips',  usage: '100 ea', pct: '10.58%', barPct: 26  },
      { name: 'total',                usage: '920 ea', pct: '97.35%', barPct: 97  },
    ],
  },
}

// ─── Icons ────────────────────────────────────────────────────────────────────

const ShopIcon = ({ color = '#262626' }: { color?: string }) => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
    <path d="M1 1h2.5L5 7h5l1.5-4H3.5" stroke={color} strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="5.5" cy="10" r="0.8" fill={color}/>
    <circle cx="9.5" cy="10" r="0.8" fill={color}/>
  </svg>
)

const CartSmIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
    <path d="M1 1h1.5l2 6h5l1.5-4.5H3" stroke="#262626" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="5" cy="10" r="0.8" fill="#262626"/>
    <circle cx="9" cy="10" r="0.8" fill="#262626"/>
  </svg>
)

// ─── Stock bar ────────────────────────────────────────────────────────────────

function StockBarRow({ day }: { day: StockDay }) {
  const iconColor = day.iconColor === 'green' ? '#4ade82' : '#fb923c'

  return (
    <>
      <p className="text-[14px] text-[#525252] leading-4">
        {day.label}
        {day.deliveryDay && (
          <span className="text-[#525252]"> (Delivery day #{day.deliveryDay})</span>
        )}
      </p>
      <div className="flex items-center gap-1 w-full">
        {/* Shop icon */}
        <div className="shrink-0">
          <ShopIcon color={iconColor} />
        </div>

        {/* Bar container */}
        <div className="flex-1 flex items-center justify-between bg-[#f5f5f5] rounded-lg pr-1.5">
          {day.bar.type === 'split' && (
            <div className="flex items-center gap-px">
              {/* Stock segment — green solid */}
              <div className="h-6 bg-[#4ade82] rounded-l-lg flex items-center px-1.5 shrink-0 w-[53px]">
                <span className="text-[13px] text-[#262626] whitespace-nowrap">
                  {day.bar.stockQty} {day.bar.unit}
                </span>
              </div>
              {/* Ordered segment — light green with cart icon */}
              <div className="h-6 bg-[#bbf7d2] border-l border-[#f5f5f5] rounded-r-lg flex items-center justify-end px-1.5 w-[217px]">
                <div className="flex items-center gap-1">
                  <CartSmIcon />
                  <span className="text-[13px] text-[#262626] whitespace-nowrap">
                    {day.bar.orderedQty} {day.bar.unit}
                  </span>
                </div>
              </div>
            </div>
          )}
          {day.bar.type === 'full' && (
            <div className="h-6 bg-[#4ade82] rounded-lg flex items-center px-1.5 w-[238px]">
              <span className="text-[13px] text-[#262626] whitespace-nowrap">
                {day.bar.qty} {day.bar.unit}
              </span>
            </div>
          )}
          {day.bar.type === 'low' && (
            <div className="h-6 bg-[#fb923c] rounded-lg flex items-center px-1.5 w-[54px]">
              <span className="text-[13px] text-[#262626] whitespace-nowrap">
                {day.bar.qty}{day.bar.unit}
              </span>
            </div>
          )}
          <span className="text-[13px] text-[#262626] whitespace-nowrap shrink-0 pl-1">
            {day.used}
          </span>
        </div>
      </div>
    </>
  )
}

// ─── Main drawer ──────────────────────────────────────────────────────────────

interface OrderItemDrawerProps {
  item: DrawerItem
  itemIndex: number
  totalItems: number
  onClose: () => void
  onPrev: () => void
  onNext: () => void
}

export default function OrderItemDrawer({
  item, itemIndex, totalItems, onClose, onPrev, onNext,
}: OrderItemDrawerProps) {
  return (
    <div
      className="ask-nory-panel fixed right-0 top-0 h-full w-[463px] bg-white border-l border-[#e5e5e5] flex flex-col z-50 shadow-[0_2px_16px_-8px_rgba(47,62,77,0.24)]"
    >
      {/* Drawer header */}
      <div className="flex items-center justify-between px-4 py-[10px] border-b border-[#e5e5e5] shrink-0 h-[52px]">
        <div className="flex items-center gap-2">
          {/* Close */}
          <button
            onClick={onClose}
            className="w-8 h-8 border border-[#e5e5e5] rounded-lg flex items-center justify-center bg-white hover:bg-[#fafafa] shadow-[0_1px_2px_rgba(47,62,77,0.04)]"
          >
            <XIcon size={14} color="#525252" />
          </button>
          {/* Prev / Next navigation */}
          <div className="flex items-center">
            <button
              onClick={onPrev}
              disabled={itemIndex === 0}
              className="w-8 h-8 border border-[#e5e5e5] rounded-l-lg flex items-center justify-center bg-white hover:bg-[#fafafa] shadow-[0_1px_2px_rgba(47,62,77,0.04)] disabled:opacity-40"
            >
              <ChevronUp size={14} color="#525252" />
            </button>
            <button
              onClick={onNext}
              disabled={itemIndex === totalItems - 1}
              className="w-8 h-8 border border-[#e5e5e5] rounded-r-lg border-l-0 flex items-center justify-center bg-white hover:bg-[#fafafa] shadow-[0_1px_2px_rgba(47,62,77,0.04)] disabled:opacity-40"
            >
              <ChevronDown size={14} color="#525252" />
            </button>
          </div>
        </div>
        <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#f5f5f5]">
          <DotsIcon size={14} color="#525252" />
        </button>
      </div>

      {/* Item header */}
      <div className="flex flex-col gap-2 px-4 py-4 shrink-0">
        <h2 className="text-[20px] text-[#262626] font-display leading-none">{item.name}</h2>
        <div className="flex items-center gap-1 text-[14px] text-[#525252] leading-5 tracking-[-0.15px]">
          <span>{item.supplier}</span>
          <span>•</span>
          <span>{item.location}</span>
          <span>•</span>
          <span>{item.deliveryDate}</span>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-4 pb-4 flex flex-col gap-4">
        {/* Stock prediction card */}
        <div className="flex flex-col">
          {/* Tab header */}
          <div className="border border-[#e5e5e5] rounded-t-xl px-2">
            <div className="flex items-center py-4">
              <span className="text-[14px] text-[#262626] tracking-[-0.15px] leading-5">
                Predicted stock and usage until next delivery
              </span>
            </div>
          </div>
          {/* Day tiles */}
          <div className="border border-t-0 border-[#e5e5e5] rounded-b-xl p-4 flex flex-col gap-2">
            {item.stockDays.map((day, i) => (
              <StockBarRow key={i} day={day} />
            ))}
          </div>
        </div>

        {/* Menu item sales table */}
        <div className="bg-white border border-[#e5e5e5] rounded-xl overflow-hidden">
          {/* Table header */}
          <div className="border-b border-[#e5e5e5] px-2 py-4">
            <span className="text-[14px] text-[#262626] tracking-[-0.15px] leading-5">
              Predicted menu item sales until next delivery
            </span>
          </div>

          {/* Columns */}
          <div className="flex">
            {/* Product Name col */}
            <div className="flex-1 min-w-0 border-r border-[#e5e5e5]">
              <div className="px-3 py-3 border-b border-[#e5e5e5]">
                <span className="text-[14px] text-[#525252] leading-5">Product Name</span>
              </div>
              {item.menuItems.map((mi, i) => (
                <div
                  key={i}
                  className="px-3 py-3 border-b border-[#e5e5e5] last:border-b-0"
                >
                  <span className="text-[14px] text-[#262626] leading-5 tracking-[-0.15px]">{mi.name}</span>
                </div>
              ))}
            </div>

            {/* Usage col */}
            <div className="w-[84px] shrink-0 border-r border-[#e5e5e5]">
              <div className="px-3 py-3 border-b border-[#e5e5e5]">
                <span className="text-[14px] text-[#525252] leading-5">Usage</span>
              </div>
              {item.menuItems.map((mi, i) => (
                <div
                  key={i}
                  className="px-3 py-3 border-b border-[#e5e5e5] last:border-b-0"
                >
                  <span className="text-[14px] text-[#262626] leading-5 tracking-[-0.15px]">{mi.usage}</span>
                </div>
              ))}
            </div>

            {/* % of usage col */}
            <div className="flex-1 min-w-0">
              <div className="px-3 py-3 border-b border-[#e5e5e5] text-right">
                <span className="text-[14px] text-[#525252] leading-5">% of usage</span>
              </div>
              {item.menuItems.map((mi, i) => (
                <div
                  key={i}
                  className="flex items-center gap-1 px-1.5 py-3 border-b border-[#e5e5e5] last:border-b-0"
                >
                  <div className="flex-1 h-4 flex items-center">
                    <div
                      className="h-4 bg-[#ddd6fe] rounded"
                      style={{ width: `${mi.barPct}%` }}
                    />
                  </div>
                  <span className="text-[14px] text-[#262626] text-right w-[54px] shrink-0 tracking-[-0.15px]">
                    {mi.pct}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
