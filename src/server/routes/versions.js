import { Router } from 'express'
import * as versions from '../db/versions.js'
import { createInitialRevision, getTree } from '../db/revisions.js'

const router = Router({ mergeParams: true })

// GET /api/v1/documents/:docId/versions
router.get('/', (req, res) => {
  res.json(versions.listVersions(req.app.locals.db, req.params.docId))
})

// GET /api/v1/documents/:docId/versions/:versionId
router.get('/:versionId', (req, res) => {
  const version = versions.getVersion(req.app.locals.db, req.params.versionId)
  if (!version) return res.status(404).json({ error: 'Version not found' })
  res.json(version)
})

// POST /api/v1/documents/:docId/versions
// body: { id, name, description?, forkedFrom? }
router.post('/', (req, res) => {
  const db = req.app.locals.db
  const { id, name, description, forkedFrom } = req.body
  if (!id || !name) return res.status(400).json({ error: 'id and name are required' })

  versions.createVersion(db, {
    id,
    documentId: req.params.docId,
    name,
    description,
    forkedFrom,
  })

  // If forking from an existing revision, create an initial revision with the same tree
  if (forkedFrom) {
    const parentTree = getTree(db, forkedFrom)
    if (parentTree.length > 0) {
      createInitialRevision(db, {
        versionId: id,
        message: `Forked from revision ${forkedFrom}`,
        entries: parentTree.map(e => ({
          path: e.path,
          nodeId: e.node_id,
          parentPath: e.parent_path,
          sortKey: e.sort_key,
          marker: e.marker,
          depth: e.depth,
        })),
      })
    }
  }

  const version = versions.getVersion(db, id)
  res.status(201).json(version)
})

// PATCH /api/v1/documents/:docId/versions/:versionId
router.patch('/:versionId', (req, res) => {
  const db = req.app.locals.db
  const { name, description } = req.body
  versions.updateVersion(db, req.params.versionId, { name, description })
  const version = versions.getVersion(db, req.params.versionId)
  res.json(version)
})

export default router
