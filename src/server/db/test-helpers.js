import Database from 'better-sqlite3'
import { runMigrations } from './migrations.js'

// Create a fresh in-memory database for each test
const createTestDb = () => {
  const db = new Database(':memory:')
  db.pragma('foreign_keys = ON')
  runMigrations(db)
  return db
}

export { createTestDb }
