import { Router } from 'express'
import * as versions from '../db/versions.js'
import { createInitialRevision, getTree, getRevision, getRevisionBySeq } from '../db/revisions.js'
import { requireAuth } from '../middleware/auth.js'

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
// body: { id, name, description?, forkedFrom?, forkedFromSeq?, kind? }
router.post('/', requireAuth, (req, res) => {
  const db = req.app.locals.db
  const { docId } = req.params
  const { id, name, description, forkedFrom, forkedFromSeq, kind = 'version' } = req.body
  if (!id || !name) return res.status(400).json({ error: 'id and name are required' })
  if (kind !== 'version' && kind !== 'branch') return res.status(400).json({ error: 'kind must be "version" or "branch"' })

  // Resolve fork source: accept either revision ID or seq number
  let forkRevId = forkedFrom
  if (!forkRevId && forkedFromSeq != null) {
    const rev = getRevisionBySeq(db, docId, Number(forkedFromSeq))
    if (!rev) return res.status(404).json({ error: `Revision #${forkedFromSeq} not found` })
    forkRevId = rev.id
  }

  versions.createVersion(db, {
    id,
    documentId: docId,
    name,
    description,
    forkedFrom: forkRevId,
    kind,
  })

  // If forking from an existing revision, create an initial revision with the same tree
  if (forkRevId) {
    const sourceRev = getRevision(db, forkRevId)
    const parentTree = getTree(db, forkRevId)
    if (parentTree.length > 0) {
      createInitialRevision(db, {
        versionId: id,
        message: `Forked from Rev ${sourceRev?.seq || '?'}`,
        createdBy: req.user?.id,
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
router.patch('/:versionId', requireAuth, (req, res) => {
  const db = req.app.locals.db
  const { name, description } = req.body
  versions.updateVersion(db, req.params.versionId, { name, description })
  const version = versions.getVersion(db, req.params.versionId)
  res.json(version)
})

// PATCH /api/v1/documents/:docId/versions/:versionId/lock
router.patch('/:versionId/lock', requireAuth, (req, res) => {
  const db = req.app.locals.db
  const { locked } = req.body
  if (locked === undefined) return res.status(400).json({ error: 'locked is required' })

  const version = versions.getVersion(db, req.params.versionId)
  if (!version) return res.status(404).json({ error: 'Version not found' })

  if (locked) {
    versions.lockVersion(db, req.params.versionId)
  } else {
    versions.unlockVersion(db, req.params.versionId)
  }

  res.json(versions.getVersion(db, req.params.versionId))
})

export default router
