import { Router } from 'express';
import {
  getMonitors,
  getMonitor,
  createMonitor,
  updateMonitor,
  deleteMonitor,
  getMonitorChecks,
  getMonitorStats,
  getMonitorSSL,
} from '../controllers/monitorController.js';
import {
  getMaintenanceWindows,
  createMaintenanceWindow,
  updateMaintenanceWindow,
  deleteMaintenanceWindow,
} from '../controllers/maintenanceController.js';
import protect from '../middleware/auth.js';

const router = Router();

// All monitor routes are protected
router.use(protect);

router.get('/', getMonitors);
router.get('/:id', getMonitor);
router.post('/', createMonitor);
router.put('/:id', updateMonitor);
router.delete('/:id', deleteMonitor);
router.get('/:id/checks', getMonitorChecks);
router.get('/:id/stats', getMonitorStats);
router.get('/:id/ssl', getMonitorSSL);

// Maintenance windows (nested under monitors)
router.get('/:id/maintenance', getMaintenanceWindows);
router.post('/:id/maintenance', createMaintenanceWindow);
router.put('/:id/maintenance/:windowId', updateMaintenanceWindow);
router.delete('/:id/maintenance/:windowId', deleteMaintenanceWindow);

export default router;
