import db from '../config/db.js';
import crypto from 'crypto';

// Prepared statements
const stmtFindById = db.prepare('SELECT * FROM monitors WHERE id = ?');
const stmtFindByUserId = db.prepare('SELECT * FROM monitors WHERE user_id = ? ORDER BY created_at DESC');
const stmtCreate = db.prepare(`
  INSERT INTO monitors (user_id, name, url, type, interval_seconds, timeout_ms, method, expected_status, keyword, keyword_type, heartbeat_token, response_time_threshold_ms)
  VALUES (@user_id, @name, @url, @type, @interval_seconds, @timeout_ms, @method, @expected_status, @keyword, @keyword_type, @heartbeat_token, @response_time_threshold_ms)
`);
const stmtDeleteById = db.prepare('DELETE FROM monitors WHERE id = ?');
const stmtCountByUserId = db.prepare('SELECT COUNT(*) as count FROM monitors WHERE user_id = ?');
const stmtFindAllActive = db.prepare('SELECT * FROM monitors WHERE active = 1');
const stmtFindByHeartbeatToken = db.prepare('SELECT * FROM monitors WHERE heartbeat_token = ?');

/**
 * Find a monitor by ID
 */
export function findById(id) {
  return stmtFindById.get(id) || null;
}

/**
 * Find all monitors for a user
 */
export function findByUserId(userId) {
  return stmtFindByUserId.all(userId);
}

/**
 * Find all active monitors (for scheduler)
 */
export function findAllActive() {
  return stmtFindAllActive.all();
}

/**
 * Find a monitor by heartbeat token
 */
export function findByHeartbeatToken(token) {
  return stmtFindByHeartbeatToken.get(token) || null;
}

/**
 * Create a new monitor
 */
export function create({ userId, name, url, type = 'http', intervalSeconds = 300, timeoutMs = 10000, method = 'GET', expectedStatus = 200, keyword = null, keywordType = 'contains', responseTimeThresholdMs = null }) {
  // Generate heartbeat token if type is heartbeat
  const heartbeatToken = type === 'heartbeat' ? crypto.randomUUID() : null;

  const result = stmtCreate.run({
    user_id: userId,
    name,
    url,
    type,
    interval_seconds: intervalSeconds,
    timeout_ms: timeoutMs,
    method,
    expected_status: expectedStatus,
    keyword: keyword || null,
    keyword_type: keywordType || 'contains',
    heartbeat_token: heartbeatToken,
    response_time_threshold_ms: responseTimeThresholdMs || null,
  });
  return findById(result.lastInsertRowid);
}

/**
 * Update a monitor by ID with given fields
 */
export function updateById(id, fields) {
  const allowedFields = ['name', 'url', 'type', 'interval_seconds', 'timeout_ms', 'method', 'expected_status', 'active', 'keyword', 'keyword_type', 'last_heartbeat_at', 'response_time_threshold_ms', 'check_regions'];
  const updates = [];
  const values = {};

  for (const [key, value] of Object.entries(fields)) {
    if (allowedFields.includes(key) && value !== undefined) {
      updates.push(`${key} = @${key}`);
      values[key] = value;
    }
  }

  if (updates.length === 0) return findById(id);

  updates.push(`updated_at = datetime('now')`);
  values.id = id;
  const sql = `UPDATE monitors SET ${updates.join(', ')} WHERE id = @id`;
  db.prepare(sql).run(values);

  return findById(id);
}

/**
 * Record heartbeat ping (update last_heartbeat_at)
 */
export function recordHeartbeat(id) {
  db.prepare(`UPDATE monitors SET last_heartbeat_at = datetime('now'), updated_at = datetime('now') WHERE id = ?`).run(id);
  return findById(id);
}

/**
 * Delete a monitor by ID
 */
export function deleteById(id) {
  return stmtDeleteById.run(id);
}

/**
 * Count monitors for a user (for plan limits)
 */
export function countByUserId(userId) {
  const row = stmtCountByUserId.get(userId);
  return row ? row.count : 0;
}

export default {
  findById,
  findByUserId,
  findAllActive,
  findByHeartbeatToken,
  create,
  updateById,
  recordHeartbeat,
  deleteById,
  countByUserId,
};
