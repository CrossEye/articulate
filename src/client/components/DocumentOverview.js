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
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    state.loading.value = true
    Promise.all([
      api.get(`/documents/${docId}`),
      api.get(`/documents/${docId}/versions`),
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

  const doc = state.currentDoc.value
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
          View History Graph
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

      ${tags.length > 0 && html`
        <h2>Tags</h2>
        <${TagList} tags=${tags} docId=${docId} />
      `}
    </main>
  `
}

const VersionCard = ({ version: v, isPublished, branches, docId, tags }) => {
  const directBranches = branches.get(v.id) || []
  const versionTags = tags.filter(t => t.revision_id && directBranches.some(b => b.head_rev === t.revision_id))

  return html`
    <div class="version-card">
      <div class="version-card__header">
        <a class="version-card__name" href="/${docId}/${v.id}"
          onclick=${(e) => { e.preventDefault(); navigate(`/${docId}/${v.id}`) }}>
          ${v.name}
        </a>
        ${isPublished && html`<span class="status-badge status-badge--published">Published</span>`}
        ${!!v.locked && html`<span class="status-badge status-badge--locked">Locked</span>`}
        ${v.description && html`<span class="version-card__desc">${v.description}</span>`}
      </div>
      ${directBranches.length > 0 && html`
        <div class="version-card__branches">
          <${BranchTree} branches=${directBranches} allBranches=${branches} docId=${docId} tags=${tags} depth=${0} />
        </div>
      `}
    </div>
  `
}

const BranchTree = ({ branches, allBranches, docId, tags, depth }) => html`
  <ul class="branch-tree ${depth > 0 ? 'branch-tree--nested' : ''}">
    ${branches.map(b => {
      const children = allBranches.get(b.id) || []
      const branchTags = tags.filter(t => t.revision_id === b.head_rev)
      return html`
        <li class="branch-tree__item" key=${b.id}>
          <div class="branch-tree__row">
            <a class="branch-tree__link" href="/${docId}/${b.id}"
              onclick=${(e) => { e.preventDefault(); navigate(`/${docId}/${b.id}`) }}>
              ${b.name}
            </a>
            ${branchTags.map(t => html`<span class="tag-badge tag-badge--sm" key=${t.name}>${t.name}</span>`)}
            ${b.description && html`<span class="branch-tree__desc">${b.description}</span>`}
          </div>
          ${children.length > 0 && html`
            <${BranchTree} branches=${children} allBranches=${allBranches} docId=${docId} tags=${tags} depth=${depth + 1} />
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
