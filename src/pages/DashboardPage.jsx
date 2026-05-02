import { useState, useEffect, useCallback } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import {
  Plus,
  Activity,
  ArrowUp,
  ArrowDown,
  Clock,
  AlertTriangle,
  CheckCircle2,
  BarChart3,
  Crown,
  Shield,
  Globe,
  RefreshCw,
} from 'lucide-react'
import api from '../utils/api'
import { useSocket } from '../context/SocketContext'
import ResponseTimeChartGlobal from '../components/ResponseTimeChart'
import WorldMap from '../components/WorldMap'
import { showToast } from '../components/Toast'

// ── Helpers ────────────────────────────────────────────────

const statusColor = {
  up: '#10B981',
  down: '#EF4444',
  degraded: '#F59E0B',
  paused: '#6b6b7b',
}

const incidentStatusConfig = {
  resolved: { color: '#10B981', bg: 'rgba(16,185,129,0.1)', label: 'Resolved' },
  investigating: { color: '#F59E0B', bg: 'rgba(245,158,11,0.1)', label: 'Investigating' },
  identified: { color: '#3B82F6', bg: 'rgba(59,130,246,0.1)', label: 'Identified' },
  monitoring: { color: '#10B981', bg: 'rgba(16,185,129,0.1)', label: 'Monitoring' },
  open: { color: '#EF4444', bg: 'rgba(239,68,68,0.1)', label: 'Open' },
}

// ── Animation Variants ─────────────────────────────────────

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } },
}

// ── Sub-components ─────────────────────────────────────────

function StatCard({ icon: Icon, label, value, sub, color }) {
  return (
    <motion.div variants={itemVariants} className="card flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-body-sm text-text-secondary">{label}</span>
        <div
          className="w-9 h-9 rounded-md flex items-center justify-center"
          style={{ background: color ? `${color}15` : 'var(--brand-bg)' }}
        >
          <Icon size={18} style={{ color: color || 'var(--brand)' }} />
        </div>
      </div>
      <div>
        <p className="text-heading-md text-text-primary">{value}</p>
        {sub && <p className="text-caption text-text-muted mt-1">{sub}</p>}
      </div>
    </motion.div>
  )
}

function StatCardSkeleton() {
  return (
    <div className="card animate-pulse flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="h-4 w-24 bg-surface rounded" />
        <div className="w-9 h-9 rounded-md bg-surface" />
      </div>
      <div>
        <div className="h-7 w-16 bg-surface rounded mb-1" />
        <div className="h-3 w-20 bg-surface/60 rounded" />
      </div>
    </div>
  )
}

function UptimeMiniBar({ checks }) {
  // Show last 30 checks as colored blocks
  const last30 = (checks || []).slice(0, 30)
  if (last30.length === 0) {
    return (
      <div className="flex gap-[2px] items-center">
        {Array.from({ length: 30 }).map((_, i) => (
          <div key={i} className="w-[4px] h-[16px] rounded-[1px] bg-surface" />
        ))}
      </div>
    )
  }

  return (
    <div className="flex gap-[2px] items-center" title="Last 30 checks">
      {last30.map((check, i) => (
        <div
          key={i}
          className="w-[4px] h-[16px] rounded-[1px]"
          style={{
            background: statusColor[check.status] || statusColor.up,
            opacity: 0.85,
          }}
        />
      ))}
    </div>
  )
}

function MonitorRow({ monitor, onClick }) {
  const status = monitor.is_paused
    ? 'paused'
    : monitor.latest_check?.status === 'up'
    ? 'up'
    : monitor.latest_check?.status === 'down'
    ? 'down'
    : 'up'

  const responseTime = monitor.latest_check?.response_time || monitor.latest_check?.responseTime || 0
  const uptime = monitor.stats?.uptimePercentage ?? monitor.stats?.uptime_percentage ?? '--'

  function timeAgo(ts) {
    if (!ts) return '--'
    const diff = Date.now() - new Date(ts).getTime()
    if (diff < 60000) return `${Math.floor(diff / 1000)}s ago`
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
    return `${Math.floor(diff / 3600000)}h ago`
  }

  return (
    <motion.div
      variants={itemVariants}
      onClick={onClick}
      className="flex items-center gap-4 py-3 px-4 rounded-md hover:bg-surface/50 transition-colors duration-150 cursor-pointer group"
    >
      {/* Status dot */}
      <div className="relative flex-shrink-0">
        <div
          className="w-2.5 h-2.5 rounded-full"
          style={{ background: statusColor[status] }}
        />
        {status === 'up' && (
          <div
            className="absolute inset-0 w-2.5 h-2.5 rounded-full animate-ping"
            style={{ background: statusColor[status], opacity: 0.3 }}
          />
        )}
      </div>

      {/* Icon + Name + URL */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div className="w-8 h-8 rounded-md flex items-center justify-center bg-surface flex-shrink-0">
          <Globe size={16} className="text-text-muted" />
        </div>
        <div className="min-w-0">
          <p className="text-body-sm font-medium text-text-primary truncate">{monitor.name}</p>
          <p className="text-caption text-text-muted truncate">{monitor.url}</p>
        </div>
      </div>

      {/* Uptime bar - hidden on small screens */}
      <div className="hidden lg:block flex-shrink-0">
        <UptimeMiniBar checks={monitor.recentChecks || []} />
      </div>

      {/* Uptime % */}
      <div className="text-right flex-shrink-0 w-[60px] hidden sm:block">
        <p className="text-body-sm font-medium" style={{ color: statusColor[status] }}>
          {uptime !== '--' ? `${Number(uptime).toFixed(1)}%` : '--'}
        </p>
      </div>

      {/* Response time */}
      <div className="text-right flex-shrink-0 w-[60px] hidden sm:block">
        <p className="text-body-sm text-text-secondary">
          {responseTime > 0 ? `${responseTime}ms` : '--'}
        </p>
      </div>

      {/* Last checked */}
      <div className="text-right flex-shrink-0 w-[70px] hidden md:block">
        <p className="text-caption text-text-muted">
          {timeAgo(monitor.latest_check?.checked_at || monitor.latest_check?.createdAt)}
        </p>
      </div>
    </motion.div>
  )
}

function MonitorRowSkeleton() {
  return (
    <div className="flex items-center gap-4 py-3 px-4 animate-pulse">
      <div className="w-2.5 h-2.5 rounded-full bg-surface" />
      <div className="flex items-center gap-3 flex-1">
        <div className="w-8 h-8 rounded-md bg-surface" />
        <div>
          <div className="h-4 w-32 bg-surface rounded mb-1" />
          <div className="h-3 w-48 bg-surface/60 rounded" />
        </div>
      </div>
      <div className="hidden sm:block w-[60px]">
        <div className="h-4 w-12 bg-surface rounded ml-auto" />
      </div>
    </div>
  )
}

function IncidentItem({ incident }) {
  const status = incident.status || 'open'
  const cfg = incidentStatusConfig[status] || incidentStatusConfig.open
  return (
    <div className="flex gap-3 py-3 border-b border-border last:border-0">
      <div className="flex-shrink-0 mt-0.5">
        {status === 'resolved' ? (
          <CheckCircle2 size={16} style={{ color: cfg.color }} />
        ) : (
          <AlertTriangle size={16} style={{ color: cfg.color }} />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-body-sm font-medium text-text-primary">{incident.title}</p>
          <span
            className="text-caption px-2 py-0.5 rounded-full"
            style={{ background: cfg.bg, color: cfg.color }}
          >
            {cfg.label}
          </span>
        </div>
        {incident.description && (
          <p className="text-caption text-text-muted mt-1">{incident.description}</p>
        )}
        <p className="text-caption text-text-muted mt-1">
          {incident.createdAt ? new Date(incident.createdAt).toLocaleDateString('en-MY', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : ''}
        </p>
      </div>
    </div>
  )
}

// ── Response Time Chart (from real data) ───────────────────

function ResponseTimeChart({ monitors }) {
  // Aggregate response times from all monitors' latest checks
  // For the dashboard overview, we'll show a simple chart from the first monitor with checks
  // or a placeholder
  if (!monitors || monitors.length === 0) {
    return (
      <div className="flex items-center justify-center h-[180px] text-text-muted text-body-sm">
        Add monitors to see response time data
      </div>
    )
  }

  // Use the first monitor's recent checks for the overview chart
  const firstWithChecks = monitors.find((m) => m.recentChecks && m.recentChecks.length > 2)
  if (!firstWithChecks) {
    return (
      <div className="flex items-center justify-center h-[180px] text-text-muted text-body-sm">
        Waiting for check data...
      </div>
    )
  }

  const data = [...firstWithChecks.recentChecks].reverse().slice(-24)
  const width = 600
  const height = 200
  const padding = { top: 20, right: 20, bottom: 30, left: 45 }
  const chartW = width - padding.left - padding.right
  const chartH = height - padding.top - padding.bottom

  const values = data.map((c) => c.response_time || c.responseTime || 0)
  const maxVal = Math.max(...values, 1)
  const minVal = Math.min(...values)
  const range = maxVal - minVal || 1

  const points = data.map((c, i) => ({
    x: padding.left + (i / (data.length - 1)) * chartW,
    y: padding.top + chartH - ((values[i] - minVal) / range) * chartH,
  }))

  let pathD = `M ${points[0].x} ${points[0].y}`
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1]
    const curr = points[i]
    const cpx1 = prev.x + (curr.x - prev.x) * 0.4
    const cpx2 = curr.x - (curr.x - prev.x) * 0.4
    pathD += ` C ${cpx1} ${prev.y}, ${cpx2} ${curr.y}, ${curr.x} ${curr.y}`
  }

  const areaD =
    pathD +
    ` L ${points[points.length - 1].x} ${padding.top + chartH} L ${points[0].x} ${padding.top + chartH} Z`

  const yLabels = [minVal, Math.round((minVal + maxVal) / 2), maxVal]

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
      <defs>
        <linearGradient id="dashChartGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#10B981" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
        </linearGradient>
      </defs>

      {yLabels.map((val, i) => {
        const y = padding.top + chartH - ((val - minVal) / range) * chartH
        return (
          <g key={i}>
            <line
              x1={padding.left}
              y1={y}
              x2={width - padding.right}
              y2={y}
              stroke="var(--border)"
              strokeDasharray="4 4"
            />
            <text
              x={padding.left - 8}
              y={y + 4}
              textAnchor="end"
              fill="var(--text-muted)"
              fontSize="10"
              fontFamily="var(--font-mono)"
            >
              {Math.round(val)}ms
            </text>
          </g>
        )
      })}

      <path d={areaD} fill="url(#dashChartGrad)" />
      <path d={pathD} fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" />
      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="3" fill="#10B981" opacity="0.6" />
      ))}
    </svg>
  )
}

// ── Main Component ─────────────────────────────────────────

export default function DashboardPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const prefersReducedMotion = useReducedMotion()
  const { socket, connected } = useSocket()

  const [stats, setStats] = useState(null)
  const [monitors, setMonitors] = useState([])
  const [incidents, setIncidents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchData = useCallback(async () => {
    try {
      setError(null)
      const [statsRes, monitorsRes, incidentsRes] = await Promise.all([
        api.get('/dashboard/stats'),
        api.get('/monitors'),
        api.get('/incidents'),
      ])

      setStats(statsRes.data.data || statsRes.data)

      const monitorsList = monitorsRes.data.data || monitorsRes.data || []

      // Fetch recent checks for each monitor (for uptime bars)
      const monitorsWithChecks = await Promise.all(
        monitorsList.map(async (m) => {
          try {
            const checksRes = await api.get(`/monitors/${m._id || m.id}/checks`)
            const checksData = checksRes.data.data || checksRes.data || []
            // Also fetch stats
            const statsRes2 = await api.get(`/monitors/${m._id || m.id}/stats`)
            return {
              ...m,
              recentChecks: checksData.slice(0, 30),
              stats: statsRes2.data.data || statsRes2.data,
            }
          } catch {
            return { ...m, recentChecks: [], stats: null }
          }
        })
      )

      setMonitors(monitorsWithChecks)
      setIncidents(incidentsRes.data.data || incidentsRes.data || [])
      setLoading(false)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard data')
      setLoading(false)
    }
  }, [])

  // Polling fallback (60s when socket connected, 30s when not)
  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, connected ? 60000 : 30000)
    return () => clearInterval(interval)
  }, [fetchData, connected])

  // Socket event listeners
  useEffect(() => {
    if (!socket) return

    const handleMonitorCheck = (data) => {
      setMonitors((prev) =>
        prev.map((m) => {
          if ((m._id || m.id) == data.monitorId) {
            return {
              ...m,
              latest_check: {
                ...m.latest_check,
                status: data.status,
                response_time: data.responseTimeMs,
                responseTime: data.responseTimeMs,
                checked_at: data.checkedAt,
              },
              latestCheck: {
                ...m.latestCheck,
                status: data.status,
                response_time: data.responseTimeMs,
                responseTime: data.responseTimeMs,
                checked_at: data.checkedAt,
              },
              recentChecks: [
                { status: data.status, response_time: data.responseTimeMs, checked_at: data.checkedAt },
                ...(m.recentChecks || []).slice(0, 29),
              ],
            }
          }
          return m
        })
      )
    }

    const handleStatusChange = (data) => {
      if (data.newStatus === 'down') {
        showToast({ type: 'down', title: `${data.monitorName} is DOWN`, message: 'Monitor detected as unreachable' })
      } else if (data.newStatus === 'up' && data.previousStatus === 'down') {
        showToast({ type: 'up', title: `${data.monitorName} is back UP`, message: 'Monitor recovered' })
      }
    }

    const handleStatsUpdate = () => {
      // Refresh stats from API on stats update
      api.get('/dashboard/stats').then((res) => {
        setStats(res.data.data || res.data)
      }).catch(() => {})
    }

    const handleIncidentCreated = (data) => {
      setIncidents((prev) => [data, ...prev])
    }

    const handleIncidentResolved = (data) => {
      setIncidents((prev) =>
        prev.map((inc) =>
          (inc._id || inc.id) == data.id ? { ...inc, status: 'resolved' } : inc
        )
      )
    }

    socket.on('monitor:check', handleMonitorCheck)
    socket.on('monitor:status-change', handleStatusChange)
    socket.on('stats:update', handleStatsUpdate)
    socket.on('incident:created', handleIncidentCreated)
    socket.on('incident:resolved', handleIncidentResolved)

    return () => {
      socket.off('monitor:check', handleMonitorCheck)
      socket.off('monitor:status-change', handleStatusChange)
      socket.off('stats:update', handleStatsUpdate)
      socket.off('incident:created', handleIncidentCreated)
      socket.off('incident:resolved', handleIncidentResolved)
    }
  }, [socket])

  const anim = prefersReducedMotion
    ? { variants: undefined, initial: undefined, animate: undefined }
    : { variants: containerVariants, initial: 'hidden', animate: 'visible' }

  // ── Loading skeleton ──
  if (loading) {
    return (
      <main className="p-6 lg:p-8">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div className="animate-pulse">
              <div className="h-8 w-64 bg-card/60 rounded mb-2" />
              <div className="h-4 w-48 bg-card/40 rounded" />
            </div>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[1, 2, 3, 4].map((i) => <StatCardSkeleton key={i} />)}
          </div>
          <div className="card !p-0 overflow-hidden">
            <div className="px-5 py-4 border-b border-border">
              <div className="h-5 w-24 bg-surface rounded animate-pulse" />
            </div>
            {[1, 2, 3].map((i) => <MonitorRowSkeleton key={i} />)}
          </div>
        </div>
      </main>
    )
  }

  const monitorsUp = stats?.monitorsUp ?? 0
  const monitorsDown = stats?.monitorsDown ?? 0
  const totalMonitors = stats?.totalMonitors ?? monitors.length
  const avgResponseTime = stats?.avgResponseTime ?? 0
  const overallUptime = stats?.overallUptime ?? 0

  return (
    <motion.main
      id="main-content"
      initial={prefersReducedMotion ? {} : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={prefersReducedMotion ? {} : { opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="p-6 lg:p-8"
    >
      <div className="max-w-[1400px] mx-auto">
        {/* ── Header ──────────────────────────────────── */}
        <motion.div
          {...anim}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
        >
          <motion.div variants={itemVariants}>
            <h1 className="text-heading-lg text-text-primary">
              Welcome back, {user?.name || 'User'}
            </h1>
            <p className="text-body-sm text-text-secondary mt-1">
              Here's what's happening with your monitors today.
            </p>
          </motion.div>
          <motion.div variants={itemVariants} className="flex items-center gap-2">
            {connected && (
              <span className="flex items-center gap-1.5 text-caption text-[#10B981] mr-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10B981]" />
                </span>
                Live
              </span>
            )}
            <button
              onClick={fetchData}
              className="btn-secondary btn-sm"
              title="Refresh"
            >
              <RefreshCw size={14} />
            </button>
            <button
              onClick={() => navigate('/dashboard/add-monitor')}
              className="btn-primary btn-sm"
            >
              <Plus size={16} />
              Add Monitor
            </button>
          </motion.div>
        </motion.div>

        {/* Error banner */}
        {error && (
          <div className="mb-6 p-4 rounded-md bg-[rgba(245,78,78,0.1)] border border-[rgba(245,78,78,0.2)] text-body-sm text-[var(--error)]">
            {error}
          </div>
        )}

        {/* ── Stats Row ───────────────────────────────── */}
        <motion.div
          {...anim}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          <StatCard
            icon={Activity}
            label="Total Monitors"
            value={totalMonitors}
            sub="Across all services"
            color="#10B981"
          />
          <StatCard
            icon={ArrowUp}
            label="Monitors Up"
            value={monitorsUp}
            sub="Operational"
            color="#10B981"
          />
          <StatCard
            icon={ArrowDown}
            label="Monitors Down"
            value={monitorsDown}
            sub={monitorsDown > 0 ? 'Needs attention' : 'All clear'}
            color="#EF4444"
          />
          <StatCard
            icon={Clock}
            label="Avg Response Time"
            value={`${Math.round(avgResponseTime)}ms`}
            sub="Last 24 hours"
            color="#3B82F6"
          />
        </motion.div>

        {/* ── Main Content (2 columns) ────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Left Column (wider) */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Monitors List */}
            <motion.div {...anim} className="card !p-0 overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                <h2 className="text-heading-sm text-text-primary">Monitors</h2>
                <div className="flex items-center gap-2">
                  <span className="text-caption text-text-muted">
                    {monitorsUp}/{totalMonitors} up
                  </span>
                </div>
              </div>

              {monitors.length === 0 ? (
                /* Empty state */
                <div className="py-12 text-center">
                  <Globe size={40} className="mx-auto text-text-muted mb-4" />
                  <h3 className="text-heading-sm text-text-primary mb-2">Add your first monitor</h3>
                  <p className="text-body-sm text-text-secondary mb-6 max-w-sm mx-auto">
                    Start monitoring your websites and APIs. Get notified when they go down.
                  </p>
                  <button
                    onClick={() => navigate('/dashboard/add-monitor')}
                    className="btn-primary btn-sm"
                  >
                    <Plus size={16} />
                    Add Monitor
                  </button>
                </div>
              ) : (
                <>
                  {/* Table header - hidden on mobile */}
                  <div className="hidden sm:flex items-center gap-4 px-4 py-2 text-caption text-text-muted border-b border-border">
                    <div className="w-2.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">Service</div>
                    <div className="hidden lg:block flex-shrink-0 w-[132px]">Recent checks</div>
                    <div className="w-[60px] text-right flex-shrink-0">Uptime</div>
                    <div className="w-[60px] text-right flex-shrink-0">Latency</div>
                    <div className="w-[70px] text-right flex-shrink-0 hidden md:block">Checked</div>
                  </div>

                  <motion.div {...anim} className="divide-y divide-border/50">
                    {monitors.map((monitor) => (
                      <MonitorRow
                        key={monitor._id || monitor.id}
                        monitor={monitor}
                        onClick={() => navigate(`/dashboard/monitors/${monitor._id || monitor.id}`)}
                      />
                    ))}
                  </motion.div>
                </>
              )}
            </motion.div>

            {/* Response Time Chart */}
            <motion.div variants={itemVariants} initial="hidden" animate="visible" className="card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-heading-sm text-text-primary">Response Time</h2>
                <span className="text-caption text-text-muted">Recent checks</span>
              </div>
              <ResponseTimeChart monitors={monitors} />
            </motion.div>
          </div>

          {/* Right Column (narrower) */}
          <div className="flex flex-col gap-6">
            {/* Recent Incidents */}
            <motion.div variants={itemVariants} initial="hidden" animate="visible" className="card">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-heading-sm text-text-primary">Recent Incidents</h2>
              </div>
              {incidents.length === 0 ? (
                <div className="py-6 text-center">
                  <CheckCircle2 size={24} className="mx-auto text-[var(--success)] mb-2" />
                  <p className="text-body-sm text-text-secondary">No incidents. All clear!</p>
                </div>
              ) : (
                <div>
                  {incidents.slice(0, 5).map((inc) => (
                    <IncidentItem key={inc._id || inc.id} incident={inc} />
                  ))}
                </div>
              )}
            </motion.div>

            {/* Current Plan */}
            <motion.div variants={itemVariants} initial="hidden" animate="visible" className="card">
              <div className="flex items-center gap-2 mb-4">
                <Shield size={16} className="text-brand" />
                <h2 className="text-heading-sm text-text-primary">Current Plan</h2>
              </div>
              <div className="flex items-center justify-between mb-3">
                <span className="badge badge-brand capitalize">
                  <Crown size={12} />
                  {user?.plan || 'Free'} Plan
                </span>
              </div>
              <div className="mb-4">
                <div className="flex items-center justify-between text-body-sm mb-1.5">
                  <span className="text-text-secondary">Monitors used</span>
                  <span className="text-text-primary font-medium">{totalMonitors} / {user?.plan === 'pro' ? '50' : '5'}</span>
                </div>
                <div className="w-full h-2 rounded-full bg-surface overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${Math.min(100, (totalMonitors / (user?.plan === 'pro' ? 50 : 5)) * 100)}%`,
                      background: 'var(--grad-brand)',
                    }}
                  />
                </div>
              </div>
              <button className="btn-primary w-full btn-sm">
                <Crown size={14} />
                Upgrade Plan
              </button>
            </motion.div>
          </div>
        </div>

        {/* ── World Map ─────────────────── */}
        <motion.div variants={itemVariants} initial="hidden" animate="visible">
          <WorldMap />
        </motion.div>

        {/* ── Response Time Chart ─────────────────── */}
        <motion.div variants={itemVariants} initial="hidden" animate="visible">
          <ResponseTimeChartGlobal />
        </motion.div>

        {/* ── Bottom: Uptime Overview ─────────────────── */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          className="card"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
            <h2 className="text-heading-sm text-text-primary">Overall Uptime</h2>
            <span
              className="text-heading-md font-mono"
              style={{ color: '#10B981' }}
            >
              {Number(overallUptime).toFixed(2)}%
            </span>
          </div>
          <div className="w-full h-4 rounded-full bg-surface overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(100, overallUptime)}%`,
                background: 'var(--grad-brand)',
              }}
            />
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-caption text-text-muted">Across {totalMonitors} monitors</span>
            <span className="text-caption text-text-muted">Last 30 days</span>
          </div>
        </motion.div>
      </div>
    </motion.main>
  )
}
