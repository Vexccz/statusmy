/**
 * Push Notifications Service
 * Uses @capacitor/push-notifications for FCM
 */

const isNative = () => {
  try {
    return window.Capacitor && window.Capacitor.isNativePlatform()
  } catch {
    return false
  }
}

let PushNotifications = null

const loadPlugin = async () => {
  if (!isNative()) return null
  try {
    const mod = await import('@capacitor/push-notifications')
    PushNotifications = mod.PushNotifications
    return PushNotifications
  } catch {
    console.warn('[Notifications] @capacitor/push-notifications not available')
    return null
  }
}

/**
 * Register for push notifications
 * @param {Function} onTokenReceived - callback with FCM token
 * @param {Function} onNotificationTap - callback when user taps notification
 * @returns {Promise<boolean>} success
 */
export async function registerPushNotifications(onTokenReceived, onNotificationTap) {
  const plugin = await loadPlugin()
  if (!plugin) return false

  try {
    // Request permission
    const permResult = await plugin.requestPermissions()
    if (permResult.receive !== 'granted') {
      console.warn('[Notifications] Permission denied')
      return false
    }

    // Register with FCM
    await plugin.register()

    // Listen for registration token
    plugin.addListener('registration', (token) => {
      console.log('[Notifications] FCM Token:', token.value)
      if (onTokenReceived) onTokenReceived(token.value)
    })

    // Listen for registration errors
    plugin.addListener('registrationError', (error) => {
      console.error('[Notifications] Registration error:', error)
    })

    // Listen for push notifications received while app is in foreground
    plugin.addListener('pushNotificationReceived', (notification) => {
      console.log('[Notifications] Received:', notification)
    })

    // Listen for notification tap (app opened from notification)
    plugin.addListener('pushNotificationActionPerformed', (action) => {
      console.log('[Notifications] Tapped:', action)
      const data = action.notification?.data
      if (onNotificationTap && data) {
        onNotificationTap(data)
      }
    })

    return true
  } catch (err) {
    console.error('[Notifications] Setup failed:', err)
    return false
  }
}

/**
 * Handle notification tap navigation
 * @param {object} data - notification payload data
 * @param {Function} navigate - react-router navigate function
 */
export function handleNotificationNavigation(data, navigate) {
  if (!data || !navigate) return

  if (data.monitorId) {
    navigate(`/dashboard/monitors/${data.monitorId}`)
  } else if (data.incidentId) {
    navigate('/dashboard/incidents')
  } else if (data.type === 'alert') {
    navigate('/dashboard/alerts')
  } else {
    navigate('/dashboard')
  }
}

/**
 * Unregister from push notifications
 */
export async function unregisterPushNotifications() {
  const plugin = await loadPlugin()
  if (!plugin) return
  try {
    await plugin.removeAllListeners()
  } catch (err) {
    console.error('[Notifications] Unregister failed:', err)
  }
}

export default {
  register: registerPushNotifications,
  handleNavigation: handleNotificationNavigation,
  unregister: unregisterPushNotifications,
}
