import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  BarChart3,
  Download,
  RefreshCw,
  Loader2,
  Clock,
  TrendingUp,
  AlertTriangle,
  Activity,
} from 'lucide-react'
import api from '../utils/api'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } },
}

export default function ReportsPage() {
  const navigate = useNavigate()
  const [report, setReport] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [period, setPeriod] = useState('30')

  const fetchReport = useCallback(async () => {
    try {
      setError(null)
      setLoading(true)
      const res = await api.get(`/reports/sla?period=${period}d`)
      setReport(res.data.data || [])
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load report')
    } finally {
      setLoading(false)
    }
  }, [period])

  useEffect(() => {
    fetchReport()
  }, [fetchReport])

  function exportCSV() {
    if (report.length === 0) return

    const headers = ['Monitor', 'URL', 'Uptime %', 'Downtime (min)', 'Incidents', 'Avg Response (ms)', 'Total Checks']
    const rows = report.map((r) => [
      r.monitor_name,
      r.monitor_url,
      r.uptime_percentage,
      r.total_downtime_minutes,
      r.incidents_count,
      r.avg_response_time,
      r.total_checks,
    ])

    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `sla-report-${period}d-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <main className="pt-6 pb-6 px-4">
        <div className="max-w-container mx-auto flex items-center justify-center py-20">
          <Loader2 size={24} className="animate-spin text-brand" />
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
      <div className="max-w-container mx-auto">
        {/* Header */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
        >
          <motion.div variants={itemVariants}>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-heading-lg text-text-primary">SLA Reports</h1>
            </div>
            <p className="text-body-sm text-text-secondary">
              Uptime and performance reports for your monitors.
            </p>
          </motion.div>
          <motion.div variants={itemVariants} className="flex items-center gap-2">
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="h-[36px] px-3 rounded-sm border border-border bg-surface text-text-primary text-body-sm outline-none"
            >
              <option value="7">Last 7 days</option>
              <option value="14">Last 14 days</option>
              <option value="30">Last 30 days</option>
              <option value="60">Last 60 days</option>
              <option value="90">Last 90 days</option>
            </select>
            <button onClick={fetchReport} className="btn-secondary btn-sm" title="Refresh">
              <RefreshCw size={14} />
            </button>
            <button onClick={exportCSV} className="btn-primary btn-sm" disabled={report.length === 0}>
              <Download size={14} />
              Export CSV
            </button>
          </motion.div>
        </motion.div>

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 rounded-md bg-[rgba(245,78,78,0.1)] border border-[rgba(245,78,78,0.2)] text-body-sm text-[var(--error)]">
            {error}
          </div>
        )}

        {/* Summary Cards */}
        {report.length > 0 && (
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <motion.div variants={itemVariants} className="card flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <TrendingUp size={16} className="text-[#10B981]" />
                <span className="text-body-sm text-text-secondary">Avg Uptime</span>
              </div>
              <p className="text-heading-md font-mono text-[#10B981]">
                {(report.reduce((sum, r) => sum + r.uptime_percentage, 0) / report.length).toFixed(2)}%
              </p>
            </motion.div>
            <motion.div variants={itemVariants} className="card flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-text-muted" />
                <span className="text-body-sm text-text-secondary">Total Downtime</span>
              </div>
              <p className="text-heading-md text-text-primary">
                {report.reduce((sum, r) => sum + r.total_downtime_minutes, 0)} min
              </p>
            </motion.div>
            <motion.div variants={itemVariants} className="card flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <AlertTriangle size={16} className="text-[#F59E0B]" />
                <span className="text-body-sm text-text-secondary">Total Incidents</span>
              </div>
              <p className="text-heading-md text-text-primary">
                {report.reduce((sum, r) => sum + r.incidents_count, 0)}
              </p>
            </motion.div>
            <motion.div variants={itemVariants} className="card flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Activity size={16} className="text-text-muted" />
                <span className="text-body-sm text-text-secondary">Avg Response</span>
              </div>
              <p className="text-heading-md text-text-primary">
                {Math.round(report.reduce((sum, r) => sum + r.avg_response_time, 0) / report.length)}ms
              </p>
            </motion.div>
          </motion.div>
        )}

        {/* Table */}
        {report.length === 0 ? (
          <div className="card text-center py-12">
            <BarChart3 size={40} className="mx-auto text-text-muted mb-4" />
            <h3 className="text-heading-sm text-text-primary mb-2">No data available</h3>
            <p className="text-body-sm text-text-secondary">Add monitors to see SLA reports.</p>
          </div>
        ) : (
          <motion.div variants={itemVariants} className="card !p-0 overflow-hidden">
            <div className="px-5 py-4 border-b border-border flex items-center gap-2">
              <BarChart3 size={18} className="text-text-muted" />
              <h2 className="text-heading-sm text-text-primary">Per-Monitor SLA</h2>
              <span className="text-caption text-text-muted ml-auto">{period} days</span>
            </div>

            {/* Table header */}
            <div className="hidden lg:grid grid-cols-7 gap-4 px-5 py-2 text-caption text-text-muted border-b border-border">
              <span className="col-span-2">Monitor</span>
              <span>Uptime %</span>
              <span>Downtime</span>
              <span>Incidents</span>
              <span>Avg Response</span>
              <span>Checks</span>
            </div>

            <div className="divide-y divide-border/50">
              {report.map((row) => (
                <div
                  key={row.monitor_id}
                  className="grid grid-cols-2 lg:grid-cols-7 gap-2 lg:gap-4 px-5 py-3 hover:bg-surface/30 transition-colors"
                >
                  <div className="col-span-2 min-w-0">
                    <p className="text-body-sm font-medium text-text-primary truncate">{row.monitor_name}</p>
                    <p className="text-caption text-text-muted truncate">{row.monitor_url}</p>
                  </div>
                  <div className="text-body-sm">
                    <span
                      className="font-mono font-medium"
                      style={{ color: row.uptime_percentage >= 99.9 ? '#10B981' : row.uptime_percentage >= 99 ? '#F59E0B' : '#EF4444' }}
                    >
                      {row.uptime_percentage}%
                    </span>
                  </div>
                  <div className="text-body-sm text-text-secondary">{row.total_downtime_minutes} min</div>
                  <div className="text-body-sm text-text-secondary">{row.incidents_count}</div>
                  <div className="text-body-sm text-text-secondary">{row.avg_response_time}ms</div>
                  <div className="text-body-sm text-text-secondary">{row.total_checks}</div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </motion.main>
  )
}
