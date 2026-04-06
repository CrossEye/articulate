import { Router } from 'express'
import * as docs from '../db/documents.js'
import { getRevisionBySeq, listAllRevisions } from '../db/revisions.js'
import { listVersions } from '../db/versions.js'
import { listTags } from '../db/tags.js'

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

// GET /api/v1/documents/:docId/history — all versions, revisions, and tags for DAG visualization
router.get('/:docId/history', (req, res) => {
  const db = req.app.locals.db
  const { docId } = req.params

  const versions = listVersions(db, docId)
  const revisions = listAllRevisions(db, docId).map(r => ({
    ...r,
    merge_sources: r.merge_sources ? JSON.parse(r.merge_sources) : null,
  }))
  const tags = listTags(db, docId)

  res.json({ versions, revisions, tags })
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
