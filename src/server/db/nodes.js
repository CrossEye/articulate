import { contentHash } from '../../shared/hash.js'

const createNode = (db, { body, caption = '', nodeType = 'section', metadata = null }) => {
  const id = contentHash(body, caption, nodeType, metadata)
  db.prepare(`
    INSERT OR IGNORE INTO nodes (id, body, caption, node_type, metadata)
    VALUES (?, ?, ?, ?, ?)
  `).run(id, body, caption, nodeType, metadata ? JSON.stringify(metadata) : null)
  return id
}

const getNode = (db, id) =>
  db.prepare('SELECT * FROM nodes WHERE id = ?').get(id)

const getNodes = (db, ids) =>
  ids.length === 0
    ? []
    : db.prepare(`SELECT * FROM nodes WHERE id IN (${ids.map(() => '?').join(',')})`).all(...ids)

export { createNode, getNode, getNodes }
