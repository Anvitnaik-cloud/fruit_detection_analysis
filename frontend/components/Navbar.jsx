import { Link } from 'react-router-dom'
import { Leaf, Menu, X } from 'lucide-react'
import { useState } from 'react'
import './Navbar.css'

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="navbar" id="main-nav">
      <div className="navbar-inner">
        <Link to="/" className="navbar-logo" id="nav-logo">
          <div className="logo-icon">
            <Leaf size={22} />
          </div>
          <span className="logo-text">AURA</span>
        </Link>

        <div className={`navbar-links ${menuOpen ? 'active' : ''}`}>
          <a href="#features" id="nav-features">Features</a>
          <a href="#technology" id="nav-technology">Technology</a>
          <a href="#process" id="nav-process">How it Works</a>
          <a href="#quality" id="nav-quality">Quality</a>
        </div>

        <div className="navbar-actions">
          <Link to="/dashboard" className="btn-primary" id="nav-cta">
            Launch App
          </Link>
          <button
            className="menu-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            id="nav-menu-toggle"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
