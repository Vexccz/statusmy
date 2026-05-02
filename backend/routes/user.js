import { Router } from 'express';
import {
  getProfile,
  updateProfile,
  updatePlan,
  changePassword,
  getPreferences,
  updatePreferences,
  getApiKeys,
  createApiKey,
  deleteApiKey,
} from '../controllers/userController.js';
import { pushSubscribe } from '../controllers/pushController.js';
import protect from '../middleware/auth.js';

const router = Router();

// All user routes are protected
router.use(protect);

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.put('/plan', updatePlan);
router.put('/password', changePassword);
router.get('/preferences', getPreferences);
router.put('/preferences', updatePreferences);
router.get('/api-keys', getApiKeys);
router.post('/api-keys', createApiKey);
router.delete('/api-keys/:id', deleteApiKey);
router.post('/push-subscribe', pushSubscribe);

export default router;
