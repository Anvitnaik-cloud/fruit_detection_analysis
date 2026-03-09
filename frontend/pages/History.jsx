import { useState, useMemo } from 'react'
import { Search, Download, ChevronLeft, ChevronRight, Apple, FileText, BarChart3, Trash2, ScanLine } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import './History.css'

const ITEMS_PER_PAGE = 6

function getConfidenceStatus(confidence) {
  const pct = confidence * 100
  if (pct >= 85) return 'Excellent'
  if (pct >= 70) return 'Good'
  if (pct >= 50) return 'Fair'
  return 'Low'
}

function getStatusBadge(status) {
  const map = {
    Excellent: 'badge-success',
    Good: 'badge-success',
    Fair: 'badge-warning',
    Low: 'badge-danger',
  }
  return map[status] || 'badge-warning'
}

function formatDate(iso) {
  const d = new Date(iso)
  return {
    date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    time: d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
  }
}

function useHistory() {
  const [rev, setRev] = useState(0)
  const scans = useMemo(() => {
    // rev dependency forces re-read after clear
    void rev
    try {
      return JSON.parse(localStorage.getItem('aura_scan_history') || '[]')
    } catch {
      return []
    }
  }, [rev])

  const clearHistory = () => {
    localStorage.removeItem('aura_scan_history')
    setRev(r => r + 1)
  }

  return { scans, clearHistory, refresh: () => setRev(r => r + 1) }
}

function History() {
  const navigate = useNavigate()
  const { scans, clearHistory } = useHistory()
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  // Filter scans by search query
  const filtered = useMemo(() => {
    if (!search.trim()) return scans
    const q = search.toLowerCase()
    return scans.filter(s => s.fruit.toLowerCase().includes(q) || s.id.toLowerCase().includes(q))
  }, [scans, search])

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE))
  const safePage = Math.min(page, totalPages)
  const startIdx = (safePage - 1) * ITEMS_PER_PAGE
  const pageItems = filtered.slice(startIdx, startIdx + ITEMS_PER_PAGE)

  // Stats
  const totalScans = scans.length
  const todayStr = new Date().toDateString()
  const todayScans = scans.filter(s => new Date(s.date).toDateString() === todayStr)
  const avgConfidence = todayScans.length > 0
    ? (todayScans.reduce((sum, s) => sum + (s.confidence || 0), 0) / todayScans.length * 100).toFixed(1)
    : '—'

  // Page number buttons
  const pageButtons = useMemo(() => {
    const pages = []
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      pages.push(1)
      if (safePage > 3) pages.push('...')
      const start = Math.max(2, safePage - 1)
      const end = Math.min(totalPages - 1, safePage + 1)
      for (let i = start; i <= end; i++) pages.push(i)
      if (safePage < totalPages - 2) pages.push('...')
      pages.push(totalPages)
    }
    return pages
  }, [totalPages, safePage])

  // CSV export
  const handleExport = () => {
    if (scans.length === 0) return
    const header = 'Scan ID,Fruit,Confidence,Status,Calories,Date\n'
    const rows = scans.map(s => {
      const { date } = formatDate(s.date)
      const status = getConfidenceStatus(s.confidence)
      return `${s.id},${s.fruit},${(s.confidence * 100).toFixed(1)}%,${status},${s.calories ?? 'N/A'},${date}`
    }).join('\n')
    const blob = new Blob([header + rows], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'aura-scan-history.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="history" id="history-page">
      <div className="history-header">
        <div>
          <h1 className="history-title">Scan History & Reports</h1>
          <p className="history-subtitle">Review and manage your fruit quality assessment data.</p>
        </div>
        <div className="history-actions">
          {scans.length > 0 && (
            <button className="btn-secondary" onClick={clearHistory}>
              <Trash2 size={16} />
              Clear All
            </button>
          )}
          <button className="btn-secondary" id="history-export" onClick={handleExport} disabled={scans.length === 0}>
            <Download size={16} />
            Export
          </button>
        </div>
      </div>

      {/* ─── Stats Cards ─── */}
      <div className="stats-grid">
        <div className="glass-card stat-card" id="stat-total">
          <div className="stat-icon">
            <Apple size={22} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{totalScans.toLocaleString()}</span>
            <span className="stat-label">Total Fruits Scanned</span>
          </div>
        </div>

        <div className="glass-card stat-card" id="stat-freshness">
          <div className="stat-icon freshness">
            <BarChart3 size={22} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{avgConfidence}{avgConfidence !== '—' ? '%' : ''}</span>
            <span className="stat-label">Avg Confidence Today</span>
          </div>
        </div>

        <div className="glass-card stat-card" id="stat-reports">
          <div className="stat-icon reports">
            <FileText size={22} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{todayScans.length}</span>
            <span className="stat-label">Scans Today</span>
          </div>
        </div>
      </div>

      {scans.length === 0 ? (
        /* ─── Empty state ─── */
        <div className="glass-card empty-history">
          <ScanLine size={40} />
          <h3>No scans yet</h3>
          <p>Head to the Scanner page and upload a fruit image to get started.</p>
          <button className="btn-primary" onClick={() => navigate('/scanner')}>
            Open Scanner
          </button>
        </div>
      ) : (
        <>
          {/* ─── Table Toolbar ─── */}
          <div className="table-toolbar" id="table-toolbar">
            <div className="search-box">
              <Search size={16} />
              <input
                type="text"
                placeholder="Search by fruit name or scan ID..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1) }}
                id="search-input"
              />
            </div>
          </div>

          {/* ─── Data Table ─── */}
          <div className="table-wrap" id="scan-table">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Scan ID</th>
                  <th>Fruit</th>
                  <th>Confidence</th>
                  <th>Status</th>
                  <th>Calories</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {pageItems.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="no-results-cell">No scans match your search.</td>
                  </tr>
                ) : (
                  pageItems.map((row) => {
                    const { date, time } = formatDate(row.date)
                    const status = getConfidenceStatus(row.confidence)
                    const pct = (row.confidence * 100).toFixed(1)
                    return (
                      <tr key={row.id}>
                        <td>
                          <span className="scan-id">#{row.id}</span>
                        </td>
                        <td>
                          <span className="fruit-cell-name">{row.fruit}</span>
                        </td>
                        <td>
                          <div className="freshness-cell">
                            <div className="freshness-mini-bar">
                              <div
                                className="freshness-mini-fill"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                            <span>{pct}%</span>
                          </div>
                        </td>
                        <td>
                          <span className={`badge ${getStatusBadge(status)}`}>
                            {status}
                          </span>
                        </td>
                        <td>{row.calories != null ? `${row.calories} kcal` : '—'}</td>
                        <td>
                          <div className="date-cell">
                            <span>{date}</span>
                            <span className="date-time">{time}</span>
                          </div>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* ─── Pagination ─── */}
          {filtered.length > ITEMS_PER_PAGE && (
            <div className="pagination" id="pagination">
              <span className="pagination-info">
                Showing {startIdx + 1} to {Math.min(startIdx + ITEMS_PER_PAGE, filtered.length)} of {filtered.length} scans
              </span>
              <div className="pagination-controls">
                <button
                  className="page-btn"
                  disabled={safePage === 1}
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                >
                  <ChevronLeft size={16} />
                </button>

                {pageButtons.map((p, i) =>
                  p === '...' ? (
                    <span key={`dots-${i}`} className="page-dots">...</span>
                  ) : (
                    <button
                      key={p}
                      className={`page-btn ${p === safePage ? 'active' : ''}`}
                      onClick={() => setPage(p)}
                    >
                      {p}
                    </button>
                  )
                )}

                <button
                  className="page-btn"
                  disabled={safePage === totalPages}
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default History
