import bcrypt from 'bcryptjs';
import db from '../config/db.js';

// Ensure phone column exists
try {
  db.prepare('ALTER TABLE users ADD COLUMN phone TEXT').run();
} catch (e) {
  // Column already exists, ignore
}

// Prepared statements for performance
const stmtFindByEmail = db.prepare('SELECT * FROM users WHERE email = ?');
const stmtFindById = db.prepare('SELECT * FROM users WHERE id = ?');
const stmtFindByPhone = db.prepare('SELECT * FROM users WHERE phone = ?');
const stmtCreate = db.prepare(
  'INSERT INTO users (name, email, password, plan, phone) VALUES (@name, @email, @password, @plan, @phone)'
);

/**
 * Find a user by email
 */
export function findByEmail(email) {
  return stmtFindByEmail.get(email.toLowerCase()) || null;
}

/**
 * Find a user by phone
 */
export function findByPhone(phone) {
  return stmtFindByPhone.get(phone) || null;
}

/**
 * Find a user by ID
 */
export function findById(id) {
  return stmtFindById.get(id) || null;
}

/**
 * Create a new user (hashes password automatically)
 */
export async function create({ name, email, password, plan = 'free', phone = null }) {
  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(password, salt);

  const result = stmtCreate.run({
    name,
    email: email.toLowerCase(),
    password: hashedPassword,
    plan,
    phone: phone || null,
  });

  return findById(result.lastInsertRowid);
}

/**
 * Update a user by ID with given fields
 */
export function updateById(id, fields) {
  const allowedFields = ['name', 'email', 'password', 'plan', 'avatar', 'verified', 'totp_secret', 'totp_enabled', 'push_subscription'];
  const updates = [];
  const values = {};

  for (const [key, value] of Object.entries(fields)) {
    if (allowedFields.includes(key) && value !== undefined) {
      updates.push(`${key} = @${key}`);
      values[key] = key === 'email' ? value.toLowerCase() : value;
    }
  }

  if (updates.length === 0) return findById(id);

  values.id = id;
  const sql = `UPDATE users SET ${updates.join(', ')} WHERE id = @id`;
  db.prepare(sql).run(values);

  return findById(id);
}

/**
 * Compare a plain-text password with a hashed password
 */
export async function comparePassword(inputPassword, hashedPassword) {
  return bcrypt.compare(inputPassword, hashedPassword);
}

/**
 * Check if email is taken by another user (excluding given id)
 */
export function emailTakenByOther(email, excludeId) {
  const row = db.prepare('SELECT id FROM users WHERE email = ? AND id != ?').get(email.toLowerCase(), excludeId);
  return !!row;
}

/**
 * Update user password (hashes automatically)
 */
export async function updatePassword(id, newPassword) {
  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(newPassword, salt);
  db.prepare('UPDATE users SET password = ? WHERE id = ?').run(hashedPassword, id);
  return findById(id);
}

export default {
  findByEmail,
  findByPhone,
  findById,
  create,
  updateById,
  comparePassword,
  emailTakenByOther,
  updatePassword,
};
