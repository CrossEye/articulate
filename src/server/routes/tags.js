import { Router } from 'express'
import * as tags from '../db/tags.js'
import { getRevisionBySeq } from '../db/revisions.js'

const router = Router({ mergeParams: true })

// GET /api/v1/documents/:docId/tags
router.get('/', (req, res) => {
  res.json(tags.listTags(req.app.locals.db, req.params.docId))
})

// POST /api/v1/documents/:docId/tags
router.post('/', (req, res) => {
  const db = req.app.locals.db
  const { docId } = req.params
  const { name, revisionId, revisionSeq } = req.body
  if (!name) return res.status(400).json({ error: 'name is required' })

  // Resolve revision: accept either ID or seq
  let revId = revisionId
  if (!revId && revisionSeq != null) {
    const rev = getRevisionBySeq(db, docId, Number(revisionSeq))
    if (!rev) return res.status(404).json({ error: `Revision #${revisionSeq} not found` })
    revId = rev.id
  }
  if (!revId) return res.status(400).json({ error: 'revisionId or revisionSeq is required' })

  // Check for duplicate
  const existing = tags.getTag(db, docId, name)
  if (existing) return res.status(409).json({ error: `Tag "${name}" already exists` })

  tags.createTag(db, { documentId: docId, name, revisionId: revId })
  const tag = tags.getTag(db, docId, name)
  res.status(201).json(tag)
})

// PATCH /api/v1/documents/:docId/tags/:name — move tag
router.patch('/:name', (req, res) => {
  const db = req.app.locals.db
  const { docId, name } = req.params
  const { revisionId, revisionSeq } = req.body

  const existing = tags.getTag(db, docId, name)
  if (!existing) return res.status(404).json({ error: `Tag "${name}" not found` })

  let revId = revisionId
  if (!revId && revisionSeq != null) {
    const rev = getRevisionBySeq(db, docId, Number(revisionSeq))
    if (!rev) return res.status(404).json({ error: `Revision #${revisionSeq} not found` })
    revId = rev.id
  }
  if (!revId) return res.status(400).json({ error: 'revisionId or revisionSeq is required' })

  tags.moveTag(db, docId, name, revId)
  res.json(tags.getTag(db, docId, name))
})

// DELETE /api/v1/documents/:docId/tags/:name
router.delete('/:name', (req, res) => {
  const db = req.app.locals.db
  const { docId, name } = req.params

  const existing = tags.getTag(db, docId, name)
  if (!existing) return res.status(404).json({ error: `Tag "${name}" not found` })

  tags.deleteTag(db, docId, name)
  res.json({ ok: true })
})

export default router
