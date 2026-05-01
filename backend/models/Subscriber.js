import db from '../config/db.js';
import crypto from 'crypto';

const stmtFindByEmail = db.prepare('SELECT * FROM subscribers WHERE email = ?');
const stmtFindById = db.prepare('SELECT * FROM subscribers WHERE id = ?');
const stmtFindByToken = db.prepare('SELECT * FROM subscribers WHERE token = ?');
const stmtFindAllVerified = db.prepare('SELECT * FROM subscribers WHERE verified = 1');
const stmtCreate = db.prepare(`
  INSERT INTO subscribers (email, verified, token)
  VALUES (@email, @verified, @token)
`);
const stmtDeleteById = db.prepare('DELETE FROM subscribers WHERE id = ?');

export function findByEmail(email) {
  return stmtFindByEmail.get(email.toLowerCase()) || null;
}

export function findById(id) {
  return stmtFindById.get(id) || null;
}

export function findByToken(token) {
  return stmtFindByToken.get(token) || null;
}

export function findAllVerified() {
  return stmtFindAllVerified.all();
}

export function create({ email }) {
  const existing = findByEmail(email);
  if (existing) return existing;

  const token = crypto.randomUUID();
  const result = stmtCreate.run({
    email: email.toLowerCase(),
    verified: 1, // Auto-verify for now (no email verification flow)
    token,
  });
  return findById(result.lastInsertRowid);
}

export function verify(token) {
  const sub = findByToken(token);
  if (!sub) return null;
  db.prepare('UPDATE subscribers SET verified = 1 WHERE id = ?').run(sub.id);
  return findById(sub.id);
}

export function deleteById(id) {
  return stmtDeleteById.run(id);
}

export default {
  findByEmail,
  findById,
  findByToken,
  findAllVerified,
  create,
  verify,
  deleteById,
};
