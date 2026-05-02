export default {
  id: 'javascript',
  title: 'JavaScript',
  category: 'Integrations',
  lastUpdated: '2024-03-14',
  content: `## JavaScript Integration

The \`@statusmy/browser\` SDK is the foundation for all JavaScript-based StatusMy integrations. It works in any browser environment.

### Installation

\`\`\`bash
npm install @statusmy/browser --save
\`\`\`

### Basic Setup

\`\`\`javascript
import * as StatusMy from "@statusmy/browser";

StatusMy.init({
  dsn: "https://your-dsn@o0.ingest.statusmy.com/0",
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],
  tracesSampleRate: 1.0,
  replaysOnErrorSampleRate: 1.0,
});
\`\`\`

## Automatic Instrumentation

The browser SDK automatically captures:

- **Unhandled exceptions** — \`window.onerror\`
- **Promise rejections** — \`unhandledrejection\` events
- **Console errors** — \`console.error()\` calls
- **XHR/Fetch requests** — Request/response timing and errors
- **User interactions** — Click breadcrumbs with element selectors

### Manual Error Capture

\`\`\`javascript
// Capture an exception
StatusMy.captureException(new Error("Something broke"));

// Capture a message
StatusMy.captureMessage("User completed checkout");

// Capture with extra context
Sentry.withScope((scope) => {
  scope.setTag("page", "checkout");
  scope.setExtra("cart_total", 99.99);
  StatusMy.captureException(error);
});
\`\`\`

## Source Maps

Upload source maps for readable stack traces in production:

\`\`\`bash
# Install the StatusMy CLI
npm install @statusmy/cli --save-dev

# Upload source maps after build
StatusMy-cli sourcemaps upload --release=1.0.0 ./dist
\`\`\`

:::tip
Use the \`@statusmy/vite-plugin\` or \`@statusmy/webpack-plugin\` to automatically upload source maps during your build process.
:::

## Browser Compatibility

| Browser | Minimum Version |
| --- | --- |
| Chrome | 64+ |
| Firefox | 67+ |
| Safari | 12+ |
| Edge | 79+ |
| IE | Not supported |

:::warning
Internet Explorer is not supported. If you need IE11 support, use \`@statusmy/browser\` v6.x (legacy).
:::`
}
