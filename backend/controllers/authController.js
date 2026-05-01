import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import { createOtp, verifyOtp } from '../services/otpService.js';

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists',
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
    });

    // Generate token
    const token = generateToken(user.id);

    res.status(201).json({
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
      token,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = User.findByEmail(email);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Check password
    const isMatch = await User.comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Generate token
    const token = generateToken(user.id);

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
      token,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
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
        totp_enabled: !!user.totp_enabled,
        createdAt: user.created_at,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Logout user (client-side token removal, server acknowledges)
// @route   POST /api/auth/logout
// @access  Private
export const logout = async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
};

// @desc    Send OTP to phone number
// @route   POST /api/auth/otp/send
// @access  Public
export const sendOtp = async (req, res, next) => {
  try {
    const { phone } = req.body;
    const otp = await createOtp(phone);
    res.status(200).json({
      success: true,
      message: 'OTP sent successfully',
      // Only expose OTP in dev mode (remove in production)
      dev_otp: process.env.NODE_ENV !== 'production' ? otp : undefined,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify OTP and login (existing user)
// @route   POST /api/auth/otp/verify
// @access  Public
export const verifyOtpLogin = async (req, res, next) => {
  try {
    const { phone, code } = req.body;

    const isValid = verifyOtp(phone, code);
    if (!isValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired OTP code',
      });
    }

    // Find user by phone
    const user = User.findByPhone(phone);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No account found with this phone number. Please sign up first.',
        needsRegistration: true,
      });
    }

    const token = generateToken(user.id);

    res.status(200).json({
      success: true,
      data: {
        _id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        plan: user.plan,
        avatar: user.avatar,
        verified: !!user.verified,
        createdAt: user.created_at,
      },
      token,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Register with phone number + OTP
// @route   POST /api/auth/register-phone
// @access  Public
export const registerWithPhone = async (req, res, next) => {
  try {
    const { name, phone, code } = req.body;

    const isValid = verifyOtp(phone, code);
    if (!isValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired OTP code',
      });
    }

    // Check if phone already registered
    const existing = User.findByPhone(phone);
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'An account with this phone number already exists',
      });
    }

    // Create user with phone (generate random email placeholder & password)
    const randomEmail = `${phone.replace(/[^0-9]/g, '')}@phone.statusmy.local`;
    const randomPassword = require('crypto').randomBytes(32).toString('hex');

    const user = await User.create({
      name,
      email: randomEmail,
      password: randomPassword,
      phone,
    });

    const token = generateToken(user.id);

    res.status(201).json({
      success: true,
      data: {
        _id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        plan: user.plan,
        avatar: user.avatar,
        verified: true,
        createdAt: user.created_at,
      },
      token,
    });
  } catch (error) {
    next(error);
  }
};
