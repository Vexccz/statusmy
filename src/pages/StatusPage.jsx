import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  Activity,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Bell,
} from 'lucide-react'
import api from '../utils/api'
import { useSocket } from '../context/SocketContext'
import { usePullToRefresh } from '../hooks/usePullToRefresh'

// ── Constants ──────────────────────────────────────────────

const STATUS_CONFIG = {
  up: { label: 'Operational', color: '#10B981', icon: CheckCircle2 },
  degraded: { label: 'Degraded', color: '#F59E0B', icon: AlertTriangle },
  down: { label: 'Down', color: '#EF4444', icon: XCircle },
}

const SEVERITY_CONFIG = {
  minor: { label: 'Minor', color: '#F59E0B' },
  major: { label: 'Major', color: '#F97316' },
  critical: { label: 'Critical', color: '#EF4444' },
}

const INCIDENT_STATUS_CONFIG = {
  investigating: { label: 'Investigating', color: '#F59E0B' },
  identified: { label: 'Identified', color: '#3B82F6' },
  monitoring: { label: 'Monitoring', color: '#10B981' },
  resolved: { label: 'Resolved', color: '#6B7280' },
}

// ── Animation Variants ─────────────────────────────────────

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
}

// ── Sub-components ─────────────────────────────────────────

function OverallStatusBanner({ monitors }) {
  const downCount = monitors.filter((m) => m.status === 'down').length
  const degradedCount = monitors.filter((m) => m.status === 'degraded').length

  let message, bgClass, Icon
  if (downCount === monitors.length && monitors.length > 0) {
    message = 'Major Outage'
    bgClass = 'bg-red-500'
    Icon = XCircle
  } else if (downCount > 0 || degradedCount > 0) {
    message = 'Partial System Outage'
    bgClass = 'bg-amber-500'
    Icon = AlertTriangle
  } else {
    message = 'All Systems Operational'
    bgClass = 'bg-[#10B981]'
    Icon = CheckCircle2
  }

  return (
    <motion.div
      variants={itemVariants}
      className={`${bgClass} rounded-xl p-5 flex items-center gap-3`}
    >
      <Icon size={24} className="text-white flex-shrink-0" />
      <span className="text-white text-lg font-semibold">{message}</span>
    </motion.div>
  )
}

function UptimeBar({ monitorId }) {
  const [history, setHistory] = useState(null)

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get(`/status/history/${monitorId}`)
        setHistory(res.data.data?.history || [])
      } catch {
        setHistory([])
      }
    }
    fetchHistory()
  }, [monitorId])

  const today = new Date()
  const days = []
  for (let i = 89; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const dateStr = d.toISOString().split('T')[0]
    days.push(dateStr)
  }

  return (
    <div className="flex gap-[1.5px] items-center w-full" title="90-day uptime history">
      {days.map((date) => {
        const dayData = history?.find((h) => h.date === date)
        let colorClass = 'bg-white/10'
        if (dayData) {
          if (dayData.down_checks > 0) colorClass = 'bg-red-500'
          else if (dayData.degraded_checks > 0) colorClass = 'bg-amber-500'
          else colorClass = 'bg-[#10B981]'
        }
        return (
          <div
            key={date}
            className={`flex-1 h-7 rounded-sm min-w-[2px] ${colorClass}`}
            title={`${date}: ${dayData ? `${dayData.total_checks} checks` : 'No data'}`}
          />
        )
      })}
    </div>
  )
}

function MonitorCard({ monitor }) {
  const [expanded, setExpanded] = useState(false)
  const cfg = STATUS_CONFIG[monitor.status] || STATUS_CONFIG.up
  const StatusIcon = cfg.icon

  return (
    <motion.div
      variants={itemVariants}
      className="border border-border rounded-xl bg-card overflow-hidden"
    >
      <div
        className="flex items-center justify-between p-4 cursor-pointer active:bg-surface/60 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <StatusIcon size={18} style={{ color: cfg.color }} className="flex-shrink-0" />
          <span className="font-medium text-text-primary text-sm truncate">
            {monitor.name}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span
            className="text-xs font-semibold px-2.5 py-1 rounded-full text-white"
            style={{ backgroundColor: cfg.color }}
          >
            {cfg.label}
          </span>
          <span className="text-xs text-text-muted">
            {monitor.responseTime > 0 ? `${monitor.responseTime}ms` : '--'}
          </span>
          {expanded ? (
            <ChevronUp size={16} className="text-text-muted" />
          ) : (
            <ChevronDown size={16} className="text-text-muted" />
          )}
        </div>
      </div>

      {expanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          transition={{ duration: 0.25 }}
          className="px-4 pb-4 border-t border-border"
        >
          <div className="pt-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-text-muted">90-day uptime</span>
              <span className="text-xs font-medium text-text-primary">{monitor.uptimePercentage}%</span>
            </div>
            <UptimeBar monitorId={monitor.id} />
            <div className="flex items-center justify-between mt-2 text-[11px] text-text-muted">
              <span>90 days ago</span>
              <span>Today</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="bg-surface rounded-lg p-3">
              <p className="text-xs text-text-muted mb-1">Response Time</p>
              <p className="text-sm font-semibold text-text-primary">
                {monitor.responseTime > 0 ? `${monitor.responseTime}ms` : 'N/A'}
              </p>
            </div>
            <div className="bg-surface rounded-lg p-3">
              <p className="text-xs text-text-muted mb-1">Last Checked</p>
              <p className="text-sm font-semibold text-text-primary">
                {monitor.lastChecked
                  ? new Date(monitor.lastChecked).toLocaleTimeString('en-MY', { hour: '2-digit', minute: '2-digit' })
                  : 'N/A'}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}

function IncidentCard({ incident }) {
  const severityCfg = SEVERITY_CONFIG[incident.severity] || SEVERITY_CONFIG.minor
  const statusCfg = INCIDENT_STATUS_CONFIG[incident.status] || INCIDENT_STATUS_CONFIG.investigating

  return (
    <motion.div
      variants={itemVariants}
      className="border border-border rounded-xl bg-card p-4"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0 flex-1">
          <h4 className="font-medium text-text-primary text-sm">{incident.title}</h4>
          {incident.monitor_name && (
            <p className="text-xs text-text-muted mt-0.5">Affecting: {incident.monitor_name}</p>
          )}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span
            className="text-[11px] font-semibold px-2 py-0.5 rounded-full text-white"
            style={{ backgroundColor: severityCfg.color }}
          >
            {severityCfg.label}
          </span>
          <span
            className="text-[11px] font-semibold px-2 py-0.5 rounded-full text-white"
            style={{ backgroundColor: statusCfg.color }}
          >
            {statusCfg.label}
          </span>
        </div>
      </div>

      {incident.updates && incident.updates.length > 0 && (
        <div className="border-l-2 border-border ml-2 pl-4 mt-3">
          {incident.updates.map((update, idx) => {
            const uCfg = INCIDENT_STATUS_CONFIG[update.status] || INCIDENT_STATUS_CONFIG.investigating
            return (
              <div key={idx} className={`relative ${idx < incident.updates.length - 1 ? 'mb-3' : ''}`}>
                <div
                  className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full border-2 border-bg"
                  style={{ backgroundColor: uCfg.color }}
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold" style={{ color: uCfg.color }}>
                      {uCfg.label}
                    </span>
                    <span className="text-xs text-text-muted">
                      {new Date(update.created_at).toLocaleString('en-MY', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  <p className="text-[13px] text-text-secondary mt-0.5">{update.message}</p>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </motion.div>
  )
}

function PastIncidentGroup({ date, incidents }) {
  return (
    <motion.div variants={itemVariants}>
      <h4 className="text-[13px] font-medium text-text-muted mb-3">
        {new Date(date).toLocaleDateString('en-MY', { weekday: 'long', month: 'long', day: 'numeric' })}
      </h4>
      <div className="flex flex-col gap-2">
        {incidents.map((incident) => (
          <div key={incident.id} className="flex items-center gap-3 p-3 bg-surface rounded-lg">
            <CheckCircle2 size={16} className="text-[#10B981] flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-medium text-text-primary truncate">{incident.title}</p>
              <p className="text-xs text-text-muted">
                {incident.monitor_name && `${incident.monitor_name} · `}
                {incident.started_at && incident.resolved_at
                  ? `Duration: ${formatDuration(incident.started_at, incident.resolved_at)}`
                  : 'Resolved'}
              </p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

function SubscribeSection() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const handleSubscribe = async (e) => {
    e.preventDefault()
    if (!email) return
    setSubmitting(true)
    try {
      await api.post('/status/subscribe', { email })
      setStatus('success')
      setEmail('')
    } catch {
      setStatus('error')
    } finally {
      setSubmitting(false)
      setTimeout(() => setStatus(null), 4000)
    }
  }

  return (
    <motion.section
      variants={itemVariants}
      className="bg-surface rounded-xl p-5"
    >
      <div className="flex items-center gap-2 mb-2">
        <Bell size={18} className="text-text-muted" />
        <h3 className="text-base font-semibold text-text-primary">Subscribe to Updates</h3>
      </div>
      <p className="text-[13px] text-text-muted mb-4">
        Get notified when we create or resolve incidents.
      </p>
      <form onSubmit={handleSubscribe} className="flex gap-2">
        <input
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="flex-1 px-3.5 py-2.5 text-sm border border-border rounded-lg bg-bg text-text-primary placeholder:text-text-muted outline-none focus:border-[#10B981] transition-colors"
        />
        <button
          type="submit"
          disabled={submitting}
          className="px-5 py-2.5 text-sm font-semibold text-white bg-[#10B981] rounded-lg hover:bg-[#059669] active:bg-[#047857] disabled:opacity-70 transition-colors"
        >
          {submitting ? '...' : 'Subscribe'}
        </button>
      </form>
      {status === 'success' && (
        <p className="text-[13px] text-[#10B981] mt-2">Subscribed successfully!</p>
      )}
      {status === 'error' && (
        <p className="text-[13px] text-red-500 mt-2">Failed to subscribe. Try again.</p>
      )}
    </motion.section>
  )
}

function formatDuration(start, end) {
  const ms = new Date(end) - new Date(start)
  const minutes = Math.floor(ms / 60000)
  if (minutes < 60) return `${minutes}m`
  const hours = Math.floor(minutes / 60)
  const remainingMins = minutes % 60
  if (hours < 24) return `${hours}h ${remainingMins}m`
  const days = Math.floor(hours / 24)
  return `${days}d ${hours % 24}h`
}

// ── Main Component ─────────────────────────────────────────

export default function StatusPage() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { socket, connected } = useSocket()

  const fetchStatus = useCallback(async () => {
    try {
      const res = await api.get('/status')
      setData(res.data.data)
    } catch (err) {
      setError('Failed to load status data')
    } finally {
      setLoading(false)
    }
  }, [])

  const { PullIndicator } = usePullToRefresh(fetchStatus)

  useEffect(() => {
    fetchStatus()
    const interval = setInterval(fetchStatus, connected ? 120000 : 60000)
    return () => clearInterval(interval)
  }, [fetchStatus, connected])

  useEffect(() => {
    if (!socket) return

    const handleStatusChange = (changeData) => {
      setData((prev) => {
        if (!prev) return prev
        return {
          ...prev,
          monitors: (prev.monitors || []).map((m) =>
            m.id == changeData.monitorId
              ? { ...m, status: changeData.newStatus }
              : m
          ),
        }
      })
    }

    const handleIncidentCreated = (incidentData) => {
      setData((prev) => {
        if (!prev) return prev
        return {
          ...prev,
          activeIncidents: [incidentData, ...(prev.activeIncidents || [])],
        }
      })
    }

    const handleIncidentResolved = (incidentData) => {
      setData((prev) => {
        if (!prev) return prev
        return {
          ...prev,
          activeIncidents: (prev.activeIncidents || []).filter(
            (inc) => inc.id != incidentData.id
          ),
          pastIncidents: [
            { ...incidentData, status: 'resolved', resolved_at: new Date().toISOString() },
            ...(prev.pastIncidents || []),
          ],
        }
      })
    }

    socket.on('monitor:status-change', handleStatusChange)
    socket.on('incident:created', handleIncidentCreated)
    socket.on('incident:resolved', handleIncidentResolved)

    return () => {
      socket.off('monitor:status-change', handleStatusChange)
      socket.off('incident:created', handleIncidentCreated)
      socket.off('incident:resolved', handleIncidentResolved)
    }
  }, [socket])

  const groupedPastIncidents = {}
  if (data?.pastIncidents) {
    data.pastIncidents.forEach((incident) => {
      const date = incident.resolved_at?.split('T')[0] || incident.resolved_at?.split(' ')[0] || 'Unknown'
      if (!groupedPastIncidents[date]) groupedPastIncidents[date] = []
      groupedPastIncidents[date].push(incident)
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-[#10B981] border-t-transparent rounded-full animate-spin" />
          <span className="text-text-muted text-sm">Loading status...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-center">
          <XCircle size={40} className="text-red-500 mx-auto mb-3" />
          <p className="text-text-muted text-sm">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-bg pb-6">
      <PullIndicator />
      {/* Main Content */}
      <main className="max-w-[720px] mx-auto px-4 pt-5">
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="flex flex-col gap-6">
          {/* Overall Status Banner */}
          <OverallStatusBanner monitors={data?.monitors || []} />

          {/* Monitors */}
          <motion.section variants={itemVariants}>
            <div className="flex items-center gap-2 mb-3">
              <Activity size={18} className="text-text-muted" />
              <h2 className="text-base font-semibold text-text-primary">Services</h2>
              <span className="text-xs text-text-muted ml-auto">
                {data?.monitors?.length || 0} monitors
              </span>
            </div>
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="flex flex-col gap-2">
              {data?.monitors?.length > 0 ? (
                data.monitors.map((monitor) => (
                  <MonitorCard key={monitor.id} monitor={monitor} />
                ))
              ) : (
                <div className="text-center py-8 text-text-muted">
                  <Activity size={32} className="mx-auto mb-2 text-text-muted/40" />
                  <p className="text-sm">No monitors configured yet.</p>
                </div>
              )}
            </motion.div>
          </motion.section>

          {/* Active Incidents */}
          <motion.section variants={itemVariants}>
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle size={18} className="text-text-muted" />
              <h2 className="text-base font-semibold text-text-primary">Active Incidents</h2>
            </div>
            {data?.activeIncidents?.length > 0 ? (
              <motion.div variants={containerVariants} initial="hidden" animate="visible" className="flex flex-col gap-3">
                {data.activeIncidents.map((incident) => (
                  <IncidentCard key={incident.id} incident={incident} />
                ))}
              </motion.div>
            ) : (
              <div className="border border-border rounded-xl bg-card p-6 text-center">
                <CheckCircle2 size={28} className="mx-auto mb-2 text-[#10B981]" />
                <p className="text-sm text-text-primary font-medium">No active incidents</p>
                <p className="text-xs text-text-muted mt-1">All systems are running smoothly</p>
              </div>
            )}
          </motion.section>

          {/* Past Incidents */}
          {Object.keys(groupedPastIncidents).length > 0 && (
            <motion.section variants={itemVariants}>
              <div className="flex items-center gap-2 mb-3">
                <Clock size={18} className="text-text-muted" />
                <h2 className="text-base font-semibold text-text-primary">Past Incidents</h2>
                <span className="text-xs text-text-muted ml-auto">Last 7 days</span>
              </div>
              <motion.div variants={containerVariants} initial="hidden" animate="visible" className="flex flex-col gap-5">
                {Object.entries(groupedPastIncidents).map(([date, incidents]) => (
                  <PastIncidentGroup key={date} date={date} incidents={incidents} />
                ))}
              </motion.div>
            </motion.section>
          )}

          {/* Subscribe Section */}
          <SubscribeSection />
        </motion.div>
      </main>

      {/* Footer */}
      <div className="border-t border-border mt-8">
        <div className="max-w-[720px] mx-auto px-4 py-4 flex items-center justify-between">
          <p className="text-xs text-text-muted">
            Powered by{' '}
            <span className="text-[#10B981] font-medium">StatusMy</span>
          </p>
          <p className="text-xs text-text-muted">
            Updated: {new Date().toLocaleTimeString('en-MY', { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
      </div>
    </div>
  )
}
