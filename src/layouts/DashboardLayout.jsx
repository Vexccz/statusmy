import { useState, useEffect, useRef } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  Monitor,
  AlertTriangle,
  Bell,
  Globe,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Plus,
  Menu,
  X,
  User,
  LogOut,
  ChevronDown,
  Shield,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const sidebarLinks = [
  { label: 'Overview', icon: LayoutDashboard, href: '/dashboard' },
  { label: 'Monitors', icon: Monitor, href: '/dashboard/monitors' },
  { label: 'Incidents', icon: AlertTriangle, href: '/dashboard/incidents' },
  { label: 'Alerts', icon: Bell, href: '/dashboard/alerts' },
  { label: 'Status Page', icon: Globe, href: '/status', external: true },
  { label: 'Reports', icon: BarChart3, href: '/dashboard/reports' },
  { label: 'Settings', icon: Settings, href: '/dashboard/settings' },
  { label: 'Admin', icon: Shield, href: '/admin', external: true },
]

// Map paths to breadcrumb labels
const breadcrumbMap = {
  '/dashboard': 'Overview',
  '/dashboard/monitors': 'Monitors',
  '/dashboard/incidents': 'Incidents',
  '/dashboard/alerts': 'Alerts',
  '/dashboard/status-pages': 'Status Pages',
  '/dashboard/reports': 'Reports',
  '/dashboard/settings': 'Settings',
  '/dashboard/add-monitor': 'Add Monitor',
}

function getBreadcrumbs(pathname) {
  const crumbs = [{ label: 'Dashboard', href: '/dashboard' }]

  // Check exact match first
  if (breadcrumbMap[pathname] && pathname !== '/dashboard') {
    crumbs.push({ label: breadcrumbMap[pathname], href: pathname })
    return crumbs
  }

  // Check for monitor detail: /dashboard/monitors/:id
  if (/^\/dashboard\/monitors\/[^/]+$/.test(pathname)) {
    crumbs.push({ label: 'Monitors', href: '/dashboard/monitors' })
    crumbs.push({ label: 'Monitor Details', href: pathname })
    return crumbs
  }

  // Check for add-monitor
  if (pathname === '/dashboard/add-monitor') {
    crumbs.push({ label: 'Add Monitor', href: pathname })
    return crumbs
  }

  return crumbs
}

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const userMenuRef = useRef(null)

  // Auto-collapse on small screens
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1024px)')
    const handler = (e) => {
      if (e.matches) setCollapsed(true)
    }
    handler(mq)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  // Lock body scroll when mobile drawer open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  // Close user menu on outside click
  useEffect(() => {
    function handleClick(e) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const isActive = (href) => {
    if (href === '/dashboard') return location.pathname === '/dashboard'
    return location.pathname.startsWith(href)
  }

  const breadcrumbs = getBreadcrumbs(location.pathname)

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="flex items-center gap-2 px-4 h-16 border-b border-border flex-shrink-0">
        <Link to="/dashboard" className="flex items-center gap-2 min-w-0">
          <svg className="w-8 h-8 flex-shrink-0" viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="16" r="12" stroke="url(#sidebar-logo-grad)" strokeWidth="3" fill="none" />
            <circle cx="16" cy="16" r="5" fill="url(#sidebar-logo-grad)" />
            <defs>
              <linearGradient id="sidebar-logo-grad" x1="4" y1="4" x2="28" y2="28">
                <stop stopColor="#22D3EE" />
                <stop offset="1" stopColor="#6366F1" />
              </linearGradient>
            </defs>
          </svg>
          {!collapsed && (
            <div className="flex flex-col leading-none min-w-0">
              <span className="obs-kicker">obs · v1</span>
              <span className="text-base font-bold text-text-primary whitespace-nowrap font-mono tracking-tight">status<span className="text-brand">.my</span></span>
            </div>
          )}
        </Link>
      </div>

      {/* Nav items */}
      <nav className="flex-1 py-4 px-2 overflow-y-auto">
        <ul className="flex flex-col gap-1">
          {sidebarLinks.map((link) => {
            const active = isActive(link.href)
            const Icon = link.icon
            const LinkComp = link.external ? 'a' : Link
            const linkProps = link.external ? { href: link.href, target: '_blank', rel: 'noopener noreferrer' } : { to: link.href }
            return (
              <li key={link.href}>
                <LinkComp
                  {...linkProps}
                  className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                    active
                      ? 'bg-brand-bg text-brand'
                      : 'text-text-secondary hover:text-text-primary hover:bg-surface/60'
                  }`}
                  title={collapsed ? link.label : undefined}
                >
                  {/* Active left border */}
                  {active && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-brand" />
                  )}
                  <Icon size={20} className="flex-shrink-0" />
                  {!collapsed && <span>{link.label}</span>}

                  {/* Tooltip when collapsed */}
                  {collapsed && (
                    <div className="absolute left-full ml-2 px-2 py-1 rounded-md bg-surface border border-border text-xs text-text-primary whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 shadow-lg">
                      {link.label}
                    </div>
                  )}
                </LinkComp>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Collapse toggle */}
      <div className="hidden lg:block px-2 py-2 border-t border-border">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center justify-center w-full py-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface/60 transition-colors"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* User section */}
      <div className="px-2 py-3 border-t border-border flex-shrink-0" ref={userMenuRef}>
        <div className="relative">
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-surface/60 transition-colors ${
              collapsed ? 'justify-center' : ''
            }`}
            title={collapsed ? user?.name : undefined}
          >
            <div className="w-8 h-8 rounded-full bg-brand-bg flex items-center justify-center flex-shrink-0">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
              ) : (
                <User size={16} className="text-brand-light" />
              )}
            </div>
            {!collapsed && (
              <>
                <div className="min-w-0 text-left flex-1">
                  <p className="text-sm font-medium text-text-primary truncate">{user?.name}</p>
                  <p className="text-xs text-text-muted truncate">{user?.email}</p>
                </div>
                <ChevronDown size={14} className={`text-text-muted transition-transform flex-shrink-0 ${userMenuOpen ? 'rotate-180' : ''}`} />
              </>
            )}
          </button>

          {/* User dropdown */}
          <AnimatePresence>
            {userMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: 4, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 4, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className={`absolute bottom-full mb-2 ${collapsed ? 'left-0' : 'left-0 right-0'} min-w-[180px] rounded-lg border border-border bg-card shadow-xl py-1 z-50`}
              >
                <div className="px-3 py-2 border-b border-border">
                  <p className="text-sm font-medium text-text-primary truncate">{user?.name}</p>
                  <p className="text-xs text-text-muted truncate">{user?.email}</p>
                </div>
                <Link
                  to="/dashboard/settings"
                  className="flex items-center gap-2 px-3 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-surface/60 transition-colors"
                  onClick={() => setUserMenuOpen(false)}
                >
                  <User size={14} />
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-text-secondary hover:text-[#EF4444] hover:bg-[rgba(239,68,68,0.05)] transition-colors"
                >
                  <LogOut size={14} />
                  Logout
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  )

  return (
    <div className="min-h-screen bg-bg flex">
      {/* Desktop sidebar */}
      <aside
        className="hidden lg:flex flex-col border-r border-border bg-surface/50 flex-shrink-0 transition-[width] duration-300 ease-in-out"
        style={{ width: collapsed ? 64 : 260 }}
      >
        {sidebarContent}
      </aside>

      {/* Mobile sidebar backdrop + drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="fixed top-0 left-0 bottom-0 w-[260px] bg-surface border-r border-border z-50 lg:hidden flex flex-col"
            >
              {/* Close button for mobile */}
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute top-4 right-3 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-card/30 text-text-muted z-10"
              >
                <X size={18} />
              </button>
              {(() => {
                // Force expanded state for mobile
                const prevCollapsed = collapsed
                // We render the sidebar content with collapsed=false for mobile
                return (
                  <>
                    {/* Logo */}
                    <div className="flex items-center gap-2 px-4 h-16 border-b border-border flex-shrink-0">
                      <Link to="/dashboard" className="flex items-center gap-2">
                        <svg className="w-8 h-8 flex-shrink-0" viewBox="0 0 32 32" fill="none">
                          <circle cx="16" cy="16" r="12" stroke="url(#mobile-logo-grad)" strokeWidth="3" fill="none" />
                          <circle cx="16" cy="16" r="5" fill="url(#mobile-logo-grad)" />
                          <defs>
                            <linearGradient id="mobile-logo-grad" x1="4" y1="4" x2="28" y2="28">
                              <stop stopColor="#22D3EE" />
                              <stop offset="1" stopColor="#6366F1" />
                            </linearGradient>
                          </defs>
                        </svg>
                        <span className="text-lg font-bold text-text-primary font-mono">status<span className="text-brand">.my</span></span>
                      </Link>
                    </div>

                    {/* Nav items */}
                    <nav className="flex-1 py-4 px-2 overflow-y-auto">
                      <ul className="flex flex-col gap-1">
                        {sidebarLinks.map((link) => {
                          const active = isActive(link.href)
                          const Icon = link.icon
                          const LinkComp = link.external ? 'a' : Link
                          const linkProps = link.external ? { href: link.href, target: '_blank', rel: 'noopener noreferrer' } : { to: link.href }
                          return (
                            <li key={link.href}>
                              <LinkComp
                                {...linkProps}
                                className={`relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                                  active
                                    ? 'bg-brand-bg text-brand'
                                    : 'text-text-secondary hover:text-text-primary hover:bg-surface/60'
                                }`}
                              >
                                {active && (
                                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-brand" />
                                )}
                                <Icon size={20} className="flex-shrink-0" />
                                <span>{link.label}</span>
                              </LinkComp>
                            </li>
                          )
                        })}
                      </ul>
                    </nav>

                    {/* User section mobile */}
                    <div className="px-2 py-3 border-t border-border flex-shrink-0">
                      <div className="flex items-center gap-3 px-3 py-2">
                        <div className="w-8 h-8 rounded-full bg-brand-bg flex items-center justify-center flex-shrink-0">
                          {user?.avatar ? (
                            <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
                          ) : (
                            <User size={16} className="text-brand-light" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-text-primary truncate">{user?.name}</p>
                          <p className="text-xs text-text-muted truncate">{user?.email}</p>
                        </div>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-3 py-2 mt-1 rounded-lg text-sm text-text-secondary hover:text-[#EF4444] hover:bg-[rgba(239,68,68,0.05)] transition-colors"
                      >
                        <LogOut size={16} />
                        Logout
                      </button>
                    </div>
                  </>
                )
              })()}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-16 border-b border-border bg-surface/30 backdrop-blur-sm flex items-center justify-between px-4 lg:px-6 flex-shrink-0 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg text-text-primary hover:bg-surface/60 transition-colors"
              aria-label="Open sidebar"
            >
              <Menu size={20} />
            </button>

            {/* Breadcrumb */}
            <nav className="flex items-center gap-1.5 text-sm" aria-label="Breadcrumb">
              {breadcrumbs.map((crumb, i) => (
                <span key={crumb.href} className="flex items-center gap-1.5">
                  {i > 0 && <span className="text-text-muted">/</span>}
                  {i === breadcrumbs.length - 1 ? (
                    <span className="text-text-primary font-medium">{crumb.label}</span>
                  ) : (
                    <Link to={crumb.href} className="text-text-muted hover:text-text-primary transition-colors">
                      {crumb.label}
                    </Link>
                  )}
                </span>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-2">
            {/* Notification bell */}
            <button
              className="w-9 h-9 flex items-center justify-center rounded-lg text-text-muted hover:text-text-primary hover:bg-surface/60 transition-colors relative"
              title="Notifications"
            >
              <Bell size={18} />
            </button>

            {/* Add Monitor button */}
            <button
              onClick={() => navigate('/dashboard/add-monitor')}
              className="btn-primary btn-sm hidden sm:flex"
            >
              <Plus size={16} />
              Add Monitor
            </button>
            <button
              onClick={() => navigate('/dashboard/add-monitor')}
              className="btn-primary btn-sm sm:hidden w-9 h-9 !p-0 flex items-center justify-center"
              title="Add Monitor"
            >
              <Plus size={16} />
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
