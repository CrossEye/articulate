import { html } from 'htm/preact'
import { useState, useEffect } from 'preact/hooks'
import { navigate } from '../router.js'
import { diffWords } from '../../shared/diff.js'
import api from '../api.js'
import { state } from '../state.js'

const DiffView = ({ params }) => {
  const { docId, versionSlug, seqA, seqB } = params
  const [diff, setDiff] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Load doc/version context for TopBar breadcrumbs
  useEffect(() => {
    Promise.all([
      api.get(`/documents/${docId}`),
      api.get(`/documents/${docId}/versions`),
    ]).then(([doc, versions]) => {
      state.currentDoc.value = doc
      const version = versions.find(v => v.id === versionSlug)
      if (version) state.currentVersion.value = version
    }).catch(() => {})
    return () => { state.currentDiff.value = null }
  }, [docId, versionSlug])

  useEffect(() => {
    setLoading(true)
    api.get(`/documents/${docId}/diff/${seqA}/${seqB}`)
      .then(data => {
        setDiff(data)
        state.currentRevisionSeq.value = data.to.seq
        state.currentDiff.value = { seqA: data.from.seq, seqB: data.to.seq }
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [docId, seqA, seqB])

  if (loading) return html`<main class="main-content"><p>Loading diff...</p></main>`
  if (error) return html`<main class="main-content"><p class="text-muted">Error: ${error}</p></main>`
  if (!diff) return html`<main class="main-content"><p>No diff data.</p></main>`

  const { from, to, summary, added, removed, modified } = diff
  const hasChanges = summary.added + summary.removed + summary.modified > 0

  return html`
    <main class="main-content diff-view">
      <div class="diff-view__header">
        <div class="diff-view__messages">
          ${from.message && html`<div class="diff-msg"><strong>From:</strong> ${from.message}</div>`}
          ${to.message && html`<div class="diff-msg"><strong>To:</strong> ${to.message}</div>`}
        </div>
      </div>

      <div class="diff-summary">
        <span class="diff-stat diff-stat--added">${summary.added} added</span>
        <span class="diff-stat diff-stat--removed">${summary.removed} removed</span>
        <span class="diff-stat diff-stat--modified">${summary.modified} modified</span>
        <span class="diff-stat diff-stat--unchanged">${summary.unchanged} unchanged</span>
      </div>

      ${!hasChanges && html`<p class="text-muted">No changes between these revisions.</p>`}

      ${added.length > 0 && html`
        <section class="diff-section">
          <h3 class="diff-section__title diff-section__title--added">Added</h3>
          ${added.map(entry => html`
            <details class="diff-entry diff-entry--added" open>
              <summary class="diff-entry__header">
                ${entry.marker && html`<span class="diff-entry__marker">${entry.marker}.</span>`}
                <span class="diff-entry__caption">${entry.caption || entry.path}</span>
                <span class="diff-entry__path">${entry.path}</span>
              </summary>
              ${entry.body && html`
                <div class="diff-entry__body">
                  <div class="diff-line diff-line--add">${entry.body}</div>
                </div>
              `}
            </details>
          `)}
        </section>
      `}

      ${removed.length > 0 && html`
        <section class="diff-section">
          <h3 class="diff-section__title diff-section__title--removed">Removed</h3>
          ${removed.map(entry => html`
            <details class="diff-entry diff-entry--removed">
              <summary class="diff-entry__header">
                ${entry.marker && html`<span class="diff-entry__marker">${entry.marker}.</span>`}
                <span class="diff-entry__caption">${entry.caption || entry.path}</span>
                <span class="diff-entry__path">${entry.path}</span>
              </summary>
              ${entry.body && html`
                <div class="diff-entry__body">
                  <div class="diff-line diff-line--remove">${entry.body}</div>
                </div>
              `}
            </details>
          `)}
        </section>
      `}

      ${modified.length > 0 && html`
        <section class="diff-section">
          <h3 class="diff-section__title diff-section__title--modified">Modified</h3>
          ${modified.map(entry => html`
            <${DiffEntry} entry=${entry} />
          `)}
        </section>
      `}

    </main>
  `
}

// Pair adjacent remove+add lines for word-level diffing
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

const WordDiffLine = ({ type, text, words }) => {
  if (!words) {
    return html`<div class="diff-line diff-line--${type}">${text || '\u00A0'}</div>`
  }
  const filterType = type === 'remove' ? 'remove' : 'add'
  return html`
    <div class="diff-line diff-line--${type}">${
      words.map(w =>
        w.type === 'equal'
          ? w.value
          : w.type === filterType
            ? html`<span class="diff-word diff-word--${w.type}">${w.value}</span>`
            : null
      )
    }</div>
  `
}

const DiffEntry = ({ entry }) => {
  const { path, from, to, lines, captionChanged } = entry
  const paired = pairLines(lines)

  return html`
    <div class="diff-entry diff-entry--modified">
      <div class="diff-entry__header">
        <span class="diff-entry__marker">${from.marker || to.marker}.</span>
        <span class="diff-entry__caption">
          ${captionChanged
            ? html`<del class="diff-del">${from.caption}</del> <ins class="diff-ins">${to.caption}</ins>`
            : (from.caption || path)
          }
        </span>
        <span class="diff-entry__path">${path}</span>
      </div>
      <div class="diff-entry__body">
        ${paired.map(item => {
          if (item.type === 'pair') {
            const words = diffWords(item.remove, item.add)
            return html`
              <${WordDiffLine} type="remove" text=${item.remove} words=${words} />
              <${WordDiffLine} type="add" text=${item.add} words=${words} />
            `
          }
          return html`<div class="diff-line diff-line--${item.type}">${item.value || '\u00A0'}</div>`
        })}
      </div>
    </div>
  `
}

export default DiffView
