import { getUser } from '../db/users.js'

const requireAuth = (req, res, next) => {
  const userId = req.session?.userId
  if (!userId) return res.status(401).json({ error: 'Authentication required' })

  const user = getUser(req.app.locals.db, userId)
  if (!user) {
    req.session.destroy(() => {})
    return res.status(401).json({ error: 'User not found' })
  }

  req.user = user
  next()
}

const requireAdmin = (req, res, next) => {
  requireAuth(req, res, () => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' })
    }
    next()
  })
}

const optionalAuth = (req, res, next) => {
  const userId = req.session?.userId
  if (userId) {
    const user = getUser(req.app.locals.db, userId)
    if (user) req.user = user
  }
  next()
}

export { requireAuth, requireAdmin, optionalAuth }
