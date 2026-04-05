import { Router } from 'express'
import { importDocument, validate } from '../import/generic.js'

const router = Router({ mergeParams: true })

// POST /api/v1/documents/:docId/import
router.post('/', (req, res) => {
  const db = req.app.locals.db
  const data = req.body

  // Allow overriding the document ID from the URL
  const options = { documentId: req.params.docId }

  const errors = validate(data)
  if (errors.length > 0) {
    return res.status(400).json({ error: 'Validation failed', details: errors })
  }

  const result = importDocument(db, data, options)
  if (!result.ok) {
    return res.status(400).json({ error: 'Import failed', details: result.errors })
  }

  res.status(201).json(result)
})

export default router
