import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Bell,
  Plus,
  Trash2,
  TestTube2,
  X,
  Mail,
  Globe,
  MessageSquare,
  Send,
  CheckCircle2,
  XCircle,
  Loader2,
  RefreshCw,
  ArrowLeft,
  Hash,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import api from '../utils/api'

// ── Constants ──────────────────────────────────────────────

const CHANNEL_TYPES = [
  { value: 'email', label: 'Email', icon: Mail, color: '#3B82F6' },
  { value: 'webhook', label: 'Webhook', icon: Globe, color: '#8B5CF6' },
  { value: 'discord', label: 'Discord', icon: Hash, color: '#5865F2' },
  { value: 'slack', label: 'Slack', icon: MessageSquare, color: '#E01E5A' },
  { value: 'telegram', label: 'Telegram', icon: Send, color: '#0088CC' },
]

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

// ── Config Fields per Type ─────────────────────────────────

function ConfigFields({ type, config, onChange }) {
  const update = (key, value) => onChange({ ...config, [key]: value })

  switch (type) {
    case 'email':
      return (
        <div>
          <label className="block text-body-sm text-text-secondary mb-1.5">Email Address</label>
          <input
            type="email"
            value={config.email || ''}
            onChange={(e) => update('email', e.target.value)}
            placeholder="alerts@example.com"
            className="input w-full"
            required
          />
        </div>
      )

    case 'webhook':
      return (
        <div className="flex flex-col gap-3">
          <div>
            <label className="block text-body-sm text-text-secondary mb-1.5">Webhook URL</label>
            <input
              type="url"
              value={config.url || ''}
              onChange={(e) => update('url', e.target.value)}
              placeholder="https://your-server.com/webhook"
              className="input w-full"
              required
            />
          </div>
          <div>
            <label className="block text-body-sm text-text-secondary mb-1.5">HTTP Method</label>
            <select
              value={config.method || 'POST'}
              onChange={(e) => update('method', e.target.value)}
              className="input w-full"
            >
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
            </select>
          </div>
        </div>
      )

    case 'discord':
      return (
        <div>
          <label className="block text-body-sm text-text-secondary mb-1.5">Discord Webhook URL</label>
          <input
            type="url"
            value={config.webhookUrl || ''}
            onChange={(e) => update('webhookUrl', e.target.value)}
            placeholder="https://discord.com/api/webhooks/..."
            className="input w-full"
            required
          />
          <p className="text-caption text-text-muted mt-1">
            Server Settings → Integrations → Webhooks → New Webhook
          </p>
        </div>
      )

    case 'slack':
      return (
        <div>
          <label className="block text-body-sm text-text-secondary mb-1.5">Slack Webhook URL</label>
          <input
            type="url"
            value={config.webhookUrl || ''}
            onChange={(e) => update('webhookUrl', e.target.value)}
            placeholder="https://hooks.slack.com/services/..."
            className="input w-full"
            required
          />
          <p className="text-caption text-text-muted mt-1">
            Create an Incoming Webhook in your Slack workspace
          </p>
        </div>
      )

    case 'telegram':
      return (
        <div className="flex flex-col gap-3">
          <div>
            <label className="block text-body-sm text-text-secondary mb-1.5">Bot Token</label>
            <input
              type="text"
              value={config.botToken || ''}
              onChange={(e) => update('botToken', e.target.value)}
              placeholder="123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11"
              className="input w-full"
              required
            />
            <p className="text-caption text-text-muted mt-1">
              Get from @BotFather on Telegram
            </p>
          </div>
          <div>
            <label className="block text-body-sm text-text-secondary mb-1.5">Chat ID</label>
            <input
              type="text"
              value={config.chatId || ''}
              onChange={(e) => update('chatId', e.target.value)}
              placeholder="-1001234567890"
              className="input w-full"
              required
            />
            <p className="text-caption text-text-muted mt-1">
              Use @userinfobot to get your chat ID
            </p>
          </div>
        </div>
      )

    default:
      return null
  }
}

// ── Create Channel Modal ───────────────────────────────────

function CreateChannelModal({ onClose, onCreated }) {
  const [form, setForm] = useState({
    type: 'email',
    name: '',
    config: {},
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) {
      setError('Name is required')
      return
    }
    setSubmitting(true)
    setError(null)
    try {
      await api.post('/alerts/channels', {
        type: form.type,
        name: form.name.trim(),
        config: form.config,
      })
      onCreated()
      onClose()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create channel')
    } finally {
      setSubmitting(false)
    }
  }

  const handleTypeChange = (type) => {
    setForm({ ...form, type, config: {} })
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="card w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-heading-sm text-text-primary">Add Alert Channel</h2>
          <button onClick={onClose} className="p-1 rounded hover:bg-surface transition-colors">
            <X size={18} className="text-text-muted" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Channel Type */}
          <div>
            <label className="block text-body-sm text-text-secondary mb-2">Channel Type</label>
            <div className="grid grid-cols-5 gap-2">
              {CHANNEL_TYPES.map((ct) => {
                const Icon = ct.icon
                const isActive = form.type === ct.value
                return (
                  <button
                    key={ct.value}
                    type="button"
                    onClick={() => handleTypeChange(ct.value)}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-lg border transition-all duration-150 ${
                      isActive
                        ? 'border-brand bg-brand/5'
                        : 'border-border hover:border-text-muted'
                    }`}
                  >
                    <Icon size={20} style={{ color: isActive ? ct.color : 'var(--text-muted)' }} />
                    <span className={`text-caption ${isActive ? 'text-text-primary font-medium' : 'text-text-muted'}`}>
                      {ct.label}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-body-sm text-text-secondary mb-1.5">Channel Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder={`My ${CHANNEL_TYPES.find((t) => t.value === form.type)?.label || ''} Alert`}
              className="input w-full"
              required
            />
          </div>

          {/* Dynamic Config Fields */}
          <ConfigFields
            type={form.type}
            config={form.config}
            onChange={(config) => setForm({ ...form, config })}
          />

          {error && (
            <div className="p-3 rounded-md bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.2)] text-body-sm text-[#EF4444]">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="btn-primary flex-1">
              {submitting ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
              {submitting ? 'Creating...' : 'Create Channel'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}

// ── Channel Card ───────────────────────────────────────────

function ChannelCard({ channel, onToggle, onTest, onDelete, testing }) {
  const typeConfig = CHANNEL_TYPES.find((t) => t.value === channel.type) || CHANNEL_TYPES[0]
  const Icon = typeConfig.icon

  return (
    <motion.div variants={itemVariants} className="card flex items-center gap-4">
      {/* Type Icon */}
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ background: `${typeConfig.color}15` }}
      >
        <Icon size={20} style={{ color: typeConfig.color }} />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-body-sm font-medium text-text-primary truncate">{channel.name}</p>
        <p className="text-caption text-text-muted capitalize">{channel.type}</p>
      </div>

      {/* Active Toggle */}
      <button
        onClick={() => onToggle(channel)}
        className={`relative w-10 h-5 rounded-full transition-colors duration-200 flex-shrink-0 ${
          channel.active ? 'bg-[#10B981]' : 'bg-surface'
        }`}
        title={channel.active ? 'Active' : 'Inactive'}
      >
        <div
          className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${
            channel.active ? 'translate-x-5' : 'translate-x-0.5'
          }`}
        />
      </button>

      {/* Test Button */}
      <button
        onClick={() => onTest(channel)}
        disabled={testing === channel.id}
        className="btn-secondary btn-sm flex-shrink-0"
        title="Send test alert"
      >
        {testing === channel.id ? (
          <Loader2 size={14} className="animate-spin" />
        ) : (
          <TestTube2 size={14} />
        )}
        Test
      </button>

      {/* Delete Button */}
      <button
        onClick={() => onDelete(channel)}
        className="p-2 rounded-md hover:bg-[rgba(239,68,68,0.1)] transition-colors flex-shrink-0"
        title="Delete channel"
      >
        <Trash2 size={16} className="text-text-muted hover:text-[#EF4444]" />
      </button>
    </motion.div>
  )
}

// ── Alert Log Item ─────────────────────────────────────────

function AlertLogItem({ log }) {
  const isSuccess = log.success === 1
  const isDown = log.type === 'down'
  const typeConfig = CHANNEL_TYPES.find((t) => t.value === log.channel_type)

  return (
    <div className="flex items-start gap-3 py-3 border-b border-border last:border-0">
      <div className="flex-shrink-0 mt-0.5">
        {isSuccess ? (
          <CheckCircle2 size={16} className="text-[#10B981]" />
        ) : (
          <XCircle size={16} className="text-[#EF4444]" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className="text-caption px-2 py-0.5 rounded-full font-medium"
            style={{
              background: isDown ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)',
              color: isDown ? '#EF4444' : '#10B981',
            }}
          >
            {log.type?.toUpperCase()}
          </span>
          {log.monitor_name && (
            <span className="text-body-sm text-text-primary font-medium">{log.monitor_name}</span>
          )}
        </div>
        <p className="text-caption text-text-muted mt-1">{log.message}</p>
        <div className="flex items-center gap-2 mt-1">
          {typeConfig && (
            <span className="text-caption text-text-muted">
              via {log.channel_name || typeConfig.label}
            </span>
          )}
          <span className="text-caption text-text-muted">
            {log.sent_at ? new Date(log.sent_at + 'Z').toLocaleDateString('en-MY', {
              day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit',
            }) : ''}
          </span>
        </div>
        {log.error_message && (
          <p className="text-caption text-[#EF4444] mt-1">{log.error_message}</p>
        )}
      </div>
    </div>
  )
}

// ── Main Component ─────────────────────────────────────────

export default function AlertsPage() {
  const navigate = useNavigate()
  const [channels, setChannels] = useState([])
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showCreate, setShowCreate] = useState(false)
  const [testing, setTesting] = useState(null)
  const [testResult, setTestResult] = useState(null)

  const fetchData = useCallback(async () => {
    try {
      setError(null)
      const [channelsRes, logsRes] = await Promise.all([
        api.get('/alerts/channels'),
        api.get('/alerts/log'),
      ])
      setChannels(channelsRes.data.data || [])
      setLogs(logsRes.data.data || [])
      setLoading(false)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load alerts data')
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleToggle = async (channel) => {
    try {
      await api.put(`/alerts/channels/${channel.id}`, { active: !channel.active })
      setChannels((prev) =>
        prev.map((ch) => (ch.id === channel.id ? { ...ch, active: ch.active ? 0 : 1 } : ch))
      )
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update channel')
    }
  }

  const handleTest = async (channel) => {
    setTesting(channel.id)
    setTestResult(null)
    try {
      await api.post(`/alerts/channels/${channel.id}/test`)
      setTestResult({ id: channel.id, success: true, message: 'Test alert sent!' })
    } catch (err) {
      setTestResult({
        id: channel.id,
        success: false,
        message: err.response?.data?.message || 'Test failed',
      })
    } finally {
      setTesting(null)
      setTimeout(() => setTestResult(null), 4000)
    }
  }

  const handleDelete = async (channel) => {
    if (!confirm(`Delete alert channel "${channel.name}"?`)) return
    try {
      await api.delete(`/alerts/channels/${channel.id}`)
      setChannels((prev) => prev.filter((ch) => ch.id !== channel.id))
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete channel')
    }
  }

  // ── Loading ──
  if (loading) {
    return (
      <main className="min-h-screen pt-6 pb-6 px-4">
        <div className="max-w-container mx-auto">
          <div className="animate-pulse">
            <div className="h-8 w-48 bg-card/60 rounded mb-2" />
            <div className="h-4 w-64 bg-card/40 rounded mb-8" />
            <div className="grid gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="card h-20 animate-pulse" />
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
      className="min-h-screen pt-6 pb-6 px-4"
    >
      <div className="max-w-container mx-auto">
        {/* ── Header ──────────────────────────────────── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
        >
          <motion.div variants={itemVariants}>
            <div className="mb-1">
              <h1 className="text-heading-lg text-text-primary">Alerts</h1>
            </div>
            <p className="text-body-sm text-text-secondary">
              Get notified when your monitors go down or come back up.
            </p>
          </motion.div>
          <motion.div variants={itemVariants} className="flex items-center gap-2">
            <button onClick={fetchData} className="btn-secondary btn-sm" title="Refresh">
              <RefreshCw size={14} />
            </button>
            <button onClick={() => setShowCreate(true)} className="btn-primary btn-sm">
              <Plus size={16} />
              Add Channel
            </button>
          </motion.div>
        </motion.div>

        {/* Error banner */}
        {error && (
          <div className="mb-6 p-4 rounded-md bg-[rgba(245,78,78,0.1)] border border-[rgba(245,78,78,0.2)] text-body-sm text-[var(--error)]">
            {error}
          </div>
        )}

        {/* Test result toast */}
        <AnimatePresence>
          {testResult && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`mb-6 p-4 rounded-md border text-body-sm ${
                testResult.success
                  ? 'bg-[rgba(16,185,129,0.1)] border-[rgba(16,185,129,0.2)] text-[#10B981]'
                  : 'bg-[rgba(239,68,68,0.1)] border-[rgba(239,68,68,0.2)] text-[#EF4444]'
              }`}
            >
              {testResult.message}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Main Content ────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Channels */}
          <div className="lg:col-span-2">
            <motion.div variants={containerVariants} initial="hidden" animate="visible">
              <motion.h2 variants={itemVariants} className="text-heading-sm text-text-primary mb-4">
                Alert Channels
              </motion.h2>

              {channels.length === 0 ? (
                <motion.div variants={itemVariants} className="card text-center py-12">
                  <Bell size={40} className="mx-auto text-text-muted mb-4" />
                  <h3 className="text-heading-sm text-text-primary mb-2">No alert channels yet</h3>
                  <p className="text-body-sm text-text-secondary mb-6 max-w-sm mx-auto">
                    Add a channel to get notified when your monitors go down.
                  </p>
                  <button onClick={() => setShowCreate(true)} className="btn-primary btn-sm">
                    <Plus size={16} />
                    Add Channel
                  </button>
                </motion.div>
              ) : (
                <div className="flex flex-col gap-3">
                  {channels.map((channel) => (
                    <ChannelCard
                      key={channel.id}
                      channel={channel}
                      onToggle={handleToggle}
                      onTest={handleTest}
                      onDelete={handleDelete}
                      testing={testing}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          </div>

          {/* Right: Alert Log */}
          <div>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="card"
            >
              <motion.h2 variants={itemVariants} className="text-heading-sm text-text-primary mb-3">
                Recent Alerts
              </motion.h2>

              {logs.length === 0 ? (
                <div className="py-6 text-center">
                  <CheckCircle2 size={24} className="mx-auto text-[var(--success)] mb-2" />
                  <p className="text-body-sm text-text-secondary">No alerts sent yet.</p>
                </div>
              ) : (
                <div>
                  {logs.slice(0, 20).map((log) => (
                    <AlertLogItem key={log.id} log={log} />
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Create Channel Modal */}
      <AnimatePresence>
        {showCreate && (
          <CreateChannelModal
            onClose={() => setShowCreate(false)}
            onCreated={fetchData}
          />
        )}
      </AnimatePresence>
    </motion.main>
  )
}
