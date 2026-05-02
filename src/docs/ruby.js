export default {
  id: 'ruby',
  title: 'Ruby',
  category: 'Integrations',
  lastUpdated: '2024-03-06',
  content: `## Ruby Integration

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
:::`
}
