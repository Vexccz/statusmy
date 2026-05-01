import Monitor from '../models/Monitor.js';
import Check from '../models/Check.js';
import db from '../config/db.js';

/**
 * GET /api/dashboard/stats
 * Get dashboard statistics for the authenticated user
 */
export const getDashboardStats = (req, res) => {
  try {
    const monitors = Monitor.findByUserId(req.user.id);
    const totalMonitors = monitors.length;

    let monitorsUp = 0;
    let monitorsDown = 0;
    let monitorsDegraded = 0;
    let totalResponseTime = 0;
    let responseTimeCount = 0;
    let totalUptime = 0;

    for (const monitor of monitors) {
      const latestCheck = Check.getLatestByMonitorId(monitor.id);
      const uptime = Check.getUptimePercentage(monitor.id, 30);
      const avgTime = Check.getAverageResponseTime(monitor.id, 24);

      totalUptime += uptime;

      if (avgTime > 0) {
        totalResponseTime += avgTime;
        responseTimeCount++;
      }

      if (!latestCheck || latestCheck.status === 'up') {
        monitorsUp++;
      } else if (latestCheck.status === 'down') {
        monitorsDown++;
      } else {
        monitorsDegraded++;
      }
    }

    // Count active incidents
    const activeIncidents = db.prepare(
      `SELECT COUNT(*) as count FROM incidents WHERE user_id = ? AND status != 'resolved'`
    ).get(req.user.id);

    res.json({
      success: true,
      data: {
        totalMonitors,
        monitorsUp,
        monitorsDown,
        monitorsDegraded,
        avgResponseTime: responseTimeCount > 0 ? Math.round(totalResponseTime / responseTimeCount) : 0,
        overallUptime: totalMonitors > 0 ? Math.round((totalUptime / totalMonitors) * 100) / 100 : 100,
        activeIncidents: activeIncidents ? activeIncidents.count : 0,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export default {
  getDashboardStats,
};
