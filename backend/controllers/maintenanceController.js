import MaintenanceWindow from '../models/MaintenanceWindow.js';
import Monitor from '../models/Monitor.js';

/**
 * GET /api/monitors/:id/maintenance
 */
export const getMaintenanceWindows = (req, res) => {
  try {
    const monitor = Monitor.findById(req.params.id);
    if (!monitor) {
      return res.status(404).json({ success: false, message: 'Monitor not found' });
    }
    if (monitor.user_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const windows = MaintenanceWindow.findByMonitorId(monitor.id);
    res.json({ success: true, data: windows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * POST /api/monitors/:id/maintenance
 */
export const createMaintenanceWindow = (req, res) => {
  try {
    const monitor = Monitor.findById(req.params.id);
    if (!monitor) {
      return res.status(404).json({ success: false, message: 'Monitor not found' });
    }
    if (monitor.user_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const { startAt, endAt, reason } = req.body;
    const window = MaintenanceWindow.create({
      monitorId: monitor.id,
      startAt,
      endAt,
      reason,
    });

    res.status(201).json({ success: true, data: window });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * PUT /api/monitors/:id/maintenance/:windowId
 */
export const updateMaintenanceWindow = (req, res) => {
  try {
    const monitor = Monitor.findById(req.params.id);
    if (!monitor) {
      return res.status(404).json({ success: false, message: 'Monitor not found' });
    }
    if (monitor.user_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const window = MaintenanceWindow.findById(req.params.windowId);
    if (!window || window.monitor_id !== monitor.id) {
      return res.status(404).json({ success: false, message: 'Maintenance window not found' });
    }

    const { startAt, endAt, reason, active } = req.body;
    const updated = MaintenanceWindow.updateById(window.id, {
      start_at: startAt,
      end_at: endAt,
      reason,
      active: active !== undefined ? (active ? 1 : 0) : undefined,
    });

    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * DELETE /api/monitors/:id/maintenance/:windowId
 */
export const deleteMaintenanceWindow = (req, res) => {
  try {
    const monitor = Monitor.findById(req.params.id);
    if (!monitor) {
      return res.status(404).json({ success: false, message: 'Monitor not found' });
    }
    if (monitor.user_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const window = MaintenanceWindow.findById(req.params.windowId);
    if (!window || window.monitor_id !== monitor.id) {
      return res.status(404).json({ success: false, message: 'Maintenance window not found' });
    }

    MaintenanceWindow.deleteById(window.id);
    res.json({ success: true, message: 'Maintenance window deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export default {
  getMaintenanceWindows,
  createMaintenanceWindow,
  updateMaintenanceWindow,
  deleteMaintenanceWindow,
};
