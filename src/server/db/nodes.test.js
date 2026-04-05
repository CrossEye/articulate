import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { createTestDb } from './test-helpers.js'
import { createNode, getNode, getNodes } from './nodes.js'

describe('nodes', () => {
  it('creates a node with content-addressed ID', () => {
    const db = createTestDb()
    const id = createNode(db, { body: 'Hello', caption: 'Test' })
    assert.equal(typeof id, 'string')
    assert.equal(id.length, 64) // SHA-256 hex
  })

  it('returns the same ID for identical content', () => {
    const db = createTestDb()
    const id1 = createNode(db, { body: 'Hello', caption: 'Test' })
    const id2 = createNode(db, { body: 'Hello', caption: 'Test' })
    assert.equal(id1, id2)
  })

  it('returns different IDs for different content', () => {
    const db = createTestDb()
    const id1 = createNode(db, { body: 'Hello', caption: 'A' })
    const id2 = createNode(db, { body: 'Hello', caption: 'B' })
    assert.notEqual(id1, id2)
  })

  it('retrieves a node by ID', () => {
    const db = createTestDb()
    const id = createNode(db, { body: 'Content', caption: 'Title', nodeType: 'clause' })
    const node = getNode(db, id)
    assert.equal(node.body, 'Content')
    assert.equal(node.caption, 'Title')
    assert.equal(node.node_type, 'clause')
  })

  it('retrieves multiple nodes by IDs', () => {
    const db = createTestDb()
    const id1 = createNode(db, { body: 'A' })
    const id2 = createNode(db, { body: 'B' })
    const nodes = getNodes(db, [id1, id2])
    assert.equal(nodes.length, 2)
  })

  it('returns empty array for no IDs', () => {
    const db = createTestDb()
    assert.deepEqual(getNodes(db, []), [])
  })
})
