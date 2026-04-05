import { html } from 'htm/preact'
import { useState, useEffect } from 'preact/hooks'
import { state } from '../state.js'
import api from '../api.js'
import NodeReadOnly from './NodeReadOnly.js'

const NodeContextView = ({ revisionId, path, docId, versionSlug }) => {
  const [context, setContext] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!revisionId || !path) return
    setLoading(true)
    api.get(`/revisions/${revisionId}/context/${path}`)
      .then(data => {
        setContext(data)
        setLoading(false)
        state.currentPath.value = path
      })
      .catch(() => setLoading(false))
  }, [revisionId, path])

  if (loading) return html`<div class="node-context"><p class="text-muted">Loading...</p></div>`
  if (!context) return html`<div class="node-context"><p>Node not found.</p></div>`

  const { node, siblings, children } = context

  return html`
    <div class="node-context">
      <${NodeReadOnly} node=${node} docId=${docId} versionSlug=${versionSlug} />

      ${children.length > 0 && html`
        <div class="node-context__children">
          ${children.map(child => html`
            <${ChildPreview} entry=${child} revisionId=${revisionId} docId=${docId} versionSlug=${versionSlug} />
          `)}
        </div>
      `}
    </div>
  `
}

// Lightweight child preview that loads node content on demand
const ChildPreview = ({ entry, revisionId, docId, versionSlug }) => {
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

  return html`<${NodeReadOnly} node=${node} docId=${docId} versionSlug=${versionSlug} isContext=${true} />`
}

export default NodeContextView
