/**
 * Haptic Feedback Utility
 * Uses @capacitor/haptics for native haptic feedback
 */

const isNative = () => {
  try {
    return window.Capacitor && window.Capacitor.isNativePlatform()
  } catch {
    return false
  }
}

let Haptics = null
let ImpactStyle = null
let NotificationType = null

const loadPlugin = async () => {
  if (!isNative()) return null
  try {
    const mod = await import('@capacitor/haptics')
    Haptics = mod.Haptics
    ImpactStyle = mod.ImpactStyle
    NotificationType = mod.NotificationType
    return Haptics
  } catch {
    return null
  }
}

// Pre-load on import
loadPlugin()

/**
 * Light impact - tab switches, minor interactions
 */
export async function hapticLight() {
  const plugin = await loadPlugin()
  if (!plugin) return
  try {
    await plugin.impact({ style: ImpactStyle?.Light || 'LIGHT' })
  } catch {}
}

/**
 * Medium impact - button presses, selections
 */
export async function hapticMedium() {
  const plugin = await loadPlugin()
  if (!plugin) return
  try {
    await plugin.impact({ style: ImpactStyle?.Medium || 'MEDIUM' })
  } catch {}
}

/**
 * Heavy impact - pull-to-refresh trigger, important actions
 */
export async function hapticHeavy() {
  const plugin = await loadPlugin()
  if (!plugin) return
  try {
    await plugin.impact({ style: ImpactStyle?.Heavy || 'HEAVY' })
  } catch {}
}

/**
 * Success notification haptic
 */
export async function hapticSuccess() {
  const plugin = await loadPlugin()
  if (!plugin) return
  try {
    await plugin.notification({ type: NotificationType?.Success || 'SUCCESS' })
  } catch {}
}

/**
 * Warning notification haptic
 */
export async function hapticWarning() {
  const plugin = await loadPlugin()
  if (!plugin) return
  try {
    await plugin.notification({ type: NotificationType?.Warning || 'WARNING' })
  } catch {}
}

/**
 * Error notification haptic
 */
export async function hapticError() {
  const plugin = await loadPlugin()
  if (!plugin) return
  try {
    await plugin.notification({ type: NotificationType?.Error || 'ERROR' })
  } catch {}
}

/**
 * Selection changed haptic (lightest)
 */
export async function hapticSelection() {
  const plugin = await loadPlugin()
  if (!plugin) return
  try {
    await plugin.selectionStart()
    await plugin.selectionChanged()
    await plugin.selectionEnd()
  } catch {}
}

export default {
  light: hapticLight,
  medium: hapticMedium,
  heavy: hapticHeavy,
  success: hapticSuccess,
  warning: hapticWarning,
  error: hapticError,
  selection: hapticSelection,
}
