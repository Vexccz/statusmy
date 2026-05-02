export default {
  id: 'api-teams',
  title: 'Teams',
  category: 'API Reference',
  lastUpdated: '2024-03-04',
  content: `## Teams API

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
:::`
}
