import { useState, useEffect } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Tag, Calendar, Sparkles, Bug, Zap, Shield, Rocket, Star } from 'lucide-react'
import api from '../utils/api'

const typeConfig = {
  major: { icon: Rocket, color: 'text-[#10B981]', bg: 'bg-[#10B981]/10', label: 'Major Release' },
  minor: { icon: Zap, color: 'text-[#3B82F6]', bg: 'bg-[#3B82F6]/10', label: 'Minor Update' },
  patch: { icon: Bug, color: 'text-[#F7A501]', bg: 'bg-[#F7A501]/10', label: 'Bug Fix' },
  security: { icon: Shield, color: 'text-[#EF4444]', bg: 'bg-[#EF4444]/10', label: 'Security' },
}

export default function ChangelogPage() {
  const [releases, setReleases] = useState([])
  const [loading, setLoading] = useState(true)
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    fetchChangelog()
  }, [])

  async function fetchChangelog() {
    try {
      const res = await api.get('/changelog')
      setReleases(res.data.data || [])
    } catch (err) {
      console.error('Failed to load changelog:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <motion.main id="main-content" className="pt-[128px] pb-[96px]">
        <div className="max-w-3xl mx-auto px-[16px] sm:px-[24px] lg:px-[32px]">
          <div className="animate-pulse space-y-8">
            {[1,2,3].map(i => (
              <div key={i} className="rounded-xl border border-border bg-card/20 p-6">
                <div className="h-5 w-32 bg-card/60 rounded mb-3" />
                <div className="h-7 w-3/4 bg-card/60 rounded mb-2" />
                <div className="h-4 w-full bg-card/40 rounded" />
              </div>
            ))}
          </div>
        </div>
      </motion.main>
    )
  }

  return (
    <motion.main
      id="main-content"
      initial={prefersReducedMotion ? {} : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={prefersReducedMotion ? {} : { opacity: 0 }}
      className="pt-[128px] pb-[96px]"
    >
      <div className="max-w-3xl mx-auto px-[16px] sm:px-[24px] lg:px-[32px]">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="heading-xl text-text-primary mb-4">Changelog</h1>
          <p className="text-lg text-text-secondary">What's new in StatusMy. All the latest features, improvements, and fixes.</p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 top-0 bottom-0 w-px bg-border" />

          <div className="space-y-8">
            {releases.map((release, i) => {
              const config = typeConfig[release.type] || typeConfig.minor
              const Icon = config.icon

              return (
                <motion.div
                  key={release.version}
                  initial={prefersReducedMotion ? {} : { opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="relative pl-16"
                >
                  {/* Timeline dot */}
                  <div className={`absolute left-3 top-6 w-7 h-7 rounded-full ${config.bg} flex items-center justify-center border-2 border-bg`}>
                    <Icon size={12} className={config.color} />
                  </div>

                  {/* Card */}
                  <div className="rounded-xl border border-border bg-card/30 p-6 hover:border-brand/20 transition-colors">
                    {/* Meta */}
                    <div className="flex items-center gap-3 mb-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${config.bg} ${config.color}`}>
                        <Tag size={9} />
                        v{release.version}
                      </span>
                      <span className="flex items-center gap-1 text-caption text-text-muted">
                        <Calendar size={11} />
                        {new Date(release.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full ${config.bg} ${config.color}`}>
                        {config.label}
                      </span>
                    </div>

                    {/* Title & description */}
                    <h3 className="text-heading-sm text-text-primary mb-2">{release.title}</h3>
                    <p className="text-body-sm text-text-secondary mb-4">{release.description}</p>

                    {/* Highlights */}
                    {release.highlights && release.highlights.length > 0 && (
                      <ul className="space-y-1.5">
                        {release.highlights.map((h, j) => (
                          <li key={j} className="flex items-start gap-2 text-body-sm text-text-secondary">
                            <Star size={12} className={`${config.color} mt-0.5 flex-shrink-0`} />
                            {h}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </motion.main>
  )
}
