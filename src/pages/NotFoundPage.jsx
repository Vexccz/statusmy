import { motion, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Home, ArrowLeft } from 'lucide-react'

export default function NotFoundPage() {
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.main
      id="main-content"
      initial={prefersReducedMotion ? {} : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={prefersReducedMotion ? {} : { opacity: 0, y: -8 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen flex items-center justify-center px-[16px]"
    >
      <div className="text-center max-w-lg">
        {/* Illustration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8"
        >
          <div className="relative inline-block">
            {/* Glow */}
            <div className="absolute inset-0 bg-brand/20 rounded-full blur-3xl scale-150" />
            
            {/* 404 text */}
            <div className="relative">
              <span className="text-[8rem] md:text-[12rem] font-bold font-display leading-none text-gradient select-none">
                404
              </span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-heading-lg text-text-primary mb-4">
            Page not found
          </h1>
          <p className="text-lg text-text-secondary mb-8 leading-relaxed">
            Looks like this page threw an unhandled exception. 
            Don't worry, we won't log this one in your dashboard.
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link to="/" className="btn-primary">
                <Home size={16} />
                Back to Home
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <button
                onClick={() => window.history.back()}
                className="btn-secondary"
              >
                <ArrowLeft size={16} />
                Go Back
              </button>
            </motion.div>
          </div>
        </motion.div>

        {/* Fun error details */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-12 p-4 rounded-lg border border-border bg-card/30 text-left max-w-sm mx-auto"
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-semantic-error" />
            <span className="text-caption font-mono text-text-muted">PageNotFoundError</span>
          </div>
          <code className="text-body-sm font-mono text-text-secondary">
            Error: The page you're looking for has been moved, deleted, or never existed in the first place.
          </code>
          <div className="mt-2 text-caption text-text-muted font-mono">
            at Router.resolve (router.js:42:15)
          </div>
        </motion.div>
      </div>
    </motion.main>
  )
}
