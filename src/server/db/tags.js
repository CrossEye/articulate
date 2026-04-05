const createTag = (db, { documentId, name, revisionId, createdBy = null }) =>
  db.prepare(`
    INSERT INTO tags (document_id, name, revision_id, created_by)
    VALUES (?, ?, ?, ?)
  `).run(documentId, name, revisionId, createdBy)

const getTag = (db, documentId, name) =>
  db.prepare('SELECT * FROM tags WHERE document_id = ? AND name = ?').get(documentId, name)

const listTags = (db, documentId) =>
  db.prepare(`
    SELECT t.*, r.seq FROM tags t
    JOIN revisions r ON r.id = t.revision_id
    WHERE t.document_id = ?
    ORDER BY t.name
  `).all(documentId)

const tagsForRevision = (db, revisionId) =>
  db.prepare('SELECT * FROM tags WHERE revision_id = ?').all(revisionId)

const moveTag = (db, documentId, name, revisionId) =>
  db.prepare('UPDATE tags SET revision_id = ? WHERE document_id = ? AND name = ?')
    .run(revisionId, documentId, name)

const deleteTag = (db, documentId, name) =>
  db.prepare('DELETE FROM tags WHERE document_id = ? AND name = ?').run(documentId, name)

export { createTag, getTag, listTags, tagsForRevision, moveTag, deleteTag }
