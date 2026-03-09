import { NavLink, Link } from 'react-router-dom'
import { LayoutDashboard, History, ScanLine, Settings, Leaf, LogOut } from 'lucide-react'
import './Sidebar.css'

function Sidebar() {
  const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/history', icon: History, label: 'History' },
    { to: '/scanner', icon: ScanLine, label: 'Scanner' },
  ]

  return (
    <aside className="sidebar" id="app-sidebar">
      <div className="sidebar-header">
        <Link to="/" className="sidebar-logo" id="sidebar-logo">
          <div className="sidebar-logo-icon">
            <Leaf size={20} />
          </div>
          <span className="sidebar-logo-text">AURA</span>
        </Link>
      </div>

      <nav className="sidebar-nav">
        <div className="sidebar-section-label">Main Menu</div>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            id={`sidebar-${item.label.toLowerCase()}`}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <NavLink to="/" className="sidebar-link" id="sidebar-settings">
          <Settings size={20} />
          <span>Settings</span>
        </NavLink>
        <Link to="/" className="sidebar-link" id="sidebar-logout">
          <LogOut size={20} />
          <span>Back to Site</span>
        </Link>
      </div>
    </aside>
  )
}

export default Sidebar
