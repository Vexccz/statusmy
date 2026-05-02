import axios from 'axios'
import { cacheResponse, getCachedResponse, getCacheKey, queueOfflineAction } from './offlineCache'

// Determine API base URL
function getBaseURL() {
  // If running in Capacitor native app, use production URL
  try {
    if (window.Capacitor && window.Capacitor.isNativePlatform()) {
      return 'https://statusmy-api.up.railway.app/api'
    }
  } catch {}
  // Web: use relative path (Vite proxy handles it)
  return '/api'
}

const api = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
})

// ── Retry Config ───────────────────────────────────────────

const MAX_RETRIES = 3
const RETRY_STATUS_CODES = [429, 500, 502, 503, 504]
const BASE_DELAY = 1000 // 1 second

function getRetryDelay(retryCount, retryAfter) {
  if (retryAfter) {
    return parseInt(retryAfter, 10) * 1000
  }
  // Exponential backoff: 1s, 2s, 4s
  return BASE_DELAY * Math.pow(2, retryCount)
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// ── Request Interceptor ────────────────────────────────────

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    // Track retry count
    config.__retryCount = config.__retryCount || 0
    return config
  },
  (error) => Promise.reject(error)
)

// ── Response Interceptor ───────────────────────────────────

api.interceptors.response.use(
  (response) => {
    // Cache successful GET responses
    if (response.config.method === 'get') {
      const key = getCacheKey(response.config.url, response.config.params)
      cacheResponse(key, response.data)
    }
    return response
  },
  async (error) => {
    const config = error.config

    // ── Retry Logic (429/5xx) ──────────────────────────
    if (
      config &&
      config.__retryCount < MAX_RETRIES &&
      error.response &&
      RETRY_STATUS_CODES.includes(error.response.status)
    ) {
      config.__retryCount += 1
      const retryAfter = error.response.headers?.['retry-after']
      const delay = getRetryDelay(config.__retryCount, retryAfter)

      console.log(
        `[API] Retry ${config.__retryCount}/${MAX_RETRIES} for ${config.url} after ${delay}ms`
      )

      await sleep(delay)
      return api(config)
    }

    // ── Token Refresh on 401 ───────────────────────────
    if (error.response?.status === 401 && !config.__isRetryAfterRefresh) {
      const refreshToken = localStorage.getItem('refreshToken')

      if (refreshToken) {
        try {
          const refreshRes = await axios.post('/api/auth/refresh', {
            refreshToken,
          })
          const { token: newToken, refreshToken: newRefreshToken } = refreshRes.data

          localStorage.setItem('token', newToken)
          if (newRefreshToken) {
            localStorage.setItem('refreshToken', newRefreshToken)
          }

          // Retry original request with new token
          config.__isRetryAfterRefresh = true
          config.headers.Authorization = `Bearer ${newToken}`
          return api(config)
        } catch {
          // Refresh failed - logout
          localStorage.removeItem('token')
          localStorage.removeItem('refreshToken')
          localStorage.removeItem('user')
          if (
            !window.location.pathname.includes('/login') &&
            !window.location.pathname.includes('/signup')
          ) {
            window.location.href = '/login'
          }
          return Promise.reject(error)
        }
      }

      // No refresh token - logout
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      if (
        !window.location.pathname.includes('/login') &&
        !window.location.pathname.includes('/signup')
      ) {
        window.location.href = '/login'
      }
    }

    // ── Offline: Return cached data for GET requests ───
    if (!navigator.onLine && config?.method === 'get') {
      const key = getCacheKey(config.url, config.params)
      const cached = getCachedResponse(key)
      if (cached) {
        return {
          data: cached.data,
          status: 200,
          statusText: 'OK (cached)',
          headers: {},
          config,
          __fromCache: true,
          __cacheTimestamp: cached.timestamp,
        }
      }
    }

    // ── Offline: Queue write operations ────────────────
    if (!navigator.onLine && config && ['post', 'put', 'delete'].includes(config.method)) {
      queueOfflineAction({
        method: config.method.toUpperCase(),
        url: config.url,
        data: config.data ? JSON.parse(config.data) : undefined,
      })
      return Promise.reject(
        Object.assign(new Error('Queued for offline sync'), { __offlineQueued: true })
      )
    }

    return Promise.reject(error)
  }
)

export default api
