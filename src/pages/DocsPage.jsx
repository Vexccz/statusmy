import { useState, useEffect, useMemo, useCallback } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Link, useParams, useNavigate } from 'react-router-dom'
import {
  Search, Book, Code2, Rocket, Settings, Shield, ChevronRight, ChevronDown,
  ExternalLink, Menu, X, ArrowLeft, ArrowRight, FileText, Zap
} from 'lucide-react'
import { allDocs, categories, getDocById, getCategoryForDoc, getAdjacentDocs, searchDocs } from '../docs'
import renderDoc, { extractHeadings } from '../utils/renderDoc'

const categoryIcons = {
  'Getting Started': Rocket,
  'Features': Zap,
  'Integrations': Code2,
  'API Reference': FileText,
  'Guides': Book,
}

export default function DocsPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const prefersReducedMotion = useReducedMotion()

  const activeSlug = slug || 'getting-started'
  const activeDoc = getDocById(activeSlug)
  const activeCategory = activeDoc ? getCategoryForDoc(activeDoc.id) : null
  const { prev, next } = activeDoc ? getAdjacentDocs(activeDoc.id) : { prev: null, next: null }

  const [searchQuery, setSearchQuery] = useState('')
  const [expandedCategories, setExpandedCategories] = useState(() => {
    const initial = {}
    categories.forEach(c => { initial[c.name] = true })
    return initial
  })
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeHeading, setActiveHeading] = useState('')

  const headings = useMemo(() => {
    return activeDoc ? extractHeadings(activeDoc.content) : []
  }, [activeDoc])

  const searchResults = useMemo(() => {
    return searchDocs(searchQuery)
  }, [searchQuery])

  // Close mobile menu on navigation
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [activeSlug])

  // Track active heading for TOC
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveHeading(entry.target.id)
          }
        }
      },
      { rootMargin: '-80px 0px -70% 0px', threshold: 0 }
    )

    const headingElements = document.querySelectorAll('.doc-content h2[id], .doc-content h3[id]')
    headingElements.forEach(el => observer.observe(el))

    return () => observer.disconnect()
  }, [activeDoc])

  // Redirect to getting-started if no slug
  useEffect(() => {
    if (!slug) {
      navigate('/docs/getting-started', { replace: true })
    }
  }, [slug, navigate])

  const toggleCategory = useCallback((name) => {
    setExpandedCategories(prev => ({ ...prev, [name]: !prev[name] }))
  }, [])

  const handleDocClick = useCallback((docId) => {
    navigate(`/docs/${docId}`)
    setSearchQuery('')
  }, [navigate])

  // Sidebar content (shared between desktop and mobile)
  const sidebarContent = (
    <>
      {/* Search */}
      <div className="relative mb-6">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search docs..."
          className="w-full h-[38px] pl-9 pr-3 rounded-sm bg-card/50 border border-border text-body-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand/60 transition-colors"
        />
      </div>

      {/* Search results */}
      {searchQuery.length >= 2 && (
        <div className="mb-6">
          <p className="text-caption text-text-muted mb-2">
            {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} found
          </p>
          {searchResults.length > 0 ? (
            <ul className="space-y-1">
              {searchResults.map(doc => (
                <li key={doc.id}>
                  <button
                    onClick={() => handleDocClick(doc.id)}
                    className={`w-full text-left px-3 py-2 rounded-md text-body-sm transition-colors ${
                      activeSlug === doc.id
                        ? 'text-brand-light bg-brand-bg font-medium'
                        : 'text-text-secondary hover:text-text-primary hover:bg-card/30'
                    }`}
                  >
                    <span className="block">{doc.title}</span>
                    <span className="text-caption text-text-muted">{doc.category}</span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-body-sm text-text-muted px-3">No docs match your search.</p>
          )}
        </div>
      )}

      {/* Nav sections */}
      {!searchQuery && (
        <nav className="space-y-1">
          {categories.map((category) => {
            const Icon = categoryIcons[category.name] || Book
            const isExpanded = expandedCategories[category.name]
            const categoryDocs = category.docs.map(id => getDocById(id)).filter(Boolean)
            const hasActiveDoc = category.docs.includes(activeSlug)

            return (
              <div key={category.name}>
                <button
                  onClick={() => toggleCategory(category.name)}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-body-sm font-medium transition-colors ${
                    hasActiveDoc ? 'text-text-primary' : 'text-text-muted hover:text-text-primary'
                  }`}
                >
                  <Icon size={14} className="flex-shrink-0" />
                  <span className="flex-1 text-left">{category.name}</span>
                  <ChevronDown
                    size={14}
                    className={`transition-transform duration-200 ${isExpanded ? '' : '-rotate-90'}`}
                  />
                </button>
                {isExpanded && (
                  <ul className="ml-5 mt-0.5 space-y-0.5 border-l border-border pl-3">
                    {categoryDocs.map((doc) => (
                      <li key={doc.id}>
                        <button
                          onClick={() => handleDocClick(doc.id)}
                          className={`w-full text-left px-3 py-1.5 rounded-md text-body-sm transition-colors ${
                            activeSlug === doc.id
                              ? 'text-brand-light bg-brand-bg font-medium'
                              : 'text-text-secondary hover:text-text-primary hover:bg-card/30'
                          }`}
                        >
                          {doc.title}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )
          })}
        </nav>
      )}
    </>
  )

  if (!activeDoc) {
    return (
      <motion.main
        id="main-content"
        initial={prefersReducedMotion ? {} : { opacity: 0 }}
        animate={{ opacity: 1 }}
        className="pt-[80px] min-h-screen flex items-center justify-center"
      >
        <div className="text-center">
          <h1 className="text-heading-lg text-text-primary mb-4">Page Not Found</h1>
          <p className="text-text-secondary mb-6">The documentation page you're looking for doesn't exist.</p>
          <Link
            to="/docs/getting-started"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-brand text-white text-body-sm font-medium hover:bg-brand-light transition-colors"
          >
            Go to Getting Started
          </Link>
        </div>
      </motion.main>
    )
  }

  return (
    <motion.main
      id="main-content"
      initial={prefersReducedMotion ? {} : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={prefersReducedMotion ? {} : { opacity: 0, y: -8 }}
      transition={{ duration: 0.3 }}
      className="pt-[80px] min-h-screen"
    >
      {/* Mobile menu button */}
      <div className="lg:hidden sticky top-[80px] z-30 bg-bg/95 backdrop-blur-sm border-b border-border px-4 py-3">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex items-center gap-2 text-body-sm text-text-secondary hover:text-text-primary transition-colors"
        >
          {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          <span>{activeCategory}</span>
          <ChevronRight size={14} />
          <span className="text-text-primary font-medium">{activeDoc.title}</span>
        </button>
      </div>

      {/* Mobile sidebar drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 top-[80px]">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileMenuOpen(false)} />
          <div className="relative w-[300px] max-w-[85vw] h-full bg-bg border-r border-border overflow-y-auto p-6">
            {sidebarContent}
          </div>
        </div>
      )}

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-[260px] flex-shrink-0 border-r border-border bg-surface/30 h-[calc(100vh-80px)] sticky top-[80px] overflow-y-auto">
          <div className="p-5">
            {sidebarContent}
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-12 py-8 lg:py-12">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-caption text-text-muted mb-6">
              <Link to="/docs/getting-started" className="hover:text-text-primary transition-colors">Docs</Link>
              <ChevronRight size={12} />
              <span className="text-text-secondary">{activeCategory}</span>
              <ChevronRight size={12} />
              <span className="text-text-primary">{activeDoc.title}</span>
            </div>

            {/* Page title */}
            <h1 className="font-display text-heading-lg text-text-primary mb-2">
              {activeDoc.title}
            </h1>
            <div className="flex items-center gap-4 mb-8 text-caption text-text-muted">
              <span>Last updated: {activeDoc.lastUpdated}</span>
              <a
                href="#"
                className="inline-flex items-center gap-1 hover:text-text-primary transition-colors"
                onClick={(e) => e.preventDefault()}
              >
                <ExternalLink size={12} />
                Edit on GitHub
              </a>
            </div>

            {/* Rendered content */}
            {renderDoc(activeDoc.content)}

            {/* Prev/Next navigation */}
            <div className="mt-16 pt-8 border-t border-border grid grid-cols-1 sm:grid-cols-2 gap-4">
              {prev ? (
                <button
                  onClick={() => handleDocClick(prev.id)}
                  className="group flex flex-col items-start p-4 rounded-lg border border-border hover:border-brand/30 hover:bg-card/20 transition-colors text-left"
                >
                  <span className="text-caption text-text-muted flex items-center gap-1 mb-1">
                    <ArrowLeft size={12} />
                    Previous
                  </span>
                  <span className="text-body-sm font-medium text-text-primary group-hover:text-brand-light transition-colors">
                    {prev.title}
                  </span>
                </button>
              ) : <div />}
              {next ? (
                <button
                  onClick={() => handleDocClick(next.id)}
                  className="group flex flex-col items-end p-4 rounded-lg border border-border hover:border-brand/30 hover:bg-card/20 transition-colors text-right sm:col-start-2"
                >
                  <span className="text-caption text-text-muted flex items-center gap-1 mb-1">
                    Next
                    <ArrowRight size={12} />
                  </span>
                  <span className="text-body-sm font-medium text-text-primary group-hover:text-brand-light transition-colors">
                    {next.title}
                  </span>
                </button>
              ) : null}
            </div>
          </div>
        </div>

        {/* Right sidebar - Table of Contents (desktop only) */}
        {headings.length > 0 && (
          <aside className="hidden xl:block w-[200px] flex-shrink-0 h-[calc(100vh-80px)] sticky top-[80px] overflow-y-auto">
            <div className="p-5 pt-12">
              <p className="text-caption font-semibold text-text-muted uppercase tracking-wider mb-3">
                On this page
              </p>
              <nav className="space-y-1">
                {headings.map((heading) => (
                  <a
                    key={heading.id}
                    href={`#${heading.id}`}
                    className={`block text-caption transition-colors ${
                      heading.level === 3 ? 'pl-3' : ''
                    } ${
                      activeHeading === heading.id
                        ? 'text-brand-light font-medium'
                        : 'text-text-muted hover:text-text-primary'
                    }`}
                    onClick={(e) => {
                      e.preventDefault()
                      const el = document.getElementById(heading.id)
                      if (el) {
                        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
                      }
                    }}
                  >
                    {heading.text}
                  </a>
                ))}
              </nav>
            </div>
          </aside>
        )}
      </div>
    </motion.main>
  )
}
