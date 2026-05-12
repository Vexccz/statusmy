import{c as k,j as e,R as z,T as F,d as B,a as L,r as u,m as N,L as R,X as q,M as G}from"./index-C9twagMd.js";import{u as H}from"./use-reduced-motion-BZ0qJjt3.js";import{S as W}from"./search-DpfQzMML.js";import{C as K}from"./code-xml-CKc7LvaM.js";import{Z as V}from"./zap-_U-IQbEQ.js";import{R as Y}from"./rocket-DqljkRgr.js";import{C as J}from"./chevron-down-B3iXNUdL.js";import{C as M}from"./chevron-right-bosTUw0U.js";import{E as X}from"./external-link-BJbhHNCE.js";import{A as $}from"./arrow-left-DRC4briW.js";import{A as Q}from"./arrow-right-DM55u7Wr.js";/**
 * @license lucide-react v1.14.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Z=[["path",{d:"M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20",key:"k3hazp"}]],I=k("book",Z);/**
 * @license lucide-react v1.14.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ee=[["path",{d:"M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z",key:"1oefj6"}],["path",{d:"M14 2v5a1 1 0 0 0 1 1h5",key:"wfsgrz"}],["path",{d:"M10 9H8",key:"b1mrlr"}],["path",{d:"M16 13H8",key:"t4e002"}],["path",{d:"M16 17H8",key:"z1uh3a"}]],te=k("file-text",ee);/**
 * @license lucide-react v1.14.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const se=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M12 16v-4",key:"1dtifu"}],["path",{d:"M12 8h.01",key:"e9boi3"}]],re=k("info",se);/**
 * @license lucide-react v1.14.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ae=[["path",{d:"M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5",key:"1gvzjb"}],["path",{d:"M9 18h6",key:"x1upvd"}],["path",{d:"M10 22h4",key:"ceow96"}]],ne=k("lightbulb",ae),oe={id:"getting-started",title:"Getting Started",category:"Getting Started",lastUpdated:"2024-03-15",content:`## Introduction

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
- Invite your team members to collaborate on issues`},ie={id:"installation",title:"Installation",category:"Getting Started",lastUpdated:"2024-03-12",content:`## Installation

Install the StatusMy SDK for your platform using your preferred package manager.

### JavaScript / Browser

\`\`\`bash
# Using npm
npm install @statusmy/browser --save

# Using yarn
yarn add @statusmy/browser

# Using pnpm
pnpm add @statusmy/browser
\`\`\`

### React

\`\`\`bash
npm install @statusmy/react --save
\`\`\`

### Node.js

\`\`\`bash
npm install @statusmy/node --save
\`\`\`

### CDN (Script Tag)

If you prefer not to use a package manager, include StatusMy via CDN:

\`\`\`html
<script
  src="https://browser.StatusMy-cdn.com/7.x/bundle.min.js"
  crossorigin="anonymous"
><\/script>
\`\`\`

:::warning
The CDN bundle is larger than the npm package and doesn't support tree-shaking. We recommend using npm for production applications.
:::

## Framework-Specific Packages

| Framework | Package | Version |
| --- | --- | --- |
| React | @statusmy/react | 7.x |
| Next.js | @statusmy/nextjs | 7.x |
| Vue | @statusmy/vue | 7.x |
| Angular | @statusmy/angular | 7.x |
| Svelte | @statusmy/svelte | 7.x |
| Remix | @statusmy/remix | 7.x |

## Verify Installation

After installing, verify the package is available:

\`\`\`javascript
import * as StatusMy from "@statusmy/react";
console.log(Sentry.SDK_VERSION); // Should print the version
\`\`\`

## Requirements

- **Node.js**: 14.x or higher
- **Browser**: Chrome 64+, Firefox 67+, Safari 12+, Edge 79+
- **TypeScript**: 4.0+ (optional, types included)

:::info
All StatusMy JavaScript SDKs are written in TypeScript and ship with type definitions out of the box. No need to install \`@types\` packages.
:::

### Peer Dependencies

The React SDK requires:
- \`react\` >= 16.8.0
- \`react-dom\` >= 16.8.0

These are listed as peer dependencies and won't be installed automatically.`},ce={id:"configuration",title:"Configuration",category:"Getting Started",lastUpdated:"2024-03-10",content:`## Configuration

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
:::`},le={id:"quick-start",title:"Quick Start",category:"Getting Started",lastUpdated:"2024-03-18",content:`## Quick Start

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
:::`},de={id:"error-tracking",title:"Error Tracking",category:"Features",lastUpdated:"2024-03-08",content:`## Error Tracking

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
:::`},ue={id:"performance",title:"Performance Monitoring",category:"Features",lastUpdated:"2024-03-05",content:`## Performance Monitoring

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
:::`},pe={id:"session-replay",title:"Session Replay",category:"Features",lastUpdated:"2024-03-01",content:`## Session Replay

Watch real user sessions to understand exactly what happened before, during, and after an error. Session Replay provides a video-like reproduction of user interactions.

### Enabling Replay

\`\`\`javascript
StatusMy.init({
  dsn: "...",
  integrations: [
    Sentry.replayIntegration({
      // Capture 10% of all sessions
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],
  // Record 10% of sessions normally
  replaysSessionSampleRate: 0.1,
  // Always record sessions with errors
  replaysOnErrorSampleRate: 1.0,
});
\`\`\`

## What Gets Recorded

Session Replay captures:

- **DOM mutations** — Every visual change to the page
- **Mouse movements** — Cursor position and clicks
- **Scrolling** — Scroll position changes
- **Form inputs** — Typed values (masked by default)
- **Network requests** — XHR/fetch timing and status
- **Console logs** — Errors, warnings, and info messages

:::warning
By default, all text is masked and media is blocked for privacy. Configure \`maskAllText: false\` only if your privacy policy allows it.
:::

## Privacy Controls

### Masking Sensitive Data

\`\`\`html
<!-- Block entire elements -->
<div class="StatusMy-block">
  <p>This content won't be recorded</p>
</div>

<!-- Mask text content -->
<input class="StatusMy-mask" type="text" />

<!-- Ignore specific elements -->
<button class="StatusMy-ignore">Click me</button>
\`\`\`

### Configuration Options

\`\`\`javascript
Sentry.replayIntegration({
  maskAllText: true,        // Mask all text as *****
  blockAllMedia: true,      // Replace images/video with placeholder
  maskAllInputs: true,      // Mask form input values
  networkDetailAllowUrls: [ // Only capture body for these URLs
    "https://api.yourapp.com",
  ],
}),
\`\`\`

## Viewing Replays

Replays are linked to error events. From any issue:

1. Click on an event with a replay icon
2. Watch the session timeline
3. See the exact moment the error occurred
4. Review breadcrumbs alongside the replay

### Replay Controls

- **Play/Pause** — Control playback
- **Speed** — 1x, 2x, 4x, 8x playback speed
- **Skip inactivity** — Jump over idle periods
- **Timeline** — Scrub to any point in the session

:::tip
Use the **Dead Clicks** and **Rage Clicks** filters to find UX issues where users repeatedly click on non-interactive elements.
:::`},me={id:"profiling",title:"Profiling",category:"Features",lastUpdated:"2024-02-28",content:`## Profiling

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
:::`},ge={id:"javascript",title:"JavaScript",category:"Integrations",lastUpdated:"2024-03-14",content:`## JavaScript Integration

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
:::`},ye={id:"python",title:"Python",category:"Integrations",lastUpdated:"2024-03-11",content:`## Python Integration

The \`StatusMy-sdk\` package supports Python 3.7+ and integrates with popular frameworks like Django, Flask, FastAPI, and Celery.

### Installation

\`\`\`bash
pip install StatusMy-sdk
\`\`\`

### Basic Setup

\`\`\`python
import statusmy_sdk

statusmy_sdk.init(
    dsn="https://your-dsn@o0.ingest.statusmy.com/0",
    traces_sample_rate=1.0,
    profiles_sample_rate=1.0,
)
\`\`\`

## Framework Integrations

### Django

\`\`\`python
import statusmy_sdk

statusmy_sdk.init(
    dsn="...",
    integrations=[
        statusmy_sdk.integrations.django.DjangoIntegration(),
    ],
    traces_sample_rate=1.0,
    send_default_pii=True,
)
\`\`\`

### Flask

\`\`\`python
import statusmy_sdk
from statusmy_sdk.integrations.flask import FlaskIntegration

statusmy_sdk.init(
    dsn="...",
    integrations=[FlaskIntegration()],
    traces_sample_rate=1.0,
)

app = Flask(__name__)
\`\`\`

### FastAPI

\`\`\`python
import statusmy_sdk

statusmy_sdk.init(
    dsn="...",
    traces_sample_rate=1.0,
    enable_tracing=True,
)

app = FastAPI()
\`\`\`

## Capturing Errors

\`\`\`python
# Automatic - unhandled exceptions are captured
def divide(a, b):
    return a / b  # ZeroDivisionError captured automatically

# Manual capture
try:
    risky_operation()
except Exception as e:
    statusmy_sdk.capture_exception(e)

# Capture a message
statusmy_sdk.capture_message("Something noteworthy happened")
\`\`\`

:::info
The Python SDK auto-detects installed frameworks and enables integrations automatically. You usually don't need to configure integrations manually.
:::

## Celery Integration

\`\`\`python
import statusmy_sdk
from statusmy_sdk.integrations.celery import CeleryIntegration

statusmy_sdk.init(
    dsn="...",
    integrations=[CeleryIntegration()],
)
\`\`\`

:::tip
Enable \`send_default_pii=True\` to automatically attach user information from Django's authentication system to error events.
:::`},he={id:"ruby",title:"Ruby",category:"Integrations",lastUpdated:"2024-03-06",content:`## Ruby Integration

The \`StatusMy-ruby\` gem provides error tracking and performance monitoring for Ruby applications, with dedicated support for Rails, Sidekiq, and Delayed Job.

### Installation

\`\`\`bash
# Add to your Gemfile
gem "StatusMy-ruby"
gem "StatusMy-rails"  # For Rails applications
gem "StatusMy-sidekiq" # For Sidekiq workers

bundle install
\`\`\`

### Rails Setup

Create an initializer at \`config/initializers/sentry.rb\`:

\`\`\`ruby
StatusMy.init do |config|
  config.dsn = "https://your-dsn@o0.ingest.statusmy.com/0"
  config.breadcrumbs_logger = [:active_support_logger, :http_logger]
  config.traces_sample_rate = 0.5
  config.send_default_pii = true
end
\`\`\`

## Error Capture

\`\`\`ruby
# Automatic - unhandled exceptions in controllers
class UsersController < ApplicationController
  def show
    @user = User.find(params[:id]) # RecordNotFound captured
  end
end

# Manual capture
begin
  risky_operation
rescue => e
  Sentry.capture_exception(e)
end

# Capture with context
Sentry.with_scope do |scope|
  scope.set_tags(feature: "payments")
  scope.set_user(id: current_user.id)
  Sentry.capture_message("Payment processed")
end
\`\`\`

## Sidekiq Integration

\`\`\`ruby
# config/initializers/sentry.rb
StatusMy.init do |config|
  config.dsn = "..."
  config.enabled_environments = %w[production staging]
end
\`\`\`

:::info
The Sidekiq integration automatically captures errors in background jobs and includes job metadata (class, queue, arguments) in the error report.
:::

## Performance Monitoring

\`\`\`ruby
StatusMy.init do |config|
  config.dsn = "..."
  config.traces_sample_rate = 0.2
  config.traces_sampler = lambda do |context|
    if context[:parent_sampled]
      true
    elsif context[:transaction_context][:name] == "/health"
      0.0  # Don't trace health checks
    else
      0.2
    end
  end
end
\`\`\`

:::tip
Use \`traces_sampler\` instead of \`traces_sample_rate\` for fine-grained control over which transactions are sampled.
:::`},fe={id:"go",title:"Go",category:"Integrations",lastUpdated:"2024-03-03",content:`## Go Integration

The \`statusmy-go\` SDK provides error tracking and performance monitoring for Go applications, with integrations for \`net/http\`, Gin, Echo, and Fiber.

### Installation

\`\`\`bash
go get github.com/getstatusmy/statusmy-go
\`\`\`

### Basic Setup

\`\`\`go
package main

import (
    "log"
    "time"
    "github.com/getstatusmy/statusmy-go"
)

func main() {
    err := StatusMy.init(sentry.ClientOptions{
        Dsn:              "https://your-dsn@o0.ingest.statusmy.com/0",
        TracesSampleRate: 1.0,
        Environment:      "production",
        Release:          "my-app@1.0.0",
    })
    if err != nil {
        log.Fatalf("StatusMy.init: %s", err)
    }
    defer sentry.Flush(2 * time.Second)
}
\`\`\`

:::warning
Always call \`sentry.Flush()\` before your application exits to ensure all events are sent. Use \`defer\` in \`main()\`.
:::

## HTTP Integration

### net/http

\`\`\`go
import sentryhttp "github.com/getstatusmy/statusmy-go/http"

handler := sentryhttp.New(sentryhttp.Options{
    Repanic: true,
})

http.Handle("/", handler.Handle(&MyHandler{}))
\`\`\`

### Gin

\`\`\`go
import sentrygin "github.com/getstatusmy/statusmy-go/gin"

router := gin.Default()
router.Use(sentrygin.New(sentrygin.Options{
    Repanic: true,
}))
\`\`\`

## Error Capture

\`\`\`go
// Capture an error
if err != nil {
    StatusMy.captureException(err)
}

// Capture with context
sentry.WithScope(func(scope *sentry.Scope) {
    scope.SetTag("module", "payments")
    scope.SetUser(sentry.User{ID: "user-123"})
    StatusMy.captureException(err)
})

// Recover from panics
defer func() {
    if r := recover(); r != nil {
        sentry.CurrentHub().Recover(r)
        sentry.Flush(time.Second * 5)
    }
}()
\`\`\`

## Performance Monitoring

\`\`\`go
span := sentry.StartSpan(ctx, "db.query",
    sentry.WithDescription("SELECT * FROM users"),
)
defer span.Finish()

// Execute your query
rows, err := db.QueryContext(span.Context(), query)
\`\`\`

:::tip
Use \`sentry.StartSpan\` with the parent context to create child spans. This automatically builds the transaction tree.
:::`},be={id:"java",title:"Java",category:"Integrations",lastUpdated:"2024-02-25",content:`## Java Integration

The \`StatusMy-java\` SDK supports Java 8+ and integrates with Spring Boot, Spring MVC, Logback, and Log4j2.

### Installation (Maven)

\`\`\`xml
<dependency>
  <groupId>io.StatusMy</groupId>
  <artifactId>StatusMy-spring-boot-starter-jakarta</artifactId>
  <version>7.0.0</version>
</dependency>
\`\`\`

### Installation (Gradle)

\`\`\`groovy
implementation 'io.StatusMy:StatusMy-spring-boot-starter-jakarta:7.0.0'
\`\`\`

## Spring Boot Setup

Add your DSN to \`application.properties\`:

\`\`\`bash
sentry.dsn=https://your-dsn@o0.ingest.statusmy.com/0
sentry.traces-sample-rate=1.0
sentry.environment=production
\`\`\`

:::info
The Spring Boot starter auto-configures Sentry. No additional code is needed for basic error tracking.
:::

## Manual Error Capture

\`\`\`java
import io.sentry.StatusMy;

try {
    riskyOperation();
} catch (Exception e) {
    StatusMy.captureException(e);
}

// With context
Sentry.configureScope(scope -> {
    scope.setTag("module", "checkout");
    scope.setUser(new User() {{ setId("user-123"); }});
});
\`\`\`

## Logback Integration

\`\`\`xml
<!-- logback.xml -->
<configuration>
  <appender name="StatusMy"
    class="io.sentry.logback.SentryAppender">
    <options>
      <dsn>https://your-dsn@statusmy.com/0</dsn>
    </options>
    <minimumEventLevel>ERROR</minimumEventLevel>
    <minimumBreadcrumbLevel>INFO</minimumBreadcrumbLevel>
  </appender>

  <root level="INFO">
    <appender-ref ref="StatusMy" />
  </root>
</configuration>
\`\`\`

## Performance Monitoring

\`\`\`java
import io.sentry.ITransaction;
import io.sentry.ISpan;
import io.sentry.StatusMy;

ITransaction transaction = Sentry.startTransaction(
    "processOrder", "task"
);

ISpan span = transaction.startChild(
    "db.query", "SELECT * FROM orders"
);
// ... execute query
span.finish();

transaction.finish();
\`\`\`

:::tip
Spring Boot automatically creates transactions for incoming HTTP requests. You only need to create custom transactions for background tasks.
:::`},xe={id:"api-authentication",title:"Authentication",category:"API Reference",lastUpdated:"2024-03-13",content:`## Authentication

The StatusMy API uses bearer token authentication. All requests must include an \`Authorization\` header with a valid auth token.

### Creating an Auth Token

1. Go to **Settings > Auth Tokens**
2. Click **Create New Token**
3. Select the required scopes
4. Copy the token (it won't be shown again)

### Using the Token

\`\`\`bash
curl -H "Authorization: Bearer YOUR_AUTH_TOKEN" \\
  https://statusmy.com/api/0/projects/
\`\`\`

\`\`\`javascript
const response = await fetch("https://statusmy.com/api/0/projects/", {
  headers: {
    "Authorization": "Bearer YOUR_AUTH_TOKEN",
    "Content-Type": "application/json",
  },
});
\`\`\`

:::warning
Never expose auth tokens in client-side code or commit them to version control. Use environment variables or a secrets manager.
:::

## Token Scopes

| Scope | Description |
| --- | --- |
| project:read | Read project settings |
| project:write | Modify project settings |
| event:read | Read error events |
| event:write | Create/update events |
| member:read | Read organization members |
| org:read | Read organization settings |
| team:read | Read team information |

## Rate Limiting

API requests are rate-limited per token:

- **Standard**: 100 requests per minute
- **Burst**: Up to 200 requests in a 10-second window

Rate limit headers are included in every response:

\`\`\`
X-StatusMy-Rate-Limit-Limit: 100
X-StatusMy-Rate-Limit-Remaining: 87
X-StatusMy-Rate-Limit-Reset: 1709312400
\`\`\`

:::info
If you receive a \`429 Too Many Requests\` response, wait until the \`X-StatusMy-Rate-Limit-Reset\` timestamp before retrying.
:::

## Error Responses

\`\`\`json
{
  "detail": "Authentication credentials were not provided."
}
\`\`\`

| Status Code | Meaning |
| --- | --- |
| 401 | Invalid or missing auth token |
| 403 | Token lacks required scope |
| 429 | Rate limit exceeded |`},Se={id:"api-events",title:"Events",category:"API Reference",lastUpdated:"2024-03-09",content:`## Events API

Retrieve and manage error events and issues through the REST API.

### List Project Issues

\`\`\`bash
GET /api/0/projects/{org_slug}/{project_slug}/issues/
\`\`\`

\`\`\`bash
curl -H "Authorization: Bearer TOKEN" \\
  "https://statusmy.com/api/0/projects/my-org/my-project/issues/?query=is:unresolved"
\`\`\`

**Response:**

\`\`\`json
[
  {
    "id": "1234567890",
    "title": "TypeError: Cannot read property 'map' of undefined",
    "culprit": "app/components/UserList.jsx",
    "count": 142,
    "userCount": 89,
    "firstSeen": "2024-03-01T10:00:00Z",
    "lastSeen": "2024-03-15T14:30:00Z",
    "level": "error",
    "status": "unresolved",
    "platform": "javascript"
  }
]
\`\`\`

### Get Issue Details

\`\`\`bash
GET /api/0/issues/{issue_id}/
\`\`\`

### List Issue Events

\`\`\`bash
GET /api/0/issues/{issue_id}/events/
\`\`\`

**Response:**

\`\`\`json
[
  {
    "eventID": "abc123",
    "dateCreated": "2024-03-15T14:30:00Z",
    "user": {
      "id": "user-456",
      "email": "user@example.com"
    },
    "tags": [
      { "key": "browser", "value": "Chrome 122" },
      { "key": "os", "value": "macOS 14.3" }
    ],
    "context": {
      "device": { "family": "Mac" },
      "browser": { "name": "Chrome", "version": "122.0" }
    }
  }
]
\`\`\`

## Update Issue Status

\`\`\`bash
PUT /api/0/issues/{issue_id}/
\`\`\`

\`\`\`bash
curl -X PUT \\
  -H "Authorization: Bearer TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{"status": "resolved"}' \\
  "https://statusmy.com/api/0/issues/1234567890/"
\`\`\`

:::info
Valid status values: \`resolved\`, \`unresolved\`, \`ignored\`. Use \`substatus\` for more granular control.
:::

## Query Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| query | string | Search query (e.g., \`is:unresolved\`) |
| sort | string | Sort by: \`date\`, \`new\`, \`priority\`, \`freq\` |
| limit | number | Results per page (max 100) |
| cursor | string | Pagination cursor |

:::tip
Use the \`query\` parameter with StatusMy's search syntax: \`is:unresolved assigned:me level:error browser:Chrome\`.
:::`},ve={id:"api-projects",title:"Projects",category:"API Reference",lastUpdated:"2024-03-07",content:`## Projects API

Manage projects within your StatusMy organization.

### List Projects

\`\`\`bash
GET /api/0/projects/
\`\`\`

\`\`\`bash
curl -H "Authorization: Bearer TOKEN" \\
  "https://statusmy.com/api/0/projects/"
\`\`\`

**Response:**

\`\`\`json
[
  {
    "id": "5678",
    "slug": "my-react-app",
    "name": "My React App",
    "platform": "javascript-react",
    "dateCreated": "2024-01-15T08:00:00Z",
    "isBookmarked": false,
    "team": {
      "id": "1234",
      "slug": "frontend",
      "name": "Frontend Team"
    },
    "organization": {
      "id": "9012",
      "slug": "my-org",
      "name": "My Organization"
    }
  }
]
\`\`\`

### Create a Project

\`\`\`bash
POST /api/0/teams/{org_slug}/{team_slug}/projects/
\`\`\`

\`\`\`bash
curl -X POST \\
  -H "Authorization: Bearer TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{"name": "New Project", "platform": "javascript-react"}' \\
  "https://statusmy.com/api/0/teams/my-org/frontend/projects/"
\`\`\`

### Update a Project

\`\`\`bash
PUT /api/0/projects/{org_slug}/{project_slug}/
\`\`\`

\`\`\`bash
curl -X PUT \\
  -H "Authorization: Bearer TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{"name": "Updated Name", "slug": "new-slug"}' \\
  "https://statusmy.com/api/0/projects/my-org/my-react-app/"
\`\`\`

### Delete a Project

\`\`\`bash
DELETE /api/0/projects/{org_slug}/{project_slug}/
\`\`\`

:::warning
Deleting a project permanently removes all associated data including events, issues, and settings. This action cannot be undone.
:::

## Project Client Keys (DSN)

### List Client Keys

\`\`\`bash
GET /api/0/projects/{org_slug}/{project_slug}/keys/
\`\`\`

**Response:**

\`\`\`json
[
  {
    "id": "key-abc",
    "name": "Default",
    "dsn": {
      "public": "https://abc@o0.ingest.statusmy.com/5678",
      "secret": "https://abc:xyz@o0.ingest.statusmy.com/5678"
    },
    "isActive": true,
    "dateCreated": "2024-01-15T08:00:00Z"
  }
]
\`\`\`

:::info
Each project can have multiple client keys. Use separate keys for different environments or deployment targets.
:::`},ke={id:"api-teams",title:"Teams",category:"API Reference",lastUpdated:"2024-03-04",content:`## Teams API

Manage teams and team membership within your organization.

### List Teams

\`\`\`bash
GET /api/0/organizations/{org_slug}/teams/
\`\`\`

\`\`\`bash
curl -H "Authorization: Bearer TOKEN" \\
  "https://statusmy.com/api/0/organizations/my-org/teams/"
\`\`\`

**Response:**

\`\`\`json
[
  {
    "id": "1234",
    "slug": "frontend",
    "name": "Frontend Team",
    "dateCreated": "2024-01-10T08:00:00Z",
    "memberCount": 8,
    "projects": [
      { "id": "5678", "slug": "react-app" },
      { "id": "5679", "slug": "marketing-site" }
    ]
  }
]
\`\`\`

### Create a Team

\`\`\`bash
POST /api/0/organizations/{org_slug}/teams/
\`\`\`

\`\`\`bash
curl -X POST \\
  -H "Authorization: Bearer TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{"name": "Backend Team", "slug": "backend"}' \\
  "https://statusmy.com/api/0/organizations/my-org/teams/"
\`\`\`

### Add Member to Team

\`\`\`bash
POST /api/0/organizations/{org_slug}/members/{member_id}/teams/{team_slug}/
\`\`\`

### Remove Member from Team

\`\`\`bash
DELETE /api/0/organizations/{org_slug}/members/{member_id}/teams/{team_slug}/
\`\`\`

## Team Roles

| Role | Permissions |
| --- | --- |
| Contributor | View issues, comment, resolve |
| Admin | All contributor permissions + manage team settings |
| Manager | All admin permissions + add/remove members |

:::info
Team roles are separate from organization roles. A user can be an org-level member but a team-level admin.
:::

## Team Notifications

Configure notification rules per team:

\`\`\`bash
PUT /api/0/teams/{org_slug}/{team_slug}/notification-settings/
\`\`\`

\`\`\`json
{
  "alerts": {
    "new_issue": "always",
    "regression": "always",
    "resolved": "never"
  },
  "workflow": {
    "assigned": "always",
    "mentioned": "always"
  }
}
\`\`\`

:::tip
Use team-based alerting to route notifications to the right people. Assign projects to teams, then configure team notification preferences.
:::`},we={id:"troubleshooting",title:"Troubleshooting",category:"Guides",lastUpdated:"2024-03-16",content:`## Troubleshooting

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
| Network error | Check firewall/proxy settings |`},je={id:"best-practices",title:"Best Practices",category:"Guides",lastUpdated:"2024-03-02",content:`## Best Practices

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
:::`},Me={id:"migration-guide",title:"Migration Guide",category:"Guides",lastUpdated:"2024-02-20",content:`## Migration Guide

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
- Deploy and verify events appear in dashboard`},S=[oe,ie,ce,le,de,ue,pe,me,ge,ye,he,fe,be,xe,Se,ve,ke,we,je,Me],v=[{name:"Getting Started",docs:["getting-started","installation","configuration","quick-start"]},{name:"Features",docs:["error-tracking","performance","session-replay","profiling"]},{name:"Integrations",docs:["javascript","python","ruby","go","java"]},{name:"API Reference",docs:["api-authentication","api-events","api-projects","api-teams"]},{name:"Guides",docs:["troubleshooting","best-practices","migration-guide"]}];function E(l){return S.find(s=>s.id===l)}function Te(l){const s=v.find(a=>a.docs.includes(l));return s?s.name:null}function Ce(l){const s=v.flatMap(t=>t.docs),a=s.indexOf(l);return{prev:a>0?S.find(t=>t.id===s[a-1]):null,next:a<s.length-1?S.find(t=>t.id===s[a+1]):null}}function Ne(l){if(!l||l.trim().length<2)return[];const s=l.toLowerCase();return S.filter(a=>a.title.toLowerCase().includes(s)||a.content.toLowerCase().includes(s))}function g(l){const s=[];let a=l,t=0;for(;a.length>0;){const n=a.match(/\*\*(.+?)\*\*/),c=a.match(/`([^`]+)`/);let r=null,i=a.length;if(n&&n.index<i&&(r={type:"bold",match:n},i=n.index),c&&c.index<i&&(r={type:"code",match:c},i=c.index),!r){s.push(a);break}i>0&&s.push(a.substring(0,i)),r.type==="bold"?(s.push(e.jsx("strong",{className:"font-semibold text-text-primary",children:r.match[1]},t++)),a=a.substring(i+r.match[0].length)):r.type==="code"&&(s.push(e.jsx("code",{className:"px-1.5 py-0.5 rounded bg-card/80 border border-border text-brand-light text-[0.85em] font-mono",children:r.match[1]},t++)),a=a.substring(i+r.match[0].length))}return s}function Re(l){const s=l.filter(c=>!c.match(/^\|\s*---/));if(s.length<1)return null;const a=c=>c.split("|").filter(r=>r.trim()).map(r=>r.trim()),t=a(s[0]),n=s.slice(1).map(a);return e.jsx("div",{className:"overflow-x-auto my-4 rounded-lg border border-border",children:e.jsxs("table",{className:"w-full text-body-sm",children:[e.jsx("thead",{children:e.jsx("tr",{className:"bg-card/50 border-b border-border",children:t.map((c,r)=>e.jsx("th",{className:"px-4 py-2.5 text-left font-semibold text-text-primary",children:g(c)},r))})}),e.jsx("tbody",{children:n.map((c,r)=>e.jsx("tr",{className:"border-b border-border last:border-0",children:c.map((i,d)=>e.jsx("td",{className:"px-4 py-2.5 text-text-secondary",children:g(i)},d))},r))})]})})}function Ee({type:l,children:s}){const a={info:{icon:re,bg:"bg-blue-500/5",border:"border-blue-500/20",iconColor:"text-blue-400",title:"Info"},warning:{icon:F,bg:"bg-amber-500/5",border:"border-amber-500/20",iconColor:"text-amber-400",title:"Warning"},tip:{icon:ne,bg:"bg-emerald-500/5",border:"border-emerald-500/20",iconColor:"text-emerald-400",title:"Tip"}},t=a[l]||a.info,n=t.icon;return e.jsx("div",{className:`my-4 p-4 rounded-lg border ${t.border} ${t.bg}`,children:e.jsxs("div",{className:"flex gap-3",children:[e.jsx(n,{size:18,className:`${t.iconColor} flex-shrink-0 mt-0.5`}),e.jsx("div",{className:"text-body-sm text-text-secondary leading-relaxed",children:s})]})})}function Ie(l){if(!l)return[];const s=l.split(`
`),a=[];let t=!1;for(const n of s){if(n.trim().startsWith("```")){t=!t;continue}t||(n.startsWith("## ")?a.push({level:2,text:n.replace("## ",""),id:n.replace("## ","").toLowerCase().replace(/[^a-z0-9]+/g,"-")}):n.startsWith("### ")&&a.push({level:3,text:n.replace("### ",""),id:n.replace("### ","").toLowerCase().replace(/[^a-z0-9]+/g,"-")}))}return a}function Ae(l){if(!l)return null;const s=l.split(`
`),a=[];let t=0,n=0;for(;t<s.length;){const c=s[t];if(c.trim().startsWith("```")){const r=c.trim().replace("```","").trim(),i=[];for(t++;t<s.length&&!s[t].trim().startsWith("```");)i.push(s[t]),t++;t++,a.push(e.jsxs("div",{className:"my-4 rounded-lg border border-border bg-[#0d0d14] overflow-hidden",children:[r&&e.jsx("div",{className:"flex items-center px-4 py-2 border-b border-border bg-card/30",children:e.jsx("span",{className:"text-caption text-text-muted font-mono",children:r})}),e.jsx("div",{className:"p-4 overflow-x-auto",children:e.jsx("pre",{className:"text-body-sm leading-relaxed font-mono text-text-secondary",children:e.jsx("code",{children:i.join(`
`)})})})]},n++));continue}if(c.trim().startsWith(":::")){const r=c.trim().replace(":::","").trim();if(r&&r!==""){const i=[];for(t++;t<s.length&&!s[t].trim().startsWith(":::");)i.push(s[t]),t++;t++,a.push(e.jsx(Ee,{type:r,children:i.map((d,h)=>e.jsxs("span",{children:[g(d),h<i.length-1&&e.jsx("br",{})]},h))},n++));continue}}if(c.trim().startsWith("|")&&t+1<s.length&&s[t+1].trim().match(/^\|\s*---/)){const r=[];for(;t<s.length&&s[t].trim().startsWith("|");)r.push(s[t].trim()),t++;a.push(e.jsx(z.Fragment,{children:Re(r)},n++));continue}if(c.startsWith("## ")){const r=c.replace("## ",""),i=r.toLowerCase().replace(/[^a-z0-9]+/g,"-");a.push(e.jsx("h2",{id:i,className:"text-heading-md text-text-primary mt-10 mb-4 scroll-mt-24",children:r},n++)),t++;continue}if(c.startsWith("### ")){const r=c.replace("### ",""),i=r.toLowerCase().replace(/[^a-z0-9]+/g,"-");a.push(e.jsx("h3",{id:i,className:"text-heading-sm text-text-primary mt-8 mb-3 scroll-mt-24",children:r},n++)),t++;continue}if(c.trim().startsWith("- ")){const r=[];for(;t<s.length&&s[t].trim().startsWith("- ");)r.push(s[t].trim().replace(/^- /,"")),t++;a.push(e.jsx("ul",{className:"my-3 space-y-1.5 ml-4",children:r.map((i,d)=>e.jsxs("li",{className:"text-body-sm text-text-secondary leading-relaxed flex gap-2",children:[e.jsx("span",{className:"text-brand-light mt-1.5 flex-shrink-0",children:"•"}),e.jsx("span",{children:g(i)})]},d))},n++));continue}if(c.trim().match(/^\d+\.\s/)){const r=[];for(;t<s.length&&s[t].trim().match(/^\d+\.\s/);)r.push(s[t].trim().replace(/^\d+\.\s/,"")),t++;a.push(e.jsx("ol",{className:"my-3 space-y-1.5 ml-4",children:r.map((i,d)=>e.jsxs("li",{className:"text-body-sm text-text-secondary leading-relaxed flex gap-2",children:[e.jsxs("span",{className:"text-brand-light font-medium flex-shrink-0 w-5",children:[d+1,"."]}),e.jsx("span",{children:g(i)})]},d))},n++));continue}if(c.trim().startsWith("> ")){const r=[];for(;t<s.length&&s[t].trim().startsWith("> ");)r.push(s[t].trim().replace(/^> /,"")),t++;a.push(e.jsx("blockquote",{className:"my-4 pl-4 border-l-2 border-brand/40 text-body-sm text-text-secondary italic",children:r.map((i,d)=>e.jsxs("span",{children:[g(i),d<r.length-1&&e.jsx("br",{})]},d))},n++));continue}if(c.trim()===""){t++;continue}a.push(e.jsx("p",{className:"text-body-sm text-text-secondary leading-relaxed my-3",children:g(c)},n++)),t++}return e.jsx("div",{className:"doc-content",children:a})}const _e={"Getting Started":Y,Features:V,Integrations:K,"API Reference":te,Guides:I};function We(){const{slug:l}=B(),s=L(),a=H(),t=l||"getting-started",n=E(t),c=n?Te(n.id):null,{prev:r,next:i}=n?Ce(n.id):{prev:null,next:null},[d,h]=u.useState(""),[A,_]=u.useState(()=>{const o={};return v.forEach(p=>{o[p.name]=!0}),o}),[w,j]=u.useState(!1),[P,U]=u.useState(""),T=u.useMemo(()=>n?Ie(n.content):[],[n]),f=u.useMemo(()=>Ne(d),[d]);u.useEffect(()=>{j(!1)},[t]),u.useEffect(()=>{const o=new IntersectionObserver(m=>{for(const x of m)x.isIntersecting&&U(x.target.id)},{rootMargin:"-80px 0px -70% 0px",threshold:0});return document.querySelectorAll(".doc-content h2[id], .doc-content h3[id]").forEach(m=>o.observe(m)),()=>o.disconnect()},[n]),u.useEffect(()=>{l||s("/docs/getting-started",{replace:!0})},[l,s]);const D=u.useCallback(o=>{_(p=>({...p,[o]:!p[o]}))},[]),b=u.useCallback(o=>{s(`/docs/${o}`),h("")},[s]),C=e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"relative mb-6",children:[e.jsx(W,{size:16,className:"absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"}),e.jsx("input",{type:"text",value:d,onChange:o=>h(o.target.value),placeholder:"Search docs...",className:"w-full h-[38px] pl-9 pr-3 rounded-sm bg-card/50 border border-border text-body-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand/60 transition-colors"})]}),d.length>=2&&e.jsxs("div",{className:"mb-6",children:[e.jsxs("p",{className:"text-caption text-text-muted mb-2",children:[f.length," result",f.length!==1?"s":""," found"]}),f.length>0?e.jsx("ul",{className:"space-y-1",children:f.map(o=>e.jsx("li",{children:e.jsxs("button",{onClick:()=>b(o.id),className:`w-full text-left px-3 py-2 rounded-md text-body-sm transition-colors ${t===o.id?"text-brand-light bg-brand-bg font-medium":"text-text-secondary hover:text-text-primary hover:bg-card/30"}`,children:[e.jsx("span",{className:"block",children:o.title}),e.jsx("span",{className:"text-caption text-text-muted",children:o.category})]})},o.id))}):e.jsx("p",{className:"text-body-sm text-text-muted px-3",children:"No docs match your search."})]}),!d&&e.jsx("nav",{className:"space-y-1",children:v.map(o=>{const p=_e[o.name]||I,m=A[o.name],x=o.docs.map(y=>E(y)).filter(Boolean),O=o.docs.includes(t);return e.jsxs("div",{children:[e.jsxs("button",{onClick:()=>D(o.name),className:`w-full flex items-center gap-2 px-3 py-2 rounded-md text-body-sm font-medium transition-colors ${O?"text-text-primary":"text-text-muted hover:text-text-primary"}`,children:[e.jsx(p,{size:14,className:"flex-shrink-0"}),e.jsx("span",{className:"flex-1 text-left",children:o.name}),e.jsx(J,{size:14,className:`transition-transform duration-200 ${m?"":"-rotate-90"}`})]}),m&&e.jsx("ul",{className:"ml-5 mt-0.5 space-y-0.5 border-l border-border pl-3",children:x.map(y=>e.jsx("li",{children:e.jsx("button",{onClick:()=>b(y.id),className:`w-full text-left px-3 py-1.5 rounded-md text-body-sm transition-colors ${t===y.id?"text-brand-light bg-brand-bg font-medium":"text-text-secondary hover:text-text-primary hover:bg-card/30"}`,children:y.title})},y.id))})]},o.name)})})]});return n?e.jsxs(N.main,{id:"main-content",initial:a?{}:{opacity:0,y:8},animate:{opacity:1,y:0},exit:a?{}:{opacity:0,y:-8},transition:{duration:.3},className:"pt-[80px] min-h-screen",children:[e.jsx("div",{className:"lg:hidden sticky top-[80px] z-30 bg-bg/95 backdrop-blur-sm border-b border-border px-4 py-3",children:e.jsxs("button",{onClick:()=>j(!w),className:"flex items-center gap-2 text-body-sm text-text-secondary hover:text-text-primary transition-colors",children:[w?e.jsx(q,{size:18}):e.jsx(G,{size:18}),e.jsx("span",{children:c}),e.jsx(M,{size:14}),e.jsx("span",{className:"text-text-primary font-medium",children:n.title})]})}),w&&e.jsxs("div",{className:"lg:hidden fixed inset-0 z-40 top-[80px]",children:[e.jsx("div",{className:"absolute inset-0 bg-black/50",onClick:()=>j(!1)}),e.jsx("div",{className:"relative w-[300px] max-w-[85vw] h-full bg-bg border-r border-border overflow-y-auto p-6",children:C})]}),e.jsxs("div",{className:"flex",children:[e.jsx("aside",{className:"hidden lg:block w-[260px] flex-shrink-0 border-r border-border bg-surface/30 h-[calc(100vh-80px)] sticky top-[80px] overflow-y-auto",children:e.jsx("div",{className:"p-5",children:C})}),e.jsx("div",{className:"flex-1 min-w-0",children:e.jsxs("div",{className:"max-w-4xl mx-auto px-4 sm:px-6 lg:px-12 py-8 lg:py-12",children:[e.jsxs("div",{className:"flex items-center gap-2 text-caption text-text-muted mb-6",children:[e.jsx(R,{to:"/docs/getting-started",className:"hover:text-text-primary transition-colors",children:"Docs"}),e.jsx(M,{size:12}),e.jsx("span",{className:"text-text-secondary",children:c}),e.jsx(M,{size:12}),e.jsx("span",{className:"text-text-primary",children:n.title})]}),e.jsx("h1",{className:"font-display text-heading-lg text-text-primary mb-2",children:n.title}),e.jsxs("div",{className:"flex items-center gap-4 mb-8 text-caption text-text-muted",children:[e.jsxs("span",{children:["Last updated: ",n.lastUpdated]}),e.jsxs("a",{href:"#",className:"inline-flex items-center gap-1 hover:text-text-primary transition-colors",onClick:o=>o.preventDefault(),children:[e.jsx(X,{size:12}),"Edit on GitHub"]})]}),Ae(n.content),e.jsxs("div",{className:"mt-16 pt-8 border-t border-border grid grid-cols-1 sm:grid-cols-2 gap-4",children:[r?e.jsxs("button",{onClick:()=>b(r.id),className:"group flex flex-col items-start p-4 rounded-lg border border-border hover:border-brand/30 hover:bg-card/20 transition-colors text-left",children:[e.jsxs("span",{className:"text-caption text-text-muted flex items-center gap-1 mb-1",children:[e.jsx($,{size:12}),"Previous"]}),e.jsx("span",{className:"text-body-sm font-medium text-text-primary group-hover:text-brand-light transition-colors",children:r.title})]}):e.jsx("div",{}),i?e.jsxs("button",{onClick:()=>b(i.id),className:"group flex flex-col items-end p-4 rounded-lg border border-border hover:border-brand/30 hover:bg-card/20 transition-colors text-right sm:col-start-2",children:[e.jsxs("span",{className:"text-caption text-text-muted flex items-center gap-1 mb-1",children:["Next",e.jsx(Q,{size:12})]}),e.jsx("span",{className:"text-body-sm font-medium text-text-primary group-hover:text-brand-light transition-colors",children:i.title})]}):null]})]})}),T.length>0&&e.jsx("aside",{className:"hidden xl:block w-[200px] flex-shrink-0 h-[calc(100vh-80px)] sticky top-[80px] overflow-y-auto",children:e.jsxs("div",{className:"p-5 pt-12",children:[e.jsx("p",{className:"text-caption font-semibold text-text-muted uppercase tracking-wider mb-3",children:"On this page"}),e.jsx("nav",{className:"space-y-1",children:T.map(o=>e.jsx("a",{href:`#${o.id}`,className:`block text-caption transition-colors ${o.level===3?"pl-3":""} ${P===o.id?"text-brand-light font-medium":"text-text-muted hover:text-text-primary"}`,onClick:p=>{p.preventDefault();const m=document.getElementById(o.id);m&&m.scrollIntoView({behavior:"smooth",block:"start"})},children:o.text},o.id))})]})})]})]}):e.jsx(N.main,{id:"main-content",initial:a?{}:{opacity:0},animate:{opacity:1},className:"pt-[80px] min-h-screen flex items-center justify-center",children:e.jsxs("div",{className:"text-center",children:[e.jsx("h1",{className:"text-heading-lg text-text-primary mb-4",children:"Page Not Found"}),e.jsx("p",{className:"text-text-secondary mb-6",children:"The documentation page you're looking for doesn't exist."}),e.jsx(R,{to:"/docs/getting-started",className:"inline-flex items-center gap-2 px-4 py-2 rounded-md bg-brand text-white text-body-sm font-medium hover:bg-brand-light transition-colors",children:"Go to Getting Started"})]})})}export{We as default};
