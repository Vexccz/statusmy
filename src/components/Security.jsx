import { motion, useReducedMotion } from 'framer-motion'

const badges = [
  { name: 'SOC 2 Type II', icon: '🛡️', desc: 'Audited annually' },
  { name: 'GDPR', icon: '🇪🇺', desc: 'EU compliant' },
  { name: 'HIPAA', icon: '🏥', desc: 'Healthcare ready' },
  { name: 'ISO 27001', icon: '✓', desc: 'Certified' },
  { name: 'CCPA', icon: '🔒', desc: 'California compliant' },
  { name: 'PCI DSS', icon: '💳', desc: 'Payment secure' },
]

const badgeVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 20 },
  visible: (i) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.4, ease: [0.16, 1, 0.3, 1] },
  }),
}

export default function Security() {
  const prefersReducedMotion = useReducedMotion()

  return (
    <section id="security" className="relative py-[64px] md:py-[96px]">
      <div className="max-w-container mx-auto px-[16px] sm:px-[24px] lg:px-[32px]">
        <div className="relative rounded-xl border border-border bg-card/20 backdrop-blur-sm overflow-hidden p-[32px] md:p-[64px]">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-[0.02]" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: '24px 24px'
          }} />

          <div className="relative grid lg:grid-cols-2 gap-[48px] items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="font-display text-heading-lg md:text-[2.5rem] md:leading-[1.1] md:tracking-[-0.02em] font-bold text-text-primary mb-[16px]">
                Enterprise-grade security
              </h2>
              <p className="text-lg text-text-secondary mb-[32px] leading-relaxed">
                Your monitoring data is our top priority. StatusMy is compliant with the most rigorous 
                industry standards including Malaysia's PDPA.
              </p>

              <ul className="space-y-[12px]">
                {[
                  'End-to-end encryption for all data in transit and at rest',
                  'Data hosted in ASEAN region for low latency',
                  'Role-based access control with SSO/SAML support',
                  'PDPA compliant data handling and storage',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-[12px]">
                    <svg className="w-5 h-5 text-semantic-success mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-body-sm text-text-secondary">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-[16px]">
              {badges.map((badge, i) => (
                <motion.div
                  key={badge.name}
                  custom={i}
                  variants={badgeVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="card flex flex-col items-center justify-center p-[20px] hover:border-brand/20 transition-colors duration-micro"
                >
                  <span className="text-3xl mb-[8px]">{badge.icon}</span>
                  <span className="text-body-sm font-medium text-text-primary text-center">{badge.name}</span>
                  <span className="text-caption text-text-muted mt-[4px]">{badge.desc}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
