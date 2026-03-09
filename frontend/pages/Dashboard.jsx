import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Clock, Activity, Apple, TrendingUp, Droplets, Zap, Flame, Dumbbell, Wheat, ScanLine } from 'lucide-react'
import { BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts'
import './Dashboard.css'

function getConfidenceLabel(c) {
  const pct = c * 100
  if (pct >= 90) return { text: 'Excellent', cls: 'badge-success' }
  if (pct >= 75) return { text: 'Good', cls: 'badge-success' }
  if (pct >= 50) return { text: 'Fair', cls: 'badge-warning' }
  return { text: 'Low', cls: 'badge-danger' }
}

function Dashboard() {
  const location = useLocation()
  const navigate = useNavigate()
  const scanResult = location.state // from Scanner page

  const [confidenceAnim, setConfidenceAnim] = useState(0)
  const [scanPulse, setScanPulse] = useState(true)

  const n = scanResult?.nutrition?.per_100g
  const fruitName = scanResult?.fruit
  const confidence = scanResult?.confidence

  // Nutrition bar chart data from real scan
  const nutritionData = n
    ? [
        { name: 'Calories', value: n.calories, unit: 'kcal' },
        { name: 'Protein', value: n.protein, unit: 'g' },
        { name: 'Carbs', value: n.carbs, unit: 'g' },
        { name: 'Fiber', value: n.fiber, unit: 'g' },
        { name: 'Sugar', value: n.sugar, unit: 'g' },
        { name: 'Fat', value: n.fat, unit: 'g' },
      ]
    : []

  // Radar chart from real vitamins + minerals
  const radarData = n
    ? [
        { subject: 'Vitamin C', A: Math.min(n.vitamins?.['Vitamin C'] || 0, 100) },
        { subject: 'Fiber', A: n.fiber * 20 },
        { subject: 'Sugar', A: n.sugar * 5 },
        { subject: 'Protein', A: n.protein * 30 },
        { subject: 'Water', A: n.water },
        { subject: 'Calories', A: n.calories },
      ]
    : []

  // Mineral items
  const minerals = n?.minerals ? Object.entries(n.minerals) : []
  const vitamins = n?.vitamins ? Object.entries(n.vitamins) : []

  useEffect(() => {
    if (!confidence) return
    const timer = setTimeout(() => setConfidenceAnim(Math.round(confidence * 100)), 500)
    const pulseInterval = setInterval(() => setScanPulse(p => !p), 2000)
    return () => {
      clearTimeout(timer)
      clearInterval(pulseInterval)
    }
  }, [confidence])

  const circumference = 2 * Math.PI * 54
  const offset = circumference - (confidenceAnim / 100) * circumference
  const badge = confidence ? getConfidenceLabel(confidence) : null

  // No scan result — show empty state
  if (!scanResult) {
    return (
      <div className="dashboard" id="dashboard-page">
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">Insights Dashboard</h1>
            <p className="dashboard-subtitle">Scan a fruit to see its full analysis here</p>
          </div>
        </div>
        <div className="glass-card dashboard-empty">
          <ScanLine size={44} />
          <h3>No scan data yet</h3>
          <p>Upload and analyze a fruit image to view detailed nutritional insights, vitamin breakdown, and quality fingerprint.</p>
          <button className="btn-primary" onClick={() => navigate('/scanner')}>
            <Activity size={18} />
            Start Scanning
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="dashboard" id="dashboard-page">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Insights Dashboard</h1>
          <p className="dashboard-subtitle">Analysis results for your latest scan</p>
        </div>
        <div className="dashboard-actions">
          <button className="btn-primary" id="dashboard-new-scan" onClick={() => navigate('/scanner')}>
            <Activity size={18} />
            New Scan
          </button>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* ─── Fruit Card ─── */}
        <div className="glass-card fruit-card" id="fruit-card">
          <div className="fruit-header">
            <div className="fruit-icon-wrap">
              <Apple size={32} />
            </div>
            <div>
              <h2 className="fruit-name">{fruitName}</h2>
              <p className="fruit-species">Confidence: {(confidence * 100).toFixed(1)}%</p>
            </div>
          </div>

          <div className="fruit-meta">
            {n && (
              <>
                <div className="meta-item">
                  <Flame size={16} />
                  <div>
                    <span className="meta-label">Calories</span>
                    <span className="meta-value">{n.calories} kcal</span>
                  </div>
                </div>
                <div className="meta-item">
                  <Dumbbell size={16} />
                  <div>
                    <span className="meta-label">Protein</span>
                    <span className="meta-value">{n.protein}g</span>
                  </div>
                </div>
                <div className="meta-item">
                  <Wheat size={16} />
                  <div>
                    <span className="meta-label">Carbs</span>
                    <span className="meta-value">{n.carbs}g</span>
                  </div>
                </div>
                <div className="meta-item">
                  <Droplets size={16} />
                  <div>
                    <span className="meta-label">Water</span>
                    <span className="meta-value">{n.water}%</span>
                  </div>
                </div>
              </>
            )}
            <div className="meta-item">
              <Clock size={16} />
              <div>
                <span className="meta-label">Scanned</span>
                <span className="meta-value">Just now</span>
              </div>
            </div>
          </div>
        </div>

        {/* ─── Confidence Score ─── */}
        <div className="glass-card score-card" id="freshness-card">
          <h3 className="card-title">Confidence Score</h3>
          <div className="score-gauge">
            <svg viewBox="0 0 120 120" className="gauge-svg">
              <circle cx="60" cy="60" r="54" className="gauge-bg" />
              <circle
                cx="60" cy="60" r="54"
                className="gauge-fill"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
              />
            </svg>
            <div className="gauge-center">
              <span className="gauge-value">{confidenceAnim}</span>
              <span className="gauge-label">/ 100</span>
            </div>
          </div>
          {badge && <div className={`badge ${badge.cls}`}>{badge.text}</div>}
        </div>

        {/* ─── Vitamins Breakdown ─── */}
        <div className="glass-card ripeness-card" id="ripeness-card">
          <h3 className="card-title">Vitamins (per 100g)</h3>
          {vitamins.length > 0 ? (
            <div className="vitamin-breakdown">
              {vitamins.map(([name, val]) => (
                <div key={name} className="vitamin-row-dash">
                  <span className="vitamin-name-dash">{name.replace('Vitamin ', '')}</span>
                  <div className="vitamin-bar-dash">
                    <div
                      className="vitamin-fill-dash"
                      style={{ width: `${Math.min((val / 60) * 100, 100)}%` }}
                    />
                  </div>
                  <span className="vitamin-val-dash">{val} mg</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-data-text">No vitamin data available</p>
          )}
        </div>

        {/* ─── Nutritional Profile ─── */}
        <div className="glass-card nutrition-card" id="nutrition-card">
          <h3 className="card-title">Nutritional Profile (per 100g)</h3>
          {nutritionData.length > 0 ? (
            <div className="nutrition-chart">
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={nutritionData} barSize={20}>
                  <XAxis
                    dataKey="name"
                    tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis hide />
                  <Tooltip
                    contentStyle={{
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '8px',
                      color: 'var(--cream)',
                      fontSize: '0.85rem',
                    }}
                    formatter={(value, name, props) => [`${value} ${props.payload.unit}`, props.payload.name]}
                  />
                  <Bar dataKey="value" fill="var(--brown)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="no-data-text">No nutrition data available</p>
          )}
        </div>

        {/* ─── Minerals ─── */}
        <div className="glass-card voc-card" id="voc-card">
          <h3 className="card-title">Minerals (per 100g)</h3>
          {minerals.length > 0 ? (
            <div className="minerals-dash-grid">
              {minerals.map(([name, val]) => (
                <div key={name} className="mineral-dash-item">
                  <span className="mineral-dash-val">{val} mg</span>
                  <span className="mineral-dash-name">{name}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-data-text">No mineral data available</p>
          )}
        </div>

        {/* ─── Radar Chart ─── */}
        <div className="glass-card radar-card" id="radar-card">
          <h3 className="card-title">Quality Fingerprint</h3>
          {radarData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <RadarChart data={radarData} outerRadius={80}>
                <PolarGrid stroke="var(--border-color)" />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
                />
                <Radar
                  dataKey="A"
                  stroke="var(--brown)"
                  fill="var(--brown)"
                  fillOpacity={0.2}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          ) : (
            <p className="no-data-text">No data to display</p>
          )}
        </div>
      </div>

      {/* ─── Scan Status Bar ─── */}
      <div className={`scan-status ${scanPulse ? 'pulse' : ''}`} id="scan-status">
        <div className="scan-dot" />
        <span>Analysis Complete</span>
        <span className="scan-detail">Identified as {fruitName} with {(confidence * 100).toFixed(1)}% confidence</span>
      </div>
    </div>
  )
}

export default Dashboard
