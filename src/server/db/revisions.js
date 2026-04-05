import { uuidv7 } from '../../shared/uuidv7.js'

// Create a new revision with its tree entries.
// If parentId is provided, unchanged entries are copied from the parent revision.
// `entries` is an array of { path, nodeId, parentPath, sortKey, marker, depth }.
const createRevision = (db, { versionId, parentId = null, message = null, createdBy = null, entries = [], mergeSources = null }) => {
  const id = uuidv7()

  const insert = db.transaction(() => {
    // Guard: cannot add revisions to a locked version
    const ver = db.prepare('SELECT locked, document_id FROM versions WHERE id = ?').get(versionId)
    if (ver?.locked) throw new Error('Cannot create revision on locked version')

    // Seq is per-document, not per-version, so revision numbers are unambiguous
    const docRow = ver
    const maxSeq = db.prepare(`
      SELECT MAX(r.seq) AS m FROM revisions r
      JOIN versions v ON v.id = r.version_id
      WHERE v.document_id = ?
    `).get(docRow.document_id)
    const seq = (maxSeq?.m || 0) + 1

    db.prepare(`
      INSERT INTO revisions (id, version_id, parent_id, message, created_by, merge_sources, seq)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(id, versionId, parentId, message, createdBy, mergeSources ? JSON.stringify(mergeSources) : null, seq)

    // If there's a parent, copy its tree_entries as the base
    if (parentId) {
      db.prepare(`
        INSERT INTO tree_entries (revision_id, path, node_id, parent_path, sort_key, marker, depth)
        SELECT ?, path, node_id, parent_path, sort_key, marker, depth
        FROM tree_entries
        WHERE revision_id = ?
      `).run(id, parentId)
    }

    // Apply the new/changed entries (upsert)
    const upsert = db.prepare(`
      INSERT OR REPLACE INTO tree_entries (revision_id, path, node_id, parent_path, sort_key, marker, depth)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `)
    for (const e of entries) {
      upsert.run(id, e.path, e.nodeId, e.parentPath, e.sortKey, e.marker, e.depth)
    }

    // Update the version's head_rev
    db.prepare('UPDATE versions SET head_rev = ? WHERE id = ?').run(id, versionId)

    return id
  })

  return insert()
}

// Create a full revision from scratch (no parent copy, all entries provided)
const createInitialRevision = (db, { versionId, message = null, createdBy = null, entries }) => {
  const id = uuidv7()

  const insert = db.transaction(() => {
    const docRow = db.prepare('SELECT document_id FROM versions WHERE id = ?').get(versionId)
    const maxSeq = db.prepare(`
      SELECT MAX(r.seq) AS m FROM revisions r
      JOIN versions v ON v.id = r.version_id
      WHERE v.document_id = ?
    `).get(docRow.document_id)
    const seq = (maxSeq?.m || 0) + 1

    db.prepare(`
      INSERT INTO revisions (id, version_id, parent_id, message, created_by, seq)
      VALUES (?, ?, NULL, ?, ?, ?)
    `).run(id, versionId, message, createdBy, seq)

    const stmt = db.prepare(`
      INSERT INTO tree_entries (revision_id, path, node_id, parent_path, sort_key, marker, depth)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `)
    for (const e of entries) {
      stmt.run(id, e.path, e.nodeId, e.parentPath, e.sortKey, e.marker, e.depth)
    }

    db.prepare('UPDATE versions SET head_rev = ? WHERE id = ?').run(id, versionId)

    return id
  })

  return insert()
}

// Remove paths from a revision (for deletions)
const removeTreeEntries = (db, revisionId, paths) => {
  const stmt = db.prepare('DELETE FROM tree_entries WHERE revision_id = ? AND path = ?')
  const remove = db.transaction(() => {
    for (const p of paths) {
      stmt.run(revisionId, p)
    }
  })
  remove()
}

const getRevision = (db, id) =>
  db.prepare('SELECT * FROM revisions WHERE id = ?').get(id)

const getRevisionBySeq = (db, docId, seq) =>
  db.prepare(`
    SELECT r.* FROM revisions r
    JOIN versions v ON v.id = r.version_id
    WHERE v.document_id = ? AND r.seq = ?
  `).get(docId, seq)

const listRevisions = (db, versionId) =>
  db.prepare('SELECT * FROM revisions WHERE version_id = ? ORDER BY id DESC').all(versionId)

const getTree = (db, revisionId) =>
  db.prepare(`
    SELECT t.*, n.caption
    FROM tree_entries t
    JOIN nodes n ON n.id = t.node_id
    WHERE t.revision_id = ?
    ORDER BY t.depth, t.sort_key
  `).all(revisionId)

const getChildren = (db, revisionId, parentPath = null) =>
  parentPath === null
    ? db.prepare('SELECT * FROM tree_entries WHERE revision_id = ? AND parent_path IS NULL ORDER BY sort_key').all(revisionId)
    : db.prepare('SELECT * FROM tree_entries WHERE revision_id = ? AND parent_path = ? ORDER BY sort_key').all(revisionId, parentPath)

const getTreeEntry = (db, revisionId, path) =>
  db.prepare('SELECT * FROM tree_entries WHERE revision_id = ? AND path = ?').get(revisionId, path)

const publishRevision = (db, id) =>
  db.prepare('UPDATE revisions SET published = 1 WHERE id = ?').run(id)

export {
  createRevision,
  createInitialRevision,
  removeTreeEntries,
  getRevision,
  getRevisionBySeq,
  listRevisions,
  getTree,
  getChildren,
  getTreeEntry,
  publishRevision,
}
