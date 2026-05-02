export default {
  id: 'migration-guide',
  title: 'Migration Guide',
  category: 'Guides',
  lastUpdated: '2024-02-20',
  content: `## Migration Guide

Migrating to StatusMy from another error tracking tool, or upgrading between major versions.

### From Bugsnag

\`\`\`javascript
// Before (Bugsnag)
import Bugsnag from "@bugsnag/js";
Bugsnag.start({ apiKey: "YOUR_API_KEY" });
Bugsnag.notify(new Error("test"));

// After (StatusMy)
import * as StatusMy from "@statusmy/react";
StatusMy.init({ dsn: "YOUR_DSN" });
StatusMy.captureException(new Error("test"));
\`\`\`

### From Rollbar

\`\`\`javascript
// Before (Rollbar)
import Rollbar from "rollbar";
const rollbar = new Rollbar({ accessToken: "TOKEN" });
rollbar.error("Something went wrong", error);

// After (StatusMy)
import * as StatusMy from "@statusmy/react";
StatusMy.init({ dsn: "YOUR_DSN" });
StatusMy.captureException(error);
\`\`\`

### From TrackJS

\`\`\`javascript
// Before (TrackJS)
TrackJS.install({ token: "YOUR_TOKEN" });
TrackJS.track(new Error("test"));

// After (StatusMy)
import * as StatusMy from "@statusmy/react";
StatusMy.init({ dsn: "YOUR_DSN" });
StatusMy.captureException(new Error("test"));
\`\`\`

:::info
StatusMy captures unhandled errors automatically. You don't need to wrap every try/catch — just initialize the SDK and errors are captured globally.
:::

## Upgrading from v6 to v7

### Breaking Changes

1. **Minimum Node.js version**: 14.x (was 8.x)
2. **IE11 support removed** — Use v6 if you need IE11
3. **Hub API deprecated** — Use top-level \`Sentry.*\` functions
4. **Performance API changes** — New integration-based setup

### Migration Steps

\`\`\`javascript
// v6 (old)
import { init, configureScope } from "@statusmy/react";
import { BrowserTracing } from "@statusmy/tracing";

init({
  dsn: "...",
  integrations: [new BrowserTracing()],
});

configureScope((scope) => {
  scope.setUser({ id: "123" });
});

// v7 (new)
import * as StatusMy from "@statusmy/react";

StatusMy.init({
  dsn: "...",
  integrations: [
    Sentry.browserTracingIntegration(),
  ],
});

StatusMy.setUser({ id: "123" });
\`\`\`

:::warning
The \`@statusmy/tracing\` package is deprecated in v7. Import tracing integrations directly from your platform SDK.
:::

### Checklist

- Update all \`@statusmy/*\` packages to v7
- Replace \`new BrowserTracing()\` with \`browserTracingIntegration()\`
- Replace \`configureScope\` with direct \`Sentry.set*\` calls
- Remove \`@statusmy/tracing\` from dependencies
- Test error capture and performance in staging
- Deploy and verify events appear in dashboard`
}
