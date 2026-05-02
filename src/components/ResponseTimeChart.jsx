import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine
} from 'recharts'

// Generate mock data
function generateData(hours = 24) {
  const data = []
  const now = Date.now()
  for (let i = hours * 60; i >= 0; i -= 5) {
    const time = new Date(now - i * 60000)
    const base = 80 + Math.random() * 60
    const spike = Math.random() > 0.95 ? Math.random() * 300 : 0
    data.push({
      time: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      responseTime: Math.round(base + spike),
      timestamp: time.getTime(),
    })
  }
  return data
}

const ranges = [
  { label: '1H', hours: 1 },
  { label: '6H', hours: 6 },
  { label: '24H', hours: 24 },
  { label: '7D', hours: 168 },
  { label: '30D', hours: 720 },
]

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-card border border-border rounded-lg px-3 py-2 shadow-lg">
      <p className="text-caption text-text-muted">{label}</p>
      <p className="text-body-sm font-semibold text-brand-light">{payload[0].value}ms</p>
    </div>
  )
}

export default function ResponseTimeChart({ monitorName = 'api.myapp.com' }) {
  const [activeRange, setActiveRange] = useState('24H')
  const [data] = useState(() => generateData(24))

  const avg = Math.round(data.reduce((s, d) => s + d.responseTime, 0) / data.length)
  const max = Math.max(...data.map(d => d.responseTime))
  const min = Math.min(...data.map(d => d.responseTime))
  const p95 = Math.round(data.map(d => d.responseTime).sort((a, b) => a - b)[Math.floor(data.length * 0.95)])

  return (
    <div className="rounded-xl border border-border bg-card/30 p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-heading-sm text-text-primary">Response Time</h3>
          <p className="text-caption text-text-muted">{monitorName}</p>
        </div>
        <div className="flex items-center gap-1 bg-surface rounded-lg p-0.5 border border-border">
          {ranges.map(r => (
            <button
              key={r.label}
              onClick={() => setActiveRange(r.label)}
              className={`px-3 py-1 rounded-md text-caption font-medium transition-all ${
                activeRange === r.label
                  ? 'bg-brand/20 text-brand-light'
                  : 'text-text-muted hover:text-text-primary'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 mb-4">
        {[
          { label: 'Average', value: `${avg}ms`, color: 'text-brand-light' },
          { label: 'P95', value: `${p95}ms`, color: 'text-[#F7A501]' },
          { label: 'Max', value: `${max}ms`, color: 'text-[#F54E4E]' },
          { label: 'Min', value: `${min}ms`, color: 'text-[#30CF79]' },
        ].map(s => (
          <div key={s.label} className="text-center">
            <div className={`text-sm font-bold ${s.color}`}>{s.value}</div>
            <div className="text-[10px] text-text-muted">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="h-[200px]"
      >
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="responseGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10B981" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#10B981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis
              dataKey="time"
              tick={{ fontSize: 10, fill: 'var(--text-muted)' }}
              tickLine={false}
              axisLine={{ stroke: 'var(--border)' }}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fontSize: 10, fill: 'var(--text-muted)' }}
              tickLine={false}
              axisLine={false}
              tickFormatter={v => `${v}ms`}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={avg} stroke="#10B981" strokeDasharray="4 4" strokeOpacity={0.5} />
            <Area
              type="monotone"
              dataKey="responseTime"
              stroke="#10B981"
              strokeWidth={2}
              fill="url(#responseGrad)"
              animationDuration={1000}
            />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  )
}
