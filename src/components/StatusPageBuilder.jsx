import { useState } from 'react'
import { motion } from 'framer-motion'

const defaultComponents = [
  { id: 'header', type: 'header', label: 'Header', enabled: true },
  { id: 'overall', type: 'overall-status', label: 'Overall Status', enabled: true },
  { id: 'monitors', type: 'monitor-list', label: 'Monitor List', enabled: true },
  { id: 'uptime', type: 'uptime-graph', label: 'Uptime Graph (90 days)', enabled: true },
  { id: 'incidents', type: 'incidents', label: 'Recent Incidents', enabled: true },
  { id: 'maintenance', type: 'maintenance', label: 'Scheduled Maintenance', enabled: false },
  { id: 'subscribe', type: 'subscribe', label: 'Subscribe to Updates', enabled: true },
  { id: 'footer', type: 'footer', label: 'Footer', enabled: true },
]

export default function StatusPageBuilder() {
  const [components, setComponents] = useState(defaultComponents)
  const [settings, setSettings] = useState({
    title: 'MyApp Status',
    domain: 'status.myapp.com',
    logo: '',
    brandColor: '#10B981',
    darkMode: true,
    showUptime: true,
  })
  const [draggedId, setDraggedId] = useState(null)

  const toggleComponent = (id) => {
    setComponents(prev => prev.map(c => c.id === id ? { ...c, enabled: !c.enabled } : c))
  }

  const moveComponent = (fromIdx, toIdx) => {
    const updated = [...components]
    const [moved] = updated.splice(fromIdx, 1)
    updated.splice(toIdx, 0, moved)
    setComponents(updated)
  }

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Builder Panel */}
      <div className="space-y-4">
        <div className="rounded-xl border border-border bg-card/30 p-5">
          <h3 className="text-heading-sm text-text-primary mb-4">Page Settings</h3>
          <div className="space-y-3">
            <div>
              <label className="text-caption text-text-muted block mb-1">Page Title</label>
              <input
                value={settings.title}
                onChange={e => setSettings(s => ({ ...s, title: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-sm text-text-primary focus:border-brand focus:outline-none"
              />
            </div>
            <div>
              <label className="text-caption text-text-muted block mb-1">Custom Domain</label>
              <input
                value={settings.domain}
                onChange={e => setSettings(s => ({ ...s, domain: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-sm text-text-primary focus:border-brand focus:outline-none"
              />
            </div>
            <div>
              <label className="text-caption text-text-muted block mb-1">Brand Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={settings.brandColor}
                  onChange={e => setSettings(s => ({ ...s, brandColor: e.target.value }))}
                  className="w-10 h-10 rounded-lg border border-border cursor-pointer"
                />
                <span className="text-caption text-text-muted font-mono">{settings.brandColor}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card/30 p-5">
          <h3 className="text-heading-sm text-text-primary mb-4">Components</h3>
          <div className="space-y-2">
            {components.map((comp, idx) => (
              <motion.div
                key={comp.id}
                layout
                className={`flex items-center gap-3 p-3 rounded-lg border transition-colors cursor-move ${
                  comp.enabled ? 'border-border bg-surface' : 'border-border/50 bg-card/20 opacity-50'
                }`}
                draggable
                onDragStart={() => setDraggedId(idx)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => { if (draggedId !== null) moveComponent(draggedId, idx); setDraggedId(null) }}
              >
                <svg className="w-4 h-4 text-text-muted flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M7 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM7 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM7 14a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 14a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" />
                </svg>
                <span className="text-sm text-text-primary flex-1">{comp.label}</span>
                <button
                  onClick={() => toggleComponent(comp.id)}
                  className={`w-9 h-5 rounded-full transition-colors ${comp.enabled ? 'bg-brand' : 'bg-border'}`}
                >
                  <motion.div
                    className="w-4 h-4 rounded-full bg-white shadow-sm"
                    animate={{ x: comp.enabled ? 17 : 2 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="rounded-xl border border-border bg-[#0a0a0f] p-4 overflow-hidden">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-3 h-3 rounded-full bg-[#F54E4E]/70" />
          <div className="w-3 h-3 rounded-full bg-[#F7A501]/70" />
          <div className="w-3 h-3 rounded-full bg-[#30CF79]/70" />
          <span className="ml-2 text-[10px] text-text-muted font-mono">{settings.domain}</span>
        </div>
        <div className="rounded-lg border border-border/50 bg-[#141420] p-4 min-h-[400px]">
          {components.filter(c => c.enabled).map(comp => (
            <div key={comp.id} className="mb-3">
              {comp.type === 'header' && (
                <div className="text-center py-4">
                  <div className="w-8 h-8 rounded-full mx-auto mb-2" style={{ backgroundColor: settings.brandColor }} />
                  <h4 className="text-sm font-bold text-white">{settings.title}</h4>
                </div>
              )}
              {comp.type === 'overall-status' && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-[#30CF79]/10 border border-[#30CF79]/20">
                  <div className="w-2 h-2 rounded-full bg-[#30CF79]" />
                  <span className="text-xs text-[#30CF79] font-medium">All Systems Operational</span>
                </div>
              )}
              {comp.type === 'monitor-list' && (
                <div className="space-y-1.5">
                  {['API', 'Dashboard', 'CDN'].map(m => (
                    <div key={m} className="flex items-center gap-2 p-2 rounded bg-white/5">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#30CF79]" />
                      <span className="text-[10px] text-gray-300">{m}</span>
                      <span className="text-[10px] text-gray-500 ml-auto">99.99%</span>
                    </div>
                  ))}
                </div>
              )}
              {comp.type === 'uptime-graph' && (
                <div className="flex gap-0.5 mt-2">
                  {Array.from({ length: 30 }).map((_, i) => (
                    <div key={i} className="flex-1 h-6 rounded-sm" style={{ backgroundColor: i === 22 ? '#F54E4E' : settings.brandColor, opacity: 0.8 }} />
                  ))}
                </div>
              )}
              {comp.type === 'incidents' && (
                <div className="mt-2 p-2 rounded bg-white/5">
                  <span className="text-[10px] text-gray-400">No incidents reported</span>
                </div>
              )}
              {comp.type === 'subscribe' && (
                <div className="mt-2 flex gap-1">
                  <div className="flex-1 h-6 rounded bg-white/5" />
                  <div className="h-6 w-16 rounded" style={{ backgroundColor: settings.brandColor, opacity: 0.8 }} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
