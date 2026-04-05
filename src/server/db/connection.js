import Database from 'better-sqlite3'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DEFAULT_PATH = path.resolve(__dirname, '../../..', 'data', 'articulate.db')

const createConnection = (dbPath = process.env.DB_PATH || DEFAULT_PATH) => {
  const db = new Database(dbPath)
  db.pragma('journal_mode = WAL')
  db.pragma('foreign_keys = ON')
  return db
}

export { createConnection }
