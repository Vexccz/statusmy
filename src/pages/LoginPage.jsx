import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle, Loader2, Phone, Hash, User } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const [loginMethod, setLoginMethod] = useState('email') // 'email' or 'phone'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [otpCode, setOtpCode] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [otpCountdown, setOtpCountdown] = useState(0)
  const [showPassword, setShowPassword] = useState(false)
  const [formError, setFormError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { login, loginWithPhone, sendOtp: apiSendOtp, socialLogin, loginAsGuest, error: authError, clearError } = useAuth()
  const navigate = useNavigate()
  const prefersReducedMotion = useReducedMotion()

  const handleGuestMode = () => {
    loginAsGuest()
    navigate('/dashboard')
  }

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
    if (!phone || phone.length < 10) {
      setFormError('Please enter a valid phone number')
      return
    }
    setFormError('')
    setIsSubmitting(true)
    try {
      const res = await apiSendOtp(phone)
      setOtpSent(true)
      startOtpCountdown()
      // Dev mode: show OTP in console
      if (res.dev_otp) console.log('Dev OTP:', res.dev_otp)
    } catch (err) {
      setFormError(err.message || 'Failed to send OTP. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePhoneLogin = async (e) => {
    e.preventDefault()
    if (!otpCode || otpCode.length !== 6) {
      setFormError('Please enter the 6-digit code')
      return
    }
    setFormError('')
    setIsSubmitting(true)
    try {
      await loginWithPhone(phone, otpCode)
      navigate('/dashboard')
    } catch (err) {
      setFormError(err.message || 'Invalid OTP code')
    } finally {
      setIsSubmitting(false)
    }
  }

  const validateForm = () => {
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
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError('')
    clearError()

    if (!validateForm()) return

    setIsSubmitting(true)
    try {
      await login(email, password)
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
          <Link to="/" className="inline-flex items-center gap-2.5 mb-6">
            {/* Animated logo ring */}
            <motion.svg
              className="w-9 h-9"
              viewBox="0 0 32 32"
              fill="none"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            >
              <motion.circle
                cx="16" cy="16" r="12"
                stroke="url(#login-grad)"
                strokeWidth="3"
                fill="none"
                strokeDasharray="75.4"
                strokeDashoffset="0"
                initial={{ strokeDashoffset: 75.4 }}
                animate={{ strokeDashoffset: 0 }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
              />
              <motion.circle
                cx="16" cy="16" r="5"
                fill="url(#login-grad)"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.6, duration: 0.4, type: 'spring', stiffness: 200 }}
              />
              <defs>
                <linearGradient id="login-grad" x1="4" y1="4" x2="28" y2="28">
                  <stop stopColor="#10B981" />
                  <stop offset="1" stopColor="#34D399" />
                </linearGradient>
              </defs>
            </motion.svg>
            {/* Animated text with letter stagger */}
            <span className="text-xl font-bold flex">
              {'StatusMy'.split('').map((char, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.06, duration: 0.3, ease: 'easeOut' }}
                  className={i < 6 ? 'text-text-primary' : 'text-[#10B981]'}
                >
                  {char}
                </motion.span>
              ))}
            </span>
          </Link>
          <h1 className="text-heading-lg text-text-primary mb-2">Welcome back</h1>
          <p className="text-body-sm text-text-secondary">Sign in to your account to continue</p>
        </motion.div>

        {/* Social login */}
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
            Continue with Google
          </button>
          <button onClick={() => handleSocialLogin('github')} disabled={isSubmitting} className="w-full h-[44px] flex items-center justify-center gap-3 rounded-sm border border-border bg-card/50 text-body-sm font-medium text-text-primary hover:bg-card hover:border-border/80 transition-all duration-150 disabled:opacity-50">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            Continue with GitHub
          </button>
        </motion.div>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-px bg-border" />
          <span className="text-caption text-text-muted">or continue with</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* Login method toggle */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => { setLoginMethod('email'); setFormError('') }}
            className={`flex-1 py-2.5 rounded-lg text-body-sm font-medium transition-all flex items-center justify-center gap-2 ${
              loginMethod === 'email'
                ? 'bg-brand/20 text-brand-light border border-brand/30'
                : 'bg-card/50 border border-border text-text-muted hover:text-text-primary'
            }`}
          >
            <Mail size={14} />
            Email
          </button>
          <button
            onClick={() => { setLoginMethod('phone'); setFormError(''); setOtpSent(false) }}
            className={`flex-1 py-2.5 rounded-lg text-body-sm font-medium transition-all flex items-center justify-center gap-2 ${
              loginMethod === 'phone'
                ? 'bg-brand/20 text-brand-light border border-brand/30'
                : 'bg-card/50 border border-border text-text-muted hover:text-text-primary'
            }`}
          >
            <Phone size={14} />
            Phone
          </button>
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
        {loginMethod === 'email' ? (
          <motion.form
            key="email-form"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <div>
              <label htmlFor="email" className="block text-body-sm font-medium text-text-primary mb-1.5">
                Email
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  id="email"
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
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="text-body-sm font-medium text-text-primary">
                  Password
                </label>
                <Link to="#" className="text-caption text-brand-light hover:text-brand transition-colors">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setFormError('') }}
                  placeholder="Enter your password"
                  required
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
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight size={16} />
                </>
              )}
            </motion.button>
          </motion.form>
        ) : (
          <motion.form
            key="phone-form"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handlePhoneLogin}
            className="space-y-4"
          >
            <div>
              <label htmlFor="phone" className="block text-body-sm font-medium text-text-primary mb-1.5">
                Phone Number
              </label>
              <div className="relative">
                <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => { setPhone(e.target.value); setFormError('') }}
                  placeholder="+60 11-1234 5678"
                  disabled={isSubmitting || otpSent}
                  className="w-full h-[44px] pl-10 pr-4 rounded-sm bg-card/50 border border-border text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand/60 focus:ring-1 focus:ring-brand/30 transition-all duration-150 disabled:opacity-50"
                />
              </div>
            </div>

            {!otpSent ? (
              <motion.button
                type="button"
                onClick={sendOtp}
                disabled={isSubmitting || !phone}
                whileHover={isSubmitting ? {} : { scale: 1.01 }}
                whileTap={isSubmitting ? {} : { scale: 0.99 }}
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Sending code...
                  </>
                ) : (
                  'Send Verification Code'
                )}
              </motion.button>
            ) : (
              <>
                <div>
                  <label htmlFor="otp" className="block text-body-sm font-medium text-text-primary mb-1.5">
                    Verification Code
                  </label>
                  <div className="relative">
                    <Hash size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                    <input
                      id="otp"
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      value={otpCode}
                      onChange={(e) => { setOtpCode(e.target.value.replace(/\D/g, '')); setFormError('') }}
                      placeholder="Enter 6-digit code"
                      disabled={isSubmitting}
                      autoFocus
                      className="w-full h-[44px] pl-10 pr-4 rounded-sm bg-card/50 border border-border text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand/60 focus:ring-1 focus:ring-brand/30 transition-all duration-150 disabled:opacity-50 tracking-[0.3em] text-center font-mono text-lg"
                    />
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-caption text-text-muted">Sent to {phone}</span>
                    <button
                      type="button"
                      onClick={sendOtp}
                      disabled={otpCountdown > 0}
                      className="text-caption text-brand-light hover:text-brand disabled:text-text-muted disabled:cursor-not-allowed transition-colors"
                    >
                      {otpCountdown > 0 ? `Resend in ${otpCountdown}s` : 'Resend code'}
                    </button>
                  </div>
                </div>

                <motion.button
                  type="submit"
                  disabled={isSubmitting || otpCode.length !== 6}
                  whileHover={isSubmitting ? {} : { scale: 1.01 }}
                  whileTap={isSubmitting ? {} : { scale: 0.99 }}
                  className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      Verify & Sign In
                      <ArrowRight size={16} />
                    </>
                  )}
                </motion.button>
              </>
            )}
          </motion.form>
        )}

        {/* Guest mode */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="mt-6"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1 h-px bg-border" />
            <span className="text-caption text-text-muted">or</span>
            <div className="flex-1 h-px bg-border" />
          </div>
          <button
            onClick={handleGuestMode}
            disabled={isSubmitting}
            className="w-full h-[44px] flex items-center justify-center gap-2 rounded-sm border border-border bg-card/30 text-body-sm font-medium text-text-secondary hover:text-text-primary hover:bg-card/50 hover:border-border/80 transition-all duration-150 disabled:opacity-50"
          >
            <User size={16} />
            Continue as Guest
          </button>
          <p className="text-center text-caption text-text-muted mt-2">
            Browse monitors & status — no account needed
          </p>
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center text-body-sm text-text-muted mt-6"
        >
          Don't have an account?{' '}
          <Link to="/signup" className="text-brand-light hover:text-brand font-medium transition-colors">
            Sign up free
          </Link>
        </motion.p>
      </div>
    </motion.main>
  )
}
