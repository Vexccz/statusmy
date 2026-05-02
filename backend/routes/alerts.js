import { Router } from 'express';
import {
  getChannels,
  createChannel,
  updateChannel,
  deleteChannel,
  testChannel,
  getAlertLog,
} from '../controllers/alertController.js';
import {
  getEscalationRules,
  createEscalationRule,
  updateEscalationRule,
  deleteEscalationRule,
} from '../controllers/escalationController.js';
import {
  getOnCallSchedules,
  createOnCallSchedule,
  updateOnCallSchedule,
  deleteOnCallSchedule,
  getCurrentOnCall,
} from '../controllers/onCallController.js';
import protect from '../middleware/auth.js';

const router = Router();

// All alert routes are protected
router.use(protect);

// Alert channels
router.get('/channels', getChannels);
router.post('/channels', createChannel);
router.put('/channels/:id', updateChannel);
router.delete('/channels/:id', deleteChannel);
router.post('/channels/:id/test', testChannel);

// Alert log
router.get('/log', getAlertLog);

// Escalation rules
router.get('/escalation', getEscalationRules);
router.post('/escalation', createEscalationRule);
router.put('/escalation/:id', updateEscalationRule);
router.delete('/escalation/:id', deleteEscalationRule);

// On-call schedules
router.get('/on-call', getOnCallSchedules);
router.post('/on-call', createOnCallSchedule);
router.put('/on-call/:id', updateOnCallSchedule);
router.delete('/on-call/:id', deleteOnCallSchedule);
router.get('/on-call/current', getCurrentOnCall);

export default router;
