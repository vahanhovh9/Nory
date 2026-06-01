import { useState } from 'react'
import SideNav from './components/SideNav'
import TopBar from './components/TopBar'
import CustomerReviewsPage from './pages/CustomerReviewsPage'
import SalesPage from './pages/SalesPage'
import SchedulePage from './pages/SchedulePage'
import PurchasesPage from './pages/PurchasesPage'
import InventoryPage from './pages/InventoryPage'
import AskNoryPanel from './components/AskNoryPanel'

export type Page =
  | 'sales'
  | 'customer-reviews'
  | 'overview'
  | 'labour'
  | 'inventory'
  | 'pl'
  | 'budget'
  | 'schedule'
  | 'purchases'

export type Period = 'Today' | 'This week' | 'This month' | 'This quarter' | 'This year'
// State of the schedule Nory builds from the chat (shown on the Schedule page)
export type NorySchedule = 'none' | 'created' | 'pending' | 'approved'

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('sales')
  const [period, setPeriod] = useState<Period>('This week')
  const [isAskNoryOpen, setIsAskNoryOpen] = useState(false)
  const [norySchedule, setNorySchedule] = useState<NorySchedule>('none')

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <SideNav currentPage={currentPage} onNavigate={(p) => { setCurrentPage(p); setIsAskNoryOpen(false) }} />

      {/* Schedule has its own full layout (custom top bar + built-in AI panel) */}
      {currentPage === 'schedule' ? (
        <SchedulePage
          onNavigate={setCurrentPage}
          norySchedule={norySchedule}
          setNorySchedule={setNorySchedule}
        />
      ) : (
        // Vertical: full-width TopBar on top, chat opens BENEATH it (beside page content)
        <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
          <TopBar
            page={currentPage}
            period={period}
            onPeriodChange={setPeriod}
            onAskNory={() => setIsAskNoryOpen(o => !o)}
            askNoryOpen={isAskNoryOpen}
          />

          {/* Below the top bar: page content shrinks as the AI panel slides in beside it */}
          <div className="flex flex-1 min-h-0 overflow-hidden">

            {/* ── Page content ── */}
            <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
              {currentPage === 'sales'            && <SalesPage period={period} />}
              {currentPage === 'customer-reviews' && <CustomerReviewsPage />}
              {currentPage === 'purchases'        && <PurchasesPage />}
              {currentPage === 'inventory'        && <InventoryPage period={period} />}
              {(currentPage === 'overview' ||
                currentPage === 'labour'   ||
                currentPage === 'pl'       ||
                currentPage === 'budget')  && (
                <div className="flex-1 flex items-center justify-center text-[14px] text-[#a3a3a3]">
                  {currentPage.charAt(0).toUpperCase() + currentPage.slice(1)} page coming soon
                </div>
              )}
            </div>

            {/* ── AI panel — opens under the top bar, beside the page content ── */}
            <div
              className="flex-none overflow-hidden transition-all duration-300 ease-out"
              style={{ width: isAskNoryOpen ? 400 : 0 }}
            >
              <AskNoryPanel
                isOpen={isAskNoryOpen}
                onClose={() => setIsAskNoryOpen(false)}
                page={currentPage}
                onScheduleCreated={() => setNorySchedule('created')}
              />
            </div>

          </div>
        </div>
      )}
    </div>
  )
}
