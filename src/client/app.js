import { html } from 'htm/preact'
import { useEffect } from 'preact/hooks'
import { addRoute, match, route, params } from './router.js'
import { state } from './state.js'
import api from './api.js'
import TopBar from './components/TopBar.js'
import DocumentOverview from './components/DocumentOverview.js'
import RevisionView from './components/RevisionView.js'
import DocsPage from './components/DocsPage.js'

// Register routes
addRoute('/docs', DocsPage)
addRoute('/docs/*', DocsPage)
addRoute('/:docId', DocumentOverview)
addRoute('/:docId/:versionSlug', RevisionView)
addRoute('/:docId/:versionSlug/*', RevisionView)
addRoute('/', null) // home

const App = () => {
  const Component = match()
  const p = params.value

  // Load document list on mount
  useEffect(() => {
    api.get('/documents').then(docs => {
      state.documents.value = docs
    }).catch(() => {})
  }, [])

  return html`
    <div class="app">
      <${TopBar} />
      <div class="app__body">
        ${Component
          ? html`<${Component} params=${p} />`
          : html`<${Home} />`
        }
      </div>
    </div>
  `
}

const Home = () => {
  const docs = state.documents.value
  return html`
    <main class="main-content">
      <h1>Articulate</h1>
      <p>Collaborative editing for hierarchical legal and policy documents.</p>
      ${docs.length > 0
        ? html`
          <h2>Documents</h2>
          <ul class="doc-list">
            ${docs.map(d => html`
              <li><a href="/${d.id}" onclick=${(e) => { e.preventDefault(); import('./router.js').then(r => r.navigate(`/${d.id}`)) }}>${d.title}</a></li>
            `)}
          </ul>
        `
        : html`<p class="text-muted">No documents yet. Import one to get started.</p>`
      }
    </main>
  `
}

export default App
