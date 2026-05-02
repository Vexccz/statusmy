import Monitor from '../models/Monitor.js';
import Check from '../models/Check.js';
import AlertChannel from '../models/AlertChannel.js';
import { sendAlert } from './alerter.js';

let schedulerInterval = null;
let ioRef = null;

// Track previous status per monitor to detect transitions
const previousStatus = new Map();

/**
 * Perform an HTTP/HTTPS check on a monitor
 */
async function checkHTTP(monitor) {
  const startTime = Date.now();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), monitor.timeout_ms || 10000);

  try {
    const response = await fetch(monitor.url, {
      method: monitor.method || 'GET',
      signal: controller.signal,
      redirect: 'follow',
      headers: {
        'User-Agent': 'StatusMy-Monitor/1.0',
      },
    });

    clearTimeout(timeout);
    const responseTime = Date.now() - startTime;
    const body = await response.text().catch(() => '');

    // Determine status
    let status = 'up';
    let errorMessage = null;

    // Check expected status code
    const expectedStatus = monitor.expected_status || 200;
    if (response.status !== expectedStatus) {
      status = 'down';
      errorMessage = `Expected status ${expectedStatus}, got ${response.status}`;
    }

    // Check keyword if configured
    if (status === 'up' && monitor.keyword) {
      const hasKeyword = body.includes(monitor.keyword);
      if (monitor.keyword_type === 'contains' && !hasKeyword) {
        status = 'down';
        errorMessage = `Keyword "${monitor.keyword}" not found in response`;
      } else if (monitor.keyword_type === 'not_contains' && hasKeyword) {
        status = 'down';
        errorMessage = `Keyword "${monitor.keyword}" found in response (should not be present)`;
      }
    }

    // Check response time threshold for degraded status
    if (status === 'up' && monitor.response_time_threshold_ms && responseTime > monitor.response_time_threshold_ms) {
      status = 'degraded';
      errorMessage = `Response time ${responseTime}ms exceeds threshold ${monitor.response_time_threshold_ms}ms`;
    }

    return {
      status,
      responseTimeMs: responseTime,
      statusCode: response.status,
      errorMessage,
    };
  } catch (error) {
    clearTimeout(timeout);
    const responseTime = Date.now() - startTime;

    return {
      status: 'down',
      responseTimeMs: responseTime,
      statusCode: null,
      errorMessage: error.name === 'AbortError' ? 'Request timed out' : error.message,
    };
  }
}

/**
 * Check a heartbeat monitor (check if last heartbeat is within expected interval)
 */
function checkHeartbeat(monitor) {
  const gracePeriod = (monitor.interval_seconds || 300) * 2; // 2x interval as grace
  const lastHeartbeat = monitor.last_heartbeat_at;

  if (!lastHeartbeat) {
    return {
      status: 'down',
      responseTimeMs: 0,
      statusCode: null,
      errorMessage: 'No heartbeat received yet',
    };
  }

  const lastTime = new Date(lastHeartbeat + 'Z').getTime();
  const elapsed = (Date.now() - lastTime) / 1000;

  if (elapsed > gracePeriod) {
    return {
      status: 'down',
      responseTimeMs: 0,
      statusCode: null,
      errorMessage: `Last heartbeat was ${Math.round(elapsed)}s ago (grace period: ${gracePeriod}s)`,
    };
  }

  return {
    status: 'up',
    responseTimeMs: 0,
    statusCode: null,
    errorMessage: null,
  };
}

/**
 * Run a single monitor check
 */
async function runCheck(monitor) {
  let result;

  switch (monitor.type) {
    case 'heartbeat':
      result = checkHeartbeat(monitor);
      break;
    case 'http':
    case 'https':
    default:
      result = await checkHTTP(monitor);
      break;
  }

  // Save check to database
  const check = Check.create({
    monitorId: monitor.id,
    status: result.status,
    responseTimeMs: result.responseTimeMs,
    statusCode: result.statusCode,
    errorMessage: result.errorMessage,
  });

  // Detect status transitions for alerting
  const prevStatus = previousStatus.get(monitor.id);
  previousStatus.set(monitor.id, result.status);

  if (prevStatus && prevStatus !== result.status) {
    // Status changed - send alerts
    try {
      const channels = AlertChannel.getActiveByUserId(monitor.user_id);
      for (const channel of channels) {
        await sendAlert(channel, monitor, check);
      }
    } catch (alertError) {
      console.error(`[Scheduler] Alert error for monitor ${monitor.id}:`, alertError.message);
    }
  }

  // Emit real-time update via Socket.io
  if (ioRef) {
    ioRef.to(`user:${monitor.user_id}`).emit('check:new', {
      monitorId: monitor.id,
      check,
    });

    // Also emit to public room for status page
    ioRef.to('public').emit('monitor:status', {
      monitorId: monitor.id,
      status: result.status,
      responseTime: result.responseTimeMs,
    });
  }

  return check;
}

/**
 * Main scheduler tick - checks all active monitors that are due
 */
async function tick() {
  try {
    const monitors = Monitor.findAllActive();
    const now = Date.now();

    for (const monitor of monitors) {
      // Determine if this monitor is due for a check
      // We check every 60s, but each monitor has its own interval
      const intervalMs = (monitor.interval_seconds || 300) * 1000;

      // Get the last check time
      const latestCheck = Check.getLatestByMonitorId(monitor.id);
      const lastCheckTime = latestCheck
        ? new Date(latestCheck.checked_at + 'Z').getTime()
        : 0;

      if (now - lastCheckTime >= intervalMs) {
        // This monitor is due for a check
        try {
          await runCheck(monitor);
        } catch (error) {
          console.error(`[Scheduler] Error checking monitor ${monitor.id} (${monitor.name}):`, error.message);
        }
      }
    }
  } catch (error) {
    console.error('[Scheduler] Tick error:', error.message);
  }
}

/**
 * Start the monitor scheduler
 * @param {object} io - Socket.io server instance
 */
export function startScheduler(io) {
  ioRef = io;

  // Run first tick immediately
  tick();

  // Then run every 60 seconds
  schedulerInterval = setInterval(tick, 60 * 1000);

  console.log('📡 Monitor scheduler started (checking every 60s)');
}

/**
 * Stop the monitor scheduler
 */
export function stopScheduler() {
  if (schedulerInterval) {
    clearInterval(schedulerInterval);
    schedulerInterval = null;
    console.log('📡 Monitor scheduler stopped');
  }
}

export default { startScheduler, stopScheduler };
