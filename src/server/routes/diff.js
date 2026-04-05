import { Router } from 'express'
import * as revisions from '../db/revisions.js'
import { getNode } from '../db/nodes.js'
import { diffTrees } from '../../shared/diff.js'

const router = Router()

// GET /api/v1/diff/:revA/:revB — compare two revisions
router.get('/:revA/:revB', (req, res) => {
  const db = req.app.locals.db
  const { revA, revB } = req.params

  const revisionA = revisions.getRevision(db, revA)
  const revisionB = revisions.getRevision(db, revB)
  if (!revisionA) return res.status(404).json({ error: `Revision ${revA} not found` })
  if (!revisionB) return res.status(404).json({ error: `Revision ${revB} not found` })

  const treeA = revisions.getTree(db, revA)
  const treeB = revisions.getTree(db, revB)

  const nodeLookup = (nodeId) => getNode(db, nodeId)
  const diff = diffTrees(treeA, treeB, nodeLookup)

  res.json({
    from: { id: revA, message: revisionA.message, created_at: revisionA.created_at },
    to: { id: revB, message: revisionB.message, created_at: revisionB.created_at },
    summary: {
      added: diff.added.length,
      removed: diff.removed.length,
      modified: diff.modified.length,
      unchanged: diff.unchanged.length,
    },
    added: diff.added,
    removed: diff.removed,
    modified: diff.modified,
  })
})

export default router
