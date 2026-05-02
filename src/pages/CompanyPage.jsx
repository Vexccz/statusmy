import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const pages = {
  blog: {
    title: 'Blog',
    desc: 'Insights on uptime monitoring, DevOps, and building reliable systems.',
    items: [
      { title: 'Why 99.9% Uptime Isn\'t Enough', date: 'Apr 28, 2026', tag: 'Engineering' },
      { title: 'Setting Up Multi-Region Monitoring', date: 'Apr 20, 2026', tag: 'Tutorial' },
      { title: 'Incident Response Best Practices', date: 'Apr 15, 2026', tag: 'DevOps' },
      { title: 'SSL Certificate Management Guide', date: 'Apr 10, 2026', tag: 'Security' },
      { title: 'How We Built StatusMy', date: 'Apr 5, 2026', tag: 'Behind the Scenes' },
      { title: 'Monitoring Microservices at Scale', date: 'Mar 28, 2026', tag: 'Engineering' },
    ]
  },
  careers: {
    title: 'Careers',
    desc: 'Join us in building the future of uptime monitoring in Southeast Asia.',
    items: [
      { title: 'Senior Backend Engineer', date: 'Remote / KL', tag: 'Engineering' },
      { title: 'Frontend Developer', date: 'Remote / KL', tag: 'Engineering' },
      { title: 'DevOps Engineer', date: 'Remote', tag: 'Infrastructure' },
      { title: 'Product Designer', date: 'Remote / KL', tag: 'Design' },
    ]
  },
  press: {
    title: 'Press',
    desc: 'News and media resources about StatusMy.',
    items: [
      { title: 'StatusMy Launches Multi-Region Monitoring', date: 'Apr 2026', tag: 'Launch' },
      { title: 'StatusMy Raises Seed Round', date: 'Mar 2026', tag: 'Funding' },
      { title: 'Malaysian Startup Tackles Downtime', date: 'Feb 2026', tag: 'Feature' },
    ]
  },
  partners: {
    title: 'Partners',
    desc: 'Partner with StatusMy to deliver better monitoring solutions.',
    items: [
      { title: 'Reseller Program', date: 'Earn recurring revenue', tag: 'Revenue' },
      { title: 'Technology Partners', date: 'Integrate with StatusMy', tag: 'Integration' },
      { title: 'Agency Program', date: 'White-label monitoring', tag: 'Agency' },
    ]
  },
  contact: {
    title: 'Contact Us',
    desc: 'Get in touch with our team.',
    isContact: true,
  },
  community: {
    title: 'Community',
    desc: 'Connect with other StatusMy users and the team.',
    items: [
      { title: 'Discord Server', date: '2,000+ members', tag: 'Chat' },
      { title: 'GitHub Discussions', date: 'Open source tools', tag: 'Code' },
      { title: 'Monthly Meetup', date: 'Virtual & KL', tag: 'Events' },
    ]
  },
  support: {
    title: 'Support',
    desc: 'We\'re here to help you get the most out of StatusMy.',
    items: [
      { title: 'Help Center', date: '100+ articles', tag: 'Self-serve' },
      { title: 'Email Support', date: 'support@statusmy.com', tag: '< 4hr response' },
      { title: 'Priority Support', date: 'Pro & Enterprise plans', tag: '< 1hr response' },
      { title: 'Live Chat', date: 'Business hours (MYT)', tag: 'Real-time' },
    ]
  },
}

export default function CompanyPage({ slug }) {
  const page = pages[slug] || pages['blog']

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
          <h1 className="heading-xl text-text-primary mb-4">{page.title}</h1>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">{page.desc}</p>
        </div>

        {page.isContact ? (
          <div className="max-w-xl mx-auto">
            <div className="space-y-4">
              <div>
                <label className="block text-body-sm text-text-secondary mb-1">Name</label>
                <input type="text" className="w-full px-4 py-3 rounded-lg bg-card border border-border text-text-primary focus:border-brand focus:outline-none" placeholder="Your name" />
              </div>
              <div>
                <label className="block text-body-sm text-text-secondary mb-1">Email</label>
                <input type="email" className="w-full px-4 py-3 rounded-lg bg-card border border-border text-text-primary focus:border-brand focus:outline-none" placeholder="you@company.com" />
              </div>
              <div>
                <label className="block text-body-sm text-text-secondary mb-1">Message</label>
                <textarea rows={5} className="w-full px-4 py-3 rounded-lg bg-card border border-border text-text-primary focus:border-brand focus:outline-none resize-none" placeholder="How can we help?" />
              </div>
              <button className="btn-primary w-full">Send Message</button>
            </div>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {page.items?.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="p-6 rounded-xl border border-border bg-card/30 hover:border-brand/30 transition-colors cursor-pointer"
              >
                <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-medium bg-brand/10 text-brand-light mb-3">{item.tag}</span>
                <h3 className="text-heading-sm text-text-primary mb-1">{item.title}</h3>
                <p className="text-body-sm text-text-muted">{item.date}</p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.main>
  )
}
