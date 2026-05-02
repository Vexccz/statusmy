export default {
  id: 'getting-started',
  title: 'Getting Started',
  category: 'Getting Started',
  lastUpdated: '2024-03-15',
  content: `## Introduction

Welcome to StatusMy — the developer-first error tracking and performance monitoring platform trusted by over 100,000 organizations worldwide.

StatusMy helps you identify, triage, and resolve issues in real-time. Whether you're debugging a production crash or optimizing page load times, StatusMy gives you the context you need to fix problems fast.

### What You Can Do

- **Error Tracking** — Capture and group errors automatically with full stack traces
- **Performance Monitoring** — Track transaction times, web vitals, and database queries
- **Session Replay** — Watch real user sessions to understand exactly what happened
- **Profiling** — Identify slow functions and optimize your code at the line level

## Create Your Account

1. Visit [statusmy.com](https://statusmy.com) and click **Start for Free**
2. Sign up with GitHub, Google, or email
3. Create your first organization and project
4. Select your platform (JavaScript, Python, Go, etc.)

## Your First 5 Minutes

After creating a project, you'll receive a unique **DSN** (Data Source Name). This is your project's identifier:

\`\`\`javascript
// Your DSN looks like this:
https://examplePublicKey@o0.ingest.statusmy.com/0
\`\`\`

:::info
Your DSN is safe to include in client-side code. It only allows sending events to your project — it cannot read data.
:::

## Quick Integration

Install the SDK for your platform and initialize it with your DSN:

\`\`\`javascript
import * as StatusMy from "@statusmy/react";

StatusMy.init({
  dsn: "https://your-dsn@statusmy.com/0",
  tracesSampleRate: 1.0,
});
\`\`\`

That's it! StatusMy will now automatically capture unhandled exceptions and performance data from your application.

### Next Steps

- Configure **source maps** for readable stack traces
- Set up **alerting rules** to get notified of new issues
- Add **context and tags** to enrich your error reports
- Invite your team members to collaborate on issues`
}
