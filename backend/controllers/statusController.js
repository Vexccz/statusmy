import db from '../config/db.js';
import Monitor from '../models/Monitor.js';
import Check from '../models/Check.js';
import Incident from '../models/Incident.js';

/**
 * GET /api/status
 * Public endpoint — returns all monitors with latest status + active incidents
 */
export const getPublicStatus = (req, res) => {
  try {
    // Get all active monitors (public — no user filter)
    const monitors = db.prepare('SELECT id, name, url, type, created_at FROM monitors WHERE active = 1 ORDER BY name ASC').all();

    // Enrich each monitor with latest check, uptime, response time
    const enrichedMonitors = monitors.map((monitor) => {
      const latestCheck = Check.getLatestByMonitorId(monitor.id);
      const uptimePercentage = Check.getUptimePercentage(monitor.id, 30);
      const avgResponseTime = Check.getAverageResponseTime(monitor.id, 24);

      return {
        id: monitor.id,
        name: monitor.name,
        type: monitor.type,
        status: latestCheck?.status || 'up',
        uptimePercentage,
        responseTime: avgResponseTime,
        lastChecked: latestCheck?.checked_at || null,
      };
    });

    // Get active incidents (not resolved)
    const activeIncidents = db.prepare(`
      SELECT i.*, m.name as monitor_name
      FROM incidents i
      LEFT JOIN monitors m ON i.monitor_id = m.id
      WHERE i.status != 'resolved'
      ORDER BY i.created_at DESC
    `).all();

    // Enrich incidents with updates
    const enrichedIncidents = activeIncidents.map((incident) => {
      const updates = db.prepare(
        'SELECT * FROM incident_updates WHERE incident_id = ? ORDER BY created_at ASC'
      ).all(incident.id);
      return { ...incident, updates };
    });

    // Get past incidents (resolved in last 7 days)
    const pastIncidents = db.prepare(`
      SELECT i.*, m.name as monitor_name
      FROM incidents i
      LEFT JOIN monitors m ON i.monitor_id = m.id
      WHERE i.status = 'resolved'
        AND i.resolved_at >= datetime('now', '-7 days')
      ORDER BY i.resolved_at DESC
    `).all();

    const enrichedPastIncidents = pastIncidents.map((incident) => {
      const updates = db.prepare(
        'SELECT * FROM incident_updates WHERE incident_id = ? ORDER BY created_at ASC'
      ).all(incident.id);
      return { ...incident, updates };
    });

    res.json({
      success: true,
      data: {
        monitors: enrichedMonitors,
        activeIncidents: enrichedIncidents,
        pastIncidents: enrichedPastIncidents,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * GET /api/status/history/:monitorId
 * Public endpoint — returns last 90 days uptime data for a specific monitor
 */
export const getMonitorHistory = (req, res) => {
  try {
    const { monitorId } = req.params;

    // Verify monitor exists and is active
    const monitor = db.prepare('SELECT id, name FROM monitors WHERE id = ? AND active = 1').get(monitorId);
    if (!monitor) {
      return res.status(404).json({ success: false, message: 'Monitor not found' });
    }

    // Get daily aggregated data for last 90 days
    const history = db.prepare(`
      SELECT
        date(checked_at) as date,
        COUNT(*) as total_checks,
        SUM(CASE WHEN status = 'up' THEN 1 ELSE 0 END) as up_checks,
        SUM(CASE WHEN status = 'down' THEN 1 ELSE 0 END) as down_checks,
        SUM(CASE WHEN status = 'degraded' THEN 1 ELSE 0 END) as degraded_checks,
        ROUND(AVG(response_time_ms)) as avg_response_time
      FROM checks
      WHERE monitor_id = ?
        AND checked_at >= datetime('now', '-90 days')
      GROUP BY date(checked_at)
      ORDER BY date ASC
    `).all(monitorId);

    res.json({
      success: true,
      data: {
        monitor: { id: monitor.id, name: monitor.name },
        history,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export default {
  getPublicStatus,
  getMonitorHistory,
};
