import { html } from 'htm/preact'
import { useState, useEffect, useRef, useCallback } from 'preact/hooks'
import { state } from '../state.js'
import { navigate } from '../router.js'
import api from '../api.js'
import NodeReadOnly from './NodeReadOnly.js'
import NodeEditor from './NodeEditor.js'
import TreeActions from './TreeActions.js'

const AUTOSAVE_DELAY = 2000
const LOCK_RENEW_INTERVAL = 3 * 60_000 // renew every 3 minutes

const NodeContextView = ({ revisionId, path, docId, versionSlug }) => {
  const [context, setContext] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editingPath, setEditingPath] = useState(null)
  const [liveRevisionId, setLiveRevisionId] = useState(revisionId)
  const autosaveTimer = useRef(null)
  const lockRenewTimer = useRef(null)

  // Load context when revision or path changes
  useEffect(() => {
    const revId = liveRevisionId || revisionId
    if (!revId || !path) return
    setLoading(true)
    api.get(`/revisions/${revId}/context/${path}`)
      .then(data => {
        setContext(data)
        setLoading(false)
        state.currentPath.value = path
      })
      .catch(() => {
        setContext(null)
        setLoading(false)
      })
  }, [revisionId, liveRevisionId, path])

  // Reset live revision when the base revision changes
  useEffect(() => {
    setLiveRevisionId(revisionId)
    setEditingPath(null)
  }, [revisionId])

  const handleEdit = async (nodePath) => {
    const revId = liveRevisionId || revisionId
    const result = await api.post(`/revisions/${revId}/locks/${nodePath}`, { userId: 'anonymous' })
    if (!result.acquired) {
      alert(`This node is being edited by ${result.holder}. Try again after ${new Date(result.expiresAt).toLocaleTimeString()}.`)
      return
    }
    setEditingPath(nodePath)
    // Start lock renewal
    lockRenewTimer.current = setInterval(() => {
      const currentRevId = liveRevisionId || revisionId
      api.patch(`/revisions/${currentRevId}/locks/${nodePath}`, { userId: 'anonymous' }).catch(() => {})
    }, LOCK_RENEW_INTERVAL)
  }

  const handleSave = useCallback(async (nodePath, { body, caption }) => {
    const revId = liveRevisionId || revisionId
    const result = await api.put(`/revisions/${revId}/nodes/${nodePath}`, { body, caption })
    if (result.changed) {
      setLiveRevisionId(result.revisionId)
      state.currentRevision.value = result.revisionId
      // Reload tree to reflect any changes
      const tree = await api.get(`/revisions/${result.revisionId}/tree`)
      state.treeData.value = tree
    }
  }, [liveRevisionId, revisionId])

  const handleAutoSave = useCallback((nodePath, fields) => {
    if (autosaveTimer.current) clearTimeout(autosaveTimer.current)
    autosaveTimer.current = setTimeout(() => handleSave(nodePath, fields), AUTOSAVE_DELAY)
  }, [handleSave])

  const handleRevisionChange = useCallback(async (newRevId) => {
    setLiveRevisionId(newRevId)
    state.currentRevision.value = newRevId
    const tree = await api.get(`/revisions/${newRevId}/tree`)
    state.treeData.value = tree
  }, [])

  const handleDoneEditing = () => {
    if (autosaveTimer.current) {
      clearTimeout(autosaveTimer.current)
      autosaveTimer.current = null
    }
    if (lockRenewTimer.current) {
      clearInterval(lockRenewTimer.current)
      lockRenewTimer.current = null
    }
    // Release the lock
    if (editingPath) {
      const revId = liveRevisionId || revisionId
      api.delete(`/revisions/${revId}/locks/${editingPath}?userId=anonymous`).catch(() => {})
    }
    setEditingPath(null)
  }

  if (loading) return html`<div class="node-context"><p class="text-muted">Loading...</p></div>`
  if (!context) return html`<div class="node-context"><p>Node not found.</p></div>`

  const { node, siblings, children } = context

  return html`
    <div class="node-context">
      ${editingPath === node.path
        ? html`<${NodeEditor}
            node=${node}
            onSave=${(fields) => handleSave(node.path, fields)}
            onCancel=${handleDoneEditing}
          />`
        : html`<${NodeReadOnly}
            node=${node}
            docId=${docId}
            versionSlug=${versionSlug}
            onEdit=${() => handleEdit(node.path)}
          />`
      }

      <${TreeActions}
        revisionId=${liveRevisionId || revisionId}
        path=${path}
        docId=${docId}
        versionSlug=${versionSlug}
        siblings=${children}
        onRevisionChange=${handleRevisionChange}
      />

      ${children.length > 0 && html`
        <div class="node-context__children">
          ${children.map(child => html`
            <${ChildNode}
              entry=${child}
              revisionId=${liveRevisionId || revisionId}
              docId=${docId}
              versionSlug=${versionSlug}
              editingPath=${editingPath}
              onEdit=${handleEdit}
              onSave=${handleSave}
              onDone=${handleDoneEditing}
            />
          `)}
        </div>
      `}
    </div>
  `
}

const ChildNode = ({ entry, revisionId, docId, versionSlug, editingPath, onEdit, onSave, onDone }) => {
  const [node, setNode] = useState(null)

  useEffect(() => {
    api.get(`/revisions/${revisionId}/nodes/${entry.path}`)
      .then(setNode)
      .catch(() => {})
  }, [revisionId, entry.path])

  if (!node) return html`
    <div class="node-readonly node-readonly--context">
      <header class="node-readonly__header">
        <span class="node-readonly__marker">${entry.marker}.</span>
        <span class="node-readonly__caption">Loading...</span>
      </header>
    </div>
  `

  if (editingPath === entry.path) {
    return html`<${NodeEditor}
      node=${node}
      onSave=${(fields) => onSave(entry.path, fields)}
      onCancel=${onDone}
    />`
  }

  return html`<${NodeReadOnly}
    node=${node}
    docId=${docId}
    versionSlug=${versionSlug}
    isContext=${true}
    onEdit=${() => onEdit(entry.path)}
  />`
}

export default NodeContextView
