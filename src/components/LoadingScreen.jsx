import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

export default function LoadingScreen({ onComplete }) {
  const [phase, setPhase] = useState('logo') // logo -> text -> done

  useEffect(() => {
    const timer1 = setTimeout(() => setPhase('text'), 600)
    const timer2 = setTimeout(() => {
      setPhase('done')
      // Dismiss Capacitor splash screen if available
      try {
        if (window.Capacitor && window.Capacitor.isNativePlatform()) {
          import('@capacitor/splash-screen').then(({ SplashScreen }) => {
            SplashScreen.hide()
          }).catch(() => {})
        }
      } catch {}
      if (onComplete) onComplete()
    }, 1800)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
    }
  }, [onComplete])

  return (
    <div className="fixed inset-0 z-[200] bg-bg flex items-center justify-center" role="status" aria-label="Loading application">
      <div className="flex flex-col items-center gap-5">
        {/* Animated Logo - draws in */}
        <motion.svg
          className="w-16 h-16"
          viewBox="0 0 32 32"
          fill="none"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Outer circle - draws in */}
          <motion.circle
            cx="16"
            cy="16"
            r="12"
            stroke="url(#splash-grad)"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.8, ease: 'easeInOut', delay: 0.2 }}
          />
          {/* Inner dot - scales in */}
          <motion.circle
            cx="16"
            cy="16"
            r="5"
            fill="url(#splash-grad)"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          />
          {/* Pulse animation after draw */}
          <motion.circle
            cx="16"
            cy="16"
            r="12"
            stroke="#10B981"
            strokeWidth="2"
            fill="none"
            initial={{ scale: 1, opacity: 0 }}
            animate={{ scale: [1, 1.3, 1.3], opacity: [0, 0.4, 0] }}
            transition={{ duration: 1.2, delay: 1, ease: 'easeOut' }}
          />
          <defs>
            <linearGradient id="splash-grad" x1="4" y1="4" x2="28" y2="28">
              <stop stopColor="#10B981" />
              <stop offset="1" stopColor="#34D399" />
            </linearGradient>
          </defs>
        </motion.svg>

        {/* App name - fades in */}
        <motion.div
          className="flex flex-col items-center gap-1"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: phase === 'logo' ? 0 : 1, y: phase === 'logo' ? 10 : 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="text-xl font-bold text-text-primary tracking-tight">StatusMy</span>
          <span className="text-xs text-text-muted">Uptime Monitoring</span>
        </motion.div>

        {/* Loading spinner */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: phase === 'text' || phase === 'done' ? 1 : 0 }}
          transition={{ delay: 0.2 }}
          className="w-5 h-5 border-2 border-[#10B981]/30 border-t-[#10B981] rounded-full animate-spin"
        />
      </div>
    </div>
  )
}
