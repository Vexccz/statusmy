import { useState, useRef, useCallback, useEffect } from 'react'
import { hapticHeavy } from '../utils/haptics'

/**
 * Pull-to-refresh hook for mobile
 * @param {Function} onRefresh - async function to call on refresh
 * @param {object} options - { threshold, maxPull, disabled }
 */
export function usePullToRefresh(onRefresh, options = {}) {
  const { threshold = 80, maxPull = 120, disabled = false } = options
  const [pulling, setPulling] = useState(false)
  const [pullDistance, setPullDistance] = useState(0)
  const [refreshing, setRefreshing] = useState(false)
  const startY = useRef(0)
  const currentY = useRef(0)
  const isPulling = useRef(false)
  const containerRef = useRef(null)

  const handleTouchStart = useCallback((e) => {
    if (disabled || refreshing) return
    // Only trigger if scrolled to top
    const scrollTop = containerRef.current?.scrollTop ?? window.scrollY ?? 0
    if (scrollTop > 5) return
    startY.current = e.touches[0].clientY
    isPulling.current = true
  }, [disabled, refreshing])

  const handleTouchMove = useCallback((e) => {
    if (!isPulling.current || disabled || refreshing) return
    currentY.current = e.touches[0].clientY
    const diff = currentY.current - startY.current

    if (diff > 0) {
      // Apply resistance
      const distance = Math.min(diff * 0.5, maxPull)
      setPullDistance(distance)
      setPulling(true)

      // Prevent default scroll when pulling
      if (distance > 10) {
        e.preventDefault()
      }
    } else {
      isPulling.current = false
      setPulling(false)
      setPullDistance(0)
    }
  }, [disabled, refreshing, maxPull])

  const handleTouchEnd = useCallback(async () => {
    if (!isPulling.current || disabled) return
    isPulling.current = false

    if (pullDistance >= threshold && !refreshing) {
      // Trigger refresh
      hapticHeavy()
      setRefreshing(true)
      setPullDistance(threshold * 0.6) // Keep indicator visible during refresh
      try {
        await onRefresh()
      } catch (err) {
        console.error('[PullToRefresh] Error:', err)
      } finally {
        setRefreshing(false)
        setPullDistance(0)
        setPulling(false)
      }
    } else {
      setPullDistance(0)
      setPulling(false)
    }
  }, [pullDistance, threshold, refreshing, onRefresh, disabled])

  // Attach touch listeners
  useEffect(() => {
    const container = containerRef.current || document
    const opts = { passive: false }

    container.addEventListener('touchstart', handleTouchStart, { passive: true })
    container.addEventListener('touchmove', handleTouchMove, opts)
    container.addEventListener('touchend', handleTouchEnd, { passive: true })

    return () => {
      container.removeEventListener('touchstart', handleTouchStart)
      container.removeEventListener('touchmove', handleTouchMove)
      container.removeEventListener('touchend', handleTouchEnd)
    }
  }, [handleTouchStart, handleTouchMove, handleTouchEnd])

  const progress = Math.min(pullDistance / threshold, 1)

  return {
    containerRef,
    pulling,
    pullDistance,
    refreshing,
    progress,
    PullIndicator: () => (
      (pulling || refreshing) ? (
        <div
          className="flex items-center justify-center transition-all duration-200 overflow-hidden"
          style={{ height: pulling || refreshing ? `${Math.max(pullDistance, refreshing ? 48 : 0)}px` : '0px' }}
        >
          <div className={`flex items-center gap-2 ${refreshing ? 'animate-pulse' : ''}`}>
            <div
              className={`w-5 h-5 border-2 border-[#10B981] border-t-transparent rounded-full ${refreshing ? 'animate-spin' : ''}`}
              style={{ transform: !refreshing ? `rotate(${progress * 360}deg)` : undefined }}
            />
            <span className="text-xs text-text-muted">
              {refreshing ? 'Refreshing...' : progress >= 1 ? 'Release to refresh' : 'Pull to refresh'}
            </span>
          </div>
        </div>
      ) : null
    ),
  }
}

export default usePullToRefresh
