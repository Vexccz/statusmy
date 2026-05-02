import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

const subscriberAvatars = [
  { initials: 'JK', color: 'bg-brand' },
  { initials: 'AR', color: 'bg-[#7c3aed]' },
  { initials: 'SM', color: 'bg-[#ec4899]' },
  { initials: 'DL', color: 'bg-[#30CF79]' },
  { initials: 'TW', color: 'bg-[#F7A501]' },
]

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const prefersReducedMotion = useReducedMotion()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (email) {
      setSubmitted(true)
      setEmail('')
    }
  }

  return (
    <section className="relative py-[64px] md:py-[96px]">
      <div className="max-w-container mx-auto px-[16px] sm:px-[24px] lg:px-[32px]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto text-center"
        >
          {/* Social proof */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="flex -space-x-2">
              {subscriberAvatars.map((avatar) => (
                <div
                  key={avatar.initials}
                  className={`w-8 h-8 rounded-full ${avatar.color} flex items-center justify-center text-white text-[10px] font-bold border-2 border-bg`}
                >
                  {avatar.initials}
                </div>
              ))}
            </div>
            <span className="text-body-sm text-text-secondary">
              Join <span className="font-semibold text-text-primary">5,000+</span> engineers
            </span>
          </div>

          <h2 className="font-display text-heading-lg md:text-[2.5rem] md:leading-[1.1] md:tracking-[-0.02em] font-bold text-text-primary mb-[16px]">
            Stay in the loop
          </h2>
          <p className="text-lg text-text-secondary mb-[32px]">
            Get the latest updates on new features, best practices, and engineering insights delivered to your inbox.
          </p>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="p-[24px] rounded-md border border-semantic-success/30 bg-semantic-success/5"
            >
              <div className="text-semantic-success font-medium">✓ You're subscribed!</div>
              <p className="text-body-sm text-text-muted mt-[4px]">We'll keep you posted on what's new.</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-[12px] max-w-md mx-auto" aria-label="Newsletter subscription">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                required
                className="flex-1 h-[44px] px-[16px] rounded-sm bg-card/50 border border-border text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand/60 focus:ring-1 focus:ring-brand/30 transition-all duration-micro"
              />
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn-primary whitespace-nowrap"
              >
                Subscribe
              </motion.button>
            </form>
          )}

          <p className="text-caption text-text-muted mt-[16px]">
            No spam. Unsubscribe anytime.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
