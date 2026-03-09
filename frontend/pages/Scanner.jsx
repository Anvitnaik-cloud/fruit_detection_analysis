import { useState, useRef, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Upload, Image as ImageIcon, Loader2, Apple, CheckCircle2,
  Flame, Dumbbell, Wheat, Droplets, Leaf, X, Plus,
} from 'lucide-react'
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts'
import './Scanner.css'

const LAST_SCAN_KEY = 'aura_last_scan'

function Scanner() {
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef(null)
  const navigate = useNavigate()

  // Restore last scan from localStorage on mount
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(LAST_SCAN_KEY))
      if (saved?.result) {
        setResult(saved.result)
        setPreview(saved.preview || null)
      }
    } catch { /* ignore corrupt data */ }
  }, [])

  const handleFile = useCallback((selectedFile) => {
    if (!selectedFile) return
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/bmp']
    if (!allowed.includes(selectedFile.type)) {
      setError('Please upload a JPG, PNG, or WebP image.')
      return
    }
    setError(null)
    setFile(selectedFile)
    setPreview(URL.createObjectURL(selectedFile))
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setDragOver(false)
    const droppedFile = e.dataTransfer.files[0]
    handleFile(droppedFile)
  }, [handleFile])

  // Convert file to base64 for localStorage persistence
  const fileToBase64 = (f) =>
    new Promise((resolve) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result)
      reader.readAsDataURL(f)
    })

  const handleAnalyze = async () => {
    if (!file) return
    setLoading(true)
    setError(null)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/analyze', { method: 'POST', body: formData })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.detail || 'Analysis failed')
      }
      const data = await res.json()
      setResult(data)

      // Save preview as base64 for persistence
      const base64Preview = await fileToBase64(file)
      setPreview(base64Preview)

      // Persist last scan so it survives navigation
      localStorage.setItem(LAST_SCAN_KEY, JSON.stringify({
        result: data,
        preview: base64Preview,
      }))

      // Save to scan history in localStorage
      const history = JSON.parse(localStorage.getItem('aura_scan_history') || '[]')
      const now = new Date()
      history.unshift({
        id: `SC-${Date.now()}`,
        fruit: data.fruit,
        confidence: data.confidence,
        calories: data.nutrition?.per_100g?.calories ?? null,
        hasNutrition: !!data.nutrition,
        date: now.toISOString(),
      })
      localStorage.setItem('aura_scan_history', JSON.stringify(history))
    } catch (err) {
      setError(err.message || 'Could not connect to the server.')
    } finally {
      setLoading(false)
    }
  }

  const startNewScan = () => {
    setFile(null)
    setPreview(null)
    setResult(null)
    setError(null)
    localStorage.removeItem(LAST_SCAN_KEY)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  // Prepare chart data from nutrition result
  const chartData = result?.nutrition?.per_100g
    ? [
        { name: 'Calories', value: result.nutrition.per_100g.calories },
        { name: 'Protein', value: result.nutrition.per_100g.protein },
        { name: 'Carbs', value: result.nutrition.per_100g.carbs },
        { name: 'Fiber', value: result.nutrition.per_100g.fiber },
        { name: 'Sugar', value: result.nutrition.per_100g.sugar },
        { name: 'Fat', value: result.nutrition.per_100g.fat },
      ]
    : []

  const vitaminData = result?.nutrition?.per_100g?.vitamins
    ? Object.entries(result.nutrition.per_100g.vitamins).map(([name, value]) => ({
        name: name.replace('Vitamin ', ''),
        value,
      }))
    : []

  return (
    <div className="scanner" id="scanner-page">
      <div className="scanner-header">
        <div>
          <h1 className="scanner-title">Fruit Scanner</h1>
          <p className="scanner-subtitle">Upload a fruit image to identify it and get full nutritional data</p>
        </div>
        {result && (
          <button className="btn-primary" onClick={startNewScan}>
            <Plus size={16} /> New Scan
          </button>
        )}
      </div>

      {!result ? (
        /* ─── Upload Area ─── */
        <div className="scanner-upload-section">
          <div
            className={`glass-card upload-zone ${dragOver ? 'drag-over' : ''} ${preview ? 'has-preview' : ''}`}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => !preview && fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/bmp"
              className="upload-input"
              onChange={(e) => handleFile(e.target.files[0])}
            />

            {preview ? (
              <div className="preview-container">
                <img src={preview} alt="Fruit preview" className="preview-image" />
                <button className="preview-remove" onClick={(e) => { e.stopPropagation(); startNewScan() }}>
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div className="upload-placeholder">
                <div className="upload-icon-wrap">
                  <Upload size={36} />
                </div>
                <h3>Drop your fruit image here</h3>
                <p>or click to browse &bull; JPG, PNG, WebP</p>
              </div>
            )}
          </div>

          {error && <div className="scan-error">{error}</div>}

          <button
            className="btn-primary analyze-btn"
            onClick={handleAnalyze}
            disabled={!file || loading}
          >
            {loading ? (
              <><Loader2 size={18} className="spin" /> Analyzing...</>
            ) : (
              <><ImageIcon size={18} /> Analyze Fruit</>
            )}
          </button>

          <div className="upload-tips">
            <div className="glass-card tip-card">
              <Apple size={20} />
              <span>Use a clear photo of a single fruit for best results</span>
            </div>
            <div className="glass-card tip-card">
              <Leaf size={20} />
              <span>Good lighting helps the AI identify the fruit accurately</span>
            </div>
          </div>
        </div>
      ) : (
        /* ─── Results ─── */
        <div className="scanner-results">
          {/* Fruit identity */}
          <div className="results-top">
            <div className="glass-card result-image-card">
              <img src={preview} alt={result.fruit} className="result-image" />
            </div>

            <div className="glass-card result-identity-card">
              <div className="result-badge">
                <CheckCircle2 size={18} />
                Identified
              </div>
              <h2 className="result-fruit-name">{result.fruit}</h2>
              <p className="result-confidence">
                Confidence: <strong>{(result.confidence * 100).toFixed(1)}%</strong>
              </p>

              {result.nutrition?.per_100g && (
                <div className="result-macros">
                  <div className="macro-item">
                    <Flame size={16} />
                    <span className="macro-val">{result.nutrition.per_100g.calories}</span>
                    <span className="macro-label">kcal</span>
                  </div>
                  <div className="macro-item">
                    <Dumbbell size={16} />
                    <span className="macro-val">{result.nutrition.per_100g.protein}g</span>
                    <span className="macro-label">Protein</span>
                  </div>
                  <div className="macro-item">
                    <Wheat size={16} />
                    <span className="macro-val">{result.nutrition.per_100g.carbs}g</span>
                    <span className="macro-label">Carbs</span>
                  </div>
                  <div className="macro-item">
                    <Droplets size={16} />
                    <span className="macro-val">{result.nutrition.per_100g.water}%</span>
                    <span className="macro-label">Water</span>
                  </div>
                </div>
              )}

              <button className="btn-primary" onClick={() => navigate('/dashboard', { state: result })}>
                View Full Dashboard
              </button>
            </div>
          </div>

          {/* Charts */}
          {result.nutrition?.per_100g && (
            <div className="results-charts">
              <div className="glass-card chart-card">
                <h3 className="card-title">Macronutrients (per 100 g)</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={chartData} barSize={24}>
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
                        fontSize: '0.85rem',
                      }}
                    />
                    <Bar dataKey="value" fill="var(--brown)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="glass-card chart-card">
                <h3 className="card-title">Vitamins</h3>
                <div className="vitamin-list">
                  {vitaminData.map((v) => (
                    <div key={v.name} className="vitamin-row">
                      <span className="vitamin-name">{v.name}</span>
                      <div className="vitamin-bar-wrap">
                        <div
                          className="vitamin-bar-fill"
                          style={{ width: `${Math.min((v.value / 60) * 100, 100)}%` }}
                        />
                      </div>
                      <span className="vitamin-val">{v.value} mg</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-card chart-card minerals-card">
                <h3 className="card-title">Minerals (per 100 g)</h3>
                <div className="minerals-grid">
                  {result.nutrition.per_100g.minerals &&
                    Object.entries(result.nutrition.per_100g.minerals).map(([name, val]) => (
                      <div key={name} className="mineral-item">
                        <span className="mineral-val">{val} mg</span>
                        <span className="mineral-name">{name}</span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}

          {!result.nutrition && (
            <div className="glass-card no-nutrition-card">
              <p>Nutrition data not available for <strong>{result.fruit}</strong>. The fruit was identified but is not in our nutrition database yet.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Scanner
