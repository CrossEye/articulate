import { Router } from 'express'
import * as docs from '../db/documents.js'

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

// POST /api/v1/documents
router.post('/', (req, res) => {
  const { id, title, metadata } = req.body
  if (!id || !title) return res.status(400).json({ error: 'id and title are required' })
  docs.createDocument(req.app.locals.db, { id, title, metadata })
  const doc = docs.getDocument(req.app.locals.db, id)
  res.status(201).json(doc)
})

export default router
