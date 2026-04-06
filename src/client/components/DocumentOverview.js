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
  const mainVersions = versions.filter(v => v.kind !== 'branch')
  const branches = versions.filter(v => v.kind === 'branch')

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

      <h2>Versions</h2>
      ${mainVersions.length === 0
        ? html`<p class="text-muted">No versions yet.</p>`
        : html`<${VersionTable} versions=${mainVersions} publishedId=${publishedId} docId=${docId} />`
      }

      <h2>Branches</h2>
      <div class="branch-toolbar">
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
      ${branches.length === 0
        ? html`<p class="text-muted">No branches yet.</p>`
        : html`<${VersionTable} versions=${branches} publishedId=${publishedId} docId=${docId} showMerge />`
      }

      ${tags.length > 0 && html`
        <h2>Tags</h2>
        <${TagList} tags=${tags} docId=${docId} />
      `}
    </main>
  `
}

const VersionTable = ({ versions, publishedId, docId, showMerge }) => html`
  <table class="version-table">
    <thead>
      <tr>
        <th>Name</th>
        <th>Status</th>
        <th>Description</th>
        <th>Created</th>
        ${showMerge && html`<th></th>`}
      </tr>
    </thead>
    <tbody>
      ${versions.map(v => html`
        <tr class="version-row" onclick=${() => navigate(`/${docId}/${v.id}`)}>
          <td>
            <a href="/${docId}/${v.id}" onclick=${(e) => e.preventDefault()}>
              ${v.name}
            </a>
          </td>
          <td>
            ${v.id === publishedId && html`<span class="status-badge status-badge--published">Published</span>`}
            ${!!v.locked && html`<span class="status-badge status-badge--locked">Locked</span>`}
          </td>
          <td>${v.description || ''}</td>
          <td>${new Date(v.created_at).toLocaleDateString()}</td>
          ${showMerge && html`
            <td>
              <a href="/${docId}/merge?target=${v.id}"
                onclick=${(e) => { e.preventDefault(); e.stopPropagation(); navigate(`/${docId}/merge?target=${v.id}`) }}>
                Merge
              </a>
            </td>
          `}
        </tr>
      `)}
    </tbody>
  </table>
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
