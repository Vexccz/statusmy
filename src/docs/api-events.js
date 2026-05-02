export default {
  id: 'api-events',
  title: 'Events',
  category: 'API Reference',
  lastUpdated: '2024-03-09',
  content: `## Events API

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
:::`
}
