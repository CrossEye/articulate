import express from 'express'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { createConnection } from './db/connection.js'
import { runMigrations } from './db/migrations.js'
import docsRouter from './routes/docs.js'
import documentsRouter from './routes/documents.js'
import versionsRouter from './routes/versions.js'
import revisionsRouter, { revisionDetail } from './routes/revisions.js'
import nodesRouter from './routes/nodes.js'
import { createLiveReload } from './live-reload.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PROJECT_ROOT = path.resolve(__dirname, '../..')
const DEV = process.argv.includes('--dev')
const PORT = process.env.PORT || 3000

const app = express()
app.use(express.json())

// Database
const db = createConnection()
runMigrations(db)
app.locals.db = db

// Static files — serve built client assets
app.use('/assets', express.static(path.join(PROJECT_ROOT, 'dist')))

// API routes
app.use('/api/v1/docs', docsRouter)
app.use('/api/v1/documents', documentsRouter)
app.use('/api/v1/documents/:docId/versions', versionsRouter)
app.use('/api/v1/versions/:versionId/revisions', revisionsRouter)
app.use('/api/v1/revisions', revisionDetail)
app.use('/api/v1/revisions', nodesRouter)

// API root
app.get('/api/v1', (req, res) => {
  res.json({ name: 'articulate', version: '0.1.0' })
})

// Dev-mode live reload
const liveReload = DEV ? createLiveReload(PROJECT_ROOT) : null
if (liveReload) {
  app.get('/__live-reload', liveReload.handler)
}

// SPA fallback — serve index.html for all non-API, non-asset routes
app.get('*splat', (req, res) => {
  const url = req.originalUrl
  if (url.startsWith('/api/') || url.startsWith('/assets/')) {
    res.status(404).json({ error: 'Not found' })
    return
  }
  res.sendFile(path.join(PROJECT_ROOT, 'dist', 'index.html'))
})

app.listen(PORT, () => {
  console.log(`Articulate running at http://localhost:${PORT}`)
  if (DEV) console.log('  Dev mode: live reload enabled')
})
