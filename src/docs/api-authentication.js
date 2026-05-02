export default {
  id: 'api-authentication',
  title: 'Authentication',
  category: 'API Reference',
  lastUpdated: '2024-03-13',
  content: `## Authentication

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
| 429 | Rate limit exceeded |`
}
