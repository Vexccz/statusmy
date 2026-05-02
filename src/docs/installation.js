export default {
  id: 'installation',
  title: 'Installation',
  category: 'Getting Started',
  lastUpdated: '2024-03-12',
  content: `## Installation

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
></script>
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

These are listed as peer dependencies and won't be installed automatically.`
}
