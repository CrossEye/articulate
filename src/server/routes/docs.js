import { Router } from 'express'
import { readFile, readdir, stat } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { marked } from 'marked'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DOCS_ROOT = path.resolve(__dirname, '../../..', 'docs')

const router = Router()

// Determine if a directory name is a TOC-visible section (title-cased)
const isTocSection = (name) =>
  name.length > 0 && name[0] === name[0].toUpperCase() && name[0] !== '_'

// Build the doc tree recursively from _toc.json files
const buildTree = async (dir, basePath = '') => {
  const tocPath = path.join(dir, '_toc.json')
  let ordering
  try {
    const raw = await readFile(tocPath, 'utf-8')
    ordering = JSON.parse(raw)
  } catch {
    // No _toc.json — read directory and filter to title-cased entries
    const entries = await readdir(dir)
    ordering = entries.filter(isTocSection).sort()
  }

  const children = []
  for (const name of ordering) {
    const fullPath = path.join(dir, name)
    const docPath = basePath ? `${basePath}/${name}` : name

    // Check if it's a directory (section) or a markdown file
    const dirStat = await stat(fullPath).catch(() => null)
    if (dirStat && dirStat.isDirectory()) {
      const subChildren = await buildTree(fullPath, docPath)
      children.push({ name, path: docPath, type: 'section', children: subChildren })
    } else {
      // Try as .md file
      const mdPath = fullPath.endsWith('.md') ? fullPath : fullPath + '.md'
      const mdStat = await stat(mdPath).catch(() => null)
      if (mdStat) {
        const displayName = name.replace(/\.md$/, '')
        const filePath = docPath.endsWith('.md') ? docPath : docPath + '.md'
        children.push({ name: displayName, path: filePath, type: 'page' })
      }
    }
  }
  return children
}

// GET /api/v1/docs/tree — nested TOC as JSON
router.get('/tree', async (req, res) => {
  const tree = await buildTree(DOCS_ROOT)
  res.json(tree)
})

// GET /api/v1/docs/content/:path+ — rendered doc content
router.get('/content/*docPath', async (req, res) => {
  const docPath = [].concat(req.params.docPath).join('/')
  const resolvedPath = await resolveDocPath(docPath)

  if (!resolvedPath) {
    res.status(404).json({ error: 'Document not found' })
    return
  }

  const content = await readFile(resolvedPath, 'utf-8')
  const format = req.query.format || 'html'
  if (format === 'md' || format === 'markdown') {
    res.type('text/markdown').send(content)
  } else {
    const html = marked(content)
    res.json({ path: docPath, html })
  }
})

// GET /api/v1/docs/_static/* — images and other assets
router.get('/_static/*assetName', async (req, res) => {
  const assetPath = path.join(DOCS_ROOT, '_static', [].concat(req.params.assetName).join('/'))
  res.sendFile(assetPath, (err) => {
    if (err) res.status(404).json({ error: 'Asset not found' })
  })
})

// Resolve a doc path to an existing filesystem path
const resolveDocPath = async (docPath) => {
  // Prevent directory traversal
  const normalized = path.normalize(docPath).replace(/^(\.\.(\/|\\|$))+/, '')
  const full = path.join(DOCS_ROOT, normalized)

  if (!full.startsWith(DOCS_ROOT)) return null

  // Try exact path, then with .md, then as directory index
  const candidates = [
    full,
    full.endsWith('.md') ? full : full + '.md',
    path.join(full, 'index.md'),
  ]

  for (const candidate of candidates) {
    const s = await stat(candidate).catch(() => null)
    if (s && s.isFile()) return candidate
  }
  return null
}

export default router
