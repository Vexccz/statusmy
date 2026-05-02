import { Router } from 'express';
import {
  getIncidents,
  getIncident,
  createIncident,
  updateIncident,
  resolveIncident,
} from '../controllers/incidentController.js';
import protect from '../middleware/auth.js';

const router = Router();

// All incident routes are protected
router.use(protect);

router.get('/', getIncidents);
router.get('/:id', getIncident);
router.post('/', createIncident);
router.put('/:id', updateIncident);
router.put('/:id/resolve', resolveIncident);

export default router;
