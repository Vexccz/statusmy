import db from '../config/db.js';
import Monitor from '../models/Monitor.js';
import Check from '../models/Check.js';

/**
 * GET /api/reports/sla?period=30d
 * Returns per-monitor uptime %, total downtime minutes, incidents count, avg response time
 */
export const getSLAReport = (req, res) => {
  try {
    const periodStr = req.query.period || '30d';
    const days = parseInt(periodStr) || 30;

    const monitors = Monitor.findByUserId(req.user.id);

    const report = monitors.map((monitor) => {
      // Get checks within period
      const checksData = db.prepare(`
        SELECT
          COUNT(*) as total_checks,
          SUM(CASE WHEN status = 'up' OR status = 'degraded' THEN 1 ELSE 0 END) as up_checks,
          SUM(CASE WHEN status = 'down' THEN 1 ELSE 0 END) as down_checks,
          AVG(CASE WHEN response_time_ms IS NOT NULL THEN response_time_ms END) as avg_response_time
        FROM checks
        WHERE monitor_id = ? AND checked_at >= datetime('now', ?)
      `).get(monitor.id, `-${days} days`);

      // Count incidents in period
      const incidentData = db.prepare(`
        SELECT COUNT(*) as incident_count
        FROM incidents
        WHERE monitor_id = ? AND created_at >= datetime('now', ?)
      `).get(monitor.id, `-${days} days`);

      const totalChecks = checksData?.total_checks || 0;
      const upChecks = checksData?.up_checks || 0;
      const downChecks = checksData?.down_checks || 0;
      const uptimePercentage = totalChecks > 0 ? Math.round((upChecks / totalChecks) * 10000) / 100 : 100;

      // Estimate downtime: down_checks * interval_seconds / 60
      const downtimeMinutes = Math.round((downChecks * (monitor.interval_seconds || 300)) / 60);

      return {
        monitor_id: monitor.id,
        monitor_name: monitor.name,
        monitor_url: monitor.url,
        uptime_percentage: uptimePercentage,
        total_downtime_minutes: downtimeMinutes,
        incidents_count: incidentData?.incident_count || 0,
        avg_response_time: Math.round(checksData?.avg_response_time || 0),
        total_checks: totalChecks,
        period_days: days,
      };
    });

    res.json({ success: true, data: report });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export default {
  getSLAReport,
};
