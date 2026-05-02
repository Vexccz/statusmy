export default {
  id: 'quick-start',
  title: 'Quick Start',
  category: 'Getting Started',
  lastUpdated: '2024-03-18',
  content: `## Quick Start

Get StatusMy running in your application in under 5 minutes. This guide uses React as an example, but the concepts apply to all platforms.

### Step 1: Install

\`\`\`bash
npm install @statusmy/react --save
\`\`\`

### Step 2: Initialize

Add this to your app's entry point (e.g., \`main.jsx\` or \`index.js\`):

\`\`\`javascript
import * as StatusMy from "@statusmy/react";

StatusMy.init({
  dsn: "https://your-dsn@o0.ingest.statusmy.com/0",
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});
\`\`\`

### Step 3: Verify

Trigger a test error to confirm everything works:

\`\`\`javascript
// Add a button to your app temporarily
<button onClick={() => {
  throw new Error("StatusMy test error!");
}}>
  Break the world
</button>
\`\`\`

:::info
Check your StatusMy dashboard — the error should appear within seconds. Once confirmed, remove the test button.
:::

### Step 4: Add Error Boundary

Wrap your app with StatusMy's error boundary to catch React rendering errors:

\`\`\`javascript
import * as StatusMy from "@statusmy/react";

function App() {
  return (
    <Sentry.ErrorBoundary
      fallback={<p>Something went wrong.</p>}
      showDialog
    >
      <YourApp />
    </Sentry.ErrorBoundary>
  );
}
\`\`\`

## What Happens Next

Once initialized, StatusMy automatically:

- Captures unhandled exceptions and promise rejections
- Records breadcrumbs (clicks, navigation, console logs, XHR requests)
- Tracks page load and navigation performance
- Records session replay on errors

### Customize Your Setup

- Add **user context** so you know who's affected
- Configure **alerting** to get notified via Slack, email, or PagerDuty
- Upload **source maps** for readable stack traces in production
- Set up **release tracking** to correlate deploys with new issues

:::tip
Use \`StatusMy.setUser()\` after login to associate errors with specific users. This makes debugging much easier.
:::`
}
