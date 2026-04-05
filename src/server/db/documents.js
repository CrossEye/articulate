const createDocument = (db, { id, title, metadata = null }) =>
  db.prepare(`
    INSERT INTO documents (id, title, metadata)
    VALUES (?, ?, ?)
  `).run(id, title, metadata ? JSON.stringify(metadata) : null)

const getDocument = (db, id) =>
  db.prepare('SELECT * FROM documents WHERE id = ?').get(id)

const listDocuments = (db) =>
  db.prepare('SELECT * FROM documents ORDER BY created_at DESC').all()

const updateDocument = (db, id, fields) => {
  const sets = []
  const values = []
  if (fields.title !== undefined) { sets.push('title = ?'); values.push(fields.title) }
  if (fields.metadata !== undefined) { sets.push('metadata = ?'); values.push(JSON.stringify(fields.metadata)) }
  if (sets.length === 0) return
  values.push(id)
  db.prepare(`UPDATE documents SET ${sets.join(', ')} WHERE id = ?`).run(...values)
}

export { createDocument, getDocument, listDocuments, updateDocument }
