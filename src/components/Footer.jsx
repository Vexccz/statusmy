import { useState } from 'react'
import { Link } from 'react-router-dom'

const links = {
  Product: [
    { name: 'Uptime Monitoring', href: '/features/uptime-monitoring' },
    { name: 'Status Pages', href: '/features/status-pages' },
    { name: 'Alerting', href: '/features/alerting' },
    { name: 'SSL Monitoring', href: '/features/ssl-monitoring' },
    { name: 'Cron Monitoring', href: '/features/cron-monitoring' },
    { name: 'Integrations', href: '/features/integrations' },
  ],
  Company: [
    { name: 'About', href: '/about' },
    { name: 'Blog', href: '/blog' },
    { name: 'Careers', href: '/careers' },
    { name: 'Press', href: '/press' },
    { name: 'Partners', href: '/partners' },
    { name: 'Contact', href: '/contact' },
  ],
  Resources: [
    { name: 'Documentation', href: '/docs' },
    { name: 'API Reference', href: '/docs/api' },
    { name: 'Changelog', href: '/changelog' },
    { name: 'System Status', href: '/status' },
    { name: 'Community', href: '/community' },
    { name: 'Support', href: '/support' },
  ],
  Legal: [
    { name: 'Privacy Policy', href: '/legal/privacy' },
    { name: 'Terms of Service', href: '/legal/terms' },
    { name: 'Security', href: '/legal/security' },
    { name: 'DPA', href: '/legal/dpa' },
    { name: 'Cookie Settings', href: '/legal/cookies' },
    { name: 'PDPA Compliance', href: '/legal/pdpa' },
  ],
}

const socials = [
  {
    name: 'GitHub',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
      </svg>
    ),
  },
  {
    name: 'Twitter',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    name: 'Discord',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03z" />
      </svg>
    ),
  },
  {
    name: 'LinkedIn',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
]

const regions = ['English (US)', 'English (UK)', 'Deutsch', 'Français', 'Español', '日本語']

export default function Footer() {
  const [selectedRegion, setSelectedRegion] = useState('English (US)')
  const [regionOpen, setRegionOpen] = useState(false)

  return (
    <footer className="border-t border-border bg-bg">
      <div className="max-w-container mx-auto px-[16px] sm:px-[24px] lg:px-[32px] py-[64px]">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-[32px]">
          {/* Brand column */}
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-[16px]">
              <svg className="w-7 h-7" viewBox="0 0 32 32" fill="none">
                <circle cx="16" cy="16" r="12" stroke="url(#footer-grad)" strokeWidth="3" fill="none" />
                <circle cx="16" cy="16" r="5" fill="url(#footer-grad)" />
                <defs>
                  <linearGradient id="footer-grad" x1="4" y1="4" x2="28" y2="28">
                    <stop stopColor="#10B981" />
                    <stop offset="1" stopColor="#34D399" />
                  </linearGradient>
                </defs>
              </svg>
              <span className="text-lg font-bold text-text-primary">StatusMy</span>
            </div>
            <p className="text-body-sm text-text-muted leading-relaxed mb-[16px] max-w-xs" aria-label="StatusMy description">
              Uptime monitoring platform built in Malaysia. Know when it's down before your users do.
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-[8px] mb-[24px]">
              {socials.map((social) => (
                <a
                  key={social.name}
                  href="#"
                  aria-label={`Follow us on ${social.name}`}
                  className="w-11 h-11 sm:w-9 sm:h-9 rounded-md bg-card border border-border flex items-center justify-center text-text-muted hover:text-text-primary hover:border-brand/30 transition-all duration-micro"
                >
                  {social.icon}
                </a>
              ))}
            </div>

            {/* Language/region selector */}
            <div className="relative">
              <button
                onClick={() => setRegionOpen(!regionOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-md bg-card border border-border text-body-sm text-text-secondary hover:border-brand/30 transition-all duration-micro"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
                {selectedRegion}
                <svg className={`w-3 h-3 transition-transform ${regionOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {regionOpen && (
                <div className="absolute bottom-full mb-1 left-0 w-48 rounded-md bg-card border border-border shadow-lg py-1 z-50">
                  {regions.map((region) => (
                    <button
                      key={region}
                      onClick={() => { setSelectedRegion(region); setRegionOpen(false) }}
                      className={`w-full text-left px-3 py-2 text-body-sm transition-colors ${
                        region === selectedRegion ? 'text-brand-light bg-brand/5' : 'text-text-secondary hover:bg-card/80 hover:text-text-primary'
                      }`}
                    >
                      {region}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(links).map(([category, items]) => (
            <div key={category}>
              <h4 className="text-body-sm font-semibold text-text-primary mb-[16px]">{category}</h4>
              <ul className="space-y-[10px]">
                {items.map((item) => (
                  <li key={item.name}>
                    <Link to={item.href} className="text-body-sm text-text-muted hover:text-text-primary transition-colors duration-micro">
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-[48px] pt-[32px] border-t border-border flex flex-col md:flex-row items-center justify-between gap-[16px]">
          <p className="text-caption text-text-muted">
            © {new Date().getFullYear()} StatusMy. All rights reserved.
          </p>
          <div className="flex items-center gap-[24px]">
            <Link to="/legal/privacy" className="text-caption text-text-muted hover:text-text-primary transition-colors duration-micro">Privacy Policy</Link>
            <Link to="/legal/terms" className="text-caption text-text-muted hover:text-text-primary transition-colors duration-micro">Terms of Service</Link>
            <Link to="/status" className="flex items-center gap-1.5 text-caption text-text-muted hover:text-text-primary transition-colors duration-micro">
              <span className="w-2 h-2 rounded-full bg-semantic-success" aria-hidden="true" />
              All Systems Operational
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
