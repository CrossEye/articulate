// Reference conversion: Andover Town Charter tiddlers -> Articulate import JSON.
//
// Usage: node scripts/convert-charter.js <tiddler-dir> [output.json]
//
// Reads .tid files from the semiofficial tiddlers directory, builds
// the hierarchical import format, and writes JSON to stdout or a file.

import { loadTiddlers, filterByTag } from '../src/server/import/tiddlywiki.js'
import { twToMarkdown } from '../src/server/import/markup.js'
import { writeFile } from 'node:fs/promises'

const DEFAULT_DIR = 'C:/Users/scott/Dev/Andover/Charter/2024/semiofficial/tiddlers'

const tiddlerDir = process.argv[2] || DEFAULT_DIR
const outputFile = process.argv[3]

const tiddlers = await loadTiddlers(tiddlerDir)

// Index tiddlers by title for cross-reference resolution
const byTitle = new Map()
for (const t of tiddlers) {
  if (t.fields.title) byTitle.set(t.fields.title, t)
}

// Build a path resolver for <<Section NNN>> cross-references
const sectionPathResolver = (ref) => {
  // ref is like "302A" or "1013A(1)" — find the tiddler and build its path
  const tiddler = byTitle.get(`Section${ref}`)
  if (!tiddler) return `ch?/s${ref}`
  return buildPath(tiddler)
}

// Build path from tiddler fields
const buildPath = (t) => {
  const f = t.fields
  const ch = f.chapter
  if (!ch) return f.title || ''

  const parts = [`ch${ch}`]
  if (f.section) parts.push(`s${f.section}`)
  if (f.subsection) parts.push(f.subsection)
  if (f['sub-subsection']) parts.push(String(f['sub-subsection']))
  return parts.join('/')
}

// Determine marker from fields
const buildMarker = (t) => {
  const f = t.fields
  const tags = (f.tags || '').split(/\s+/)
  if (tags.includes('Chapter')) return `ch${f.chapter}`
  if (tags.includes('Sub-subsection')) return String(f['sub-subsection'])
  if (tags.includes('Subsection')) return f.subsection
  if (tags.includes('Section')) return `s${f.section}`
  return ''
}

// Convert body text
const convertBody = (t) =>
  twToMarkdown(t.body, { pathResolver: sectionPathResolver })

// Build the import tree
const chapters = filterByTag(tiddlers, 'Chapter')
  .sort((a, b) => Number(a.fields.chapter) - Number(b.fields.chapter))

const sections = tiddlers.filter(t => {
  const tags = (t.fields.tags || '').split(/\s+/)
  return tags.includes('Section') && !tags.includes('Chapter')
})

const subsections = filterByTag(tiddlers, 'Subsection')
const subsubsections = filterByTag(tiddlers, 'Sub-subsection')

// Group by parent
const sectionsByChapter = new Map()
for (const s of sections) {
  const ch = s.fields.chapter
  if (!sectionsByChapter.has(ch)) sectionsByChapter.set(ch, [])
  sectionsByChapter.get(ch).push(s)
}

const subsectionsBySection = new Map()
for (const s of subsections) {
  const sec = s.fields.section
  if (!subsectionsBySection.has(sec)) subsectionsBySection.set(sec, [])
  subsectionsBySection.get(sec).push(s)
}

const subsubByParent = new Map()
for (const s of subsubsections) {
  const key = `${s.fields.section}${s.fields.subsection}`
  if (!subsubByParent.has(key)) subsubByParent.set(key, [])
  subsubByParent.get(key).push(s)
}

// Build nested structure
const buildSubSubsections = (sec, sub) => {
  const key = `${sec}${sub}`
  const items = subsubByParent.get(key) || []
  return items
    .sort((a, b) => Number(a.fields['sub-subsection']) - Number(b.fields['sub-subsection']))
    .map(t => ({
      path: String(t.fields['sub-subsection']),
      caption: t.fields.caption || '',
      body: convertBody(t),
      marker: String(t.fields['sub-subsection']),
    }))
}

const buildSubsections = (sec) => {
  const items = subsectionsBySection.get(sec) || []
  return items
    .sort((a, b) => (a.fields.subsection || '').localeCompare(b.fields.subsection || ''))
    .map(t => ({
      path: t.fields.subsection,
      caption: t.fields.caption || '',
      body: convertBody(t),
      marker: t.fields.subsection,
      children: buildSubSubsections(sec, t.fields.subsection),
    }))
    .map(n => n.children.length === 0 ? { ...n, children: undefined } : n)
}

const buildSections = (ch) => {
  const items = sectionsByChapter.get(ch) || []
  return items
    .sort((a, b) => Number(a.fields.section) - Number(b.fields.section))
    .map(t => ({
      path: `s${t.fields.section}`,
      caption: t.fields.caption || '',
      body: convertBody(t),
      marker: `s${t.fields.section}`,
      children: buildSubsections(t.fields.section),
    }))
    .map(n => n.children.length === 0 ? { ...n, children: undefined } : n)
}

const importData = {
  title: 'Town of Andover Charter 2027',
  description: 'Imported from TiddlyWiki tiddlers (semiofficial edition)',
  nodes: chapters.map(t => ({
    path: `ch${t.fields.chapter}`,
    caption: t.fields.caption || '',
    body: convertBody(t),
    marker: `ch${t.fields.chapter}`,
    children: buildSections(t.fields.chapter),
  })),
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
console.error(`Converted ${chapters.length} chapters, ${sections.length} sections, ${subsections.length} subsections, ${subsubsections.length} sub-subsections`)
console.error(`Total nodes: ${totalNodes}`)

function countNodes(nodes) {
  return nodes.reduce((sum, n) => sum + 1 + (n.children ? countNodes(n.children) : 0), 0)
}
