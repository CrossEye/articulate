// Reference conversion: RHAM Policy Manual tiddlers -> Articulate import JSON.
//
// Usage: node scripts/convert-rham.js <tiddler-dir> [output.json]
//
// The RHAM pattern: parent-child relationships are derived from title prefixes.
// Policy1331 is a root, Policy1331(s1) is a child, Policy1331(s2)(A) is a grandchild.
// Special sections (history), (legal) are stored as node metadata rather than children.

import { loadTiddlers, filterByTag } from '../src/server/import/tiddlywiki.js'
import { twToMarkdown } from '../src/server/import/markup.js'
import { writeFile } from 'node:fs/promises'

const DEFAULT_DIR = 'C:/Users/scott/Dev/Tiddlywiki/RHAM_Policies/tiddlers'

const tiddlerDir = process.argv[2] || DEFAULT_DIR
const outputFile = process.argv[3]

const tiddlers = await loadTiddlers(tiddlerDir)

// Find all Policy-tagged tiddlers (these are the roots)
const policyRoots = filterByTag(tiddlers, 'Policy')
  .sort((a, b) => {
    const na = Number(a.fields['policy-nbr'] || 0)
    const nb = Number(b.fields['policy-nbr'] || 0)
    return na - nb
  })

// Index all tiddlers by title
const byTitle = new Map()
for (const t of tiddlers) {
  if (t.fields.title) byTitle.set(t.fields.title, t)
}

// Special section names that become metadata instead of children
const SPECIAL_SECTIONS = new Set(['history', 'legal'])

// Parse parenthesized markers from a title suffix
// e.g., "(s2)(A)" -> ["s2", "A"]
const parseMarkers = (suffix) => {
  const markers = []
  const re = /\(([^)]+)\)/g
  let match
  while ((match = re.exec(suffix)) !== null) {
    markers.push(match[1])
  }
  return markers
}

// Find children of a given title by prefix matching
const findChildren = (parentTitle) => {
  const children = []
  for (const [title, t] of byTitle) {
    if (!title.startsWith(parentTitle + '(')) continue
    // Must be a direct child: parentTitle + "(marker)" with no extra parens
    const suffix = title.slice(parentTitle.length)
    const markers = parseMarkers(suffix)
    if (markers.length === 1) {
      children.push({ title, tiddler: t, marker: markers[0] })
    }
  }
  return children.sort((a, b) => {
    // Sort: special sections last, then by marker
    const aSpecial = SPECIAL_SECTIONS.has(a.marker)
    const bSpecial = SPECIAL_SECTIONS.has(b.marker)
    if (aSpecial !== bSpecial) return aSpecial ? 1 : -1
    return a.marker.localeCompare(b.marker, undefined, { numeric: true })
  })
}

// Strip RHAM-specific macros from text
const stripRhamMacros = (text) =>
  text
    .replace(/<<ADOPTED\s+([^>]+)>>/g, 'Adopted: $1')
    .replace(/<<REVISED\s+([^>]+)>>/g, 'Revised: $1')
    .replace(/<<cgs\s+([^>]+)>>/g, '§ $1')
    .replace(/<<usc\s+(\d+)\s+(\d+)>>/g, '$1 U.S.C. § $2')

// Convert a tiddler to Markdown
const convertBody = (t) => {
  let text = stripRhamMacros(t.body)
  text = twToMarkdown(text)
  return text
}

// Recursively build the import tree for a tiddler and its children
const buildNode = (title, t, marker) => {
  const children = findChildren(title)
  const regularChildren = children.filter(c => !SPECIAL_SECTIONS.has(c.marker))
  const specialChildren = children.filter(c => SPECIAL_SECTIONS.has(c.marker))

  // Collect metadata from special sections
  const metadata = {}
  for (const s of specialChildren) {
    metadata[s.marker] = convertBody(s.tiddler)
  }

  const node = {
    path: marker,
    caption: t.fields.caption || '',
    body: convertBody(t),
    marker,
  }

  if (Object.keys(metadata).length > 0) {
    node.metadata = metadata
  }

  if (regularChildren.length > 0) {
    node.children = regularChildren.map(c =>
      buildNode(c.title, c.tiddler, c.marker)
    )
  }

  return node
}

// Build the full import document
const importData = {
  title: 'RHAM Policy Manual',
  description: 'Imported from TiddlyWiki tiddlers (RHAM Regional School District)',
  nodes: policyRoots.map(t => {
    const policyNbr = t.fields['policy-nbr'] || t.fields.title.replace('Policy', '')
    return buildNode(t.fields.title, t, policyNbr)
  }),
}

const json = JSON.stringify(importData, null, 2)

if (outputFile) {
  await writeFile(outputFile, json, 'utf-8')
  console.log(`Wrote ${outputFile}`)
} else {
  console.log(json)
}

// Summary
const totalNodes = countNodes(importData.nodes)
const specialCount = [...byTitle.values()].filter(t => {
  const title = t.fields.title || ''
  return SPECIAL_SECTIONS.has(parseMarkers(title.slice(title.indexOf('(') >= 0 ? title.indexOf('(') : title.length)).pop())
}).length
console.error(`Converted ${policyRoots.length} policies, ${totalNodes} total nodes`)

function countNodes(nodes) {
  return nodes.reduce((sum, n) => sum + 1 + (n.children ? countNodes(n.children) : 0), 0)
}
