import { randomUUID } from 'node:crypto'

const createUser = (db, { username, displayName = null, passwordHash = null, oauthProvider = null, oauthId = null, role = 'viewer', forcePasswordChange = 0 }) => {
  const id = randomUUID()
  db.prepare(`
    INSERT INTO users (id, username, display_name, password_hash, oauth_provider, oauth_id, role, force_password_change)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(id, username, displayName, passwordHash, oauthProvider, oauthId, role, forcePasswordChange)
  return id
}

const getUser = (db, id) =>
  db.prepare('SELECT * FROM users WHERE id = ?').get(id)

const getUserByUsername = (db, username) =>
  db.prepare('SELECT * FROM users WHERE username = ?').get(username)

const listUsers = (db) =>
  db.prepare('SELECT id, username, display_name, role, created_at FROM users ORDER BY created_at').all()

const updateUser = (db, id, fields) => {
  const sets = []
  const values = []
  if (fields.displayName !== undefined) { sets.push('display_name = ?'); values.push(fields.displayName) }
  if (fields.role !== undefined) { sets.push('role = ?'); values.push(fields.role) }
  if (sets.length === 0) return
  values.push(id)
  db.prepare(`UPDATE users SET ${sets.join(', ')} WHERE id = ?`).run(...values)
}

const updatePassword = (db, id, passwordHash) =>
  db.prepare('UPDATE users SET password_hash = ?, force_password_change = 0 WHERE id = ?').run(passwordHash, id)

const deleteUser = (db, id) =>
  db.prepare('DELETE FROM users WHERE id = ?').run(id)

export { createUser, getUser, getUserByUsername, listUsers, updateUser, updatePassword, deleteUser }
