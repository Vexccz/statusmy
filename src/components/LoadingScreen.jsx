import { motion } from 'framer-motion'

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-[200] bg-bg flex items-center justify-center" role="status" aria-label="Loading application">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col items-center gap-5"
      >
        {/* Logo */}
        <motion.svg
          className="w-12 h-12"
          viewBox="0 0 32 32"
          fill="none"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <circle cx="16" cy="16" r="12" stroke="url(#loading-grad)" strokeWidth="3" fill="none" />
          <circle cx="16" cy="16" r="5" fill="url(#loading-grad)" />
          <defs>
            <linearGradient id="loading-grad" x1="4" y1="4" x2="28" y2="28">
              <stop stopColor="#10B981" />
              <stop offset="1" stopColor="#34D399" />
            </linearGradient>
          </defs>
        </motion.svg>

        {/* Spinner */}
        <div className="w-6 h-6 border-2 border-brand/30 border-t-brand rounded-full animate-spin" />

        <span className="text-body-sm text-text-muted">Loading StatusMy...</span>
      </motion.div>
    </div>
  )
}
