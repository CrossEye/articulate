// Seed script: creates a sample document with a small hierarchy
// to exercise the data model and verify everything works.
//
// Usage: node scripts/seed.js

import { createConnection } from '../src/server/db/connection.js'
import { runMigrations } from '../src/server/db/migrations.js'
import { createDocument } from '../src/server/db/documents.js'
import { createNode } from '../src/server/db/nodes.js'
import { createVersion } from '../src/server/db/versions.js'
import { createInitialRevision, createRevision, getTree, getChildren, getRevision } from '../src/server/db/revisions.js'

const db = createConnection()
runMigrations(db)

// 1. Create a document
createDocument(db, {
  id: 'sample-charter',
  title: 'Sample Town Charter',
})
console.log('Created document: sample-charter')

// 2. Create nodes (content-addressed, so duplicates are ignored)
const rootId = createNode(db, {
  body: 'The charter of the Town of Sampleville, adopted 2026.',
  caption: 'Sample Town Charter',
  nodeType: 'section',
})

const ch1Id = createNode(db, {
  body: 'The legislative body of the Town shall be the Town Council, consisting of seven members elected at large.',
  caption: 'Town Council',
  nodeType: 'section',
})

const ch2Id = createNode(db, {
  body: 'The executive power of the Town shall be vested in a Town Manager appointed by the Town Council.',
  caption: 'Town Manager',
  nodeType: 'section',
})

const s201Id = createNode(db, {
  body: 'The Town Manager shall be appointed by a majority vote of the Town Council for a term of three years.',
  caption: 'Appointment',
  nodeType: 'section',
})

const s202Id = createNode(db, {
  body: 'The Town Manager shall be the chief administrative officer of the Town and shall be responsible for the administration of all departments.',
  caption: 'Powers and Duties',
  nodeType: 'section',
})

const s202aId = createNode(db, {
  body: 'The Town Manager shall prepare and submit to the Town Council an annual budget.',
  caption: 'Budget',
  nodeType: 'clause',
})

const s202bId = createNode(db, {
  body: 'The Town Manager shall appoint and remove all department heads, subject to Town Council approval.',
  caption: 'Personnel',
  nodeType: 'clause',
})

const ch3Id = createNode(db, {
  body: 'The fiscal year of the Town shall begin on July 1 and end on June 30.',
  caption: 'Finance',
  nodeType: 'section',
})

console.log('Created 8 content nodes')

// 3. Create the main version (branch)
createVersion(db, {
  id: 'main',
  documentId: 'sample-charter',
  name: 'Main',
  description: 'The official version of the charter',
})

// 4. Create the initial revision with the full tree
const entries = [
  { path: 'root',            nodeId: rootId,  parentPath: null,          sortKey: 0, marker: '',     depth: 0 },
  { path: 'root/ch1',        nodeId: ch1Id,   parentPath: 'root',        sortKey: 0, marker: 'ch1',  depth: 1 },
  { path: 'root/ch2',        nodeId: ch2Id,   parentPath: 'root',        sortKey: 1, marker: 'ch2',  depth: 1 },
  { path: 'root/ch2/s201',   nodeId: s201Id,  parentPath: 'root/ch2',    sortKey: 0, marker: 's201', depth: 2 },
  { path: 'root/ch2/s202',   nodeId: s202Id,  parentPath: 'root/ch2',    sortKey: 1, marker: 's202', depth: 2 },
  { path: 'root/ch2/s202/A', nodeId: s202aId, parentPath: 'root/ch2/s202', sortKey: 0, marker: 'A', depth: 3 },
  { path: 'root/ch2/s202/B', nodeId: s202bId, parentPath: 'root/ch2/s202', sortKey: 1, marker: 'B', depth: 3 },
  { path: 'root/ch3',        nodeId: ch3Id,   parentPath: 'root',        sortKey: 2, marker: 'ch3',  depth: 1 },
]

const rev1Id = createInitialRevision(db, {
  versionId: 'main',
  message: 'Initial charter structure',
  entries,
})
console.log(`Created initial revision: ${rev1Id}`)

// 5. Verify the tree
const tree = getTree(db, rev1Id)
console.log(`\nTree has ${tree.length} entries:`)
for (const e of tree) {
  const indent = '  '.repeat(e.depth)
  console.log(`  ${indent}${e.path} [${e.marker}] -> ${e.node_id.slice(0, 8)}...`)
}

// 6. Make an edit — update ch3 content, creating a second revision via copy-on-write
const ch3UpdatedId = createNode(db, {
  body: 'The fiscal year of the Town shall begin on July 1 and end on June 30. All departments shall submit budget requests by March 1.',
  caption: 'Finance',
  nodeType: 'section',
})

const rev2Id = createRevision(db, {
  versionId: 'main',
  parentId: rev1Id,
  message: 'Add budget deadline to Finance chapter',
  entries: [{
    path: 'root/ch3',
    nodeId: ch3UpdatedId,
    parentPath: 'root',
    sortKey: 2,
    marker: 'ch3',
    depth: 1,
  }],
})
console.log(`\nCreated revision 2: ${rev2Id}`)

// 7. Verify copy-on-write — rev2 should have same entries as rev1 except ch3
const tree2 = getTree(db, rev2Id)
const unchanged = tree2.filter(e =>
  tree.some(t => t.path === e.path && t.node_id === e.node_id)
)
console.log(`Rev 2 tree: ${tree2.length} entries (${unchanged.length} shared with rev 1)`)

// 8. Create a branch
createVersion(db, {
  id: 'budget-rewrite',
  documentId: 'sample-charter',
  name: 'Budget Rewrite',
  description: 'Proposed changes to finance chapter',
  forkedFrom: rev2Id,
})

const rev3Id = createInitialRevision(db, {
  versionId: 'budget-rewrite',
  message: 'Fork for budget rewrite',
  entries: tree2.map(e => ({
    path: e.path,
    nodeId: e.node_id,
    parentPath: e.parent_path,
    sortKey: e.sort_key,
    marker: e.marker,
    depth: e.depth,
  })),
})
console.log(`\nCreated branch 'budget-rewrite' with revision: ${rev3Id}`)

// 9. Summary
const children = getChildren(db, rev2Id, 'root')
console.log(`\nRoot children in rev 2: ${children.map(c => c.marker).join(', ')}`)

console.log('\nSeed complete.')
db.close()
