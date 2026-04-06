const createInvite = (db, { token, role, createdBy, expiresAt }) =>
  db.prepare(`
    INSERT INTO invite_tokens (token, role, created_by, expires_at)
    VALUES (?, ?, ?, ?)
  `).run(token, role, createdBy, expiresAt)

const getInvite = (db, token) =>
  db.prepare('SELECT * FROM invite_tokens WHERE token = ?').get(token)

const useInvite = (db, token, userId) =>
  db.prepare('UPDATE invite_tokens SET used_at = datetime(\'now\'), used_by = ? WHERE token = ?').run(userId, token)

const listInvites = (db) =>
  db.prepare('SELECT * FROM invite_tokens ORDER BY expires_at DESC').all()

const deleteInvite = (db, token) =>
  db.prepare('DELETE FROM invite_tokens WHERE token = ?').run(token)

export { createInvite, getInvite, useInvite, listInvites, deleteInvite }
