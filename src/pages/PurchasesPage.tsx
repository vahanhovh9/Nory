import { useState } from 'react'
import { ChevronUp, ChevronDown, DotsIcon } from '../components/icons'

// ─── Types ────────────────────────────────────────────────────────────────────

type DayColor = 'green' | 'orange'

interface DayBadge { letter: string; color: DayColor }

interface OrderItem {
  id: string
  name: string
  description: string
  unit: string
  days: DayBadge[]
  quantity: number
  unitPrice: number
}

interface SupplierOrder {
  id: string
  supplier: string
  delivery: string
  expanded: boolean
  sent: boolean
  items?: OrderItem[]
}

interface OrderGroup {
  id: string
  title: string
  tags: string[]
  orders: SupplierOrder[]
}

// ─── Static data ──────────────────────────────────────────────────────────────

const WTFS: DayBadge[] = [
  { letter: 'W', color: 'green' },
  { letter: 'T', color: 'green' },
  { letter: 'F', color: 'green' },
  { letter: 'S', color: 'orange' },
]

const INITIAL_GROUPS: OrderGroup[] = [
  {
    id: 'today',
    title: 'Place this order today before 12:00',
    tags: ['Proteins'],
    orders: [
      {
        id: 'biofood',
        supplier: 'Biofood',
        delivery: 'Delivery: Wed 21 September',
        expanded: true,
        sent: false,
        items: [
          { id: 'beef',    name: 'Beef brisket',   description: "You'll use 15kg between Wednesday and Saturday",  unit: '1 kg',  days: WTFS, quantity: 15,  unitPrice: 28.167 },
          { id: 'chicken', name: 'Chicken breast',  description: "You'll use 950ea between Wednesday and Saturday", unit: '50 ea', days: WTFS, quantity: 950, unitPrice: 0.3494 },
        ],
      },
    ],
  },
  {
    id: 'thursday',
    title: 'Place these orders on Thursday before 12:00',
    tags: ['Category', 'Category'],
    orders: [
      { id: 'sysco-thu',     supplier: 'Sysco',     delivery: 'Delivery: Wed 21 September', expanded: false, sent: false },
      { id: 'freshways',     supplier: 'Freshways', delivery: 'Delivery: Wed 21 September', expanded: false, sent: false },
    ],
  },
  {
    id: 'weekly',
    title: 'Suppliers you order from every week',
    tags: ['Category', 'Category'],
    orders: [
      { id: 'sysco-wk1', supplier: 'Sysco', delivery: 'Delivery: Wed 21 September', expanded: false, sent: false },
      { id: 'sysco-wk2', supplier: 'Sysco', delivery: 'Delivery: Wed 21 September', expanded: false, sent: false },
    ],
  },
]

// ─── Icons ────────────────────────────────────────────────────────────────────

const CartIcon = ({ color = 'white' }: { color?: string }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M1 1h2l2 8h7l1.5-5H5" stroke={color} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="7" cy="13" r="1" fill={color}/>
    <circle cx="12" cy="13" r="1" fill={color}/>
  </svg>
)

const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M8 3v10M3 8h10" stroke="#262626" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
)

const MinusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M3 8h10" stroke="#262626" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
)

const PlusSmIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M8 4v8M4 8h8" stroke="#262626" strokeWidth="1.3" strokeLinecap="round"/>
  </svg>
)

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmt = (n: number) => `£${n.toFixed(2)}`

function totalForOrder(items: OrderItem[]): { subtotal: number; vat: number; total: number } {
  const subtotal = items.reduce((s, it) => s + it.quantity * it.unitPrice, 0)
  const vat = subtotal * 0.2
  return { subtotal, vat, total: subtotal + vat }
}

// ─── Day badge ────────────────────────────────────────────────────────────────

function DayBadgeEl({ letter, color }: DayBadge) {
  const bg = color === 'green' ? '#4ade82' : '#fb923c'
  return (
    <div
      className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
      style={{ background: bg }}
    >
      <span className="text-[13px] text-[#262626] font-normal leading-4">{letter}</span>
    </div>
  )
}

// ─── Quantity control ─────────────────────────────────────────────────────────

function QtyControl({
  value, onChange,
}: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex items-center justify-between w-[88px]">
      <button
        onClick={() => onChange(Math.max(0, value - 1))}
        className="w-6 h-6 border border-[#e5e5e5] rounded-lg flex items-center justify-center bg-white hover:bg-[#fafafa] shadow-[0_1px_2px_rgba(47,62,77,0.04)]"
      >
        <MinusIcon />
      </button>
      <span className="text-[14px] text-[#262626] text-center w-8">{value}</span>
      <button
        onClick={() => onChange(value + 1)}
        className="w-6 h-6 border border-[#e5e5e5] rounded-lg flex items-center justify-center bg-white hover:bg-[#fafafa] shadow-[0_1px_2px_rgba(47,62,77,0.04)]"
      >
        <PlusSmIcon />
      </button>
    </div>
  )
}

// ─── Supplier card (expanded) ─────────────────────────────────────────────────

function ExpandedOrderCard({
  order, onToggle, onSend, onQtyChange,
}: {
  order: SupplierOrder
  onToggle: () => void
  onSend: () => void
  onQtyChange: (itemId: string, qty: number) => void
}) {
  const items = order.items ?? []
  const { subtotal, vat, total } = totalForOrder(items)

  return (
    <div className="bg-[#f5f5f5] border border-[#e5e5e5] rounded-xl overflow-hidden">
      {/* Supplier header */}
      <div className="flex items-center gap-3.5 p-3.5">
        <div className="flex-1 flex items-center gap-2">
          {/* Logo placeholder */}
          <div className="w-10 h-10 border border-[#e5e5e5] rounded-lg bg-white flex items-center justify-center shrink-0">
            <span className="text-[10px] text-[#a3a3a3] font-medium">{order.supplier.slice(0, 2).toUpperCase()}</span>
          </div>
          <div className="flex flex-col gap-0">
            <span className="text-[14px] text-[#262626] leading-5 tracking-[-0.15px]">{order.supplier}</span>
            <div className="flex items-center gap-1">
              <span className="text-[14px] text-[#262626] leading-5 tracking-[-0.15px]">{order.delivery}</span>
              <button className="px-2 py-1 border border-[#e5e5e5] rounded-lg text-[13px] text-[#262626] bg-white hover:bg-[#fafafa] shadow-[0_1px_1px_rgba(47,62,77,0.04)] leading-4">
                Change
              </button>
            </div>
          </div>
        </div>
        <button
          onClick={onToggle}
          className="w-8 h-8 border border-[#e5e5e5] rounded-lg flex items-center justify-center bg-white hover:bg-[#fafafa] shadow-[0_1px_2px_rgba(47,62,77,0.04)]"
        >
          <ChevronUp size={14} color="#525252" />
        </button>
      </div>

      {/* Items table */}
      <div className="bg-white border border-t border-[#e5e5e5] rounded-t-xl overflow-hidden">
        {/* Table header */}
        <div className="flex border-b border-[#e5e5e5]">
          <div className="flex-1 px-3 py-3 text-[14px] text-[#525252]">Items</div>
          <div className="w-[203px] px-3 py-3 text-[14px] text-[#525252]">Days covered</div>
          <div className="w-[116px] px-3 py-3 text-[14px] text-[#525252] text-right">Qty</div>
          <div className="w-[100px] px-3 py-3 text-[14px] text-[#525252] text-right">Price</div>
        </div>

        {/* Line items */}
        {items.map((item) => (
          <div key={item.id} className="flex items-center border-b border-dashed border-[#e5e5e5]">
            {/* Item name + description */}
            <div className="flex-1 flex items-center gap-3 px-3 py-3">
              <div className="flex flex-col gap-0 flex-1 min-w-0">
                <span className="text-[14px] text-[#262626] leading-5 tracking-[-0.15px]">{item.name}</span>
                <span className="text-[12px] text-[#a3a3a3] leading-4">{item.description}</span>
              </div>
              <span className="px-1 py-0 rounded bg-[#e5e5e5] text-[10px] text-[#262626] leading-4 tracking-[0.12px] shrink-0">
                {item.unit}
              </span>
            </div>

            {/* Day badges */}
            <div className="w-[203px] flex items-center gap-1 px-3 py-3">
              {item.days.map((d, i) => <DayBadgeEl key={i} {...d} />)}
            </div>

            {/* Qty control */}
            <div className="w-[116px] flex items-end justify-end px-2 pb-4 pt-5">
              <QtyControl
                value={item.quantity}
                onChange={(v) => onQtyChange(item.id, v)}
              />
            </div>

            {/* Price */}
            <div className="w-[100px] px-3 py-5 text-[14px] text-[#262626] text-right">
              {fmt(item.quantity * item.unitPrice)}
            </div>
          </div>
        ))}

        {/* Subtotal / VAT / Total */}
        {[
          { label: 'Subtotal', value: subtotal },
          { label: 'VAT',      value: vat },
          { label: 'Total',    value: total },
        ].map((row, i) => (
          <div key={row.label} className={`flex items-center ${i === 2 ? 'border-b border-[#e5e5e5]' : ''}`}>
            <div className="flex-1 px-3 py-3 text-[14px] text-[#262626]">{row.label}</div>
            <div className="w-[110px]" />
            <div className="w-[110px] px-3 py-3 text-[14px] text-[#262626] text-right">{fmt(row.value)}</div>
          </div>
        ))}

        {/* Footer: ... + Send order */}
        <div className="flex items-center justify-between px-3 py-3 border-b border-[#e5e5e5]">
          <button className="w-8 h-8 border border-[#e5e5e5] rounded-lg flex items-center justify-center bg-white hover:bg-[#fafafa] shadow-[0_1px_2px_rgba(47,62,77,0.04)]">
            <DotsIcon size={14} color="#525252" />
          </button>
          <button
            onClick={onSend}
            className="flex items-center gap-2 px-3 py-2 border border-[#e5e5e5] rounded-lg bg-white text-[14px] text-[#262626] hover:bg-[#fafafa] shadow-[0_1px_1px_rgba(47,62,77,0.04)] transition-colors"
          >
            <CartIcon color="#262626" />
            Send order
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Collapsed supplier card ──────────────────────────────────────────────────

function CollapsedOrderCard({ order, onToggle }: { order: SupplierOrder; onToggle: () => void }) {
  return (
    <div className="bg-white border border-[#e5e5e5] rounded-xl flex items-center gap-3.5 px-3.5 py-3.5">
      <div className="w-10 h-10 border border-[#e5e5e5] rounded-lg bg-white flex items-center justify-center shrink-0">
        <span className="text-[10px] text-[#a3a3a3] font-medium">{order.supplier.slice(0, 2).toUpperCase()}</span>
      </div>
      <div className="flex flex-col gap-0 flex-1 min-w-0">
        <span className="text-[14px] text-[#262626] leading-5 tracking-[-0.15px]">{order.supplier}</span>
        <div className="flex items-center gap-1">
          <span className="text-[14px] text-[#262626] leading-5 tracking-[-0.15px]">{order.delivery}</span>
          <button className="px-2 py-1 border border-[#e5e5e5] rounded-lg text-[13px] text-[#262626] bg-white hover:bg-[#fafafa] shadow-[0_1px_1px_rgba(47,62,77,0.04)] leading-4">
            Change
          </button>
        </div>
      </div>
      <button
        onClick={onToggle}
        className="w-8 h-8 border border-[#e5e5e5] rounded-lg flex items-center justify-center bg-white hover:bg-[#fafafa] shadow-[0_1px_2px_rgba(47,62,77,0.04)]"
      >
        <ChevronDown size={14} color="#525252" />
      </button>
    </div>
  )
}

// ─── Order group ──────────────────────────────────────────────────────────────

function OrderGroupSection({
  group, onToggleOrder, onSendOrder, onQtyChange,
}: {
  group: OrderGroup
  onToggleOrder: (orderId: string) => void
  onSendOrder: (orderId: string) => void
  onQtyChange: (orderId: string, itemId: string, qty: number) => void
}) {
  return (
    <div className="flex flex-col gap-3">
      {/* Group header */}
      <div className="flex items-center justify-between">
        <h2 className="text-[20px] text-[#262626] leading-6 font-display tracking-[0.38px]">
          {group.title}
        </h2>
        <div className="flex items-center gap-1.5">
          {group.tags.map((tag, i) => (
            <span key={i} className="px-2 py-1 rounded-lg bg-white border border-[#e5e5e5] text-[12px] text-[#525252] leading-4">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Order cards */}
      <div className="flex flex-col gap-2">
        {group.orders
          .filter(o => !o.sent)
          .map(order =>
            order.expanded ? (
              <ExpandedOrderCard
                key={order.id}
                order={order}
                onToggle={() => onToggleOrder(order.id)}
                onSend={() => onSendOrder(order.id)}
                onQtyChange={(itemId, qty) => onQtyChange(order.id, itemId, qty)}
              />
            ) : (
              <CollapsedOrderCard
                key={order.id}
                order={order}
                onToggle={() => onToggleOrder(order.id)}
              />
            ),
          )}
        {group.orders.every(o => o.sent) && (
          <div className="py-4 text-center text-[14px] text-[#a3a3a3]">All orders sent ✓</div>
        )}
      </div>
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function PurchasesPage() {
  const [tab, setTab] = useState<'recommended' | 'draft'>('recommended')
  const [groups, setGroups] = useState<OrderGroup[]>(INITIAL_GROUPS)

  // Count unsent orders
  const unsentCount = groups.flatMap(g => g.orders).filter(o => !o.sent).length

  const toggleOrder = (groupId: string, orderId: string) => {
    setGroups(prev => prev.map(g =>
      g.id !== groupId ? g : {
        ...g,
        orders: g.orders.map(o => o.id !== orderId ? o : { ...o, expanded: !o.expanded }),
      },
    ))
  }

  const sendOrder = (groupId: string, orderId: string) => {
    setGroups(prev => prev.map(g =>
      g.id !== groupId ? g : {
        ...g,
        orders: g.orders.map(o => o.id !== orderId ? o : { ...o, sent: true }),
      },
    ))
  }

  const sendAll = () => {
    setGroups(prev => prev.map(g => ({
      ...g,
      orders: g.orders.map(o => ({ ...o, sent: true })),
    })))
  }

  const changeQty = (groupId: string, orderId: string, itemId: string, qty: number) => {
    setGroups(prev => prev.map(g =>
      g.id !== groupId ? g : {
        ...g,
        orders: g.orders.map(o =>
          o.id !== orderId ? o : {
            ...o,
            items: o.items?.map(it => it.id !== itemId ? it : { ...it, quantity: qty }),
          },
        ),
      },
    ))
  }

  return (
    <div className="flex-1 overflow-y-auto bg-white">
      {/* Page header */}
      <div className="flex items-center justify-between px-8 py-4 border-b border-[#e5e5e5]">
        <h1 className="text-[20px] text-[#262626] font-display leading-6 tracking-[0.38px]">
          Place orders
        </h1>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-3 py-2 border border-[#e5e5e5] rounded-lg bg-white text-[14px] text-[#262626] hover:bg-[#fafafa] shadow-[0_1px_1px_rgba(47,62,77,0.04)]">
            <PlusIcon />
            Create order
          </button>
          <button
            onClick={sendAll}
            disabled={unsentCount === 0}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#262626] text-[14px] text-white hover:bg-[#1a1a1a] transition-colors shadow-[0_1px_1px_rgba(47,62,77,0.04)] disabled:opacity-50"
          >
            <CartIcon color="white" />
            Send orders
            {unsentCount > 0 && (
              <span className="flex items-center justify-center min-w-4 h-4 px-1 rounded-[6px] bg-[#735cf6] text-[10px] text-white leading-none">
                {unsentCount}
              </span>
            )}
          </button>
          <button className="w-8 h-8 border border-[#e5e5e5] rounded-lg flex items-center justify-center bg-white hover:bg-[#fafafa] shadow-[0_1px_2px_rgba(47,62,77,0.04)]">
            <DotsIcon size={14} color="#525252" />
          </button>
        </div>
      </div>

      {/* Content area */}
      <div className="bg-[#fafafa] min-h-full px-8 pt-0 pb-8">
        <div className="max-w-[791px] mx-auto">
          {/* Intro + tabs */}
          <div className="flex items-start justify-between border-b border-[#e5e5e5] pt-8 pb-5">
            <div className="flex flex-col gap-1.5 flex-1">
              <h2 className="text-[20px] text-[#262626] font-display leading-6 tracking-[0.38px]">
                Review and send your recommended orders.
              </h2>
              <p className="text-[14px] text-[#262626] leading-5 tracking-[-0.15px] max-w-[620px]">
                We've prepared these orders based on your stock levels and upcoming demand.
              </p>
            </div>

            {/* Recommended / Draft tabs */}
            <div className="flex items-center border border-[#e5e5e5] rounded-lg overflow-hidden bg-white shrink-0 ml-4 h-8">
              {([['recommended', 'Recommended'], ['draft', 'Draft orders']] as const).map(([val, label]) => (
                <button
                  key={val}
                  onClick={() => setTab(val)}
                  className={`px-3 h-full text-[13px] transition-colors whitespace-nowrap ${
                    tab === val
                      ? 'bg-[#f5f5f5] text-[#262626] font-medium'
                      : 'text-[#525252] hover:bg-[#fafafa]'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {tab === 'recommended' ? (
            <div className="flex flex-col gap-10 pt-8">
              {groups.map(group => (
                <OrderGroupSection
                  key={group.id}
                  group={group}
                  onToggleOrder={(orderId) => toggleOrder(group.id, orderId)}
                  onSendOrder={(orderId) => sendOrder(group.id, orderId)}
                  onQtyChange={(orderId, itemId, qty) => changeQty(group.id, orderId, itemId, qty)}
                />
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center py-24 text-[14px] text-[#a3a3a3]">
              No draft orders
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
