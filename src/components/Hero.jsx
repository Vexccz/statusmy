import { motion, useReducedMotion } from 'framer-motion'
import { useCountUp } from '../hooks/useCountUp'
import { Link } from 'react-router-dom'
import HeroAnimation from './HeroAnimation'

function AnimatedStat({ end, suffix, label }) {
  const [ref, count] = useCountUp(end, 2000)
  return (
    <div ref={ref} className="text-center">
      <div className="text-2xl md:text-3xl font-bold text-gradient">
        {count}{suffix}
      </div>
      <div className="text-body-sm text-text-muted mt-1">{label}</div>
    </div>
  )
}

function DashboardMockup() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-full max-w-4xl mx-auto mt-12 md:mt-16"
    >
      {/* Glow behind */}
      <div className="absolute inset-0 bg-brand/10 rounded-2xl blur-3xl scale-95" />

      {/* Main window */}
      <div className="relative rounded-xl border border-border bg-surface overflow-hidden shadow-2xl">
        {/* Title bar */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-card/50">
          <div className="w-3 h-3 rounded-full bg-[#F54E4E]/70" />
          <div className="w-3 h-3 rounded-full bg-[#F7A501]/70" />
          <div className="w-3 h-3 rounded-full bg-[#30CF79]/70" />
          <span className="ml-3 text-caption text-text-muted font-mono">statusmy.com/dashboard</span>
        </div>

        {/* Dashboard content */}
        <div className="p-4 md:p-6">
          {/* Top bar */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-24 rounded-md bg-brand/20" />
              <div className="h-8 w-32 rounded-md bg-card border border-border" />
            </div>
            <div className="flex items-center gap-2">
              <div className="h-8 w-20 rounded-md bg-card border border-border" />
              <div className="h-8 w-8 rounded-md bg-card border border-border" />
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            {[
              { label: 'Monitors', value: '24', color: 'text-brand-light' },
              { label: 'Up', value: '22', color: 'text-[#30CF79]' },
              { label: 'Down', value: '1', color: 'text-[#F54E4E]' },
              { label: 'Avg Response', value: '142ms', color: 'text-brand-light' },
            ].map((stat) => (
              <div key={stat.label} className="p-3 rounded-lg bg-card/50 border border-border">
                <div className={`text-sm md:text-lg font-bold ${stat.color}`}>{stat.value}</div>
                <div className="text-[10px] md:text-caption text-text-muted">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Monitor list */}
          <div className="space-y-2">
            {[
              { status: 'up', title: 'api.myapp.com', uptime: '99.98%', time: '89ms' },
              { status: 'up', title: 'dashboard.myapp.com', uptime: '99.95%', time: '142ms' },
              { status: 'down', title: 'payments.myapp.com', uptime: '98.72%', time: 'Timeout' },
              { status: 'up', title: 'cdn.myapp.com', uptime: '100%', time: '23ms' },
              { status: 'up', title: 'auth.myapp.com', uptime: '99.99%', time: '67ms' },
            ].map((monitor, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + i * 0.1, duration: 0.3 }}
                className="flex items-center gap-3 p-3 rounded-lg bg-card/30 border border-border hover:border-border/50 transition-colors"
              >
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                  monitor.status === 'up' ? 'bg-[#30CF79]' : 'bg-[#F54E4E]'
                }`} />
                <span className="text-xs md:text-sm text-text-primary font-mono truncate flex-1">{monitor.title}</span>
                <span className="text-caption text-text-muted flex-shrink-0 hidden sm:block">{monitor.uptime}</span>
                <span className={`text-caption flex-shrink-0 ${monitor.status === 'down' ? 'text-[#F54E4E]' : 'text-text-muted'}`}>{monitor.time}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function Hero() {
  return (
    <section className="relative pt-[128px] pb-[64px] md:pt-[160px] md:pb-[96px] overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-brand/10 rounded-full blur-[120px]" />
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-[#059669]/8 rounded-full blur-[100px]" />
      </div>

      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
        backgroundSize: '60px 60px'
      }} aria-hidden="true" />

      <div className="relative max-w-container mx-auto px-[16px] sm:px-[24px] lg:px-[32px] text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-8 rounded-full border border-border bg-card/50 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-semantic-success animate-pulse" aria-hidden="true" />
            <span className="text-caption text-text-secondary">Now with multi-region monitoring</span>
          </div>

          {/* Main heading */}
          <h1 className="heading-xl text-text-primary mb-6">
            <span>Know when it's down.</span>
            <br />
            <span className="text-gradient">Before your users do.</span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-text-secondary leading-relaxed mb-10">
            StatusMy monitors your websites, APIs, and services 24/7. Get instant alerts when something goes wrong and beautiful status pages your customers will love.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link to="/signup" className="btn-primary min-h-[44px] flex items-center">
                Start Monitoring Free
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link to="/docs" className="btn-secondary min-h-[44px] flex items-center">
                View Documentation
              </Link>
            </motion.div>
          </div>

          {/* Animated Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-12 grid grid-cols-3 gap-8 max-w-lg mx-auto"
          >
            <AnimatedStat end={10} suffix="K+" label="Monitors" />
            <AnimatedStat end={99.9} suffix="%" label="Uptime SLA" />
            <AnimatedStat end={50} suffix="+" label="Countries" />
          </motion.div>

          {/* Animated Vector Illustration */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-12 md:mt-16"
          >
            <HeroAnimation />
          </motion.div>

          {/* Dashboard Mockup */}
          <DashboardMockup />

          {/* Trusted by */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="mt-16 md:mt-20"
          >
            <p className="text-caption uppercase tracking-widest text-text-muted mb-6">Trusted by Malaysian companies</p>
            <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 md:gap-12 opacity-40">
              {['Grab', 'Petronas', 'AirAsia', 'Maybank', 'CIMB', 'Axiata'].map((name) => (
                <span key={name} className="text-base sm:text-lg font-bold text-text-primary/60 hover:text-text-primary/80 transition-colors">{name}</span>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
