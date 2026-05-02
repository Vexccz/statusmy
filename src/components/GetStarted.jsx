import { useState, useRef } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

const languages = [
  {
    id: 'curl',
    label: 'cURL',
    file: 'check-status.sh',
    code: `# Create a new monitor
curl -X POST https://api.statusmy.com/v1/monitors \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "My API",
    "url": "https://api.example.com/health",
    "interval": 60,
    "alert_channels": ["email", "slack"]
  }'`,
  },
  {
    id: 'javascript',
    label: 'JavaScript',
    file: 'statusmy.config.js',
    code: `import { StatusMy } from "@statusmy/sdk";

const monitor = new StatusMy({
  apiKey: "YOUR_API_KEY",
  monitors: [
    {
      name: "Production API",
      url: "https://api.example.com",
      interval: 60,
      regions: ["sg", "kl", "hk"],
    },
  ],
});`,
  },
  {
    id: 'python',
    label: 'Python',
    file: 'statusmy_config.py',
    code: `from statusmy import StatusMy

client = StatusMy(
    api_key="YOUR_API_KEY",
)

client.create_monitor(
    name="Production API",
    url="https://api.example.com",
    interval=60,
    regions=["sg", "kl", "hk"],
    alert_channels=["email", "slack"],
)`,
  },
  {
    id: 'go',
    label: 'Go',
    file: 'main.go',
    code: `import "github.com/statusmy/statusmy-go"

func main() {
    client := statusmy.NewClient("YOUR_API_KEY")

    monitor, err := client.CreateMonitor(statusmy.Monitor{
        Name:     "Production API",
        URL:      "https://api.example.com",
        Interval: 60,
        Regions:  []string{"sg", "kl", "hk"},
    })
    if err != nil {
        log.Fatal(err)
    }
}`,
  },
  {
    id: 'ruby',
    label: 'Ruby',
    file: 'statusmy.rb',
    code: `require "statusmy"

StatusMy.configure do |config|
  config.api_key = "YOUR_API_KEY"
end

StatusMy::Monitor.create(
  name: "Production API",
  url: "https://api.example.com",
  interval: 60,
  regions: ["sg", "kl", "hk"],
)`,
  },
]

export default function GetStarted() {
  const [activeTab, setActiveTab] = useState('javascript')
  const [copied, setCopied] = useState(false)
  const tabRefs = useRef({})
  const prefersReducedMotion = useReducedMotion()

  const currentLang = languages.find((l) => l.id === activeTab)

  const handleCopy = () => {
    navigator.clipboard.writeText(currentLang.code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleTabKeyDown = (e) => {
    const ids = languages.map(l => l.id)
    const currentIndex = ids.indexOf(activeTab)
    let newIndex = currentIndex

    if (e.key === 'ArrowRight') {
      e.preventDefault()
      newIndex = (currentIndex + 1) % ids.length
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      newIndex = (currentIndex - 1 + ids.length) % ids.length
    } else if (e.key === 'Home') {
      e.preventDefault()
      newIndex = 0
    } else if (e.key === 'End') {
      e.preventDefault()
      newIndex = ids.length - 1
    }

    if (newIndex !== currentIndex) {
      setActiveTab(ids[newIndex])
      tabRefs.current[ids[newIndex]]?.focus()
    }
  }

  return (
    <section id="get-started" className="relative py-[64px] md:py-[96px]">
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute top-1/2 right-1/4 w-[400px] h-[400px] bg-[#7c3aed]/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative max-w-container mx-auto px-[16px] sm:px-[24px] lg:px-[32px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[48px] lg:gap-[64px] items-center">
          {/* Left content */}
          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="font-display text-heading-lg md:text-[3rem] md:leading-[1.1] md:tracking-[-0.02em] font-bold text-text-primary mb-[24px]">
              Get started in <span className="text-gradient">minutes</span>
            </h2>
            <p className="text-lg text-text-secondary mb-[32px] leading-relaxed">
              Add your first monitor with just a few clicks or use our API. 
              Support for HTTP, TCP, DNS, ICMP, and more.
            </p>
            
            <div className="space-y-[16px]">
              {[
                'Sign up and grab your API key',
                'Add your endpoints to monitor',
                'Configure alerts and go live',
              ].map((step, i) => (
                <div key={i} className="flex items-center gap-[12px]">
                  <div className="w-7 h-7 rounded-full bg-brand-bg flex items-center justify-center text-caption font-bold text-brand-light flex-shrink-0" aria-hidden="true">
                    {i + 1}
                  </div>
                  <span className="text-text-secondary">{step}</span>
                </div>
              ))}
            </div>

            <motion.a
              href="#"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn-primary mt-[32px] min-h-[44px] inline-flex items-center"
            >
              Read the Docs
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </motion.a>
          </motion.div>

          {/* Right code block */}
          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            <div className="rounded-lg border border-border bg-surface overflow-hidden shadow-lg">
              {/* Language tabs */}
              <div
                className="flex items-center gap-0 border-b border-border bg-card/30 overflow-x-auto"
                role="tablist"
                aria-label="Programming language"
              >
                {languages.map((lang) => (
                  <button
                    key={lang.id}
                    ref={(el) => { tabRefs.current[lang.id] = el }}
                    role="tab"
                    aria-selected={activeTab === lang.id}
                    aria-controls={`code-panel-${lang.id}`}
                    id={`code-tab-${lang.id}`}
                    tabIndex={activeTab === lang.id ? 0 : -1}
                    onClick={() => setActiveTab(lang.id)}
                    onKeyDown={handleTabKeyDown}
                    className={`px-4 py-3 text-caption font-medium whitespace-nowrap transition-all duration-150 border-b-2 min-h-[44px] ${
                      activeTab === lang.id
                        ? 'text-brand-light border-brand bg-brand/5'
                        : 'text-text-muted border-transparent hover:text-text-secondary'
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>

              {/* Window chrome */}
              <div className="flex items-center justify-between px-[16px] py-[10px] border-b border-border bg-card/20">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-semantic-error/60" aria-hidden="true" />
                  <div className="w-3 h-3 rounded-full bg-semantic-warning/60" aria-hidden="true" />
                  <div className="w-3 h-3 rounded-full bg-semantic-success/60" aria-hidden="true" />
                  <span className="ml-3 text-caption text-text-muted font-mono">{currentLang.file}</span>
                </div>
                {/* Copy button */}
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-caption text-text-muted hover:text-text-primary hover:bg-card/50 border border-border transition-all duration-150 min-h-[36px]"
                  aria-label={copied ? 'Copied to clipboard' : 'Copy code to clipboard'}
                >
                  {copied ? (
                    <>
                      <svg className="w-3.5 h-3.5 text-semantic-success" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Copied!
                    </>
                  ) : (
                    <>
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Copy
                    </>
                  )}
                </button>
              </div>
              
              {/* Code content */}
              <div
                id={`code-panel-${activeTab}`}
                role="tabpanel"
                aria-labelledby={`code-tab-${activeTab}`}
                className="p-[24px] overflow-x-auto"
              >
                <pre className="text-body-sm leading-relaxed font-mono">
                  <code className="text-text-secondary">
                    {currentLang.code.split('\n').map((line, i) => (
                      <div key={i} className="flex">
                        <span className="w-8 text-right mr-4 text-text-muted/40 select-none">{i + 1}</span>
                        <span className={
                          line.includes('import') || line.includes('require') ? 'text-brand-light' :
                          line.includes('//') || line.includes('#') ? 'text-text-muted' :
                          line.includes('"') || line.includes("'") ? 'text-semantic-success/80' :
                          line.includes('Sentry') || line.includes('sentry') ? 'text-[#ec4899]/80' :
                          'text-text-secondary'
                        }>
                          {line || '\u00A0'}
                        </span>
                      </div>
                    ))}
                  </code>
                </pre>
              </div>
            </div>

            {/* Floating badge */}
            <div className="absolute -bottom-4 -right-4 badge badge-success px-[12px] py-[6px] rounded-sm bg-card border border-border" aria-hidden="true">
              ✓ TypeScript supported
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
