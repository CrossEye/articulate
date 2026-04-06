const createVersion = (db, { id, documentId, name, description = null, createdBy = null, forkedFrom = null, kind = 'version', parentVersionId = null }) => {
  db.prepare(`
    INSERT INTO versions (id, document_id, name, description, created_by, forked_from, kind, parent_version_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(id, documentId, name, description, createdBy, forkedFrom, kind, parentVersionId)
}

const getVersion = (db, id) =>
  db.prepare('SELECT * FROM versions WHERE id = ?').get(id)

const listVersions = (db, documentId) =>
  db.prepare('SELECT * FROM versions WHERE document_id = ? ORDER BY created_at DESC').all(documentId)

const updateVersion = (db, id, fields) => {
  const sets = []
  const values = []
  if (fields.name !== undefined) { sets.push('name = ?'); values.push(fields.name) }
  if (fields.description !== undefined) { sets.push('description = ?'); values.push(fields.description) }
  if (fields.headRev !== undefined) { sets.push('head_rev = ?'); values.push(fields.headRev) }
  if (fields.locked !== undefined) { sets.push('locked = ?'); values.push(fields.locked ? 1 : 0) }
  if (fields.kind !== undefined) { sets.push('kind = ?'); values.push(fields.kind) }
  if (sets.length === 0) return
  values.push(id)
  db.prepare(`UPDATE versions SET ${sets.join(', ')} WHERE id = ?`).run(...values)
}

const addVersionMember = (db, versionId, userId, role = 'editor') =>
  db.prepare(`
    INSERT OR REPLACE INTO version_members (version_id, user_id, role)
    VALUES (?, ?, ?)
  `).run(versionId, userId, role)

const getVersionMembers = (db, versionId) =>
  db.prepare(`
    SELECT u.id, u.username, u.display_name, vm.role
    FROM version_members vm
    JOIN users u ON u.id = vm.user_id
    WHERE vm.version_id = ?
  `).all(versionId)

const lockVersion = (db, id) =>
  db.prepare('UPDATE versions SET locked = 1 WHERE id = ?').run(id)

const unlockVersion = (db, id) =>
  db.prepare('UPDATE versions SET locked = 0 WHERE id = ?').run(id)

const listBranches = (db, parentVersionId) =>
  db.prepare('SELECT * FROM versions WHERE parent_version_id = ? ORDER BY created_at').all(parentVersionId)

export { createVersion, getVersion, listVersions, updateVersion, lockVersion, unlockVersion, addVersionMember, getVersionMembers, listBranches }
