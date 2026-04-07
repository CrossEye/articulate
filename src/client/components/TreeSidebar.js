import { html } from 'htm/preact'
import { useState } from 'preact/hooks'
import { state, buildNestedTree } from '../state.js'
import { navigate } from '../router.js'

// Returns true if this node or any descendant has unresolved comments
const hasComments = (node, counts) => {
  if (counts[node.path]) return true
  return node.children?.some(c => hasComments(c, counts)) ?? false
}

const TreeNode = ({ node, docId, versionSlug, depth = 0 }) => {
  const [expanded, setExpanded] = useState(depth < 2)
  const isActive = state.currentPath.value === node.path
  const hasChildren = node.children && node.children.length > 0
  const counts = state.commentCounts.value
  const ownCount = counts[node.path] || 0
  const descendantHasComments = !ownCount && hasComments(node, counts)

  const handleClick = (e) => {
    e.preventDefault()
    const pathSuffix = node.path
    navigate(`/${docId}/${versionSlug}/${pathSuffix}`)
  }

  const toggleExpand = (e) => {
    e.stopPropagation()
    setExpanded(!expanded)
  }

  return html`
    <li class="tree-node ${isActive ? 'tree-node--active' : ''}">
      <div class="tree-node__row" style=${{ paddingLeft: `${depth * 16 + 8}px` }}>
        ${hasChildren
          ? html`<button class="tree-node__toggle" onclick=${toggleExpand}>${expanded ? '▾' : '▸'}</button>`
          : html`<span class="tree-node__toggle tree-node__toggle--empty" />`
        }
        <a class="tree-node__label" href="/${docId}/${versionSlug}/${node.path}" onclick=${handleClick}>
          ${node.marker ? `${node.marker}. ` : ''}${node.caption || node.path}
        </a>
        ${ownCount > 0 && html`<span class="tree-node__comment-badge" title="${ownCount} unresolved comment${ownCount !== 1 ? 's' : ''}">${ownCount}</span>`}
        ${descendantHasComments && html`<span class="tree-node__comment-dot" title="Unresolved comments in subtree" />`}
      </div>
      ${hasChildren && expanded && html`
        <ul class="tree-node__children">
          ${node.children.map(child => html`
            <${TreeNode} node=${child} docId=${docId} versionSlug=${versionSlug} depth=${depth + 1} />
          `)}
        </ul>
      `}
    </li>
  `
}

const TreeSidebar = ({ docId, versionSlug }) => {
  const tree = buildNestedTree.value

  if (!tree) return html`<aside class="tree-sidebar"><p class="text-muted">Loading tree...</p></aside>`

  return html`
    <aside class="tree-sidebar">
      <ul class="tree-root">
        ${tree.map(root => html`
          <${TreeNode} node=${root} docId=${docId} versionSlug=${versionSlug} depth=${0} />
        `)}
      </ul>
    </aside>
  `
}

export default TreeSidebar
