import { Router } from 'express';
import {
  createCheckoutSession,
  handleWebhook,
  getSubscription,
  cancelSubscription,
  resumeSubscription,
} from '../controllers/billingController.js';
import protect from '../middleware/auth.js';

const router = Router();

// Stripe webhook (no auth - uses Stripe signature verification)
// Note: raw body parsing is handled in server.js before JSON parser
router.post('/webhook', handleWebhook);

// Protected billing routes
router.post('/checkout', protect, createCheckoutSession);
router.get('/subscription', protect, getSubscription);
router.post('/cancel', protect, cancelSubscription);
router.post('/resume', protect, resumeSubscription);

export default router;
