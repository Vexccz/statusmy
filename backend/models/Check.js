import db from '../config/db.js';

// Prepared statements
const stmtCreate = db.prepare(`
  INSERT INTO checks (monitor_id, status, response_time_ms, status_code, error_message, error_body, region)
  VALUES (@monitor_id, @status, @response_time_ms, @status_code, @error_message, @error_body, @region)
`);

/**
 * Create a new check record
 */
export function create({ monitorId, status, responseTimeMs, statusCode, errorMessage, errorBody, region }) {
  const result = stmtCreate.run({
    monitor_id: monitorId,
    status,
    response_time_ms: responseTimeMs,
    status_code: statusCode || null,
    error_message: errorMessage || null,
    error_body: errorBody || null,
    region: region || 'asia',
  });
  return db.prepare('SELECT * FROM checks WHERE id = ?').get(result.lastInsertRowid);
}

/**
 * Find checks by monitor ID (latest first)
 */
export function findByMonitorId(monitorId, limit = 50) {
  return db.prepare(
    'SELECT * FROM checks WHERE monitor_id = ? ORDER BY checked_at DESC LIMIT ?'
  ).all(monitorId, limit);
}

/**
 * Get the latest check for a monitor
 */
export function getLatestByMonitorId(monitorId) {
  return db.prepare(
    'SELECT * FROM checks WHERE monitor_id = ? ORDER BY checked_at DESC LIMIT 1'
  ).get(monitorId) || null;
}

/**
 * Calculate uptime percentage over N days
 */
export function getUptimePercentage(monitorId, days = 30) {
  const row = db.prepare(`
    SELECT
      COUNT(*) as total,
      SUM(CASE WHEN status = 'up' OR status = 'degraded' THEN 1 ELSE 0 END) as up_count
    FROM checks
    WHERE monitor_id = ?
      AND checked_at >= datetime('now', ?)
  `).get(monitorId, `-${days} days`);

  if (!row || row.total === 0) return 100; // No checks yet = assume 100%
  return Math.round((row.up_count / row.total) * 10000) / 100; // 2 decimal places
}

/**
 * Get average response time over N hours
 */
export function getAverageResponseTime(monitorId, hours = 24) {
  const row = db.prepare(`
    SELECT AVG(response_time_ms) as avg_time
    FROM checks
    WHERE monitor_id = ?
      AND checked_at >= datetime('now', ?)
      AND response_time_ms IS NOT NULL
  `).get(monitorId, `-${hours} hours`);

  return row && row.avg_time ? Math.round(row.avg_time) : 0;
}

/**
 * Get response time history for charts
 */
export function getResponseTimeHistory(monitorId, hours = 24) {
  return db.prepare(`
    SELECT response_time_ms, status, status_code, checked_at
    FROM checks
    WHERE monitor_id = ?
      AND checked_at >= datetime('now', ?)
    ORDER BY checked_at ASC
  `).all(monitorId, `-${hours} hours`);
}

/**
 * Delete old checks (cleanup for free plan)
 */
export function deleteOldChecks(monitorId, keepDays = 7) {
  return db.prepare(`
    DELETE FROM checks
    WHERE monitor_id = ?
      AND checked_at < datetime('now', ?)
  `).run(monitorId, `-${keepDays} days`);
}

export default {
  create,
  findByMonitorId,
  getLatestByMonitorId,
  getUptimePercentage,
  getAverageResponseTime,
  getResponseTimeHistory,
  deleteOldChecks,
};
