import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Download, X, ArrowUpCircle } from 'lucide-react'

const UPDATE_CHECK_URL = '/api/app/version'
const CHECK_INTERVAL = 4 * 60 * 60 * 1000 // Check every 4 hours
const DISMISSED_KEY = 'statusmy_update_dismissed'

/**
 * Auto-update checker component
 * Checks for new app versions and shows update banner
 */
export default function UpdateChecker() {
  const [updateAvailable, setUpdateAvailable] = useState(false)
  const [updateInfo, setUpdateInfo] = useState(null)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    // Check if user dismissed this version
    const dismissedVersion = localStorage.getItem(DISMISSED_KEY)

    const checkForUpdate = async () => {
      try {
        const currentVersion = import.meta.env.VITE_APP_VERSION || '1.0.0'
        const res = await fetch(UPDATE_CHECK_URL)
        if (!res.ok) return

        const data = await res.json()
        const latestVersion = data.version || data.latestVersion

        if (latestVersion && latestVersion !== currentVersion && latestVersion !== dismissedVersion) {
          setUpdateAvailable(true)
          setUpdateInfo({
            version: latestVersion,
            downloadUrl: data.downloadUrl || data.apkUrl || null,
            releaseNotes: data.releaseNotes || data.changelog || null,
            mandatory: data.mandatory || false,
          })
        }
      } catch {
        // Silently fail - update check is non-critical
      }
    }

    // Check on mount
    checkForUpdate()

    // Periodic check
    const interval = setInterval(checkForUpdate, CHECK_INTERVAL)
    return () => clearInterval(interval)
  }, [])

  const handleDismiss = () => {
    setDismissed(true)
    if (updateInfo?.version) {
      localStorage.setItem(DISMISSED_KEY, updateInfo.version)
    }
  }

  const handleUpdate = () => {
    if (updateInfo?.downloadUrl) {
      window.open(updateInfo.downloadUrl, '_system')
    }
  }

  if (!updateAvailable || dismissed) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -60, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="fixed top-0 left-0 right-0 z-50 safe-area-top"
      >
        <div className="mx-3 mt-2 p-3 rounded-xl bg-surface border border-[rgba(16,185,129,0.3)] shadow-lg backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[rgba(16,185,129,0.1)] flex items-center justify-center flex-shrink-0">
              <ArrowUpCircle size={20} className="text-[#10B981]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-text-primary">
                Update Available
              </p>
              <p className="text-xs text-text-muted truncate">
                Version {updateInfo?.version} is ready
                {updateInfo?.releaseNotes && ` - ${updateInfo.releaseNotes}`}
              </p>
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              {updateInfo?.downloadUrl && (
                <button
                  onClick={handleUpdate}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#10B981] hover:bg-[#059669] text-white text-xs font-semibold transition-colors"
                >
                  <Download size={12} />
                  Update
                </button>
              )}
              {!updateInfo?.mandatory && (
                <button
                  onClick={handleDismiss}
                  className="p-1.5 rounded-lg hover:bg-surface text-text-muted transition-colors"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
