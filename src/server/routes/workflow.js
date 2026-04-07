import { Router } from 'express'
import { randomUUID } from 'node:crypto'
import { getVersion, getVersionMembers, setWorkflowStatus } from '../db/versions.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router({ mergeParams: true })

// Valid forward transitions
const TRANSITIONS = {
  null:               ['draft'],
  draft:              ['committee-review'],
  'committee-review': ['first-reading', 'draft'],
  'first-reading':    ['second-reading', 'committee-review', 'draft'],
  'second-reading':   ['approved', 'rejected', 'committee-review', 'draft'],
}

// Which stages freeze content editing
const FROZEN_STAGES = new Set(['first-reading', 'second-reading', 'approved', 'rejected'])

// Can this user transition this branch?
const canTransition = (user, version, db) => {
  if (user.role === 'admin') return true
  const status = version.workflow_status || null
  // Branch creator can advance from draft → committee-review
  if (status === null || status === 'draft') {
    return version.created_by === user.id
  }
  // Version members (editor role) can advance from committee-review → first-reading
  if (status === 'committee-review') {
    const members = getVersionMembers(db, version.id)
    return members.some(m => m.id === user.id)
  }
  // First/second reading and beyond: admin only (handled above)
  return false
}

// PATCH /api/v1/documents/:docId/versions/:versionId/workflow
router.patch('/:versionId/workflow', requireAuth, (req, res) => {
  const db = req.app.locals.db
  const { versionId } = req.params
  const { status, note } = req.body

  if (!status) return res.status(400).json({ error: 'status is required' })
  if (!note || !note.trim()) return res.status(400).json({ error: 'note is required' })

  const version = getVersion(db, versionId)
  if (!version) return res.status(404).json({ error: 'Version not found' })
  if (version.kind !== 'branch') return res.status(400).json({ error: 'Workflow only applies to branches' })

  const currentStatus = version.workflow_status || null
  const allowed = TRANSITIONS[currentStatus] || []
  if (!allowed.includes(status)) {
    return res.status(400).json({
      error: `Cannot transition from ${currentStatus || 'none'} to ${status}`,
      allowed,
    })
  }

  if (!canTransition(req.user, version, db)) {
    return res.status(403).json({ error: 'You do not have permission to advance this branch' })
  }

  db.prepare(`
    INSERT INTO workflow_log (id, version_id, from_status, to_status, changed_by, note)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(randomUUID(), versionId, currentStatus, status, req.user.id, note.trim())

  setWorkflowStatus(db, versionId, status)

  const updated = getVersion(db, versionId)
  res.json(updated)
})

// GET /api/v1/documents/:docId/versions/:versionId/workflow
router.get('/:versionId/workflow', (req, res) => {
  const db = req.app.locals.db
  const log = db.prepare(`
    SELECT wl.*, u.username, u.display_name
    FROM workflow_log wl
    JOIN users u ON u.id = wl.changed_by
    WHERE wl.version_id = ?
    ORDER BY wl.created_at
  `).all(req.params.versionId)
  res.json(log)
})

// GET /api/v1/documents/:docId/branches/active
router.get('/active', (req, res) => {
  const db = req.app.locals.db
  const { docId } = req.params
  const branches = db.prepare(`
    SELECT v.*, u.username as creator_username, u.display_name as creator_display_name
    FROM versions v
    LEFT JOIN users u ON u.id = v.created_by
    WHERE v.document_id = ? AND v.kind = 'branch'
      AND v.archived_at IS NULL
      AND (v.workflow_status IS NULL OR v.workflow_status NOT IN ('approved', 'rejected'))
    ORDER BY v.created_at DESC
  `).all(docId)
  res.json(branches)
})

export { FROZEN_STAGES }
export default router
