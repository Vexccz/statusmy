import db from '../config/db.js';

// Prepared statements
const stmtFindById = db.prepare('SELECT * FROM incidents WHERE id = ?');
const stmtFindByUserId = db.prepare('SELECT * FROM incidents WHERE user_id = ? ORDER BY created_at DESC');
const stmtFindByMonitorId = db.prepare('SELECT * FROM incidents WHERE monitor_id = ? ORDER BY created_at DESC');
const stmtCreate = db.prepare(`
  INSERT INTO incidents (monitor_id, user_id, title, description, severity)
  VALUES (@monitor_id, @user_id, @title, @description, @severity)
`);
const stmtCreateUpdate = db.prepare(`
  INSERT INTO incident_updates (incident_id, status, message)
  VALUES (@incident_id, @status, @message)
`);

/**
 * Find an incident by ID (with updates)
 */
export function findById(id) {
  const incident = stmtFindById.get(id);
  if (!incident) return null;

  incident.updates = db.prepare(
    'SELECT * FROM incident_updates WHERE incident_id = ? ORDER BY created_at ASC'
  ).all(id);

  return incident;
}

/**
 * Find incidents by user ID
 */
export function findByUserId(userId) {
  return stmtFindByUserId.all(userId);
}

/**
 * Find incidents by monitor ID
 */
export function findByMonitorId(monitorId) {
  return stmtFindByMonitorId.all(monitorId);
}

/**
 * Find active (unresolved) incident for a monitor
 */
export function findActiveByMonitorId(monitorId) {
  return db.prepare(
    `SELECT * FROM incidents WHERE monitor_id = ? AND status != 'resolved' ORDER BY created_at DESC LIMIT 1`
  ).get(monitorId) || null;
}

/**
 * Create a new incident
 */
export function create({ monitorId, userId, title, description = null, severity = 'minor' }) {
  const result = stmtCreate.run({
    monitor_id: monitorId || null,
    user_id: userId,
    title,
    description,
    severity,
  });

  const incident = findById(result.lastInsertRowid);

  // Create initial update
  stmtCreateUpdate.run({
    incident_id: incident.id,
    status: 'investigating',
    message: description || title,
  });

  return findById(incident.id);
}

/**
 * Update incident status and create an update entry
 */
export function updateStatus(id, status, message) {
  db.prepare(`UPDATE incidents SET status = ?, updated_at = datetime('now') WHERE id = ?`).run(status, id);

  stmtCreateUpdate.run({
    incident_id: id,
    status,
    message,
  });

  return findById(id);
}

/**
 * Resolve an incident
 */
export function resolve(id) {
  db.prepare(`
    UPDATE incidents SET status = 'resolved', resolved_at = datetime('now') WHERE id = ?
  `).run(id);

  stmtCreateUpdate.run({
    incident_id: id,
    status: 'resolved',
    message: 'Incident resolved',
  });

  return findById(id);
}

export default {
  findById,
  findByUserId,
  findByMonitorId,
  findActiveByMonitorId,
  create,
  updateStatus,
  resolve,
};
