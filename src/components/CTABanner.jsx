import { motion, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'

export default function CTABanner() {
  const prefersReducedMotion = useReducedMotion()

  return (
    <section className="relative py-[64px] md:py-[96px] overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#10B981] via-[#059669] to-[#047857]" />
      
      {/* Pattern overlay */}
      <div className="absolute inset-0 opacity-[0.07]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }} />

      {/* Glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-white/5 rounded-full blur-[100px]" />

      <div className="relative max-w-container mx-auto px-[16px] sm:px-[24px] lg:px-[32px] text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="font-display text-heading-lg md:text-[3rem] md:leading-[1.1] md:tracking-[-0.02em] font-bold text-white mb-6">
            Ready to stop losing customers to downtime?
          </h2>
          <p className="max-w-xl mx-auto text-lg text-white/70 mb-10">
            Join hundreds of Malaysian companies who trust StatusMy to keep their services running. Start free, no credit card required.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                to="/signup"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 text-sm font-semibold text-[#059669] bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-150 min-h-[44px]"
              >
                Start Monitoring Free
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                to="/docs"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 text-sm font-semibold text-white border border-white/30 rounded-xl hover:bg-white/10 transition-all duration-150 min-h-[44px]"
              >
                Talk to Sales
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
