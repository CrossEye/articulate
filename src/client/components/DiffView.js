import { html } from 'htm/preact'
import { useState, useEffect } from 'preact/hooks'
import { navigate } from '../router.js'
import api from '../api.js'

const DiffView = ({ params }) => {
  const { docId, versionSlug, revA, revB } = params
  const [diff, setDiff] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    api.get(`/diff/${revA}/${revB}`)
      .then(data => {
        setDiff(data)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [revA, revB])

  if (loading) return html`<main class="main-content"><p>Loading diff...</p></main>`
  if (error) return html`<main class="main-content"><p class="text-muted">Error: ${error}</p></main>`
  if (!diff) return html`<main class="main-content"><p>No diff data.</p></main>`

  const { from, to, summary, added, removed, modified } = diff
  const hasChanges = summary.added + summary.removed + summary.modified > 0

  return html`
    <main class="main-content diff-view">
      <div class="diff-view__header">
        <h2>Diff</h2>
        <div class="diff-view__revisions">
          <span class="diff-rev diff-rev--from" title=${from.id}>Rev ${from.seq}</span>
          <span class="diff-arrow">\u2192</span>
          <span class="diff-rev diff-rev--to" title=${to.id}>Rev ${to.seq}</span>
        </div>
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
            <div class="diff-entry diff-entry--added">
              <div class="diff-entry__header">
                <span class="diff-entry__marker">${entry.marker}.</span>
                <span class="diff-entry__caption">${entry.caption || entry.path}</span>
                <span class="diff-entry__path">${entry.path}</span>
              </div>
            </div>
          `)}
        </section>
      `}

      ${removed.length > 0 && html`
        <section class="diff-section">
          <h3 class="diff-section__title diff-section__title--removed">Removed</h3>
          ${removed.map(entry => html`
            <div class="diff-entry diff-entry--removed">
              <div class="diff-entry__header">
                <span class="diff-entry__marker">${entry.marker}.</span>
                <span class="diff-entry__caption">${entry.caption || entry.path}</span>
                <span class="diff-entry__path">${entry.path}</span>
              </div>
            </div>
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

      <div class="diff-view__nav">
        <a href="/${docId}/${versionSlug}" onclick=${(e) => { e.preventDefault(); navigate(`/${docId}/${versionSlug}`) }}>
          Back to document
        </a>
      </div>
    </main>
  `
}

const DiffEntry = ({ entry }) => {
  const { path, from, to, lines, captionChanged } = entry

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
        ${lines.map(line => html`
          <div class="diff-line diff-line--${line.type}">${line.value || '\u00A0'}</div>
        `)}
      </div>
    </div>
  `
}

export default DiffView
