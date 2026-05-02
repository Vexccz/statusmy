import React from 'react'
import { Info, AlertTriangle, Lightbulb } from 'lucide-react'

function parseInlineFormatting(text) {
  const parts = []
  let remaining = text
  let key = 0

  while (remaining.length > 0) {
    // Bold: **text**
    const boldMatch = remaining.match(/\*\*(.+?)\*\*/)
    // Inline code: `text`
    const codeMatch = remaining.match(/`([^`]+)`/)

    let firstMatch = null
    let firstIndex = remaining.length

    if (boldMatch && boldMatch.index < firstIndex) {
      firstMatch = { type: 'bold', match: boldMatch }
      firstIndex = boldMatch.index
    }
    if (codeMatch && codeMatch.index < firstIndex) {
      firstMatch = { type: 'code', match: codeMatch }
      firstIndex = codeMatch.index
    }

    if (!firstMatch) {
      parts.push(remaining)
      break
    }

    // Add text before match
    if (firstIndex > 0) {
      parts.push(remaining.substring(0, firstIndex))
    }

    if (firstMatch.type === 'bold') {
      parts.push(<strong key={key++} className="font-semibold text-text-primary">{firstMatch.match[1]}</strong>)
      remaining = remaining.substring(firstIndex + firstMatch.match[0].length)
    } else if (firstMatch.type === 'code') {
      parts.push(
        <code key={key++} className="px-1.5 py-0.5 rounded bg-card/80 border border-border text-brand-light text-[0.85em] font-mono">
          {firstMatch.match[1]}
        </code>
      )
      remaining = remaining.substring(firstIndex + firstMatch.match[0].length)
    }
  }

  return parts
}

function renderTable(lines) {
  const rows = lines.filter(l => !l.match(/^\|\s*---/))
  if (rows.length < 1) return null

  const parseRow = (row) => {
    return row.split('|').filter(cell => cell.trim()).map(cell => cell.trim())
  }

  const headers = parseRow(rows[0])
  const body = rows.slice(1).map(parseRow)

  return (
    <div className="overflow-x-auto my-4 rounded-lg border border-border">
      <table className="w-full text-body-sm">
        <thead>
          <tr className="bg-card/50 border-b border-border">
            {headers.map((h, i) => (
              <th key={i} className="px-4 py-2.5 text-left font-semibold text-text-primary">
                {parseInlineFormatting(h)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {body.map((row, i) => (
            <tr key={i} className="border-b border-border last:border-0">
              {row.map((cell, j) => (
                <td key={j} className="px-4 py-2.5 text-text-secondary">
                  {parseInlineFormatting(cell)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function CalloutBox({ type, children }) {
  const config = {
    info: {
      icon: Info,
      bg: 'bg-blue-500/5',
      border: 'border-blue-500/20',
      iconColor: 'text-blue-400',
      title: 'Info',
    },
    warning: {
      icon: AlertTriangle,
      bg: 'bg-amber-500/5',
      border: 'border-amber-500/20',
      iconColor: 'text-amber-400',
      title: 'Warning',
    },
    tip: {
      icon: Lightbulb,
      bg: 'bg-emerald-500/5',
      border: 'border-emerald-500/20',
      iconColor: 'text-emerald-400',
      title: 'Tip',
    },
  }

  const c = config[type] || config.info
  const Icon = c.icon

  return (
    <div className={`my-4 p-4 rounded-lg border ${c.border} ${c.bg}`}>
      <div className="flex gap-3">
        <Icon size={18} className={`${c.iconColor} flex-shrink-0 mt-0.5`} />
        <div className="text-body-sm text-text-secondary leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  )
}

export function extractHeadings(content) {
  if (!content) return []
  const lines = content.split('\n')
  const headings = []
  let inCodeBlock = false

  for (const line of lines) {
    if (line.trim().startsWith('```')) {
      inCodeBlock = !inCodeBlock
      continue
    }
    if (inCodeBlock) continue

    if (line.startsWith('## ')) {
      headings.push({ level: 2, text: line.replace('## ', ''), id: line.replace('## ', '').toLowerCase().replace(/[^a-z0-9]+/g, '-') })
    } else if (line.startsWith('### ')) {
      headings.push({ level: 3, text: line.replace('### ', ''), id: line.replace('### ', '').toLowerCase().replace(/[^a-z0-9]+/g, '-') })
    }
  }

  return headings
}

export default function renderDoc(content) {
  if (!content) return null

  const lines = content.split('\n')
  const elements = []
  let i = 0
  let key = 0

  while (i < lines.length) {
    const line = lines[i]

    // Code blocks
    if (line.trim().startsWith('```')) {
      const lang = line.trim().replace('```', '').trim()
      const codeLines = []
      i++
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i])
        i++
      }
      i++ // skip closing ```

      elements.push(
        <div key={key++} className="my-4 rounded-lg border border-border bg-[#0d0d14] overflow-hidden">
          {lang && (
            <div className="flex items-center px-4 py-2 border-b border-border bg-card/30">
              <span className="text-caption text-text-muted font-mono">{lang}</span>
            </div>
          )}
          <div className="p-4 overflow-x-auto">
            <pre className="text-body-sm leading-relaxed font-mono text-text-secondary">
              <code>{codeLines.join('\n')}</code>
            </pre>
          </div>
        </div>
      )
      continue
    }

    // Callout blocks (:::info, :::warning, :::tip)
    if (line.trim().startsWith(':::')) {
      const type = line.trim().replace(':::', '').trim()
      if (type && type !== '') {
        const calloutLines = []
        i++
        while (i < lines.length && !lines[i].trim().startsWith(':::')) {
          calloutLines.push(lines[i])
          i++
        }
        i++ // skip closing :::

        elements.push(
          <CalloutBox key={key++} type={type}>
            {calloutLines.map((cl, idx) => (
              <span key={idx}>
                {parseInlineFormatting(cl)}
                {idx < calloutLines.length - 1 && <br />}
              </span>
            ))}
          </CalloutBox>
        )
        continue
      }
    }

    // Tables
    if (line.trim().startsWith('|') && i + 1 < lines.length && lines[i + 1].trim().match(/^\|\s*---/)) {
      const tableLines = []
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        tableLines.push(lines[i].trim())
        i++
      }
      elements.push(<React.Fragment key={key++}>{renderTable(tableLines)}</React.Fragment>)
      continue
    }

    // Headings
    if (line.startsWith('## ')) {
      const text = line.replace('## ', '')
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-')
      elements.push(
        <h2 key={key++} id={id} className="text-heading-md text-text-primary mt-10 mb-4 scroll-mt-24">
          {text}
        </h2>
      )
      i++
      continue
    }

    if (line.startsWith('### ')) {
      const text = line.replace('### ', '')
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-')
      elements.push(
        <h3 key={key++} id={id} className="text-heading-sm text-text-primary mt-8 mb-3 scroll-mt-24">
          {text}
        </h3>
      )
      i++
      continue
    }

    // Unordered list
    if (line.trim().startsWith('- ')) {
      const listItems = []
      while (i < lines.length && lines[i].trim().startsWith('- ')) {
        listItems.push(lines[i].trim().replace(/^- /, ''))
        i++
      }
      elements.push(
        <ul key={key++} className="my-3 space-y-1.5 ml-4">
          {listItems.map((item, idx) => (
            <li key={idx} className="text-body-sm text-text-secondary leading-relaxed flex gap-2">
              <span className="text-brand-light mt-1.5 flex-shrink-0">•</span>
              <span>{parseInlineFormatting(item)}</span>
            </li>
          ))}
        </ul>
      )
      continue
    }

    // Ordered list
    if (line.trim().match(/^\d+\.\s/)) {
      const listItems = []
      while (i < lines.length && lines[i].trim().match(/^\d+\.\s/)) {
        listItems.push(lines[i].trim().replace(/^\d+\.\s/, ''))
        i++
      }
      elements.push(
        <ol key={key++} className="my-3 space-y-1.5 ml-4">
          {listItems.map((item, idx) => (
            <li key={idx} className="text-body-sm text-text-secondary leading-relaxed flex gap-2">
              <span className="text-brand-light font-medium flex-shrink-0 w-5">{idx + 1}.</span>
              <span>{parseInlineFormatting(item)}</span>
            </li>
          ))}
        </ol>
      )
      continue
    }

    // Blockquote
    if (line.trim().startsWith('> ')) {
      const quoteLines = []
      while (i < lines.length && lines[i].trim().startsWith('> ')) {
        quoteLines.push(lines[i].trim().replace(/^> /, ''))
        i++
      }
      elements.push(
        <blockquote key={key++} className="my-4 pl-4 border-l-2 border-brand/40 text-body-sm text-text-secondary italic">
          {quoteLines.map((ql, idx) => (
            <span key={idx}>
              {parseInlineFormatting(ql)}
              {idx < quoteLines.length - 1 && <br />}
            </span>
          ))}
        </blockquote>
      )
      continue
    }

    // Empty line
    if (line.trim() === '') {
      i++
      continue
    }

    // Regular paragraph
    elements.push(
      <p key={key++} className="text-body-sm text-text-secondary leading-relaxed my-3">
        {parseInlineFormatting(line)}
      </p>
    )
    i++
  }

  return <div className="doc-content">{elements}</div>
}
