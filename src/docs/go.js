export default {
  id: 'go',
  title: 'Go',
  category: 'Integrations',
  lastUpdated: '2024-03-03',
  content: `## Go Integration

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
:::`
}
