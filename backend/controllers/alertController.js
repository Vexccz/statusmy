import AlertChannel from '../models/AlertChannel.js';
import AlertLog from '../models/AlertLog.js';
import { sendTestAlert } from '../services/alerter.js';

/**
 * GET /api/alerts/channels
 * List all alert channels for the authenticated user
 */
export const getChannels = (req, res) => {
  try {
    const channels = AlertChannel.findByUserId(req.user.id);

    // Parse config JSON for each channel
    const parsed = channels.map((ch) => ({
      ...ch,
      config: typeof ch.config === 'string' ? JSON.parse(ch.config) : ch.config,
    }));

    res.json({ success: true, data: parsed });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * POST /api/alerts/channels
 * Create a new alert channel
 */
export const createChannel = (req, res) => {
  try {
    const { type, name, config } = req.body;

    const channel = AlertChannel.create({
      userId: req.user.id,
      type,
      name,
      config,
    });

    res.status(201).json({
      success: true,
      data: {
        ...channel,
        config: typeof channel.config === 'string' ? JSON.parse(channel.config) : channel.config,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * PUT /api/alerts/channels/:id
 * Update an alert channel
 */
export const updateChannel = (req, res) => {
  try {
    const channel = AlertChannel.findById(req.params.id);

    if (!channel) {
      return res.status(404).json({ success: false, message: 'Alert channel not found' });
    }

    if (channel.user_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const updated = AlertChannel.updateById(req.params.id, req.body);

    res.json({
      success: true,
      data: {
        ...updated,
        config: typeof updated.config === 'string' ? JSON.parse(updated.config) : updated.config,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * DELETE /api/alerts/channels/:id
 * Delete an alert channel
 */
export const deleteChannel = (req, res) => {
  try {
    const channel = AlertChannel.findById(req.params.id);

    if (!channel) {
      return res.status(404).json({ success: false, message: 'Alert channel not found' });
    }

    if (channel.user_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    AlertChannel.deleteById(req.params.id);

    res.json({ success: true, message: 'Alert channel deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * POST /api/alerts/channels/:id/test
 * Send a test alert through a channel
 */
export const testChannel = async (req, res) => {
  try {
    const channel = AlertChannel.findById(req.params.id);

    if (!channel) {
      return res.status(404).json({ success: false, message: 'Alert channel not found' });
    }

    if (channel.user_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    await sendTestAlert(channel);

    res.json({ success: true, message: 'Test alert sent successfully' });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Test alert failed: ${error.message}`,
    });
  }
};

/**
 * GET /api/alerts/log
 * Get alert log for the authenticated user
 */
export const getAlertLog = (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const logs = AlertLog.findByUserId(req.user.id, Math.min(limit, 200));

    res.json({ success: true, data: logs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
