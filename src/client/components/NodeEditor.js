import { html } from 'htm/preact'
import { useState, useEffect, useRef } from 'preact/hooks'

const formatMetadata = (raw) => {
  if (!raw) return ''
  try {
    const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw
    return JSON.stringify(parsed, null, 2)
  } catch {
    return typeof raw === 'string' ? raw : ''
  }
}

const NodeEditor = ({ node, onSave, onCancel }) => {
  const [body, setBody] = useState(node.body || '')
  const [caption, setCaption] = useState(node.caption || '')
  const [metaText, setMetaText] = useState(formatMetadata(node.metadata))
  const [metaError, setMetaError] = useState(null)
  const [dirty, setDirty] = useState(false)
  const textareaRef = useRef(null)

  useEffect(() => {
    setBody(node.body || '')
    setCaption(node.caption || '')
    setMetaText(formatMetadata(node.metadata))
    setMetaError(null)
    setDirty(false)
  }, [node.path, node.node_id])

  useEffect(() => {
    if (textareaRef.current) textareaRef.current.focus()
  }, [node.path])

  const handleBodyChange = (e) => {
    setBody(e.target.value)
    setDirty(true)
  }

  const handleCaptionChange = (e) => {
    setCaption(e.target.value)
    setDirty(true)
  }

  const handleSave = () => {
    if (!dirty) return
    let metadata = undefined
    if (metaText.trim()) {
      try {
        metadata = JSON.parse(metaText)
        setMetaError(null)
      } catch {
        setMetaError('Invalid JSON — fix before saving')
        return
      }
    } else {
      metadata = null
    }
    onSave({ body, caption, metadata })
    setDirty(false)
  }

  const handleKeyDown = (e) => {
    if (e.ctrlKey && e.key === 's') {
      e.preventDefault()
      handleSave()
    }
    if (e.key === 'Escape') {
      onCancel()
    }
  }

  // Toolbar actions insert text at cursor
  const insertAt = (before, after = '') => {
    const ta = textareaRef.current
    if (!ta) return
    const start = ta.selectionStart
    const end = ta.selectionEnd
    const selected = body.slice(start, end)
    const replacement = `${before}${selected}${after}`
    const newBody = body.slice(0, start) + replacement + body.slice(end)
    setBody(newBody)
    setDirty(true)
    // Restore cursor after the insertion
    requestAnimationFrame(() => {
      ta.focus()
      ta.selectionStart = start + before.length
      ta.selectionEnd = start + before.length + selected.length
    })
  }

  return html`
    <div class="node-editor" onkeydown=${handleKeyDown}>
      <${EditorToolbar} onInsert=${insertAt} />
      <div class="node-editor__fields">
        <label class="node-editor__label">
          Caption
          <input
            class="node-editor__caption"
            type="text"
            value=${caption}
            onInput=${handleCaptionChange}
          />
        </label>
        <label class="node-editor__label">
          Body
          <textarea
            ref=${textareaRef}
            class="node-editor__body"
            value=${body}
            onInput=${handleBodyChange}
            rows=${Math.max(8, body.split('\n').length + 2)}
          />
        </label>
      </div>
      <details class="node-editor__meta">
        <summary class="node-editor__meta-toggle">Metadata</summary>
        <label class="node-editor__label">
          <textarea
            class="node-editor__body node-editor__meta-json"
            placeholder='{ "adoption_date": "2024-01-01", "owner": "HR" }'
            value=${metaText}
            onInput=${(e) => { setMetaText(e.target.value); setDirty(true) }}
            rows="5"
            spellcheck="false"
          />
        </label>
        ${metaError && html`<p class="node-editor__meta-error">${metaError}</p>`}
      </details>
      <div class="node-editor__actions">
        <button class="btn btn--primary" onclick=${handleSave} disabled=${!dirty}>
          Save (Ctrl+S)
        </button>
        <button class="btn" onclick=${onCancel}>
          Done
        </button>
      </div>
    </div>
  `
}

const EditorToolbar = ({ onInsert }) => html`
  <div class="editor-toolbar">
    <button class="editor-toolbar__btn" onclick=${() => onInsert('**', '**')} title="Bold">B</button>
    <button class="editor-toolbar__btn editor-toolbar__btn--italic" onclick=${() => onInsert('*', '*')} title="Italic">I</button>
    <button class="editor-toolbar__btn" onclick=${() => onInsert('`', '`')} title="Code">${'</>'}</button>
    <button class="editor-toolbar__btn" onclick=${() => onInsert('[[', ']]')} title="Cross-reference">Xref</button>
  </div>
`

export default NodeEditor
export { EditorToolbar }
