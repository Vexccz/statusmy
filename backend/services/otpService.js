/**
 * Simple in-memory OTP service
 * In production, use Redis or a proper store with TTL
 */

const otpStore = new Map(); // phone -> { code, expiresAt }

const OTP_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes

/**
 * Create and store an OTP for a phone number
 */
export function createOtp(phone) {
  const code = String(Math.floor(100000 + Math.random() * 900000)); // 6-digit code
  otpStore.set(phone, {
    code,
    expiresAt: Date.now() + OTP_EXPIRY_MS,
  });

  // In production, send via Twilio/SMS here
  console.log(`[OTP] Code for ${phone}: ${code}`);
  return code;
}

/**
 * Verify an OTP code for a phone number
 */
export function verifyOtp(phone, code) {
  const entry = otpStore.get(phone);
  if (!entry) return false;

  if (Date.now() > entry.expiresAt) {
    otpStore.delete(phone);
    return false;
  }

  if (entry.code !== code) return false;

  // OTP is single-use
  otpStore.delete(phone);
  return true;
}

export default { createOtp, verifyOtp };
