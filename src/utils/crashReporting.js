/**
 * Crash Reporting Placeholder
 * Abstract interface - plug in Sentry/Bugsnag/Crashlytics later
 */

const DEBUG = import.meta.env.DEV

let provider = null
let initialized = false

/**
 * Initialize crash reporting with a provider
 * @param {{ captureException: Function, captureMessage: Function, setUser: Function }} crashProvider
 */
export function initCrashReporting(crashProvider) {
  provider = crashProvider
  initialized = true
}

/**
 * Capture an exception
 */
export function captureException(error, context = {}) {
  if (DEBUG) console.error('[CrashReporting] Exception:', error, context)
  if (provider?.captureException) {
    provider.captureException(error, { extra: context })
  }
}

/**
 * Capture a message/breadcrumb
 */
export function captureMessage(message, level = 'info', context = {}) {
  if (DEBUG) console.log(`[CrashReporting] ${level}:`, message, context)
  if (provider?.captureMessage) {
    provider.captureMessage(message, { level, extra: context })
  }
}

/**
 * Set user context for crash reports
 */
export function setUser(user) {
  if (provider?.setUser) {
    provider.setUser(user ? { id: user.id, email: user.email, name: user.name } : null)
  }
}

/**
 * Add breadcrumb for debugging
 */
export function addBreadcrumb(message, category = 'app', data = {}) {
  if (provider?.addBreadcrumb) {
    provider.addBreadcrumb({ message, category, data, timestamp: Date.now() })
  }
}

/**
 * Setup global error handlers
 * Call this once at app startup
 */
export function setupGlobalErrorHandlers() {
  // Unhandled errors
  window.addEventListener('error', (event) => {
    captureException(event.error || new Error(event.message), {
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
    })
  })

  // Unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    const error = event.reason instanceof Error
      ? event.reason
      : new Error(String(event.reason))
    captureException(error, { type: 'unhandledrejection' })
  })

  if (DEBUG) console.log('[CrashReporting] Global error handlers installed')
}

export default {
  init: initCrashReporting,
  captureException,
  captureMessage,
  setUser,
  addBreadcrumb,
  setupGlobalErrorHandlers,
}
