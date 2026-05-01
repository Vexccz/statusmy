import db from '../config/db.js';

const stmtFindByUserId = db.prepare('SELECT * FROM on_call_schedules WHERE user_id = ? ORDER BY day_of_week, start_time');
const stmtFindById = db.prepare('SELECT * FROM on_call_schedules WHERE id = ?');
const stmtCreate = db.prepare(`
  INSERT INTO on_call_schedules (user_id, day_of_week, start_time, end_time, active)
  VALUES (@user_id, @day_of_week, @start_time, @end_time, @active)
`);
const stmtDeleteById = db.prepare('DELETE FROM on_call_schedules WHERE id = ?');
const stmtFindAll = db.prepare('SELECT * FROM on_call_schedules WHERE active = 1 ORDER BY day_of_week, start_time');

export function findById(id) {
  return stmtFindById.get(id) || null;
}

export function findByUserId(userId) {
  return stmtFindByUserId.all(userId);
}

export function findAll() {
  return stmtFindAll.all();
}

export function create({ userId, dayOfWeek, startTime, endTime }) {
  const result = stmtCreate.run({
    user_id: userId,
    day_of_week: dayOfWeek,
    start_time: startTime,
    end_time: endTime,
    active: 1,
  });
  return findById(result.lastInsertRowid);
}

export function updateById(id, fields) {
  const allowedFields = ['day_of_week', 'start_time', 'end_time', 'active'];
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
  const sql = `UPDATE on_call_schedules SET ${updates.join(', ')} WHERE id = @id`;
  db.prepare(sql).run(values);
  return findById(id);
}

export function deleteById(id) {
  return stmtDeleteById.run(id);
}

/**
 * Get the user who is currently on-call
 */
export function getCurrentOnCall() {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0=Sunday
  const currentTime = now.toTimeString().slice(0, 5); // HH:MM

  const row = db.prepare(`
    SELECT * FROM on_call_schedules
    WHERE active = 1 AND day_of_week = ? AND start_time <= ? AND end_time >= ?
    LIMIT 1
  `).get(dayOfWeek, currentTime, currentTime);

  return row || null;
}

export default {
  findById,
  findByUserId,
  findAll,
  create,
  updateById,
  deleteById,
  getCurrentOnCall,
};
