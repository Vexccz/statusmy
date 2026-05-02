import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useSearchParams } from 'react-router-dom'
import { User, Mail, Shield, Bell, Palette, Key, Save, Loader2, Plus, Trash2, Copy, Check, Eye, EyeOff, X, CreditCard, ArrowUpRight } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'

function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg border ${type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
      {message}
    </div>
  )
}

export default function SettingsPage() {
  const { user, getMe, isGuest, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-[#10B981] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }
  const [searchParams] = useSearchParams()
  const [activeTab, setActiveTab] = useState(() => searchParams.get('tab') || (isGuest ? 'notifications' : 'profile'))
  const [toast, setToast] = useState(null)

  // Guest mock user to prevent crashes
  const safeUser = user || { name: 'Guest', email: 'guest@statusmy.app', role: 'viewer', plan: 'free' }
  const safeGetMe = getMe || (() => Promise.resolve())

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Palette },
  ]

  return (
    <div className="space-y-6">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div>
        <h1 className="text-2xl font-bold text-text-primary">Settings</h1>
        <p className="text-sm text-text-secondary mt-1">Manage your account preferences</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Tabs */}
        <div className="flex lg:flex-col gap-2 lg:w-48 overflow-x-auto lg:overflow-visible">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${activeTab === tab.id ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'text-text-secondary hover:text-text-primary hover:bg-card'}`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-xl border border-border p-6"
          >
            {activeTab === 'profile' && <ProfileTab user={safeUser} getMe={safeGetMe} showToast={showToast} />}
            {activeTab === 'billing' && <BillingTab user={safeUser} showToast={showToast} />}
            {activeTab === 'notifications' && <NotificationsTab showToast={showToast} />}
            {activeTab === 'security' && <SecurityTab user={safeUser} getMe={safeGetMe} showToast={showToast} />}
            {activeTab === 'appearance' && <AppearanceTab showToast={showToast} />}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

// ─── Profile Tab ───────────────────────────────────────────────────────────────

function ProfileTab({ user, getMe, showToast }) {
  const [saving, setSaving] = useState(false)
  const [name, setName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')

  const handleSaveProfile = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await api.put('/user/profile', { name, email })
      await getMe()
      showToast('Profile updated successfully!')
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update profile', 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSaveProfile} className="space-y-6">
      <h2 className="text-lg font-semibold text-text-primary">Profile Information</h2>

      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-xl font-bold">
          {user?.name?.charAt(0)?.toUpperCase() || 'U'}
        </div>
        <div>
          <p className="font-medium text-text-primary">{user?.name}</p>
          <p className="text-sm text-text-secondary">{user?.plan} plan</p>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-text-primary mb-1.5">Name</label>
        <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full h-11 px-4 rounded-lg border border-border bg-surface text-text-primary text-sm focus:outline-none focus:border-emerald-500" />
      </div>

      <div>
        <label className="block text-sm font-medium text-text-primary mb-1.5">Email</label>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full h-11 px-4 rounded-lg border border-border bg-surface text-text-primary text-sm focus:outline-none focus:border-emerald-500" />
      </div>

      <div>
        <label className="block text-sm font-medium text-text-primary mb-1.5">Plan</label>
        <div className="flex items-center gap-3">
          <span className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 text-sm font-medium capitalize">{user?.plan || 'free'}</span>
          <button type="button" className="text-sm text-emerald-400 hover:underline">Upgrade</button>
        </div>
      </div>

      <button type="submit" disabled={saving} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 transition-colors">
        {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
        Save Changes
      </button>
    </form>
  )
}

// ─── Billing Tab ───────────────────────────────────────────────────────────────

function BillingTab({ user, showToast }) {
  const [loading, setLoading] = useState(true)
  const [subscription, setSubscription] = useState(null)
  const [cancelling, setCancelling] = useState(false)
  const [resuming, setResuming] = useState(false)

  useEffect(() => {
    fetchSubscription()
  }, [])

  const fetchSubscription = async () => {
    try {
      const res = await api.get('/billing/subscription')
      setSubscription(res.data.data)
    } catch (err) {
      // Default to free
      setSubscription({ plan: 'free', status: 'active', current_period_end: null, cancel_at_period_end: false })
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = async () => {
    if (!confirm('Are you sure you want to cancel your subscription? It will remain active until the end of your billing period.')) return
    setCancelling(true)
    try {
      await api.post('/billing/cancel')
      showToast('Subscription will cancel at end of billing period')
      fetchSubscription()
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to cancel subscription', 'error')
    } finally {
      setCancelling(false)
    }
  }

  const handleResume = async () => {
    setResuming(true)
    try {
      await api.post('/billing/resume')
      showToast('Subscription resumed!')
      fetchSubscription()
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to resume subscription', 'error')
    } finally {
      setResuming(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 size={24} className="animate-spin text-emerald-400" />
      </div>
    )
  }

  const plan = subscription?.plan || 'free'
  const isPaid = plan !== 'free'
  const isCancelling = subscription?.cancel_at_period_end

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-text-primary">Billing & Subscription</h2>

      {/* Current plan */}
      <div className="p-5 rounded-lg border border-border bg-surface">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-text-muted">Current Plan</p>
            <p className="text-xl font-bold text-text-primary capitalize">{plan}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            subscription?.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
            subscription?.status === 'canceled' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
            subscription?.status === 'past_due' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' :
            'bg-gray-500/10 text-gray-400 border border-gray-500/20'
          }`}>
            {isCancelling ? 'Cancels at period end' : subscription?.status || 'active'}
          </span>
        </div>

        {subscription?.current_period_end && (
          <p className="text-sm text-text-secondary">
            {isCancelling ? 'Access until: ' : 'Next billing date: '}
            <span className="font-medium text-text-primary">
              {new Date(subscription.current_period_end).toLocaleDateString('en-MY', { year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        {!isPaid && (
          <a href="/pricing" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white bg-emerald-500 hover:bg-emerald-600 transition-colors">
            <ArrowUpRight size={16} />
            Upgrade Plan
          </a>
        )}

        {isPaid && !isCancelling && (
          <>
            <a href="/pricing" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/10 transition-colors">
              <ArrowUpRight size={16} />
              Change Plan
            </a>
            <button
              onClick={handleCancel}
              disabled={cancelling}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-red-400 border border-red-500/20 hover:bg-red-500/10 disabled:opacity-50 transition-colors"
            >
              {cancelling ? <Loader2 size={16} className="animate-spin" /> : <X size={16} />}
              Cancel Subscription
            </button>
          </>
        )}

        {isPaid && isCancelling && (
          <button
            onClick={handleResume}
            disabled={resuming}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 transition-colors"
          >
            {resuming ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
            Resume Subscription
          </button>
        )}
      </div>

      {/* Billing history placeholder */}
      <div className="mt-8">
        <h3 className="text-sm font-semibold text-text-primary mb-3">Billing History</h3>
        <div className="p-6 rounded-lg border border-border text-center">
          <p className="text-sm text-text-muted">No billing history yet.</p>
          <p className="text-xs text-text-muted mt-1">Invoices will appear here once you subscribe to a paid plan.</p>
        </div>
      </div>
    </div>
  )
}

// ─── Notifications Tab ─────────────────────────────────────────────────────────

function NotificationsTab({ showToast }) {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [prefs, setPrefs] = useState({
    monitor_down_alerts: true,
    monitor_recovery_alerts: true,
    ssl_expiry_warnings: true,
    weekly_reports: false,
  })

  useEffect(() => {
    fetchPreferences()
  }, [])

  const fetchPreferences = async () => {
    try {
      const res = await api.get('/user/preferences')
      if (res.data?.data) {
        setPrefs(prev => ({ ...prev, ...res.data.data }))
      }
    } catch (err) {
      // Use defaults on error
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await api.put('/user/preferences', prefs)
      showToast('Notification preferences saved!')
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to save preferences', 'error')
    } finally {
      setSaving(false)
    }
  }

  const togglePref = (key) => {
    setPrefs(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const items = [
    { key: 'monitor_down_alerts', label: 'Monitor down alerts', desc: 'Get notified when a monitor goes down' },
    { key: 'monitor_recovery_alerts', label: 'Monitor recovery alerts', desc: 'Get notified when a monitor recovers' },
    { key: 'ssl_expiry_warnings', label: 'SSL expiry warnings', desc: 'Get notified before SSL certificates expire' },
    { key: 'weekly_reports', label: 'Weekly reports', desc: 'Receive weekly uptime summary emails' },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 size={24} className="animate-spin text-emerald-400" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-text-primary">Notification Preferences</h2>
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.key} className="flex items-center justify-between py-3 border-b border-border last:border-0">
            <div>
              <p className="text-sm font-medium text-text-primary">{item.label}</p>
              <p className="text-xs text-text-muted">{item.desc}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={prefs[item.key]}
                onChange={() => togglePref(item.key)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-gray-600 peer-checked:bg-emerald-500 rounded-full peer-focus:ring-2 peer-focus:ring-emerald-500/20 transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4"></div>
            </label>
          </div>
        ))}
      </div>

      <button onClick={handleSave} disabled={saving} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 transition-colors">
        {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
        Save Preferences
      </button>
    </div>
  )
}

// ─── Security Tab ──────────────────────────────────────────────────────────────

function SecurityTab({ user, getMe, showToast }) {
  const [section, setSection] = useState(null) // null | 'password' | '2fa' | 'apikeys'

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-text-primary">Security</h2>

      {section === null && (
        <div className="space-y-4">
          <div className="p-4 rounded-lg border border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-text-primary">Change Password</p>
                <p className="text-xs text-text-muted">Update your account password</p>
              </div>
              <button onClick={() => setSection('password')} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-card text-text-secondary border border-border hover:text-text-primary transition-colors">
                Change
              </button>
            </div>
          </div>

          <div className="p-4 rounded-lg border border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div>
                  <p className="text-sm font-medium text-text-primary">Two-Factor Authentication</p>
                  <p className="text-xs text-text-muted">Add an extra layer of security</p>
                </div>
                {user?.totp_enabled ? (
                  <span className="px-2 py-0.5 rounded text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Enabled</span>
                ) : null}
              </div>
              <button onClick={() => setSection('2fa')} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors">
                {user?.totp_enabled ? 'Manage' : 'Enable'}
              </button>
            </div>
          </div>

          <div className="p-4 rounded-lg border border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-text-primary">API Keys</p>
                <p className="text-xs text-text-muted">Manage your API access tokens</p>
              </div>
              <button onClick={() => setSection('apikeys')} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-card text-text-secondary border border-border hover:text-text-primary transition-colors">
                Manage
              </button>
            </div>
          </div>
        </div>
      )}

      {section === 'password' && <ChangePasswordSection onBack={() => setSection(null)} showToast={showToast} />}
      {section === '2fa' && <TwoFactorSection user={user} getMe={getMe} onBack={() => setSection(null)} showToast={showToast} />}
      {section === 'apikeys' && <ApiKeysSection onBack={() => setSection(null)} showToast={showToast} />}
    </div>
  )
}

function ChangePasswordSection({ onBack, showToast }) {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [saving, setSaving] = useState(false)
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (newPassword !== confirmPassword) {
      showToast('Passwords do not match', 'error')
      return
    }

    if (newPassword.length < 8) {
      showToast('Password must be at least 8 characters', 'error')
      return
    }

    setSaving(true)
    try {
      await api.put('/user/password', { currentPassword, newPassword })
      showToast('Password updated successfully!')
      onBack()
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to change password', 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-text-primary">Change Password</h3>
        <button onClick={onBack} className="text-xs text-text-secondary hover:text-text-primary">Back</button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1.5">Current Password</label>
          <div className="relative">
            <input
              type={showCurrent ? 'text' : 'password'}
              value={currentPassword}
              onChange={e => setCurrentPassword(e.target.value)}
              required
              className="w-full h-11 px-4 pr-10 rounded-lg border border-border bg-surface text-text-primary text-sm focus:outline-none focus:border-emerald-500"
            />
            <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary">
              {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-1.5">New Password</label>
          <div className="relative">
            <input
              type={showNew ? 'text' : 'password'}
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              required
              minLength={8}
              className="w-full h-11 px-4 pr-10 rounded-lg border border-border bg-surface text-text-primary text-sm focus:outline-none focus:border-emerald-500"
            />
            <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary">
              {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-1.5">Confirm New Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            required
            className={`w-full h-11 px-4 rounded-lg border bg-surface text-text-primary text-sm focus:outline-none focus:border-emerald-500 ${confirmPassword && confirmPassword !== newPassword ? 'border-red-500' : 'border-border'}`}
          />
          {confirmPassword && confirmPassword !== newPassword && (
            <p className="text-xs text-red-400 mt-1">Passwords do not match</p>
          )}
        </div>

        <div className="flex gap-3">
          <button type="submit" disabled={saving} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 transition-colors">
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            Update Password
          </button>
          <button type="button" onClick={onBack} className="px-4 py-2.5 rounded-lg text-sm font-medium text-text-secondary border border-border hover:text-text-primary transition-colors">
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

function TwoFactorSection({ user, getMe, onBack, showToast }) {
  const [step, setStep] = useState(user?.totp_enabled ? 'enabled' : 'initial') // initial | setup | verify | enabled
  const [loading, setLoading] = useState(false)
  const [secret, setSecret] = useState('')
  const [qrUrl, setQrUrl] = useState('')
  const [code, setCode] = useState('')

  const handleSetup = async () => {
    setLoading(true)
    try {
      const res = await api.post('/auth/2fa/setup')
      setSecret(res.data.data.secret)
      setQrUrl(res.data.data.qrUrl)
      setStep('setup')
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to setup 2FA', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyAndEnable = async (e) => {
    e.preventDefault()
    if (code.length !== 6) {
      showToast('Please enter a 6-digit code', 'error')
      return
    }

    setLoading(true)
    try {
      await api.post('/auth/2fa/verify', { code })
      await api.post('/auth/2fa/enable')
      await getMe()
      setStep('enabled')
      showToast('Two-factor authentication enabled!')
    } catch (err) {
      showToast(err.response?.data?.message || 'Verification failed', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleDisable = async () => {
    setLoading(true)
    try {
      await api.post('/auth/2fa/disable')
      await getMe()
      setStep('initial')
      showToast('Two-factor authentication disabled')
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to disable 2FA', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-text-primary">Two-Factor Authentication</h3>
        <button onClick={onBack} className="text-xs text-text-secondary hover:text-text-primary">Back</button>
      </div>

      {step === 'initial' && (
        <div className="space-y-4">
          <p className="text-sm text-text-secondary">Add an extra layer of security to your account by enabling two-factor authentication.</p>
          <button onClick={handleSetup} disabled={loading} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 transition-colors">
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Shield size={16} />}
            Setup 2FA
          </button>
        </div>
      )}

      {step === 'setup' && (
        <div className="space-y-4">
          <p className="text-sm text-text-secondary">Scan this code with your authenticator app (Google Authenticator, Authy, etc.):</p>

          <div className="p-4 rounded-lg bg-surface border border-border">
            <p className="text-xs text-text-muted mb-2">Manual entry key:</p>
            <code className="text-sm text-emerald-400 font-mono break-all">{secret}</code>
          </div>

          <div className="p-4 rounded-lg bg-surface border border-border">
            <p className="text-xs text-text-muted mb-2">OTPAuth URL (paste in authenticator):</p>
            <code className="text-xs text-text-secondary font-mono break-all">{qrUrl}</code>
          </div>

          <form onSubmit={handleVerifyAndEnable} className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">Verification Code</label>
              <input
                type="text"
                value={code}
                onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="000000"
                maxLength={6}
                className="w-48 h-11 px-4 rounded-lg border border-border bg-surface text-text-primary text-sm font-mono text-center tracking-widest focus:outline-none focus:border-emerald-500"
              />
            </div>
            <button type="submit" disabled={loading || code.length !== 6} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 transition-colors">
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
              Verify & Enable
            </button>
          </form>
        </div>
      )}

      {step === 'enabled' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 p-4 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
            <Check size={18} className="text-emerald-400" />
            <p className="text-sm text-emerald-400 font-medium">Two-factor authentication is enabled</p>
          </div>
          <button onClick={handleDisable} disabled={loading} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-red-400 border border-red-500/20 hover:bg-red-500/10 disabled:opacity-50 transition-colors">
            {loading ? <Loader2 size={16} className="animate-spin" /> : null}
            Disable 2FA
          </button>
        </div>
      )}
    </div>
  )
}

function ApiKeysSection({ onBack, showToast }) {
  const [keys, setKeys] = useState([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [newKeyName, setNewKeyName] = useState('')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [revealedKey, setRevealedKey] = useState(null) // { key, name }
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    fetchKeys()
  }, [])

  const fetchKeys = async () => {
    try {
      const res = await api.get('/user/api-keys')
      setKeys(res.data.data)
    } catch (err) {
      showToast('Failed to load API keys', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!newKeyName.trim()) return

    setCreating(true)
    try {
      const res = await api.post('/user/api-keys', { name: newKeyName.trim() })
      setRevealedKey({ key: res.data.data.key, name: res.data.data.name })
      setNewKeyName('')
      setShowCreateForm(false)
      fetchKeys()
      showToast('API key created!')
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to create key', 'error')
    } finally {
      setCreating(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this API key?')) return

    try {
      await api.delete(`/user/api-keys/${id}`)
      setKeys(keys.filter(k => k.id !== id))
      showToast('API key deleted')
    } catch (err) {
      showToast('Failed to delete key', 'error')
    }
  }

  const handleCopy = async (text) => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 size={24} className="animate-spin text-emerald-400" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-text-primary">API Keys</h3>
        <button onClick={onBack} className="text-xs text-text-secondary hover:text-text-primary">Back</button>
      </div>

      {/* Revealed key modal */}
      {revealedKey && (
        <div className="p-4 rounded-lg bg-yellow-500/5 border border-yellow-500/20 space-y-2">
          <p className="text-sm font-medium text-yellow-400">Save this key now - it won&apos;t be shown again!</p>
          <div className="flex items-center gap-2">
            <code className="flex-1 text-xs font-mono text-text-primary bg-surface px-3 py-2 rounded border border-border break-all">{revealedKey.key}</code>
            <button onClick={() => handleCopy(revealedKey.key)} className="p-2 rounded-lg border border-border hover:bg-surface transition-colors">
              {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} className="text-text-secondary" />}
            </button>
          </div>
          <button onClick={() => setRevealedKey(null)} className="text-xs text-text-secondary hover:text-text-primary">Dismiss</button>
        </div>
      )}

      {/* Key list */}
      {keys.length === 0 && !showCreateForm ? (
        <p className="text-sm text-text-muted py-4">No API keys yet. Create one to get started.</p>
      ) : (
        <div className="space-y-2">
          {keys.map(key => (
            <div key={key.id} className="flex items-center justify-between p-3 rounded-lg border border-border">
              <div>
                <p className="text-sm font-medium text-text-primary">{key.name}</p>
                <p className="text-xs text-text-muted font-mono">{key.key_prefix}••••••••</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-text-muted">{new Date(key.created_at).toLocaleDateString()}</span>
                <button onClick={() => handleDelete(key.id)} className="p-1.5 rounded text-red-400 hover:bg-red-500/10 transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create form */}
      {showCreateForm ? (
        <form onSubmit={handleCreate} className="flex items-center gap-2">
          <input
            type="text"
            value={newKeyName}
            onChange={e => setNewKeyName(e.target.value)}
            placeholder="Key name (e.g. Production)"
            className="flex-1 h-10 px-3 rounded-lg border border-border bg-surface text-text-primary text-sm focus:outline-none focus:border-emerald-500"
            autoFocus
          />
          <button type="submit" disabled={creating || !newKeyName.trim()} className="h-10 px-4 rounded-lg text-sm font-medium text-white bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 transition-colors">
            {creating ? <Loader2 size={14} className="animate-spin" /> : 'Create'}
          </button>
          <button type="button" onClick={() => setShowCreateForm(false)} className="h-10 px-3 rounded-lg text-sm text-text-secondary border border-border hover:text-text-primary transition-colors">
            <X size={14} />
          </button>
        </form>
      ) : (
        <button onClick={() => setShowCreateForm(true)} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/10 transition-colors">
          <Plus size={16} />
          Create New Key
        </button>
      )}
    </div>
  )
}

// ─── Appearance Tab ────────────────────────────────────────────────────────────

function AppearanceTab({ showToast }) {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark')
  const [compact, setCompact] = useState(() => localStorage.getItem('compact') === 'true')

  const handleThemeChange = (newTheme) => {
    if (newTheme === 'light') return // Coming soon
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    showToast('Theme preference saved')
  }

  const handleCompactToggle = () => {
    const newVal = !compact
    setCompact(newVal)
    localStorage.setItem('compact', String(newVal))
    if (newVal) {
      document.documentElement.classList.add('compact')
    } else {
      document.documentElement.classList.remove('compact')
    }
    showToast(newVal ? 'Compact mode enabled' : 'Compact mode disabled')
  }

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-text-primary">Appearance</h2>
      <div className="space-y-6">
        <div>
          <p className="text-sm font-medium text-text-primary mb-3">Theme</p>
          <div className="flex gap-3">
            <button
              onClick={() => handleThemeChange('dark')}
              className={`flex-1 p-4 rounded-lg border-2 ${theme === 'dark' ? 'border-emerald-500' : 'border-border'} bg-gray-900 text-center`}
            >
              <div className="w-8 h-8 rounded-full bg-gray-800 mx-auto mb-2" />
              <span className="text-xs text-text-primary">Dark</span>
            </button>
            <button
              onClick={() => handleThemeChange('light')}
              className="flex-1 p-4 rounded-lg border border-border bg-card text-center opacity-50 cursor-not-allowed"
              disabled
            >
              <div className="w-8 h-8 rounded-full bg-gray-200 mx-auto mb-2" />
              <span className="text-xs text-text-secondary">Light (soon)</span>
            </button>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm font-medium text-text-primary">Compact Mode</p>
              <p className="text-xs text-text-muted">Reduce spacing and text size for denser layout</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={compact}
                onChange={handleCompactToggle}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-gray-600 peer-checked:bg-emerald-500 rounded-full peer-focus:ring-2 peer-focus:ring-emerald-500/20 transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}
