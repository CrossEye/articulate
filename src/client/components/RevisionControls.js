import { html } from 'htm/preact'
import { useState, useEffect } from 'preact/hooks'
import { state } from '../state.js'
import { navigate } from '../router.js'
import api from '../api.js'

const RevisionControls = ({ revisionId, versionId, docId, versionSlug }) => {
  const [showPublish, setShowPublish] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [revisions, setRevisions] = useState([])
  const [revDetail, setRevDetail] = useState(null)
  const [publishMessage, setPublishMessage] = useState('')
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    api.get(`/revisions/${revisionId}`)
      .then(rev => setRevDetail(rev))
      .catch(() => setRevDetail(null))
  }, [revisionId])

  const parentId = revDetail?.parent_id
  const seq = revDetail?.seq

  const handlePublish = async () => {
    if (!publishMessage.trim()) return
    setBusy(true)
    await api.patch(`/revisions/${revisionId}/publish`, { message: publishMessage.trim() })
    setBusy(false)
    setShowPublish(false)
    setPublishMessage('')
    // Refresh detail to show updated message
    const rev = await api.get(`/revisions/${revisionId}`)
    setRevDetail(rev)
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

  return html`
    <div class="revision-controls">
      <span class="revision-controls__id" title=${revisionId}>
        Rev ${seq || '?'}
      </span>

      ${!showPublish
        ? html`
          <button class="btn btn--sm" onclick=${() => setShowPublish(true)}>Publish</button>
        `
        : html`
          <div class="revision-controls__publish">
            <input
              class="revision-controls__message"
              type="text"
              placeholder="Describe this revision..."
              value=${publishMessage}
              onInput=${(e) => setPublishMessage(e.target.value)}
              onKeyDown=${(e) => e.key === 'Enter' && handlePublish()}
              style="width: 280px"
            />
            <button class="btn btn--primary btn--sm" onclick=${handlePublish} disabled=${busy || !publishMessage.trim()}>Confirm Publish</button>
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
            <th>#</th>
            <th>Message</th>
            <th>Version</th>
            <th>Date</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          ${revisions.map(rev => html`
            <tr class=${rev.id === currentId ? 'revision-history__current' : ''}>
              <td><input type="radio" name="diffA" checked=${selectedA === rev.id} onchange=${() => setSelectedA(rev.id)} /></td>
              <td><input type="radio" name="diffB" checked=${selectedB === rev.id} onchange=${() => setSelectedB(rev.id)} /></td>
              <td class="revision-history__seq">${rev.seq || '?'}</td>
              <td>${rev.message || html`<span class="text-muted">-</span>`}</td>
              <td class="revision-history__version">${rev.version_id}</td>
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
