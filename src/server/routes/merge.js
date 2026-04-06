import { Router } from 'express'
import * as revisions from '../db/revisions.js'
import { getVersion } from '../db/versions.js'
import { getNode, createNode } from '../db/nodes.js'
import { findLCA, mergeTrees } from '../../shared/merge.js'

const router = Router({ mergeParams: true })

// Helper: run merge preview logic, shared between preview and commit
const runPreview = (db, docId, seqA, seqB) => {
  const revA = revisions.getRevisionBySeq(db, docId, Number(seqA))
  const revB = revisions.getRevisionBySeq(db, docId, Number(seqB))
  if (!revA) return { error: `Revision #${seqA} not found`, status: 404 }
  if (!revB) return { error: `Revision #${seqB} not found`, status: 404 }

  const getRevision = (id) => revisions.getRevision(db, id)
  const getVersionFn = (id) => getVersion(db, id)

  const lcaId = findLCA(revA.id, revB.id, getRevision, getVersionFn)
  if (!lcaId) return { error: 'No common ancestor found', status: 409 }

  const lcaRev = revisions.getRevision(db, lcaId)
  const treeBase = revisions.getTree(db, lcaId)
  const treeA = revisions.getTree(db, revA.id)
  const treeB = revisions.getTree(db, revB.id)

  const { merged, conflicts } = mergeTrees(treeBase, treeA, treeB)

  // Enrich conflicts with full node data for the client
  const enrichedConflicts = conflicts.map(c => {
    const enrich = (entry) => {
      if (!entry) return null
      const node = getNode(db, entry.node_id)
      return { ...entry, body: node?.body, caption: node?.caption }
    }
    return {
      ...c,
      base: enrich(c.base),
      ours: enrich(c.ours),
      theirs: enrich(c.theirs),
    }
  })

  return {
    revA, revB, lcaRev,
    treeA, treeB,
    merged, conflicts: enrichedConflicts,
    summary: { auto: merged.length, conflicts: conflicts.length },
  }
}

// POST /api/v1/documents/:docId/merge/preview
router.post('/preview', (req, res) => {
  const db = req.app.locals.db
  const { docId } = req.params
  const { seqA, seqB } = req.body

  if (seqA == null || seqB == null) {
    return res.status(400).json({ error: 'seqA and seqB are required' })
  }

  const result = runPreview(db, docId, seqA, seqB)
  if (result.error) return res.status(result.status).json({ error: result.error })

  res.json({
    lca: { id: result.lcaRev.id, seq: result.lcaRev.seq },
    from: { id: result.revA.id, seq: result.revA.seq },
    to: { id: result.revB.id, seq: result.revB.seq },
    merged: result.merged,
    conflicts: result.conflicts,
    summary: result.summary,
  })
})

// POST /api/v1/documents/:docId/merge/commit
router.post('/commit', (req, res) => {
  const db = req.app.locals.db
  const { docId } = req.params
  const { seqA, seqB, targetVersionId, message, resolutions = {} } = req.body

  if (seqA == null || seqB == null) {
    return res.status(400).json({ error: 'seqA and seqB are required' })
  }
  if (!targetVersionId) {
    return res.status(400).json({ error: 'targetVersionId is required' })
  }
  if (!message || !message.trim()) {
    return res.status(400).json({ error: 'message is required' })
  }

  const result = runPreview(db, docId, seqA, seqB)
  if (result.error) return res.status(result.status).json({ error: result.error })

  // Check all conflicts are resolved
  const unresolved = result.conflicts.filter(c => !resolutions[c.path])
  if (unresolved.length > 0) {
    return res.status(400).json({
      error: `${unresolved.length} unresolved conflict(s)`,
      paths: unresolved.map(c => c.path),
    })
  }

  // Build final tree entries from merged + resolved conflicts
  const finalEntries = [...result.merged]

  for (const conflict of result.conflicts) {
    const resolution = resolutions[conflict.path]
    if (resolution === 'ours') {
      if (conflict.ours) finalEntries.push(conflict.ours)
      // If ours is null (delete-modify where ours deleted), omit the entry
    } else if (resolution === 'theirs') {
      if (conflict.theirs) finalEntries.push(conflict.theirs)
    } else if (typeof resolution === 'object') {
      // Manual edit — create a new node
      const sourceEntry = conflict.ours || conflict.theirs || conflict.base
      const nodeId = createNode(db, {
        body: resolution.body ?? '',
        caption: resolution.caption ?? sourceEntry?.caption ?? '',
        nodeType: 'section',
      })
      finalEntries.push({
        ...sourceEntry,
        node_id: nodeId,
        body: undefined,
        caption: undefined,
      })
    }
  }

  // Build entry objects for createInitialRevision
  const entries = finalEntries.map(e => ({
    path: e.path,
    nodeId: e.node_id,
    parentPath: e.parent_path,
    sortKey: e.sort_key,
    marker: e.marker,
    depth: e.depth,
  }))

  const targetVersion = getVersion(db, targetVersionId)
  if (!targetVersion) {
    return res.status(404).json({ error: 'Target version not found' })
  }

  const revId = revisions.createInitialRevision(db, {
    versionId: targetVersionId,
    parentId: targetVersion.head_rev,
    message: message.trim(),
    mergeSources: [result.revA.id, result.revB.id],
    entries,
  })

  const rev = revisions.getRevision(db, revId)
  res.status(201).json(rev)
})

export default router
