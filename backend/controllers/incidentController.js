import Incident from '../models/Incident.js';
import { getIO } from '../socket.js';

/**
 * GET /api/incidents
 * List all incidents for the authenticated user
 */
export const getIncidents = (req, res) => {
  try {
    const incidents = Incident.findByUserId(req.user.id);

    res.json({
      success: true,
      data: incidents,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * GET /api/incidents/:id
 * Get a single incident with updates
 */
export const getIncident = (req, res) => {
  try {
    const incident = Incident.findById(req.params.id);

    if (!incident) {
      return res.status(404).json({ success: false, message: 'Incident not found' });
    }

    if (incident.user_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    res.json({
      success: true,
      data: incident,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * POST /api/incidents
 * Create a new incident
 */
export const createIncident = (req, res) => {
  try {
    const { monitorId, title, description, severity } = req.body;

    const incident = Incident.create({
      monitorId,
      userId: req.user.id,
      title,
      description,
      severity,
    });

    // Emit socket events
    const io = getIO();
    if (io) {
      io.to(`user:${req.user.id}`).emit('incident:created', incident);
      io.to('public').emit('incident:created', { id: incident?.id, title, severity, status: 'investigating' });
    }

    res.status(201).json({
      success: true,
      data: incident,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * PUT /api/incidents/:id
 * Update incident status
 */
export const updateIncident = (req, res) => {
  try {
    const incident = Incident.findById(req.params.id);

    if (!incident) {
      return res.status(404).json({ success: false, message: 'Incident not found' });
    }

    if (incident.user_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const { status, message } = req.body;

    const updated = Incident.updateStatus(incident.id, status, message);

    // Emit socket events
    const io = getIO();
    if (io) {
      io.to(`user:${req.user.id}`).emit('incident:updated', updated);
      io.to('public').emit('incident:updated', { id: incident.id, status });
    }

    res.json({
      success: true,
      data: updated,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * PUT /api/incidents/:id/resolve
 * Resolve an incident
 */
export const resolveIncident = (req, res) => {
  try {
    const incident = Incident.findById(req.params.id);

    if (!incident) {
      return res.status(404).json({ success: false, message: 'Incident not found' });
    }

    if (incident.user_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const resolved = Incident.resolve(incident.id);

    // Emit socket events
    const io = getIO();
    if (io) {
      io.to(`user:${req.user.id}`).emit('incident:resolved', resolved);
      io.to('public').emit('incident:resolved', { id: incident.id, status: 'resolved' });
    }

    res.json({
      success: true,
      data: resolved,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export default {
  getIncidents,
  getIncident,
  createIncident,
  updateIncident,
  resolveIncident,
};
