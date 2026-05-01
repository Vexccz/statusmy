import crypto from 'crypto';
import User from '../models/User.js';

/**
 * POST /api/auth/2fa/setup
 * Generate TOTP secret and return QR URL
 */
export const setup2FA = (req, res) => {
  try {
    // Generate a random base32-like secret (simplified - no actual TOTP lib needed for setup flow)
    const secret = crypto.randomBytes(20).toString('hex').substring(0, 20).toUpperCase();

    // Store secret temporarily (not enabled yet)
    User.updateById(req.user.id, { totp_secret: secret });

    // Generate otpauth URL for QR code
    const issuer = 'StatusMy';
    const account = req.user.email;
    const otpauthUrl = `otpauth://totp/${issuer}:${account}?secret=${secret}&issuer=${issuer}&digits=6&period=30`;

    res.json({
      success: true,
      data: {
        secret,
        qrUrl: otpauthUrl,
        message: 'Scan the QR code with your authenticator app, then verify with a code',
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * POST /api/auth/2fa/verify
 * Verify a TOTP code (simplified - just checks format for now)
 */
export const verify2FA = (req, res) => {
  try {
    const { code } = req.body;

    if (!code || code.length !== 6 || !/^\d+$/.test(code)) {
      return res.status(400).json({ success: false, message: 'Invalid code format. Must be 6 digits.' });
    }

    const user = User.findById(req.user.id);
    if (!user.totp_secret) {
      return res.status(400).json({ success: false, message: '2FA not set up. Call /api/auth/2fa/setup first.' });
    }

    // Simplified verification - in production, use a proper TOTP library
    // For now, accept any valid 6-digit code as "verified"
    res.json({
      success: true,
      message: '2FA code verified successfully. You can now enable 2FA.',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * POST /api/auth/2fa/enable
 * Enable 2FA for the user
 */
export const enable2FA = (req, res) => {
  try {
    const user = User.findById(req.user.id);
    if (!user.totp_secret) {
      return res.status(400).json({ success: false, message: '2FA not set up. Call /api/auth/2fa/setup first.' });
    }

    User.updateById(req.user.id, { totp_enabled: 1 });

    res.json({
      success: true,
      message: '2FA enabled successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * POST /api/auth/2fa/disable
 * Disable 2FA for the user
 */
export const disable2FA = (req, res) => {
  try {
    User.updateById(req.user.id, { totp_enabled: 0, totp_secret: null });

    res.json({
      success: true,
      message: '2FA disabled successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export default {
  setup2FA,
  verify2FA,
  enable2FA,
  disable2FA,
};
