import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useScrollPosition } from '../hooks/useScrollPosition'
import { Menu, X, User, LogOut, LayoutDashboard } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import ThemeToggle from './ThemeToggle'
import LocaleSwitcher from './LocaleSwitcher'

const navLinks = [
  { label: 'Product', href: '/#features' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Docs', href: '/docs' },
  { label: 'Status', href: '/status' },
  { label: 'About', href: '/about' },
  { label: 'Changelog', href: '/changelog' },
]

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { isScrolled } = useScrollPosition()
  const location = useLocation()
  const navigate = useNavigate()
  const { user, isAuthenticated, logout } = useAuth()

  useEffect(() => {
    setMobileOpen(false)
  }, [location])

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const isActive = (href) => {
    if (href === '/#features') return location.pathname === '/' && location.hash === '#features'
    const path = href.split('#')[0]
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-bg/80 backdrop-blur-xl border-b border-border shadow-lg'
          : 'bg-transparent'
      }`}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-container mx-auto px-[16px] sm:px-[24px] lg:px-[32px]">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group min-w-[44px] min-h-[44px]" aria-label="StatusMy Home">
            <svg className="w-8 h-8 transition-transform duration-200 group-hover:scale-105" viewBox="0 0 32 32" fill="none" aria-hidden="true">
              <circle cx="16" cy="16" r="12" stroke="url(#logo-grad)" strokeWidth="3" fill="none" />
              <circle cx="16" cy="16" r="5" fill="url(#logo-grad)" />
              <defs>
                <linearGradient id="logo-grad" x1="4" y1="4" x2="28" y2="28">
                  <stop stopColor="#10B981" />
                  <stop offset="1" stopColor="#34D399" />
                </linearGradient>
              </defs>
            </svg>
            <span className="text-xl font-bold text-text-primary">StatusMy</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const active = isActive(link.href)
              return (
                <Link
                  key={link.label}
                  to={link.href}
                  className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-150 ${
                    active
                      ? 'text-text-primary'
                      : 'text-text-secondary hover:text-text-primary hover:bg-card/30'
                  }`}
                  aria-current={active ? 'page' : undefined}
                >
                  {link.label}
                  {/* Active indicator */}
                  {active && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute bottom-0 left-2 right-2 h-0.5 bg-brand rounded-full"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              )
            })}
          </div>

          {/* CTA / User Menu */}
          <div className="hidden lg:flex items-center gap-3">
            <LocaleSwitcher />
            <ThemeToggle />
            {isAuthenticated ? (
              <Link to="/dashboard" className="btn-primary btn-sm min-h-[44px] flex items-center gap-2">
                <LayoutDashboard size={16} />
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors duration-150 min-h-[44px] flex items-center"
                >
                  Sign In
                </Link>
                <Link to="/signup" className="btn-primary btn-sm min-h-[44px] flex items-center">
                  Start Free
                </Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            className="lg:hidden w-11 h-11 flex items-center justify-center rounded-lg text-text-primary hover:bg-card/30 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileOpen(false)}
              aria-hidden="true"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="fixed top-0 right-0 bottom-0 w-[300px] bg-surface border-l border-border lg:hidden overflow-y-auto"
              role="dialog"
              aria-label="Mobile navigation menu"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                  <span className="text-lg font-bold text-text-primary">Menu</span>
                  <button
                    onClick={() => setMobileOpen(false)}
                    className="w-11 h-11 flex items-center justify-center rounded-lg hover:bg-card/30 text-text-primary"
                    aria-label="Close menu"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* User info in mobile */}
                {isAuthenticated && (
                  <div className="flex items-center gap-3 mb-6 pb-6 border-b border-border">
                    <div className="w-10 h-10 rounded-full bg-brand/20 flex items-center justify-center">
                      {user?.avatar ? (
                        <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
                      ) : (
                        <User size={18} className="text-brand-light" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text-primary">{user?.name}</p>
                      <p className="text-xs text-text-muted">{user?.email}</p>
                    </div>
                  </div>
                )}

                <div className="space-y-1">
                  {navLinks.map((link) => {
                    const active = isActive(link.href)
                    return (
                      <Link
                        key={link.label}
                        to={link.href}
                        className={`block px-4 py-3 rounded-lg font-medium transition-colors min-h-[44px] flex items-center ${
                          active
                            ? 'text-brand-light bg-brand-bg'
                            : 'text-text-secondary hover:text-text-primary hover:bg-card/30'
                        }`}
                        aria-current={active ? 'page' : undefined}
                      >
                        {link.label}
                      </Link>
                    )
                  })}
                </div>

                <div className="mt-8 pt-6 border-t border-border space-y-3">
                  {isAuthenticated ? (
                    <>
                      <Link
                        to="/dashboard"
                        className="block w-full text-center px-4 py-3 rounded-lg text-text-primary hover:bg-card/30 transition-colors font-medium min-h-[44px] flex items-center justify-center gap-2"
                      >
                        <LayoutDashboard size={16} />
                        Dashboard
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-center px-4 py-3 rounded-lg text-text-secondary hover:text-semantic-error hover:bg-semantic-error/5 transition-colors font-medium min-h-[44px] flex items-center justify-center gap-2"
                      >
                        <LogOut size={16} />
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        className="block w-full text-center px-4 py-3 rounded-lg text-text-secondary hover:text-text-primary hover:bg-card/30 transition-colors font-medium min-h-[44px] flex items-center justify-center"
                      >
                        Sign In
                      </Link>
                      <Link to="/signup" className="btn-primary w-full text-center block min-h-[44px] flex items-center justify-center">
                        Start Free
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  )
}
