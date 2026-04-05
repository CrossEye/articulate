import { watch } from 'node:fs'
import path from 'node:path'

const createLiveReload = (projectRoot) => {
  const clients = new Set()

  const notify = () => {
    for (const res of clients) {
      res.write('data: reload\n\n')
    }
  }

  // Watch src/ and docs/ for changes
  const dirs = ['src', 'docs'].map(d => path.join(projectRoot, d))
  for (const dir of dirs) {
    try {
      watch(dir, { recursive: true }, () => notify())
    } catch {
      // Directory may not exist yet
    }
  }

  const handler = (req, res) => {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    })
    res.write('data: connected\n\n')
    clients.add(res)
    req.on('close', () => clients.delete(res))
  }

  return { handler, notify }
}

export { createLiveReload }
