import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import { useMediaQuery } from '../hooks/useMediaQuery'

export default function MobileCTA() {
  const isMobile = useMediaQuery('(max-width: 1023px)')
  const [visible, setVisible] = useState(false)
  const location = useLocation()

  // Hide on auth pages
  const hideOnPages = ['/login', '/signup']
  const shouldHide = hideOnPages.includes(location.pathname)

  useEffect(() => {
    if (!isMobile || shouldHide) {
      setVisible(false)
      return
    }

    const handleScroll = () => {
      setVisible(window.scrollY > 300)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isMobile, shouldHide])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 80 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-0 left-0 right-0 z-40 lg:hidden safe-bottom"
        >
          <div className="bg-bg/90 backdrop-blur-xl border-t border-border px-4 py-3">
            <Link
              to="/signup"
              className="btn-primary w-full text-center block py-3 text-base"
            >
              Start Free
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
