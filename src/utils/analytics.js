/**
 * Analytics Placeholder
 * Abstract interface - plug in Mixpanel/PostHog/Amplitude later
 */

const DEBUG = import.meta.env.DEV

// Analytics provider interface
let provider = null

/**
 * Initialize analytics with a provider
 * @param {{ track: Function, identify: Function, page: Function }} analyticsProvider
 */
export function initAnalytics(analyticsProvider) {
  provider = analyticsProvider
}

/**
 * Identify a user
 */
export function identify(userId, traits = {}) {
  if (DEBUG) console.log('[Analytics] identify:', userId, traits)
  if (provider?.identify) provider.identify(userId, traits)
}

/**
 * Track an event
 */
export function track(event, properties = {}) {
  if (DEBUG) console.log('[Analytics] track:', event, properties)
  if (provider?.track) provider.track(event, properties)
}

/**
 * Track a page view
 */
export function pageView(pageName, properties = {}) {
  if (DEBUG) console.log('[Analytics] page:', pageName, properties)
  if (provider?.page) provider.page(pageName, properties)
}

/**
 * Reset analytics (on logout)
 */
export function resetAnalytics() {
  if (DEBUG) console.log('[Analytics] reset')
  if (provider?.reset) provider.reset()
}

// ── Pre-defined Events ─────────────────────────────────────

export const Events = {
  LOGIN: 'login',
  SIGNUP: 'signup',
  LOGOUT: 'logout',
  MONITOR_CREATED: 'monitor_created',
  MONITOR_DELETED: 'monitor_deleted',
  ALERT_TRIGGERED: 'alert_triggered',
  ALERT_CHANNEL_CREATED: 'alert_channel_created',
  INCIDENT_CREATED: 'incident_created',
  INCIDENT_RESOLVED: 'incident_resolved',
  PAGE_VIEW: 'page_view',
  PULL_TO_REFRESH: 'pull_to_refresh',
  NOTIFICATION_TAPPED: 'notification_tapped',
  APP_OPENED: 'app_opened',
  APP_BACKGROUNDED: 'app_backgrounded',
}

// ── Convenience Methods ────────────────────────────────────

export function trackLogin(method = 'email') {
  track(Events.LOGIN, { method })
}

export function trackSignup(method = 'email') {
  track(Events.SIGNUP, { method })
}

export function trackMonitorCreated(monitorType) {
  track(Events.MONITOR_CREATED, { type: monitorType })
}

export function trackAlertTriggered(channelType, monitorName) {
  track(Events.ALERT_TRIGGERED, { channel_type: channelType, monitor: monitorName })
}

export function trackPageView(page) {
  pageView(page, { timestamp: Date.now() })
}

export default {
  init: initAnalytics,
  identify,
  track,
  pageView,
  reset: resetAnalytics,
  Events,
  trackLogin,
  trackSignup,
  trackMonitorCreated,
  trackAlertTriggered,
  trackPageView,
}
