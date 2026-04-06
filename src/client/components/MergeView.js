import { html } from 'htm/preact'
import { useState, useEffect } from 'preact/hooks'
import { navigate } from '../router.js'
import { diffLines, diffWords } from '../../shared/diff.js'
import api from '../api.js'
import { state } from '../state.js'

const MergeView = ({ params }) => {
  const { docId } = params
  const [versions, setVersions] = useState([])
  const [seqA, setSeqA] = useState('')
  const [seqB, setSeqB] = useState('')
  const [targetVersionId, setTargetVersionId] = useState('')
  const [preview, setPreview] = useState(null)
  const [resolutions, setResolutions] = useState({})
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [committed, setCommitted] = useState(null)

  // Parse query params on mount
  useEffect(() => {
    const url = new URL(location.href)
    const from = url.searchParams.get('from')
    const into = url.searchParams.get('into')
    const target = url.searchParams.get('target')
    if (from) setSeqA(from)
    if (into) setSeqB(into)
    if (target) setTargetVersionId(target)
  }, [])

  // Load doc + versions for context
  useEffect(() => {
    Promise.all([
      api.get(`/documents/${docId}`),
      api.get(`/documents/${docId}/versions`),
    ]).then(([doc, vers]) => {
      state.currentDoc.value = doc
      state.currentVersion.value = null
      state.currentRevision.value = null
      state.currentRevisionSeq.value = null
      state.currentDiff.value = null
      setVersions(vers)
      if (!targetVersionId && doc.published_version) {
        setTargetVersionId(doc.published_version)
      }
    }).catch(() => {})
  }, [docId])

  const handlePreview = async () => {
    if (!seqA || !seqB) return
    setLoading(true)
    setError(null)
    setPreview(null)
    setResolutions({})
    try {
      const data = await api.post(`/documents/${docId}/merge/preview`, {
        seqA: Number(seqA),
        seqB: Number(seqB),
      })
      setPreview(data)
      if (!message) {
        setMessage(`Merge Rev ${data.from.seq} + Rev ${data.to.seq}`)
      }
    } catch (err) {
      setError(err.message)
    }
    setLoading(false)
  }

  const handleResolve = (path, resolution) => {
    setResolutions(prev => ({ ...prev, [path]: resolution }))
  }

  const allResolved = preview
    ? preview.conflicts.every(c => resolutions[c.path])
    : false

  const handleCommit = async () => {
    if (!allResolved && preview?.conflicts.length > 0) return
    if (!message.trim()) return
    setLoading(true)
    setError(null)
    try {
      const rev = await api.post(`/documents/${docId}/merge/commit`, {
        seqA: Number(seqA),
        seqB: Number(seqB),
        targetVersionId,
        message: message.trim(),
        resolutions,
      })
      setCommitted(rev)
    } catch (err) {
      setError(err.message)
    }
    setLoading(false)
  }

  if (committed) {
    const version = versions.find(v => v.id === targetVersionId)
    const versionSlug = version?.id || targetVersionId
    return html`
      <main class="main-content merge-view">
        <h1>Merge Complete</h1>
        <p>Created Rev ${committed.seq} on ${version?.name || targetVersionId}.</p>
        <p>
          <a href="/${docId}/${versionSlug}/rev/${committed.seq}"
            onclick=${(e) => { e.preventDefault(); navigate(`/${docId}/${versionSlug}/rev/${committed.seq}`) }}>
            View merged revision
          </a>
        </p>
      </main>
    `
  }

  return html`
    <main class="main-content merge-view">
      <h1>Merge Revisions</h1>

      <div class="merge-setup">
        <div class="merge-setup__row">
          <label class="merge-setup__label">
            Ours (Rev #)
            <input class="merge-setup__input" type="number" value=${seqA}
              onInput=${(e) => setSeqA(e.target.value)}
              placeholder="e.g. 5" />
          </label>
          <label class="merge-setup__label">
            Theirs (Rev #)
            <input class="merge-setup__input" type="number" value=${seqB}
              onInput=${(e) => setSeqB(e.target.value)}
              placeholder="e.g. 3" />
          </label>
          <label class="merge-setup__label">
            Target version
            <select class="merge-setup__input" value=${targetVersionId}
              onChange=${(e) => setTargetVersionId(e.target.value)}>
              <option value="">Select...</option>
              ${versions.map(v => html`
                <option key=${v.id} value=${v.id}>${v.name} (${v.kind})</option>
              `)}
            </select>
          </label>
        </div>
        <button class="btn btn--primary" onclick=${handlePreview}
          disabled=${loading || !seqA || !seqB}>
          ${loading ? 'Loading...' : 'Preview Merge'}
        </button>
      </div>

      ${error && html`<p class="merge-error">${error}</p>`}

      ${preview && html`
        <div class="merge-results">
          <div class="diff-summary">
            <span class="diff-stat diff-stat--added">${preview.summary.auto} auto-merged</span>
            <span class="diff-stat ${preview.summary.conflicts > 0 ? 'diff-stat--removed' : 'diff-stat--unchanged'}">
              ${preview.summary.conflicts} conflict${preview.summary.conflicts !== 1 ? 's' : ''}
            </span>
            <span class="diff-stat diff-stat--unchanged">LCA: Rev ${preview.lca.seq}</span>
          </div>

          ${preview.conflicts.length > 0 && html`
            <section class="merge-section">
              <h3 class="merge-section__title merge-section__title--conflicts">
                Conflicts (${preview.conflicts.length})
              </h3>
              ${preview.conflicts.map(conflict => html`
                <${ConflictCard}
                  key=${conflict.path}
                  conflict=${conflict}
                  resolution=${resolutions[conflict.path]}
                  onResolve=${(r) => handleResolve(conflict.path, r)}
                />
              `)}
            </section>
          `}

          ${preview.merged.length > 0 && html`
            <section class="merge-section">
              <h3 class="merge-section__title">Auto-merged (${preview.merged.length})</h3>
              <div class="merge-auto-list">
                ${preview.merged.map(entry => html`
                  <div class="merge-auto" key=${entry.path}>
                    ${entry.marker && html`<span class="diff-entry__marker">${entry.marker}.</span>`}
                    <span class="merge-auto__caption">${entry.caption || entry.path}</span>
                    <span class="diff-entry__path">${entry.path}</span>
                  </div>
                `)}
              </div>
            </section>
          `}

          <div class="merge-commit">
            <h3>Commit Merge</h3>
            <input class="merge-commit__message" type="text"
              placeholder="Merge message..."
              value=${message}
              onInput=${(e) => setMessage(e.target.value)}
              onKeyDown=${(e) => e.key === 'Enter' && allResolved && handleCommit()} />
            <button class="btn btn--primary" onclick=${handleCommit}
              disabled=${loading || !message.trim() || (!allResolved && preview.conflicts.length > 0)}>
              ${loading ? 'Committing...' : 'Commit Merge'}
            </button>
            ${!allResolved && preview.conflicts.length > 0 && html`
              <span class="text-muted" style="font-size:0.85rem">
                Resolve all conflicts before committing
              </span>
            `}
          </div>
        </div>
      `}
    </main>
  `
}

const ConflictCard = ({ conflict, resolution, onResolve }) => {
  const [editing, setEditing] = useState(false)
  const [editBody, setEditBody] = useState('')
  const [editCaption, setEditCaption] = useState('')

  const { path, type, base, ours, theirs } = conflict
  const resolved = !!resolution

  const startEdit = (source) => {
    const entry = source === 'ours' ? ours : theirs
    setEditBody(entry?.body || '')
    setEditCaption(entry?.caption || '')
    setEditing(true)
  }

  const saveEdit = () => {
    onResolve({ body: editBody, caption: editCaption })
    setEditing(false)
  }

  // Generate diffs for display
  const baseBody = base?.body || ''
  const oursBody = ours?.body || ''
  const theirsBody = theirs?.body || ''

  return html`
    <div class="merge-conflict ${resolved ? 'merge-conflict--resolved' : ''}">
      <div class="merge-conflict__header">
        <span class="merge-conflict__path">
          ${(ours || theirs || base)?.marker && html`<strong>${(ours || theirs || base).marker}.</strong>`}
          ${' '}${(ours || theirs || base)?.caption || path}
        </span>
        <span class="merge-conflict__type">${type}</span>
        ${resolved && html`<span class="merge-conflict__resolved-badge">Resolved</span>`}
      </div>

      ${type === 'delete-modify' && html`
        <div class="merge-conflict__info">
          ${!ours ? 'Deleted in ours, modified in theirs' : 'Modified in ours, deleted in theirs'}
        </div>
      `}

      <div class="merge-conflict__sides">
        ${ours && html`
          <div class="merge-conflict__side merge-conflict__side--ours">
            <div class="merge-conflict__side-label">Ours</div>
            <${DiffPanel} base=${baseBody} content=${oursBody} />
          </div>
        `}
        ${theirs && html`
          <div class="merge-conflict__side merge-conflict__side--theirs">
            <div class="merge-conflict__side-label">Theirs</div>
            <${DiffPanel} base=${baseBody} content=${theirsBody} />
          </div>
        `}
      </div>

      <div class="merge-conflict__actions">
        ${ours && html`
          <button class="btn btn--sm ${resolution === 'ours' ? 'btn--primary' : ''}"
            onclick=${() => onResolve('ours')}>
            Use Ours
          </button>
        `}
        ${theirs && html`
          <button class="btn btn--sm ${resolution === 'theirs' ? 'btn--primary' : ''}"
            onclick=${() => onResolve('theirs')}>
            Use Theirs
          </button>
        `}
        ${type === 'delete-modify' && html`
          <button class="btn btn--sm btn--danger"
            onclick=${() => onResolve(ours ? 'ours' : 'theirs')}>
            ${ours ? 'Keep (ours)' : 'Keep (theirs)'}
          </button>
          <button class="btn btn--sm"
            onclick=${() => onResolve(!ours ? 'theirs' : 'ours')}>
            Delete
          </button>
        `}
        <button class="btn btn--sm" onclick=${() => startEdit(ours ? 'ours' : 'theirs')}>
          Edit
        </button>
      </div>

      ${editing && html`
        <div class="merge-editor">
          <label class="merge-editor__label">
            Caption
            <input class="merge-editor__caption" type="text"
              value=${editCaption}
              onInput=${(e) => setEditCaption(e.target.value)} />
          </label>
          <label class="merge-editor__label">
            Body
            <textarea class="merge-editor__body"
              value=${editBody}
              onInput=${(e) => setEditBody(e.target.value)}
              rows=${Math.max(6, editBody.split('\n').length + 2)} />
          </label>
          <div class="merge-editor__actions">
            <button class="btn btn--primary btn--sm" onclick=${saveEdit}>
              Apply Edit
            </button>
            <button class="btn btn--sm" onclick=${() => setEditing(false)}>
              Cancel
            </button>
          </div>
        </div>
      `}
    </div>
  `
}

// Shows a diff between base and content using line-level + word-level highlighting
const DiffPanel = ({ base, content }) => {
  if (base === content) {
    return html`<div class="merge-diff-panel"><div class="diff-line diff-line--equal">${content || '(empty)'}</div></div>`
  }

  const lines = diffLines(base, content)
  const paired = pairLines(lines)

  return html`
    <div class="merge-diff-panel">
      ${paired.map((item, i) => {
        if (item.type === 'pair') {
          const words = diffWords(item.remove, item.add)
          return html`
            <div key=${i} class="diff-line diff-line--remove">${
              words.map(w => w.type === 'equal' ? w.value : w.type === 'remove' ? html`<span class="diff-word diff-word--remove">${w.value}</span>` : null)
            }</div>
            <div class="diff-line diff-line--add">${
              words.map(w => w.type === 'equal' ? w.value : w.type === 'add' ? html`<span class="diff-word diff-word--add">${w.value}</span>` : null)
            }</div>
          `
        }
        return html`<div key=${i} class="diff-line diff-line--${item.type}">${item.value || '\u00A0'}</div>`
      })}
    </div>
  `
}

// Pair adjacent remove+add lines for word-level diffing (same as DiffView)
const pairLines = (lines) => {
  const result = []
  let i = 0
  while (i < lines.length) {
    if (lines[i].type === 'remove' && i + 1 < lines.length && lines[i + 1].type === 'add') {
      result.push({ type: 'pair', remove: lines[i].value, add: lines[i + 1].value })
      i += 2
    } else {
      result.push(lines[i])
      i++
    }
  }
  return result
}

export default MergeView
