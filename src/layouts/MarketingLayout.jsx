import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import BackToTop from '../components/BackToTop'
import CookieConsent from '../components/CookieConsent'

export default function MarketingLayout() {
  return (
    <div className="min-h-screen bg-bg">
      <Navbar />
      <Outlet />
      <Footer />
      <BackToTop />
      <CookieConsent />
    </div>
  )
}
