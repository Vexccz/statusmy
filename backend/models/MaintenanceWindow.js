import db from '../config/db.js';

const stmtFindById = db.prepare('SELECT * FROM maintenance_windows WHERE id = ?');
const stmtFindByMonitorId = db.prepare('SELECT * FROM maintenance_windows WHERE monitor_id = ? ORDER BY start_at DESC');
const stmtCreate = db.prepare(`
  INSERT INTO maintenance_windows (monitor_id, start_at, end_at, reason, active)
  VALUES (@monitor_id, @start_at, @end_at, @reason, @active)
`);
const stmtDeleteById = db.prepare('DELETE FROM maintenance_windows WHERE id = ?');

export function findById(id) {
  return stmtFindById.get(id) || null;
}

export function findByMonitorId(monitorId) {
  return stmtFindByMonitorId.all(monitorId);
}

export function create({ monitorId, startAt, endAt, reason }) {
  const result = stmtCreate.run({
    monitor_id: monitorId,
    start_at: startAt,
    end_at: endAt,
    reason: reason || null,
    active: 1,
  });
  return findById(result.lastInsertRowid);
}

export function updateById(id, fields) {
  const allowedFields = ['start_at', 'end_at', 'reason', 'active'];
  const updates = [];
  const values = {};

  for (const [key, value] of Object.entries(fields)) {
    if (allowedFields.includes(key) && value !== undefined) {
      updates.push(`${key} = @${key}`);
      values[key] = value;
    }
  }

  if (updates.length === 0) return findById(id);

  values.id = id;
  const sql = `UPDATE maintenance_windows SET ${updates.join(', ')} WHERE id = @id`;
  db.prepare(sql).run(values);
  return findById(id);
}

export function deleteById(id) {
  return stmtDeleteById.run(id);
}

/**
 * Check if a monitor is currently in a maintenance window
 */
export function isInMaintenance(monitorId) {
  const row = db.prepare(`
    SELECT * FROM maintenance_windows
    WHERE monitor_id = ? AND active = 1
      AND datetime('now') >= datetime(start_at)
      AND datetime('now') <= datetime(end_at)
    LIMIT 1
  `).get(monitorId);
  return row || null;
}

export default {
  findById,
  findByMonitorId,
  create,
  updateById,
  deleteById,
  isInMaintenance,
};
