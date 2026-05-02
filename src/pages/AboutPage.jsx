import { motion, useReducedMotion } from 'framer-motion'
import { Heart, Globe, Rocket, Shield, Users, Code2 } from 'lucide-react'

const team = [
  { name: 'Amir Hassan', role: 'Co-Founder & CEO', avatar: 'AH' },
  { name: 'Mei Ling Tan', role: 'Co-Founder & CTO', avatar: 'MT' },
  { name: 'Faizal Rahman', role: 'VP of Engineering', avatar: 'FR' },
  { name: 'Priya Nair', role: 'Head of Product', avatar: 'PN' },
  { name: 'Nurul Izzah', role: 'Head of Design', avatar: 'NI' },
  { name: 'Wei Jian Lim', role: 'Staff Engineer', avatar: 'WL' },
  { name: 'Kavitha Raj', role: 'Developer Advocate', avatar: 'KR' },
  { name: 'Danish Hakim', role: 'Head of Security', avatar: 'DH' },
]

const values = [
  {
    icon: Heart,
    title: 'Customer Obsession',
    description: 'We build for the teams who lose sleep over downtime. Every feature starts with understanding their pain.',
  },
  {
    icon: Globe,
    title: 'Built in Malaysia',
    description: 'Proudly built in KL, serving the world. We understand the unique needs of Southeast Asian businesses.',
  },
  {
    icon: Rocket,
    title: 'Ship Fast, Learn Faster',
    description: "We iterate quickly, measure everything, and aren't afraid to change direction when data tells us to.",
  },
  {
    icon: Shield,
    title: 'Trust & Reliability',
    description: 'Your monitoring data is sacred. We invest heavily in our own uptime, security, and PDPA compliance.',
  },
  {
    icon: Users,
    title: 'Community Driven',
    description: 'Our roadmap is shaped by the community. The best ideas come from the people using our tools daily.',
  },
  {
    icon: Code2,
    title: 'Craft Over Shortcuts',
    description: 'We take pride in building things right. Quality code, thoughtful UX, and reliable infrastructure.',
  },
]

const stats = [
  { value: '2024', label: 'Founded' },
  { value: '25+', label: 'Team Members' },
  { value: '500+', label: 'Companies' },
  { value: '10K+', label: 'Monitors' },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
}

export default function AboutPage() {
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.main
      id="main-content"
      initial={prefersReducedMotion ? {} : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={prefersReducedMotion ? {} : { opacity: 0, y: -8 }}
      transition={{ duration: 0.3 }}
      className="pt-[128px] pb-[96px] relative"
    >
      {/* Decorative orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute top-[300px] left-[-150px] w-[400px] h-[400px] bg-brand/5 rounded-full blur-[120px]" />
        <div className="absolute top-[1200px] right-[-100px] w-[350px] h-[350px] bg-[#059669]/5 rounded-full blur-[100px]" />
      </div>
      <div className="max-w-container mx-auto px-[16px] sm:px-[24px] lg:px-[32px]">
        {/* Hero */}
        <div className="text-center mb-16 md:mb-20">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="font-display text-heading-lg md:text-[3rem] md:leading-[1.1] md:tracking-[-0.02em] font-bold text-text-primary mb-6"
          >
            Built in <span className="text-gradient">Malaysia</span>, for the world
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-lg text-text-secondary max-w-3xl mx-auto leading-relaxed"
          >
            StatusMy was born in Kuala Lumpur with a simple mission: make uptime monitoring 
            accessible, affordable, and reliable for every business in Southeast Asia and beyond. 
            We believe no team should lose customers to preventable downtime.
          </motion.p>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20"
        >
          {stats.map((stat) => (
            <div key={stat.label} className="text-center p-6 rounded-xl border border-border bg-card/30">
              <div className="text-2xl md:text-3xl font-bold text-gradient mb-1">{stat.value}</div>
              <div className="text-body-sm text-text-muted">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Story */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-20 md:mb-28"
        >
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-display text-heading-lg text-text-primary mb-6">Our Story</h2>
              <div className="space-y-4 text-text-secondary leading-relaxed">
                <p>
                  In 2024, our founders were running a growing e-commerce platform in Malaysia. 
                  Every time their payment gateway went down, they'd only find out when angry 
                  customers started flooding their support inbox. There had to be a better way.
                </p>
                <p>
                  They tried existing monitoring tools, but most were built for US/EU markets with 
                  servers far from Southeast Asia. Latency checks were inaccurate, pricing was in 
                  USD with no local payment options, and support was in a different timezone.
                </p>
                <p>
                  So they built StatusMy. A monitoring platform designed from the ground up for 
                  businesses in Malaysia and the ASEAN region, with local check nodes, affordable 
                  pricing, and support that speaks your language.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="rounded-xl border border-border bg-card/30 p-8 md:p-12">
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-brand/5 to-[#059669]/5" />
                <blockquote className="relative text-lg text-text-primary italic leading-relaxed">
                  "We believe every business deserves to know when their services are down. 
                  Not in 10 minutes, not when customers complain, but instantly."
                </blockquote>
                <div className="relative mt-6 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-grad-brand flex items-center justify-center text-white font-semibold text-body-sm">
                    AH
                  </div>
                  <div>
                    <div className="text-body-sm font-medium text-text-primary">Amir Hassan</div>
                    <div className="text-caption text-text-muted">Co-Founder & CEO</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Values */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-20 md:mb-28"
        >
          <h2 className="font-display text-heading-lg text-text-primary text-center mb-4">Our Values</h2>
          <p className="text-lg text-text-secondary text-center mb-12 max-w-2xl mx-auto">
            These principles guide everything we build and every decision we make.
          </p>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {values.map((value) => {
              const Icon = value.icon
              return (
                <motion.div key={value.title} variants={itemVariants} className="card card-lg">
                  <div className="w-10 h-10 rounded-lg bg-brand-bg flex items-center justify-center text-brand-light mb-4">
                    <Icon size={20} />
                  </div>
                  <h3 className="text-heading-sm text-text-primary mb-2">{value.title}</h3>
                  <p className="text-body-sm text-text-secondary leading-relaxed">{value.description}</p>
                </motion.div>
              )
            })}
          </motion.div>
        </motion.div>

        {/* Team */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="font-display text-heading-lg text-text-primary text-center mb-4">Leadership Team</h2>
          <p className="text-lg text-text-secondary text-center mb-12 max-w-2xl mx-auto">
            Meet the people driving StatusMy's mission forward.
          </p>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6"
          >
            {team.map((member) => (
              <motion.div
                key={member.name}
                variants={itemVariants}
                className="text-center p-6 rounded-xl border border-border bg-card/30 hover:border-brand/20 transition-colors duration-200"
              >
                <div className="w-16 h-16 rounded-full bg-grad-brand flex items-center justify-center text-white font-bold text-lg mx-auto mb-4">
                  {member.avatar}
                </div>
                <h3 className="text-body-sm font-semibold text-text-primary">{member.name}</h3>
                <p className="text-caption text-text-muted mt-1">{member.role}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </motion.main>
  )
}
