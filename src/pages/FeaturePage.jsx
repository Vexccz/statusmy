import { motion } from 'framer-motion'

const features = {
  'uptime-monitoring': {
    title: 'Uptime Monitoring',
    desc: 'Monitor your websites, APIs, and services around the clock. Get instant alerts when downtime occurs.',
    items: [
      { title: 'HTTP/HTTPS Checks', desc: 'Monitor any URL with customizable intervals from 30 seconds to 24 hours.' },
      { title: 'Multi-Region', desc: 'Check from 50+ locations worldwide to detect regional outages.' },
      { title: 'Response Validation', desc: 'Verify status codes, response body content, and headers.' },
      { title: 'Performance Tracking', desc: 'Track response times and identify performance degradation.' },
    ]
  },
  'status-pages': {
    title: 'Status Pages',
    desc: 'Beautiful, customizable status pages that keep your customers informed during incidents.',
    items: [
      { title: 'Custom Domain', desc: 'Host your status page on your own domain with SSL.' },
      { title: 'Branding', desc: 'Match your brand with custom colors, logo, and favicon.' },
      { title: 'Subscriber Notifications', desc: 'Let users subscribe for email or SMS updates.' },
      { title: 'Incident History', desc: 'Full timeline of past incidents and maintenance windows.' },
    ]
  },
  'alerting': {
    title: 'Alerting',
    desc: 'Get notified instantly through your preferred channels when something goes wrong.',
    items: [
      { title: 'Multi-Channel', desc: 'Email, SMS, Slack, Discord, Telegram, PagerDuty, and more.' },
      { title: 'Escalation Policies', desc: 'Set up on-call schedules and escalation rules.' },
      { title: 'Smart Alerts', desc: 'Reduce noise with confirmation checks and cooldown periods.' },
      { title: 'Custom Conditions', desc: 'Alert on specific status codes, response times, or content changes.' },
    ]
  },
  'ssl-monitoring': {
    title: 'SSL Monitoring',
    desc: 'Never let an expired SSL certificate catch you off guard. Monitor expiry dates and certificate health.',
    items: [
      { title: 'Expiry Alerts', desc: 'Get notified 30, 14, 7, and 1 day before certificate expiry.' },
      { title: 'Chain Validation', desc: 'Verify the full certificate chain is properly configured.' },
      { title: 'Auto-Discovery', desc: 'Automatically detect and monitor SSL for all your domains.' },
      { title: 'Compliance', desc: 'Ensure TLS version and cipher suite meet security standards.' },
    ]
  },
  'cron-monitoring': {
    title: 'Cron Monitoring',
    desc: 'Make sure your scheduled jobs and background tasks run on time, every time.',
    items: [
      { title: 'Heartbeat Checks', desc: 'Simple ping endpoint your cron jobs hit when they complete.' },
      { title: 'Schedule Validation', desc: 'Detect missed runs based on expected schedule.' },
      { title: 'Duration Tracking', desc: 'Alert when jobs take longer than expected.' },
      { title: 'Failure Detection', desc: 'Know immediately when a job fails or times out.' },
    ]
  },
  'integrations': {
    title: 'Integrations',
    desc: 'Connect StatusMy with the tools your team already uses.',
    items: [
      { title: 'Slack & Discord', desc: 'Get alerts and updates directly in your team channels.' },
      { title: 'PagerDuty & Opsgenie', desc: 'Integrate with your existing incident management workflow.' },
      { title: 'Webhooks', desc: 'Send events to any URL for custom integrations.' },
      { title: 'API', desc: 'Full REST API for programmatic access to all features.' },
    ]
  },
}

export default function FeaturePage({ slug }) {
  const feature = features[slug] || features['uptime-monitoring']

  return (
    <motion.main
      id="main-content"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-[128px] pb-[96px]"
    >
      <div className="max-w-container mx-auto px-[16px] sm:px-[24px] lg:px-[32px]">
        <div className="text-center mb-16">
          <h1 className="heading-xl text-text-primary mb-4">{feature.title}</h1>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">{feature.desc}</p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {feature.items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-6 rounded-xl border border-border bg-card/30 hover:border-brand/30 transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-brand/10 flex items-center justify-center mb-4">
                <div className="w-3 h-3 rounded-full bg-brand" />
              </div>
              <h3 className="text-heading-sm text-text-primary mb-2">{item.title}</h3>
              <p className="text-body-sm text-text-muted">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.main>
  )
}
