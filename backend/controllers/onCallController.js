import OnCallSchedule from '../models/OnCallSchedule.js';

/**
 * GET /api/alerts/on-call
 */
export const getOnCallSchedules = (req, res) => {
  try {
    const schedules = OnCallSchedule.findByUserId(req.user.id);
    res.json({ success: true, data: schedules });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * POST /api/alerts/on-call
 */
export const createOnCallSchedule = (req, res) => {
  try {
    const { dayOfWeek, startTime, endTime } = req.body;

    if (dayOfWeek === undefined || !startTime || !endTime) {
      return res.status(400).json({ success: false, message: 'dayOfWeek, startTime, and endTime are required' });
    }

    const schedule = OnCallSchedule.create({
      userId: req.user.id,
      dayOfWeek: Number(dayOfWeek),
      startTime,
      endTime,
    });

    res.status(201).json({ success: true, data: schedule });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * PUT /api/alerts/on-call/:id
 */
export const updateOnCallSchedule = (req, res) => {
  try {
    const schedule = OnCallSchedule.findById(req.params.id);
    if (!schedule) {
      return res.status(404).json({ success: false, message: 'Schedule not found' });
    }
    if (schedule.user_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const { dayOfWeek, startTime, endTime, active } = req.body;
    const updated = OnCallSchedule.updateById(schedule.id, {
      day_of_week: dayOfWeek !== undefined ? Number(dayOfWeek) : undefined,
      start_time: startTime,
      end_time: endTime,
      active: active !== undefined ? (active ? 1 : 0) : undefined,
    });

    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * DELETE /api/alerts/on-call/:id
 */
export const deleteOnCallSchedule = (req, res) => {
  try {
    const schedule = OnCallSchedule.findById(req.params.id);
    if (!schedule) {
      return res.status(404).json({ success: false, message: 'Schedule not found' });
    }
    if (schedule.user_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    OnCallSchedule.deleteById(schedule.id);
    res.json({ success: true, message: 'Schedule deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * GET /api/alerts/on-call/current
 */
export const getCurrentOnCall = (req, res) => {
  try {
    const current = OnCallSchedule.getCurrentOnCall();
    res.json({ success: true, data: current });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export default {
  getOnCallSchedules,
  createOnCallSchedule,
  updateOnCallSchedule,
  deleteOnCallSchedule,
  getCurrentOnCall,
};
