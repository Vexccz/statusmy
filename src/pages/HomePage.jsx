import { motion, useReducedMotion } from 'framer-motion'
import Hero from '../components/Hero'
import StatsBanner from '../components/StatsBanner'
import Features from '../components/Features'
import Integrations from '../components/Integrations'
import Testimonials from '../components/Testimonials'
import CustomerLogos from '../components/CustomerLogos'
import GetStarted from '../components/GetStarted'
import Security from '../components/Security'
import BlogPreview from '../components/BlogPreview'
import FAQ from '../components/FAQ'
import Newsletter from '../components/Newsletter'
import CTABanner from '../components/CTABanner'

export default function HomePage() {
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.main
      id="main-content"
      initial={prefersReducedMotion ? {} : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={prefersReducedMotion ? {} : { opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="relative"
    >
      {/* Global decorative gradient orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute top-[800px] left-[-200px] w-[600px] h-[600px] bg-brand/3 rounded-full blur-[150px]" />
        <div className="absolute top-[2000px] right-[-200px] w-[500px] h-[500px] bg-[#7c3aed]/3 rounded-full blur-[130px]" />
        <div className="absolute top-[3500px] left-[-100px] w-[400px] h-[400px] bg-[#ec4899]/3 rounded-full blur-[120px]" />
        <div className="absolute top-[5000px] right-[-150px] w-[500px] h-[500px] bg-brand/3 rounded-full blur-[140px]" />
      </div>

      <Hero />
      <StatsBanner />
      <Features />
      <Integrations />
      <Testimonials />
      <CustomerLogos />
      <GetStarted />
      <Security />
      <BlogPreview />
      <FAQ />
      <Newsletter />
      <CTABanner />
    </motion.main>
  )
}
