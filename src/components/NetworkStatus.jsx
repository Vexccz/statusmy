import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { WifiOff, Wifi, RefreshCw, CloudOff } from 'lucide-react'

/**
 * Network status banner - shows when offline or when data is stale
 */
export function NetworkStatusBanner() {
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [showBanner, setShowBanner] = useState(!navigator.onLine)

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      // Show "back online" briefly
      setShowBanner(true)
      setTimeout(() => setShowBanner(false), 3000)
    }
    const handleOffline = () => {
      setIsOnline(false)
      setShowBanner(true)
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className={`overflow-hidden ${
            isOnline
              ? 'bg-[rgba(16,185,129,0.1)] border-b border-[rgba(16,185,129,0.2)]'
              : 'bg-[rgba(239,68,68,0.1)] border-b border-[rgba(239,68,68,0.2)]'
          }`}
        >
          <div className="flex items-center justify-center gap-2 px-4 py-2">
            {isOnline ? (
              <>
                <Wifi size={14} className="text-[#10B981]" />
                <span className="text-xs text-[#10B981] font-medium">Back online</span>
              </>
            ) : (
              <>
                <WifiOff size={14} className="text-[#EF4444]" />
                <span className="text-xs text-[#EF4444] font-medium">No internet connection</span>
              </>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/**
 * Full-screen no internet state
 */
export function NoInternetScreen({ onRetry }) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6">
      <div className="text-center max-w-sm">
        <div className="w-16 h-16 rounded-2xl bg-[rgba(239,68,68,0.1)] flex items-center justify-center mx-auto mb-5">
          <WifiOff size={32} className="text-[#EF4444]" />
        </div>
        <h2 className="text-xl font-bold text-text-primary mb-2">
          No Internet Connection
        </h2>
        <p className="text-sm text-text-secondary mb-6">
          Check your connection and try again. Cached data may be shown.
        </p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#10B981] hover:bg-[#059669] text-white font-semibold text-sm transition-colors"
          >
            <RefreshCw size={16} />
            Retry
          </button>
        )}
      </div>
    </div>
  )
}

/**
 * Server unreachable screen
 */
export function ServerDownScreen({ onRetry }) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6">
      <div className="text-center max-w-sm">
        <div className="w-16 h-16 rounded-2xl bg-[rgba(245,158,11,0.1)] flex items-center justify-center mx-auto mb-5">
          <CloudOff size={32} className="text-[#F59E0B]" />
        </div>
        <h2 className="text-xl font-bold text-text-primary mb-2">
          Server Unreachable
        </h2>
        <p className="text-sm text-text-secondary mb-6">
          Our servers are temporarily unavailable. Please try again in a moment.
        </p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#10B981] hover:bg-[#059669] text-white font-semibold text-sm transition-colors"
          >
            <RefreshCw size={16} />
            Try Again
          </button>
        )}
      </div>
    </div>
  )
}

/**
 * Stale data indicator
 */
export function StaleDataBanner({ timestamp }) {
  if (!timestamp) return null
  const age = Date.now() - timestamp
  const minutes = Math.floor(age / 60000)

  let label = 'just now'
  if (minutes >= 60) label = `${Math.floor(minutes / 60)}h ago`
  else if (minutes > 0) label = `${minutes}m ago`

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[rgba(245,158,11,0.1)] border border-[rgba(245,158,11,0.2)]">
      <CloudOff size={12} className="text-[#F59E0B]" />
      <span className="text-xs text-[#F59E0B]">
        Showing cached data from {label}
      </span>
    </div>
  )
}

export default NetworkStatusBanner
