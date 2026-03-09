import { Link } from 'react-router-dom'
import { Brain, Eye, Wind, ScanLine, Cpu, GitMerge, BarChart3, ArrowRight, Sparkles, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import './LandingPage.css'

function LandingPage() {
  return (
    <div className="landing" id="landing-page">
      <Navbar />

      {/* ─── Hero Section ─── */}
      <section className="hero" id="features">
        <div className="hero-bg">
          <div className="hero-orb hero-orb-1" />
          <div className="hero-orb hero-orb-2" />
          <div className="hero-orb hero-orb-3" />
          <div className="hero-grid" />
        </div>

        <div className="hero-content animate-in">
          <div className="hero-badge">
            <Sparkles size={14} />
            <span>AI-Powered Analysis</span>
          </div>
          <h1 className="hero-title">
            Experience <span className="text-gradient">Freshness</span>
            <br />Through AI
          </h1>
          <p className="hero-subtitle">
            Harnessing deep learning and VOC sensor analysis to detect nutritional
            value and shelf life with <strong>99.8% accuracy</strong>.
          </p>
          <div className="hero-actions">
            <Link to="/dashboard" className="btn-primary" id="hero-cta">
              Launch Dashboard
              <ArrowRight size={18} />
            </Link>
            <a href="#technology" className="btn-secondary" id="hero-learn">
              Learn More
            </a>
          </div>
          <div className="hero-stats">
            <div className="hero-stat">
              <span className="hero-stat-value">99.8%</span>
              <span className="hero-stat-label">Accuracy</span>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat">
              <span className="hero-stat-value">500ms</span>
              <span className="hero-stat-label">Scan Time</span>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat">
              <span className="hero-stat-value">1M+</span>
              <span className="hero-stat-label">Samples Trained</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Technology Section ─── */}
      <section className="section tech-section" id="technology">
        <div className="section-header">
          <h2 className="section-title">Cutting Edge Detection</h2>
          <p className="section-subtitle">
            Aura combines three distinct diagnostic layers to provide a comprehensive
            look into the nutritional core of any fruit.
          </p>
        </div>

        <div className="tech-grid">
          <div className="glass-card tech-card animate-in animate-delay-1" id="tech-dl">
            <div className="tech-icon-wrap">
              <Brain size={28} />
            </div>
            <h3>Deep Learning</h3>
            <p>
              Advanced neural networks trained on millions of samples to recognize
              ripeness markers invisible to the human eye. Our systems identify subtle
              patterns in cell structure and molecular composition.
            </p>
          </div>

          <div className="glass-card tech-card animate-in animate-delay-2" id="tech-img">
            <div className="tech-icon-wrap">
              <Eye size={28} />
            </div>
            <h3>Image Processing</h3>
            <p>
              Multi-spectral imaging captures texture, color depth, and surface
              integrity at microscopic levels. Analyzing light absorption across
              various wavelengths reveals the hidden biography of every fruit.
            </p>
          </div>

          <div className="glass-card tech-card animate-in animate-delay-3" id="tech-voc">
            <div className="tech-icon-wrap">
              <Wind size={28} />
            </div>
            <h3>VOC Sensors</h3>
            <p>
              Detection of Volatile Organic Compounds to identify chemical signatures
              of fermentation or decay. Our digital "nose" sniffs out invisible gases
              fruits emit as they transition through stages of ripeness.
            </p>
          </div>
        </div>
      </section>

      {/* ─── Process Section ─── */}
      <section className="section process-section" id="process">
        <div className="section-header">
          <h2 className="section-title">The Aura Journey</h2>
          <p className="section-subtitle">
            From scan to insight in four seamless steps
          </p>
        </div>

        <div className="process-grid">
          {[
            {
              step: '01',
              title: 'Scan',
              desc: 'Point the IoT scanner or smartphone camera at any fruit. Our interface guides you to capture the optimal angles for assessment.',
              icon: ScanLine,
            },
            {
              step: '02',
              title: 'AI Analysis',
              desc: 'Proprietary algorithms process visual and chemical data in real-time. Cloud-based neural networks compare against millions of indexed samples.',
              icon: Cpu,
            },
            {
              step: '03',
              title: 'Sensor Fusion',
              desc: 'Data is merged to create a digital fingerprint. This unique identity encapsulates sugar content to potential shelf-life expectancy.',
              icon: GitMerge,
            },
            {
              step: '04',
              title: 'Insights',
              desc: 'Receive precise shelf-life and nutritional reports instantly. Make informed decisions with data-backed confidence.',
              icon: BarChart3,
            },
          ].map((item) => (
            <div className="process-card" key={item.step} id={`process-step-${item.step}`}>
              <div className="process-step-number">Step {item.step}</div>
              <div className="process-icon-wrap">
                <item.icon size={24} />
              </div>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="process-line" />
      </section>

      {/* ─── Quality Grading Section ─── */}
      <section className="section quality-section" id="quality">
        <div className="section-header">
          <h2 className="section-title">Real-time Quality Grading</h2>
          <p className="section-subtitle">
            Instant classification into actionable quality tiers
          </p>
        </div>

        <div className="quality-grid">
          <div className="glass-card quality-card quality-grade-a" id="quality-a">
            <div className="quality-indicator">
              <CheckCircle2 size={24} />
            </div>
            <div className="quality-grade">Grade A</div>
            <h3>Peak Freshness</h3>
            <p>Peak nutritional value. Optimal consumption recommended today.</p>
          </div>

          <div className="glass-card quality-card quality-grade-b" id="quality-b">
            <div className="quality-indicator warning">
              <AlertTriangle size={24} />
            </div>
            <div className="quality-grade">Grade B</div>
            <h3>Consume Soon</h3>
            <p>High sweetness levels. Best for immediate use within 48 hours.</p>
          </div>

          <div className="glass-card quality-card quality-grade-c" id="quality-c">
            <div className="quality-indicator danger">
              <XCircle size={24} />
            </div>
            <div className="quality-grade">Grade C</div>
            <h3>Not Suitable</h3>
            <p>Chemical decay signatures detected. Not suitable for consumption.</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default LandingPage
