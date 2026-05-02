import https from 'https';
import { URL } from 'url';
import db from '../config/db.js';

/**
 * Check SSL certificate for a URL
 */
export async function checkSSL(urlStr) {
  return new Promise((resolve) => {
    try {
      const url = new URL(urlStr);
      const options = {
        hostname: url.hostname,
        port: url.port || 443,
        method: 'HEAD',
        rejectUnauthorized: false, // We want to inspect even invalid certs
        timeout: 10000,
      };

      const req = https.request(options, (res) => {
        const cert = res.socket.getPeerCertificate();

        if (!cert || Object.keys(cert).length === 0) {
          resolve({
            valid: false,
            error_message: 'No certificate found',
          });
          return;
        }

        const validFrom = new Date(cert.valid_from);
        const validTo = new Date(cert.valid_to);
        const now = new Date();
        const daysRemaining = Math.floor((validTo - now) / (1000 * 60 * 60 * 24));

        resolve({
          valid: res.socket.authorized !== false && daysRemaining > 0,
          issuer: cert.issuer ? (cert.issuer.O || cert.issuer.CN || JSON.stringify(cert.issuer)) : null,
          subject: cert.subject ? (cert.subject.CN || JSON.stringify(cert.subject)) : null,
          valid_from: validFrom.toISOString(),
          valid_to: validTo.toISOString(),
          days_remaining: daysRemaining,
          fingerprint: cert.fingerprint || null,
          protocol: res.socket.getProtocol ? res.socket.getProtocol() : null,
        });
      });

      req.on('error', (err) => {
        resolve({
          valid: false,
          error_message: err.message,
        });
      });

      req.on('timeout', () => {
        req.destroy();
        resolve({
          valid: false,
          error_message: 'SSL check timed out',
        });
      });

      req.end();
    } catch (err) {
      resolve({
        valid: false,
        error_message: err.message,
      });
    }
  });
}

/**
 * Save an SSL check result to the database
 */
export function saveSSLCheck(monitorId, result) {
  db.prepare(`
    INSERT INTO ssl_checks (monitor_id, valid, issuer, subject, valid_from, valid_to, days_remaining, fingerprint, protocol, error_message)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    monitorId,
    result.valid ? 1 : 0,
    result.issuer || null,
    result.subject || null,
    result.valid_from || null,
    result.valid_to || null,
    result.days_remaining || null,
    result.fingerprint || null,
    result.protocol || null,
    result.error_message || null
  );
}

/**
 * Get the latest SSL check for a monitor
 */
export function getLatestSSLCheck(monitorId) {
  return db.prepare(
    'SELECT * FROM ssl_checks WHERE monitor_id = ? ORDER BY checked_at DESC LIMIT 1'
  ).get(monitorId) || null;
}

/**
 * Get SSL check history for a monitor
 */
export function getSSLHistory(monitorId, limit = 10) {
  return db.prepare(
    'SELECT * FROM ssl_checks WHERE monitor_id = ? ORDER BY checked_at DESC LIMIT ?'
  ).all(monitorId, limit);
}

export default { checkSSL, saveSSLCheck, getLatestSSLCheck, getSSLHistory };
