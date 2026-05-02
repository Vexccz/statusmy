import { Router } from 'express';
import { getSLAReport } from '../controllers/reportController.js';
import protect from '../middleware/auth.js';

const router = Router();

// All report routes are protected
router.use(protect);

router.get('/sla', getSLAReport);

export default router;
