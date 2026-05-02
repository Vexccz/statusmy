import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import {
  Plus,
  AlertTriangle,
  CheckCircle2,
  Clock,
  X,
  Send,
  Filter,
  RefreshCw,
  Activity,
} from 'lucide-react'
import api from '../utils/api'
import { usePullToRefresh } from '../hooks/usePullToRefresh'

// ── Constants ──────────────────────────────────────────────

const SEVERITY_CONFIG = {
  minor: { label: 'Minor', color: '#F59E0B', bg: 'rgba(245,158,11,0.1)' },
  major: { label: 'Major', color: '#F97316', bg: 'rgba(249,115,22,0.1)' },
  critical: { label: 'Critical', color: '#EF4444', bg: 'rgba(239,68,68,0.1)' },
}

const STATUS_CONFIG = {
  investigating: { label: 'Investigating', color: '#F59E0B', bg: 'rgba(245,158,11,0.1)' },
  identified: { label: 'Identified', color: '#3B82F6', bg: 'rgba(59,130,246,0.1)' },
  monitoring: { label: 'Monitoring', color: '#10B981', bg: 'rgba(16,185,129,0.1)' },
  resolved: { label: 'Resolved', color: '#6B7280', bg: 'rgba(107,114,128,0.1)' },
}

// ── Animation Variants ─────────────────────────────────────

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } },
}

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.15 } },
}

// ── Create Incident Modal ──────────────────────────────────

function CreateIncidentModal({ monitors, onClose, onCreated }) {
  const [form, setForm] = useState({
    monitorId: '',
    title: '',
    description: '',
    severity: 'minor',
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title.trim()) {
      setError('Title is required')
      return
    }
    setSubmitting(true)
    setError(null)
    try {
      await api.post('/incidents', {
        title: form.title.trim(),
        description: form.description.trim() || undefined,
        monitorId: form.monitorId ? parseInt(form.monitorId) : undefined,
        severity: form.severity,
      })
      onCreated()
      onClose()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create incident')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="relative w-full max-w-lg bg-surface rounded-xl border border-border shadow-2xl overflow-hidden"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h3 className="text-heading-sm text-text-primary">Create Incident</h3>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-card/30 text-text-muted">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.2)] text-sm text-[#EF4444]">
              {error}
            </div>
          )}

          {/* Monitor Select */}
          <div>
            <label className="block text-body-sm text-text-secondary mb-1.5">
              Affected Monitor <span className="text-text-muted">(optional)</span>
            </label>
            <select
              value={form.monitorId}
              onChange={(e) => setForm({ ...form, monitorId: e.target.value })}
              className="w-full h-11 px-3 rounded-lg border border-border bg-bg text-text-primary text-sm focus:border-brand focus:ring-1 focus:ring-brand outline-none"
            >
              <option value="">None (general incident)</option>
              {monitors.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          {/* Title */}
          <div>
            <label className="block text-body-sm text-text-secondary mb-1.5">Title *</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. API response times elevated"
              className="w-full h-11 px-3 rounded-lg border border-border bg-bg text-text-primary text-sm focus:border-brand focus:ring-1 focus:ring-brand outline-none placeholder:text-text-muted"
              maxLength={200}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-body-sm text-text-secondary mb-1.5">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Describe what's happening..."
              rows={3}
              className="w-full px-3 py-2.5 rounded-lg border border-border bg-bg text-text-primary text-sm focus:border-brand focus:ring-1 focus:ring-brand outline-none placeholder:text-text-muted resize-none"
              maxLength={2000}
            />
          </div>

          {/* Severity */}
          <div>
            <label className="block text-body-sm text-text-secondary mb-1.5">Severity</label>
            <div className="flex gap-2">
              {Object.entries(SEVERITY_CONFIG).map(([key, cfg]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setForm({ ...form, severity: key })}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium border transition-all ${
                    form.severity === key
                      ? 'border-transparent'
                      : 'border-border hover:border-text-muted'
                  }`}
                  style={
                    form.severity === key
                      ? { backgroundColor: cfg.bg, color: cfg.color, borderColor: cfg.color }
                      : {}
                  }
                >
                  {cfg.label}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-lg text-sm font-medium text-text-secondary hover:bg-card/30 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary btn-sm"
            >
              {submitting ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <AlertTriangle size={14} />
                  Create Incident
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

// ── Update Incident Modal ──────────────────────────────────

function UpdateIncidentModal({ incident, onClose, onUpdated }) {
  const [status, setStatus] = useState('investigating')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!message.trim()) {
      setError('Message is required')
      return
    }
    setSubmitting(true)
    setError(null)
    try {
      await api.put(`/incidents/${incident.id}`, {
        status,
        message: message.trim(),
      })
      onUpdated()
      onClose()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update incident')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="relative w-full max-w-lg bg-surface rounded-xl border border-border shadow-2xl overflow-hidden"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h3 className="text-heading-sm text-text-primary">Update Incident</h3>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-card/30 text-text-muted">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.2)] text-sm text-[#EF4444]">
              {error}
            </div>
          )}

          <div className="p-3 rounded-lg bg-card/30 border border-border">
            <p className="text-sm font-medium text-text-primary">{incident.title}</p>
          </div>

          {/* Status */}
          <div>
            <label className="block text-body-sm text-text-secondary mb-1.5">New Status</label>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(STATUS_CONFIG)
                .filter(([key]) => key !== 'resolved')
                .map(([key, cfg]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setStatus(key)}
                    className={`py-2 px-3 rounded-lg text-sm font-medium border transition-all ${
                      status === key
                        ? 'border-transparent'
                        : 'border-border hover:border-text-muted'
                    }`}
                    style={
                      status === key
                        ? { backgroundColor: cfg.bg, color: cfg.color, borderColor: cfg.color }
                        : {}
                    }
                  >
                    {cfg.label}
                  </button>
                ))}
            </div>
          </div>

          {/* Message */}
          <div>
            <label className="block text-body-sm text-text-secondary mb-1.5">Update Message *</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe the current situation..."
              rows={3}
              className="w-full px-3 py-2.5 rounded-lg border border-border bg-bg text-text-primary text-sm focus:border-brand focus:ring-1 focus:ring-brand outline-none placeholder:text-text-muted resize-none"
              maxLength={2000}
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-lg text-sm font-medium text-text-secondary hover:bg-card/30 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary btn-sm"
            >
              {submitting ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Send size={14} />
                  Post Update
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

// ── Incident Card ──────────────────────────────────────────

function IncidentCard({ incident, onUpdate, onResolve }) {
  const severityCfg = SEVERITY_CONFIG[incident.severity] || SEVERITY_CONFIG.minor
  const statusCfg = STATUS_CONFIG[incident.status] || STATUS_CONFIG.investigating
  const isResolved = incident.status === 'resolved'

  return (
    <motion.div
      variants={itemVariants}
      className={`card !p-0 overflow-hidden ${isResolved ? 'opacity-75' : ''}`}
    >
      <div className="p-4 sm:p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="min-w-0 flex-1">
            <h3 className="text-heading-sm text-text-primary">{incident.title}</h3>
            {incident.monitor_name && (
              <p className="text-caption text-text-muted mt-0.5">
                Monitor: {incident.monitor_name}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span
              className="text-caption font-medium px-2 py-0.5 rounded-full"
              style={{ backgroundColor: severityCfg.bg, color: severityCfg.color }}
            >
              {severityCfg.label}
            </span>
            <span
              className="text-caption font-medium px-2 py-0.5 rounded-full"
              style={{ backgroundColor: statusCfg.bg, color: statusCfg.color }}
            >
              {statusCfg.label}
            </span>
          </div>
        </div>

        {incident.description && (
          <p className="text-body-sm text-text-secondary mb-3">{incident.description}</p>
        )}

        {/* Timeline */}
        {incident.updates && incident.updates.length > 0 && (
          <div className="border-l-2 border-border ml-2 pl-4 space-y-3 mb-4">
            {incident.updates.map((update, idx) => {
              const uCfg = STATUS_CONFIG[update.status] || STATUS_CONFIG.investigating
              return (
                <div key={idx} className="relative">
                  <div
                    className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full border-2"
                    style={{ backgroundColor: uCfg.color, borderColor: 'var(--surface)' }}
                  />
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-caption font-medium" style={{ color: uCfg.color }}>
                        {uCfg.label}
                      </span>
                      <span className="text-caption text-text-muted">
                        {new Date(update.created_at).toLocaleString('en-MY', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <p className="text-body-sm text-text-secondary mt-0.5">{update.message}</p>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Actions */}
        {!isResolved && (
          <div className="flex items-center gap-2 pt-2 border-t border-border">
            <button
              onClick={() => onUpdate(incident)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-caption font-medium text-text-secondary hover:bg-card/50 hover:text-text-primary transition-colors"
            >
              <Send size={12} />
              Update
            </button>
            <button
              onClick={() => onResolve(incident)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-caption font-medium text-[#10B981] hover:bg-[rgba(16,185,129,0.1)] transition-colors"
            >
              <CheckCircle2 size={12} />
              Resolve
            </button>
            <span className="text-caption text-text-muted ml-auto">
              Created {new Date(incident.created_at).toLocaleDateString('en-MY', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        )}

        {isResolved && incident.resolved_at && (
          <div className="pt-2 border-t border-border">
            <span className="text-caption text-text-muted">
              Resolved {new Date(incident.resolved_at).toLocaleDateString('en-MY', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  )
}

// ── Main Component ─────────────────────────────────────────

export default function IncidentsPage() {
  const { user } = useAuth()
  const [incidents, setIncidents] = useState([])
  const [monitors, setMonitors] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all') // all | active | resolved
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [updateTarget, setUpdateTarget] = useState(null)

  const { PullIndicator } = usePullToRefresh(async () => {
    await fetchData()
  })

  const fetchData = useCallback(async () => {
    try {
      const [incRes, monRes] = await Promise.all([
        api.get('/incidents'),
        api.get('/monitors'),
      ])

      const incidentsList = incRes.data.data || []
      // Fetch full details for each incident (with updates)
      const enriched = await Promise.all(
        incidentsList.map(async (inc) => {
          try {
            const detailRes = await api.get(`/incidents/${inc.id}`)
            return detailRes.data.data || inc
          } catch {
            return inc
          }
        })
      )

      // Sort: active first, then by created_at desc
      enriched.sort((a, b) => {
        if (a.status === 'resolved' && b.status !== 'resolved') return 1
        if (a.status !== 'resolved' && b.status === 'resolved') return -1
        return new Date(b.created_at) - new Date(a.created_at)
      })

      setIncidents(enriched)
      setMonitors(monRes.data.data || [])
      setLoading(false)
    } catch {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleResolve = async (incident) => {
    try {
      await api.put(`/incidents/${incident.id}/resolve`)
      fetchData()
    } catch (err) {
      console.error('Failed to resolve:', err)
    }
  }

  const filteredIncidents = incidents.filter((inc) => {
    if (filter === 'active') return inc.status !== 'resolved'
    if (filter === 'resolved') return inc.status === 'resolved'
    return true
  })

  const activeCount = incidents.filter((i) => i.status !== 'resolved').length
  const resolvedCount = incidents.filter((i) => i.status === 'resolved').length

  if (loading) {
    return (
      <main className="pt-6 pb-6 px-4">
        <div className="max-w-container mx-auto">
          <div className="animate-pulse">
            <div className="h-8 w-48 bg-card/60 rounded mb-2" />
            <div className="h-4 w-64 bg-card/40 rounded mb-8" />
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="card h-32 animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <motion.main
      id="main-content"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="pt-6 pb-6 px-4"
    >
      <PullIndicator />
      <div className="max-w-container mx-auto">
        {/* Header */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6"
        >
          <motion.div variants={itemVariants}>
            <h1 className="text-heading-lg text-text-primary">Incidents</h1>
            <p className="text-body-sm text-text-secondary mt-1">
              Manage and track service incidents
            </p>
          </motion.div>
          <motion.div variants={itemVariants} className="flex items-center gap-2">
            <button onClick={fetchData} className="btn-secondary btn-sm" title="Refresh">
              <RefreshCw size={14} />
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn-primary btn-sm"
            >
              <Plus size={16} />
              Create Incident
            </button>
          </motion.div>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div variants={itemVariants} initial="hidden" animate="visible" className="flex items-center gap-1 mb-6 p-1 bg-card/30 rounded-lg w-fit">
          {[
            { key: 'all', label: `All (${incidents.length})` },
            { key: 'active', label: `Active (${activeCount})` },
            { key: 'resolved', label: `Resolved (${resolvedCount})` },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                filter === tab.key
                  ? 'bg-surface text-text-primary shadow-sm'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </motion.div>

        {/* Incidents List */}
        {filteredIncidents.length === 0 ? (
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            className="card text-center py-12"
          >
            <Activity size={40} className="mx-auto text-text-muted mb-4" />
            <h3 className="text-heading-sm text-text-primary mb-2">
              {filter === 'all' ? 'No incidents yet' : `No ${filter} incidents`}
            </h3>
            <p className="text-body-sm text-text-secondary mb-6">
              {filter === 'all'
                ? 'Create an incident when something goes wrong with your services.'
                : 'No incidents match this filter.'}
            </p>
            {filter === 'all' && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="btn-primary btn-sm"
              >
                <Plus size={16} />
                Create Incident
              </button>
            )}
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-4"
          >
            {filteredIncidents.map((incident) => (
              <IncidentCard
                key={incident.id}
                incident={incident}
                onUpdate={setUpdateTarget}
                onResolve={handleResolve}
              />
            ))}
          </motion.div>
        )}
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showCreateModal && (
          <CreateIncidentModal
            monitors={monitors}
            onClose={() => setShowCreateModal(false)}
            onCreated={fetchData}
          />
        )}
        {updateTarget && (
          <UpdateIncidentModal
            incident={updateTarget}
            onClose={() => setUpdateTarget(null)}
            onUpdated={fetchData}
          />
        )}
      </AnimatePresence>
    </motion.main>
  )
}
