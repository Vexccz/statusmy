import EscalationRule from '../models/EscalationRule.js';

/**
 * GET /api/alerts/escalation
 */
export const getEscalationRules = (req, res) => {
  try {
    const rules = EscalationRule.findAll();
    res.json({ success: true, data: rules });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * POST /api/alerts/escalation
 */
export const createEscalationRule = (req, res) => {
  try {
    const { delayMinutes, notifyChannelId, priority } = req.body;

    const rule = EscalationRule.create({
      userId: req.user.id,
      delayMinutes: delayMinutes || 5,
      notifyChannelId: notifyChannelId || null,
      priority: priority || 1,
    });

    res.status(201).json({ success: true, data: rule });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * PUT /api/alerts/escalation/:id
 */
export const updateEscalationRule = (req, res) => {
  try {
    const rule = EscalationRule.findById(req.params.id);
    if (!rule) {
      return res.status(404).json({ success: false, message: 'Rule not found' });
    }

    const { delayMinutes, notifyChannelId, priority } = req.body;
    const updated = EscalationRule.updateById(rule.id, {
      delay_minutes: delayMinutes,
      notify_channel_id: notifyChannelId,
      priority,
    });

    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * DELETE /api/alerts/escalation/:id
 */
export const deleteEscalationRule = (req, res) => {
  try {
    const rule = EscalationRule.findById(req.params.id);
    if (!rule) {
      return res.status(404).json({ success: false, message: 'Rule not found' });
    }

    EscalationRule.deleteById(rule.id);
    res.json({ success: true, message: 'Rule deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export default {
  getEscalationRules,
  createEscalationRule,
  updateEscalationRule,
  deleteEscalationRule,
};
