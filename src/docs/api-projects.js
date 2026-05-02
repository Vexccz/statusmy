export default {
  id: 'api-projects',
  title: 'Projects',
  category: 'API Reference',
  lastUpdated: '2024-03-07',
  content: `## Projects API

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
:::`
}
