import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { Check, X, Zap, Users, Building2, Loader2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'

const plans = [
  {
    name: 'Free',
    key: 'free',
    icon: Zap,
    description: 'For side projects and personal sites',
    monthlyPrice: 0,
    yearlyPrice: 0,
    cta: 'Start Free',
    ctaStyle: 'btn-secondary',
    features: [
      { name: '5 monitors', included: true },
      { name: '5-minute check intervals', included: true },
      { name: 'Email alerts', included: true },
      { name: 'Basic status page', included: true },
      { name: '24-hour log retention', included: true },
      { name: 'SMS alerts', included: false },
      { name: 'Custom domains', included: false },
      { name: 'Team members', included: false },
      { name: 'API access', included: false },
    ],
  },
  {
    name: 'Pro',
    key: 'pro',
    icon: Users,
    description: 'For growing teams and businesses',
    monthlyPrice: 9,
    yearlyPrice: 7,
    cta: 'Start Trial',
    ctaStyle: 'btn-primary',
    popular: true,
    features: [
      { name: '50 monitors', included: true },
      { name: '1-minute check intervals', included: true },
      { name: 'SMS, email & Slack alerts', included: true },
      { name: 'Branded status page', included: true },
      { name: '90-day log retention', included: true },
      { name: 'SSL & domain monitoring', included: true },
      { name: 'Custom domains', included: true },
      { name: 'Up to 5 team members', included: false },
      { name: 'Priority support', included: false },
    ],
  },
  {
    name: 'Business',
    key: 'business',
    icon: Building2,
    description: 'For organizations that need full control',
    monthlyPrice: 29,
    yearlyPrice: 23,
    cta: 'Get Started',
    ctaStyle: 'btn-secondary',
    features: [
      { name: 'Unlimited monitors', included: true },
      { name: '30-second check intervals', included: true },
      { name: 'All alert channels + webhook', included: true },
      { name: 'White-label status page', included: true },
      { name: '365-day log retention', included: true },
      { name: 'SSL & domain monitoring', included: true },
      { name: 'Custom domains', included: true },
      { name: 'Unlimited team members', included: true },
      { name: 'Priority support + SLA', included: true },
    ],
  },
]

const faqs = [
  {
    q: 'Can I switch plans anytime?',
    a: 'Yes, you can upgrade or downgrade at any time. Changes take effect immediately and billing is prorated.',
  },
  {
    q: 'What happens if I exceed my monitor limit?',
    a: "We'll notify you when you reach your limit. You can upgrade your plan or remove unused monitors to stay within your quota.",
  },
  {
    q: 'Do you offer discounts for startups?',
    a: 'Yes! Malaysian startups registered with MDEC or MaGIC can get 50% off the Pro plan for the first year.',
  },
  {
    q: 'Is there a free trial for paid plans?',
    a: 'All paid plans come with a 14-day free trial. No credit card required to start.',
  },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
}

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(true)
  const [loadingPlan, setLoadingPlan] = useState(null)
  const [error, setError] = useState(null)
  const prefersReducedMotion = useReducedMotion()
  const { user } = useAuth()
  const navigate = useNavigate()

  const currentPlan = user?.plan || 'free'

  const handleSubscribe = async (plan) => {
    setError(null)

    // Free plan — just go to signup
    if (plan.key === 'free') {
      if (user) return // Already on free, do nothing
      navigate('/signup')
      return
    }

    // Not logged in — redirect to signup with plan param
    if (!user) {
      navigate(`/signup?plan=${plan.key}`)
      return
    }

    // Already on this plan
    if (currentPlan === plan.key) return

    // Call checkout endpoint
    setLoadingPlan(plan.key)
    try {
      const res = await api.post('/billing/checkout', {
        plan: plan.key,
        interval: isYearly ? 'yearly' : 'monthly',
      })
      // Redirect to Stripe Checkout
      window.location.href = res.data.url
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to start checkout. Please try again.')
    } finally {
      setLoadingPlan(null)
    }
  }

  const getButtonText = (plan) => {
    if (user && currentPlan === plan.key) return 'Current Plan'
    if (loadingPlan === plan.key) return 'Redirecting...'
    if (!user && plan.key === 'free') return 'Start Free'
    if (!user) return plan.cta
    if (plan.key === 'free') return 'Downgrade'
    return 'Subscribe'
  }

  const isButtonDisabled = (plan) => {
    if (loadingPlan) return true
    if (user && currentPlan === plan.key) return true
    return false
  }

  return (
    <motion.main
      id="main-content"
      initial={prefersReducedMotion ? {} : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={prefersReducedMotion ? {} : { opacity: 0, y: -8 }}
      transition={{ duration: 0.3 }}
      className="pt-[128px] pb-[96px] relative"
    >
      {/* Decorative orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute top-[200px] right-[-100px] w-[400px] h-[400px] bg-brand/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[200px] left-[-100px] w-[350px] h-[350px] bg-[#059669]/5 rounded-full blur-[100px]" />
      </div>
      <div className="max-w-container mx-auto px-[16px] sm:px-[24px] lg:px-[32px]">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="font-display text-heading-lg md:text-[3rem] md:leading-[1.1] md:tracking-[-0.02em] font-bold text-text-primary mb-4"
          >
            Simple, transparent <span className="text-gradient">pricing</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-lg text-text-secondary max-w-2xl mx-auto"
          >
            Start free, scale as you grow. No hidden fees, no surprises.
          </motion.p>
        </div>

        {/* Error message */}
        {error && (
          <div className="max-w-md mx-auto mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        {/* Billing toggle */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-center gap-4 mb-12"
        >
          <span className={`text-sm font-medium transition-colors ${!isYearly ? 'text-text-primary' : 'text-text-muted'}`}>
            Monthly
          </span>
          <button
            onClick={() => setIsYearly(!isYearly)}
            className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${isYearly ? 'bg-brand' : 'bg-card border border-border'}`}
            aria-label="Toggle yearly billing"
          >
            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform duration-200 ${isYearly ? 'translate-x-7' : 'translate-x-1'}`} />
          </button>
          <span className={`text-sm font-medium transition-colors ${isYearly ? 'text-text-primary' : 'text-text-muted'}`}>
            Yearly
          </span>
          {isYearly && (
            <span className="badge badge-success text-caption">Save 20%</span>
          )}
        </motion.div>

        {/* Pricing cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-20"
        >
          {plans.map((plan) => {
            const Icon = plan.icon
            const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice
            const isCurrent = user && currentPlan === plan.key
            return (
              <motion.div
                key={plan.name}
                variants={cardVariants}
                className={`relative rounded-xl border p-8 transition-all duration-200 ${
                  plan.popular
                    ? 'border-brand/40 bg-card shadow-glow'
                    : 'border-border bg-card/50 hover:border-border/80'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="badge badge-brand px-3 py-1 text-caption font-semibold">Most Popular</span>
                  </div>
                )}

                {isCurrent && (
                  <div className="absolute -top-3 right-4">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Current Plan
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <div className="w-10 h-10 rounded-lg bg-brand-bg flex items-center justify-center text-brand-light mb-4">
                    <Icon size={20} />
                  </div>
                  <h3 className="text-heading-sm text-text-primary mb-1">{plan.name}</h3>
                  <p className="text-body-sm text-text-muted">{plan.description}</p>
                </div>

                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-text-primary">
                      ${price}
                    </span>
                    {price > 0 && (
                      <span className="text-text-muted text-body-sm">/mo</span>
                    )}
                  </div>
                  {price === 0 && (
                    <span className="text-text-muted text-body-sm">Free forever</span>
                  )}
                </div>

                <button
                  onClick={() => handleSubscribe(plan)}
                  disabled={isButtonDisabled(plan)}
                  className={`${plan.ctaStyle} w-full text-center block mb-8 ${isCurrent ? 'opacity-50 cursor-not-allowed' : ''} ${loadingPlan === plan.key ? 'opacity-75' : ''}`}
                >
                  {loadingPlan === plan.key && <Loader2 size={16} className="inline animate-spin mr-2" />}
                  {getButtonText(plan)}
                </button>

                <div className="space-y-3">
                  {plan.features.map((feature) => (
                    <div key={feature.name} className="flex items-center gap-3">
                      {feature.included ? (
                        <Check size={16} className="text-semantic-success flex-shrink-0" />
                      ) : (
                        <X size={16} className="text-text-muted/40 flex-shrink-0" />
                      )}
                      <span className={`text-body-sm ${feature.included ? 'text-text-secondary' : 'text-text-muted/60'}`}>
                        {feature.name}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* FAQ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto"
        >
          <h2 className="font-display text-heading-lg text-text-primary text-center mb-10">
            Frequently asked questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="card p-6">
                <h3 className="text-heading-sm text-text-primary mb-2">{faq.q}</h3>
                <p className="text-body-sm text-text-secondary leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.main>
  )
}
