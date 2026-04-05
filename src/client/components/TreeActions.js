import { html } from 'htm/preact'
import { useState, useRef } from 'preact/hooks'
import { state } from '../state.js'
import api from '../api.js'
import { nextMarker } from '../../shared/markers.js'
import { parentPath } from '../../shared/paths.js'
import { navigate } from '../router.js'
import { EditorToolbar } from './NodeEditor.js'

const TreeActions = ({ revisionId, path, docId, versionSlug, siblings, onRevisionChange }) => {
  const [showAdd, setShowAdd] = useState(false)
  const [addCaption, setAddCaption] = useState('')
  const [addBody, setAddBody] = useState('')
  const [addMarker, setAddMarker] = useState('')
  const [busy, setBusy] = useState(false)
  const bodyRef = useRef(null)

  const insertAt = (before, after = '') => {
    const ta = bodyRef.current
    if (!ta) return
    const start = ta.selectionStart
    const end = ta.selectionEnd
    const selected = addBody.slice(start, end)
    const newBody = addBody.slice(0, start) + before + selected + after + addBody.slice(end)
    setAddBody(newBody)
    requestAnimationFrame(() => {
      ta.focus()
      ta.selectionStart = start + before.length
      ta.selectionEnd = start + before.length + selected.length
    })
  }

  // Auto-suggest next marker based on siblings
  const suggestMarker = () => {
    if (!siblings || siblings.length === 0) return '1'
    const lastMarker = siblings[siblings.length - 1].marker
    return nextMarker(lastMarker)
  }

  const handleShowAdd = () => {
    setAddMarker(suggestMarker())
    setAddCaption('')
    setAddBody('')
    setShowAdd(true)
  }

  const handleAddChild = async () => {
    if (!addMarker) return
    setBusy(true)
    const result = await api.post(`/revisions/${revisionId}/children/${path}`, {
      body: addBody,
      caption: addCaption,
      marker: addMarker,
    })
    setBusy(false)
    setShowAdd(false)
    if (result.revisionId) {
      onRevisionChange(result.revisionId)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Delete this node and all its children?')) return
    setBusy(true)
    const result = await api.delete(`/revisions/${revisionId}/nodes/${path}`)
    setBusy(false)
    if (result.revisionId) {
      onRevisionChange(result.revisionId)
      const parent = parentPath(path)
      if (parent) navigate(`/${docId}/${versionSlug}/${parent}`)
    }
  }

  return html`
    <div class="tree-actions">
      <button class="btn btn--sm" onclick=${handleShowAdd} disabled=${busy}>+ Add child</button>
      <button class="btn btn--sm btn--danger" onclick=${handleDelete} disabled=${busy}>Delete</button>

      ${showAdd && html`
        <div class="tree-actions__add-form">
          <label class="node-editor__label">
            Marker
            <input class="node-editor__caption" type="text" value=${addMarker} onInput=${(e) => setAddMarker(e.target.value)} />
          </label>
          <label class="node-editor__label">
            Caption
            <input class="node-editor__caption" type="text" value=${addCaption} onInput=${(e) => setAddCaption(e.target.value)} placeholder="Section title" />
          </label>
          <label class="node-editor__label">
            Body
            <${EditorToolbar} onInsert=${insertAt} />
            <textarea ref=${bodyRef} class="node-editor__body" value=${addBody} onInput=${(e) => setAddBody(e.target.value)} rows="4" />
          </label>
          <div class="tree-actions__add-buttons">
            <button class="btn btn--primary btn--sm" onclick=${handleAddChild} disabled=${busy || !addMarker}>Add</button>
            <button class="btn btn--sm" onclick=${() => setShowAdd(false)}>Cancel</button>
          </div>
        </div>
      `}
    </div>
  `
}

export default TreeActions
