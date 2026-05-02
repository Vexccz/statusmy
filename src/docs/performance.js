export default {
  id: 'performance',
  title: 'Performance Monitoring',
  category: 'Features',
  lastUpdated: '2024-03-05',
  content: `## Performance Monitoring

Track your application's performance from the frontend to the backend. StatusMy Performance helps you find slow transactions, identify bottlenecks, and monitor web vitals.

### Enabling Performance

\`\`\`javascript
StatusMy.init({
  dsn: "...",
  integrations: [
    Sentry.browserTracingIntegration(),
  ],
  tracesSampleRate: 0.2, // 20% of transactions
});
\`\`\`

## Transaction Tracing

A **transaction** represents a single unit of work — like a page load, API request, or background job. Each transaction contains **spans** that break down where time is spent.

\`\`\`
Transaction: GET /api/users
├── Span: Database Query (45ms)
├── Span: Serialize Response (12ms)
├── Span: Redis Cache Lookup (3ms)
└── Total: 60ms
\`\`\`

### Custom Transactions

\`\`\`javascript
const transaction = Sentry.startTransaction({
  name: "process-order",
  op: "task",
});

// Create child spans
const span = transaction.startChild({
  op: "db.query",
  description: "SELECT * FROM orders WHERE id = ?",
});

await database.query("...");
span.finish();

transaction.finish();
\`\`\`

## Web Vitals

StatusMy automatically tracks Core Web Vitals:

| Metric | Description | Good | Needs Work |
| --- | --- | --- | --- |
| LCP | Largest Contentful Paint | < 2.5s | 2.5s - 4.0s |
| FID | First Input Delay | < 100ms | 100ms - 300ms |
| CLS | Cumulative Layout Shift | < 0.1 | 0.1 - 0.25 |
| FCP | First Contentful Paint | < 1.8s | 1.8s - 3.0s |
| TTFB | Time to First Byte | < 800ms | 800ms - 1.8s |

:::info
Web Vitals are collected automatically when using \`browserTracingIntegration()\`. No additional configuration needed.
:::

## Identifying Slow Queries

The Performance page shows:

- **Slowest transactions** — Sorted by p75/p95 duration
- **Most regressed** — Transactions that got slower recently
- **Related issues** — Errors that occurred during slow transactions

### Database Query Monitoring

\`\`\`javascript
// Node.js - queries are auto-instrumented
const result = await prisma.user.findMany({
  where: { active: true },
  include: { orders: true },
});
// StatusMy captures: query duration, rows returned, query string
\`\`\`

:::tip
Use the **Queries** view to find N+1 queries and slow database operations. Sort by total time to find the biggest impact optimizations.
:::`
}
