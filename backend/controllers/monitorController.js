import Monitor from '../models/Monitor.js';
import Check from '../models/Check.js';
import { getLatestSSLCheck, getSSLHistory, checkSSL, saveSSLCheck } from '../services/sslChecker.js';
import { getIO } from '../socket.js';

// Plan limits for monitor count
const PLAN_LIMITS = {
  free: 3,
  team: 20,
  business: Infinity,
};

/**
 * GET /api/monitors
 * List all monitors for the authenticated user with latest check status
 */
export const getMonitors = (req, res) => {
  try {
    const monitors = Monitor.findByUserId(req.user.id);

    // Attach latest check to each monitor
    const monitorsWithStatus = monitors.map((monitor) => {
      const latestCheck = Check.getLatestByMonitorId(monitor.id);
      const uptime = Check.getUptimePercentage(monitor.id, 30);
      return {
        ...monitor,
        latestCheck,
        uptime,
      };
    });

    res.json({
      success: true,
      data: monitorsWithStatus,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * GET /api/monitors/:id
 * Get a single monitor with recent checks
 */
export const getMonitor = (req, res) => {
  try {
    const monitor = Monitor.findById(req.params.id);

    if (!monitor) {
      return res.status(404).json({ success: false, message: 'Monitor not found' });
    }

    if (monitor.user_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const recentChecks = Check.findByMonitorId(monitor.id, 20);
    const uptime = Check.getUptimePercentage(monitor.id, 30);
    const avgResponseTime = Check.getAverageResponseTime(monitor.id, 24);

    res.json({
      success: true,
      data: {
        ...monitor,
        recentChecks,
        uptime,
        avgResponseTime,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * POST /api/monitors
 * Create a new monitor (with plan limit check)
 */
export const createMonitor = (req, res) => {
  try {
    const { name, url, type, intervalSeconds, timeoutMs, method, expectedStatus, keyword, keywordType, responseTimeThresholdMs } = req.body;

    // Check plan limits
    const currentCount = Monitor.countByUserId(req.user.id);
    const plan = req.user.plan || 'free';
    const limit = PLAN_LIMITS[plan] || PLAN_LIMITS.free;

    if (currentCount >= limit) {
      return res.status(403).json({
        success: false,
        message: `Monitor limit reached for ${plan} plan (${limit} monitors). Upgrade to add more.`,
      });
    }

    const monitor = Monitor.create({
      userId: req.user.id,
      name,
      url,
      type,
      intervalSeconds,
      timeoutMs,
      method,
      expectedStatus,
      keyword,
      keywordType,
      responseTimeThresholdMs,
    });

    // Emit socket event
    const io = getIO();
    if (io) {
      io.to(`user:${req.user.id}`).emit('monitor:created', monitor);
    }

    res.status(201).json({
      success: true,
      data: monitor,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * PUT /api/monitors/:id
 * Update a monitor (verify ownership)
 */
export const updateMonitor = (req, res) => {
  try {
    const monitor = Monitor.findById(req.params.id);

    if (!monitor) {
      return res.status(404).json({ success: false, message: 'Monitor not found' });
    }

    if (monitor.user_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    // Map camelCase body to snake_case DB fields
    const fields = {};
    if (req.body.name !== undefined) fields.name = req.body.name;
    if (req.body.url !== undefined) fields.url = req.body.url;
    if (req.body.type !== undefined) fields.type = req.body.type;
    if (req.body.intervalSeconds !== undefined) fields.interval_seconds = req.body.intervalSeconds;
    if (req.body.timeoutMs !== undefined) fields.timeout_ms = req.body.timeoutMs;
    if (req.body.method !== undefined) fields.method = req.body.method;
    if (req.body.expectedStatus !== undefined) fields.expected_status = req.body.expectedStatus;
    if (req.body.active !== undefined) fields.active = req.body.active ? 1 : 0;
    if (req.body.keyword !== undefined) fields.keyword = req.body.keyword;
    if (req.body.keywordType !== undefined) fields.keyword_type = req.body.keywordType;
    if (req.body.responseTimeThresholdMs !== undefined) fields.response_time_threshold_ms = req.body.responseTimeThresholdMs;

    const updated = Monitor.updateById(monitor.id, fields);

    // Emit socket event
    const io = getIO();
    if (io) {
      io.to(`user:${req.user.id}`).emit('monitor:updated', updated);
    }

    res.json({
      success: true,
      data: updated,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * DELETE /api/monitors/:id
 * Delete a monitor (verify ownership)
 */
export const deleteMonitor = (req, res) => {
  try {
    const monitor = Monitor.findById(req.params.id);

    if (!monitor) {
      return res.status(404).json({ success: false, message: 'Monitor not found' });
    }

    if (monitor.user_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    Monitor.deleteById(monitor.id);

    // Emit socket event
    const io = getIO();
    if (io) {
      io.to(`user:${req.user.id}`).emit('monitor:deleted', { id: monitor.id });
    }

    res.json({
      success: true,
      message: 'Monitor deleted',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * GET /api/monitors/:id/checks
 * Get check history for a monitor
 */
export const getMonitorChecks = (req, res) => {
  try {
    const monitor = Monitor.findById(req.params.id);

    if (!monitor) {
      return res.status(404).json({ success: false, message: 'Monitor not found' });
    }

    if (monitor.user_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const limit = parseInt(req.query.limit) || 50;
    const checks = Check.findByMonitorId(monitor.id, Math.min(limit, 200));

    res.json({
      success: true,
      data: checks,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * GET /api/monitors/:id/stats
 * Get uptime %, avg response time, response time history
 */
export const getMonitorStats = (req, res) => {
  try {
    const monitor = Monitor.findById(req.params.id);

    if (!monitor) {
      return res.status(404).json({ success: false, message: 'Monitor not found' });
    }

    if (monitor.user_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const days = parseInt(req.query.days) || 30;
    const hours = parseInt(req.query.hours) || 24;

    const uptime = Check.getUptimePercentage(monitor.id, days);
    const avgResponseTime = Check.getAverageResponseTime(monitor.id, hours);
    const responseTimeHistory = Check.getResponseTimeHistory(monitor.id, hours);

    res.json({
      success: true,
      data: {
        uptime,
        avgResponseTime,
        responseTimeHistory,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * GET /api/monitors/:id/ssl
 * Get SSL certificate info for a monitor
 */
export const getMonitorSSL = async (req, res) => {
  try {
    const monitor = Monitor.findById(req.params.id);

    if (!monitor) {
      return res.status(404).json({ success: false, message: 'Monitor not found' });
    }

    if (monitor.user_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    if (!monitor.url || !monitor.url.startsWith('https://')) {
      return res.status(400).json({ success: false, message: 'Monitor URL is not HTTPS' });
    }

    // Get latest cached SSL check
    let latest = getLatestSSLCheck(monitor.id);

    // If no cached check or older than 1 hour, run a fresh check
    if (!latest || (Date.now() - new Date(latest.checked_at + 'Z').getTime()) > 3600000) {
      const result = await checkSSL(monitor.url);
      saveSSLCheck(monitor.id, result);
      latest = getLatestSSLCheck(monitor.id);
    }

    const history = getSSLHistory(monitor.id, 10);

    res.json({
      success: true,
      data: {
        current: latest,
        history,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export default {
  getMonitors,
  getMonitor,
  createMonitor,
  updateMonitor,
  deleteMonitor,
  getMonitorChecks,
  getMonitorStats,
  getMonitorSSL,
};
