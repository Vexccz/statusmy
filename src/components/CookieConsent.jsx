import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Cookie, X } from 'lucide-react'

export default function CookieConsent() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent')
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 1500)
      return () => clearTimeout(timer)
    }
  }, [])

  const accept = () => {
    localStorage.setItem('cookie-consent', 'accepted')
    setVisible(false)
  }

  const decline = () => {
    localStorage.setItem('cookie-consent', 'declined')
    setVisible(false)
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 md:bottom-6 md:left-6 md:right-auto md:max-w-md"
          role="dialog"
          aria-label="Cookie consent"
        >
          <div className="bg-surface border border-border rounded-xl p-5 shadow-lg backdrop-blur-xl">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg bg-brand-bg flex items-center justify-center text-brand-light flex-shrink-0">
                <Cookie size={18} />
              </div>
              <div className="flex-1">
                <h3 className="text-body-sm font-semibold text-text-primary mb-1">We use cookies</h3>
                <p className="text-caption text-text-secondary leading-relaxed">
                  We use cookies to improve your experience, analyze traffic, and personalize content. 
                  You can manage your preferences anytime.
                </p>
              </div>
              <button
                onClick={decline}
                className="w-8 h-8 flex items-center justify-center rounded-md text-text-muted hover:text-text-primary hover:bg-card/50 transition-colors flex-shrink-0"
                aria-label="Dismiss cookie banner"
              >
                <X size={16} />
              </button>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={accept}
                className="btn-primary btn-sm flex-1"
              >
                Accept All
              </button>
              <button
                onClick={decline}
                className="btn-secondary btn-sm flex-1"
              >
                Decline
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
