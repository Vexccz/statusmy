import { useState, useEffect } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  Monitor,
  Bell,
  Globe,
  Settings,
  User,
  LogOut,
  LogIn,
  X,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const tabs = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { label: 'Monitors', icon: Monitor, href: '/dashboard/monitors' },
  { label: 'Alerts', icon: Bell, href: '/dashboard/alerts' },
  { label: 'Status', icon: Globe, href: '/status' },
  { label: 'Settings', icon: Settings, href: '/dashboard/settings' },
]

// All routes accessible for everyone (including guests)
const guestAllowedPaths = ['/dashboard', '/dashboard/monitors', '/dashboard/incidents', '/status', '/dashboard/alerts', '/dashboard/settings', '/dashboard/reports']

export default function MobileLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, isGuest, isAuthenticated, logout } = useAuth()
  const [showGuestBanner, setShowGuestBanner] = useState(true)

  const isActive = (href) => {
    if (href === '/dashboard') return location.pathname === '/dashboard'
    return location.pathname.startsWith(href)
  }

  const handleTabClick = (href) => {
    navigate(href)
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      {/* Guest banner */}
      {isGuest && showGuestBanner && (
        <motion.div
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-[rgba(16,185,129,0.1)] border-b border-[rgba(16,185,129,0.2)] px-4 py-2.5 flex items-center justify-between flex-shrink-0"
        >
          <p className="text-xs text-[#34D399] flex-1">
            👋 You're browsing as guest.{' '}
            <Link to="/login" className="underline font-medium">Sign in</Link>
            {' '}for full access.
          </p>
          <button
            onClick={() => setShowGuestBanner(false)}
            className="ml-2 text-[#34D399]/60 hover:text-[#34D399] transition-colors"
          >
            <X size={14} />
          </button>
        </motion.div>
      )}

      {/* Top header - minimal */}
      <header className="h-14 border-b border-border bg-surface/30 backdrop-blur-sm flex items-center justify-between px-4 flex-shrink-0 sticky top-0 z-30">
        <Link to="/dashboard" className="flex items-center gap-2">
          <svg className="w-7 h-7" viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="16" r="12" stroke="url(#mobile-header-grad)" strokeWidth="3" fill="none" />
            <circle cx="16" cy="16" r="5" fill="url(#mobile-header-grad)" />
            <defs>
              <linearGradient id="mobile-header-grad" x1="4" y1="4" x2="28" y2="28">
                <stop stopColor="#10B981" />
                <stop offset="1" stopColor="#34D399" />
              </linearGradient>
            </defs>
          </svg>
          <span className="text-base font-bold text-text-primary">StatusMy</span>
        </Link>

        <div className="flex items-center gap-2">
          {/* Notification bell */}
          <button
            className="w-9 h-9 flex items-center justify-center rounded-lg text-text-muted hover:text-text-primary hover:bg-surface/60 transition-colors relative"
            title="Notifications"
          >
            <Bell size={18} />
          </button>

          {/* User/Login button */}
          {isGuest ? (
            <Link
              to="/login"
              className="w-9 h-9 flex items-center justify-center rounded-lg text-[#10B981] hover:bg-[rgba(16,185,129,0.1)] transition-colors"
              title="Sign in"
            >
              <LogIn size={18} />
            </Link>
          ) : (
            <button
              onClick={handleLogout}
              className="w-9 h-9 flex items-center justify-center rounded-lg text-text-muted hover:text-text-primary hover:bg-surface/60 transition-colors"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          )}
        </div>
      </header>

      {/* Page content */}
      <main className="flex-1 overflow-y-auto pb-20">
        <Outlet />
      </main>

      {/* Bottom tab navigation */}
      <nav className="fixed bottom-0 left-0 right-0 h-16 bg-surface/95 backdrop-blur-md border-t border-border z-40 flex items-center justify-around px-1 safe-area-bottom">
        {tabs.map((tab) => {
          const active = isActive(tab.href)
          const Icon = tab.icon
          const isRestricted = isGuest && !guestAllowedPaths.some(path => {
            if (path === '/dashboard') return tab.href === '/dashboard'
            return tab.href.startsWith(path)
          })

          return (
            <button
              key={tab.href}
              onClick={() => handleTabClick(tab.href)}
              className={`flex flex-col items-center justify-center gap-0.5 flex-1 h-full py-2 rounded-lg transition-all duration-150 relative ${
                active
                  ? 'text-[#10B981]'
                  : isRestricted
                    ? 'text-text-muted/40'
                    : 'text-text-muted hover:text-text-primary'
              }`}
            >
              {active && (
                <motion.div
                  layoutId="tab-indicator"
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[3px] rounded-b-full bg-[#10B981]"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
              <Icon size={20} strokeWidth={active ? 2.5 : 2} />
              <span className={`text-[10px] font-medium ${active ? 'text-[#10B981]' : ''}`}>
                {tab.label}
              </span>
              {isRestricted && (
                <div className="absolute top-1.5 right-1/2 translate-x-3 w-1.5 h-1.5 rounded-full bg-text-muted/40" />
              )}
            </button>
          )
        })}
      </nav>
    </div>
  )
}
