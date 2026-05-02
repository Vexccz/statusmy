export default {
  id: 'python',
  title: 'Python',
  category: 'Integrations',
  lastUpdated: '2024-03-11',
  content: `## Python Integration

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
:::`
}
