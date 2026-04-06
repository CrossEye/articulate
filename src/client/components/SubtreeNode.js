import { html } from 'htm/preact'
import { useState, useRef } from 'preact/hooks'
import { marked } from 'marked'
import { renderCrossRefs } from '../lib/markdown.js'
import { navigate } from '../router.js'
import { nextMarker } from '../../shared/markers.js'
import NodeEditor from './NodeEditor.js'
import { EditorToolbar } from './NodeEditor.js'

const SubtreeNode = ({ node, childNodes, allNodes, docId, versionSlug, editingPath, addingChildOf, onEdit, onSave, onCancel, onAddChild, onAddChildSubmit, onCancelAdd, onDelete, readOnly }) => {
  const bodyHtml = node.body
    ? renderCrossRefs(marked(node.body))
    : ''

  const isEditing = editingPath === node.path
  const isAddingChild = addingChildOf === node.path

  const handleLinkClick = (e) => {
    const link = e.target.closest('.cross-ref')
    if (link) {
      e.preventDefault()
      navigate(`/${docId}/${versionSlug}/${link.dataset.path}`)
    }
  }

  return html`
    <div class="subtree-node" data-depth=${node.depth}>
      <div class="subtree-node__header">
        ${node.marker && html`<span class="subtree-node__marker">${node.marker}.</span>`}
        <span class="subtree-node__caption">${node.caption || ''}</span>
        ${!readOnly && html`
          <div class="subtree-node__actions">
            <button class="subtree-btn" onclick=${() => onEdit(node.path)} title="Edit">✎</button>
            <button class="subtree-btn" onclick=${() => onAddChild(node.path)} title="Add child">+</button>
            <button class="subtree-btn subtree-btn--danger" onclick=${() => onDelete(node.path)} title="Delete">🗑</button>
          </div>
        `}
      </div>
      ${isEditing
        ? html`<${NodeEditor}
            node=${node}
            onSave=${(data) => onSave(node.path, data)}
            onCancel=${onCancel}
          />`
        : bodyHtml && html`
            <div class="subtree-node__body" onclick=${handleLinkClick} dangerouslySetInnerHTML=${{ __html: bodyHtml }} />
          `
      }
      ${isAddingChild && html`
        <${AddChildForm}
          parentPath=${node.path}
          siblings=${childNodes}
          onSubmit=${onAddChildSubmit}
          onCancel=${onCancelAdd}
        />
      `}
      ${childNodes.length > 0 && html`
        <div class="subtree-node__children">
          ${childNodes.map(child => {
            const grandchildren = allNodes.filter(n => n.parent_path === child.path)
            return html`<${SubtreeNode}
              key=${child.path}
              node=${child}
              childNodes=${grandchildren}
              allNodes=${allNodes}
              docId=${docId}
              versionSlug=${versionSlug}
              editingPath=${editingPath}
              addingChildOf=${addingChildOf}
              onEdit=${onEdit}
              onSave=${onSave}
              onCancel=${onCancel}
              onAddChild=${onAddChild}
              onAddChildSubmit=${onAddChildSubmit}
              onCancelAdd=${onCancelAdd}
              onDelete=${onDelete}
              readOnly=${readOnly}
            />`
          })}
        </div>
      `}
    </div>
  `
}

const AddChildForm = ({ parentPath, siblings, onSubmit, onCancel }) => {
  const lastMarker = siblings.length > 0 ? siblings[siblings.length - 1].marker : null
  const [marker, setMarker] = useState(lastMarker ? nextMarker(lastMarker) : '1')
  const [caption, setCaption] = useState('')
  const [body, setBody] = useState('')
  const [busy, setBusy] = useState(false)
  const bodyRef = useRef(null)

  const insertAt = (before, after = '') => {
    const ta = bodyRef.current
    if (!ta) return
    const start = ta.selectionStart
    const end = ta.selectionEnd
    const selected = body.slice(start, end)
    const newBody = body.slice(0, start) + before + selected + after + body.slice(end)
    setBody(newBody)
    requestAnimationFrame(() => {
      ta.focus()
      ta.selectionStart = start + before.length
      ta.selectionEnd = start + before.length + selected.length
    })
  }

  const handleSubmit = async () => {
    if (!marker) return
    setBusy(true)
    await onSubmit(parentPath, { marker, caption, body })
    setBusy(false)
  }

  return html`
    <div class="subtree-add-form">
      <div class="subtree-add-form__fields">
        <label class="node-editor__label">
          Marker
          <input class="node-editor__caption" type="text" value=${marker} onInput=${(e) => setMarker(e.target.value)} />
        </label>
        <label class="node-editor__label">
          Caption
          <input class="node-editor__caption" type="text" value=${caption} onInput=${(e) => setCaption(e.target.value)} placeholder="Section title" />
        </label>
        <label class="node-editor__label">
          Body
          <${EditorToolbar} onInsert=${insertAt} />
          <textarea ref=${bodyRef} class="node-editor__body" value=${body} onInput=${(e) => setBody(e.target.value)} rows="4" />
        </label>
      </div>
      <div class="subtree-add-form__buttons">
        <button class="btn btn--primary btn--sm" onclick=${handleSubmit} disabled=${busy || !marker}>Add</button>
        <button class="btn btn--sm" onclick=${onCancel}>Cancel</button>
      </div>
    </div>
  `
}

export default SubtreeNode
