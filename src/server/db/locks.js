const LOCK_DURATION_MINUTES = 5

const acquireLock = (db, { revisionId, path, userId }) => {
  const now = new Date().toISOString()
  const expiresAt = new Date(Date.now() + LOCK_DURATION_MINUTES * 60_000).toISOString()

  // Clean expired locks first
  db.prepare('DELETE FROM edit_locks WHERE expires_at < ?').run(now)

  // Check for existing lock by another user
  const existing = db.prepare(
    'SELECT * FROM edit_locks WHERE revision_id = ? AND path = ?'
  ).get(revisionId, path)

  if (existing && existing.user_id !== userId) {
    return { acquired: false, holder: existing.user_id, expiresAt: existing.expires_at }
  }

  // Upsert our lock
  db.prepare(`
    INSERT INTO edit_locks (revision_id, path, user_id, acquired_at, expires_at)
    VALUES (?, ?, ?, ?, ?)
    ON CONFLICT (revision_id, path) DO UPDATE SET
      acquired_at = excluded.acquired_at,
      expires_at = excluded.expires_at
  `).run(revisionId, path, userId, now, expiresAt)

  return { acquired: true, expiresAt }
}

const renewLock = (db, { revisionId, path, userId }) => {
  const now = new Date().toISOString()
  const expiresAt = new Date(Date.now() + LOCK_DURATION_MINUTES * 60_000).toISOString()

  const existing = db.prepare(
    'SELECT * FROM edit_locks WHERE revision_id = ? AND path = ? AND user_id = ?'
  ).get(revisionId, path, userId)

  if (!existing) return { renewed: false }

  db.prepare(
    'UPDATE edit_locks SET expires_at = ? WHERE revision_id = ? AND path = ?'
  ).run(expiresAt, revisionId, path)

  return { renewed: true, expiresAt }
}

const releaseLock = (db, { revisionId, path, userId }) => {
  db.prepare(
    'DELETE FROM edit_locks WHERE revision_id = ? AND path = ? AND user_id = ?'
  ).run(revisionId, path, userId)
}

const getLock = (db, { revisionId, path }) => {
  const now = new Date().toISOString()
  const lock = db.prepare(
    'SELECT * FROM edit_locks WHERE revision_id = ? AND path = ? AND expires_at > ?'
  ).get(revisionId, path, now)
  return lock || null
}

export { acquireLock, renewLock, releaseLock, getLock, LOCK_DURATION_MINUTES }
