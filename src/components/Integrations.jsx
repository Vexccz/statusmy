import { motion, useReducedMotion } from 'framer-motion'

const integrations = [
  { name: 'AWS', color: '#FF9900' },
  { name: 'GitHub', color: '#f5f5f5' },
  { name: 'Slack', color: '#4A154B' },
  { name: 'Jira', color: '#0052CC' },
  { name: 'VS Code', color: '#007ACC' },
  { name: 'Vercel', color: '#f5f5f5' },
  { name: 'GitLab', color: '#FC6D26' },
  { name: 'Bitbucket', color: '#0052CC' },
  { name: 'PagerDuty', color: '#06AC38' },
  { name: 'Datadog', color: '#632CA6' },
  { name: 'Netlify', color: '#00C7B7' },
  { name: 'Heroku', color: '#430098' },
  { name: 'Azure', color: '#0078D4' },
  { name: 'Terraform', color: '#7B42BC' },
  { name: 'Docker', color: '#2496ED' },
  { name: 'Webpack', color: '#8DD6F9' },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
}

export default function Integrations() {
  const prefersReducedMotion = useReducedMotion()

  return (
    <section className="relative py-[64px] md:py-[96px]">
      {/* Decorative orb */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute top-1/2 left-1/4 w-[350px] h-[350px] bg-[#ec4899]/5 rounded-full blur-[100px]" />
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
            Works with your <span className="text-gradient">stack</span>
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-text-secondary">
            StatusMy integrates with the tools you already use. Connect your workflow in minutes.
          </p>
        </motion.div>

        <motion.div
          variants={prefersReducedMotion ? {} : containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4"
        >
          {integrations.map((item) => (
            <motion.div
              key={item.name}
              variants={prefersReducedMotion ? {} : cardVariants}
              className="group flex flex-col items-center justify-center p-5 rounded-lg bg-card/50 border border-border hover:border-brand/30 hover:bg-card transition-all duration-200 cursor-pointer min-h-[80px]"
            >
              <span
                className="text-lg font-bold mb-2 transition-transform duration-200 group-hover:scale-110"
                style={{ color: item.color }}
                aria-hidden="true"
              >
                {item.name.slice(0, 2).toUpperCase()}
              </span>
              <span className="text-caption text-text-muted group-hover:text-text-secondary transition-colors">
                {item.name}
              </span>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-center mt-10"
        >
          <a href="#" className="btn-secondary btn-sm inline-flex min-h-[44px] items-center">
            View all integrations
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  )
}
