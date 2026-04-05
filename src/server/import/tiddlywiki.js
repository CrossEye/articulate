// TiddlyWiki .tid file parser.
// Parses the field: value header block and body text from .tid format.

import { readFile, readdir } from 'node:fs/promises'
import path from 'node:path'

const parseTid = (content) => {
  const lines = content.replace(/\r\n/g, '\n').split('\n')
  const fields = {}
  let bodyStart = 0

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (line === '') {
      bodyStart = i + 1
      break
    }
    const colonIndex = line.indexOf(': ')
    if (colonIndex > 0) {
      const key = line.slice(0, colonIndex).trim()
      const value = line.slice(colonIndex + 2).trim()
      fields[key] = value
    } else if (line.indexOf(':') === line.length - 1) {
      // Empty value field like "description:"
      fields[line.slice(0, -1).trim()] = ''
    }
  }

  const body = lines.slice(bodyStart).join('\n').trim()
  return { fields, body }
}

// Load all .tid files from a directory, returning an array of { fields, body }
const loadTiddlers = async (dir) => {
  const files = await readdir(dir)
  const tids = []

  for (const file of files) {
    if (!file.endsWith('.tid')) continue
    const content = await readFile(path.join(dir, file), 'utf-8')
    const tiddler = parseTid(content)
    tiddler.filename = file
    tids.push(tiddler)
  }

  return tids
}

// Filter tiddlers by tag
const filterByTag = (tiddlers, tag) =>
  tiddlers.filter(t =>
    (t.fields.tags || '').split(/\s+/).some(tt => tt === tag)
  )

export { parseTid, loadTiddlers, filterByTag }
