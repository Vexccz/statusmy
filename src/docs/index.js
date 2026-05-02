import gettingStarted from './getting-started'
import installation from './installation'
import configuration from './configuration'
import quickStart from './quick-start'
import errorTracking from './error-tracking'
import performance from './performance'
import sessionReplay from './session-replay'
import profiling from './profiling'
import javascript from './javascript'
import python from './python'
import ruby from './ruby'
import go from './go'
import java from './java'
import apiAuthentication from './api-authentication'
import apiEvents from './api-events'
import apiProjects from './api-projects'
import apiTeams from './api-teams'
import troubleshooting from './troubleshooting'
import bestPractices from './best-practices'
import migrationGuide from './migration-guide'

export const allDocs = [
  gettingStarted,
  installation,
  configuration,
  quickStart,
  errorTracking,
  performance,
  sessionReplay,
  profiling,
  javascript,
  python,
  ruby,
  go,
  java,
  apiAuthentication,
  apiEvents,
  apiProjects,
  apiTeams,
  troubleshooting,
  bestPractices,
  migrationGuide,
]

export const categories = [
  {
    name: 'Getting Started',
    docs: ['getting-started', 'installation', 'configuration', 'quick-start'],
  },
  {
    name: 'Features',
    docs: ['error-tracking', 'performance', 'session-replay', 'profiling'],
  },
  {
    name: 'Integrations',
    docs: ['javascript', 'python', 'ruby', 'go', 'java'],
  },
  {
    name: 'API Reference',
    docs: ['api-authentication', 'api-events', 'api-projects', 'api-teams'],
  },
  {
    name: 'Guides',
    docs: ['troubleshooting', 'best-practices', 'migration-guide'],
  },
]

export function getDocById(id) {
  return allDocs.find(doc => doc.id === id)
}

export function getDocsByCategory(categoryName) {
  const category = categories.find(c => c.name === categoryName)
  if (!category) return []
  return category.docs.map(id => allDocs.find(doc => doc.id === id)).filter(Boolean)
}

export function getCategoryForDoc(docId) {
  const category = categories.find(c => c.docs.includes(docId))
  return category ? category.name : null
}

export function getAdjacentDocs(docId) {
  const flatDocs = categories.flatMap(c => c.docs)
  const index = flatDocs.indexOf(docId)
  return {
    prev: index > 0 ? allDocs.find(d => d.id === flatDocs[index - 1]) : null,
    next: index < flatDocs.length - 1 ? allDocs.find(d => d.id === flatDocs[index + 1]) : null,
  }
}

export function searchDocs(query) {
  if (!query || query.trim().length < 2) return []
  const lower = query.toLowerCase()
  return allDocs.filter(doc =>
    doc.title.toLowerCase().includes(lower) ||
    doc.content.toLowerCase().includes(lower)
  )
}
