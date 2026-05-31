import { useState } from 'react'
import SideNav from './components/SideNav'
import TopBar from './components/TopBar'
import CustomerReviewsPage from './pages/CustomerReviewsPage'
import SalesPage from './pages/SalesPage'
import SchedulePage from './pages/SchedulePage'
import PurchasesPage from './pages/PurchasesPage'
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

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('purchases')
  const [isAskNoryOpen, setIsAskNoryOpen] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <SideNav currentPage={currentPage} onNavigate={setCurrentPage} />

      {/* Schedule has its own full layout (custom top bar + AI panel) */}
      {currentPage === 'schedule' ? (
        <SchedulePage onNavigate={setCurrentPage} />
      ) : (
        <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
          <TopBar page={currentPage} onAskNory={() => setIsAskNoryOpen(true)} />

          {currentPage === 'sales'            && <SalesPage />}
          {currentPage === 'customer-reviews' && <CustomerReviewsPage />}
          {currentPage === 'purchases'        && <PurchasesPage />}
          {(currentPage === 'overview' ||
            currentPage === 'labour'   ||
            currentPage === 'inventory'||
            currentPage === 'pl'       ||
            currentPage === 'budget')  && (
            <div className="flex-1 flex items-center justify-center text-[14px] text-[#a3a3a3]">
              {currentPage.charAt(0).toUpperCase() + currentPage.slice(1)} page coming soon
            </div>
          )}

          <AskNoryPanel isOpen={isAskNoryOpen} onClose={() => setIsAskNoryOpen(false)} />
        </div>
      )}
    </div>
  )
}
