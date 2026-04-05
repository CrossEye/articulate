import { html } from 'htm/preact'
import { useState, useEffect } from 'preact/hooks'
import { state } from '../state.js'
import { navigate } from '../router.js'
import api from '../api.js'

const RevisionControls = ({ revisionId, versionId, docId, versionSlug }) => {
  const [showPublish, setShowPublish] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [revisions, setRevisions] = useState([])
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)

  const handlePublish = async () => {
    setBusy(true)
    await api.patch(`/revisions/${revisionId}/publish`)
    setBusy(false)
    setShowPublish(false)
  }

  const handleNewRevision = async () => {
    if (!message.trim()) return
    setBusy(true)
    const result = await api.post(`/versions/${versionId}/revisions`, {
      message: message.trim(),
      changes: [],
    })
    setBusy(false)
    if (result.id) {
      state.currentRevision.value = result.id
    }
    setMessage('')
  }

  const handleShowHistory = async () => {
    if (!showHistory) {
      const revs = await api.get(`/versions/${versionId}/revisions`)
      setRevisions(revs)
    }
    setShowHistory(!showHistory)
  }

  const currentRevision = revisions.find(r => r.id === revisionId)
  const parentId = currentRevision?.parent_id

  return html`
    <div class="revision-controls">
      <span class="revision-controls__id" title=${revisionId}>
        Rev: ${revisionId.slice(0, 8)}...
      </span>

      ${!showPublish
        ? html`
          <button class="btn btn--sm" onclick=${() => setShowPublish(true)}>Publish</button>
        `
        : html`
          <div class="revision-controls__publish">
            <p class="text-muted">Publishing makes this revision immutable.</p>
            <button class="btn btn--primary btn--sm" onclick=${handlePublish} disabled=${busy}>Confirm Publish</button>
            <button class="btn btn--sm" onclick=${() => setShowPublish(false)}>Cancel</button>
          </div>
        `
      }

      ${parentId && html`
        <button class="btn btn--sm" onclick=${() => navigate(`/${docId}/${versionSlug}/diff/${parentId}/${revisionId}`)}>
          Diff
        </button>
      `}

      <button class="btn btn--sm" onclick=${handleShowHistory}>
        ${showHistory ? 'Hide History' : 'History'}
      </button>

      <div class="revision-controls__save">
        <input
          class="revision-controls__message"
          type="text"
          placeholder="Revision note..."
          value=${message}
          onInput=${(e) => setMessage(e.target.value)}
          onKeyDown=${(e) => e.key === 'Enter' && handleNewRevision()}
        />
        <button class="btn btn--sm" onclick=${handleNewRevision} disabled=${busy || !message.trim()}>
          Save Revision
        </button>
      </div>

      ${showHistory && html`
        <${RevisionHistory}
          revisions=${revisions}
          currentId=${revisionId}
          docId=${docId}
          versionSlug=${versionSlug}
        />
      `}
    </div>
  `
}

const RevisionHistory = ({ revisions, currentId, docId, versionSlug }) => {
  const [selectedA, setSelectedA] = useState(null)
  const [selectedB, setSelectedB] = useState(null)

  const handleCompare = () => {
    if (selectedA && selectedB && selectedA !== selectedB) {
      // Always show older → newer
      const sorted = [selectedA, selectedB].sort()
      navigate(`/${docId}/${versionSlug}/diff/${sorted[0]}/${sorted[1]}`)
    }
  }

  return html`
    <div class="revision-history">
      <div class="revision-history__toolbar">
        <button class="btn btn--primary btn--sm" onclick=${handleCompare}
          disabled=${!selectedA || !selectedB || selectedA === selectedB}>
          Compare selected
        </button>
      </div>
      <table class="revision-history__table">
        <thead>
          <tr>
            <th>A</th>
            <th>B</th>
            <th>Revision</th>
            <th>Message</th>
            <th>Date</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          ${revisions.map(rev => html`
            <tr class=${rev.id === currentId ? 'revision-history__current' : ''}>
              <td><input type="radio" name="diffA" checked=${selectedA === rev.id} onchange=${() => setSelectedA(rev.id)} /></td>
              <td><input type="radio" name="diffB" checked=${selectedB === rev.id} onchange=${() => setSelectedB(rev.id)} /></td>
              <td class="revision-history__id">${rev.id.slice(0, 12)}...</td>
              <td>${rev.message || ''}</td>
              <td class="revision-history__date">${new Date(rev.created_at + 'Z').toLocaleString()}</td>
              <td>
                ${rev.parent_id && html`
                  <a class="revision-history__diff-link"
                    href="/${docId}/${versionSlug}/diff/${rev.parent_id}/${rev.id}"
                    onclick=${(e) => { e.preventDefault(); navigate(`/${docId}/${versionSlug}/diff/${rev.parent_id}/${rev.id}`) }}>
                    diff
                  </a>
                `}
              </td>
            </tr>
          `)}
        </tbody>
      </table>
    </div>
  `
}

export default RevisionControls
