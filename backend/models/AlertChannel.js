import db from '../config/db.js';

// Prepared statements
const stmtFindByUserId = db.prepare('SELECT * FROM alert_channels WHERE user_id = ? ORDER BY created_at DESC');
const stmtFindById = db.prepare('SELECT * FROM alert_channels WHERE id = ?');
const stmtCreate = db.prepare(`
  INSERT INTO alert_channels (user_id, type, name, config, active)
  VALUES (@user_id, @type, @name, @config, @active)
`);
const stmtDeleteById = db.prepare('DELETE FROM alert_channels WHERE id = ?');
const stmtGetActiveByUserId = db.prepare('SELECT * FROM alert_channels WHERE user_id = ? AND active = 1 ORDER BY created_at DESC');

/**
 * Find all alert channels for a user
 */
export function findByUserId(userId) {
  return stmtFindByUserId.all(userId);
}

/**
 * Find an alert channel by ID
 */
export function findById(id) {
  return stmtFindById.get(id) || null;
}

/**
 * Create a new alert channel
 */
export function create({ userId, type, name, config }) {
  const configStr = typeof config === 'string' ? config : JSON.stringify(config);
  const result = stmtCreate.run({
    user_id: userId,
    type,
    name,
    config: configStr,
    active: 1,
  });
  return findById(result.lastInsertRowid);
}

/**
 * Update an alert channel by ID
 */
export function updateById(id, fields) {
  const allowedFields = ['name', 'type', 'config', 'active'];
  const updates = [];
  const values = {};

  for (const [key, value] of Object.entries(fields)) {
    if (allowedFields.includes(key) && value !== undefined) {
      if (key === 'config' && typeof value === 'object') {
        updates.push(`${key} = @${key}`);
        values[key] = JSON.stringify(value);
      } else {
        updates.push(`${key} = @${key}`);
        values[key] = value;
      }
    }
  }

  if (updates.length === 0) return findById(id);

  values.id = id;
  const sql = `UPDATE alert_channels SET ${updates.join(', ')} WHERE id = @id`;
  db.prepare(sql).run(values);

  return findById(id);
}

/**
 * Delete an alert channel by ID
 */
export function deleteById(id) {
  return stmtDeleteById.run(id);
}

/**
 * Get only active alert channels for a user
 */
export function getActiveByUserId(userId) {
  return stmtGetActiveByUserId.all(userId);
}

export default {
  findByUserId,
  findById,
  create,
  updateById,
  deleteById,
  getActiveByUserId,
};
