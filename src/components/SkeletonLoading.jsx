/**
 * Shimmer skeleton components for better loading states
 */

// Base shimmer block
export function Shimmer({ className = '', style = {} }) {
  return (
    <div
      className={`relative overflow-hidden rounded bg-surface ${className}`}
      style={style}
    >
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
    </div>
  )
}

// Dashboard stat card skeleton
export function StatCardSkeleton() {
  return (
    <div className="card flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <Shimmer className="h-4 w-24" />
        <Shimmer className="w-9 h-9 rounded-md" />
      </div>
      <div>
        <Shimmer className="h-7 w-16 mb-1" />
        <Shimmer className="h-3 w-20" />
      </div>
    </div>
  )
}

// Monitor row skeleton
export function MonitorRowSkeleton() {
  return (
    <div className="flex items-center gap-4 py-3 px-4">
      <Shimmer className="w-3 h-3 rounded-full" />
      <div className="flex items-center gap-3 flex-1">
        <Shimmer className="w-8 h-8 rounded-md" />
        <div className="flex-1">
          <Shimmer className="h-4 w-32 mb-1.5" />
          <Shimmer className="h-3 w-48" />
        </div>
      </div>
      <Shimmer className="hidden sm:block w-12 h-4" />
      <Shimmer className="hidden sm:block w-12 h-4" />
    </div>
  )
}

// Alert channel skeleton
export function ChannelCardSkeleton() {
  return (
    <div className="card flex items-center gap-4">
      <Shimmer className="w-10 h-10 rounded-lg" />
      <div className="flex-1">
        <Shimmer className="h-4 w-32 mb-1.5" />
        <Shimmer className="h-3 w-16" />
      </div>
      <Shimmer className="w-10 h-5 rounded-full" />
      <Shimmer className="w-16 h-8 rounded-lg" />
    </div>
  )
}

// Incident card skeleton
export function IncidentCardSkeleton() {
  return (
    <div className="card !p-0 overflow-hidden">
      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1">
            <Shimmer className="h-5 w-48 mb-2" />
            <Shimmer className="h-3 w-24" />
          </div>
          <div className="flex gap-2">
            <Shimmer className="w-14 h-5 rounded-full" />
            <Shimmer className="w-20 h-5 rounded-full" />
          </div>
        </div>
        <Shimmer className="h-4 w-full mb-2" />
        <Shimmer className="h-4 w-3/4" />
      </div>
    </div>
  )
}

// Status page monitor skeleton
export function StatusMonitorSkeleton() {
  return (
    <div className="border border-border rounded-xl bg-card p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          <Shimmer className="w-5 h-5 rounded-full" />
          <Shimmer className="h-4 w-32" />
        </div>
        <div className="flex items-center gap-3">
          <Shimmer className="w-16 h-6 rounded-full" />
          <Shimmer className="w-10 h-4" />
        </div>
      </div>
    </div>
  )
}

// Full dashboard skeleton
export function DashboardPageSkeleton() {
  return (
    <main className="p-6 lg:p-8">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <Shimmer className="h-8 w-64 mb-2" />
            <Shimmer className="h-4 w-48" />
          </div>
          <div className="flex gap-2">
            <Shimmer className="w-9 h-9 rounded-lg" />
            <Shimmer className="w-28 h-9 rounded-lg" />
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[1, 2, 3, 4].map((i) => <StatCardSkeleton key={i} />)}
        </div>
        <div className="card !p-0 overflow-hidden">
          <div className="px-5 py-4 border-b border-border">
            <Shimmer className="h-5 w-24" />
          </div>
          {[1, 2, 3].map((i) => <MonitorRowSkeleton key={i} />)}
        </div>
      </div>
    </main>
  )
}

// Monitors page skeleton
export function MonitorsPageSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <Shimmer className="h-8 w-32 mb-2" />
        <Shimmer className="h-4 w-40" />
      </div>
      <div className="flex gap-3">
        <Shimmer className="flex-1 h-10 rounded-lg" />
        <div className="flex gap-2">
          {[1, 2, 3, 4].map((i) => <Shimmer key={i} className="w-16 h-10 rounded-lg" />)}
        </div>
      </div>
      <div className="space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center gap-4 p-4 bg-card rounded-xl border border-border">
            <Shimmer className="w-3 h-3 rounded-full" />
            <div className="flex-1">
              <Shimmer className="h-4 w-32 mb-1.5" />
              <Shimmer className="h-3 w-48" />
            </div>
            <Shimmer className="w-16 h-4" />
          </div>
        ))}
      </div>
    </div>
  )
}

// Alerts page skeleton
export function AlertsPageSkeleton() {
  return (
    <main className="min-h-screen pt-6 pb-6 px-4">
      <div className="max-w-container mx-auto">
        <div className="mb-8">
          <Shimmer className="h-8 w-24 mb-2" />
          <Shimmer className="h-4 w-64" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <Shimmer className="h-5 w-32 mb-4" />
            {[1, 2, 3].map((i) => <ChannelCardSkeleton key={i} />)}
          </div>
          <div className="card">
            <Shimmer className="h-5 w-28 mb-4" />
            {[1, 2, 3].map((i) => (
              <div key={i} className="py-3 border-b border-border">
                <Shimmer className="h-4 w-full mb-2" />
                <Shimmer className="h-3 w-3/4" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
