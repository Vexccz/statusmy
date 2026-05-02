/**
 * Offline Cache Utility
 * Caches API responses in localStorage for offline access
 */

const CACHE_PREFIX = 'statusmy_cache_'
const QUEUE_KEY = 'statusmy_offline_queue'
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes considered fresh

/**
 * Save API response to cache
 */
export function cacheResponse(key, data) {
  try {
    const entry = {
      data,
      timestamp: Date.now(),
    }
    localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(entry))
  } catch (err) {
    // localStorage full - clear old entries
    clearOldCache()
    try {
      localStorage.setItem(CACHE_PREFIX + key, JSON.stringify({ data, timestamp: Date.now() }))
    } catch {
      console.warn('[OfflineCache] Storage full, cannot cache')
    }
  }
}

/**
 * Get cached response
 * @returns {{ data: any, timestamp: number, isStale: boolean } | null}
 */
export function getCachedResponse(key) {
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + key)
    if (!raw) return null
    const entry = JSON.parse(raw)
    return {
      ...entry,
      isStale: Date.now() - entry.timestamp > CACHE_TTL,
    }
  } catch {
    return null
  }
}

/**
 * Clear old cache entries (older than 24h)
 */
export function clearOldCache() {
  const maxAge = 24 * 60 * 60 * 1000
  const now = Date.now()
  const keys = Object.keys(localStorage).filter((k) => k.startsWith(CACHE_PREFIX))
  keys.forEach((key) => {
    try {
      const entry = JSON.parse(localStorage.getItem(key))
      if (now - entry.timestamp > maxAge) {
        localStorage.removeItem(key)
      }
    } catch {
      localStorage.removeItem(key)
    }
  })
}

/**
 * Queue an action for later sync
 */
export function queueOfflineAction(action) {
  try {
    const queue = getOfflineQueue()
    queue.push({
      ...action,
      queuedAt: Date.now(),
      id: Math.random().toString(36).slice(2),
    })
    localStorage.setItem(QUEUE_KEY, JSON.stringify(queue))
  } catch {
    console.warn('[OfflineCache] Cannot queue action')
  }
}

/**
 * Get pending offline actions
 */
export function getOfflineQueue() {
  try {
    const raw = localStorage.getItem(QUEUE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

/**
 * Remove action from queue after successful sync
 */
export function removeFromQueue(actionId) {
  const queue = getOfflineQueue().filter((a) => a.id !== actionId)
  localStorage.setItem(QUEUE_KEY, JSON.stringify(queue))
}

/**
 * Clear entire offline queue
 */
export function clearOfflineQueue() {
  localStorage.removeItem(QUEUE_KEY)
}

/**
 * Generate cache key from API path
 */
export function getCacheKey(url, params) {
  const paramStr = params ? JSON.stringify(params) : ''
  return `${url}${paramStr}`.replace(/[^a-zA-Z0-9]/g, '_')
}

export default {
  cache: cacheResponse,
  get: getCachedResponse,
  clearOld: clearOldCache,
  queueAction: queueOfflineAction,
  getQueue: getOfflineQueue,
  removeFromQueue,
  clearQueue: clearOfflineQueue,
  getCacheKey,
}
