import { html } from 'htm/preact'
import { useEffect } from 'preact/hooks'
import { state } from '../state.js'
import { navigate } from '../router.js'
import api from '../api.js'

const DocumentOverview = ({ params }) => {
  const { docId } = params

  useEffect(() => {
    state.loading.value = true
    Promise.all([
      api.get(`/documents/${docId}`),
      api.get(`/documents/${docId}/versions`),
    ]).then(([doc, versions]) => {
      state.currentDoc.value = doc
      state.currentVersion.value = null
      state.currentRevision.value = null
      state.treeData.value = null
      state.documents.value = state.documents.value // keep
      state.loading.value = false
      // Store versions on doc for this view
      doc._versions = versions
      state.currentDoc.value = { ...doc }
    }).catch(err => {
      state.error.value = err.message
      state.loading.value = false
    })
  }, [docId])

  const doc = state.currentDoc.value
  if (state.loading.value) return html`<main class="main-content"><p>Loading...</p></main>`
  if (!doc) return html`<main class="main-content"><p>Document not found.</p></main>`

  const versions = doc._versions || []

  return html`
    <main class="main-content">
      <h1>${doc.title}</h1>
      <h2>Versions</h2>
      ${versions.length === 0
        ? html`<p class="text-muted">No versions yet.</p>`
        : html`
          <table class="version-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              ${versions.map(v => html`
                <tr class="version-row" onclick=${() => navigate(`/${docId}/${v.id}`)}>
                  <td><a href="/${docId}/${v.id}" onclick=${(e) => e.preventDefault()}>${v.name}</a></td>
                  <td>${v.description || ''}</td>
                  <td>${new Date(v.created_at).toLocaleDateString()}</td>
                </tr>
              `)}
            </tbody>
          </table>
        `
      }
    </main>
  `
}

export default DocumentOverview
