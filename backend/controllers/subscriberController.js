import Subscriber from '../models/Subscriber.js';

/**
 * POST /api/status/subscribe
 * Public endpoint - subscribe email to status updates
 */
export const subscribe = (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !email.includes('@')) {
      return res.status(400).json({ success: false, message: 'Valid email is required' });
    }

    const subscriber = Subscriber.create({ email });
    res.status(201).json({
      success: true,
      message: 'Subscribed successfully',
      data: { id: subscriber.id, email: subscriber.email },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * POST /api/status/unsubscribe
 * Public endpoint - unsubscribe by token
 */
export const unsubscribe = (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ success: false, message: 'Token is required' });
    }

    const subscriber = Subscriber.findByToken(token);
    if (!subscriber) {
      return res.status(404).json({ success: false, message: 'Subscriber not found' });
    }

    Subscriber.deleteById(subscriber.id);
    res.json({ success: true, message: 'Unsubscribed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export default {
  subscribe,
  unsubscribe,
};
