import { Router } from 'express'
import { acquireLock, renewLock, releaseLock, getLock } from '../db/locks.js'

const router = Router()

// POST /api/v1/revisions/:revisionId/locks/:path+ — acquire lock
router.post('/:revisionId/locks/*nodePath', (req, res) => {
  const db = req.app.locals.db
  const { revisionId } = req.params
  const path = [].concat(req.params.nodePath).join('/')
  const userId = req.body.userId || 'anonymous'

  const result = acquireLock(db, { revisionId, path, userId })
  res.json(result)
})

// PATCH /api/v1/revisions/:revisionId/locks/:path+ — renew lock
router.patch('/:revisionId/locks/*nodePath', (req, res) => {
  const db = req.app.locals.db
  const { revisionId } = req.params
  const path = [].concat(req.params.nodePath).join('/')
  const userId = req.body.userId || 'anonymous'

  const result = renewLock(db, { revisionId, path, userId })
  res.json(result)
})

// DELETE /api/v1/revisions/:revisionId/locks/:path+ — release lock
router.delete('/:revisionId/locks/*nodePath', (req, res) => {
  const db = req.app.locals.db
  const { revisionId } = req.params
  const path = [].concat(req.params.nodePath).join('/')
  const userId = req.body?.userId || req.query.userId || 'anonymous'

  releaseLock(db, { revisionId, path, userId })
  res.json({ released: true })
})

// GET /api/v1/revisions/:revisionId/locks/:path+ — check lock
router.get('/:revisionId/locks/*nodePath', (req, res) => {
  const db = req.app.locals.db
  const { revisionId } = req.params
  const path = [].concat(req.params.nodePath).join('/')

  const lock = getLock(db, { revisionId, path })
  res.json(lock ? { locked: true, ...lock } : { locked: false })
})

export default router
