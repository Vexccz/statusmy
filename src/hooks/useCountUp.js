import { useState, useEffect, useRef } from 'react'

export function useCountUp(end, duration = 2000, decimals = 0) {
  const [count, setCount] = useState('0')
  const [hasStarted, setHasStarted] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasStarted(true)
          observer.unobserve(element)
        }
      },
      { threshold: 0.3 }
    )

    observer.observe(element)
    return () => observer.unobserve(element)
  }, [])

  useEffect(() => {
    if (!hasStarted) return

    let startTime = null
    let animationFrame = null

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      const value = eased * end

      if (decimals > 0) {
        setCount(value.toFixed(decimals))
      } else {
        setCount(Math.floor(value).toString())
      }

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)
    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame)
    }
  }, [hasStarted, end, duration, decimals])

  return [ref, count]
}
