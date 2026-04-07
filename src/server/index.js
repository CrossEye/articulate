import express from 'express'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { createConnection } from './db/connection.js'
import { runMigrations } from './db/migrations.js'
import { createSessionMiddleware } from './middleware/session.js'
import { optionalAuth, requireAuth } from './middleware/auth.js'
import authRouter from './routes/auth.js'
import usersRouter from './routes/users.js'
import invitesRouter from './routes/invites.js'
import docsRouter from './routes/docs.js'
import documentsRouter from './routes/documents.js'
import versionsRouter from './routes/versions.js'
import revisionsRouter, { revisionDetail } from './routes/revisions.js'
import nodesRouter from './routes/nodes.js'
import importRouter from './routes/import.js'
import locksRouter from './routes/locks.js'
import diffRouter from './routes/diff.js'
import tagsRouter from './routes/tags.js'
import mergeRouter from './routes/merge.js'
import workflowRouter from './routes/workflow.js'
import commentsRouter from './routes/comments.js'
import { createLiveReload } from './live-reload.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PROJECT_ROOT = path.resolve(__dirname, '../..')
const DEV = process.argv.includes('--dev')
const PORT = process.env.PORT || 3000

const app = express()
app.use(express.json({ limit: '10mb' }))

// Database
const db = createConnection()
runMigrations(db)
app.locals.db = db

// Session + auth
app.use(createSessionMiddleware(db))
app.use(optionalAuth)

// Static files — serve built client assets
app.use('/assets', express.static(path.join(PROJECT_ROOT, 'dist')))

// Auth routes (public)
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/invites', invitesRouter)
app.use('/api/v1/users', usersRouter)

// API routes
app.use('/api/v1/docs', docsRouter)
app.use('/api/v1/documents', documentsRouter)
app.use('/api/v1/documents/:docId/versions', versionsRouter)
app.use('/api/v1/versions/:versionId/revisions', revisionsRouter)
app.use('/api/v1/revisions', revisionDetail)
app.use('/api/v1/revisions', nodesRouter)
app.use('/api/v1/documents/:docId/import', requireAuth, importRouter)
app.use('/api/v1/revisions', locksRouter)
app.use('/api/v1/documents/:docId/diff', diffRouter)
app.use('/api/v1/documents/:docId/tags', tagsRouter)
app.use('/api/v1/documents/:docId/merge', mergeRouter)
app.use('/api/v1/documents/:docId/versions', workflowRouter)
app.use('/api/v1/documents/:docId/branches', workflowRouter)
app.use('/api/v1/versions/:versionId', commentsRouter)

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
