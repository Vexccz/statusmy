export default {
  id: 'session-replay',
  title: 'Session Replay',
  category: 'Features',
  lastUpdated: '2024-03-01',
  content: `## Session Replay

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
:::`
}
