export default {
  id: 'profiling',
  title: 'Profiling',
  category: 'Features',
  lastUpdated: '2024-02-28',
  content: `## Profiling

Identify slow functions and optimize your code at the line level. Profiling shows you exactly where CPU time is spent during transactions.

### Enabling Profiling

\`\`\`javascript
import * as StatusMy from "@statusmy/react";

StatusMy.init({
  dsn: "...",
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.browserProfilingIntegration(),
  ],
  tracesSampleRate: 1.0,
  profilesSampleRate: 1.0,
});
\`\`\`

:::info
Profiling requires the \`browserTracingIntegration\` to be enabled. Profiles are attached to transactions.
:::

## Reading Flame Graphs

The flame graph shows function call stacks over time:

- **Width** — How much total time a function took
- **Depth** — Call stack depth (parent → child)
- **Color** — Application code vs. library code

### Common Patterns

- **Wide bars at the top** — Functions that take a long time
- **Deep stacks** — Excessive recursion or abstraction layers
- **Repeated patterns** — Functions called too frequently

## Node.js Profiling

\`\`\`javascript
import * as StatusMy from "@statusmy/node";

StatusMy.init({
  dsn: "...",
  integrations: [
    Sentry.nodeProfilingIntegration(),
  ],
  tracesSampleRate: 1.0,
  profilesSampleRate: 1.0,
});
\`\`\`

### What Gets Profiled

- CPU-bound operations (JSON parsing, computation)
- Async operations (database queries, HTTP requests)
- Event loop delays
- Garbage collection pauses

## Optimization Workflow

1. Find slow transactions in **Performance**
2. Open the attached **Profile**
3. Identify the hottest functions in the flame graph
4. Optimize and deploy
5. Compare profiles before/after

:::tip
Focus on the "self time" column — this shows time spent in the function itself, not in its children. High self-time functions are your best optimization targets.
:::`
}
