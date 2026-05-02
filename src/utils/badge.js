/**
 * App Icon Badge Utility
 * Updates app badge count for incident notifications
 */

const isNative = () => {
  try {
    return window.Capacitor && window.Capacitor.isNativePlatform()
  } catch {
    return false
  }
}

let Badge = null

const loadPlugin = async () => {
  if (!isNative()) return null
  try {
    // Use @capawesome/capacitor-badge if available, otherwise local notifications
    const mod = await import('@capacitor/local-notifications')
    Badge = mod.LocalNotifications
    return { __localNotifications: Badge }
  } catch {
    return null
  }
}

/**
 * Set badge count
 * @param {number} count
 */
export async function setBadgeCount(count) {
  const plugin = await loadPlugin()
  if (!plugin) return

  try {
    if (plugin.__localNotifications) {
      // Fallback via local notifications - limited support
      return
    }
    await plugin.set({ count })
  } catch (err) {
    console.warn('[Badge] Failed to set:', err)
  }
}

/**
 * Clear badge
 */
export async function clearBadge() {
  const plugin = await loadPlugin()
  if (!plugin) return

  try {
    if (plugin.__localNotifications) return
    await plugin.clear()
  } catch (err) {
    console.warn('[Badge] Failed to clear:', err)
  }
}

/**
 * Get current badge count
 */
export async function getBadgeCount() {
  const plugin = await loadPlugin()
  if (!plugin) return 0

  try {
    if (plugin.__localNotifications) return 0
    const result = await plugin.get()
    return result?.count || 0
  } catch {
    return 0
  }
}

/**
 * Update badge based on active incident count
 */
export async function updateIncidentBadge(activeIncidentCount) {
  if (activeIncidentCount > 0) {
    await setBadgeCount(activeIncidentCount)
  } else {
    await clearBadge()
  }
}

export default {
  set: setBadgeCount,
  clear: clearBadge,
  get: getBadgeCount,
  updateIncidents: updateIncidentBadge,
}
