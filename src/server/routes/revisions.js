import { Router } from 'express'
import * as revisions from '../db/revisions.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router({ mergeParams: true })

// GET /api/v1/versions/:versionId/revisions
router.get('/', (req, res) => {
  res.json(revisions.listRevisions(req.app.locals.db, req.params.versionId))
})

// GET /api/v1/revisions/:revisionId (mounted separately)
const revisionDetail = Router()

revisionDetail.get('/:revisionId', (req, res) => {
  const db = req.app.locals.db
  const rev = revisions.getRevision(db, req.params.revisionId)
  if (!rev) return res.status(404).json({ error: 'Revision not found' })
  const parent = rev.parent_id ? revisions.getRevision(db, rev.parent_id) : null
  res.json({ ...rev, parent_seq: parent?.seq || null })
})

// POST /api/v1/versions/:versionId/revisions
// body: { message, changes: [{ action, path, nodeId?, parentPath?, sortKey?, marker?, depth? }] }
router.post('/', requireAuth, (req, res) => {
  const db = req.app.locals.db
  const { versionId } = req.params
  const { message, changes = [] } = req.body

  const version = db.prepare('SELECT * FROM versions WHERE id = ?').get(versionId)
  if (!version) return res.status(404).json({ error: 'Version not found' })

  const parentId = version.head_rev
  const entries = changes
    .filter(c => c.action === 'upsert')
    .map(c => ({
      path: c.path,
      nodeId: c.nodeId,
      parentPath: c.parentPath,
      sortKey: c.sortKey,
      marker: c.marker,
      depth: c.depth,
    }))

  const removals = changes
    .filter(c => c.action === 'remove')
    .map(c => c.path)

  let revId
  try {
    revId = revisions.createRevision(db, {
      versionId,
      parentId,
      message,
      entries,
      createdBy: req.user?.id,
    })
  } catch (err) {
    if (err.message.includes('locked version')) return res.status(409).json({ error: 'Version is locked' })
    throw err
  }

  if (removals.length > 0) {
    revisions.removeTreeEntries(db, revId, removals)
  }

  const rev = revisions.getRevision(db, revId)
  res.status(201).json(rev)
})

// PATCH /api/v1/revisions/:revisionId/publish
revisionDetail.patch('/:revisionId/publish', requireAuth, (req, res) => {
  const db = req.app.locals.db
  const { message } = req.body || {}
  if (!message || !message.trim()) {
    return res.status(400).json({ error: 'A revision message is required when publishing' })
  }
  db.prepare('UPDATE revisions SET message = ? WHERE id = ?').run(message.trim(), req.params.revisionId)
  revisions.publishRevision(db, req.params.revisionId)
  const rev = revisions.getRevision(db, req.params.revisionId)
  res.json(rev)
})

export default router
export { revisionDetail }
