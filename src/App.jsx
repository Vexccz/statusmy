import { lazy, Suspense, useState, useEffect } from 'react'
import { Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { AuthProvider, useAuth } from './context/AuthContext'
import { SocketProvider } from './context/SocketContext'
import { ThemeProvider } from './context/ThemeContext'
import { I18nProvider } from './context/I18nContext'
import { PlanProvider } from './context/PlanContext'
import { ToastContainer } from './components/Toast'
import LoadingScreen from './components/LoadingScreen'
import ErrorBoundary from './components/ErrorBoundary'
import { NetworkStatusBanner } from './components/NetworkStatus'
import UpdateChecker from './components/UpdateChecker'
import { setupGlobalErrorHandlers } from './utils/crashReporting'
import { trackPageView } from './utils/analytics'
import { initDeepLinks } from './utils/deepLinks'
import { registerPushNotifications, handleNotificationNavigation } from './utils/notifications'
import { DashboardPageSkeleton } from './components/SkeletonLoading'

// Layouts
import MarketingLayout from './layouts/MarketingLayout'
import DashboardLayout from './layouts/DashboardLayout'
import MobileLayout from './layouts/MobileLayout'
import AuthLayout from './layouts/AuthLayout'

// Lazy load pages
const HomePage = lazy(() => import('./pages/HomePage'))
const PricingPage = lazy(() => import('./pages/PricingPage'))
const AboutPage = lazy(() => import('./pages/AboutPage'))
const DocsPage = lazy(() => import('./pages/DocsPage'))
const ChangelogPage = lazy(() => import('./pages/ChangelogPage'))
const LoginPage = lazy(() => import('./pages/LoginPage'))
const SignupPage = lazy(() => import('./pages/SignupPage'))
const DashboardPage = lazy(() => import('./pages/DashboardPage'))
const AddMonitorPage = lazy(() => import('./pages/AddMonitorPage'))
const MonitorDetailPage = lazy(() => import('./pages/MonitorDetailPage'))
const StatusPage = lazy(() => import('./pages/StatusPage'))
const IncidentsPage = lazy(() => import('./pages/IncidentsPage'))
const AlertsPage = lazy(() => import('./pages/AlertsPage'))
const ReportsPage = lazy(() => import('./pages/ReportsPage'))
const MonitorsPage = lazy(() => import('./pages/MonitorsPage'))
const SettingsPage = lazy(() => import('./pages/SettingsPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))
const FeaturePage = lazy(() => import('./pages/FeaturePage'))
const LegalPage = lazy(() => import('./pages/LegalPage'))
const CompanyPage = lazy(() => import('./pages/CompanyPage'))
const PaymentPage = lazy(() => import('./pages/PaymentPage'))
const AdminPage = lazy(() => import('./pages/AdminPage'))
const OnboardingPage = lazy(() => import('./pages/OnboardingPage'))

// Setup crash reporting on load
setupGlobalErrorHandlers()

// Check if running in Capacitor/mobile
function isMobilePlatform() {
  try {
    if (window.Capacitor && window.Capacitor.isNativePlatform()) return true
  } catch (e) {}
  return window.innerWidth < 768
}

// Check if onboarding completed
function needsOnboarding() {
  return !localStorage.getItem('onboarding_completed')
}

// Protected Route component
function ProtectedRoute({ children, guestAllowed = false }) {
  const { isAuthenticated, isGuest, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="w-8 h-8 border-2 border-[#10B981] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (isGuest && guestAllowed) return children
  if (isGuest) return children
  if (!isAuthenticated) return <Navigate to="/login" replace />

  return children
}

function PageSkeleton() {
  return (
    <div className="min-h-screen pt-[128px] pb-[96px]" aria-busy="true" aria-label="Loading page content">
      <div className="max-w-container mx-auto px-[16px] sm:px-[24px] lg:px-[32px]">
        <div className="text-center mb-12 animate-pulse">
          <div className="h-4 w-40 bg-card/60 rounded-full mx-auto mb-6" />
          <div className="h-12 w-3/4 bg-card/60 rounded-lg mx-auto mb-4" />
          <div className="h-12 w-1/2 bg-card/60 rounded-lg mx-auto mb-6" />
          <div className="h-5 w-2/3 bg-card/40 rounded mx-auto mb-3" />
          <div className="h-5 w-1/2 bg-card/40 rounded mx-auto mb-10" />
          <div className="flex justify-center gap-4">
            <div className="h-11 w-32 bg-card/60 rounded-xl" />
            <div className="h-11 w-40 bg-card/40 rounded-xl" />
          </div>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse rounded-lg border border-border bg-card/20 p-8">
              <div className="w-12 h-12 bg-card/60 rounded-lg mb-5" />
              <div className="h-5 w-3/4 bg-card/60 rounded mb-3" />
              <div className="h-4 w-full bg-card/40 rounded mb-2" />
              <div className="h-4 w-2/3 bg-card/40 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

// Track page views
function PageTracker() {
  const location = useLocation()

  useEffect(() => {
    trackPageView(location.pathname)
  }, [location.pathname])

  return null
}

// Deep link + push notification initializer
function NativeInitializer() {
  const navigate = useNavigate()

  useEffect(() => {
    // Initialize deep links
    initDeepLinks(navigate)

    // Register push notifications
    registerPushNotifications(
      (token) => {
        // Send token to backend for this user
        console.log('[App] FCM token ready:', token?.slice(0, 20) + '...')
      },
      (data) => {
        // Handle notification tap
        handleNotificationNavigation(data, navigate)
      }
    )
  }, [navigate])

  return null
}

function AppContent() {
  const [appReady, setAppReady] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setAppReady(true), 1800)
    return () => clearTimeout(timer)
  }, [])

  if (!appReady) {
    return <LoadingScreen onComplete={() => setAppReady(true)} />
  }

  return (
    <ErrorBoundary>
      {/* Update checker banner */}
      <UpdateChecker />

      {/* Network status banner */}
      <NetworkStatusBanner />

      {/* Skip to content link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:bg-[#10B981] focus:text-white focus:rounded-md focus:outline-none focus:ring-2 focus:ring-[#34D399]"
      >
        Skip to content
      </a>

      <ScrollToTop />
      <PageTracker />
      <NativeInitializer />

      <Suspense fallback={<PageSkeleton />}>
        <AnimatePresence mode="wait">
          <Routes>
            {/* Onboarding for first-time users */}
            <Route path="/onboarding" element={<OnboardingPage />} />

            {/* Root redirects */}
            <Route path="/" element={
              needsOnboarding() ? <Navigate to="/onboarding" replace /> : <Navigate to="/login" replace />
            } />

            {/* Auth pages */}
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
            </Route>

            {/* Dashboard (protected) - Mobile layout for APK */}
            <Route
              element={
                <ProtectedRoute>
                  <MobileLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/dashboard" element={
                <Suspense fallback={<DashboardPageSkeleton />}>
                  <DashboardPage />
                </Suspense>
              } />
              <Route path="/dashboard/add-monitor" element={<AddMonitorPage />} />
              <Route path="/dashboard/monitors/:id" element={<MonitorDetailPage />} />
              <Route path="/dashboard/incidents" element={<IncidentsPage />} />
              <Route path="/dashboard/alerts" element={<AlertsPage />} />
              <Route path="/dashboard/reports" element={<ReportsPage />} />
              <Route path="/dashboard/monitors" element={<MonitorsPage />} />
              <Route path="/dashboard/settings" element={<SettingsPage />} />
              <Route path="/status" element={<StatusPage />} />
            </Route>

            {/* 404 */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </AnimatePresence>
      </Suspense>

      <ToastContainer />
    </ErrorBoundary>
  )
}

function App() {
  return (
    <ThemeProvider>
      <I18nProvider>
        <AuthProvider>
          <PlanProvider>
            <SocketProvider>
              <AppContent />
            </SocketProvider>
          </PlanProvider>
        </AuthProvider>
      </I18nProvider>
    </ThemeProvider>
  )
}

export default App
