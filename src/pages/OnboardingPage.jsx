import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Activity, Bell, BarChart3, ChevronRight } from 'lucide-react'

const slides = [
  {
    icon: Activity,
    title: 'Welcome to StatusMy',
    description: 'Monitor your websites and APIs 24/7. Get instant alerts when things go down.',
    color: '#10B981',
  },
  {
    icon: BarChart3,
    title: 'Real-time Monitoring',
    description: 'Track uptime, response times, and performance across all your services from one dashboard.',
    color: '#3B82F6',
  },
  {
    icon: Bell,
    title: 'Instant Alerts',
    description: 'Get notified via email, Discord, Slack, Telegram, or webhooks the moment something goes wrong.',
    color: '#F59E0B',
  },
]

export default function OnboardingPage() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const navigate = useNavigate()

  const completeOnboarding = () => {
    localStorage.setItem('onboarding_completed', 'true')
    navigate('/login', { replace: true })
  }

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1)
    } else {
      completeOnboarding()
    }
  }

  const slide = slides[currentSlide]
  const Icon = slide.icon

  return (
    <div className="fixed inset-0 bg-bg flex flex-col items-center justify-between p-6 safe-area-top safe-area-bottom">
      {/* Skip button */}
      <div className="w-full flex justify-end">
        <button
          onClick={completeOnboarding}
          className="text-sm text-text-muted hover:text-text-primary transition-colors px-3 py-1.5 rounded-lg"
        >
          Skip
        </button>
      </div>

      {/* Slide content */}
      <div className="flex-1 flex flex-col items-center justify-center max-w-sm text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center"
          >
            {/* Icon */}
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center mb-8"
              style={{ background: `${slide.color}15` }}
            >
              <Icon size={40} style={{ color: slide.color }} />
            </div>

            {/* Title */}
            <h1 className="text-2xl font-bold text-text-primary mb-4">
              {slide.title}
            </h1>

            {/* Description */}
            <p className="text-base text-text-secondary leading-relaxed">
              {slide.description}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom controls */}
      <div className="w-full flex flex-col items-center gap-6">
        {/* Dots indicator */}
        <div className="flex items-center gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`rounded-full transition-all duration-300 ${
                idx === currentSlide
                  ? 'w-6 h-2 bg-[#10B981]'
                  : 'w-2 h-2 bg-text-muted/30'
              }`}
            />
          ))}
        </div>

        {/* Next/Get Started button */}
        <button
          onClick={nextSlide}
          className="w-full max-w-xs flex items-center justify-center gap-2 h-12 rounded-xl bg-[#10B981] hover:bg-[#059669] active:bg-[#047857] text-white font-semibold text-base transition-colors"
        >
          {currentSlide === slides.length - 1 ? 'Get Started' : 'Next'}
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  )
}
