import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, XCircle, X } from 'lucide-react'

// Global toast state
let toastListeners = []
let toastId = 0

export function showToast({ type = 'info', title, message, duration = 5000 }) {
  const id = ++toastId
  const toast = { id, type, title, message, duration }
  toastListeners.forEach((listener) => listener(toast))
  return id
}

export function ToastContainer() {
  const [toasts, setToasts] = useState([])

  useEffect(() => {
    const listener = (toast) => {
      setToasts((prev) => [...prev, toast])
    }
    toastListeners.push(listener)
    return () => {
      toastListeners = toastListeners.filter((l) => l !== listener)
    }
  }, [])

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
        ))}
      </AnimatePresence>
    </div>
  )
}

function ToastItem({ toast, onRemove }) {
  useEffect(() => {
    if (toast.duration > 0) {
      const timer = setTimeout(() => onRemove(toast.id), toast.duration)
      return () => clearTimeout(timer)
    }
  }, [toast.id, toast.duration, onRemove])

  const isDown = toast.type === 'down' || toast.type === 'error'
  const isUp = toast.type === 'up' || toast.type === 'success'

  const bgColor = isDown
    ? 'rgba(239, 68, 68, 0.95)'
    : isUp
    ? 'rgba(16, 185, 129, 0.95)'
    : 'rgba(59, 130, 246, 0.95)'

  return (
    <motion.div
      initial={{ opacity: 0, x: 50, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 50, scale: 0.95 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="pointer-events-auto rounded-lg shadow-lg p-4 flex items-start gap-3 text-white"
      style={{ background: bgColor, backdropFilter: 'blur(8px)' }}
    >
      <div className="flex-shrink-0 mt-0.5">
        {isDown ? <XCircle size={18} /> : <CheckCircle2 size={18} />}
      </div>
      <div className="flex-1 min-w-0">
        {toast.title && (
          <p className="text-sm font-semibold">{toast.title}</p>
        )}
        {toast.message && (
          <p className="text-sm opacity-90 mt-0.5">{toast.message}</p>
        )}
      </div>
      <button
        onClick={() => onRemove(toast.id)}
        className="flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity"
      >
        <X size={16} />
      </button>
    </motion.div>
  )
}

export default ToastContainer
