import { html } from 'htm/preact'
import { navigate } from '../router.js'
import { splitPath } from '../../shared/paths.js'

const NodeBreadcrumbs = ({ path, docId, versionSlug, treeData }) => {
  if (!path) return null

  const segments = splitPath(path)
  const crumbs = segments.map((_, i) => {
    const crumbPath = segments.slice(0, i + 1).join('/')
    const entry = treeData && treeData.find(e => e.path === crumbPath)
    const label = entry ? (entry.marker || entry.path) : segments[i]
    return { path: crumbPath, label }
  })

  return html`
    <nav class="breadcrumbs">
      ${crumbs.map((crumb, i) => html`
        ${i > 0 && html`<span class="breadcrumbs__sep">›</span>`}
        <a
          class="breadcrumbs__link"
          href="/${docId}/${versionSlug}/${crumb.path}"
          onclick=${(e) => { e.preventDefault(); navigate(`/${docId}/${versionSlug}/${crumb.path}`) }}
        >${crumb.label}</a>
      `)}
    </nav>
  `
}

export default NodeBreadcrumbs
