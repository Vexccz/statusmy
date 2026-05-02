import { motion } from 'framer-motion'
import { useCountUp } from '../hooks/useCountUp'

const stats = [
  { end: 10, suffix: 'K+', label: 'Monitors Active' },
  { end: 500, suffix: '+', label: 'Companies' },
  { end: 50, suffix: '+', label: 'Check Locations' },
  { end: 99.9, suffix: '%', label: 'Platform Uptime', decimals: 1 },
]

function AnimatedCounter({ end, suffix, label, decimals = 0 }) {
  const [ref, count] = useCountUp(end, 2000, decimals)
  return (
    <div ref={ref} className="text-center">
      <div className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2">
        {count}{suffix}
      </div>
      <div className="text-body-sm text-white/60">{label}</div>
    </div>
  )
}

export default function StatsBanner() {
  return (
    <section className="relative py-[48px] md:py-[64px] overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#10B981] via-[#34D399] to-[#059669]" />
      
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.3) 1px, transparent 0)`,
        backgroundSize: '32px 32px'
      }} />

      {/* Glow effects */}
      <div className="absolute top-0 left-1/4 w-[300px] h-[200px] bg-white/10 rounded-full blur-[80px]" />
      <div className="absolute bottom-0 right-1/4 w-[300px] h-[200px] bg-[#059669]/20 rounded-full blur-[80px]" />

      <div className="relative max-w-container mx-auto px-[16px] sm:px-[24px] lg:px-[32px]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12"
        >
          {stats.map((stat) => (
            <AnimatedCounter
              key={stat.label}
              end={stat.end}
              suffix={stat.suffix}
              label={stat.label}
              decimals={stat.decimals}
            />
          ))}
        </motion.div>
      </div>
    </section>
  )
}
