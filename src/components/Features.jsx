import { useState, useRef } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Activity, Bell, Globe, Gauge, Shield, Clock } from 'lucide-react'

const features = [
  {
    title: 'Uptime Monitoring',
    description: 'Monitor your websites, APIs, and services from multiple locations worldwide. Get alerted the moment something goes down.',
    icon: Activity,
    color: 'text-brand-light',
    bg: 'bg-brand/10',
  },
  {
    title: 'Instant Alerts',
    description: 'Get notified via SMS, email, Slack, Telegram, or webhook within seconds of downtime. Never miss a critical outage.',
    icon: Bell,
    color: 'text-[#ec4899]',
    bg: 'bg-[#ec4899]/10',
  },
  {
    title: 'Beautiful Status Pages',
    description: 'Give your customers a branded status page they can trust. Show real-time uptime stats and incident history.',
    icon: Globe,
    color: 'text-[#F7A501]',
    bg: 'bg-[#F7A501]/10',
  },
  {
    title: 'Performance Tracking',
    description: 'Track response times, latency, and performance trends. Identify slow endpoints before they become outages.',
    icon: Gauge,
    color: 'text-[#30CF79]',
    bg: 'bg-[#30CF79]/10',
  },
  {
    title: 'SSL & Domain Monitoring',
    description: 'Get alerts before your SSL certificates expire or your domains lapse. Prevent embarrassing security warnings.',
    icon: Shield,
    color: 'text-[#7c3aed]',
    bg: 'bg-[#7c3aed]/10',
  },
  {
    title: 'Cron Job Monitoring',
    description: 'Monitor your scheduled tasks and background jobs. Know instantly when a cron job fails or runs too long.',
    icon: Clock,
    color: 'text-[#3B82F6]',
    bg: 'bg-[#3B82F6]/10',
  },
]

const tabs = [
  {
    id: 'uptime',
    label: 'Uptime Checks',
    title: 'Know the moment your site goes down',
    description: 'Monitor HTTP, HTTPS, TCP, UDP, DNS, and ICMP endpoints from 50+ global locations. Get alerted within 30 seconds of downtime.',
    visual: (
      <div className="space-y-3">
        {[
          { status: 'up', msg: 'api.example.com', response: '89ms', uptime: '99.99%' },
          { status: 'up', msg: 'dashboard.example.com', response: '142ms', uptime: '99.95%' },
          { status: 'down', msg: 'payments.example.com', response: 'Timeout', uptime: '98.72%' },
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-card/50 border border-border">
            <div className={`w-2 h-2 rounded-full flex-shrink-0 ${item.status === 'up' ? 'bg-[#30CF79]' : 'bg-[#F54E4E]'}`} aria-hidden="true" />
            <span className="text-sm text-text-primary font-mono truncate flex-1">{item.msg}</span>
            <span className="text-caption text-text-muted hidden sm:block">{item.uptime}</span>
            <span className={`text-caption font-medium ${item.status === 'down' ? 'text-[#F54E4E]' : 'text-[#30CF79]'}`}>{item.response}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: 'alerts',
    label: 'Alerts',
    title: 'Never miss a critical outage',
    description: 'Multi-channel alerting with escalation policies. Route alerts to the right team member at the right time via SMS, email, Slack, or webhook.',
    visual: (
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Avg Alert', value: '28s', status: 'good' },
            { label: 'Incidents', value: '3', status: 'needs-work' },
            { label: 'Resolved', value: '100%', status: 'good' },
          ].map((metric) => (
            <div key={metric.label} className="p-3 rounded-lg bg-card/50 border border-border text-center">
              <div className="text-caption text-text-muted mb-1">{metric.label}</div>
              <div className={`text-lg font-bold ${metric.status === 'good' ? 'text-[#30CF79]' : 'text-[#F7A501]'}`}>{metric.value}</div>
            </div>
          ))}
        </div>
        <div className="space-y-2">
          {[
            { channel: '📱 SMS', target: '+60 11-5704 8145', status: 'Sent', time: '28s' },
            { channel: '💬 Slack', target: '#ops-alerts', status: 'Sent', time: '30s' },
            { channel: '📧 Email', target: 'team@company.com', status: 'Sent', time: '45s' },
            { channel: '🔗 Webhook', target: 'hooks.company.com', status: 'Sent', time: '31s' },
          ].map((alert, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="text-caption text-text-muted font-mono w-20 sm:w-24 truncate">{alert.channel}</span>
              <span className="text-caption text-text-secondary font-mono flex-1 truncate">{alert.target}</span>
              <span className="text-caption text-[#30CF79] w-12 text-right">{alert.status}</span>
              <span className="text-caption text-text-muted w-10 text-right">{alert.time}</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: 'status',
    label: 'Status Pages',
    title: 'Beautiful pages your customers trust',
    description: 'Branded, customizable status pages with real-time uptime data, incident updates, and maintenance schedules. No coding required.',
    visual: (
      <div className="rounded-lg border border-border bg-card/30 overflow-hidden">
        <div className="flex items-center gap-2 px-3 py-2 border-b border-border bg-card/50">
          <div className="w-2 h-2 rounded-full bg-[#30CF79]" aria-hidden="true" />
          <span className="text-caption text-text-muted">status.yourcompany.com</span>
        </div>
        <div className="p-4 space-y-3">
          {[
            { name: 'Website', status: 'Operational', icon: '🟢' },
            { name: 'API', status: 'Operational', icon: '🟢' },
            { name: 'Dashboard', status: 'Degraded', icon: '🟡' },
            { name: 'Payments', status: 'Major Outage', icon: '🔴' },
            { name: 'CDN', status: 'Operational', icon: '🟢' },
          ].map((service, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="text-sm" aria-hidden="true">{service.icon}</span>
              <span className="text-sm text-text-primary font-medium flex-1">{service.name}</span>
              <span className={`text-caption ${service.status === 'Operational' ? 'text-[#30CF79]' : service.status === 'Degraded' ? 'text-[#F7A501]' : 'text-[#F54E4E]'}`}>{service.status}</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
}

export default function Features() {
  const [activeTab, setActiveTab] = useState('uptime')
  const currentTab = tabs.find((t) => t.id === activeTab)
  const tabRefs = useRef({})
  const prefersReducedMotion = useReducedMotion()

  // Keyboard navigation for tabs
  const handleTabKeyDown = (e) => {
    const tabIds = tabs.map(t => t.id)
    const currentIndex = tabIds.indexOf(activeTab)
    let newIndex = currentIndex

    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault()
      newIndex = (currentIndex + 1) % tabIds.length
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault()
      newIndex = (currentIndex - 1 + tabIds.length) % tabIds.length
    } else if (e.key === 'Home') {
      e.preventDefault()
      newIndex = 0
    } else if (e.key === 'End') {
      e.preventDefault()
      newIndex = tabIds.length - 1
    }

    if (newIndex !== currentIndex) {
      setActiveTab(tabIds[newIndex])
      tabRefs.current[tabIds[newIndex]]?.focus()
    }
  }

  return (
    <section id="features" className="relative py-[64px] md:py-[96px]">
      {/* Decorative gradient orb */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute top-1/3 right-0 w-[400px] h-[400px] bg-brand/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-container mx-auto px-[16px] sm:px-[24px] lg:px-[32px]">
        {/* Section header */}
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="font-display text-heading-lg md:text-[3rem] md:leading-[1.1] md:tracking-[-0.02em] font-bold text-text-primary mb-4">
            Why teams choose <span className="text-gradient">StatusMy</span>
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-text-secondary">
            Complete uptime monitoring that helps you stay ahead of downtime and keep your customers happy.
          </p>
        </motion.div>

        {/* Feature cards grid */}
        <motion.div
          variants={prefersReducedMotion ? {} : containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.title}
                variants={prefersReducedMotion ? {} : cardVariants}
                className="card card-lg group relative hover:border-brand/20"
              >
                <div className="absolute inset-0 rounded-[var(--r-lg)] bg-gradient-to-br from-brand/5 to-[#059669]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" aria-hidden="true" />
                <div className="relative">
                  <div className={`w-12 h-12 flex items-center justify-center rounded-lg ${feature.bg} ${feature.color} mb-5 group-hover:scale-110 transition-transform duration-200`} aria-hidden="true">
                    <Icon size={22} />
                  </div>
                  <h3 className="text-heading-sm text-text-primary mb-3">{feature.title}</h3>
                  <p className="text-body-sm text-text-secondary leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Tabbed product areas */}
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-20 md:mt-28"
        >
          <h3 className="font-display text-heading-lg md:text-[2.5rem] md:leading-[1.1] font-bold text-text-primary text-center mb-10">
            One platform, <span className="text-gradient">complete visibility</span>
          </h3>

          {/* Tab buttons */}
          <div className="flex justify-center mb-8">
            <div
              className="inline-flex p-1 rounded-xl bg-card border border-border"
              role="tablist"
              aria-label="Product features"
            >
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  ref={(el) => { tabRefs.current[tab.id] = el }}
                  role="tab"
                  aria-selected={activeTab === tab.id}
                  aria-controls={`tabpanel-${tab.id}`}
                  id={`tab-${tab.id}`}
                  tabIndex={activeTab === tab.id ? 0 : -1}
                  onClick={() => setActiveTab(tab.id)}
                  onKeyDown={handleTabKeyDown}
                  className={`px-4 md:px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 min-h-[44px] ${
                    activeTab === tab.id
                      ? 'bg-brand text-white shadow-glow'
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab content */}
          <motion.div
            key={activeTab}
            id={`tabpanel-${activeTab}`}
            role="tabpanel"
            aria-labelledby={`tab-${activeTab}`}
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start"
          >
            <div>
              <h4 className="text-heading-md text-text-primary mb-4">{currentTab.title}</h4>
              <p className="text-text-secondary leading-relaxed mb-6">{currentTab.description}</p>
              <motion.a
                href="#"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn-secondary btn-sm inline-flex min-h-[44px] items-center"
              >
                Learn more
              </motion.a>
            </div>
            <div>{currentTab.visual}</div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
