import { motion, useReducedMotion } from 'framer-motion'

// Official brand icons via Simple Icons CDN (monochrome SVG, tinted via currentColor)
// Icon slugs: https://simpleicons.org/
const integrations = [
  { name: 'AWS', slug: 'amazonaws', color: '#FF9900' },
  { name: 'GitHub', slug: 'github', color: '#f5f5f5' },
  { name: 'Slack', slug: 'slack', color: '#4A154B' },
  { name: 'Jira', slug: 'jira', color: '#0052CC' },
  { name: 'VS Code', slug: 'visualstudiocode', color: '#007ACC' },
  { name: 'Vercel', slug: 'vercel', color: '#f5f5f5' },
  { name: 'GitLab', slug: 'gitlab', color: '#FC6D26' },
  { name: 'Bitbucket', slug: 'bitbucket', color: '#0052CC' },
  { name: 'PagerDuty', slug: 'pagerduty', color: '#06AC38' },
  { name: 'Datadog', slug: 'datadog', color: '#632CA6' },
  { name: 'Netlify', slug: 'netlify', color: '#00C7B7' },
  { name: 'Heroku', slug: 'heroku', color: '#430098' },
  { name: 'Azure', slug: 'microsoftazure', color: '#0078D4' },
  { name: 'Terraform', slug: 'terraform', color: '#7B42BC' },
  { name: 'Docker', slug: 'docker', color: '#2496ED' },
  { name: 'Webpack', slug: 'webpack', color: '#8DD6F9' },
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
              className="group flex flex-col items-center justify-center p-5 rounded-lg bg-card/50 border border-border hover:border-brand/30 hover:bg-card transition-all duration-200 cursor-pointer min-h-[88px]"
              title={item.name}
            >
              <img
                src={`https://cdn.simpleicons.org/${item.slug}/${encodeURIComponent(item.color.replace('#', ''))}`}
                alt={`${item.name} logo`}
                width="28"
                height="28"
                loading="lazy"
                decoding="async"
                className="mb-2 transition-transform duration-200 group-hover:scale-110"
              />
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
