import { Routes, Route, useLocation } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import Dashboard from './pages/Dashboard'
import History from './pages/History'
import Scanner from './pages/Scanner'
import Sidebar from './components/Sidebar'
import './App.css'

function App() {
  const location = useLocation()
  const isAppRoute = ['/dashboard', '/history', '/scanner'].some(r => location.pathname.startsWith(r))

  if (isAppRoute) {
    return (
      <div className="app-layout">
        <Sidebar />
        <main className="app-main">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/history" element={<History />} />
            <Route path="/scanner" element={<Scanner />} />
          </Routes>
        </main>
      </div>
    )
  }

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
    </Routes>
  )
}

export default App
