import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { createTestDb } from './test-helpers.js'
import { createDocument } from './documents.js'
import { createNode } from './nodes.js'
import { createVersion, getVersion } from './versions.js'
import {
  createInitialRevision,
  createRevision,
  getRevision,
  listRevisions,
  getTree,
  getChildren,
  getTreeEntry,
  removeTreeEntries,
} from './revisions.js'

const setup = () => {
  const db = createTestDb()
  createDocument(db, { id: 'doc', title: 'Test' })
  createVersion(db, { id: 'main', documentId: 'doc', name: 'Main' })
  return db
}

describe('revisions', () => {
  it('creates an initial revision with tree entries', () => {
    const db = setup()
    const rootId = createNode(db, { body: 'Root', caption: 'Root' })
    const childId = createNode(db, { body: 'Child', caption: 'Ch1' })

    const revId = createInitialRevision(db, {
      versionId: 'main',
      message: 'Initial',
      entries: [
        { path: 'root', nodeId: rootId, parentPath: null, sortKey: 0, marker: '', depth: 0 },
        { path: 'root/ch1', nodeId: childId, parentPath: 'root', sortKey: 0, marker: 'ch1', depth: 1 },
      ],
    })

    const tree = getTree(db, revId)
    assert.equal(tree.length, 2)
    assert.equal(tree[0].path, 'root')
    assert.equal(tree[1].path, 'root/ch1')
  })

  it('updates version head_rev on revision creation', () => {
    const db = setup()
    const nodeId = createNode(db, { body: 'Root' })
    const revId = createInitialRevision(db, {
      versionId: 'main',
      message: 'Init',
      entries: [{ path: 'root', nodeId, parentPath: null, sortKey: 0, marker: '', depth: 0 }],
    })

    const version = getVersion(db, 'main')
    assert.equal(version.head_rev, revId)
  })

  it('copy-on-write: new revision shares unchanged entries', () => {
    const db = setup()
    const n1 = createNode(db, { body: 'A' })
    const n2 = createNode(db, { body: 'B' })
    const n3 = createNode(db, { body: 'C' })

    const rev1 = createInitialRevision(db, {
      versionId: 'main',
      entries: [
        { path: 'root', nodeId: n1, parentPath: null, sortKey: 0, marker: '', depth: 0 },
        { path: 'root/a', nodeId: n2, parentPath: 'root', sortKey: 0, marker: 'a', depth: 1 },
        { path: 'root/b', nodeId: n3, parentPath: 'root', sortKey: 1, marker: 'b', depth: 1 },
      ],
    })

    const n2Updated = createNode(db, { body: 'B updated' })
    const rev2 = createRevision(db, {
      versionId: 'main',
      parentId: rev1,
      message: 'Update a',
      entries: [{ path: 'root/a', nodeId: n2Updated, parentPath: 'root', sortKey: 0, marker: 'a', depth: 1 }],
    })

    const tree1 = getTree(db, rev1)
    const tree2 = getTree(db, rev2)

    assert.equal(tree2.length, 3)

    // root and root/b should be unchanged
    const root2 = tree2.find(e => e.path === 'root')
    assert.equal(root2.node_id, n1)

    const b2 = tree2.find(e => e.path === 'root/b')
    assert.equal(b2.node_id, n3)

    // root/a should be updated
    const a2 = tree2.find(e => e.path === 'root/a')
    assert.equal(a2.node_id, n2Updated)
  })

  it('lists revisions for a version', () => {
    const db = setup()
    const n = createNode(db, { body: 'X' })
    createInitialRevision(db, {
      versionId: 'main',
      entries: [{ path: 'root', nodeId: n, parentPath: null, sortKey: 0, marker: '', depth: 0 }],
    })
    const revs = listRevisions(db, 'main')
    assert.equal(revs.length, 1)
  })

  it('getChildren returns children sorted by sort_key', () => {
    const db = setup()
    const root = createNode(db, { body: 'Root' })
    const a = createNode(db, { body: 'A' })
    const b = createNode(db, { body: 'B' })

    const revId = createInitialRevision(db, {
      versionId: 'main',
      entries: [
        { path: 'root', nodeId: root, parentPath: null, sortKey: 0, marker: '', depth: 0 },
        { path: 'root/b', nodeId: b, parentPath: 'root', sortKey: 1, marker: 'b', depth: 1 },
        { path: 'root/a', nodeId: a, parentPath: 'root', sortKey: 0, marker: 'a', depth: 1 },
      ],
    })

    const children = getChildren(db, revId, 'root')
    assert.equal(children.length, 2)
    assert.equal(children[0].marker, 'a')
    assert.equal(children[1].marker, 'b')
  })

  it('getTreeEntry returns a single entry', () => {
    const db = setup()
    const n = createNode(db, { body: 'X' })
    const revId = createInitialRevision(db, {
      versionId: 'main',
      entries: [{ path: 'root', nodeId: n, parentPath: null, sortKey: 0, marker: '', depth: 0 }],
    })

    const entry = getTreeEntry(db, revId, 'root')
    assert.equal(entry.node_id, n)
    assert.equal(getTreeEntry(db, revId, 'nonexistent'), undefined)
  })

  it('removeTreeEntries deletes specified paths', () => {
    const db = setup()
    const n1 = createNode(db, { body: 'A' })
    const n2 = createNode(db, { body: 'B' })

    const revId = createInitialRevision(db, {
      versionId: 'main',
      entries: [
        { path: 'root', nodeId: n1, parentPath: null, sortKey: 0, marker: '', depth: 0 },
        { path: 'root/a', nodeId: n2, parentPath: 'root', sortKey: 0, marker: 'a', depth: 1 },
      ],
    })

    removeTreeEntries(db, revId, ['root/a'])
    const tree = getTree(db, revId)
    assert.equal(tree.length, 1)
    assert.equal(tree[0].path, 'root')
  })
})
