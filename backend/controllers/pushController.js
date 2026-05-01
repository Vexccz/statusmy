import User from '../models/User.js';

/**
 * POST /api/user/push-subscribe
 * Store push subscription for the user
 */
export const pushSubscribe = (req, res) => {
  try {
    const { subscription } = req.body;

    if (!subscription) {
      return res.status(400).json({ success: false, message: 'Subscription object is required' });
    }

    const subStr = typeof subscription === 'string' ? subscription : JSON.stringify(subscription);
    User.updateById(req.user.id, { push_subscription: subStr });

    res.json({
      success: true,
      message: 'Push subscription stored successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export default {
  pushSubscribe,
};
