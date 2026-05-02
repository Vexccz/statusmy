/**
 * Deep Linking Utility
 * Handles statusmy:// and https://app.statusmy.com deep links
 */

const isNative = () => {
  try {
    return window.Capacitor && window.Capacitor.isNativePlatform()
  } catch {
    return false
  }
}

/**
 * Initialize deep link listener
 * @param {Function} navigate - react-router navigate function
 */
export async function initDeepLinks(navigate) {
  if (!isNative()) return

  try {
    const { App } = await import('@capacitor/app')

    // Handle app opened via deep link
    App.addListener('appUrlOpen', (event) => {
      const url = event.url
      console.log('[DeepLink] Opened:', url)
      const route = parseDeepLink(url)
      if (route && navigate) {
        navigate(route)
      }
    })

    // Check if app was launched with a deep link
    const launchUrl = await App.getLaunchUrl()
    if (launchUrl?.url) {
      const route = parseDeepLink(launchUrl.url)
      if (route && navigate) {
        // Small delay to ensure router is ready
        setTimeout(() => navigate(route), 500)
      }
    }
  } catch (err) {
    console.warn('[DeepLink] Init failed:', err)
  }
}

/**
 * Parse deep link URL to app route
 * Supports:
 *   statusmy://monitor/123 -> /dashboard/monitors/123
 *   statusmy://incidents -> /dashboard/incidents
 *   statusmy://alerts -> /dashboard/alerts
 *   statusmy://dashboard -> /dashboard
 *   https://app.statusmy.com/dashboard/monitors/123 -> /dashboard/monitors/123
 */
export function parseDeepLink(url) {
  if (!url) return null

  try {
    // Handle statusmy:// scheme
    if (url.startsWith('statusmy://')) {
      const path = url.replace('statusmy://', '')
      const parts = path.split('/')

      switch (parts[0]) {
        case 'monitor':
          return parts[1] ? `/dashboard/monitors/${parts[1]}` : '/dashboard/monitors'
        case 'monitors':
          return parts[1] ? `/dashboard/monitors/${parts[1]}` : '/dashboard/monitors'
        case 'incidents':
          return '/dashboard/incidents'
        case 'alerts':
          return '/dashboard/alerts'
        case 'status':
          return '/status'
        case 'settings':
          return '/dashboard/settings'
        case 'dashboard':
          return '/dashboard'
        default:
          return '/dashboard'
      }
    }

    // Handle https://app.statusmy.com URLs
    if (url.includes('app.statusmy.com')) {
      const urlObj = new URL(url)
      return urlObj.pathname || '/dashboard'
    }
  } catch {
    return '/dashboard'
  }

  return null
}

export default {
  init: initDeepLinks,
  parse: parseDeepLink,
}
