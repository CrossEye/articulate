import { html } from 'htm/preact'
import { useState, useEffect } from 'preact/hooks'
import { state } from '../state.js'
import { navigate } from '../router.js'
import api from '../api.js'
import { WorkflowBadge } from './WorkflowPanel.js'

const STAGE_ORDER = [null, 'draft', 'committee-review', 'first-reading', 'second-reading']
const STAGE_LABELS = {
  null:               'No Workflow',
  'draft':            'Draft',
  'committee-review': 'Committee Review',
  'first-reading':    'First Reading',
  'second-reading':   'Second Reading',
}

const BranchDashboard = ({ params }) => {
  const { docId } = params
  const [branches, setBranches] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    state.currentVersion.value = null
    state.currentRevision.value = null
    setLoading(true)
    Promise.all([
      api.get(`/documents/${docId}`),
      api.get(`/documents/${docId}/branches/active`),
    ]).then(([doc, active]) => {
      state.currentDoc.value = doc
      setBranches(active)
      setLoading(false)
    }).catch(err => {
      state.error.value = err.message
      setLoading(false)
    })
  }, [docId])

  const doc = state.currentDoc.value
  if (loading) return html`<main class="main-content"><p>Loading...</p></main>`
  if (!doc) return html`<main class="main-content"><p>Document not found.</p></main>`

  // Group by workflow_status, in stage order
  const grouped = new Map(STAGE_ORDER.map(s => [s, []]))
  for (const b of branches) {
    const key = b.workflow_status || null
    if (grouped.has(key)) grouped.get(key).push(b)
    else grouped.set(key, [b])
  }

  const nonEmpty = STAGE_ORDER.filter(s => (grouped.get(s) || []).length > 0)

  return html`
    <main class="main-content">
      <div class="dashboard-header">
        <h1>
          <a href="/${docId}" onclick=${(e) => { e.preventDefault(); navigate(`/${docId}`) }}>
            ${doc.title}
          </a>
          <span class="dashboard-header__sep">›</span>
          Active Branches
        </h1>
        <p class="text-muted" style="font-size:0.85rem">
          ${branches.length} active branch${branches.length !== 1 ? 'es' : ''} across ${nonEmpty.length} stage${nonEmpty.length !== 1 ? 's' : ''}
        </p>
      </div>

      ${nonEmpty.length === 0 && html`
        <p class="text-muted">No active branches.</p>
      `}

      ${nonEmpty.map(stage => {
        const group = grouped.get(stage)
        return html`
          <section class="dashboard-stage" key=${String(stage)}>
            <div class="dashboard-stage__header">
              <${WorkflowBadge} status=${stage} />
              ${stage === null && html`<span class="dashboard-stage__label">No Workflow</span>`}
              <span class="dashboard-stage__count">${group.length}</span>
            </div>
            <ul class="dashboard-branch-list">
              ${group.map(b => html`
                <li class="dashboard-branch" key=${b.id}>
                  <div class="dashboard-branch__main">
                    <a class="dashboard-branch__name" href="/${docId}/${b.id}"
                      onclick=${(e) => { e.preventDefault(); navigate(`/${docId}/${b.id}`) }}>
                      ${b.name}
                    </a>
                    ${b.description && html`
                      <span class="dashboard-branch__desc">${b.description}</span>
                    `}
                  </div>
                  <div class="dashboard-branch__meta">
                    <span class="dashboard-branch__who">
                      ${b.creator_display_name || b.creator_username || 'Unknown'}
                    </span>
                    <span class="dashboard-branch__date">
                      ${new Date(b.created_at + 'Z').toLocaleDateString()}
                    </span>
                  </div>
                </li>
              `)}
            </ul>
          </section>
        `
      })}
    </main>
  `
}

export default BranchDashboard
