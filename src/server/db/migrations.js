const SCHEMA_VERSION = 3

const migration_001 = `
  CREATE TABLE IF NOT EXISTS documents (
    id          TEXT PRIMARY KEY,
    title       TEXT NOT NULL,
    created_at  TEXT NOT NULL DEFAULT (datetime('now')),
    metadata    TEXT
  );

  CREATE TABLE IF NOT EXISTS nodes (
    id          TEXT PRIMARY KEY,
    body        TEXT NOT NULL,
    caption     TEXT NOT NULL DEFAULT '',
    node_type   TEXT NOT NULL DEFAULT 'section',
    metadata    TEXT
  );

  CREATE TABLE IF NOT EXISTS revisions (
    id          TEXT PRIMARY KEY,
    version_id  TEXT NOT NULL,
    parent_id   TEXT REFERENCES revisions(id),
    message     TEXT,
    created_at  TEXT NOT NULL DEFAULT (datetime('now')),
    created_by  TEXT,
    published   INTEGER NOT NULL DEFAULT 0,
    merge_sources TEXT
  );
  CREATE INDEX IF NOT EXISTS idx_rev_version ON revisions(version_id);
  CREATE INDEX IF NOT EXISTS idx_rev_parent  ON revisions(parent_id);

  CREATE TABLE IF NOT EXISTS versions (
    id          TEXT PRIMARY KEY,
    document_id TEXT NOT NULL REFERENCES documents(id),
    name        TEXT NOT NULL,
    description TEXT,
    created_at  TEXT NOT NULL DEFAULT (datetime('now')),
    created_by  TEXT,
    forked_from TEXT REFERENCES revisions(id),
    head_rev    TEXT REFERENCES revisions(id)
  );

  CREATE TABLE IF NOT EXISTS tree_entries (
    revision_id TEXT NOT NULL REFERENCES revisions(id),
    path        TEXT NOT NULL,
    node_id     TEXT NOT NULL REFERENCES nodes(id),
    parent_path TEXT,
    sort_key    INTEGER NOT NULL,
    marker      TEXT NOT NULL DEFAULT '',
    depth       INTEGER NOT NULL,
    PRIMARY KEY (revision_id, path)
  );
  CREATE INDEX IF NOT EXISTS idx_tree_parent ON tree_entries(revision_id, parent_path);
  CREATE INDEX IF NOT EXISTS idx_tree_node   ON tree_entries(node_id);

  CREATE TABLE IF NOT EXISTS users (
    id            TEXT PRIMARY KEY,
    username      TEXT UNIQUE NOT NULL,
    display_name  TEXT,
    password_hash TEXT,
    oauth_provider TEXT,
    oauth_id      TEXT,
    role           TEXT NOT NULL DEFAULT 'viewer',
    force_password_change INTEGER NOT NULL DEFAULT 0,
    created_at     TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS invite_tokens (
    token       TEXT PRIMARY KEY,
    role        TEXT NOT NULL DEFAULT 'editor',
    created_by  TEXT NOT NULL REFERENCES users(id),
    expires_at  TEXT NOT NULL,
    used_at     TEXT,
    used_by     TEXT REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS version_members (
    version_id  TEXT NOT NULL REFERENCES versions(id),
    user_id     TEXT NOT NULL REFERENCES users(id),
    role        TEXT NOT NULL DEFAULT 'editor',
    PRIMARY KEY (version_id, user_id)
  );

  CREATE TABLE IF NOT EXISTS comments (
    id          TEXT PRIMARY KEY,
    version_id  TEXT NOT NULL REFERENCES versions(id),
    path        TEXT NOT NULL,
    user_id     TEXT NOT NULL REFERENCES users(id),
    body        TEXT NOT NULL,
    parent_id   TEXT REFERENCES comments(id),
    resolved    INTEGER NOT NULL DEFAULT 0,
    created_at  TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at  TEXT NOT NULL DEFAULT (datetime('now'))
  );
  CREATE INDEX IF NOT EXISTS idx_comments_version_path ON comments(version_id, path);

  CREATE TABLE IF NOT EXISTS edit_locks (
    revision_id TEXT NOT NULL,
    path        TEXT NOT NULL,
    user_id     TEXT NOT NULL REFERENCES users(id),
    acquired_at TEXT NOT NULL DEFAULT (datetime('now')),
    expires_at  TEXT NOT NULL,
    PRIMARY KEY (revision_id, path)
  );
`

const migration_002 = `
  DROP TABLE IF EXISTS edit_locks;
  CREATE TABLE edit_locks (
    revision_id TEXT NOT NULL,
    path        TEXT NOT NULL,
    user_id     TEXT NOT NULL DEFAULT 'anonymous',
    acquired_at TEXT NOT NULL DEFAULT (datetime('now')),
    expires_at  TEXT NOT NULL,
    PRIMARY KEY (revision_id, path)
  );
`

const migration_003 = `
  ALTER TABLE revisions ADD COLUMN seq INTEGER;
`

const runMigrations = (db) => {
  db.exec('CREATE TABLE IF NOT EXISTS _meta (key TEXT PRIMARY KEY, value TEXT)')

  const row = db.prepare('SELECT value FROM _meta WHERE key = ?').get('schema_version')
  const currentVersion = row ? Number(row.value) : 0

  if (currentVersion < 1) {
    db.exec(migration_001)
  }
  if (currentVersion < 2) {
    db.exec(migration_002)
  }
  if (currentVersion < 3) {
    db.exec(migration_003)
    // Backfill seq per document across all versions
    const docs = db.prepare('SELECT DISTINCT document_id FROM versions').all()
    const stmt = db.prepare('UPDATE revisions SET seq = ? WHERE id = ?')
    for (const { document_id } of docs) {
      const revs = db.prepare(`
        SELECT r.id FROM revisions r
        JOIN versions v ON v.id = r.version_id
        WHERE v.document_id = ?
        ORDER BY r.id
      `).all(document_id)
      revs.forEach((r, i) => stmt.run(i + 1, r.id))
    }
  }
  if (currentVersion < SCHEMA_VERSION) {
    db.prepare('INSERT OR REPLACE INTO _meta (key, value) VALUES (?, ?)')
      .run('schema_version', String(SCHEMA_VERSION))
    console.log(`Database migrated to schema version ${SCHEMA_VERSION}`)
  }
}

export { runMigrations, SCHEMA_VERSION }
