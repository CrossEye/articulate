import { html } from 'htm/preact'
import { useState, useEffect } from 'preact/hooks'
import { state } from '../state.js'
import api from '../api.js'

const STATUS_LABELS = {
  draft:              'Draft',
  'committee-review': 'Committee Review',
  'first-reading':    'First Reading',
  'second-reading':   'Second Reading',
  approved:           'Approved',
  rejected:           'Rejected',
}

const STATUS_COLORS = {
  draft:              'workflow--draft',
  'committee-review': 'workflow--committee',
  'first-reading':    'workflow--reading',
  'second-reading':   'workflow--reading',
  approved:           'workflow--approved',
  rejected:           'workflow--rejected',
}

// All possible forward/back transitions — server enforces validity
const NEXT_STATUSES = {
  null:               [{ status: 'draft', label: 'Start workflow (Draft)' }],
  draft:              [{ status: 'committee-review', label: 'Send to Committee Review' }],
  'committee-review': [{ status: 'first-reading', label: 'Advance to First Reading' },
                       { status: 'draft', label: 'Send back to Draft' }],
  'first-reading':    [{ status: 'second-reading', label: 'Advance to Second Reading' },
                       { status: 'committee-review', label: 'Send back to Committee Review' },
                       { status: 'draft', label: 'Send back to Draft' }],
  'second-reading':   [{ status: 'approved', label: 'Approve' },
                       { status: 'rejected', label: 'Reject' },
                       { status: 'committee-review', label: 'Send back to Committee Review' },
                       { status: 'draft', label: 'Send back to Draft' }],
}

export const WorkflowBadge = ({ status }) => {
  if (!status) return null
  return html`
    <span class=${'workflow-badge ' + (STATUS_COLORS[status] || '')}>
      ${STATUS_LABELS[status] || status}
    </span>
  `
}

const WorkflowPanel = ({ versionId, docId }) => {
  const [log, setLog] = useState([])
  const [showLog, setShowLog] = useState(false)
  const [transitioning, setTransitioning] = useState(null) // status string being transitioned to
  const [note, setNote] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)

  const version = state.currentVersion.value
  const user = state.currentUser.value
  const currentStatus = version?.workflow_status || null

  const transitions = NEXT_STATUSES[currentStatus] || []

  const loadLog = async () => {
    const entries = await api.get(`/documents/${docId}/versions/${versionId}/workflow`)
    setLog(entries)
  }

  const handleShowLog = async () => {
    if (!showLog) await loadLog()
    setShowLog(!showLog)
  }

  const handleTransition = async (status) => {
    if (!note.trim()) return
    setBusy(true)
    setError(null)
    try {
      const updated = await api.patch(`/documents/${docId}/versions/${versionId}/workflow`, { status, note: note.trim() })
      state.currentVersion.value = updated
      setTransitioning(null)
      setNote('')
      if (showLog) await loadLog()
    } catch (err) {
      setError(err.message)
    }
    setBusy(false)
  }

  if (!version || version.kind !== 'branch') return null

  return html`
    <div class="workflow-panel">
      <div class="workflow-panel__header">
        <${WorkflowBadge} status=${currentStatus} />
        ${!currentStatus && html`<span class="text-muted" style="font-size:0.82rem">No workflow</span>`}
      </div>

      ${transitions.length > 0 && html`
        <div class="workflow-panel__actions">
          ${transitioning
            ? html`
              <div class="workflow-panel__note-form">
                <span class="workflow-panel__note-label">
                  ${STATUS_LABELS[transitioning] || transitioning} —
                </span>
                <input class="workflow-panel__note" type="text"
                  placeholder="Note (required)…"
                  value=${note}
                  onInput=${(e) => setNote(e.target.value)}
                  onKeyDown=${(e) => e.key === 'Enter' && handleTransition(transitioning)} />
                <button class="btn btn--primary btn--sm" onclick=${() => handleTransition(transitioning)}
                  disabled=${busy || !note.trim()}>Confirm</button>
                <button class="btn btn--sm" onclick=${() => { setTransitioning(null); setNote('') }}>Cancel</button>
              </div>
            `
            : transitions.map(t => html`
              <button key=${t.status} class="btn btn--sm" onclick=${() => setTransitioning(t.status)}>
                ${t.label}
              </button>
            `)
          }
          ${error && html`<span class="workflow-panel__error">${error}</span>`}
        </div>
      `}

      <div class="workflow-panel__log-toggle">
        <button class="btn btn--sm" onclick=${handleShowLog}>
          ${showLog ? 'Hide history' : 'Workflow history'}
        </button>
      </div>

      ${showLog && html`
        <div class="workflow-panel__log">
          ${log.length === 0
            ? html`<p class="text-muted" style="font-size:0.82rem">No transitions yet.</p>`
            : log.map(entry => html`
              <div class="workflow-log-entry" key=${entry.id}>
                <span class="workflow-log-entry__arrow">
                  ${entry.from_status ? STATUS_LABELS[entry.from_status] : 'Start'}
                  ${' \u2192 '}
                  ${STATUS_LABELS[entry.to_status] || entry.to_status}
                </span>
                <span class="workflow-log-entry__who">
                  ${entry.display_name || entry.username}
                </span>
                <span class="workflow-log-entry__date">
                  ${new Date(entry.created_at + 'Z').toLocaleDateString()}
                </span>
                ${entry.note && html`
                  <p class="workflow-log-entry__note">${entry.note}</p>
                `}
              </div>
            `)
          }
        </div>
      `}
    </div>
  `
}

export { WorkflowPanel }
export default WorkflowPanel
