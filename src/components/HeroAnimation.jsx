import { motion } from 'framer-motion'

export default function HeroAnimation() {
  return (
    <div className="relative w-full max-w-lg mx-auto" aria-hidden="true">
      <svg viewBox="0 0 500 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
        {/* Background circle glow */}
        <motion.circle
          cx="250" cy="200" r="150"
          fill="url(#glowGradient)"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.15, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />

        {/* Server rack */}
        <motion.g
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Server box 1 */}
          <rect x="180" y="120" width="140" height="45" rx="6" fill="#1a1a2e" stroke="#2d2d44" strokeWidth="1.5" />
          <motion.circle
            cx="200" cy="142"
            r="4"
            fill="#10B981"
            animate={{ opacity: [1, 0.4, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
          <rect x="212" y="136" width="40" height="3" rx="1.5" fill="#2d2d44" />
          <rect x="212" y="143" width="60" height="3" rx="1.5" fill="#2d2d44" />
          <rect x="212" y="150" width="30" height="3" rx="1.5" fill="#2d2d44" />
          {/* Activity bars */}
          <motion.rect x="280" y="132" width="4" height="12" rx="2" fill="#10B981"
            animate={{ height: [12, 20, 8, 16, 12] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.rect x="288" y="136" width="4" height="8" rx="2" fill="#10B981"
            animate={{ height: [8, 14, 20, 10, 8] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
          />
          <motion.rect x="296" y="130" width="4" height="14" rx="2" fill="#10B981"
            animate={{ height: [14, 8, 12, 20, 14] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
          />
          <motion.rect x="304" y="134" width="4" height="10" rx="2" fill="#34D399"
            animate={{ height: [10, 18, 6, 14, 10] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
          />
        </motion.g>

        {/* Server box 2 */}
        <motion.g
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <rect x="180" y="175" width="140" height="45" rx="6" fill="#1a1a2e" stroke="#2d2d44" strokeWidth="1.5" />
          <motion.circle
            cx="200" cy="197"
            r="4"
            fill="#10B981"
            animate={{ opacity: [1, 0.4, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          />
          <rect x="212" y="191" width="50" height="3" rx="1.5" fill="#2d2d44" />
          <rect x="212" y="198" width="35" height="3" rx="1.5" fill="#2d2d44" />
          <rect x="212" y="205" width="55" height="3" rx="1.5" fill="#2d2d44" />
          <motion.rect x="280" y="187" width="4" height="12" rx="2" fill="#34D399"
            animate={{ height: [12, 6, 18, 10, 12] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.rect x="288" y="190" width="4" height="9" rx="2" fill="#34D399"
            animate={{ height: [9, 16, 7, 13, 9] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
          />
          <motion.rect x="296" y="185" width="4" height="15" rx="2" fill="#10B981"
            animate={{ height: [15, 9, 20, 12, 15] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          />
          <motion.rect x="304" y="189" width="4" height="11" rx="2" fill="#10B981"
            animate={{ height: [11, 17, 8, 14, 11] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", delay: 0.7 }}
          />
        </motion.g>

        {/* Server box 3 - with warning */}
        <motion.g
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <rect x="180" y="230" width="140" height="45" rx="6" fill="#1a1a2e" stroke="#2d2d44" strokeWidth="1.5" />
          <motion.circle
            cx="200" cy="252"
            r="4"
            fill="#F54E4E"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
          />
          <rect x="212" y="246" width="45" height="3" rx="1.5" fill="#2d2d44" />
          <rect x="212" y="253" width="55" height="3" rx="1.5" fill="#2d2d44" />
          <rect x="212" y="260" width="25" height="3" rx="1.5" fill="#2d2d44" />
          <motion.rect x="280" y="245" width="4" height="5" rx="2" fill="#F54E4E"
            animate={{ height: [5, 2, 5, 3, 5] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.rect x="288" y="247" width="4" height="3" rx="2" fill="#F54E4E"
            animate={{ height: [3, 6, 2, 4, 3] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
          />
          <motion.rect x="296" y="246" width="4" height="4" rx="2" fill="#F54E4E"
            animate={{ height: [4, 2, 6, 3, 4] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
          />
        </motion.g>

        {/* Ping lines going out from servers */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          {/* Left connections */}
          <motion.path
            d="M180 142 L100 100"
            stroke="#10B981"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
          />
          <motion.circle cx="100" cy="100" r="8" fill="#1a1a2e" stroke="#10B981" strokeWidth="1.5"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1.8, type: "spring" }}
          />
          <motion.circle cx="100" cy="100" r="3" fill="#10B981"
            animate={{ opacity: [1, 0.4, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />

          <motion.path
            d="M180 197 L80 220"
            stroke="#10B981"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, delay: 1.4 }}
          />
          <motion.circle cx="80" cy="220" r="8" fill="#1a1a2e" stroke="#10B981" strokeWidth="1.5"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 2, type: "spring" }}
          />
          <motion.circle cx="80" cy="220" r="3" fill="#10B981"
            animate={{ opacity: [1, 0.4, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
          />

          {/* Right connections */}
          <motion.path
            d="M320 142 L400 90"
            stroke="#10B981"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, delay: 1.3 }}
          />
          <motion.circle cx="400" cy="90" r="8" fill="#1a1a2e" stroke="#10B981" strokeWidth="1.5"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1.9, type: "spring" }}
          />
          <motion.circle cx="400" cy="90" r="3" fill="#10B981"
            animate={{ opacity: [1, 0.4, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
          />

          <motion.path
            d="M320 197 L420 200"
            stroke="#10B981"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, delay: 1.5 }}
          />
          <motion.circle cx="420" cy="200" r="8" fill="#1a1a2e" stroke="#34D399" strokeWidth="1.5"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 2.1, type: "spring" }}
          />
          <motion.circle cx="420" cy="200" r="3" fill="#34D399"
            animate={{ opacity: [1, 0.4, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.7 }}
          />

          <motion.path
            d="M320 252 L410 310"
            stroke="#F54E4E"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, delay: 1.6 }}
          />
          <motion.circle cx="410" cy="310" r="8" fill="#1a1a2e" stroke="#F54E4E" strokeWidth="1.5"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 2.2, type: "spring" }}
          />
          <motion.circle cx="410" cy="310" r="3" fill="#F54E4E"
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 0.8, repeat: Infinity }}
          />
        </motion.g>

        {/* Pulse rings on alert node */}
        <motion.circle
          cx="410" cy="310" r="8"
          stroke="#F54E4E"
          strokeWidth="1"
          fill="none"
          animate={{ r: [8, 20, 8], opacity: [0.6, 0, 0.6] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
        />

        {/* Uptime graph at bottom */}
        <motion.g
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.5, duration: 0.5 }}
        >
          <rect x="130" y="310" width="240" height="60" rx="8" fill="#1a1a2e" stroke="#2d2d44" strokeWidth="1" />
          <text x="145" y="328" fill="#6b7280" fontSize="8" fontFamily="monospace">UPTIME 30d</text>
          <text x="330" y="328" fill="#10B981" fontSize="8" fontFamily="monospace" textAnchor="end">99.95%</text>
          
          {/* Uptime bars */}
          {Array.from({ length: 30 }).map((_, i) => {
            const isDown = i === 22
            return (
              <motion.rect
                key={i}
                x={145 + i * 7}
                y="338"
                width="5"
                height="20"
                rx="2"
                fill={isDown ? "#F54E4E" : "#10B981"}
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ delay: 2.7 + i * 0.03, duration: 0.2 }}
                style={{ transformOrigin: `${145 + i * 7}px 358px` }}
              />
            )
          })}
        </motion.g>

        {/* Gradient definitions */}
        <defs>
          <radialGradient id="glowGradient" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="#10B981" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
          </radialGradient>
        </defs>
      </svg>
    </div>
  )
}
