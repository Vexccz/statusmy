export default {
  id: 'java',
  title: 'Java',
  category: 'Integrations',
  lastUpdated: '2024-02-25',
  content: `## Java Integration

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
:::`
}
