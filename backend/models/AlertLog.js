import db from '../config/db.js';

// Prepared statements
const stmtCreate = db.prepare(`
  INSERT INTO alert_log (monitor_id, channel_id, type, message, success, error_message)
  VALUES (@monitor_id, @channel_id, @type, @message, @success, @error_message)
`);

/**
 * Create a new alert log entry
 */
export function create({ monitorId, channelId, type, message, success = 1, errorMessage = null }) {
  const result = stmtCreate.run({
    monitor_id: monitorId || null,
    channel_id: channelId || null,
    type,
    message,
    success: success ? 1 : 0,
    error_message: errorMessage || null,
  });
  return db.prepare('SELECT * FROM alert_log WHERE id = ?').get(result.lastInsertRowid);
}

/**
 * Find alert logs by user ID (join with monitors and channels)
 */
export function findByUserId(userId, limit = 50) {
  return db.prepare(`
    SELECT
      al.*,
      m.name as monitor_name,
      m.url as monitor_url,
      ac.name as channel_name,
      ac.type as channel_type
    FROM alert_log al
    LEFT JOIN monitors m ON al.monitor_id = m.id
    LEFT JOIN alert_channels ac ON al.channel_id = ac.id
    WHERE m.user_id = ? OR ac.user_id = ?
    ORDER BY al.sent_at DESC
    LIMIT ?
  `).all(userId, userId, limit);
}

/**
 * Find alert logs by monitor ID
 */
export function findByMonitorId(monitorId, limit = 20) {
  return db.prepare(`
    SELECT
      al.*,
      m.name as monitor_name,
      m.url as monitor_url,
      ac.name as channel_name,
      ac.type as channel_type
    FROM alert_log al
    LEFT JOIN monitors m ON al.monitor_id = m.id
    LEFT JOIN alert_channels ac ON al.channel_id = ac.id
    WHERE al.monitor_id = ?
    ORDER BY al.sent_at DESC
    LIMIT ?
  `).all(monitorId, limit);
}

export default {
  create,
  findByUserId,
  findByMonitorId,
};
