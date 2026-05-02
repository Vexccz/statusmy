import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'

const testimonials = [
  {
    quote: "StatusMy caught our payment gateway going down at 3AM. We fixed it before any customer noticed. Literally saved us thousands in lost revenue.",
    author: "Ahmad Razif",
    role: "CTO",
    company: "PayHalal",
    rating: 5,
  },
  {
    quote: "The status page alone is worth it. Our enterprise clients love the transparency, and we get fewer support tickets during maintenance windows.",
    author: "Siti Nurhaliza",
    role: "VP of Engineering",
    company: "Carsome",
    rating: 5,
  },
  {
    quote: "We monitor 200+ endpoints across Southeast Asia. StatusMy's multi-region checks give us confidence that our services are truly up everywhere.",
    author: "Wei Liang Tan",
    role: "Head of Infrastructure",
    company: "Fave",
    rating: 5,
  },
  {
    quote: "Switched from a US-based monitor to StatusMy. The latency checks from KL and Singapore are way more accurate for our ASEAN users.",
    author: "Farah Aisyah",
    role: "DevOps Lead",
    company: "Aerodyne",
    rating: 5,
  },
  {
    quote: "The Slack integration is chef's kiss. Our whole team gets notified instantly and the escalation policies mean no alert fatigue.",
    author: "Raj Kumar",
    role: "Engineering Manager",
    company: "StoreHub",
    rating: 5,
  },
]

const companyLogos = ['Grab', 'Carsome', 'Fave', 'StoreHub', 'Aerodyne', 'GoGet']

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-0.5 mb-4" role="img" aria-label={`${rating} out of 5 stars`}>
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className={`w-4 h-4 ${i < rating ? 'text-[#F7A501]' : 'text-text-muted/30'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

export default function Testimonials() {
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(1)
  const prefersReducedMotion = useReducedMotion()

  // Touch/swipe state
  const touchStartX = useRef(0)
  const touchEndX = useRef(0)
  const containerRef = useRef(null)

  const next = useCallback(() => {
    setDirection(1)
    setCurrent((prev) => (prev + 1) % testimonials.length)
  }, [])

  const prev = useCallback(() => {
    setDirection(-1)
    setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }, [])

  const goTo = (index) => {
    setDirection(index > current ? 1 : -1)
    setCurrent(index)
  }

  useEffect(() => {
    const timer = setInterval(next, 5000)
    return () => clearInterval(timer)
  }, [next])

  // Touch handlers for swipe
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX
  }

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current
    const threshold = 50
    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        next()
      } else {
        prev()
      }
    }
  }

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') prev()
    if (e.key === 'ArrowRight') next()
  }

  const variants = prefersReducedMotion
    ? {
        enter: { opacity: 0 },
        center: { opacity: 1 },
        exit: { opacity: 0 },
      }
    : {
        enter: (dir) => ({ x: dir > 0 ? 100 : -100, opacity: 0 }),
        center: { x: 0, opacity: 1 },
        exit: (dir) => ({ x: dir > 0 ? -100 : 100, opacity: 0 }),
      }

  return (
    <section id="testimonials" className="relative py-[64px] md:py-[96px]">
      {/* Background accent */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-brand/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative max-w-container mx-auto px-[16px] sm:px-[24px] lg:px-[32px]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5 }}
          className="text-center mb-[48px]"
        >
          <h2 className="font-display text-heading-lg md:text-[3rem] md:leading-[1.1] md:tracking-[-0.02em] font-bold text-text-primary mb-[16px]">
            Loved by Malaysian teams
          </h2>
          <p className="text-lg text-text-secondary">
            See why hundreds of companies across Malaysia trust StatusMy to keep their services running.
          </p>
        </motion.div>

        {/* Carousel */}
        <div
          className="max-w-3xl mx-auto"
          role="region"
          aria-label="Testimonials carousel"
          aria-roledescription="carousel"
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          <div
            ref={containerRef}
            className="relative overflow-hidden min-h-[220px] flex items-center touch-pan-y"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={current}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                className="w-full"
                role="group"
                aria-roledescription="slide"
                aria-label={`Testimonial ${current + 1} of ${testimonials.length}`}
              >
                <div className="card card-lg text-center">
                  <StarRating rating={testimonials[current].rating} />
                  <blockquote className="text-lg md:text-xl text-text-secondary leading-relaxed mb-6">
                    &ldquo;{testimonials[current].quote}&rdquo;
                  </blockquote>
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-grad-brand flex items-center justify-center text-white font-semibold text-body-sm" aria-hidden="true">
                      {testimonials[current].author.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="text-left">
                      <div className="text-body-sm font-medium text-text-primary">{testimonials[current].author}</div>
                      <div className="text-caption text-text-muted">{testimonials[current].role} at {testimonials[current].company}</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Dots navigation */}
          <div className="flex items-center justify-center gap-2 mt-6" role="tablist" aria-label="Testimonial slides">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                role="tab"
                aria-selected={i === current}
                className={`h-2.5 rounded-full transition-all duration-200 min-w-[10px] min-h-[10px] ${
                  i === current ? 'bg-brand w-6' : 'bg-text-muted/30 hover:bg-text-muted/50 w-2.5'
                }`}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
          </div>

          {/* Swipe hint on mobile */}
          <p className="text-center text-caption text-text-muted/50 mt-3 md:hidden" aria-hidden="true">
            Swipe to navigate
          </p>
        </div>

        {/* Company logos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-12 text-center"
        >
          <p className="text-caption uppercase tracking-widest text-text-muted mb-6">Trusted by teams across Malaysia</p>
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
            {companyLogos.map((name) => (
              <span key={name} className="text-base md:text-lg font-bold text-text-muted/60 hover:text-text-primary/80 transition-colors duration-200">
                {name}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
