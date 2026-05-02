export default {
  id: 'configuration',
  title: 'Configuration',
  category: 'Getting Started',
  lastUpdated: '2024-03-10',
  content: `## Configuration

Configure StatusMy by passing options to \`StatusMy.init()\`. This should be called as early as possible in your application lifecycle.

### Basic Configuration

\`\`\`javascript
import * as StatusMy from "@statusmy/react";

StatusMy.init({
  dsn: "https://your-dsn@statusmy.com/0",
  
  // Environment tag
  environment: process.env.NODE_ENV,
  
  // Release version
  release: "my-app@1.2.3",
  
  // Sample rate for error events (0.0 to 1.0)
  sampleRate: 1.0,
  
  // Sample rate for performance transactions
  tracesSampleRate: 0.2,
});
\`\`\`

## Key Options

### \`dsn\` (required)

Your project's Data Source Name. Found in **Settings > Projects > Client Keys**.

### \`environment\`

Tag events with the current environment. Common values: \`production\`, \`staging\`, \`development\`.

\`\`\`javascript
environment: process.env.NODE_ENV || "development",
\`\`\`

### \`release\`

Associate events with a specific release version. Enables release health tracking and commit integration.

\`\`\`javascript
release: "my-app@" + process.env.npm_package_version,
\`\`\`

### \`tracesSampleRate\`

Controls what percentage of transactions are sent for performance monitoring. Set to \`1.0\` for development, \`0.1-0.2\` for production.

:::tip
Start with a low sample rate in production (0.1) and increase it if you need more data. High sample rates can impact your quota.
:::

## Integrations

Add integrations to extend StatusMy's functionality:

\`\`\`javascript
StatusMy.init({
  dsn: "...",
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration({
      maskAllText: true,
      blockAllMedia: true,
    }),
    Sentry.feedbackIntegration({
      colorScheme: "dark",
    }),
  ],
});
\`\`\`

## Filtering Events

### \`beforeSend\`

Modify or drop events before they're sent:

\`\`\`javascript
beforeSend(event) {
  // Drop events from browser extensions
  if (event.exception?.values?.[0]?.stacktrace?.frames?.some(
    frame => frame.filename?.includes("extension://")
  )) {
    return null;
  }
  return event;
},
\`\`\`

### \`ignoreErrors\`

Ignore specific error messages:

\`\`\`javascript
ignoreErrors: [
  "ResizeObserver loop limit exceeded",
  "Non-Error promise rejection captured",
  /Loading chunk \\d+ failed/,
],
\`\`\`

:::warning
Be careful not to filter out errors you actually want to track. Use \`beforeSend\` logging during development to verify your filters work correctly.
:::`
}
