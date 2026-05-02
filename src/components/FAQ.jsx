import { useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'

const faqs = [
  {
    question: 'How much does StatusMy cost?',
    answer: 'StatusMy offers a generous free tier with 5 monitors. The Pro plan starts at $9/month with 50 monitors, and the Business plan at $29/month with unlimited monitors. All paid plans include a 14-day free trial.',
  },
  {
    question: 'How long does it take to set up?',
    answer: 'Most teams are up and running in under 2 minutes. Just add your URL, choose your check interval, and configure your alert channels. No code or SDK required.',
  },
  {
    question: 'Where are your monitoring nodes located?',
    answer: 'StatusMy has monitoring nodes in 50+ locations worldwide, with strong coverage in Southeast Asia including Kuala Lumpur, Singapore, Jakarta, Bangkok, and Ho Chi Minh City. All data is encrypted in transit and at rest.',
  },
  {
    question: 'What types of monitoring do you support?',
    answer: 'StatusMy supports HTTP/HTTPS, TCP, UDP, DNS, ICMP (ping), SSL certificate, domain expiry, and cron job monitoring. We also offer keyword checks, response time tracking, and multi-step API monitoring.',
  },
  {
    question: 'Can I create a public status page?',
    answer: 'Yes! Every plan includes a status page. Free plans get a basic StatusMy-branded page. Pro and Business plans support custom domains, branding, and subscriber notifications.',
  },
  {
    question: 'What alert channels do you support?',
    answer: 'Free plans include email alerts. Pro plans add SMS, Slack, and Telegram. Business plans include all channels plus webhooks, PagerDuty, Microsoft Teams, and custom integrations via our API.',
  },
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null)
  const prefersReducedMotion = useReducedMotion()

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  const handleKeyDown = (e, index) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      toggle(index)
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      const next = (index + 1) % faqs.length
      document.getElementById(`faq-button-${next}`)?.focus()
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      const prev = (index - 1 + faqs.length) % faqs.length
      document.getElementById(`faq-button-${prev}`)?.focus()
    } else if (e.key === 'Home') {
      e.preventDefault()
      document.getElementById('faq-button-0')?.focus()
    } else if (e.key === 'End') {
      e.preventDefault()
      document.getElementById(`faq-button-${faqs.length - 1}`)?.focus()
    }
  }

  return (
    <section className="relative py-[64px] md:py-[96px]">
      {/* Decorative orb */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute bottom-1/4 left-0 w-[300px] h-[300px] bg-[#7c3aed]/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative max-w-container mx-auto px-[16px] sm:px-[24px] lg:px-[32px]">
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="font-display text-heading-lg md:text-[3rem] md:leading-[1.1] md:tracking-[-0.02em] font-bold text-text-primary mb-4">
            Frequently asked questions
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-text-secondary">
            Everything you need to know about StatusMy. Can't find what you're looking for? Contact our support team.
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto space-y-3" role="region" aria-label="Frequently asked questions">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={prefersReducedMotion ? {} : { opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.3 }}
              className="rounded-lg border border-border bg-card/30 overflow-hidden"
            >
              <button
                id={`faq-button-${i}`}
                onClick={() => toggle(i)}
                onKeyDown={(e) => handleKeyDown(e, i)}
                aria-expanded={openIndex === i}
                aria-controls={`faq-panel-${i}`}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-card/50 transition-colors duration-150 min-h-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-inset"
              >
                <span className="text-body-sm md:text-base font-medium text-text-primary pr-4">
                  {faq.question}
                </span>
                <motion.svg
                  animate={{ rotate: openIndex === i ? 180 : 0 }}
                  transition={{ duration: 0.25 }}
                  className="w-5 h-5 text-text-muted flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </motion.svg>
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    id={`faq-panel-${i}`}
                    role="region"
                    aria-labelledby={`faq-button-${i}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: prefersReducedMotion ? 0 : 0.25, ease: [0.4, 0, 0.2, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 text-body-sm text-text-secondary leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
