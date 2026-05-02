import { motion } from 'framer-motion'
import { useState } from 'react'

const monitoringLocations = [
  { id: 'kl', name: 'Kuala Lumpur', x: 72.5, y: 52, latency: '12ms', status: 'up' },
  { id: 'sg', name: 'Singapore', x: 73, y: 54, latency: '18ms', status: 'up' },
  { id: 'tk', name: 'Tokyo', x: 82, y: 35, latency: '45ms', status: 'up' },
  { id: 'sy', name: 'Sydney', x: 85, y: 72, latency: '89ms', status: 'up' },
  { id: 'mu', name: 'Mumbai', x: 62, y: 44, latency: '67ms', status: 'up' },
  { id: 'fr', name: 'Frankfurt', x: 42, y: 30, latency: '142ms', status: 'up' },
  { id: 'ln', name: 'London', x: 38, y: 28, latency: '156ms', status: 'up' },
  { id: 'ny', name: 'New York', x: 22, y: 34, latency: '198ms', status: 'up' },
  { id: 'sf', name: 'San Francisco', x: 12, y: 36, latency: '210ms', status: 'up' },
  { id: 'sp', name: 'São Paulo', x: 27, y: 66, latency: '245ms', status: 'warning' },
  { id: 'jb', name: 'Johannesburg', x: 45, y: 68, latency: '178ms', status: 'up' },
  { id: 'du', name: 'Dubai', x: 55, y: 40, latency: '98ms', status: 'up' },
]

export default function WorldMap() {
  const [hovered, setHovered] = useState(null)

  return (
    <div className="relative w-full rounded-xl border border-border bg-card/30 p-6 overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-heading-sm text-text-primary">Global Monitoring Network</h3>
          <p className="text-caption text-text-muted">12 regions, 50+ locations</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-[#30CF79]" />
            <span className="text-caption text-text-muted">Operational</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-[#F7A501]" />
            <span className="text-caption text-text-muted">Degraded</span>
          </div>
        </div>
      </div>

      {/* Map SVG */}
      <div className="relative aspect-[2/1] w-full">
        {/* Simplified world map outline */}
        <svg viewBox="0 0 100 50" className="w-full h-full opacity-20" preserveAspectRatio="xMidYMid meet">
          {/* Simplified continents as paths */}
          <path d="M15 20 Q20 15 25 18 L30 20 Q28 25 25 28 L20 30 Q15 28 13 25 Z" fill="var(--text-muted)" opacity="0.3" />
          <path d="M20 32 Q22 30 25 32 L28 40 Q30 50 27 55 L22 58 Q18 55 17 50 L18 42 Z" fill="var(--text-muted)" opacity="0.3" />
          <path d="M35 15 Q45 12 55 15 L60 18 Q58 22 55 25 L50 28 Q45 30 40 28 L37 25 Q34 20 35 15 Z" fill="var(--text-muted)" opacity="0.3" />
          <path d="M38 30 Q42 28 48 30 L52 35 Q50 40 47 42 L42 40 Q38 38 37 35 Z" fill="var(--text-muted)" opacity="0.3" />
          <path d="M55 20 Q65 18 75 20 L82 22 Q85 25 83 28 L78 30 Q72 32 65 30 L58 28 Q55 25 55 20 Z" fill="var(--text-muted)" opacity="0.3" />
          <path d="M65 32 Q70 30 75 32 L78 38 Q76 42 73 44 L68 42 Q65 38 65 32 Z" fill="var(--text-muted)" opacity="0.3" />
          <path d="M78 35 Q82 33 86 36 L88 42 Q86 48 83 50 L80 48 Q77 44 78 35 Z" fill="var(--text-muted)" opacity="0.3" />
        </svg>

        {/* Monitoring nodes */}
        {monitoringLocations.map((loc, i) => (
          <motion.div
            key={loc.id}
            className="absolute"
            style={{ left: `${loc.x}%`, top: `${loc.y}%`, transform: 'translate(-50%, -50%)' }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5 + i * 0.1, type: 'spring' }}
            onMouseEnter={() => setHovered(loc.id)}
            onMouseLeave={() => setHovered(null)}
          >
            {/* Pulse ring */}
            <motion.div
              className={`absolute inset-0 rounded-full ${loc.status === 'up' ? 'bg-[#30CF79]' : 'bg-[#F7A501]'}`}
              animate={{ scale: [1, 2.5, 1], opacity: [0.4, 0, 0.4] }}
              transition={{ duration: 3, repeat: Infinity, delay: i * 0.3 }}
              style={{ width: 12, height: 12, margin: '-2px' }}
            />
            {/* Dot */}
            <div className={`relative w-3 h-3 rounded-full border-2 border-card cursor-pointer ${
              loc.status === 'up' ? 'bg-[#30CF79]' : 'bg-[#F7A501]'
            }`} />

            {/* Tooltip */}
            {hovered === loc.id && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 rounded-lg bg-card border border-border shadow-lg whitespace-nowrap z-10"
              >
                <p className="text-caption font-medium text-text-primary">{loc.name}</p>
                <p className="text-[10px] text-brand-light">{loc.latency}</p>
              </motion.div>
            )}
          </motion.div>
        ))}

        {/* Connection lines from KL to other nodes */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 80">
          {monitoringLocations.filter(l => l.id !== 'kl').map((loc, i) => (
            <motion.line
              key={loc.id}
              x1="72.5" y1="52"
              x2={loc.x} y2={loc.y}
              stroke="var(--brand)"
              strokeWidth="0.15"
              strokeDasharray="1 1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              transition={{ delay: 1 + i * 0.1 }}
            />
          ))}
        </svg>
      </div>
    </div>
  )
}
