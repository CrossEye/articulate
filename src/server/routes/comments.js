import { Router } from 'express'
import * as comments from '../db/comments.js'
import { getVersion } from '../db/versions.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router({ mergeParams: true })

// GET /api/v1/versions/:versionId/comments?path=...
// Returns all comments for the version, optionally filtered to a path
router.get('/', (req, res) => {
  const db = req.app.locals.db
  const { versionId } = req.params
  const { path } = req.query
  const result = path
    ? comments.listComments(db, versionId, path)
    : comments.listAllComments(db, versionId)
  res.json(result)
})

// GET /api/v1/versions/:versionId/comments/counts
// Returns unresolved comment counts per path (for sidebar indicators)
router.get('/counts', (req, res) => {
  res.json(comments.unresolvedCountsByPath(req.app.locals.db, req.params.versionId))
})

// POST /api/v1/versions/:versionId/comments
// body: { path, body, parentId? }
router.post('/', requireAuth, (req, res) => {
  const db = req.app.locals.db
  const { versionId } = req.params
  const { path, body, parentId } = req.body
  if (!path) return res.status(400).json({ error: 'path is required' })
  if (!body || !body.trim()) return res.status(400).json({ error: 'body is required' })

  const version = getVersion(db, versionId)
  if (!version) return res.status(404).json({ error: 'Version not found' })

  const id = comments.createComment(db, {
    versionId, path, userId: req.user.id, body: body.trim(), parentId: parentId || null,
  })
  const comment = db.prepare(`
    SELECT c.*, u.username, u.display_name
    FROM comments c JOIN users u ON u.id = c.user_id WHERE c.id = ?
  `).get(id)
  res.status(201).json(comment)
})

// PATCH /api/v1/versions/:versionId/comments/:commentId/resolve
router.patch('/:commentId/resolve', requireAuth, (req, res) => {
  const db = req.app.locals.db
  const comment = comments.getComment(db, req.params.commentId)
  if (!comment) return res.status(404).json({ error: 'Comment not found' })
  if (comment.version_id !== req.params.versionId) return res.status(404).json({ error: 'Comment not found' })

  const { resolved = true } = req.body
  comments.resolveComment(db, req.params.commentId, resolved)
  const updated = db.prepare(`
    SELECT c.*, u.username, u.display_name
    FROM comments c JOIN users u ON u.id = c.user_id WHERE c.id = ?
  `).get(req.params.commentId)
  res.json(updated)
})

// DELETE /api/v1/versions/:versionId/comments/:commentId
router.delete('/:commentId', requireAuth, (req, res) => {
  const db = req.app.locals.db
  const comment = comments.getComment(db, req.params.commentId)
  if (!comment) return res.status(404).json({ error: 'Comment not found' })
  if (comment.version_id !== req.params.versionId) return res.status(404).json({ error: 'Comment not found' })
  // Only author or admin can delete
  if (comment.user_id !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Not authorized' })
  }
  comments.deleteComment(db, req.params.commentId)
  res.json({ ok: true })
})

// ---- Node reviews ----

// GET /api/v1/versions/:versionId/reviews?path=...
router.get('/reviews', (req, res) => {
  const db = req.app.locals.db
  const { versionId } = req.params
  const { path } = req.query
  if (path) {
    res.json(comments.listReviewsForPath(db, versionId, path))
  } else {
    res.json(comments.reviewSummaryForVersion(db, versionId))
  }
})

// PUT /api/v1/versions/:versionId/reviews
// body: { path, status: 'approved'|'changes-requested' }
router.put('/reviews', requireAuth, (req, res) => {
  const db = req.app.locals.db
  const { versionId } = req.params
  const { path, status } = req.body
  if (!path) return res.status(400).json({ error: 'path is required' })
  if (!['approved', 'changes-requested'].includes(status)) {
    return res.status(400).json({ error: 'status must be "approved" or "changes-requested"' })
  }
  comments.upsertReview(db, { versionId, path, userId: req.user.id, status })
  res.json(comments.listReviewsForPath(db, versionId, path))
})

// DELETE /api/v1/versions/:versionId/reviews?path=...
router.delete('/reviews', requireAuth, (req, res) => {
  const db = req.app.locals.db
  const { path } = req.query
  if (!path) return res.status(400).json({ error: 'path is required' })
  comments.deleteReview(db, req.params.versionId, path, req.user.id)
  res.json({ ok: true })
})

export default router
