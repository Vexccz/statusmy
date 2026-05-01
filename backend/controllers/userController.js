import User from '../models/User.js';
import db from '../config/db.js';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

// @desc    Get user profile
// @route   GET /api/user/profile
// @access  Private
export const getProfile = async (req, res, next) => {
  try {
    const user = req.user;

    res.status(200).json({
      success: true,
      data: {
        _id: user.id,
        name: user.name,
        email: user.email,
        plan: user.plan,
        avatar: user.avatar,
        verified: !!user.verified,
        createdAt: user.created_at,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/user/profile
// @access  Private
export const updateProfile = async (req, res, next) => {
  try {
    const { name, email, avatar } = req.body;

    const user = User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Build update fields
    const fields = {};
    if (name) fields.name = name;
    if (email) {
      // Check if new email is already taken by another user
      if (User.emailTakenByOther(email, user.id)) {
        return res.status(400).json({
          success: false,
          message: 'Email already in use by another account',
        });
      }
      fields.email = email;
    }
    if (avatar !== undefined) fields.avatar = avatar;

    const updatedUser = User.updateById(user.id, fields);

    res.status(200).json({
      success: true,
      data: {
        _id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        plan: updatedUser.plan,
        avatar: updatedUser.avatar,
        verified: !!updatedUser.verified,
        createdAt: updatedUser.created_at,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user plan
// @route   PUT /api/user/plan
// @access  Private
export const updatePlan = async (req, res, next) => {
  try {
    const { plan } = req.body;

    const validPlans = ['free', 'team', 'business'];
    if (!validPlans.includes(plan)) {
      return res.status(400).json({
        success: false,
        message: `Invalid plan. Must be one of: ${validPlans.join(', ')}`,
      });
    }

    const user = User.updateById(req.user.id, { plan });

    res.status(200).json({
      success: true,
      data: {
        _id: user.id,
        name: user.name,
        email: user.email,
        plan: user.plan,
        avatar: user.avatar,
        verified: !!user.verified,
        createdAt: user.created_at,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Change user password
// @route   PUT /api/user/password
// @access  Private
export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required',
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 8 characters',
      });
    }

    const user = User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Verify current password
    const isMatch = await User.comparePassword(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect',
      });
    }

    // Update password
    await User.updatePassword(user.id, newPassword);

    res.status(200).json({
      success: true,
      message: 'Password updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get notification preferences
// @route   GET /api/user/preferences
// @access  Private
export const getPreferences = async (req, res, next) => {
  try {
    let prefs = db.prepare('SELECT * FROM user_preferences WHERE user_id = ?').get(req.user.id);

    if (!prefs) {
      // Create default preferences
      db.prepare('INSERT INTO user_preferences (user_id) VALUES (?)').run(req.user.id);
      prefs = db.prepare('SELECT * FROM user_preferences WHERE user_id = ?').get(req.user.id);
    }

    res.status(200).json({
      success: true,
      data: {
        monitor_down_alerts: !!prefs.monitor_down_alerts,
        monitor_recovery_alerts: !!prefs.monitor_recovery_alerts,
        ssl_expiry_warnings: !!prefs.ssl_expiry_warnings,
        weekly_reports: !!prefs.weekly_reports,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update notification preferences
// @route   PUT /api/user/preferences
// @access  Private
export const updatePreferences = async (req, res, next) => {
  try {
    const { monitor_down_alerts, monitor_recovery_alerts, ssl_expiry_warnings, weekly_reports } = req.body;

    // Upsert preferences
    const existing = db.prepare('SELECT id FROM user_preferences WHERE user_id = ?').get(req.user.id);

    if (existing) {
      db.prepare(`
        UPDATE user_preferences 
        SET monitor_down_alerts = ?, monitor_recovery_alerts = ?, ssl_expiry_warnings = ?, weekly_reports = ?
        WHERE user_id = ?
      `).run(
        monitor_down_alerts ? 1 : 0,
        monitor_recovery_alerts ? 1 : 0,
        ssl_expiry_warnings ? 1 : 0,
        weekly_reports ? 1 : 0,
        req.user.id
      );
    } else {
      db.prepare(`
        INSERT INTO user_preferences (user_id, monitor_down_alerts, monitor_recovery_alerts, ssl_expiry_warnings, weekly_reports)
        VALUES (?, ?, ?, ?, ?)
      `).run(
        req.user.id,
        monitor_down_alerts ? 1 : 0,
        monitor_recovery_alerts ? 1 : 0,
        ssl_expiry_warnings ? 1 : 0,
        weekly_reports ? 1 : 0
      );
    }

    res.status(200).json({
      success: true,
      message: 'Preferences updated successfully',
      data: {
        monitor_down_alerts: !!monitor_down_alerts,
        monitor_recovery_alerts: !!monitor_recovery_alerts,
        ssl_expiry_warnings: !!ssl_expiry_warnings,
        weekly_reports: !!weekly_reports,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get API keys
// @route   GET /api/user/api-keys
// @access  Private
export const getApiKeys = async (req, res, next) => {
  try {
    const keys = db.prepare('SELECT id, name, key_prefix, last_used_at, created_at FROM api_keys WHERE user_id = ? ORDER BY created_at DESC').all(req.user.id);

    res.status(200).json({
      success: true,
      data: keys,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create API key
// @route   POST /api/user/api-keys
// @access  Private
export const createApiKey = async (req, res, next) => {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Key name is required' });
    }

    // Generate a random API key
    const rawKey = `sm_${crypto.randomUUID().replace(/-/g, '')}`;
    const keyPrefix = rawKey.substring(0, 10);
    const keyHash = crypto.createHash('sha256').update(rawKey).digest('hex');

    db.prepare('INSERT INTO api_keys (user_id, name, key_hash, key_prefix) VALUES (?, ?, ?, ?)').run(
      req.user.id,
      name.trim(),
      keyHash,
      keyPrefix
    );

    const inserted = db.prepare('SELECT id, name, key_prefix, created_at FROM api_keys WHERE key_hash = ?').get(keyHash);

    res.status(201).json({
      success: true,
      data: {
        id: inserted.id,
        name: inserted.name,
        key_prefix: inserted.key_prefix,
        created_at: inserted.created_at,
        key: rawKey, // Only returned ONCE
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete API key
// @route   DELETE /api/user/api-keys/:id
// @access  Private
export const deleteApiKey = async (req, res, next) => {
  try {
    const { id } = req.params;

    const key = db.prepare('SELECT id FROM api_keys WHERE id = ? AND user_id = ?').get(id, req.user.id);
    if (!key) {
      return res.status(404).json({ success: false, message: 'API key not found' });
    }

    db.prepare('DELETE FROM api_keys WHERE id = ? AND user_id = ?').run(id, req.user.id);

    res.status(200).json({
      success: true,
      message: 'API key deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
