import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import api from '../utils/api'
import { 
  Users, Activity, Server, AlertTriangle, DollarSign, 
  Shield, Settings, BarChart3, Globe, Bell, Database,
  TrendingUp, Clock, CheckCircle2, XCircle, Search,
  ChevronDown, MoreHorizontal, Ban, Crown, Mail
} from 'lucide-react'





function StatCard({ icon: Icon, label, value, trend, color = 'text-brand-light' }) {
  return (
    <div className="rounded-xl border border-border bg-card/30 p-4">
      <div className="flex items-center justify-between mb-2">
        <Icon size={16} className="text-text-muted" />
        {trend && (
          <span className={`text-[10px] font-medium ${trend > 0 ? 'text-[#30CF79]' : 'text-[#F54E4E]'}`}>
            {trend > 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      <div className={`text-xl font-bold ${color}`}>{value}</div>
      <div className="text-caption text-text-muted mt-0.5">{label}</div>
    </div>
  )
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('overview')
  const [searchQuery, setSearchQuery] = useState('')
  const [stats, setStats] = useState(null)
  const [users, setUsers] = useState([])
  const [serverInfo, setServerInfo] = useState(null)
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchData()
  }, [activeTab])

  async function fetchData() {
    try {
      setLoading(true)
      setError(null)
      if (activeTab === 'overview' || !stats) {
        const res = await api.get('/admin/stats')
        setStats(res.data.data)
      }
      if (activeTab === 'users') {
        const res = await api.get('/admin/users' + (searchQuery ? `?search=${searchQuery}` : ''))
        setUsers(res.data.data || [])
      }
      if (activeTab === 'servers') {
        const res = await api.get('/admin/servers')
        setServerInfo(res.data.data)
      }
      if (activeTab === 'alerts') {
        const res = await api.get('/admin/alerts')
        setAlerts(res.data.data || [])
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load admin data. Make sure you have admin access.')
    } finally {
      setLoading(false)
    }
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'servers', label: 'Servers', icon: Server },
    { id: 'billing', label: 'Billing', icon: DollarSign },
    { id: 'alerts', label: 'System Alerts', icon: AlertTriangle },
    { id: 'settings', label: 'Settings', icon: Settings },
  ]

  return (
    <motion.main
      id="main-content"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-[128px] pb-[96px]"
    >
      <div className="max-w-container mx-auto px-[16px] sm:px-[24px] lg:px-[32px]">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="heading-lg text-text-primary">Admin Dashboard</h1>
            <p className="text-body-sm text-text-muted">Manage users, servers, and platform settings</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#30CF79]/10 border border-[#30CF79]/20">
              <span className="w-2 h-2 rounded-full bg-[#30CF79] animate-pulse" />
              <span className="text-caption text-[#30CF79] font-medium">All Systems Operational</span>
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-8 overflow-x-auto pb-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-body-sm font-medium whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-brand/20 text-brand-light'
                  : 'text-text-muted hover:text-text-primary hover:bg-card/30'
              }`}
            >
              <tab.icon size={14} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div className="p-4 rounded-xl border border-[#F54E4E]/30 bg-[#F54E4E]/5 mb-6">
            <p className="text-body-sm text-[#F54E4E]">{error}</p>
          </div>
        )}

        {/* Overview Tab */}
        {activeTab === 'overview' && stats && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard icon={Users} label="Total Users" value={stats.totalUsers} trend={12} />
              <StatCard icon={Activity} label="Active Monitors" value={stats.activeMonitors} trend={8} />
              <StatCard icon={Globe} label="Total Checks (30d)" value={stats.totalChecks30d?.toLocaleString()} trend={15} />
              <StatCard icon={Clock} label="Avg Response" value={`${stats.avgResponseTime}ms`} />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard icon={Users} label="New This Month" value={stats.newUsersThisMonth} />
              <StatCard icon={AlertTriangle} label="Active Incidents" value={stats.activeIncidents} color="text-[#F7A501]" />
              <StatCard icon={Crown} label="Pro Users" value={stats.proUsers} trend={5} />
              <StatCard icon={Shield} label="Enterprise" value={stats.enterpriseUsers} trend={3} />
            </div>

            {/* Recent Alerts - fetched on demand */}
            <div className="rounded-xl border border-border bg-card/30 p-5">
              <h3 className="text-heading-sm text-text-primary mb-4">Platform Summary</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-surface border border-border">
                  <p className="text-caption text-text-muted">Free Users</p>
                  <p className="text-lg font-bold text-text-primary">{stats.freeUsers}</p>
                </div>
                <div className="p-3 rounded-lg bg-surface border border-border">
                  <p className="text-caption text-text-muted">Total Monitors</p>
                  <p className="text-lg font-bold text-text-primary">{stats.totalMonitors}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="space-y-4">
            {/* Search & Filter */}
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search users by name or email..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-card border border-border text-sm text-text-primary focus:border-brand focus:outline-none"
                />
              </div>
              <button className="px-4 py-2.5 rounded-lg bg-card border border-border text-body-sm text-text-secondary flex items-center gap-2">
                Filter <ChevronDown size={14} />
              </button>
            </div>

            {/* Users Table */}
            <div className="rounded-xl border border-border bg-card/30 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-surface/50">
                    <th className="text-left px-4 py-3 text-caption text-text-muted font-medium">User</th>
                    <th className="text-left px-4 py-3 text-caption text-text-muted font-medium">Plan</th>
                    <th className="text-left px-4 py-3 text-caption text-text-muted font-medium">Monitors</th>
                    <th className="text-left px-4 py-3 text-caption text-text-muted font-medium">Status</th>
                    <th className="text-left px-4 py-3 text-caption text-text-muted font-medium">Joined</th>
                    <th className="text-right px-4 py-3 text-caption text-text-muted font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id} className="border-b border-border last:border-0 hover:bg-surface/30 transition-colors">
                      <td className="px-4 py-3">
                        <div>
                          <p className="text-body-sm text-text-primary font-medium">{user.name}</p>
                          <p className="text-caption text-text-muted">{user.email}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          user.plan === 'enterprise' ? 'bg-purple-500/10 text-purple-400' :
                          user.plan === 'pro' ? 'bg-brand/10 text-brand-light' :
                          'bg-card text-text-muted border border-border'
                        }`}>
                          {user.plan === 'free' ? null : <Crown size={9} />}
                          {user.plan}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-body-sm text-text-secondary">{user.monitors}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 text-caption ${
                          user.verified ? 'text-[#30CF79]' : 'text-[#F54E4E]'
                        }`}>
                          {user.verified ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                          {user.verified ? 'active' : 'suspended'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-caption text-text-muted">{user.created_at?.split('T')[0]}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button className="w-8 h-8 rounded-lg flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-card transition-colors" title="Email user">
                            <Mail size={14} />
                          </button>
                          <button className="w-8 h-8 rounded-lg flex items-center justify-center text-text-muted hover:text-[#F54E4E] hover:bg-[#F54E4E]/10 transition-colors" title="Suspend user">
                            <Ban size={14} />
                          </button>
                          <button className="w-8 h-8 rounded-lg flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-card transition-colors">
                            <MoreHorizontal size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Servers Tab */}
        {activeTab === 'servers' && serverInfo && (
          <div className="space-y-6">
            <div className="rounded-xl border border-border bg-card/30 p-5">
              <div className="flex items-center gap-2 mb-4">
                <Server size={16} className="text-brand" />
                <h3 className="text-heading-sm text-text-primary">Primary Server</h3>
                <span className="ml-auto w-2.5 h-2.5 rounded-full bg-[#30CF79]" />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-caption text-text-muted">Hostname</p>
                  <p className="text-body-sm text-text-primary font-mono">{serverInfo.hostname}</p>
                </div>
                <div>
                  <p className="text-caption text-text-muted">Platform</p>
                  <p className="text-body-sm text-text-primary">{serverInfo.platform} ({serverInfo.arch})</p>
                </div>
                <div>
                  <p className="text-caption text-text-muted">Node.js</p>
                  <p className="text-body-sm text-text-primary">{serverInfo.nodeVersion}</p>
                </div>
                <div>
                  <p className="text-caption text-text-muted">Uptime</p>
                  <p className="text-body-sm text-text-primary">{serverInfo.uptime}h</p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-caption mb-1">
                    <span className="text-text-muted">CPU ({serverInfo.cpuCount} cores - {serverInfo.cpuModel})</span>
                    <span className={`font-medium ${serverInfo.cpuUsage > 70 ? 'text-[#F7A501]' : 'text-text-primary'}`}>{serverInfo.cpuUsage}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-surface overflow-hidden">
                    <div className={`h-full rounded-full ${serverInfo.cpuUsage > 70 ? 'bg-[#F7A501]' : 'bg-brand'}`} style={{ width: `${serverInfo.cpuUsage}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-caption mb-1">
                    <span className="text-text-muted">Memory ({serverInfo.totalMemory}GB total)</span>
                    <span className={`font-medium ${serverInfo.memoryUsage > 80 ? 'text-[#F54E4E]' : 'text-text-primary'}`}>{serverInfo.memoryUsage}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-surface overflow-hidden">
                    <div className={`h-full rounded-full ${serverInfo.memoryUsage > 80 ? 'bg-[#F54E4E]' : 'bg-brand'}`} style={{ width: `${serverInfo.memoryUsage}%` }} />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-border">
                <div className="text-center">
                  <p className="text-lg font-bold text-brand-light">{serverInfo.totalChecks30d?.toLocaleString()}</p>
                  <p className="text-caption text-text-muted">Checks (30d)</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-[#F54E4E]">{serverInfo.errorsLast24h}</p>
                  <p className="text-caption text-text-muted">Errors (24h)</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-text-primary">{serverInfo.loadAvg?.join(' / ')}</p>
                  <p className="text-caption text-text-muted">Load Avg (1/5/15m)</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Billing Tab */}
        {activeTab === 'billing' && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-3 gap-4">
              <StatCard icon={DollarSign} label="Monthly Revenue" value="RM 12,450" trend={22} color="text-[#30CF79]" />
              <StatCard icon={TrendingUp} label="Annual Run Rate" value="RM 149,400" trend={18} />
              <StatCard icon={Users} label="Paying Customers" value="370" trend={9} />
            </div>

            <div className="rounded-xl border border-border bg-card/30 p-5">
              <h3 className="text-heading-sm text-text-primary mb-4">Revenue Breakdown</h3>
              <div className="space-y-3">
                {[
                  { plan: 'Pro Monthly', users: 280, revenue: 'RM 8,120', pct: 65 },
                  { plan: 'Pro Annual', users: 62, revenue: 'RM 2,976', pct: 24 },
                  { plan: 'Enterprise', users: 28, revenue: 'RM 1,354', pct: 11 },
                ].map(item => (
                  <div key={item.plan} className="flex items-center gap-4">
                    <span className="text-body-sm text-text-primary w-32">{item.plan}</span>
                    <div className="flex-1 h-2 rounded-full bg-surface overflow-hidden">
                      <div className="h-full rounded-full bg-brand" style={{ width: `${item.pct}%` }} />
                    </div>
                    <span className="text-caption text-text-muted w-20 text-right">{item.users} users</span>
                    <span className="text-body-sm text-text-primary font-medium w-24 text-right">{item.revenue}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card/30 p-5">
              <h3 className="text-heading-sm text-text-primary mb-4">Recent Transactions</h3>
              <div className="space-y-2">
                {[
                  { user: 'sarah@company.my', amount: 'RM 199', plan: 'Enterprise', date: 'Today', status: 'success' },
                  { user: 'nurul@agency.com', amount: 'RM 79', plan: 'Pro', date: 'Today', status: 'success' },
                  { user: 'james@tech.co', amount: 'RM 79', plan: 'Pro', date: 'Yesterday', status: 'failed' },
                  { user: 'raj@startup.io', amount: 'RM 29', plan: 'Starter', date: 'Yesterday', status: 'success' },
                ].map((tx, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-surface border border-border">
                    <div className={`w-2 h-2 rounded-full ${tx.status === 'success' ? 'bg-[#30CF79]' : 'bg-[#F54E4E]'}`} />
                    <span className="text-body-sm text-text-primary flex-1">{tx.user}</span>
                    <span className="text-caption text-text-muted">{tx.plan}</span>
                    <span className="text-caption text-text-muted">{tx.date}</span>
                    <span className="text-body-sm font-medium text-text-primary">{tx.amount}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Alerts Tab */}
        {activeTab === 'alerts' && (
          <div className="space-y-4">
            <div className="flex gap-2 mb-4">
              {['all', 'system', 'security', 'billing'].map(filter => (
                <button key={filter} className="px-3 py-1.5 rounded-lg text-caption font-medium bg-card border border-border text-text-muted hover:text-text-primary capitalize">
                  {filter}
                </button>
              ))}
            </div>
            <div className="space-y-3">
              {alerts.length === 0 ? (
                <p className="text-body-sm text-text-muted text-center py-8">No alerts found</p>
              ) : alerts.map((alert, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-start gap-3 p-4 rounded-xl border border-border bg-card/30"
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    alert.severity === 'error' ? 'bg-[#F54E4E]/10' : alert.severity === 'warning' ? 'bg-[#F7A501]/10' : 'bg-[#3B82F6]/10'
                  }`}>
                    <AlertTriangle size={14} className={
                      alert.severity === 'error' ? 'text-[#F54E4E]' : alert.severity === 'warning' ? 'text-[#F7A501]' : 'text-[#3B82F6]'
                    } />
                  </div>
                  <div className="flex-1">
                    <p className="text-body-sm text-text-primary">{alert.message}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-caption text-text-muted">{alert.time ? new Date(alert.time).toLocaleString() : ''}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium uppercase ${
                        alert.severity === 'error' ? 'bg-[#F54E4E]/10 text-[#F54E4E]' :
                        alert.severity === 'warning' ? 'bg-[#F7A501]/10 text-[#F7A501]' : 'bg-[#3B82F6]/10 text-[#3B82F6]'
                      }`}>{alert.type}</span>
                    </div>
                  </div>
                  <button className="text-caption text-text-muted hover:text-text-primary">Dismiss</button>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="max-w-2xl space-y-6">
            <div className="rounded-xl border border-border bg-card/30 p-5">
              <h3 className="text-heading-sm text-text-primary mb-4">Platform Settings</h3>
              <div className="space-y-4">
                {[
                  { label: 'Maintenance Mode', desc: 'Disable all monitoring checks temporarily', type: 'toggle', enabled: false },
                  { label: 'New User Registration', desc: 'Allow new users to sign up', type: 'toggle', enabled: true },
                  { label: 'Email Notifications', desc: 'Send system alerts to admin email', type: 'toggle', enabled: true },
                  { label: 'Auto-suspend on Payment Failure', desc: 'Suspend accounts after 3 failed payments', type: 'toggle', enabled: true },
                ].map((setting, i) => (
                  <div key={i} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                    <div>
                      <p className="text-body-sm text-text-primary">{setting.label}</p>
                      <p className="text-caption text-text-muted">{setting.desc}</p>
                    </div>
                    <button className={`w-11 h-6 rounded-full transition-colors ${setting.enabled ? 'bg-brand' : 'bg-border'}`}>
                      <motion.div
                        className="w-5 h-5 rounded-full bg-white shadow-sm"
                        animate={{ x: setting.enabled ? 22 : 2 }}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card/30 p-5">
              <h3 className="text-heading-sm text-text-primary mb-4">Danger Zone</h3>
              <div className="space-y-3">
                <button className="w-full py-3 rounded-lg border border-[#F54E4E]/30 text-body-sm text-[#F54E4E] hover:bg-[#F54E4E]/5 transition-colors">
                  Purge All Check Data (older than 90 days)
                </button>
                <button className="w-full py-3 rounded-lg border border-[#F54E4E]/30 text-body-sm text-[#F54E4E] hover:bg-[#F54E4E]/5 transition-colors">
                  Reset All Rate Limits
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.main>
  )
}
