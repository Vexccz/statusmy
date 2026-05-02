import { motion } from 'framer-motion'
import { Lock, Crown } from 'lucide-react'
import { Link } from 'react-router-dom'
import { usePlan } from '../context/PlanContext'

/**
 * Wraps a feature component - shows upgrade prompt if not available on current plan
 */
export function PlanGate({ feature, children, fallback }) {
  const { canUseFeature, getUpgradeMessage } = usePlan()

  if (canUseFeature(feature)) return children

  if (fallback) return fallback

  return (
    <div className="relative rounded-xl border border-border bg-card/30 p-6 overflow-hidden">
      {/* Blurred preview */}
      <div className="opacity-30 blur-[2px] pointer-events-none">
        {children}
      </div>
      {/* Upgrade overlay */}
      <div className="absolute inset-0 flex items-center justify-center bg-bg/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-6"
        >
          <div className="w-12 h-12 rounded-full bg-brand/10 flex items-center justify-center mx-auto mb-3">
            <Lock size={20} className="text-brand" />
          </div>
          <p className="text-body-sm text-text-primary font-medium mb-1">
            {getUpgradeMessage(feature.replace(/_/g, ' '))}
          </p>
          <Link to="/payment" className="btn-primary btn-sm mt-3 inline-flex items-center gap-1.5">
            <Crown size={14} />
            Upgrade Now
          </Link>
        </motion.div>
      </div>
    </div>
  )
}

/**
 * Small badge showing "PRO" or "ENTERPRISE" next to a feature label
 */
export function PlanBadge({ requiredPlan = 'pro' }) {
  return (
    <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
      requiredPlan === 'enterprise'
        ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
        : 'bg-brand/10 text-brand-light border border-brand/20'
    }`}>
      <Crown size={9} />
      {requiredPlan}
    </span>
  )
}

/**
 * Shows monitor limit warning
 */
export function MonitorLimitBar({ currentCount }) {
  const { limits, plan, isFree } = usePlan()
  const max = limits.maxMonitors
  const percentage = max === -1 ? 0 : (currentCount / max) * 100
  const isNearLimit = percentage >= 80
  const isAtLimit = percentage >= 100

  if (max === -1) return null // unlimited

  return (
    <div className="rounded-lg border border-border bg-card/30 p-3">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-caption text-text-muted">Monitors</span>
        <span className={`text-caption font-medium ${isAtLimit ? 'text-[#F54E4E]' : isNearLimit ? 'text-[#F7A501]' : 'text-text-primary'}`}>
          {currentCount} / {max}
        </span>
      </div>
      <div className="w-full h-1.5 rounded-full bg-surface overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${isAtLimit ? 'bg-[#F54E4E]' : isNearLimit ? 'bg-[#F7A501]' : 'bg-brand'}`}
          style={{ width: `${Math.min(100, percentage)}%` }}
        />
      </div>
      {isAtLimit && isFree && (
        <Link to="/payment" className="text-[10px] text-brand-light hover:underline mt-1.5 inline-block">
          Upgrade for more monitors →
        </Link>
      )}
    </div>
  )
}
