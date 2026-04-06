import session from 'express-session'

// Minimal SQLite session store using better-sqlite3
class SQLiteStore extends session.Store {
  constructor(db) {
    super()
    this.db = db
  }

  get(sid, cb) {
    try {
      const row = this.db.prepare('SELECT sess FROM sessions WHERE sid = ? AND expired > datetime(\'now\')').get(sid)
      cb(null, row ? JSON.parse(row.sess) : null)
    } catch (err) { cb(err) }
  }

  set(sid, sess, cb) {
    try {
      const expired = sess.cookie?.expires
        ? new Date(sess.cookie.expires).toISOString()
        : new Date(Date.now() + 86400000).toISOString()
      this.db.prepare('INSERT OR REPLACE INTO sessions (sid, sess, expired) VALUES (?, ?, ?)').run(sid, JSON.stringify(sess), expired)
      cb?.(null)
    } catch (err) { cb?.(err) }
  }

  destroy(sid, cb) {
    try {
      this.db.prepare('DELETE FROM sessions WHERE sid = ?').run(sid)
      cb?.(null)
    } catch (err) { cb?.(err) }
  }

  // Clean up expired sessions periodically
  touch(sid, sess, cb) {
    this.set(sid, sess, cb)
  }
}

const createSessionMiddleware = (db) =>
  session({
    store: new SQLiteStore(db),
    secret: process.env.SESSION_SECRET || 'articulate-dev-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    },
  })

export { createSessionMiddleware }
