import db from '../config/db.js';

const stmtFindById = db.prepare('SELECT * FROM escalation_rules WHERE id = ?');
const stmtFindAll = db.prepare('SELECT * FROM escalation_rules ORDER BY priority ASC');
const stmtCreate = db.prepare(`
  INSERT INTO escalation_rules (user_id, delay_minutes, notify_channel_id, priority)
  VALUES (@user_id, @delay_minutes, @notify_channel_id, @priority)
`);
const stmtDeleteById = db.prepare('DELETE FROM escalation_rules WHERE id = ?');

export function findById(id) {
  return stmtFindById.get(id) || null;
}

export function findAll() {
  return stmtFindAll.all();
}

export function create({ userId, delayMinutes, notifyChannelId, priority }) {
  const result = stmtCreate.run({
    user_id: userId,
    delay_minutes: delayMinutes || 5,
    notify_channel_id: notifyChannelId || null,
    priority: priority || 1,
  });
  return findById(result.lastInsertRowid);
}

export function updateById(id, fields) {
  const allowedFields = ['delay_minutes', 'notify_channel_id', 'priority'];
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
  const sql = `UPDATE escalation_rules SET ${updates.join(', ')} WHERE id = @id`;
  db.prepare(sql).run(values);
  return findById(id);
}

export function deleteById(id) {
  return stmtDeleteById.run(id);
}

export default {
  findById,
  findAll,
  create,
  updateById,
  deleteById,
};
