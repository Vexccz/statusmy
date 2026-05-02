export default {
  id: 'troubleshooting',
  title: 'Troubleshooting',
  category: 'Guides',
  lastUpdated: '2024-03-16',
  content: `## Troubleshooting

Common issues and solutions when working with Sentry.

### Events Not Appearing

If errors aren't showing up in your StatusMy dashboard:

1. **Check your DSN** — Make sure it's correct and matches your project
2. **Check the console** — Look for StatusMy initialization errors
3. **Verify the SDK is loaded** — Run \`Sentry.getCurrentHub().getClient()\` in the console
4. **Check sample rate** — A \`sampleRate\` of \`0\` means no events are sent

\`\`\`javascript
// Debug mode - logs events to console instead of sending
StatusMy.init({
  dsn: "...",
  debug: true, // Enable debug logging
});
\`\`\`

:::tip
Enable \`debug: true\` during development to see exactly what StatusMy is doing. Remember to disable it in production.
:::

### Source Maps Not Working

Stack traces showing minified code? Check these:

1. **Upload source maps** — Run \`StatusMy-cli sourcemaps upload\` after build
2. **Match release** — The \`release\` in \`StatusMy.init()\` must match the upload
3. **Correct paths** — Source map URLs must match the deployed file URLs

\`\`\`bash
# Verify source maps are uploaded
StatusMy-cli releases files 1.0.0 list

# Upload with URL prefix
StatusMy-cli sourcemaps upload \\
  --release=1.0.0 \\
  --url-prefix="~/static/js" \\
  ./build/static/js
\`\`\`

### Performance Data Missing

- Ensure \`browserTracingIntegration()\` is in your integrations
- Check \`tracesSampleRate\` is greater than 0
- Verify the SDK version supports performance (v7+)

### CORS Errors

If you see CORS errors when sending events:

\`\`\`
Access to fetch at 'https://o0.ingest.statusmy.com/...' has been blocked by CORS
\`\`\`

:::warning
This usually means your DSN is incorrect or your ad blocker is blocking Sentry. Try using a tunnel to proxy events through your own server.
:::

### Large Bundle Size

Reduce the SDK's impact on bundle size:

\`\`\`javascript
// Import only what you need
import { init, captureException } from "@statusmy/react";

// Use tree-shaking friendly imports
import { browserTracingIntegration } from "@statusmy/react";
\`\`\`

### Common Error Messages

| Error | Solution |
| --- | --- |
| Invalid DSN | Check DSN format and project ID |
| Rate limited | Reduce sample rate or upgrade plan |
| Payload too large | Reduce context/breadcrumb data |
| Network error | Check firewall/proxy settings |`
}
