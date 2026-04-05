import { Router } from 'express'
import * as revisions from '../db/revisions.js'
import { createNode, getNode } from '../db/nodes.js'

const router = Router({ mergeParams: true })

// GET /api/v1/revisions/:revisionId/tree
router.get('/:revisionId/tree', (req, res) => {
  const tree = revisions.getTree(req.app.locals.db, req.params.revisionId)
  res.json(tree)
})

// GET /api/v1/revisions/:revisionId/tree/:path+
router.get('/:revisionId/tree/*nodePath', (req, res) => {
  const db = req.app.locals.db
  const { revisionId } = req.params
  const nodePath = [].concat(req.params.nodePath).join('/')
  const children = revisions.getChildren(db, revisionId, nodePath)
  res.json(children)
})

// GET /api/v1/revisions/:revisionId/nodes/:path+
router.get('/:revisionId/nodes/*nodePath', (req, res) => {
  const db = req.app.locals.db
  const { revisionId } = req.params
  const nodePath = [].concat(req.params.nodePath).join('/')

  const entry = revisions.getTreeEntry(db, revisionId, nodePath)
  if (!entry) return res.status(404).json({ error: 'Node not found at path' })

  const node = getNode(db, entry.node_id)
  res.json({ ...entry, ...node })
})

// GET /api/v1/revisions/:revisionId/nodes/:path+/context
router.get('/:revisionId/context/*nodePath', (req, res) => {
  const db = req.app.locals.db
  const { revisionId } = req.params
  const nodePath = [].concat(req.params.nodePath).join('/')

  const entry = revisions.getTreeEntry(db, revisionId, nodePath)
  if (!entry) return res.status(404).json({ error: 'Node not found at path' })

  const node = getNode(db, entry.node_id)
  const siblings = revisions.getChildren(db, revisionId, entry.parent_path)
  const children = revisions.getChildren(db, revisionId, nodePath)

  res.json({
    node: { ...entry, ...node },
    siblings,
    children,
  })
})

// PUT /api/v1/revisions/:revisionId/nodes/:path+ — update node (creates new revision)
router.put('/:revisionId/nodes/*nodePath', (req, res) => {
  const db = req.app.locals.db
  const { revisionId } = req.params
  const nodePath = [].concat(req.params.nodePath).join('/')
  const { body, caption, metadata } = req.body

  const entry = revisions.getTreeEntry(db, revisionId, nodePath)
  if (!entry) return res.status(404).json({ error: 'Node not found at path' })

  const oldNode = getNode(db, entry.node_id)
  const newNodeId = createNode(db, {
    body: body !== undefined ? body : oldNode.body,
    caption: caption !== undefined ? caption : oldNode.caption,
    nodeType: oldNode.node_type,
    metadata: metadata !== undefined ? metadata : (oldNode.metadata ? JSON.parse(oldNode.metadata) : null),
  })

  // If content didn't change, no new revision needed
  if (newNodeId === entry.node_id) {
    return res.json({ ...entry, ...oldNode, changed: false })
  }

  const rev = revisions.getRevision(db, revisionId)
  const newRevId = revisions.createRevision(db, {
    versionId: rev.version_id,
    parentId: revisionId,
    message: `Updated ${nodePath}`,
    entries: [{
      path: nodePath,
      nodeId: newNodeId,
      parentPath: entry.parent_path,
      sortKey: entry.sort_key,
      marker: entry.marker,
      depth: entry.depth,
    }],
  })

  const newEntry = revisions.getTreeEntry(db, newRevId, nodePath)
  const newNode = getNode(db, newNodeId)
  res.status(201).json({ ...newEntry, ...newNode, revisionId: newRevId, changed: true })
})

// POST /api/v1/revisions/:revisionId/nodes/:path+/children — add child node
router.post('/:revisionId/children/*nodePath', (req, res) => {
  const db = req.app.locals.db
  const { revisionId } = req.params
  const parentPath = [].concat(req.params.nodePath).join('/')
  const { body, caption = '', marker, nodeType = 'section', metadata } = req.body

  if (!body || !marker) return res.status(400).json({ error: 'body and marker are required' })

  const parentEntry = revisions.getTreeEntry(db, revisionId, parentPath)
  if (!parentEntry) return res.status(404).json({ error: 'Parent node not found' })

  const nodeId = createNode(db, { body, caption, nodeType, metadata })
  const childPath = `${parentPath}/${marker}`
  const siblings = revisions.getChildren(db, revisionId, parentPath)
  const sortKey = siblings.length > 0 ? Math.max(...siblings.map(s => s.sort_key)) + 1 : 0

  const rev = revisions.getRevision(db, revisionId)
  const newRevId = revisions.createRevision(db, {
    versionId: rev.version_id,
    parentId: revisionId,
    message: `Added ${childPath}`,
    entries: [{
      path: childPath,
      nodeId,
      parentPath,
      sortKey,
      marker,
      depth: parentEntry.depth + 1,
    }],
  })

  const newEntry = revisions.getTreeEntry(db, newRevId, childPath)
  const node = getNode(db, nodeId)
  res.status(201).json({ ...newEntry, ...node, revisionId: newRevId })
})

// DELETE /api/v1/revisions/:revisionId/nodes/:path+ — remove node and children
router.delete('/:revisionId/nodes/*nodePath', (req, res) => {
  const db = req.app.locals.db
  const { revisionId } = req.params
  const nodePath = [].concat(req.params.nodePath).join('/')

  const entry = revisions.getTreeEntry(db, revisionId, nodePath)
  if (!entry) return res.status(404).json({ error: 'Node not found at path' })

  // Find all descendants
  const allEntries = revisions.getTree(db, revisionId)
  const toRemove = allEntries
    .filter(e => e.path === nodePath || e.path.startsWith(nodePath + '/'))
    .map(e => e.path)

  const rev = revisions.getRevision(db, revisionId)
  const newRevId = revisions.createRevision(db, {
    versionId: rev.version_id,
    parentId: revisionId,
    message: `Removed ${nodePath}`,
    entries: [],
  })

  revisions.removeTreeEntries(db, newRevId, toRemove)

  res.json({ revisionId: newRevId, removed: toRemove })
})

export default router
