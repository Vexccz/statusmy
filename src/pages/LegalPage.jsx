import { motion } from 'framer-motion'

const legalContent = {
  privacy: {
    title: 'Privacy Policy',
    updated: 'May 1, 2026',
    sections: [
      { heading: 'Information We Collect', body: 'We collect information you provide directly, such as your name, email address, and payment information when you create an account. We also collect usage data including monitoring configurations, alert preferences, and service interaction logs.' },
      { heading: 'How We Use Your Information', body: 'We use your information to provide and improve our monitoring services, send alerts and notifications, process payments, and communicate with you about your account and our services.' },
      { heading: 'Data Storage & Security', body: 'Your data is stored on secure servers in Malaysia and Singapore. We use industry-standard encryption (AES-256) for data at rest and TLS 1.3 for data in transit.' },
      { heading: 'Data Sharing', body: 'We do not sell your personal data. We may share data with service providers who assist in operating our platform, subject to strict confidentiality agreements.' },
      { heading: 'Your Rights', body: 'You have the right to access, correct, or delete your personal data at any time. Contact us at privacy@statusmy.com to exercise these rights.' },
    ]
  },
  terms: {
    title: 'Terms of Service',
    updated: 'May 1, 2026',
    sections: [
      { heading: 'Acceptance of Terms', body: 'By accessing or using StatusMy, you agree to be bound by these Terms of Service. If you do not agree, please do not use our services.' },
      { heading: 'Service Description', body: 'StatusMy provides uptime monitoring, status pages, alerting, and related services. We strive for 99.9% uptime but do not guarantee uninterrupted service.' },
      { heading: 'Account Responsibilities', body: 'You are responsible for maintaining the security of your account credentials and for all activities that occur under your account.' },
      { heading: 'Payment Terms', body: 'Paid plans are billed monthly or annually. Refunds are available within 14 days of initial purchase. Cancellations take effect at the end of the current billing period.' },
      { heading: 'Limitation of Liability', body: 'StatusMy shall not be liable for any indirect, incidental, or consequential damages arising from your use of the service.' },
    ]
  },
  security: {
    title: 'Security',
    updated: 'May 1, 2026',
    sections: [
      { heading: 'Infrastructure Security', body: 'Our infrastructure runs on hardened servers with regular security patches. We use network segmentation, firewalls, and intrusion detection systems.' },
      { heading: 'Data Encryption', body: 'All data is encrypted at rest using AES-256 and in transit using TLS 1.3. API keys and credentials are stored using one-way hashing.' },
      { heading: 'Access Control', body: 'We implement role-based access control (RBAC) and require multi-factor authentication for all team members accessing production systems.' },
      { heading: 'Incident Response', body: 'We maintain a documented incident response plan with 24/7 on-call coverage. Security incidents are communicated transparently to affected users.' },
      { heading: 'Bug Bounty', body: 'We welcome responsible disclosure of security vulnerabilities. Contact security@statusmy.com for our bug bounty program details.' },
    ]
  },
  dpa: {
    title: 'Data Processing Agreement',
    updated: 'May 1, 2026',
    sections: [
      { heading: 'Scope', body: 'This DPA applies to the processing of personal data by StatusMy on behalf of customers using our monitoring services.' },
      { heading: 'Processing Purpose', body: 'We process data solely for the purpose of providing monitoring, alerting, and status page services as described in our Terms of Service.' },
      { heading: 'Sub-processors', body: 'We maintain a list of sub-processors used in delivering our services. Customers are notified of any changes to this list.' },
      { heading: 'Data Retention', body: 'Monitoring data is retained for the duration of your subscription plus 30 days. You may request data deletion at any time.' },
    ]
  },
  cookies: {
    title: 'Cookie Settings',
    updated: 'May 1, 2026',
    sections: [
      { heading: 'Essential Cookies', body: 'Required for the platform to function. These include session cookies, authentication tokens, and CSRF protection. Cannot be disabled.' },
      { heading: 'Analytics Cookies', body: 'Help us understand how visitors interact with our website. We use privacy-focused analytics that do not track individual users across sites.' },
      { heading: 'Preference Cookies', body: 'Remember your settings such as language preference, theme choice, and dashboard layout.' },
      { heading: 'Managing Cookies', body: 'You can manage cookie preferences through your browser settings. Note that disabling essential cookies may affect platform functionality.' },
    ]
  },
  pdpa: {
    title: 'PDPA Compliance',
    updated: 'May 1, 2026',
    sections: [
      { heading: 'Overview', body: 'StatusMy complies with the Malaysian Personal Data Protection Act 2010 (PDPA). We are committed to protecting the personal data of our users in accordance with the seven data protection principles.' },
      { heading: 'Data Protection Principles', body: 'We adhere to the General Principle, Notice and Choice Principle, Disclosure Principle, Security Principle, Retention Principle, Data Integrity Principle, and Access Principle as outlined in the PDPA.' },
      { heading: 'Consent', body: 'We obtain explicit consent before collecting and processing personal data. You may withdraw consent at any time by contacting us.' },
      { heading: 'Cross-Border Transfers', body: 'When data is transferred outside Malaysia, we ensure adequate protection through contractual safeguards and compliance with PDPA requirements.' },
      { heading: 'Contact', body: 'For PDPA-related inquiries, contact our Data Protection Officer at dpo@statusmy.com.' },
    ]
  },
}

export default function LegalPage({ slug }) {
  const content = legalContent[slug] || legalContent['privacy']

  return (
    <motion.main
      id="main-content"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-[128px] pb-[96px]"
    >
      <div className="max-w-3xl mx-auto px-[16px] sm:px-[24px] lg:px-[32px]">
        <h1 className="heading-lg text-text-primary mb-2">{content.title}</h1>
        <p className="text-body-sm text-text-muted mb-10">Last updated: {content.updated}</p>

        <div className="space-y-8">
          {content.sections.map((section, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <h2 className="text-heading-sm text-text-primary mb-2">{section.heading}</h2>
              <p className="text-body text-text-secondary leading-relaxed">{section.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.main>
  )
}
