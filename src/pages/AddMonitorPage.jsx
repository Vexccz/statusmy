import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Plus, Globe, Loader2, Search, Clock, Zap, Shield } from 'lucide-react'
import api from '../utils/api'

const CHECK_TYPES = [
  { value: 'HTTP', label: 'HTTP' },
  { value: 'TCP', label: 'TCP' },
  { value: 'Ping', label: 'Ping' },
  { value: 'DNS', label: 'DNS' },
  { value: 'heartbeat', label: 'Heartbeat / Cron' },
]

const INTERVALS = [
  { value: 30, label: 'Every 30 seconds' },
  { value: 60, label: 'Every 1 minute' },
  { value: 300, label: 'Every 5 minutes' },
]

const HTTP_METHODS = [
  { value: 'GET', label: 'GET' },
  { value: 'POST', label: 'POST' },
  { value: 'HEAD', label: 'HEAD' },
]

const KEYWORD_TYPES = [
  { value: 'contains', label: 'Contains' },
  { value: 'not_contains', label: 'Does Not Contain' },
]

export default function AddMonitorPage() {
  const navigate = useNavigate()
  const prefersReducedMotion = useReducedMotion()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const [form, setForm] = useState({
    name: '',
    url: '',
    type: 'HTTP',
    interval_seconds: 60,
    method: 'GET',
    expected_status: 200,
    timeout_ms: 10000,
    keyword: '',
    keywordType: 'contains',
    responseTimeThresholdMs: '',
  })

  const [errors, setErrors] = useState({})

  function validate() {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Name is required'
    if (form.type !== 'heartbeat') {
      if (!form.url.trim()) {
        errs.url = 'URL is required'
      } else {
        try {
          new URL(form.url)
        } catch {
          errs.url = 'Enter a valid URL (e.g. https://example.com)'
        }
      }
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return

    setSubmitting(true)
    setError(null)
    try {
      // Map frontend field names to backend expected names
      const payload = {
        name: form.name,
        url: form.url,
        type: form.type.toLowerCase(),
        intervalSeconds: Number(form.interval_seconds),
        method: form.method,
        expectedStatus: Number(form.expected_status),
        timeoutMs: Number(form.timeout_ms),
      }
      // Clean up empty optional fields
      if (form.keyword && form.keyword.trim()) {
        payload.keyword = form.keyword
        payload.keywordType = form.keywordType
      }
      if (form.responseTimeThresholdMs) {
        payload.responseTimeThresholdMs = Number(form.responseTimeThresholdMs)
      }
      // For heartbeat type, set a placeholder URL if empty
      if (payload.type === 'heartbeat' && !payload.url) {
        payload.url = 'https://heartbeat.local'
      }
      await api.post('/monitors', payload)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create monitor')
    } finally {
      setSubmitting(false)
    }
  }

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const isHTTP = form.type === 'HTTP'
  const isHeartbeat = form.type === 'heartbeat'

  return (
    <motion.main
      id="main-content"
      initial={prefersReducedMotion ? {} : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={prefersReducedMotion ? {} : { opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="pt-6 pb-6 px-4"
    >
      <div className="max-w-[640px] mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-heading-lg text-text-primary">Add Monitor</h1>
          <p className="text-body-sm text-text-secondary mt-1">
            Set up a new endpoint to monitor its uptime and performance.
          </p>
        </div>

        {/* Error banner */}
        {error && (
          <div className="mb-6 p-4 rounded-md bg-[rgba(245,78,78,0.1)] border border-[rgba(245,78,78,0.2)] text-body-sm text-[var(--error)]">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="card flex flex-col gap-5">
          {/* Name */}
          <div>
            <label className="block text-body-sm text-text-secondary mb-1.5">Monitor Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="e.g. API Server"
              className="w-full h-[44px] px-3 rounded-sm border border-border bg-surface text-text-primary text-body-sm focus:border-brand focus:ring-1 focus:ring-brand outline-none transition-colors"
            />
            {errors.name && <p className="text-caption text-[var(--error)] mt-1">{errors.name}</p>}
          </div>

          {/* URL (hidden for heartbeat) */}
          {!isHeartbeat && (
            <div>
              <label className="block text-body-sm text-text-secondary mb-1.5">URL</label>
              <div className="relative">
                <Globe size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  type="text"
                  value={form.url}
                  onChange={(e) => handleChange('url', e.target.value)}
                  placeholder="https://example.com"
                  className="w-full h-[44px] pl-9 pr-3 rounded-sm border border-border bg-surface text-text-primary text-body-sm focus:border-brand focus:ring-1 focus:ring-brand outline-none transition-colors"
                />
              </div>
              {errors.url && <p className="text-caption text-[var(--error)] mt-1">{errors.url}</p>}
            </div>
          )}

          {/* Heartbeat info */}
          {isHeartbeat && (
            <div className="p-4 rounded-md bg-[rgba(16,185,129,0.08)] border border-[rgba(16,185,129,0.2)]">
              <div className="flex items-center gap-2 mb-2">
                <Clock size={16} className="text-[#10B981]" />
                <span className="text-body-sm font-medium text-text-primary">Heartbeat Monitor</span>
              </div>
              <p className="text-caption text-text-secondary">
                After creating this monitor, you'll get a unique URL. Add it to your cron job or scheduled task.
                If no ping is received within the expected interval, the monitor will be marked as down.
              </p>
            </div>
          )}

          {/* Type + Interval row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-body-sm text-text-secondary mb-1.5">Check Type</label>
              <select
                value={form.type}
                onChange={(e) => handleChange('type', e.target.value)}
                className="w-full h-[44px] px-3 rounded-sm border border-border bg-surface text-text-primary text-body-sm focus:border-brand focus:ring-1 focus:ring-brand outline-none transition-colors"
              >
                {CHECK_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-body-sm text-text-secondary mb-1.5">
                {isHeartbeat ? 'Expected Ping Interval' : 'Check Interval'}
              </label>
              <select
                value={form.interval_seconds}
                onChange={(e) => handleChange('interval_seconds', Number(e.target.value))}
                className="w-full h-[44px] px-3 rounded-sm border border-border bg-surface text-text-primary text-body-sm focus:border-brand focus:ring-1 focus:ring-brand outline-none transition-colors"
              >
                {INTERVALS.map((i) => (
                  <option key={i.value} value={i.value}>{i.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* HTTP Method + Expected Status */}
          {isHTTP && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-body-sm text-text-secondary mb-1.5">HTTP Method</label>
                <select
                  value={form.method}
                  onChange={(e) => handleChange('method', e.target.value)}
                  className="w-full h-[44px] px-3 rounded-sm border border-border bg-surface text-text-primary text-body-sm focus:border-brand focus:ring-1 focus:ring-brand outline-none transition-colors"
                >
                  {HTTP_METHODS.map((m) => (
                    <option key={m.value} value={m.value}>{m.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-body-sm text-text-secondary mb-1.5">Expected Status</label>
                <input
                  type="number"
                  value={form.expected_status}
                  onChange={(e) => handleChange('expected_status', Number(e.target.value))}
                  className="w-full h-[44px] px-3 rounded-sm border border-border bg-surface text-text-primary text-body-sm focus:border-brand focus:ring-1 focus:ring-brand outline-none transition-colors"
                />
              </div>
            </div>
          )}

          {/* Timeout (not for heartbeat) */}
          {!isHeartbeat && (
            <div>
              <label className="block text-body-sm text-text-secondary mb-1.5">Timeout (ms)</label>
              <input
                type="number"
                value={form.timeout_ms}
                onChange={(e) => handleChange('timeout_ms', Number(e.target.value))}
                className="w-full h-[44px] px-3 rounded-sm border border-border bg-surface text-text-primary text-body-sm focus:border-brand focus:ring-1 focus:ring-brand outline-none transition-colors"
              />
              <p className="text-caption text-text-muted mt-1">
                How long to wait before marking the check as failed.
              </p>
            </div>
          )}

          {/* Keyword Monitoring (HTTP only) */}
          {isHTTP && (
            <div className="border-t border-border pt-5">
              <div className="flex items-center gap-2 mb-3">
                <Search size={16} className="text-text-muted" />
                <span className="text-body-sm font-medium text-text-primary">Keyword Monitoring</span>
                <span className="text-caption text-text-muted">(optional)</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-body-sm text-text-secondary mb-1.5">Keyword</label>
                  <input
                    type="text"
                    value={form.keyword}
                    onChange={(e) => handleChange('keyword', e.target.value)}
                    placeholder="e.g. OK, healthy, success"
                    className="w-full h-[44px] px-3 rounded-sm border border-border bg-surface text-text-primary text-body-sm focus:border-brand focus:ring-1 focus:ring-brand outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-body-sm text-text-secondary mb-1.5">Match Type</label>
                  <select
                    value={form.keywordType}
                    onChange={(e) => handleChange('keywordType', e.target.value)}
                    className="w-full h-[44px] px-3 rounded-sm border border-border bg-surface text-text-primary text-body-sm focus:border-brand focus:ring-1 focus:ring-brand outline-none transition-colors"
                  >
                    {KEYWORD_TYPES.map((k) => (
                      <option key={k.value} value={k.value}>{k.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <p className="text-caption text-text-muted mt-2">
                Check if the response body contains (or doesn't contain) a specific keyword.
              </p>
            </div>
          )}

          {/* Response Time Threshold (not for heartbeat) */}
          {!isHeartbeat && (
            <div className="border-t border-border pt-5">
              <div className="flex items-center gap-2 mb-3">
                <Zap size={16} className="text-text-muted" />
                <span className="text-body-sm font-medium text-text-primary">Response Time Threshold</span>
                <span className="text-caption text-text-muted">(optional)</span>
              </div>
              <div>
                <label className="block text-body-sm text-text-secondary mb-1.5">Threshold (ms)</label>
                <input
                  type="number"
                  value={form.responseTimeThresholdMs}
                  onChange={(e) => handleChange('responseTimeThresholdMs', e.target.value)}
                  placeholder="e.g. 2000"
                  className="w-full h-[44px] px-3 rounded-sm border border-border bg-surface text-text-primary text-body-sm focus:border-brand focus:ring-1 focus:ring-brand outline-none transition-colors"
                />
                <p className="text-caption text-text-muted mt-1">
                  If response time exceeds this threshold, the monitor will be marked as degraded and an alert will be sent.
                </p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary btn-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus size={16} />
                  Create Monitor
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="btn-secondary btn-sm"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </motion.main>
  )
}
