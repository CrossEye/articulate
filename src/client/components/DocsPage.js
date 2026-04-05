import { html } from 'htm/preact'
import { useState, useEffect } from 'preact/hooks'
import { state } from '../state.js'
import { navigate } from '../router.js'
import api from '../api.js'

const DocsSidebar = ({ tree, currentPath, onSelect }) => {
  if (!tree) return null

  return html`
    <aside class="docs-sidebar">
      <ul class="docs-toc">
        ${tree.map(item => html`
          <${DocsTocItem} item=${item} currentPath=${currentPath} onSelect=${onSelect} depth=${0} />
        `)}
      </ul>
    </aside>
  `
}

const DocsTocItem = ({ item, currentPath, onSelect, depth }) => {
  const [expanded, setExpanded] = useState(true)
  const isSection = item.type === 'section'
  const isActive = currentPath === item.path

  return html`
    <li class="docs-toc__item">
      <div class="docs-toc__row ${isActive ? 'docs-toc__row--active' : ''}" style=${{ paddingLeft: `${depth * 16 + 8}px` }}>
        ${isSection && html`
          <button class="docs-toc__toggle" onclick=${() => setExpanded(!expanded)}>
            ${expanded ? '▾' : '▸'}
          </button>
        `}
        <a
          class="docs-toc__link"
          href="/docs/${item.path}"
          onclick=${(e) => { e.preventDefault(); onSelect(item.path) }}
        >${item.name}</a>
      </div>
      ${isSection && expanded && item.children && item.children.length > 0 && html`
        <ul class="docs-toc__children">
          ${item.children.map(child => html`
            <${DocsTocItem} item=${child} currentPath=${currentPath} onSelect=${onSelect} depth=${depth + 1} />
          `)}
        </ul>
      `}
    </li>
  `
}

const DocsPage = ({ params }) => {
  const [tree, setTree] = useState(null)
  const [content, setContent] = useState(null)
  const [currentPath, setCurrentPath] = useState(null)

  // Derive doc path from URL
  const urlPath = params['0'] || null

  useEffect(() => {
    // Clear doc/version state since we're in docs view
    state.currentDoc.value = null
    state.currentVersion.value = null

    api.get('/docs/tree').then(setTree).catch(() => {})
  }, [])

  useEffect(() => {
    const docPath = urlPath || 'index.md'
    setCurrentPath(urlPath)
    api.get(`/docs/content/${docPath}`)
      .then(data => setContent(data.html))
      .catch(() => setContent('<p>Page not found.</p>'))
  }, [urlPath])

  const handleSelect = (path) => {
    navigate(`/docs/${path}`)
  }

  return html`
    <div class="docs-view">
      <${DocsSidebar} tree=${tree} currentPath=${currentPath} onSelect=${handleSelect} />
      <main class="docs-content">
        ${content
          ? html`<div dangerouslySetInnerHTML=${{ __html: content }} />`
          : html`<p>Loading...</p>`
        }
      </main>
    </div>
  `
}

export default DocsPage
