import { Router } from 'express'
import * as revisions from '../db/revisions.js'
import { getNode } from '../db/nodes.js'
import { diffTrees } from '../../shared/diff.js'

const router = Router({ mergeParams: true })

// GET /api/v1/documents/:docId/diff/:seqA/:seqB — compare two revisions by seq number
router.get('/:seqA/:seqB', (req, res) => {
  const db = req.app.locals.db
  const { docId, seqA, seqB } = req.params

  const revisionA = revisions.getRevisionBySeq(db, docId, Number(seqA))
  const revisionB = revisions.getRevisionBySeq(db, docId, Number(seqB))
  if (!revisionA) return res.status(404).json({ error: `Revision #${seqA} not found` })
  if (!revisionB) return res.status(404).json({ error: `Revision #${seqB} not found` })

  const treeA = revisions.getTree(db, revisionA.id)
  const treeB = revisions.getTree(db, revisionB.id)

  const nodeLookup = (nodeId) => getNode(db, nodeId)
  const diff = diffTrees(treeA, treeB, nodeLookup)

  res.json({
    from: { id: revisionA.id, seq: revisionA.seq, message: revisionA.message, created_at: revisionA.created_at },
    to: { id: revisionB.id, seq: revisionB.seq, message: revisionB.message, created_at: revisionB.created_at },
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
