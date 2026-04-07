import { html } from 'htm/preact'
import { useState, useEffect, useRef, useCallback } from 'preact/hooks'
import { state } from '../state.js'
import { navigate } from '../router.js'
import api from '../api.js'
import { nextMarker } from '../../shared/markers.js'
import { parentPath } from '../../shared/paths.js'
import SubtreeNode from './SubtreeNode.js'
import RevisionControls from './RevisionControls.js'

const AUTOSAVE_DELAY = 2000
const LOCK_RENEW_INTERVAL = 3 * 60_000

const NodeContextView = ({ revisionId, path, docId, versionSlug, readOnly = false }) => {
  const [subtree, setSubtree] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editingPath, setEditingPath] = useState(null)
  const [addingChildOf, setAddingChildOf] = useState(null)
  const [liveRevisionId, setLiveRevisionId] = useState(revisionId)
  const autosaveTimer = useRef(null)
  const lockRenewTimer = useRef(null)

  const revId = liveRevisionId || revisionId

  // Load subtree when revision or path changes
  const loadSubtree = useCallback(async (rid) => {
    const data = await api.get(`/revisions/${rid}/subtree/${path}`)
    setSubtree(data)
  }, [path])

  useEffect(() => {
    if (!revId || !path) return
    setLoading(true)
    loadSubtree(revId)
      .then(() => {
        setLoading(false)
        state.currentPath.value = path
      })
      .catch(() => {
        setSubtree(null)
        setLoading(false)
      })
  }, [revisionId, liveRevisionId, path])

  // Reset live revision when the base revision changes
  useEffect(() => {
    setLiveRevisionId(revisionId)
    setEditingPath(null)
    setAddingChildOf(null)
  }, [revisionId])

  const refreshAfterChange = useCallback(async (newRevId) => {
    setLiveRevisionId(newRevId)
    state.currentRevision.value = newRevId
    await loadSubtree(newRevId)
    const tree = await api.get(`/revisions/${newRevId}/tree`)
    state.treeData.value = tree
  }, [loadSubtree])

  // --- Edit lock management ---

  const handleEdit = useCallback(async (nodePath) => {
    const result = await api.post(`/revisions/${revId}/locks/${nodePath}`, {})
    if (!result.acquired) {
      alert(`This node is being edited by ${result.holder}. Try again after ${new Date(result.expiresAt).toLocaleTimeString()}.`)
      return
    }
    setEditingPath(nodePath)
    setAddingChildOf(null)
    lockRenewTimer.current = setInterval(() => {
      api.patch(`/revisions/${revId}/locks/${nodePath}`, {}).catch(() => {})
    }, LOCK_RENEW_INTERVAL)
  }, [revId])

  const handleDoneEditing = useCallback(() => {
    if (autosaveTimer.current) {
      clearTimeout(autosaveTimer.current)
      autosaveTimer.current = null
    }
    if (lockRenewTimer.current) {
      clearInterval(lockRenewTimer.current)
      lockRenewTimer.current = null
    }
    if (editingPath) {
      api.delete(`/revisions/${revId}/locks/${editingPath}`).catch(() => {})
    }
    setEditingPath(null)
  }, [editingPath, revId])

  // --- Save ---

  const handleSave = useCallback(async (nodePath, { body, caption, metadata }) => {
    const result = await api.put(`/revisions/${revId}/nodes/${nodePath}`, { body, caption, metadata })
    if (result.changed) {
      await refreshAfterChange(result.revisionId)
    }
  }, [revId, refreshAfterChange])

  // --- Add child ---

  const handleAddChild = useCallback((nodePath) => {
    setAddingChildOf(nodePath)
    setEditingPath(null)
  }, [])

  const handleAddChildSubmit = useCallback(async (parentNodePath, { marker, caption, body }) => {
    const result = await api.post(`/revisions/${revId}/children/${parentNodePath}`, {
      marker, caption, body,
    })
    setAddingChildOf(null)
    if (result.revisionId) {
      await refreshAfterChange(result.revisionId)
    }
  }, [revId, refreshAfterChange])

  const handleCancelAdd = useCallback(() => {
    setAddingChildOf(null)
  }, [])

  // --- Delete ---

  const handleDelete = useCallback(async (nodePath) => {
    if (!confirm('Delete this node and all its children?')) return
    const result = await api.delete(`/revisions/${revId}/nodes/${nodePath}`)
    if (result.revisionId) {
      await refreshAfterChange(result.revisionId)
      // If we deleted the root node we're viewing, navigate to parent
      if (nodePath === path) {
        const parent = parentPath(path)
        if (parent) navigate(`/${docId}/${versionSlug}/${parent}`)
      }
    }
  }, [revId, refreshAfterChange, path, docId, versionSlug])

  // --- Render ---

  if (loading) return html`<div class="node-context"><p class="text-muted">Loading...</p></div>`
  if (!subtree || subtree.length === 0) return html`<div class="node-context"><p>Node not found.</p></div>`

  const rootNode = subtree.find(n => n.path === path)
  if (!rootNode) return html`<div class="node-context"><p>Node not found.</p></div>`

  const childNodes = subtree.filter(n => n.parent_path === path)

  return html`
    <div class="node-context">
      <${SubtreeNode}
        node=${rootNode}
        childNodes=${childNodes}
        allNodes=${subtree}
        docId=${docId}
        versionSlug=${versionSlug}
        editingPath=${editingPath}
        addingChildOf=${addingChildOf}
        onEdit=${handleEdit}
        onSave=${handleSave}
        onCancel=${handleDoneEditing}
        onAddChild=${handleAddChild}
        onAddChildSubmit=${handleAddChildSubmit}
        onCancelAdd=${handleCancelAdd}
        onDelete=${handleDelete}
        readOnly=${readOnly}
      />
    </div>
  `
}

export default NodeContextView
