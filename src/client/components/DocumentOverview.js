import { html } from 'htm/preact'
import { useState, useEffect } from 'preact/hooks'
import { state } from '../state.js'
import { navigate } from '../router.js'
import api from '../api.js'

const DocumentOverview = ({ params }) => {
  const { docId } = params
  const [versions, setVersions] = useState([])
  const [tags, setTags] = useState([])
  const [showNewBranch, setShowNewBranch] = useState(false)
  const [branchName, setBranchName] = useState('')
  const [branchSource, setBranchSource] = useState('')
  const [showArchived, setShowArchived] = useState(false)
  const [busy, setBusy] = useState(false)

  const loadVersions = (includeArchived = false) =>
    api.get(`/documents/${docId}/versions${includeArchived ? '?include_archived=true' : ''}`)

  useEffect(() => {
    state.loading.value = true
    Promise.all([
      api.get(`/documents/${docId}`),
      loadVersions(showArchived),
      api.get(`/documents/${docId}/tags`),
    ]).then(([doc, vers, tgs]) => {
      state.currentDoc.value = doc
      state.currentVersion.value = null
      state.currentRevision.value = null
      state.currentRevisionSeq.value = null
      state.currentDiff.value = null
      state.treeData.value = null
      setVersions(vers)
      setTags(tgs)
      state.loading.value = false
    }).catch(err => {
      state.error.value = err.message
      state.loading.value = false
    })
  }, [docId])

  const handleToggleArchived = async () => {
    const next = !showArchived
    setShowArchived(next)
    const vers = await loadVersions(next)
    setVersions(vers)
  }

  const handleArchiveVersion = async (versionId) => {
    await api.delete(`/documents/${docId}/versions/${versionId}`)
    const vers = await loadVersions(showArchived)
    setVersions(vers)
  }

  const handleRestoreVersion = async (versionId) => {
    await api.post(`/documents/${docId}/versions/${versionId}/restore`, {})
    const vers = await loadVersions(showArchived)
    setVersions(vers)
  }

  const doc = state.currentDoc.value
  const user = state.currentUser.value
  if (state.loading.value) return html`<main class="main-content"><p>Loading...</p></main>`
  if (!doc) return html`<main class="main-content"><p>Document not found.</p></main>`

  const publishedId = doc.published_version
  const topVersions = versions.filter(v => v.kind === 'version')

  // Build branch tree: group branches by parent_version_id
  const branchesByParent = new Map()
  for (const v of versions) {
    if (v.kind !== 'branch') continue
    const parent = v.parent_version_id || '_orphan'
    const list = branchesByParent.get(parent) || []
    list.push(v)
    branchesByParent.set(parent, list)
  }

  const handleCreateBranch = async () => {
    if (!branchName.trim()) return
    setBusy(true)
    const id = branchName.trim().toLowerCase().replace(/\s+/g, '-')
    const body = { id, name: branchName.trim(), kind: 'branch' }
    if (branchSource.trim()) body.forkedFromSeq = Number(branchSource.trim())
    try {
      const ver = await api.post(`/documents/${docId}/versions`, body)
      setVersions([...versions, ver])
      setShowNewBranch(false)
      setBranchName('')
      setBranchSource('')
      navigate(`/${docId}/${ver.id}`)
    } catch (err) {
      alert(err.message)
    }
    setBusy(false)
  }

  return html`
    <main class="main-content">
      <h1>${doc.title}</h1>
      <p>
        <a href="/${docId}/history" onclick=${(e) => { e.preventDefault(); navigate(`/${docId}/history`) }}>
          History Graph
        </a>
        ${' · '}
        <a href="/${docId}/dashboard" onclick=${(e) => { e.preventDefault(); navigate(`/${docId}/dashboard`) }}>
          Active Branches
        </a>
      </p>

      ${topVersions.map(v => html`
        <${VersionCard}
          key=${v.id}
          version=${v}
          isPublished=${v.id === publishedId}
          branches=${branchesByParent}
          docId=${docId}
          tags=${tags}
          user=${user}
          onArchive=${handleArchiveVersion}
          onRestore=${handleRestoreVersion}
        />
      `)}

      <div class="branch-toolbar" style="margin-top: 1.5rem">
        ${!showNewBranch
          ? html`<button class="btn btn--sm" onclick=${() => setShowNewBranch(true)}>New Branch</button>`
          : html`
            <div class="branch-form">
              <input class="branch-form__input" type="text" placeholder="Branch name..."
                value=${branchName} onInput=${(e) => setBranchName(e.target.value)}
                onKeyDown=${(e) => e.key === 'Enter' && handleCreateBranch()} />
              <input class="branch-form__input branch-form__input--sm" type="text" placeholder="From rev #"
                value=${branchSource} onInput=${(e) => setBranchSource(e.target.value)}
                onKeyDown=${(e) => e.key === 'Enter' && handleCreateBranch()} />
              <button class="btn btn--primary btn--sm" onclick=${handleCreateBranch}
                disabled=${busy || !branchName.trim()}>Create</button>
              <button class="btn btn--sm" onclick=${() => setShowNewBranch(false)}>Cancel</button>
            </div>
          `
        }
      </div>

      <button class="btn btn--sm" onclick=${handleToggleArchived} style="margin-left: var(--space-sm)">
        ${showArchived ? 'Hide archived' : 'Show archived'}
      </button>

      ${tags.length > 0 && html`
        <h2>Tags</h2>
        <${TagList} tags=${tags} docId=${docId} />
      `}
    </main>
  `
}

const VersionCard = ({ version: v, isPublished, branches, docId, tags, user, onArchive, onRestore }) => {
  const directBranches = branches.get(v.id) || []
  const isArchived = !!v.archived_at
  const canArchive = user?.role === 'admin'

  return html`
    <div class="version-card ${isArchived ? 'version-card--archived' : ''}">
      <div class="version-card__header">
        <a class="version-card__name" href="/${docId}/${v.id}"
          onclick=${(e) => { e.preventDefault(); navigate(`/${docId}/${v.id}`) }}>
          ${v.name}
        </a>
        ${isPublished && html`<span class="status-badge status-badge--published">Published</span>`}
        ${!!v.locked && html`<span class="status-badge status-badge--locked">Locked</span>`}
        ${isArchived && html`<span class="status-badge status-badge--archived">Archived</span>`}
        ${v.description && html`<span class="version-card__desc">${v.description}</span>`}
        ${canArchive && html`
          <span class="version-card__actions">
            ${isArchived
              ? html`<button class="btn btn--xs" onclick=${() => onRestore(v.id)}>Restore</button>`
              : html`<button class="btn btn--xs btn--danger" onclick=${() => onArchive(v.id)}>Archive</button>`
            }
          </span>
        `}
      </div>
      ${directBranches.length > 0 && html`
        <div class="version-card__branches">
          <${BranchTree} branches=${directBranches} allBranches=${branches} docId=${docId} tags=${tags}
            depth=${0} user=${user} onArchive=${onArchive} onRestore=${onRestore} />
        </div>
      `}
    </div>
  `
}

const BranchTree = ({ branches, allBranches, docId, tags, depth, user, onArchive, onRestore }) => html`
  <ul class="branch-tree ${depth > 0 ? 'branch-tree--nested' : ''}">
    ${branches.map(b => {
      const children = allBranches.get(b.id) || []
      const branchTags = tags.filter(t => t.revision_id === b.head_rev)
      const isArchived = !!b.archived_at
      const canArchive = user?.role === 'admin' || user?.id === b.created_by
      return html`
        <li class="branch-tree__item ${isArchived ? 'branch-tree__item--archived' : ''}" key=${b.id}>
          <div class="branch-tree__row">
            <a class="branch-tree__link" href="/${docId}/${b.id}"
              onclick=${(e) => { e.preventDefault(); navigate(`/${docId}/${b.id}`) }}>
              ${b.name}
            </a>
            ${branchTags.map(t => html`<span class="tag-badge tag-badge--sm" key=${t.name}>${t.name}</span>`)}
            ${isArchived && html`<span class="status-badge status-badge--archived">Archived</span>`}
            ${b.description && html`<span class="branch-tree__desc">${b.description}</span>`}
            ${canArchive && html`
              ${isArchived
                ? html`<button class="btn btn--xs" onclick=${() => onRestore(b.id)}>Restore</button>`
                : html`<button class="btn btn--xs btn--danger" onclick=${() => onArchive(b.id)}>Archive</button>`
              }
            `}
          </div>
          ${children.length > 0 && html`
            <${BranchTree} branches=${children} allBranches=${allBranches} docId=${docId} tags=${tags}
              depth=${depth + 1} user=${user} onArchive=${onArchive} onRestore=${onRestore} />
          `}
        </li>
      `
    })}
  </ul>
`

const TagList = ({ tags, docId }) => html`
  <table class="version-table">
    <thead>
      <tr>
        <th>Tag</th>
        <th>Rev</th>
        <th>Created</th>
      </tr>
    </thead>
    <tbody>
      ${tags.map(t => html`
        <tr>
          <td><span class="tag-badge">${t.name}</span></td>
          <td>${t.seq || '?'}</td>
          <td>${new Date(t.created_at).toLocaleDateString()}</td>
        </tr>
      `)}
    </tbody>
  </table>
`

export default DocumentOverview
