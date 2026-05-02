import { useState, useEffect, useCallback, useRef } from 'react'
import api from '../utils/api'

/**
 * Custom hook for API calls with loading/error states.
 * @param {string} url - API endpoint (relative to baseURL)
 * @param {object} options - { immediate: true, interval: null, method: 'GET' }
 * @returns {{ data, loading, error, refetch }}
 */
export default function useApi(url, options = {}) {
  const { immediate = true, interval = null } = options
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(immediate)
  const [error, setError] = useState(null)
  const intervalRef = useRef(null)
  const mountedRef = useRef(true)

  const fetchData = useCallback(async () => {
    if (!url) return
    try {
      setLoading((prev) => (data === null ? true : prev))
      setError(null)
      const res = await api.get(url)
      if (mountedRef.current) {
        setData(res.data.data !== undefined ? res.data.data : res.data)
        setLoading(false)
      }
    } catch (err) {
      if (mountedRef.current) {
        setError(err.response?.data?.message || err.message || 'Something went wrong')
        setLoading(false)
      }
    }
  }, [url])

  useEffect(() => {
    mountedRef.current = true
    if (immediate && url) {
      fetchData()
    }

    if (interval && url) {
      intervalRef.current = setInterval(fetchData, interval)
    }

    return () => {
      mountedRef.current = false
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [fetchData, immediate, interval, url])

  return { data, loading, error, refetch: fetchData }
}
