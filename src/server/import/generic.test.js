import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { createTestDb } from '../db/test-helpers.js'
import { importDocument, validate } from './generic.js'
import { getTree } from '../db/revisions.js'
import { getDocument } from '../db/documents.js'
import { getVersion } from '../db/versions.js'
import { getNode } from '../db/nodes.js'

describe('import validation', () => {
  it('rejects missing title', () => {
    const errors = validate({ nodes: [{ path: 'a', body: '', marker: 'a' }] })
    assert.ok(errors.some(e => e.includes('title')))
  })

  it('rejects empty nodes', () => {
    const errors = validate({ title: 'Test', nodes: [] })
    assert.ok(errors.some(e => e.includes('non-empty')))
  })

  it('rejects duplicate paths', () => {
    const errors = validate({
      title: 'Test',
      nodes: [
        { path: 'a', body: 'x', marker: 'a' },
        { path: 'a', body: 'y', marker: 'a' },
      ],
    })
    assert.ok(errors.some(e => e.includes('duplicate')))
  })

  it('accepts valid input', () => {
    const errors = validate({
      title: 'Test',
      nodes: [{ path: 'ch1', body: 'Hello', marker: '1' }],
    })
    assert.equal(errors.length, 0)
  })
})

describe('importDocument', () => {
  it('creates document, version, and revision', () => {
    const db = createTestDb()
    const result = importDocument(db, {
      title: 'Test Charter',
      nodes: [
        {
          path: 'ch1',
          caption: 'Chapter 1',
          body: 'First chapter.',
          marker: '1',
          children: [
            { path: 's101', caption: 'Section 101', body: 'Content here.', marker: '101' },
            { path: 's102', caption: 'Section 102', body: 'More content.', marker: '102' },
          ],
        },
        {
          path: 'ch2',
          caption: 'Chapter 2',
          body: 'Second chapter.',
          marker: '2',
        },
      ],
    })

    assert.ok(result.ok)
    assert.equal(result.nodeCount, 4)

    // Document exists
    const doc = getDocument(db, result.documentId)
    assert.equal(doc.title, 'Test Charter')

    // Version exists
    const version = getVersion(db, result.versionId)
    assert.equal(version.name, 'Original')

    // Tree has correct structure
    const tree = getTree(db, result.revisionId)
    assert.equal(tree.length, 4)

    const paths = tree.map(e => e.path)
    assert.ok(paths.includes('ch1'))
    assert.ok(paths.includes('ch1/s101'))
    assert.ok(paths.includes('ch1/s102'))
    assert.ok(paths.includes('ch2'))

    // Parent paths are correct
    const s101 = tree.find(e => e.path === 'ch1/s101')
    assert.equal(s101.parent_path, 'ch1')
    assert.equal(s101.depth, 1)
  })

  it('content-addresses nodes correctly', () => {
    const db = createTestDb()
    const result = importDocument(db, {
      title: 'Test',
      nodes: [{ path: 'a', body: 'Hello', caption: 'A', marker: 'a' }],
    })

    const tree = getTree(db, result.revisionId)
    const node = getNode(db, tree[0].node_id)
    assert.equal(node.body, 'Hello')
    assert.equal(node.caption, 'A')
  })

  it('returns errors for invalid data', () => {
    const db = createTestDb()
    const result = importDocument(db, { title: '', nodes: [] })
    assert.equal(result.ok, false)
    assert.ok(result.errors.length > 0)
  })
})
