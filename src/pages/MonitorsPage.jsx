import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Plus, Search, ArrowUpRight, Circle, Clock, Activity } from 'lucide-react'
import api from '../utils/api'
import { usePullToRefresh } from '../hooks/usePullToRefresh'

export default function MonitorsPage() {
  const [monitors, setMonitors] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const navigate = useNavigate()

  const { PullIndicator } = usePullToRefresh(async () => {
    await fetchMonitors()
  })

  useEffect(() => {
    fetchMonitors()
  }, [])

  const fetchMonitors = async () => {
    try {
      const res = await api.get('/monitors')
      setMonitors(res.data.data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const filtered = monitors.filter(m => {
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase()) || m.url.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'all' || m.latest_status === filter || (filter === 'pending' && !m.latest_status)
    return matchSearch && matchFilter
  })

  const statusDot = (status) => {
    if (status === 'up') return 'bg-emerald-500'
    if (status === 'down') return 'bg-red-500'
    if (status === 'degraded') return 'bg-yellow-500'
    return 'bg-gray-500'
  }

  const statusLabel = (status) => {
    if (status === 'up') return 'Operational'
    if (status === 'down') return 'Down'
    if (status === 'degraded') return 'Degraded'
    return 'Pending'
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[1,2,3].map(i => (
          <div key={i} className="h-20 rounded-lg bg-card animate-pulse border border-border" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PullIndicator />
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Monitors</h1>
          <p className="text-sm text-text-secondary mt-1">{monitors.length} monitor{monitors.length !== 1 ? 's' : ''} configured</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Search monitors..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full h-10 pl-9 pr-4 rounded-lg border border-border bg-card text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-emerald-500"
          />
        </div>
        <div className="flex gap-2">
          {['all','up','down','degraded'].map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`px-3 py-2 rounded-lg text-xs font-medium capitalize transition-colors ${filter === f ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-card border border-border text-text-secondary hover:text-text-primary'}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-card rounded-xl border border-border">
          <Activity size={40} className="mx-auto text-text-muted mb-4" />
          <h3 className="text-lg font-semibold text-text-primary mb-2">
            {monitors.length === 0 ? 'No monitors yet' : 'No matches found'}
          </h3>
          <p className="text-sm text-text-secondary mb-6">
            {monitors.length === 0 ? 'Add your first monitor to start tracking uptime.' : 'Try a different search or filter.'}
          </p>
          {monitors.length === 0 && (
            <Link to="/dashboard/add-monitor" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white bg-emerald-500 hover:bg-emerald-600">
              <Plus size={16} /> Add Monitor
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((m, i) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => navigate(`/dashboard/monitors/${m.id}`)}
              className="flex items-center gap-4 p-4 bg-card rounded-xl border border-border hover:border-emerald-500/30 cursor-pointer transition-all group"
            >
              <div className="relative">
                <div className={`w-3 h-3 rounded-full ${statusDot(m.latest_status)}`} />
                {m.latest_status === 'up' && <div className="absolute inset-0 w-3 h-3 rounded-full bg-emerald-500 animate-ping opacity-30" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-text-primary truncate">{m.name}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${m.latest_status === 'up' ? 'bg-emerald-500/10 text-emerald-400' : m.latest_status === 'down' ? 'bg-red-500/10 text-red-400' : m.latest_status === 'degraded' ? 'bg-yellow-500/10 text-yellow-400' : 'bg-gray-500/10 text-gray-400'}`}>
                    {statusLabel(m.latest_status)}
                  </span>
                </div>
                <p className="text-xs text-text-muted truncate mt-0.5">{m.url}</p>
              </div>
              <div className="hidden sm:flex items-center gap-6 text-sm text-text-secondary">
                <div className="flex items-center gap-1.5">
                  <Clock size={14} />
                  <span>{m.latest_response_time ? m.latest_response_time + 'ms' : '-'}</span>
                </div>
                <div className="text-xs uppercase tracking-wider text-text-muted">{m.type}</div>
              </div>
              <ArrowUpRight size={16} className="text-text-muted group-hover:text-emerald-400 transition-colors" />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
