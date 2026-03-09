import { Link } from 'react-router-dom'
import { Leaf } from 'lucide-react'
import './Footer.css'

function Footer() {
  return (
    <footer className="footer" id="main-footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <div className="footer-logo">
            <Leaf size={18} />
            <span>AURA</span>
          </div>
          <p className="footer-tagline">Defining the future of nutrition.</p>
        </div>

        <div className="footer-links">
          <a href="#" id="footer-privacy">Privacy Policy</a>
          <a href="#" id="footer-terms">Terms of Service</a>
          <a href="#" id="footer-support">Support Center</a>
          <a href="#" id="footer-whitepaper">Whitepaper</a>
        </div>

        <div className="footer-copy">
          © 2026 Aura Intelligent Systems. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

export default Footer
