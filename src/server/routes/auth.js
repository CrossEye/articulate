import { Router } from 'express'
import bcrypt from 'bcrypt'
import { getUserByUsername, updatePassword } from '../db/users.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

// POST /api/v1/auth/login
router.post('/login', async (req, res) => {
  const db = req.app.locals.db
  const { username, password } = req.body
  if (!username || !password) return res.status(400).json({ error: 'username and password are required' })

  const user = getUserByUsername(db, username)
  if (!user || !user.password_hash) return res.status(401).json({ error: 'Invalid credentials' })

  const valid = await bcrypt.compare(password, user.password_hash)
  if (!valid) return res.status(401).json({ error: 'Invalid credentials' })

  req.session.userId = user.id
  const { password_hash, ...safeUser } = user
  res.json({
    user: safeUser,
    forcePasswordChange: !!user.force_password_change,
  })
})

// POST /api/v1/auth/logout
router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.json({ ok: true })
  })
})

// GET /api/v1/auth/me
router.get('/me', requireAuth, (req, res) => {
  const { password_hash, ...safeUser } = req.user
  res.json({
    user: safeUser,
    forcePasswordChange: !!req.user.force_password_change,
  })
})

// PATCH /api/v1/auth/me/password
router.patch('/me/password', requireAuth, async (req, res) => {
  const db = req.app.locals.db
  const { current, newPassword } = req.body
  if (!newPassword || newPassword.length < 6) {
    return res.status(400).json({ error: 'New password must be at least 6 characters' })
  }

  // If not force-changing, verify current password
  if (!req.user.force_password_change) {
    if (!current) return res.status(400).json({ error: 'Current password is required' })
    const valid = await bcrypt.compare(current, req.user.password_hash)
    if (!valid) return res.status(401).json({ error: 'Current password is incorrect' })
  }

  const hash = await bcrypt.hash(newPassword, 10)
  updatePassword(db, req.user.id, hash)
  res.json({ ok: true })
})

export default router
