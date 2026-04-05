import { html } from 'htm/preact'
import { marked } from 'marked'
import { renderCrossRefs } from '../lib/markdown.js'
import { navigate } from '../router.js'

const NodeReadOnly = ({ node, docId, versionSlug, isContext = false }) => {
  if (!node) return null

  const bodyHtml = node.body
    ? renderCrossRefs(marked(node.body))
    : ''

  const handleClick = (e) => {
    // Handle cross-reference clicks
    const link = e.target.closest('.cross-ref')
    if (link) {
      e.preventDefault()
      const path = link.dataset.path
      navigate(`/${docId}/${versionSlug}/${path}`)
    }
  }

  return html`
    <article class="node-readonly ${isContext ? 'node-readonly--context' : ''}" onclick=${handleClick}>
      <header class="node-readonly__header">
        ${node.marker && html`<span class="node-readonly__marker">${node.marker}.</span>`}
        <span class="node-readonly__caption">${node.caption || ''}</span>
      </header>
      ${bodyHtml && html`
        <div class="node-readonly__body" dangerouslySetInnerHTML=${{ __html: bodyHtml }} />
      `}
    </article>
  `
}

export default NodeReadOnly
