import Stripe from 'stripe';
import db from '../config/db.js';

// Initialize Stripe (graceful fallback if not configured)
const stripeKey = process.env.STRIPE_SECRET_KEY;
const isStripeConfigured = stripeKey && !stripeKey.includes('placeholder');

let stripe = null;
if (isStripeConfigured) {
  stripe = new Stripe(stripeKey);
} else {
  console.warn('⚠️  STRIPE_SECRET_KEY not configured. Billing features disabled (free plan only).');
}

// Price mapping from env
function getPriceId(plan, interval) {
  const map = {
    pro: {
      monthly: process.env.STRIPE_PRO_MONTHLY_PRICE,
      yearly: process.env.STRIPE_PRO_YEARLY_PRICE,
    },
    business: {
      monthly: process.env.STRIPE_BUSINESS_MONTHLY_PRICE,
      yearly: process.env.STRIPE_BUSINESS_YEARLY_PRICE,
    },
  };
  return map[plan]?.[interval] || null;
}

// ─── Create Checkout Session ───────────────────────────────────────────────────

export const createCheckoutSession = async (req, res) => {
  if (!isStripeConfigured) {
    return res.status(503).json({
      success: false,
      message: 'Stripe not configured. Contact admin.',
    });
  }

  const { plan, interval } = req.body;

  if (!['pro', 'business'].includes(plan)) {
    return res.status(400).json({ success: false, message: 'Invalid plan. Must be pro or business.' });
  }
  if (!['monthly', 'yearly'].includes(interval)) {
    return res.status(400).json({ success: false, message: 'Invalid interval. Must be monthly or yearly.' });
  }

  const priceId = getPriceId(plan, interval);
  if (!priceId || priceId.includes('placeholder')) {
    return res.status(503).json({ success: false, message: 'Price not configured for this plan.' });
  }

  try {
    const userId = req.user.id;
    const userEmail = req.user.email;

    // Get or create Stripe customer
    let sub = db.prepare('SELECT * FROM subscriptions WHERE user_id = ?').get(userId);
    let customerId = sub?.stripe_customer_id;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: userEmail,
        metadata: { user_id: String(userId) },
      });
      customerId = customer.id;

      // Upsert subscription record
      db.prepare(`
        INSERT INTO subscriptions (user_id, stripe_customer_id, plan, status)
        VALUES (?, ?, 'free', 'active')
        ON CONFLICT(user_id) DO UPDATE SET stripe_customer_id = excluded.stripe_customer_id
      `).run(userId, customerId);
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/settings?tab=billing&status=success`,
      cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/pricing?status=cancelled`,
      metadata: { user_id: String(userId), plan, interval },
    });

    return res.json({ success: true, url: session.url });
  } catch (error) {
    console.error('Stripe checkout error:', error.message);
    return res.status(500).json({ success: false, message: 'Failed to create checkout session.' });
  }
};

// ─── Webhook Handler ───────────────────────────────────────────────────────────

export const handleWebhook = async (req, res) => {
  if (!isStripeConfigured) {
    return res.status(503).json({ success: false, message: 'Stripe not configured.' });
  }

  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).json({ success: false, message: `Webhook Error: ${err.message}` });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const userId = parseInt(session.metadata.user_id);
        const plan = session.metadata.plan;
        const subscriptionId = session.subscription;

        // Fetch subscription details from Stripe
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        const periodEnd = new Date(subscription.current_period_end * 1000).toISOString();

        // Update subscriptions table
        db.prepare(`
          INSERT INTO subscriptions (user_id, stripe_customer_id, stripe_subscription_id, plan, status, current_period_end)
          VALUES (?, ?, ?, ?, 'active', ?)
          ON CONFLICT(user_id) DO UPDATE SET
            stripe_subscription_id = excluded.stripe_subscription_id,
            plan = excluded.plan,
            status = 'active',
            current_period_end = excluded.current_period_end,
            cancel_at_period_end = 0
        `).run(userId, session.customer, subscriptionId, plan, periodEnd);

        // Update user's plan
        db.prepare('UPDATE users SET plan = ? WHERE id = ?').run(plan, userId);
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        const customerId = subscription.customer;

        // Find user by stripe customer id
        const sub = db.prepare('SELECT * FROM subscriptions WHERE stripe_customer_id = ?').get(customerId);
        if (!sub) break;

        const periodEnd = new Date(subscription.current_period_end * 1000).toISOString();
        const cancelAtPeriodEnd = subscription.cancel_at_period_end ? 1 : 0;

        // Map Stripe status
        let status = 'active';
        if (subscription.status === 'canceled') status = 'canceled';
        else if (subscription.status === 'past_due') status = 'past_due';
        else if (subscription.status === 'trialing') status = 'trialing';

        db.prepare(`
          UPDATE subscriptions SET
            status = ?,
            current_period_end = ?,
            cancel_at_period_end = ?
          WHERE stripe_customer_id = ?
        `).run(status, periodEnd, cancelAtPeriodEnd, customerId);

        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        const customerId = subscription.customer;

        const sub = db.prepare('SELECT * FROM subscriptions WHERE stripe_customer_id = ?').get(customerId);
        if (!sub) break;

        // Downgrade to free
        db.prepare(`
          UPDATE subscriptions SET plan = 'free', status = 'canceled', stripe_subscription_id = NULL, cancel_at_period_end = 0
          WHERE stripe_customer_id = ?
        `).run(customerId);

        db.prepare('UPDATE users SET plan = ? WHERE id = ?').run('free', sub.user_id);
        break;
      }

      default:
        // Unhandled event type
        break;
    }
  } catch (error) {
    console.error('Webhook processing error:', error.message);
    return res.status(500).json({ success: false, message: 'Webhook processing failed.' });
  }

  res.json({ received: true });
};

// ─── Get Subscription ──────────────────────────────────────────────────────────

export const getSubscription = async (req, res) => {
  const userId = req.user.id;

  const sub = db.prepare('SELECT * FROM subscriptions WHERE user_id = ?').get(userId);

  if (!sub) {
    return res.json({
      success: true,
      data: {
        plan: req.user.plan || 'free',
        status: 'active',
        current_period_end: null,
        cancel_at_period_end: false,
      },
    });
  }

  return res.json({
    success: true,
    data: {
      plan: sub.plan,
      status: sub.status,
      current_period_end: sub.current_period_end,
      cancel_at_period_end: !!sub.cancel_at_period_end,
    },
  });
};

// ─── Cancel Subscription ───────────────────────────────────────────────────────

export const cancelSubscription = async (req, res) => {
  if (!isStripeConfigured) {
    return res.status(503).json({ success: false, message: 'Stripe not configured.' });
  }

  const userId = req.user.id;
  const sub = db.prepare('SELECT * FROM subscriptions WHERE user_id = ?').get(userId);

  if (!sub || !sub.stripe_subscription_id) {
    return res.status(400).json({ success: false, message: 'No active subscription found.' });
  }

  try {
    await stripe.subscriptions.update(sub.stripe_subscription_id, {
      cancel_at_period_end: true,
    });

    db.prepare('UPDATE subscriptions SET cancel_at_period_end = 1 WHERE user_id = ?').run(userId);

    return res.json({ success: true, message: 'Subscription will cancel at end of billing period.' });
  } catch (error) {
    console.error('Cancel subscription error:', error.message);
    return res.status(500).json({ success: false, message: 'Failed to cancel subscription.' });
  }
};

// ─── Resume Subscription ───────────────────────────────────────────────────────

export const resumeSubscription = async (req, res) => {
  if (!isStripeConfigured) {
    return res.status(503).json({ success: false, message: 'Stripe not configured.' });
  }

  const userId = req.user.id;
  const sub = db.prepare('SELECT * FROM subscriptions WHERE user_id = ?').get(userId);

  if (!sub || !sub.stripe_subscription_id) {
    return res.status(400).json({ success: false, message: 'No subscription found.' });
  }

  if (!sub.cancel_at_period_end) {
    return res.status(400).json({ success: false, message: 'Subscription is not set to cancel.' });
  }

  try {
    await stripe.subscriptions.update(sub.stripe_subscription_id, {
      cancel_at_period_end: false,
    });

    db.prepare('UPDATE subscriptions SET cancel_at_period_end = 0 WHERE user_id = ?').run(userId);

    return res.json({ success: true, message: 'Subscription resumed successfully.' });
  } catch (error) {
    console.error('Resume subscription error:', error.message);
    return res.status(500).json({ success: false, message: 'Failed to resume subscription.' });
  }
};
