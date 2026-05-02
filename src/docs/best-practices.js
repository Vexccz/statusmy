export default {
  id: 'best-practices',
  title: 'Best Practices',
  category: 'Guides',
  lastUpdated: '2024-03-02',
  content: `## Best Practices

Follow these guidelines to get the most out of StatusMy in production.

### Set Up Releases

Tag every deployment with a release version:

\`\`\`javascript
StatusMy.init({
  release: "my-app@" + process.env.npm_package_version,
});
\`\`\`

Benefits of release tracking:

- See which release introduced a new issue
- Track release health (crash-free sessions)
- Associate commits with releases for suspect commits

### Use Environments

Separate your data by environment:

\`\`\`javascript
StatusMy.init({
  environment: process.env.NODE_ENV, // "production", "staging", "development"
});
\`\`\`

:::tip
Filter your issue stream by environment to focus on production errors. Staging noise can hide real problems.
:::

### Configure Sampling Wisely

- **Errors**: Keep at \`1.0\` (capture all errors)
- **Transactions**: Start at \`0.1\` in production, increase if needed
- **Replays**: \`0.1\` for sessions, \`1.0\` for error sessions

\`\`\`javascript
StatusMy.init({
  sampleRate: 1.0,           // All errors
  tracesSampleRate: 0.1,     // 10% of transactions
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});
\`\`\`

### Add Context to Errors

The more context you add, the faster you can debug:

\`\`\`javascript
// Set user on login
StatusMy.setUser({
  id: user.id,
  email: user.email,
  subscription: user.plan,
});

// Add tags for filtering
StatusMy.setTag("feature_flag", "new_checkout");
StatusMy.setTag("team", "payments");
\`\`\`

### Filter Noise

Not every error is actionable. Filter out known noise:

\`\`\`javascript
StatusMy.init({
  ignoreErrors: [
    "ResizeObserver loop",
    "Network request failed",
    /Loading chunk \\d+ failed/,
  ],
  denyUrls: [
    /extensions\\//i,
    /^chrome:\\/\\//i,
  ],
});
\`\`\`

:::warning
Be careful not to over-filter. Review your ignore list quarterly to make sure you're not hiding real issues.
:::

### Set Up Alerts

Configure alerts for what matters:

1. **New issue alert** — Get notified of new error types
2. **Regression alert** — Know when resolved issues come back
3. **Threshold alert** — Alert when error rate exceeds normal levels
4. **Crash-free rate** — Alert when crash-free sessions drop below 99%

### Assign Ownership

Use code owners to auto-assign issues:

\`\`\`
# .statusmyrc or in StatusMy UI
path:src/payments/* team:payments
path:src/auth/* team:security
url:*/api/v2/* team:backend
\`\`\`

:::info
Ownership rules ensure the right team sees the right issues. This dramatically reduces triage time.
:::`
}
