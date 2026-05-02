import { useState } from 'react'
import { motion } from 'framer-motion'

const plans = [
  { id: 'starter', name: 'Starter', price: 'RM 29', period: '/mo', monitors: 10, checks: '1 min', features: ['5 Status Pages', 'Email Alerts', '3 Team Members'] },
  { id: 'pro', name: 'Pro', price: 'RM 79', period: '/mo', monitors: 50, checks: '30 sec', features: ['Unlimited Status Pages', 'All Alert Channels', '10 Team Members', 'API Access', 'Custom Domain'], popular: true },
  { id: 'enterprise', name: 'Enterprise', price: 'RM 199', period: '/mo', monitors: 500, checks: '10 sec', features: ['Everything in Pro', 'Unlimited Team', 'SLA Guarantee', 'Priority Support', 'SSO/SAML', 'Custom Integrations'] },
]

const banks = [
  { id: 'maybank', name: 'Maybank2u', logo: '🏦' },
  { id: 'cimb', name: 'CIMB Clicks', logo: '🏦' },
  { id: 'rhb', name: 'RHB Now', logo: '🏦' },
  { id: 'publicbank', name: 'PBe', logo: '🏦' },
  { id: 'hongleong', name: 'Hong Leong Connect', logo: '🏦' },
  { id: 'ambank', name: 'AmOnline', logo: '🏦' },
  { id: 'bankislam', name: 'Bank Islam', logo: '🏦' },
  { id: 'bsn', name: 'myBSN', logo: '🏦' },
]

export default function PaymentPage() {
  const [selectedPlan, setSelectedPlan] = useState('pro')
  const [paymentMethod, setPaymentMethod] = useState('fpx')
  const [selectedBank, setSelectedBank] = useState('')
  const [step, setStep] = useState(1)

  const plan = plans.find(p => p.id === selectedPlan)

  return (
    <motion.main
      id="main-content"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-[128px] pb-[96px]"
    >
      <div className="max-w-4xl mx-auto px-[16px] sm:px-[24px] lg:px-[32px]">
        <h1 className="heading-lg text-text-primary text-center mb-2">Complete Your Subscription</h1>
        <p className="text-body text-text-secondary text-center mb-10">Secure payment powered by Malaysian payment gateways</p>

        {/* Steps */}
        <div className="flex items-center justify-center gap-4 mb-10">
          {[1, 2, 3].map(s => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-caption font-bold ${
                step >= s ? 'bg-brand text-white' : 'bg-card border border-border text-text-muted'
              }`}>{s}</div>
              <span className={`text-caption ${step >= s ? 'text-text-primary' : 'text-text-muted'}`}>
                {s === 1 ? 'Plan' : s === 2 ? 'Payment' : 'Confirm'}
              </span>
              {s < 3 && <div className={`w-12 h-0.5 ${step > s ? 'bg-brand' : 'bg-border'}`} />}
            </div>
          ))}
        </div>

        {step === 1 && (
          <div className="grid md:grid-cols-3 gap-4">
            {plans.map(p => (
              <motion.div
                key={p.id}
                whileHover={{ scale: 1.02 }}
                onClick={() => setSelectedPlan(p.id)}
                className={`relative p-6 rounded-xl border cursor-pointer transition-all ${
                  selectedPlan === p.id
                    ? 'border-brand bg-brand/5 shadow-glow'
                    : 'border-border bg-card/30 hover:border-brand/30'
                }`}
              >
                {p.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-brand text-white text-[10px] font-bold">POPULAR</span>
                )}
                <h3 className="text-heading-sm text-text-primary">{p.name}</h3>
                <div className="mt-2 mb-4">
                  <span className="text-2xl font-bold text-text-primary">{p.price}</span>
                  <span className="text-caption text-text-muted">{p.period}</span>
                </div>
                <p className="text-caption text-text-muted mb-3">{p.monitors} monitors, {p.checks} checks</p>
                <ul className="space-y-1.5">
                  {p.features.map(f => (
                    <li key={f} className="flex items-center gap-2 text-body-sm text-text-secondary">
                      <svg className="w-3.5 h-3.5 text-brand flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        )}

        {step === 2 && (
          <div className="max-w-lg mx-auto space-y-6">
            {/* Payment method tabs */}
            <div className="flex gap-2">
              {[
                { id: 'fpx', label: 'FPX Online Banking' },
                { id: 'duitnow', label: 'DuitNow QR' },
                { id: 'card', label: 'Credit/Debit Card' },
              ].map(m => (
                <button
                  key={m.id}
                  onClick={() => setPaymentMethod(m.id)}
                  className={`flex-1 py-3 rounded-lg text-caption font-medium transition-all ${
                    paymentMethod === m.id
                      ? 'bg-brand/20 text-brand-light border border-brand/30'
                      : 'bg-card border border-border text-text-muted hover:text-text-primary'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>

            {paymentMethod === 'fpx' && (
              <div className="rounded-xl border border-border bg-card/30 p-5">
                <h4 className="text-body-sm font-semibold text-text-primary mb-3">Select Your Bank</h4>
                <div className="grid grid-cols-2 gap-2">
                  {banks.map(bank => (
                    <button
                      key={bank.id}
                      onClick={() => setSelectedBank(bank.id)}
                      className={`flex items-center gap-2 p-3 rounded-lg border transition-all text-left ${
                        selectedBank === bank.id
                          ? 'border-brand bg-brand/5'
                          : 'border-border hover:border-brand/30'
                      }`}
                    >
                      <span className="text-lg">{bank.logo}</span>
                      <span className="text-caption text-text-primary">{bank.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {paymentMethod === 'duitnow' && (
              <div className="rounded-xl border border-border bg-card/30 p-8 text-center">
                <div className="w-48 h-48 mx-auto bg-white rounded-xl flex items-center justify-center mb-4">
                  <span className="text-4xl">📱</span>
                </div>
                <p className="text-body-sm text-text-secondary">Scan QR code with your banking app</p>
                <p className="text-caption text-text-muted mt-1">Amount: {plan?.price}</p>
              </div>
            )}

            {paymentMethod === 'card' && (
              <div className="rounded-xl border border-border bg-card/30 p-5 space-y-3">
                <div>
                  <label className="text-caption text-text-muted block mb-1">Card Number</label>
                  <input placeholder="4242 4242 4242 4242" className="w-full px-3 py-2.5 rounded-lg bg-surface border border-border text-sm text-text-primary focus:border-brand focus:outline-none" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-caption text-text-muted block mb-1">Expiry</label>
                    <input placeholder="MM/YY" className="w-full px-3 py-2.5 rounded-lg bg-surface border border-border text-sm text-text-primary focus:border-brand focus:outline-none" />
                  </div>
                  <div>
                    <label className="text-caption text-text-muted block mb-1">CVC</label>
                    <input placeholder="123" className="w-full px-3 py-2.5 rounded-lg bg-surface border border-border text-sm text-text-primary focus:border-brand focus:outline-none" />
                  </div>
                </div>
              </div>
            )}

            {/* Order summary */}
            <div className="rounded-xl border border-border bg-card/30 p-5">
              <div className="flex justify-between items-center mb-2">
                <span className="text-body-sm text-text-secondary">{plan?.name} Plan</span>
                <span className="text-body-sm font-semibold text-text-primary">{plan?.price}/mo</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-border">
                <span className="text-body-sm font-semibold text-text-primary">Total</span>
                <span className="text-heading-sm text-brand-light">{plan?.price}</span>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="max-w-md mx-auto text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="w-20 h-20 rounded-full bg-brand/20 flex items-center justify-center mx-auto mb-6"
            >
              <svg className="w-10 h-10 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </motion.div>
            <h2 className="text-heading-lg text-text-primary mb-2">Payment Successful!</h2>
            <p className="text-body text-text-secondary mb-6">Your {plan?.name} plan is now active. Start monitoring your services.</p>
            <button className="btn-primary">Go to Dashboard</button>
          </div>
        )}

        {/* Navigation buttons */}
        {step < 3 && (
          <div className="flex justify-between mt-8">
            {step > 1 && (
              <button onClick={() => setStep(s => s - 1)} className="btn-secondary">Back</button>
            )}
            <button
              onClick={() => setStep(s => s + 1)}
              className="btn-primary ml-auto"
              disabled={step === 2 && paymentMethod === 'fpx' && !selectedBank}
            >
              {step === 2 ? 'Pay Now' : 'Continue'}
            </button>
          </div>
        )}
      </div>
    </motion.main>
  )
}
