import { useState, useEffect, useCallback } from 'react'
import { getOfflineQueue, removeFromQueue } from '../utils/offlineCache'
import api from '../utils/api'

/**
 * Hook to detect online/offline status and sync queued actions
 */
export function useOffline() {
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [isSyncing, setIsSyncing] = useState(false)
  const [pendingActions, setPendingActions] = useState(getOfflineQueue().length)

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      syncQueue()
    }
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const syncQueue = useCallback(async () => {
    const queue = getOfflineQueue()
    if (queue.length === 0) return

    setIsSyncing(true)
    for (const action of queue) {
      try {
        switch (action.method) {
          case 'POST':
            await api.post(action.url, action.data)
            break
          case 'PUT':
            await api.put(action.url, action.data)
            break
          case 'DELETE':
            await api.delete(action.url)
            break
          default:
            break
        }
        removeFromQueue(action.id)
      } catch (err) {
        // If it's a network error, stop syncing
        if (!navigator.onLine) break
        // If it's a 4xx error, remove from queue (won't succeed on retry)
        if (err.response?.status >= 400 && err.response?.status < 500) {
          removeFromQueue(action.id)
        }
      }
    }
    setPendingActions(getOfflineQueue().length)
    setIsSyncing(false)
  }, [])

  return {
    isOnline,
    isSyncing,
    pendingActions,
    syncQueue,
  }
}

export default useOffline
