import { html } from 'htm/preact'
import { useState } from 'preact/hooks'
import { state } from '../state.js'
import api from '../api.js'

const RevisionControls = ({ revisionId, versionId }) => {
  const [showPublish, setShowPublish] = useState(false)
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)

  const handlePublish = async () => {
    setBusy(true)
    await api.patch(`/revisions/${revisionId}/publish`)
    setBusy(false)
    setShowPublish(false)
    setMessage('')
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

  return html`
    <div class="revision-controls">
      <span class="revision-controls__id" title=${revisionId}>
        Rev: ${revisionId.slice(0, 8)}...
      </span>

      ${!showPublish
        ? html`
          <button class="btn btn--sm" onclick=${() => setShowPublish(true)}>
            Publish
          </button>
        `
        : html`
          <div class="revision-controls__publish">
            <p class="text-muted">Publishing makes this revision immutable.</p>
            <button class="btn btn--primary btn--sm" onclick=${handlePublish} disabled=${busy}>
              Confirm Publish
            </button>
            <button class="btn btn--sm" onclick=${() => setShowPublish(false)}>
              Cancel
            </button>
          </div>
        `
      }

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
    </div>
  `
}

export default RevisionControls
