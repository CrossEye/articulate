// Canonical JSON import handler.
// Validates and ingests documents in the Articulate import format,
// creating a document, version, and initial published revision.

import { createDocument } from '../db/documents.js'
import { createNode } from '../db/nodes.js'
import { createVersion } from '../db/versions.js'
import { createInitialRevision, publishRevision } from '../db/revisions.js'

const validate = (data) => {
  const errors = []
  if (!data.title) errors.push('title is required')
  if (!Array.isArray(data.nodes) || data.nodes.length === 0)
    errors.push('nodes must be a non-empty array')

  const paths = new Set()
  const validateNode = (node, parentPath, depth) => {
    if (!node.path) errors.push(`node at depth ${depth} missing path`)
    if (node.body === undefined) errors.push(`node "${node.path}" missing body`)
    if (!node.marker && depth > 0) errors.push(`node "${node.path}" missing marker`)

    const fullPath = parentPath ? `${parentPath}/${node.path}` : node.path
    if (paths.has(fullPath)) errors.push(`duplicate path: ${fullPath}`)
    paths.add(fullPath)

    if (node.children) {
      for (const child of node.children) {
        validateNode(child, fullPath, depth + 1)
      }
    }
  }

  if (data.nodes) {
    for (const node of data.nodes) {
      validateNode(node, null, 0)
    }
  }

  return errors
}

// Flatten the nested node tree into a list of tree entries + node creation calls
const flattenNodes = (db, nodes, parentPath = null, depth = 0) => {
  const entries = []

  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i]
    const fullPath = parentPath ? `${parentPath}/${node.path}` : node.path

    const nodeId = createNode(db, {
      body: node.body || '',
      caption: node.caption || '',
      nodeType: node.nodeType || 'section',
      metadata: node.metadata || null,
    })

    entries.push({
      path: fullPath,
      nodeId,
      parentPath,
      sortKey: i,
      marker: node.marker || '',
      depth,
    })

    if (node.children && node.children.length > 0) {
      entries.push(...flattenNodes(db, node.children, fullPath, depth + 1))
    }
  }

  return entries
}

const importDocument = (db, data, options = {}) => {
  const errors = validate(data)
  if (errors.length > 0) return { ok: false, errors }

  const docId = options.documentId || data.id || slugify(data.title)
  const versionId = options.versionId || 'original'
  const versionName = options.versionName || 'Original'

  const result = db.transaction(() => {
    createDocument(db, { id: docId, title: data.title, metadata: data.metadata })

    createVersion(db, {
      id: versionId,
      documentId: docId,
      name: versionName,
      description: data.description || null,
    })

    const entries = flattenNodes(db, data.nodes)

    const revisionId = createInitialRevision(db, {
      versionId,
      message: options.message || `Imported "${data.title}"`,
      entries,
    })

    if (options.publish !== false) {
      publishRevision(db, revisionId)
    }

    return { ok: true, documentId: docId, versionId, revisionId, nodeCount: entries.length }
  })()

  return result
}

const slugify = (title) =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

export { importDocument, validate }
