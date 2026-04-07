import { randomUUID } from 'node:crypto'

// ---- Comments ----

const listComments = (db, versionId, path) =>
  db.prepare(`
    SELECT c.*, u.username, u.display_name
    FROM comments c
    JOIN users u ON u.id = c.user_id
    WHERE c.version_id = ? AND c.path = ?
    ORDER BY c.created_at
  `).all(versionId, path)

const listAllComments = (db, versionId) =>
  db.prepare(`
    SELECT c.*, u.username, u.display_name
    FROM comments c
    JOIN users u ON u.id = c.user_id
    WHERE c.version_id = ?
    ORDER BY c.path, c.created_at
  `).all(versionId)

const getComment = (db, id) =>
  db.prepare('SELECT * FROM comments WHERE id = ?').get(id)

const createComment = (db, { versionId, path, userId, body, parentId = null }) => {
  const id = randomUUID()
  db.prepare(`
    INSERT INTO comments (id, version_id, path, user_id, body, parent_id)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(id, versionId, path, userId, body, parentId)
  return id
}

const resolveComment = (db, id, resolved) =>
  db.prepare(`UPDATE comments SET resolved = ?, updated_at = datetime('now') WHERE id = ?`)
    .run(resolved ? 1 : 0, id)

const deleteComment = (db, id) =>
  db.prepare('DELETE FROM comments WHERE id = ?').run(id)

// Count unresolved comments per path for a version (for sidebar indicators)
const unresolvedCountsByPath = (db, versionId) => {
  const rows = db.prepare(`
    SELECT path, COUNT(*) as count
    FROM comments
    WHERE version_id = ? AND resolved = 0 AND parent_id IS NULL
    GROUP BY path
  `).all(versionId)
  return Object.fromEntries(rows.map(r => [r.path, r.count]))
}

// ---- Node reviews ----

const upsertReview = (db, { versionId, path, userId, status }) =>
  db.prepare(`
    INSERT INTO node_reviews (version_id, path, user_id, status, updated_at)
    VALUES (?, ?, ?, ?, datetime('now'))
    ON CONFLICT (version_id, path, user_id)
    DO UPDATE SET status = excluded.status, updated_at = excluded.updated_at
  `).run(versionId, path, userId, status)

const listReviewsForPath = (db, versionId, path) =>
  db.prepare(`
    SELECT nr.*, u.username, u.display_name
    FROM node_reviews nr
    JOIN users u ON u.id = nr.user_id
    WHERE nr.version_id = ? AND nr.path = ?
    ORDER BY nr.updated_at DESC
  `).all(versionId, path)

const deleteReview = (db, versionId, path, userId) =>
  db.prepare('DELETE FROM node_reviews WHERE version_id = ? AND path = ? AND user_id = ?')
    .run(versionId, path, userId)

// Roll-up: for each path, how many approved vs changes-requested
const reviewSummaryForVersion = (db, versionId) => {
  const rows = db.prepare(`
    SELECT path, status, COUNT(*) as count
    FROM node_reviews
    WHERE version_id = ?
    GROUP BY path, status
  `).all(versionId)
  const summary = {}
  for (const r of rows) {
    if (!summary[r.path]) summary[r.path] = { approved: 0, changesRequested: 0 }
    if (r.status === 'approved') summary[r.path].approved += r.count
    if (r.status === 'changes-requested') summary[r.path].changesRequested += r.count
  }
  return summary
}

export {
  listComments, listAllComments, getComment, createComment, resolveComment, deleteComment,
  unresolvedCountsByPath,
  upsertReview, listReviewsForPath, deleteReview, reviewSummaryForVersion,
}
