import { Router } from 'express';
import { register, login, getMe, logout, sendOtp, verifyOtpLogin, registerWithPhone } from '../controllers/authController.js';
import { setup2FA, verify2FA, enable2FA, disable2FA } from '../controllers/twoFactorController.js';
import protect from '../middleware/auth.js';

const router = Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/otp/send', sendOtp);
router.post('/otp/verify', verifyOtpLogin);
router.post('/register-phone', registerWithPhone);

// Protected routes
router.get('/me', protect, getMe);
router.post('/logout', protect, logout);

// 2FA routes (protected)
router.post('/2fa/setup', protect, setup2FA);
router.post('/2fa/verify', protect, verify2FA);
router.post('/2fa/enable', protect, enable2FA);
router.post('/2fa/disable', protect, disable2FA);

export default router;
