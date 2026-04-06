import { Router } from 'express'
import { randomBytes } from 'node:crypto'
import bcrypt from 'bcrypt'
import { createInvite, getInvite, useInvite, listInvites, deleteInvite } from '../db/invites.js'
import { createUser, getUser } from '../db/users.js'
import { requireAdmin } from '../middleware/auth.js'

const router = Router()

// GET /api/v1/invites — list all (admin only)
router.get('/', requireAdmin, (req, res) => {
  res.json(listInvites(req.app.locals.db))
})

// POST /api/v1/invites — generate invite (admin only)
router.post('/', requireAdmin, (req, res) => {
  const db = req.app.locals.db
  const { role = 'editor', expiresInHours = 72 } = req.body
  const token = randomBytes(32).toString('hex')
  const expiresAt = new Date(Date.now() + expiresInHours * 60 * 60 * 1000).toISOString()

  createInvite(db, { token, role, createdBy: req.user.id, expiresAt })
  const invite = getInvite(db, token)
  res.status(201).json(invite)
})

// DELETE /api/v1/invites/:token — revoke (admin only)
router.delete('/:token', requireAdmin, (req, res) => {
  deleteInvite(req.app.locals.db, req.params.token)
  res.status(204).end()
})

// GET /api/v1/invites/accept/:token — validate invite (public)
router.get('/accept/:token', (req, res) => {
  const invite = getInvite(req.app.locals.db, req.params.token)
  if (!invite) return res.status(404).json({ error: 'Invite not found' })
  if (invite.used_at) return res.status(410).json({ error: 'Invite already used' })
  if (new Date(invite.expires_at) < new Date()) return res.status(410).json({ error: 'Invite expired' })
  res.json({ role: invite.role, expiresAt: invite.expires_at })
})

// POST /api/v1/invites/accept/:token — accept invite, create account (public)
router.post('/accept/:token', async (req, res) => {
  const db = req.app.locals.db
  const invite = getInvite(db, req.params.token)
  if (!invite) return res.status(404).json({ error: 'Invite not found' })
  if (invite.used_at) return res.status(410).json({ error: 'Invite already used' })
  if (new Date(invite.expires_at) < new Date()) return res.status(410).json({ error: 'Invite expired' })

  const { username, password, displayName } = req.body
  if (!username || !password) return res.status(400).json({ error: 'username and password are required' })
  if (password.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters' })

  const hash = await bcrypt.hash(password, 10)
  let userId
  try {
    userId = createUser(db, { username, displayName, passwordHash: hash, role: invite.role })
  } catch (err) {
    if (err.message.includes('UNIQUE')) return res.status(409).json({ error: 'Username already exists' })
    throw err
  }

  useInvite(db, req.params.token, userId)

  // Auto-login
  req.session.userId = userId
  const user = getUser(db, userId)
  const { password_hash, ...safeUser } = user
  res.status(201).json({ user: safeUser })
})

export default router
