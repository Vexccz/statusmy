import { useState, useEffect, useCallback } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  ExternalLink,
  Pencil,
  Trash2,
  Pause,
  Play,
  Clock,
  Activity,
  CheckCircle2,
  XCircle,
  Loader2,
  AlertTriangle,
  Globe,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Copy,
  Search,
  Zap,
  Heart,
  Wrench,
  Plus,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import api from '../utils/api'
import { useSocket } from '../context/SocketContext'
import { showToast } from '../components/Toast'

// ── Status helpers ──────────────────────────────────────

const statusColor = {
  up: '#10B981',
  down: '#EF4444',
  degraded: '#F59E0B',
  paused: '#6b6b7b',
}

const statusLabel = {
  up: 'Operational',
  down: 'Down',
  degraded: 'Degraded',
  paused: 'Paused',
}

// ── Response Time SVG Chart ─────────────────────────────

function ResponseTimeChart({ checks }) {
  if (!checks || checks.length < 2) {
    return (
      <div className="flex items-center justify-center h-[200px] text-text-muted text-body-sm">
        Not enough data to display chart
      </div>
    )
  }

  const data = [...checks].reverse().slice(-50)
  const width = 700
  const height = 220
  const padding = { top: 20, right: 20, bottom: 35, left: 50 }
  const chartW = width - padding.left - padding.right
  const chartH = height - padding.top - padding.bottom

  const values = data.map((c) => c.response_time_ms || c.response_time || c.responseTime || 0)
  const maxVal = Math.max(...values, 1)
  const minVal = Math.min(...values)
  const range = maxVal - minVal || 1

  const points = data.map((c, i) => ({
    x: padding.left + (i / (data.length - 1)) * chartW,
    y: padding.top + chartH - ((values[i] - minVal) / range) * chartH,
    value: values[i],
    time: c.checked_at || c.createdAt,
  }))

  // Bezier curve
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

  // Y-axis labels
  const yLabels = [minVal, Math.round((minVal + maxVal) / 2), maxVal]

  // X-axis labels (show ~5 time labels)
  const xIndices = [0, Math.floor(data.length * 0.25), Math.floor(data.length * 0.5), Math.floor(data.length * 0.75), data.length - 1]

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
      <defs>
        <linearGradient id="detailChartGrad" x1="0" y1="0" x2="0" y2="1">
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

      {xIndices.map((idx) => {
        if (idx >= points.length) return null
        const p = points[idx]
        const d = p.time ? new Date(p.time) : null
        const label = d ? `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}` : ''
        return (
          <text
            key={idx}
            x={p.x}
            y={height - 8}
            textAnchor="middle"
            fill="var(--text-muted)"
            fontSize="10"
            fontFamily="var(--font-mono)"
          >
            {label}
          </text>
        )
      })}

      <path d={areaD} fill="url(#detailChartGrad)" />
      <path d={pathD} fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" />
      {points.filter((_, i) => i % Math.max(1, Math.floor(points.length / 20)) === 0).map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="3" fill="#10B981" opacity="0.6" />
      ))}
    </svg>
  )
}

// ── SSL Info Card ───────────────────────────────────────

function SSLInfoCard({ monitorId, monitorUrl }) {
  const [ssl, setSSL] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!monitorUrl || !monitorUrl.startsWith('https://')) {
      setLoading(false)
      return
    }

    api.get(`/monitors/${monitorId}/ssl`)
      .then((res) => {
        setSSL(res.data.data?.current || null)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.response?.data?.message || 'Failed to load SSL info')
        setLoading(false)
      })
  }, [monitorId, monitorUrl])

  if (!monitorUrl || !monitorUrl.startsWith('https://')) return null
  if (loading) {
    return (
      <div className="card mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Shield size={18} className="text-text-muted" />
          <h2 className="text-heading-sm text-text-primary">SSL Certificate</h2>
        </div>
        <div className="animate-pulse h-[80px] bg-card/40 rounded" />
      </div>
    )
  }
  if (error || !ssl) return null

  const isExpiringSoon = ssl.days_remaining !== null && ssl.days_remaining < 14
  const isValid = ssl.valid === 1

  return (
    <div className="card mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {isValid && !isExpiringSoon ? (
            <ShieldCheck size={18} className="text-[#10B981]" />
          ) : (
            <ShieldAlert size={18} className={isExpiringSoon ? 'text-[#F59E0B]' : 'text-[#EF4444]'} />
          )}
          <h2 className="text-heading-sm text-text-primary">SSL Certificate</h2>
        </div>
        <span
          className="badge"
          style={{
            background: isValid && !isExpiringSoon ? 'rgba(16,185,129,0.1)' : isExpiringSoon ? 'rgba(245,158,11,0.1)' : 'rgba(239,68,68,0.1)',
            color: isValid && !isExpiringSoon ? '#10B981' : isExpiringSoon ? '#F59E0B' : '#EF4444',
          }}
        >
          {isValid && !isExpiringSoon ? 'Valid' : isExpiringSoon ? 'Expiring Soon' : 'Invalid'}
        </span>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <span className="text-caption text-text-muted block mb-1">Issuer</span>
          <span className="text-body-sm text-text-primary">{ssl.issuer || 'N/A'}</span>
        </div>
        <div>
          <span className="text-caption text-text-muted block mb-1">Subject</span>
          <span className="text-body-sm text-text-primary">{ssl.subject || 'N/A'}</span>
        </div>
        <div>
          <span className="text-caption text-text-muted block mb-1">Expires</span>
          <span className="text-body-sm text-text-primary">
            {ssl.valid_to ? new Date(ssl.valid_to).toLocaleDateString('en-MY', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A'}
          </span>
        </div>
        <div>
          <span className="text-caption text-text-muted block mb-1">Days Remaining</span>
          <span
            className="text-body-sm font-medium"
            style={{ color: isExpiringSoon ? '#F59E0B' : '#10B981' }}
          >
            {ssl.days_remaining !== null ? `${ssl.days_remaining} days` : 'N/A'}
          </span>
        </div>
      </div>

      {ssl.protocol && (
        <div className="mt-3 pt-3 border-t border-border">
          <span className="text-caption text-text-muted">Protocol: </span>
          <span className="text-caption text-text-secondary">{ssl.protocol}</span>
        </div>
      )}

      {ssl.error_message && (
        <div className="mt-3 p-3 rounded-md bg-[rgba(245,78,78,0.08)] border border-[rgba(245,78,78,0.2)]">
          <span className="text-caption text-[var(--error)]">{ssl.error_message}</span>
        </div>
      )}
    </div>
  )
}

// ── Heartbeat Info Card ─────────────────────────────────

function HeartbeatInfoCard({ monitor }) {
  const [copied, setCopied] = useState(false)

  if (monitor.type !== 'heartbeat' || !monitor.heartbeat_token) return null

  const baseUrl = window.location.origin.replace(/:\d+$/, ':5000')
  const heartbeatUrl = `${baseUrl}/api/heartbeat/${monitor.heartbeat_token}`

  function handleCopy() {
    navigator.clipboard.writeText(heartbeatUrl).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="card mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Heart size={18} className="text-[#EC4899]" />
        <h2 className="text-heading-sm text-text-primary">Heartbeat Endpoint</h2>
      </div>

      <p className="text-body-sm text-text-secondary mb-3">
        Add this URL to your cron job or scheduled task. If no ping is received within the expected interval, the monitor will be marked as down.
      </p>

      <div className="flex items-center gap-2">
        <code className="flex-1 px-3 py-2 rounded-sm bg-[var(--bg)] border border-border text-body-sm text-text-primary font-mono break-all">
          {heartbeatUrl}
        </code>
        <button
          onClick={handleCopy}
          className="btn-secondary btn-sm flex-shrink-0"
          title="Copy URL"
        >
          <Copy size={14} />
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>

      <div className="mt-3 p-3 rounded-md bg-[rgba(16,185,129,0.06)] border border-[rgba(16,185,129,0.15)]">
        <p className="text-caption text-text-muted mb-1">Example cron job (every minute):</p>
        <code className="text-caption text-text-secondary font-mono">
          * * * * * curl -s {heartbeatUrl} &gt; /dev/null
        </code>
      </div>

      {monitor.last_heartbeat_at && (
        <div className="mt-3 pt-3 border-t border-border">
          <span className="text-caption text-text-muted">Last heartbeat: </span>
          <span className="text-caption text-text-secondary">
            {new Date(monitor.last_heartbeat_at).toLocaleString('en-MY')}
          </span>
        </div>
      )}
    </div>
  )
}

// ── Monitor Config Info ─────────────────────────────────

function MonitorConfigCard({ monitor }) {
  const hasKeyword = monitor.keyword
  const hasThreshold = monitor.response_time_threshold_ms

  if (!hasKeyword && !hasThreshold) return null

  return (
    <div className="card mb-8">
      <h2 className="text-heading-sm text-text-primary mb-4">Monitor Configuration</h2>
      <div className="flex flex-col gap-3">
        {hasKeyword && (
          <div className="flex items-start gap-3 p-3 rounded-md bg-surface/50">
            <Search size={16} className="text-text-muted mt-0.5 flex-shrink-0" />
            <div>
              <span className="text-body-sm text-text-primary font-medium">Keyword Monitoring</span>
              <p className="text-caption text-text-secondary mt-0.5">
                Response body {monitor.keyword_type === 'not_contains' ? 'must NOT contain' : 'must contain'}:{' '}
                <code className="px-1.5 py-0.5 rounded bg-[var(--bg)] border border-border text-caption font-mono">
                  {monitor.keyword}
                </code>
              </p>
            </div>
          </div>
        )}
        {hasThreshold && (
          <div className="flex items-start gap-3 p-3 rounded-md bg-surface/50">
            <Zap size={16} className="text-text-muted mt-0.5 flex-shrink-0" />
            <div>
              <span className="text-body-sm text-text-primary font-medium">Response Time Threshold</span>
              <p className="text-caption text-text-secondary mt-0.5">
                Alert if response time exceeds{' '}
                <code className="px-1.5 py-0.5 rounded bg-[var(--bg)] border border-border text-caption font-mono">
                  {monitor.response_time_threshold_ms}ms
                </code>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Edit Form Modal ─────────────────────────────────────

function EditForm({ monitor, onSave, onCancel, saving }) {
  const [form, setForm] = useState({
    name: monitor.name || '',
    url: monitor.url || '',
    type: monitor.type || 'HTTP',
    interval_seconds: monitor.interval_seconds || 60,
    method: monitor.method || 'GET',
    expected_status: monitor.expected_status || 200,
    timeout_ms: monitor.timeout_ms || 10000,
    keyword: monitor.keyword || '',
    keywordType: monitor.keyword_type || 'contains',
    responseTimeThresholdMs: monitor.response_time_threshold_ms || '',
  })

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function handleSave() {
    const payload = { ...form }
    if (!payload.keyword) payload.keyword = null
    if (!payload.responseTimeThresholdMs) {
      payload.responseTimeThresholdMs = null
    } else {
      payload.responseTimeThresholdMs = Number(payload.responseTimeThresholdMs)
    }
    onSave(payload)
  }

  const isHTTP = form.type === 'HTTP' || form.type === 'http'

  return (
    <div className="card flex flex-col gap-4 mb-6">
      <h3 className="text-heading-sm text-text-primary">Edit Monitor</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-body-sm text-text-secondary mb-1">Name</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className="w-full h-[44px] px-3 rounded-sm border border-border bg-surface text-text-primary text-body-sm focus:border-brand focus:ring-1 focus:ring-brand outline-none transition-colors"
          />
        </div>
        <div>
          <label className="block text-body-sm text-text-secondary mb-1">URL</label>
          <input
            type="text"
            value={form.url}
            onChange={(e) => handleChange('url', e.target.value)}
            className="w-full h-[44px] px-3 rounded-sm border border-border bg-surface text-text-primary text-body-sm focus:border-brand focus:ring-1 focus:ring-brand outline-none transition-colors"
          />
        </div>
        <div>
          <label className="block text-body-sm text-text-secondary mb-1">Check Type</label>
          <select
            value={form.type}
            onChange={(e) => handleChange('type', e.target.value)}
            className="w-full h-[44px] px-3 rounded-sm border border-border bg-surface text-text-primary text-body-sm outline-none"
          >
            <option value="HTTP">HTTP</option>
            <option value="TCP">TCP</option>
            <option value="Ping">Ping</option>
            <option value="DNS">DNS</option>
            <option value="heartbeat">Heartbeat</option>
          </select>
        </div>
        <div>
          <label className="block text-body-sm text-text-secondary mb-1">Interval</label>
          <select
            value={form.interval_seconds}
            onChange={(e) => handleChange('interval_seconds', Number(e.target.value))}
            className="w-full h-[44px] px-3 rounded-sm border border-border bg-surface text-text-primary text-body-sm outline-none"
          >
            <option value={30}>Every 30s</option>
            <option value={60}>Every 1 min</option>
            <option value={300}>Every 5 min</option>
          </select>
        </div>
      </div>

      {/* Keyword fields */}
      {isHTTP && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-body-sm text-text-secondary mb-1">Keyword (optional)</label>
            <input
              type="text"
              value={form.keyword}
              onChange={(e) => handleChange('keyword', e.target.value)}
              placeholder="e.g. OK, healthy"
              className="w-full h-[44px] px-3 rounded-sm border border-border bg-surface text-text-primary text-body-sm focus:border-brand focus:ring-1 focus:ring-brand outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-body-sm text-text-secondary mb-1">Keyword Match</label>
            <select
              value={form.keywordType}
              onChange={(e) => handleChange('keywordType', e.target.value)}
              className="w-full h-[44px] px-3 rounded-sm border border-border bg-surface text-text-primary text-body-sm outline-none"
            >
              <option value="contains">Contains</option>
              <option value="not_contains">Does Not Contain</option>
            </select>
          </div>
        </div>
      )}

      {/* Response time threshold */}
      <div>
        <label className="block text-body-sm text-text-secondary mb-1">Response Time Threshold (ms, optional)</label>
        <input
          type="number"
          value={form.responseTimeThresholdMs}
          onChange={(e) => handleChange('responseTimeThresholdMs', e.target.value)}
          placeholder="e.g. 2000"
          className="w-full h-[44px] px-3 rounded-sm border border-border bg-surface text-text-primary text-body-sm focus:border-brand focus:ring-1 focus:ring-brand outline-none transition-colors"
        />
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="btn-primary btn-sm disabled:opacity-50"
        >
          {saving ? <Loader2 size={14} className="animate-spin" /> : null}
          Save Changes
        </button>
        <button onClick={onCancel} className="btn-secondary btn-sm">Cancel</button>
      </div>
    </div>
  )
}

// ── Maintenance Windows Section ────────────────────────

function MaintenanceSection({ monitorId }) {
  const [windows, setWindows] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [form, setForm] = useState({ startAt: '', endAt: '', reason: '' })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    api.get(`/monitors/${monitorId}/maintenance`)
      .then((res) => setWindows(res.data.data || []))
      .catch(() => {})
  }, [monitorId])

  async function handleCreate(e) {
    e.preventDefault()
    setSubmitting(true)
    try {
      await api.post(`/monitors/${monitorId}/maintenance`, form)
      const res = await api.get(`/monitors/${monitorId}/maintenance`)
      setWindows(res.data.data || [])
      setShowForm(false)
      setForm({ startAt: '', endAt: '', reason: '' })
    } catch (err) {
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete(windowId) {
    try {
      await api.delete(`/monitors/${monitorId}/maintenance/${windowId}`)
      setWindows((prev) => prev.filter((w) => w.id !== windowId))
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="card mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Wrench size={18} className="text-text-muted" />
          <h2 className="text-heading-sm text-text-primary">Maintenance Windows</h2>
          <span className="text-caption text-text-muted">({windows.length})</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setExpanded(!expanded)} className="btn-secondary btn-sm">
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
          <button onClick={() => { setShowForm(!showForm); setExpanded(true) }} className="btn-primary btn-sm">
            <Plus size={14} /> Schedule
          </button>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="mb-4 p-4 rounded-md bg-surface/50 border border-border">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-caption text-text-muted mb-1">Start</label>
              <input
                type="datetime-local"
                value={form.startAt}
                onChange={(e) => setForm({ ...form, startAt: e.target.value })}
                className="w-full h-[36px] px-3 rounded-sm border border-border bg-surface text-text-primary text-body-sm outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-caption text-text-muted mb-1">End</label>
              <input
                type="datetime-local"
                value={form.endAt}
                onChange={(e) => setForm({ ...form, endAt: e.target.value })}
                className="w-full h-[36px] px-3 rounded-sm border border-border bg-surface text-text-primary text-body-sm outline-none"
                required
              />
            </div>
          </div>
          <div className="mb-3">
            <label className="block text-caption text-text-muted mb-1">Reason (optional)</label>
            <input
              type="text"
              value={form.reason}
              onChange={(e) => setForm({ ...form, reason: e.target.value })}
              placeholder="Scheduled maintenance"
              className="w-full h-[36px] px-3 rounded-sm border border-border bg-surface text-text-primary text-body-sm outline-none"
            />
          </div>
          <div className="flex gap-2">
            <button type="submit" disabled={submitting} className="btn-primary btn-sm">
              {submitting ? <Loader2 size={14} className="animate-spin" /> : null}
              Create
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="btn-secondary btn-sm">Cancel</button>
          </div>
        </form>
      )}

      {expanded && windows.length > 0 && (
        <div className="space-y-2">
          {windows.map((w) => (
            <div key={w.id} className="flex items-center justify-between p-3 rounded-md bg-surface/30 border border-border">
              <div>
                <p className="text-body-sm text-text-primary">
                  {new Date(w.start_at).toLocaleString('en-MY')} - {new Date(w.end_at).toLocaleString('en-MY')}
                </p>
                {w.reason && <p className="text-caption text-text-muted">{w.reason}</p>}
              </div>
              <button onClick={() => handleDelete(w.id)} className="p-1 rounded hover:bg-[rgba(239,68,68,0.1)]">
                <Trash2 size={14} className="text-text-muted hover:text-[#EF4444]" />
              </button>
            </div>
          ))}
        </div>
      )}

      {expanded && windows.length === 0 && (
        <p className="text-body-sm text-text-muted">No maintenance windows scheduled.</p>
      )}
    </div>
  )
}

// ── Main Component ──────────────────────────────────────

export default function MonitorDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const prefersReducedMotion = useReducedMotion()

  const [monitor, setMonitor] = useState(null)
  const [stats, setStats] = useState(null)
  const [checks, setChecks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [toggling, setToggling] = useState(false)
  const { socket, connected } = useSocket()

  const fetchAll = useCallback(async () => {
    try {
      setError(null)
      const [monRes, statsRes, checksRes] = await Promise.all([
        api.get(`/monitors`),
        api.get(`/monitors/${id}/stats`),
        api.get(`/monitors/${id}/checks`),
      ])

      // Find this monitor from the list
      const monitorsList = monRes.data.data || monRes.data
      const found = Array.isArray(monitorsList)
        ? monitorsList.find((m) => String(m._id || m.id) === String(id))
        : null

      setMonitor(found || null)
      setStats(statsRes.data.data || statsRes.data)
      setChecks(checksRes.data.data || checksRes.data || [])
      setLoading(false)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load monitor')
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchAll()
    const interval = setInterval(fetchAll, connected ? 60000 : 30000)
    return () => clearInterval(interval)
  }, [fetchAll, connected])

  // Socket event listeners for real-time updates
  useEffect(() => {
    if (!socket) return

    const handleMonitorCheck = (data) => {
      if (String(data.monitorId) !== String(id)) return

      // Append new check to history
      setChecks((prev) => [
        {
          status: data.status,
          response_time_ms: data.responseTimeMs,
          response_time: data.responseTimeMs,
          status_code: data.statusCode,
          error_message: data.errorMessage,
          checked_at: data.checkedAt,
        },
        ...prev,
      ])
    }

    const handleStatusChange = (data) => {
      if (String(data.monitorId) !== String(id)) return
      if (data.newStatus === 'down') {
        showToast({ type: 'down', title: `${data.monitorName} is DOWN` })
      } else if (data.newStatus === 'up' && data.previousStatus === 'down') {
        showToast({ type: 'up', title: `${data.monitorName} is back UP` })
      }
    }

    socket.on('monitor:check', handleMonitorCheck)
    socket.on('monitor:status-change', handleStatusChange)

    return () => {
      socket.off('monitor:check', handleMonitorCheck)
      socket.off('monitor:status-change', handleStatusChange)
    }
  }, [socket, id])

  async function handleSave(form) {
    setSaving(true)
    try {
      await api.put(`/monitors/${id}`, form)
      setEditing(false)
      fetchAll()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update monitor')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    setDeleting(true)
    try {
      await api.delete(`/monitors/${id}`)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete monitor')
      setDeleting(false)
    }
  }

  async function handleTogglePause() {
    if (!monitor) return
    setToggling(true)
    try {
      const newStatus = monitor.is_paused ? false : true
      await api.put(`/monitors/${id}`, { is_paused: newStatus })
      fetchAll()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to toggle monitor')
    } finally {
      setToggling(false)
    }
  }

  function getMonitorStatus() {
    if (!monitor) return 'down'
    if (monitor.is_paused) return 'paused'
    if (monitor.latestCheck) {
      return monitor.latestCheck.status || 'up'
    }
    if (monitor.latest_check) {
      return monitor.latest_check.status === 'up' ? 'up' : monitor.latest_check.status || 'down'
    }
    return 'up'
  }

  function formatTime(ts) {
    if (!ts) return '--'
    const d = new Date(ts)
    return d.toLocaleString('en-MY', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
  }

  // ── Loading state ──
  if (loading) {
    return (
      <main className="pt-6 pb-6 px-4">
        <div className="max-w-container mx-auto">
          <div className="animate-pulse">
            <div className="h-4 w-32 bg-card/60 rounded mb-8" />
            <div className="h-8 w-64 bg-card/60 rounded mb-2" />
            <div className="h-4 w-48 bg-card/40 rounded mb-8" />
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="card animate-pulse">
                  <div className="h-4 w-20 bg-card/60 rounded mb-3" />
                  <div className="h-8 w-24 bg-card/60 rounded" />
                </div>
              ))}
            </div>
            <div className="card animate-pulse h-[240px]" />
          </div>
        </div>
      </main>
    )
  }

  // ── Error state ──
  if (error && !monitor) {
    return (
      <main className="pt-6 pb-6 px-4">
        <div className="max-w-container mx-auto text-center py-16">
          <AlertTriangle size={48} className="mx-auto text-[var(--error)] mb-4" />
          <h2 className="text-heading-md text-text-primary mb-2">Monitor Not Found</h2>
          <p className="text-body-sm text-text-secondary mb-6">{error}</p>
          <button onClick={() => navigate('/dashboard')} className="btn-primary btn-sm">
            <ArrowLeft size={16} />
            Back to Dashboard
          </button>
        </div>
      </main>
    )
  }

  const status = getMonitorStatus()
  const uptimePercent = stats?.uptimePercentage ?? stats?.uptime_percentage ?? stats?.uptime ?? 0
  const avgResponse = stats?.avgResponseTime ?? stats?.avg_response_time ?? 0
  const totalChecks = stats?.totalChecks ?? stats?.total_checks ?? checks.length

  return (
    <motion.main
      id="main-content"
      initial={prefersReducedMotion ? {} : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={prefersReducedMotion ? {} : { opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="pt-6 pb-6 px-4"
    >
      <div className="max-w-container mx-auto">
        {/* Back */}
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-body-sm text-text-secondary hover:text-text-primary transition-colors mb-6"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </button>

        {/* Error banner */}
        {error && (
          <div className="mb-6 p-4 rounded-md bg-[rgba(245,78,78,0.1)] border border-[rgba(245,78,78,0.2)] text-body-sm text-[var(--error)]">
            {error}
          </div>
        )}

        {/* Edit form */}
        {editing && monitor && (
          <EditForm
            monitor={monitor}
            onSave={handleSave}
            onCancel={() => setEditing(false)}
            saving={saving}
          />
        )}

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-heading-lg text-text-primary">{monitor?.name}</h1>
              <span
                className="badge"
                style={{
                  background: `${statusColor[status]}15`,
                  color: statusColor[status],
                }}
              >
                {statusLabel[status]}
              </span>
              {monitor?.type === 'heartbeat' && (
                <span className="badge" style={{ background: 'rgba(236,72,153,0.1)', color: '#EC4899' }}>
                  Heartbeat
                </span>
              )}
            </div>
            <a
              href={monitor?.type !== 'heartbeat' ? monitor?.url : undefined}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-body-sm text-text-muted hover:text-brand transition-colors"
            >
              {monitor?.type === 'heartbeat' ? 'Heartbeat Monitor' : monitor?.url}
              {monitor?.type !== 'heartbeat' && <ExternalLink size={12} />}
            </a>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleTogglePause}
              disabled={toggling}
              className="btn-secondary btn-sm disabled:opacity-50"
            >
              {toggling ? (
                <Loader2 size={14} className="animate-spin" />
              ) : monitor?.is_paused ? (
                <Play size={14} />
              ) : (
                <Pause size={14} />
              )}
              {monitor?.is_paused ? 'Resume' : 'Pause'}
            </button>
            <button onClick={() => setEditing(true)} className="btn-secondary btn-sm">
              <Pencil size={14} />
              Edit
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="btn-secondary btn-sm text-[var(--error)] border-[rgba(245,78,78,0.3)] hover:bg-[rgba(245,78,78,0.1)]"
            >
              <Trash2 size={14} />
              Delete
            </button>
          </div>
        </div>

        {/* Delete confirmation */}
        {showDeleteConfirm && (
          <div className="mb-6 p-4 rounded-md border border-[rgba(245,78,78,0.3)] bg-[rgba(245,78,78,0.05)]">
            <p className="text-body-sm text-text-primary mb-3">
              Are you sure you want to delete <strong>{monitor?.name}</strong>? This action cannot be undone.
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="btn-primary btn-sm !bg-[var(--error)] !shadow-none disabled:opacity-50"
              >
                {deleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                Yes, Delete
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="btn-secondary btn-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Heartbeat Info Card */}
        {monitor && <HeartbeatInfoCard monitor={monitor} />}

        {/* Monitor Config Card (keyword + threshold) */}
        {monitor && <MonitorConfigCard monitor={monitor} />}

        {/* SSL Info Card */}
        {monitor && <SSLInfoCard monitorId={monitor.id} monitorUrl={monitor.url} />}

        {/* Stats cards */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <div className="card flex flex-col gap-2">
            <span className="text-body-sm text-text-secondary">Uptime</span>
            <p className="text-heading-md font-mono" style={{ color: '#10B981' }}>
              {Number(uptimePercent).toFixed(2)}%
            </p>
          </div>
          <div className="card flex flex-col gap-2">
            <span className="text-body-sm text-text-secondary">Avg Response</span>
            <p className="text-heading-md text-text-primary">
              {Math.round(avgResponse)}ms
            </p>
          </div>
          <div className="card flex flex-col gap-2">
            <span className="text-body-sm text-text-secondary">Total Checks</span>
            <p className="text-heading-md text-text-primary">{totalChecks}</p>
          </div>
        </div>

        {/* Response Time Chart (not for heartbeat) */}
        {monitor?.type !== 'heartbeat' && (
          <div className="card mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-heading-sm text-text-primary">Response Time</h2>
              <span className="text-caption text-text-muted">Last {checks.length} checks</span>
            </div>
            <ResponseTimeChart checks={checks} />
          </div>
        )}

        {/* Check History Table */}
        <div className="card !p-0 overflow-hidden">
          <div className="px-5 py-4 border-b border-border">
            <h2 className="text-heading-sm text-text-primary">Check History</h2>
          </div>

          {checks.length === 0 ? (
            <div className="py-12 text-center">
              <Clock size={32} className="mx-auto text-text-muted mb-3" />
              <p className="text-body-sm text-text-secondary">No checks recorded yet</p>
              <p className="text-caption text-text-muted mt-1">Checks will appear here once the monitor runs.</p>
            </div>
          ) : (
            <>
              {/* Table header */}
              <div className="hidden sm:grid grid-cols-4 gap-4 px-5 py-2 text-caption text-text-muted border-b border-border">
                <span>Status</span>
                <span>{monitor?.type === 'heartbeat' ? 'Info' : 'Response Time'}</span>
                <span>{monitor?.type === 'heartbeat' ? 'Error' : 'Status Code'}</span>
                <span>Timestamp</span>
              </div>

              <div className="divide-y divide-border/50 max-h-[400px] overflow-y-auto">
                {checks.slice(0, 50).map((check, i) => {
                  const isUp = check.status === 'up'
                  const isDegraded = check.status === 'degraded'
                  return (
                    <div
                      key={check._id || check.id || i}
                      className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 px-5 py-3 hover:bg-surface/30 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        {isUp ? (
                          <CheckCircle2 size={14} className="text-[var(--success)] flex-shrink-0" />
                        ) : isDegraded ? (
                          <AlertTriangle size={14} className="text-[#F59E0B] flex-shrink-0" />
                        ) : (
                          <XCircle size={14} className="text-[var(--error)] flex-shrink-0" />
                        )}
                        <span
                          className="text-body-sm font-medium"
                          style={{ color: isUp ? 'var(--success)' : isDegraded ? '#F59E0B' : 'var(--error)' }}
                        >
                          {isUp ? 'Up' : isDegraded ? 'Degraded' : 'Down'}
                        </span>
                      </div>
                      <div className="text-body-sm text-text-secondary">
                        {monitor?.type === 'heartbeat'
                          ? (check.error_message ? check.error_message.substring(0, 40) : 'Heartbeat OK')
                          : ((check.response_time_ms || check.response_time || check.responseTime || 0) > 0
                            ? `${check.response_time_ms || check.response_time || check.responseTime}ms`
                            : '--')
                        }
                      </div>
                      <div className="text-body-sm text-text-secondary">
                        {monitor?.type === 'heartbeat'
                          ? '--'
                          : (check.status_code || check.statusCode || '--')
                        }
                      </div>
                      <div className="text-caption text-text-muted">
                        {formatTime(check.checked_at || check.createdAt)}
                      </div>
                    </div>
                  )
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </motion.main>
  )
}
