export default {
  id: 'error-tracking',
  title: 'Error Tracking',
  category: 'Features',
  lastUpdated: '2024-03-08',
  content: `## Error Tracking

StatusMy automatically captures unhandled exceptions and unhandled promise rejections. Every error includes a full stack trace, breadcrumbs, and device/browser context.

### How Errors Are Captured

When an error occurs, StatusMy collects:

- **Stack trace** — Full call stack with source file, line, and column numbers
- **Breadcrumbs** — Timeline of events leading up to the error (clicks, navigation, API calls)
- **Context** — Browser, OS, device info, user data, and custom tags
- **Environment** — Release version, environment tag, server name

\`\`\`javascript
// Errors are captured automatically
function riskyOperation() {
  const data = JSON.parse(invalidJson); // Captured!
}

// Or capture manually
try {
  riskyOperation();
} catch (error) {
  StatusMy.captureException(error);
}
\`\`\`

## Issue Grouping

StatusMy intelligently groups similar errors into **Issues**. Instead of seeing 10,000 individual error events, you see one issue with 10,000 occurrences.

Grouping is based on:

1. Exception type and value
2. Stack trace frames (file, function, line)
3. Custom fingerprinting rules

### Custom Fingerprinting

Override default grouping with custom fingerprints:

\`\`\`javascript
Sentry.withScope((scope) => {
  scope.setFingerprint(["database-connection-error"]);
  StatusMy.captureException(error);
});
\`\`\`

## Alerts & Notifications

Configure alerts to get notified when:

- A **new issue** is created
- An issue **regresses** (reoccurs after being resolved)
- Error frequency **exceeds a threshold**
- An issue affects more than **N users**

:::tip
Set up Slack or Microsoft Teams integration for real-time alerts. Go to Settings > Integrations to connect your workspace.
:::

## Enriching Errors

### Add User Context

\`\`\`javascript
StatusMy.setUser({
  id: "user-123",
  email: "user@example.com",
  username: "johndoe",
});
\`\`\`

### Add Custom Tags

\`\`\`javascript
StatusMy.setTag("feature", "checkout");
StatusMy.setTag("subscription", "pro");
\`\`\`

### Add Extra Data

\`\`\`javascript
Sentry.setExtra("order_id", "ORD-12345");
Sentry.setExtra("cart_items", 3);
\`\`\`

:::warning
Never include sensitive data (passwords, credit cards, tokens) in tags or extra data. Use \`beforeSend\` to scrub sensitive information.
:::`
}
