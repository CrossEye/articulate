import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { createTestDb } from './test-helpers.js'
import { createDocument, getDocument, listDocuments, updateDocument } from './documents.js'

describe('documents', () => {
  it('creates and retrieves a document', () => {
    const db = createTestDb()
    createDocument(db, { id: 'doc1', title: 'Test Doc' })
    const doc = getDocument(db, 'doc1')
    assert.equal(doc.id, 'doc1')
    assert.equal(doc.title, 'Test Doc')
    assert.equal(doc.metadata, null)
  })

  it('lists all documents', () => {
    const db = createTestDb()
    createDocument(db, { id: 'a', title: 'First' })
    createDocument(db, { id: 'b', title: 'Second' })
    const docs = listDocuments(db)
    assert.equal(docs.length, 2)
  })

  it('updates document fields', () => {
    const db = createTestDb()
    createDocument(db, { id: 'doc1', title: 'Original' })
    updateDocument(db, 'doc1', { title: 'Updated' })
    const doc = getDocument(db, 'doc1')
    assert.equal(doc.title, 'Updated')
  })

  it('stores and retrieves metadata as JSON', () => {
    const db = createTestDb()
    createDocument(db, { id: 'doc1', title: 'Test', metadata: { style: 'charter' } })
    const doc = getDocument(db, 'doc1')
    assert.deepEqual(JSON.parse(doc.metadata), { style: 'charter' })
  })

  it('returns undefined for nonexistent document', () => {
    const db = createTestDb()
    assert.equal(getDocument(db, 'nope'), undefined)
  })
})
