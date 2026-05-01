import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Resolve database path
const dbPath = process.env.DATABASE_PATH || path.join(__dirname, '..', 'data', 'database.sqlite');

// Ensure data directory exists
const dataDir = path.dirname(dbPath);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize SQLite database
const db = new Database(dbPath);

// Enable WAL mode for better concurrent read performance
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// Create users table
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    plan TEXT DEFAULT 'free' CHECK(plan IN ('free', 'pro', 'team', 'business')),
    avatar TEXT DEFAULT '',
    verified INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now'))
  );
`);

// Create monitors table (with keyword, heartbeat, and response time threshold fields)
db.exec(`
  CREATE TABLE IF NOT EXISTS monitors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    url TEXT NOT NULL,
    type TEXT DEFAULT 'http' CHECK(type IN ('http', 'tcp', 'ping', 'dns', 'heartbeat')),
    interval_seconds INTEGER DEFAULT 300,
    timeout_ms INTEGER DEFAULT 10000,
    method TEXT DEFAULT 'GET',
    expected_status INTEGER DEFAULT 200,
    active INTEGER DEFAULT 1,
    keyword TEXT,
    keyword_type TEXT DEFAULT 'contains' CHECK(keyword_type IN ('contains', 'not_contains')),
    heartbeat_token TEXT,
    last_heartbeat_at TEXT,
    response_time_threshold_ms INTEGER,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );
`);

// Create checks table
db.exec(`
  CREATE TABLE IF NOT EXISTS checks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    monitor_id INTEGER NOT NULL,
    status TEXT NOT NULL CHECK(status IN ('up', 'down', 'degraded')),
    response_time_ms INTEGER,
    status_code INTEGER,
    error_message TEXT,
    checked_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (monitor_id) REFERENCES monitors(id) ON DELETE CASCADE
  );
`);

// Create ssl_checks table
db.exec(`
  CREATE TABLE IF NOT EXISTS ssl_checks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    monitor_id INTEGER NOT NULL,
    valid INTEGER DEFAULT 1,
    issuer TEXT,
    subject TEXT,
    valid_from TEXT,
    valid_to TEXT,
    days_remaining INTEGER,
    fingerprint TEXT,
    protocol TEXT,
    error_message TEXT,
    checked_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (monitor_id) REFERENCES monitors(id) ON DELETE CASCADE
  );
`);

// Create incidents table
db.exec(`
  CREATE TABLE IF NOT EXISTS incidents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    monitor_id INTEGER,
    user_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'investigating' CHECK(status IN ('investigating', 'identified', 'monitoring', 'resolved')),
    severity TEXT DEFAULT 'minor' CHECK(severity IN ('minor', 'major', 'critical')),
    started_at TEXT DEFAULT (datetime('now')),
    resolved_at TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (monitor_id) REFERENCES monitors(id) ON DELETE SET NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );
`);

// Create incident_updates table
db.exec(`
  CREATE TABLE IF NOT EXISTS incident_updates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    incident_id INTEGER NOT NULL,
    status TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (incident_id) REFERENCES incidents(id) ON DELETE CASCADE
  );
`);

// Create alert_channels table
db.exec(`
  CREATE TABLE IF NOT EXISTS alert_channels (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    type TEXT NOT NULL CHECK(type IN ('email', 'webhook', 'slack', 'discord', 'telegram')),
    name TEXT NOT NULL,
    config TEXT NOT NULL,
    active INTEGER DEFAULT 1,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );
`);

// Create alert_log table
db.exec(`
  CREATE TABLE IF NOT EXISTS alert_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    monitor_id INTEGER,
    channel_id INTEGER,
    type TEXT NOT NULL,
    message TEXT NOT NULL,
    sent_at TEXT DEFAULT (datetime('now')),
    success INTEGER DEFAULT 1,
    error_message TEXT,
    FOREIGN KEY (monitor_id) REFERENCES monitors(id) ON DELETE SET NULL,
    FOREIGN KEY (channel_id) REFERENCES alert_channels(id) ON DELETE SET NULL
  );
`);

// ── BATCH 2 Tables ──

// Maintenance windows table
db.exec(`
  CREATE TABLE IF NOT EXISTS maintenance_windows (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    monitor_id INTEGER NOT NULL,
    start_at TEXT NOT NULL,
    end_at TEXT NOT NULL,
    reason TEXT,
    active INTEGER DEFAULT 1,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (monitor_id) REFERENCES monitors(id) ON DELETE CASCADE
  );
`);

// Subscribers table
db.exec(`
  CREATE TABLE IF NOT EXISTS subscribers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    verified INTEGER DEFAULT 0,
    token TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now'))
  );
`);

// On-call schedules table
db.exec(`
  CREATE TABLE IF NOT EXISTS on_call_schedules (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    day_of_week INTEGER NOT NULL CHECK(day_of_week BETWEEN 0 AND 6),
    start_time TEXT NOT NULL,
    end_time TEXT NOT NULL,
    active INTEGER DEFAULT 1,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );
`);

// Escalation rules table
db.exec(`
  CREATE TABLE IF NOT EXISTS escalation_rules (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    delay_minutes INTEGER NOT NULL DEFAULT 5,
    notify_channel_id INTEGER,
    priority INTEGER DEFAULT 1,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (notify_channel_id) REFERENCES alert_channels(id) ON DELETE SET NULL
  );
`);

// ── Migrations: add new columns if they don't exist ──
function columnExists(table, column) {
  const cols = db.prepare(`PRAGMA table_info(${table})`).all();
  return cols.some((c) => c.name === column);
}

// Monitors table migrations
if (!columnExists('monitors', 'keyword')) {
  db.exec(`ALTER TABLE monitors ADD COLUMN keyword TEXT`);
}
if (!columnExists('monitors', 'keyword_type')) {
  db.exec(`ALTER TABLE monitors ADD COLUMN keyword_type TEXT DEFAULT 'contains'`);
}
if (!columnExists('monitors', 'heartbeat_token')) {
  db.exec(`ALTER TABLE monitors ADD COLUMN heartbeat_token TEXT`);
}
if (!columnExists('monitors', 'last_heartbeat_at')) {
  db.exec(`ALTER TABLE monitors ADD COLUMN last_heartbeat_at TEXT`);
}
if (!columnExists('monitors', 'response_time_threshold_ms')) {
  db.exec(`ALTER TABLE monitors ADD COLUMN response_time_threshold_ms INTEGER`);
}

// BATCH 2 migrations: monitors.check_regions
if (!columnExists('monitors', 'check_regions')) {
  db.exec(`ALTER TABLE monitors ADD COLUMN check_regions TEXT DEFAULT '["asia"]'`);
}

// BATCH 2 migrations: checks.error_body, checks.region
if (!columnExists('checks', 'error_body')) {
  db.exec(`ALTER TABLE checks ADD COLUMN error_body TEXT`);
}
if (!columnExists('checks', 'region')) {
  db.exec(`ALTER TABLE checks ADD COLUMN region TEXT DEFAULT 'asia'`);
}

// BATCH 2 migrations: users.totp_secret, totp_enabled, push_subscription
if (!columnExists('users', 'totp_secret')) {
  db.exec(`ALTER TABLE users ADD COLUMN totp_secret TEXT`);
}
if (!columnExists('users', 'totp_enabled')) {
  db.exec(`ALTER TABLE users ADD COLUMN totp_enabled INTEGER DEFAULT 0`);
}
if (!columnExists('users', 'push_subscription')) {
  db.exec(`ALTER TABLE users ADD COLUMN push_subscription TEXT`);
}

// BATCH 2 migrations: incidents.acknowledged_at
if (!columnExists('incidents', 'acknowledged_at')) {
  db.exec(`ALTER TABLE incidents ADD COLUMN acknowledged_at TEXT`);
}

// Create user_preferences table
db.exec(`
  CREATE TABLE IF NOT EXISTS user_preferences (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL UNIQUE,
    monitor_down_alerts INTEGER DEFAULT 1,
    monitor_recovery_alerts INTEGER DEFAULT 1,
    ssl_expiry_warnings INTEGER DEFAULT 1,
    weekly_reports INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );
`);

// Create api_keys table
db.exec(`
  CREATE TABLE IF NOT EXISTS api_keys (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    key_hash TEXT NOT NULL,
    key_prefix TEXT NOT NULL,
    last_used_at TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );
`);

// Create subscriptions table for billing
db.exec(`
  CREATE TABLE IF NOT EXISTS subscriptions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL UNIQUE,
    stripe_customer_id TEXT,
    stripe_subscription_id TEXT,
    plan TEXT DEFAULT 'free' CHECK(plan IN ('free', 'pro', 'business')),
    status TEXT DEFAULT 'active' CHECK(status IN ('active', 'canceled', 'past_due', 'trialing')),
    current_period_end TEXT,
    cancel_at_period_end INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );
`);

// Create indexes for performance (after migrations so columns exist)
db.exec(`
  CREATE INDEX IF NOT EXISTS idx_checks_monitor_id ON checks(monitor_id);
  CREATE INDEX IF NOT EXISTS idx_checks_checked_at ON checks(checked_at);
  CREATE INDEX IF NOT EXISTS idx_monitors_user_id ON monitors(user_id);
  CREATE INDEX IF NOT EXISTS idx_monitors_heartbeat_token ON monitors(heartbeat_token);
  CREATE INDEX IF NOT EXISTS idx_incidents_user_id ON incidents(user_id);
  CREATE INDEX IF NOT EXISTS idx_alert_channels_user_id ON alert_channels(user_id);
  CREATE INDEX IF NOT EXISTS idx_alert_log_monitor_id ON alert_log(monitor_id);
  CREATE INDEX IF NOT EXISTS idx_alert_log_channel_id ON alert_log(channel_id);
  CREATE INDEX IF NOT EXISTS idx_ssl_checks_monitor_id ON ssl_checks(monitor_id);
  CREATE INDEX IF NOT EXISTS idx_maintenance_windows_monitor_id ON maintenance_windows(monitor_id);
  CREATE INDEX IF NOT EXISTS idx_on_call_schedules_user_id ON on_call_schedules(user_id);
  CREATE INDEX IF NOT EXISTS idx_escalation_rules_user_id ON escalation_rules(user_id);
  CREATE INDEX IF NOT EXISTS idx_subscribers_email ON subscribers(email);
`);

console.log(`✅ SQLite connected: ${dbPath}`);

export default db;
