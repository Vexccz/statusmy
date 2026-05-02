import AlertLog from '../models/AlertLog.js';

/**
 * Send an alert through a channel
 */
export async function sendAlert(channel, monitor, check) {
  const config = typeof channel.config === 'string' ? JSON.parse(channel.config) : channel.config;

  try {
    switch (channel.type) {
      case 'email':
        console.log(`[Alert] Email to ${config.email}: Monitor "${monitor.name}" is ${check.status}`);
        break;
      case 'webhook':
        await fetch(config.url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            monitor: monitor.name,
            url: monitor.url,
            status: check.status,
            responseTime: check.response_time_ms,
            timestamp: check.checked_at,
          }),
        });
        break;
      case 'slack':
        await fetch(config.webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: `🚨 Monitor "${monitor.name}" is ${check.status} (${monitor.url})`,
          }),
        });
        break;
      case 'discord':
        await fetch(config.webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            content: `🚨 Monitor "${monitor.name}" is ${check.status} (${monitor.url})`,
          }),
        });
        break;
      case 'telegram':
        await fetch(`https://api.telegram.org/bot${config.botToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: config.chatId,
            text: `🚨 Monitor "${monitor.name}" is ${check.status}\n${monitor.url}`,
          }),
        });
        break;
      default:
        console.warn(`[Alert] Unknown channel type: ${channel.type}`);
    }

    // Log success
    AlertLog.create({
      monitorId: monitor.id,
      channelId: channel.id,
      type: check.status === 'down' ? 'down' : 'recovery',
      message: `Monitor "${monitor.name}" is ${check.status}`,
      success: true,
    });
  } catch (error) {
    console.error(`[Alert] Failed to send via ${channel.type}:`, error.message);

    AlertLog.create({
      monitorId: monitor.id,
      channelId: channel.id,
      type: check.status === 'down' ? 'down' : 'recovery',
      message: `Monitor "${monitor.name}" is ${check.status}`,
      success: false,
      errorMessage: error.message,
    });
  }
}

/**
 * Send a test alert through a channel
 */
export async function sendTestAlert(channel) {
  const config = typeof channel.config === 'string' ? JSON.parse(channel.config) : channel.config;

  switch (channel.type) {
    case 'email':
      console.log(`[Test Alert] Email to ${config.email}: This is a test alert from StatusMy`);
      break;
    case 'webhook':
      await fetch(config.url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ test: true, message: 'Test alert from StatusMy' }),
      });
      break;
    case 'slack':
      await fetch(config.webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: '✅ Test alert from StatusMy - your Slack integration is working!' }),
      });
      break;
    case 'discord':
      await fetch(config.webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: '✅ Test alert from StatusMy - your Discord integration is working!' }),
      });
      break;
    case 'telegram':
      await fetch(`https://api.telegram.org/bot${config.botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: config.chatId,
          text: '✅ Test alert from StatusMy - your Telegram integration is working!',
        }),
      });
      break;
    default:
      throw new Error(`Unknown channel type: ${channel.type}`);
  }
}

export default { sendAlert, sendTestAlert };
