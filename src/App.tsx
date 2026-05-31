import { useState } from 'react'
import SideNav from './components/SideNav'
import TopBar from './components/TopBar'
import CustomerReviewsPage from './pages/CustomerReviewsPage'
import AskNoryPanel from './components/AskNoryPanel'

export default function App() {
  const [isAskNoryOpen, setIsAskNoryOpen] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      {/* Sidebar */}
      <SideNav />

      {/* Main content */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <TopBar onAskNory={() => setIsAskNoryOpen(true)} />
        <CustomerReviewsPage />
      </div>

      {/* Ask Nory AI panel */}
      <AskNoryPanel isOpen={isAskNoryOpen} onClose={() => setIsAskNoryOpen(false)} />
    </div>
  )
}
