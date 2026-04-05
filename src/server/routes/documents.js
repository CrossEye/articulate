import { Router } from 'express'
import * as docs from '../db/documents.js'
import { getRevisionBySeq } from '../db/revisions.js'

const router = Router()

// GET /api/v1/documents
router.get('/', (req, res) => {
  res.json(docs.listDocuments(req.app.locals.db))
})

// GET /api/v1/documents/:docId
router.get('/:docId', (req, res) => {
  const doc = docs.getDocument(req.app.locals.db, req.params.docId)
  if (!doc) return res.status(404).json({ error: 'Document not found' })
  res.json(doc)
})

// GET /api/v1/documents/:docId/rev/:seq — resolve seq number to revision
router.get('/:docId/rev/:seq', (req, res) => {
  const rev = getRevisionBySeq(req.app.locals.db, req.params.docId, Number(req.params.seq))
  if (!rev) return res.status(404).json({ error: `Revision #${req.params.seq} not found` })
  res.json(rev)
})

// POST /api/v1/documents
router.post('/', (req, res) => {
  const { id, title, metadata } = req.body
  if (!id || !title) return res.status(400).json({ error: 'id and title are required' })
  docs.createDocument(req.app.locals.db, { id, title, metadata })
  const doc = docs.getDocument(req.app.locals.db, id)
  res.status(201).json(doc)
})

export default router
