import { Router } from 'express';
import Monitor from '../models/Monitor.js';

const router = Router();

// Simple ping endpoint (public, no auth)
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'pong',
    timestamp: new Date().toISOString(),
  });
});

/**
 * POST /api/heartbeat/:token
 * Receive heartbeat ping from external cron jobs / services
 * Updates the monitor's last_heartbeat_at timestamp
 */
router.post('/:token', (req, res) => {
  try {
    const { token } = req.params;

    const monitor = Monitor.findByHeartbeatToken(token);
    if (!monitor) {
      return res.status(404).json({ success: false, message: 'Invalid heartbeat token' });
    }

    Monitor.recordHeartbeat(monitor.id);

    res.json({
      success: true,
      message: 'Heartbeat received',
      monitor: monitor.name,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * GET /api/heartbeat/:token
 * Also accept GET for simpler cron integrations (curl, wget)
 */
router.get('/:token', (req, res) => {
  try {
    const { token } = req.params;

    const monitor = Monitor.findByHeartbeatToken(token);
    if (!monitor) {
      return res.status(404).json({ success: false, message: 'Invalid heartbeat token' });
    }

    Monitor.recordHeartbeat(monitor.id);

    res.json({
      success: true,
      message: 'Heartbeat received',
      monitor: monitor.name,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
