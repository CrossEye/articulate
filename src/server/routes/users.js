import { Router } from 'express'
import bcrypt from 'bcrypt'
import { createUser, getUser, listUsers, updateUser, deleteUser } from '../db/users.js'
import { requireAdmin } from '../middleware/auth.js'

const router = Router()

// All routes require admin
router.use(requireAdmin)

// GET /api/v1/users
router.get('/', (req, res) => {
  res.json(listUsers(req.app.locals.db))
})

// POST /api/v1/users
router.post('/', async (req, res) => {
  const db = req.app.locals.db
  const { username, password, displayName, role = 'editor' } = req.body
  if (!username || !password) return res.status(400).json({ error: 'username and password are required' })
  if (password.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters' })

  const hash = await bcrypt.hash(password, 10)
  try {
    const id = createUser(db, { username, displayName, passwordHash: hash, role })
    const user = getUser(db, id)
    const { password_hash, ...safeUser } = user
    res.status(201).json(safeUser)
  } catch (err) {
    if (err.message.includes('UNIQUE')) return res.status(409).json({ error: 'Username already exists' })
    throw err
  }
})

// PATCH /api/v1/users/:userId
router.patch('/:userId', (req, res) => {
  const db = req.app.locals.db
  const { displayName, role } = req.body
  updateUser(db, req.params.userId, { displayName, role })
  const user = getUser(db, req.params.userId)
  if (!user) return res.status(404).json({ error: 'User not found' })
  const { password_hash, ...safeUser } = user
  res.json(safeUser)
})

// DELETE /api/v1/users/:userId
router.delete('/:userId', (req, res) => {
  const db = req.app.locals.db
  if (req.params.userId === req.user.id) {
    return res.status(400).json({ error: 'Cannot delete your own account' })
  }
  deleteUser(db, req.params.userId)
  res.status(204).end()
})

export default router
