import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, Check, AlertCircle, Loader2, Phone, Hash } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function SignupPage() {
  const [signupMethod, setSignupMethod] = useState('email')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [otpCode, setOtpCode] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [otpCountdown, setOtpCountdown] = useState(0)
  const [showPassword, setShowPassword] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [formError, setFormError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const startOtpCountdown = () => {
    setOtpCountdown(60)
    const timer = setInterval(() => {
      setOtpCountdown(prev => {
        if (prev <= 1) { clearInterval(timer); return 0 }
        return prev - 1
      })
    }, 1000)
  }

  const sendOtp = async () => {
    if (!phone || phone.length < 10) { setFormError('Please enter a valid phone number'); return }
    if (!name) { setFormError('Name is required'); return }
    setFormError('')
    setIsSubmitting(true)
    try {
      await new Promise(r => setTimeout(r, 1000))
      setOtpSent(true)
      startOtpCountdown()
    } catch { setFormError('Failed to send OTP') }
    finally { setIsSubmitting(false) }
  }

  const { register, socialLogin, error: authError, clearError } = useAuth()
  const navigate = useNavigate()

  const handleSocialLogin = async (provider) => {
    setFormError('')
    clearError()
    setIsSubmitting(true)
    try {
      await socialLogin(provider)
      navigate('/dashboard')
    } catch (err) {
      setFormError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }
  const prefersReducedMotion = useReducedMotion()

  const passwordStrength = () => {
    if (password.length === 0) return { level: 0, label: '', color: '' }
    let score = 0
    if (password.length >= 8) score++
    if (password.length >= 10 && /\d/.test(password)) score++
    if (password.length >= 12 && /[!@#$%^&*]/.test(password) && /[A-Z]/.test(password)) score++

    if (score === 0) return { level: 1, label: 'Weak', color: 'bg-semantic-error' }
    if (score === 1) return { level: 2, label: 'Fair', color: 'bg-semantic-warning' }
    return { level: 3, label: 'Strong', color: 'bg-semantic-success' }
  }

  const strength = passwordStrength()

  const validateForm = () => {
    if (!name.trim()) {
      setFormError('Name is required')
      return false
    }
    if (!email) {
      setFormError('Email is required')
      return false
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setFormError('Please enter a valid email address')
      return false
    }
    if (!password) {
      setFormError('Password is required')
      return false
    }
    if (password.length < 8) {
      setFormError('Password must be at least 8 characters')
      return false
    }
    if (!/\d/.test(password)) {
      setFormError('Password must contain at least 1 number')
      return false
    }
    if (!agreedToTerms) {
      setFormError('You must agree to the Terms of Service')
      return false
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError('')
    clearError()

    if (!validateForm()) return

    setIsSubmitting(true)
    try {
      await register(name.trim(), email, password)
      navigate('/dashboard')
    } catch (err) {
      setFormError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const displayError = formError || authError

  return (
    <motion.main
      id="main-content"
      initial={prefersReducedMotion ? {} : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={prefersReducedMotion ? {} : { opacity: 0, y: -8 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen flex items-center justify-center pt-[80px] pb-[48px] px-[16px]"
    >
      <div className="w-full max-w-[420px]">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-8"
        >
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none">
              <circle cx="16" cy="16" r="12" stroke="url(#signup-grad)" strokeWidth="3" fill="none" />
              <circle cx="16" cy="16" r="5" fill="url(#signup-grad)" />
              <defs>
                <linearGradient id="signup-grad" x1="4" y1="4" x2="28" y2="28">
                  <stop stopColor="#10B981" />
                  <stop offset="1" stopColor="#34D399" />
                </linearGradient>
              </defs>
            </svg>
            <span className="text-xl font-bold text-text-primary">StatusMy</span>
          </Link>
          <h1 className="text-heading-lg text-text-primary mb-2">Create your account</h1>
          <p className="text-body-sm text-text-secondary">Start monitoring your services for free</p>
        </motion.div>

        {/* Social signup */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="space-y-3 mb-6"
        >
          <button onClick={() => handleSocialLogin('google')} disabled={isSubmitting} className="w-full h-[44px] flex items-center justify-center gap-3 rounded-sm border border-border bg-card/50 text-body-sm font-medium text-text-primary hover:bg-card hover:border-border/80 transition-all duration-150 disabled:opacity-50">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Sign up with Google
          </button>
          <button onClick={() => handleSocialLogin('github')} disabled={isSubmitting} className="w-full h-[44px] flex items-center justify-center gap-3 rounded-sm border border-border bg-card/50 text-body-sm font-medium text-text-primary hover:bg-card hover:border-border/80 transition-all duration-150 disabled:opacity-50">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            Sign up with GitHub
          </button>
        </motion.div>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-px bg-border" />
          <span className="text-caption text-text-muted">or continue with email</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* Error message */}
        {displayError && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 p-3 mb-4 rounded-sm bg-semantic-error/10 border border-semantic-error/20"
          >
            <AlertCircle size={16} className="text-semantic-error flex-shrink-0" />
            <span className="text-body-sm text-semantic-error">{displayError}</span>
          </motion.div>
        )}

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <div>
            <label htmlFor="name" className="block text-body-sm font-medium text-text-primary mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => { setName(e.target.value); setFormError('') }}
                placeholder="John Doe"
                required
                disabled={isSubmitting}
                className="w-full h-[44px] pl-10 pr-4 rounded-sm bg-card/50 border border-border text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand/60 focus:ring-1 focus:ring-brand/30 transition-all duration-150 disabled:opacity-50"
              />
            </div>
          </div>

          <div>
            <label htmlFor="signup-email" className="block text-body-sm font-medium text-text-primary mb-1.5">
              Work Email
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                id="signup-email"
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setFormError('') }}
                placeholder="you@company.com"
                required
                disabled={isSubmitting}
                className="w-full h-[44px] pl-10 pr-4 rounded-sm bg-card/50 border border-border text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand/60 focus:ring-1 focus:ring-brand/30 transition-all duration-150 disabled:opacity-50"
              />
            </div>
          </div>

          <div>
            <label htmlFor="signup-password" className="block text-body-sm font-medium text-text-primary mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                id="signup-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setFormError('') }}
                placeholder="Create a strong password"
                required
                minLength={8}
                disabled={isSubmitting}
                className="w-full h-[44px] pl-10 pr-10 rounded-sm bg-card/50 border border-border text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand/60 focus:ring-1 focus:ring-brand/30 transition-all duration-150 disabled:opacity-50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {/* Password strength */}
            {password.length > 0 && (
              <div className="mt-2">
                <div className="flex gap-1 mb-1">
                  {[1, 2, 3].map((level) => (
                    <div
                      key={level}
                      className={`h-1 flex-1 rounded-full transition-colors ${
                        level <= strength.level ? strength.color : 'bg-border'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-caption text-text-muted">{strength.label}</span>
              </div>
            )}
          </div>

          {/* Terms */}
          <div className="flex items-start gap-3 pt-2">
            <button
              type="button"
              onClick={() => { setAgreedToTerms(!agreedToTerms); setFormError('') }}
              disabled={isSubmitting}
              className={`w-5 h-5 rounded flex-shrink-0 flex items-center justify-center border transition-all duration-150 mt-0.5 ${
                agreedToTerms
                  ? 'bg-brand border-brand'
                  : 'border-border hover:border-text-muted'
              }`}
              aria-label="Agree to terms"
            >
              {agreedToTerms && <Check size={12} className="text-white" />}
            </button>
            <span className="text-body-sm text-text-secondary leading-relaxed">
              I agree to the{' '}
              <Link to="#" className="text-brand-light hover:text-brand transition-colors">Terms of Service</Link>
              {' '}and{' '}
              <Link to="#" className="text-brand-light hover:text-brand transition-colors">Privacy Policy</Link>
            </span>
          </div>

          <motion.button
            type="submit"
            disabled={isSubmitting}
            whileHover={isSubmitting ? {} : { scale: 1.01 }}
            whileTap={isSubmitting ? {} : { scale: 0.99 }}
            className="btn-primary w-full mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Creating account...
              </>
            ) : (
              <>
                Create Account
                <ArrowRight size={16} />
              </>
            )}
          </motion.button>
        </motion.form>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center text-body-sm text-text-muted mt-8"
        >
          Already have an account?{' '}
          <Link to="/login" className="text-brand-light hover:text-brand font-medium transition-colors">
            Sign in
          </Link>
        </motion.p>
      </div>
    </motion.main>
  )
}
