import { createContext, useContext, useMemo } from 'react'
import { useAuth } from './AuthContext'

const PLAN_LIMITS = {
  free: {
    maxMonitors: 5,
    minInterval: 300,
    maxStatusPages: 1,
    maxTeamMembers: 1,
    alertChannels: ['email'],
    features: ['basic_monitoring', 'email_alerts', 'status_page'],
    sslMonitoring: false,
    cronMonitoring: false,
    webhooks: false,
    apiAccess: false,
    customDomain: false,
  },
  pro: {
    maxMonitors: 50,
    minInterval: 30,
    maxStatusPages: -1,
    maxTeamMembers: 10,
    alertChannels: ['email', 'sms', 'slack', 'discord', 'telegram', 'webhook', 'pagerduty'],
    features: ['basic_monitoring', 'email_alerts', 'status_page', 'ssl_monitoring', 'cron_monitoring', 'webhooks', 'api_access', 'custom_domain', 'response_time_charts', 'advanced_reports'],
    sslMonitoring: true,
    cronMonitoring: true,
    webhooks: true,
    apiAccess: true,
    customDomain: true,
  },
  enterprise: {
    maxMonitors: 500,
    minInterval: 10,
    maxStatusPages: -1,
    maxTeamMembers: -1,
    alertChannels: ['email', 'sms', 'slack', 'discord', 'telegram', 'webhook', 'pagerduty', 'opsgenie', 'custom'],
    features: ['basic_monitoring', 'email_alerts', 'status_page', 'ssl_monitoring', 'cron_monitoring', 'webhooks', 'api_access', 'custom_domain', 'response_time_charts', 'advanced_reports', 'sso', 'sla_guarantee', 'priority_support', 'custom_integrations'],
    sslMonitoring: true,
    cronMonitoring: true,
    webhooks: true,
    apiAccess: true,
    customDomain: true,
  },
}

const PlanContext = createContext(null)

export function PlanProvider({ children }) {
  const { user } = useAuth()

  const value = useMemo(() => {
    const plan = user?.plan || 'free'
    const limits = PLAN_LIMITS[plan] || PLAN_LIMITS.free

    return {
      plan,
      limits,
      isPro: plan === 'pro' || plan === 'enterprise',
      isEnterprise: plan === 'enterprise',
      isFree: plan === 'free',
      canUseFeature: (feature) => limits.features.includes(feature),
      canUseChannel: (channel) => limits.alertChannels.includes(channel),
      isAtMonitorLimit: (currentCount) => limits.maxMonitors !== -1 && currentCount >= limits.maxMonitors,
      getUpgradeMessage: (feature) => {
        if (plan === 'enterprise') return null
        return `Upgrade to ${plan === 'free' ? 'Pro' : 'Enterprise'} to unlock ${feature}`
      },
    }
  }, [user?.plan])

  return <PlanContext.Provider value={value}>{children}</PlanContext.Provider>
}

export function usePlan() {
  const ctx = useContext(PlanContext)
  if (!ctx) throw new Error('usePlan must be used within PlanProvider')
  return ctx
}
