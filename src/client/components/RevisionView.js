import { html } from 'htm/preact'
import { useEffect } from 'preact/hooks'
import { state } from '../state.js'
import api from '../api.js'
import TreeSidebar from './TreeSidebar.js'
import NodeBreadcrumbs from './NodeBreadcrumbs.js'
import NodeContextView from './NodeContextView.js'
import RevisionControls from './RevisionControls.js'

const RevisionView = ({ params }) => {
  const { docId, versionSlug, revSeq } = params
  // Everything after docId/versionSlug (and optional /rev/:revSeq) is the node path
  const pathParam = params['0'] || null

  useEffect(() => {
    state.currentDiff.value = null
    state.loading.value = true
    Promise.all([
      api.get(`/documents/${docId}`),
      api.get(`/documents/${docId}/versions`),
    ]).then(([doc, versions]) => {
      state.currentDoc.value = doc
      const version = versions.find(v => v.id === versionSlug)
      if (!version) {
        state.error.value = 'Version not found'
        state.loading.value = false
        return
      }
      state.currentVersion.value = version

      // If a specific revision seq is in the URL, resolve it; otherwise use head
      const revPromise = revSeq
        ? api.get(`/documents/${docId}/rev/${revSeq}`).then(rev => rev.id)
        : Promise.resolve(version.head_rev)

      return revPromise.then(revId => {
        state.currentRevision.value = revId
        return api.get(`/revisions/${revId}/tree`).then(tree => {
          state.treeData.value = tree
          state.loading.value = false

          if (!pathParam && tree.length > 0) {
            state.currentPath.value = tree[0].path
          } else {
            state.currentPath.value = pathParam
          }
        })
      })
    }).catch(err => {
      state.error.value = err.message
      state.loading.value = false
    })
  }, [docId, versionSlug, revSeq])

  // Update current path when URL changes
  useEffect(() => {
    if (pathParam !== null) {
      state.currentPath.value = pathParam
    }
  }, [pathParam])

  const revisionId = state.currentRevision.value
  const currentPath = pathParam || state.currentPath.value
  const treeData = state.treeData.value

  if (state.loading.value) {
    return html`<main class="main-content"><p>Loading...</p></main>`
  }

  return html`
    <div class="revision-view">
      <${TreeSidebar} docId=${docId} versionSlug=${versionSlug} />
      <main class="content-area">
        ${revisionId && html`
          <${RevisionControls}
            revisionId=${revisionId}
            versionId=${versionSlug}
            docId=${docId}
            versionSlug=${versionSlug}
          />
        `}
        ${currentPath && html`
          <${NodeBreadcrumbs}
            path=${currentPath}
            docId=${docId}
            versionSlug=${versionSlug}
            treeData=${treeData}
          />
        `}
        ${revisionId && currentPath
          ? html`<${NodeContextView}
              revisionId=${revisionId}
              path=${currentPath}
              docId=${docId}
              versionSlug=${versionSlug}
            />`
          : html`<p class="text-muted">Select a node from the tree.</p>`
        }
      </main>
    </div>
  `
}

export default RevisionView
