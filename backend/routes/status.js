import { Router } from 'express';
import { getPublicStatus, getMonitorHistory } from '../controllers/statusController.js';
import { subscribe, unsubscribe } from '../controllers/subscriberController.js';

const router = Router();

// All status routes are public (no auth required)
router.get('/', getPublicStatus);
router.get('/history/:monitorId', getMonitorHistory);
router.post('/subscribe', subscribe);
router.post('/unsubscribe', unsubscribe);

export default router;
