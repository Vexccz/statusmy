import { motion, useReducedMotion } from 'framer-motion'

const posts = [
  {
    title: 'How We Monitor 10,000+ Endpoints Across ASEAN',
    excerpt: 'Learn how StatusMy\'s distributed check infrastructure ensures accurate uptime data from multiple regions across Southeast Asia.',
    date: 'Apr 28, 2026',
    readTime: '6 min read',
    category: 'Engineering',
    color: 'bg-brand/10 text-brand-light',
  },
  {
    title: 'Introducing Smart Alerting with Escalation Policies',
    excerpt: 'No more alert fatigue. Our new escalation policies route alerts to the right person at the right time, with automatic escalation if unacknowledged.',
    date: 'Apr 22, 2026',
    readTime: '4 min read',
    category: 'Product',
    color: 'bg-[#059669]/10 text-[#059669]',
  },
  {
    title: 'Building a Status Page That Customers Actually Trust',
    excerpt: 'A comprehensive guide to creating transparent status pages that build customer confidence and reduce support tickets during incidents.',
    date: 'Apr 15, 2026',
    readTime: '8 min read',
    category: 'Tutorial',
    color: 'bg-[#30CF79]/10 text-[#30CF79]',
  },
]

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  }),
}

export default function BlogPreview() {
  const prefersReducedMotion = useReducedMotion()

  return (
    <section className="relative py-[64px] md:py-[96px]">
      <div className="max-w-container mx-auto px-[16px] sm:px-[24px] lg:px-[32px]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5 }}
          className="flex items-end justify-between mb-12 md:mb-16"
        >
          <div>
            <h2 className="font-display text-heading-lg md:text-[3rem] md:leading-[1.1] md:tracking-[-0.02em] font-bold text-text-primary mb-4">
              From the blog
            </h2>
            <p className="text-lg text-text-secondary">
              Engineering insights, product updates, and best practices.
            </p>
          </div>
          <a href="#" className="hidden md:inline-flex btn-secondary btn-sm">
            View all posts
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts.map((post, i) => (
            <motion.article
              key={post.title}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="group cursor-pointer"
            >
              <div className="card card-lg h-full flex flex-col hover:border-brand/20">
                {/* Image placeholder */}
                <div className="w-full h-48 rounded-lg bg-gradient-to-br from-card to-surface mb-5 overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-brand/10 to-[#7c3aed]/10 group-hover:from-brand/20 group-hover:to-[#7c3aed]/20 transition-all duration-300" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                      <svg className="w-6 h-6 text-text-muted/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Category badge */}
                <span className={`inline-flex self-start px-2.5 py-1 rounded-full text-caption font-medium mb-3 ${post.color}`}>
                  {post.category}
                </span>

                {/* Title */}
                <h3 className="text-heading-sm text-text-primary mb-3 group-hover:text-brand-light transition-colors duration-200">
                  {post.title}
                </h3>

                {/* Excerpt */}
                <p className="text-body-sm text-text-secondary leading-relaxed mb-4 flex-1">
                  {post.excerpt}
                </p>

                {/* Meta */}
                <div className="flex items-center gap-3 text-caption text-text-muted">
                  <span>{post.date}</span>
                  <span className="w-1 h-1 rounded-full bg-text-muted/50" />
                  <span>{post.readTime}</span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {/* Mobile view all link */}
        <div className="mt-8 text-center md:hidden">
          <a href="#" className="btn-secondary btn-sm inline-flex">
            View all posts
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
}
