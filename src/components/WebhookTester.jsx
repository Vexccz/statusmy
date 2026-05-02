import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const samplePayloads = {
  'monitor.down': {
    event: 'monitor.down',
    monitor: { id: 'mon_abc123', name: 'api.myapp.com', url: 'https://api.myapp.com/health' },
    incident: { id: 'inc_xyz789', started_at: new Date().toISOString(), status_code: 503 },
    message: 'Monitor api.myapp.com is DOWN (503 Service Unavailable)'
  },
  'monitor.up': {
    event: 'monitor.up',
    monitor: { id: 'mon_abc123', name: 'api.myapp.com', url: 'https://api.myapp.com/health' },
    incident: { id: 'inc_xyz789', resolved_at: new Date().toISOString(), duration: '4m 32s' },
    message: 'Monitor api.myapp.com is back UP'
  },
  'ssl.expiring': {
    event: 'ssl.expiring',
    monitor: { id: 'mon_abc123', name: 'myapp.com', domain: 'myapp.com' },
    ssl: { expires_at: '2026-05-15T00:00:00Z', days_remaining: 14, issuer: "Let's Encrypt" },
    message: 'SSL certificate for myapp.com expires in 14 days'
  },
}

export default function WebhookTester() {
  const [url, setUrl] = useState('')
  const [selectedEvent, setSelectedEvent] = useState('monitor.down')
  const [response, setResponse] = useState(null)
  const [loading, setLoading] = useState(false)
  const [history, setHistory] = useState([])

  const sendTest = async () => {
    if (!url) return
    setLoading(true)
    setResponse(null)

    const payload = samplePayloads[selectedEvent]
    const start = Date.now()

    try {
      const res = await fetch('/api/webhook-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, payload })
      })
      const data = await res.json()
      const duration = Date.now() - start

      const result = {
        status: data.status || res.status,
        duration: `${duration}ms`,
        success: res.ok,
        timestamp: new Date().toLocaleTimeString(),
        event: selectedEvent,
      }
      setResponse(result)
      setHistory(prev => [result, ...prev].slice(0, 10))
    } catch (err) {
      const result = {
        status: 'Error',
        duration: `${Date.now() - start}ms`,
        success: false,
        error: err.message,
        timestamp: new Date().toLocaleTimeString(),
        event: selectedEvent,
      }
      setResponse(result)
      setHistory(prev => [result, ...prev].slice(0, 10))
    }
    setLoading(false)
  }

  return (
    <div className="space-y-6">
      {/* URL Input */}
      <div className="rounded-xl border border-border bg-card/30 p-5">
        <h3 className="text-heading-sm text-text-primary mb-4">Webhook Tester</h3>
        <div className="flex gap-2 mb-4">
          <input
            type="url"
            value={url}
            onChange={e => setUrl(e.target.value)}
            placeholder="https://your-endpoint.com/webhook"
            className="flex-1 px-4 py-2.5 rounded-lg bg-surface border border-border text-text-primary text-sm focus:border-brand focus:outline-none"
          />
          <button
            onClick={sendTest}
            disabled={loading || !url}
            className="btn-primary px-6 disabled:opacity-50"
          >
            {loading ? 'Sending...' : 'Send Test'}
          </button>
        </div>

        {/* Event selector */}
        <div className="flex gap-2 mb-4">
          {Object.keys(samplePayloads).map(event => (
            <button
              key={event}
              onClick={() => setSelectedEvent(event)}
              className={`px-3 py-1.5 rounded-lg text-caption font-medium transition-all ${
                selectedEvent === event
                  ? 'bg-brand/20 text-brand-light border border-brand/30'
                  : 'bg-surface border border-border text-text-muted hover:text-text-primary'
              }`}
            >
              {event}
            </button>
          ))}
        </div>

        {/* Payload preview */}
        <div className="rounded-lg bg-[#0d0d14] border border-border p-4 overflow-x-auto">
          <pre className="text-xs font-mono text-text-secondary">
            {JSON.stringify(samplePayloads[selectedEvent], null, 2)}
          </pre>
        </div>
      </div>

      {/* Response */}
      <AnimatePresence>
        {response && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`rounded-xl border p-5 ${
              response.success
                ? 'border-[#30CF79]/30 bg-[#30CF79]/5'
                : 'border-[#F54E4E]/30 bg-[#F54E4E]/5'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${response.success ? 'bg-[#30CF79]' : 'bg-[#F54E4E]'}`} />
              <span className="text-sm font-medium text-text-primary">
                {response.success ? 'Delivered' : 'Failed'} - {response.status}
              </span>
              <span className="text-caption text-text-muted ml-auto">{response.duration}</span>
            </div>
            {response.error && (
              <p className="text-caption text-[#F54E4E] mt-2">{response.error}</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* History */}
      {history.length > 0 && (
        <div className="rounded-xl border border-border bg-card/30 p-5">
          <h4 className="text-body-sm font-semibold text-text-primary mb-3">Recent Tests</h4>
          <div className="space-y-2">
            {history.map((h, i) => (
              <div key={i} className="flex items-center gap-3 py-2 border-b border-border last:border-0">
                <div className={`w-2 h-2 rounded-full ${h.success ? 'bg-[#30CF79]' : 'bg-[#F54E4E]'}`} />
                <span className="text-caption text-text-muted">{h.timestamp}</span>
                <span className="text-caption font-mono text-text-secondary">{h.event}</span>
                <span className="text-caption text-text-muted ml-auto">{h.duration}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
