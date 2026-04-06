// Seed script: creates a Millbrook town charter with users, branches,
// merges, and tags demonstrating a realistic revision workflow.
//
// Usage: node scripts/seed.js
//   Deletes existing DB and starts fresh.

import path from 'node:path'
import { fileURLToPath } from 'node:url'
import bcrypt from 'bcrypt'
import { createConnection } from '../src/server/db/connection.js'
import { runMigrations } from '../src/server/db/migrations.js'
import { createDocument } from '../src/server/db/documents.js'
import { createNode } from '../src/server/db/nodes.js'
import { createVersion, lockVersion, addVersionMember } from '../src/server/db/versions.js'
import { createInitialRevision, createRevision, getTree, publishRevision } from '../src/server/db/revisions.js'
import { createUser, updatePassword } from '../src/server/db/users.js'
import { createTag } from '../src/server/db/tags.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dbPath = path.resolve(__dirname, '..', 'data', 'articulate.db')

// --- Wipe and recreate ---
// Try to delete the file; if locked (e.g. server running), drop tables instead
const db = createConnection(dbPath)
const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all()
db.pragma('foreign_keys = OFF')
for (const { name } of tables) db.exec(`DROP TABLE IF EXISTS "${name}"`)
db.pragma('foreign_keys = ON')
runMigrations(db)

// --- Users ---
// Migration created bootstrap admin with id='admin'; delete it and make our own
db.prepare('DELETE FROM users WHERE id = ?').run('admin')

const pw = (s) => bcrypt.hashSync(s, 10)

const users = {}
for (const [username, displayName, role] of [
  ['admin',   'Administrator',   'admin'],
  ['alice',   'Alice Thornton',  'editor'],  // Commission Chair
  ['bob',     'Bob Kimball',     'editor'],  // Budget Subcommittee
  ['carol',   'Carol Prescott',  'editor'],  // Budget Subcommittee
  ['dave',    'Dave Okonkwo',    'editor'],  // Personnel Subcommittee
  ['edward',  'Edward Chen',     'editor'],  // Personnel Subcommittee
  ['frannie', 'Frannie Duval',   'editor'],  // General Provisions
]) {
  users[username] = createUser(db, {
    username,
    displayName,
    passwordHash: pw(username),
    role,
  })
}
console.log(`Created ${Object.keys(users).length} users (each password = username)`)

// --- Helpers ---
const node = (caption, body, nodeType = 'section') =>
  createNode(db, { body, caption, nodeType })

const forkVersion = (id, name, description, sourceRevId, createdBy) => {
  createVersion(db, { id, documentId: DOC_ID, name, description, forkedFrom: sourceRevId, createdBy })
  const tree = getTree(db, sourceRevId)
  return createInitialRevision(db, {
    versionId: id,
    parentId: sourceRevId,
    message: `Fork: ${name}`,
    createdBy,
    entries: tree.map(e => ({
      path: e.path, nodeId: e.node_id, parentPath: e.parent_path,
      sortKey: e.sort_key, marker: e.marker, depth: e.depth,
    })),
  })
}

const editNode = (versionId, parentRevId, nodePath, parentPath, sortKey, marker, depth, caption, body, message, createdBy) => {
  const nodeId = node(caption, body)
  return createRevision(db, {
    versionId,
    parentId: parentRevId,
    message,
    createdBy,
    entries: [{ path: nodePath, nodeId, parentPath, sortKey, marker, depth }],
  })
}

const mergeRevisions = (versionId, parentRevId, sourceRevIds, entries, message, createdBy) =>
  createInitialRevision(db, {
    versionId,
    parentId: parentRevId,
    message,
    createdBy,
    mergeSources: sourceRevIds,
    entries,
  })

// Build a merged tree: start with treeA, overlay changed entries from treeB
const mergeTrees = (treeA, treeB, overridePaths) => {
  const merged = new Map()
  for (const e of treeA) merged.set(e.path, e)
  for (const p of overridePaths) {
    const entry = treeB.find(e => e.path === p)
    if (entry) merged.set(p, entry)
  }
  return [...merged.values()].map(e => ({
    path: e.path, nodeId: e.node_id, parentPath: e.parent_path,
    sortKey: e.sort_key, marker: e.marker, depth: e.depth,
  }))
}

// --- Document ---
const DOC_ID = 'millbrook-charter'
createDocument(db, { id: DOC_ID, title: 'Town of Millbrook Charter' })

// ============================================================
// Phase 1: The 2021 Charter
// ============================================================

const n = {
  root:  node('Town of Millbrook Charter', 'Charter of the Town of Millbrook, as adopted by the voters at a special election held November 2, 2021.'),
  art1:  node('Incorporation and Powers', 'The inhabitants of the Town of Millbrook shall continue to be a body corporate and politic under the name "Town of Millbrook."'),
  s11:   node('Boundaries', 'The boundaries of the Town shall be as established by law.'),
  s12:   node('Powers', 'The Town shall have all powers possible for a town to have under the constitution and laws of the Commonwealth.'),
  art2:  node('Legislative Branch', 'The legislative powers of the Town shall be exercised by a representative Town Meeting.'),
  s21:   node('Composition', 'Town Meeting shall consist of not fewer than 180 elected members, apportioned equally among six precincts.'),
  s22:   node('Quorum', 'A quorum shall consist of a majority of the seated Town Meeting members.'),
  s23:   node('Presiding Officer', 'The Town Moderator shall preside at all sessions of Town Meeting and shall have the powers and duties given by law.'),
  art3:  node('Executive Branch', 'The executive powers of the Town shall be vested in a Board of Selectmen and a Town Manager.'),
  s31:   node('Board of Selectmen', 'The Board of Selectmen shall consist of five members elected for staggered three-year terms.'),
  s32:   node('Town Manager', 'The Town Manager shall be appointed by the Board of Selectmen and shall serve as the chief administrative officer of the Town.'),
  s33:   node('Appointments', 'The Town Manager shall appoint and may remove all department heads, subject to Board approval for removals.'),
  art4:  node('Finance', 'The fiscal administration of the Town shall be conducted in accordance with this article.'),
  s41:   node('Fiscal Year', 'The fiscal year of the Town shall begin on July 1 and end on June 30.'),
  s42:   node('Annual Budget', 'The Town Manager shall submit a proposed annual budget to the Board of Selectmen no later than 120 days before the Annual Town Meeting.'),
  s43:   node('Capital Planning', 'The Town Manager shall prepare a five-year capital improvement program for consideration by the Board.'),
  art5:  node('General Provisions', 'The following general provisions shall apply to the administration of the Town.'),
  s51:   node('Severability', 'If any provision of this Charter is held invalid, the other provisions shall not be affected thereby.'),
  s52:   node('Definitions', 'Unless another meaning is clearly apparent from the context, words and phrases shall have their customary municipal-law meanings.'),
  s53:   node('Charter Review', 'At least once every ten years, the Board of Selectmen shall appoint a Charter Review Committee to review the Charter and propose amendments.'),
}

const entries2021 = [
  { path: 'root',           nodeId: n.root,  parentPath: null,          sortKey: 0, marker: '',     depth: 0 },
  { path: 'root/1000',      nodeId: n.art1,  parentPath: 'root',        sortKey: 0, marker: '1',    depth: 1 },
  { path: 'root/1000/101',  nodeId: n.s11,   parentPath: 'root/1000',   sortKey: 0, marker: '1-1',  depth: 2 },
  { path: 'root/1000/102',  nodeId: n.s12,   parentPath: 'root/1000',   sortKey: 1, marker: '1-2',  depth: 2 },
  { path: 'root/2000',      nodeId: n.art2,  parentPath: 'root',        sortKey: 1, marker: '2',    depth: 1 },
  { path: 'root/2000/201',  nodeId: n.s21,   parentPath: 'root/2000',   sortKey: 0, marker: '2-1',  depth: 2 },
  { path: 'root/2000/202',  nodeId: n.s22,   parentPath: 'root/2000',   sortKey: 1, marker: '2-2',  depth: 2 },
  { path: 'root/2000/203',  nodeId: n.s23,   parentPath: 'root/2000',   sortKey: 2, marker: '2-3',  depth: 2 },
  { path: 'root/3000',      nodeId: n.art3,  parentPath: 'root',        sortKey: 2, marker: '3',    depth: 1 },
  { path: 'root/3000/301',  nodeId: n.s31,   parentPath: 'root/3000',   sortKey: 0, marker: '3-1',  depth: 2 },
  { path: 'root/3000/302',  nodeId: n.s32,   parentPath: 'root/3000',   sortKey: 1, marker: '3-2',  depth: 2 },
  { path: 'root/3000/303',  nodeId: n.s33,   parentPath: 'root/3000',   sortKey: 2, marker: '3-3',  depth: 2 },
  { path: 'root/4000',      nodeId: n.art4,  parentPath: 'root',        sortKey: 3, marker: '4',    depth: 1 },
  { path: 'root/4000/401',  nodeId: n.s41,   parentPath: 'root/4000',   sortKey: 0, marker: '4-1',  depth: 2 },
  { path: 'root/4000/402',  nodeId: n.s42,   parentPath: 'root/4000',   sortKey: 1, marker: '4-2',  depth: 2 },
  { path: 'root/4000/403',  nodeId: n.s43,   parentPath: 'root/4000',   sortKey: 2, marker: '4-3',  depth: 2 },
  { path: 'root/5000',      nodeId: n.art5,  parentPath: 'root',        sortKey: 4, marker: '5',    depth: 1 },
  { path: 'root/5000/501',  nodeId: n.s51,   parentPath: 'root/5000',   sortKey: 0, marker: '5-1',  depth: 2 },
  { path: 'root/5000/502',  nodeId: n.s52,   parentPath: 'root/5000',   sortKey: 1, marker: '5-2',  depth: 2 },
  { path: 'root/5000/503',  nodeId: n.s53,   parentPath: 'root/5000',   sortKey: 2, marker: '5-3',  depth: 2 },
]

createVersion(db, { id: 'v2021', documentId: DOC_ID, name: 'Version 2021', description: 'Adopted November 2, 2021', createdBy: users.alice })
const rev1 = createInitialRevision(db, {
  versionId: 'v2021', message: 'Charter as adopted 2021', createdBy: users.alice, entries: entries2021,
})
publishRevision(db, rev1)
lockVersion(db, 'v2021')
db.prepare('UPDATE documents SET published_version = ? WHERE id = ?').run('v2021', DOC_ID)
console.log(`Rev 1 (seq 1): 2021 charter — ${entries2021.length} nodes, locked`)

// ============================================================
// Phase 2: Fork for 2026 Revision Commission
// ============================================================

const rev2 = forkVersion('v2026', 'Version 2026', '2026 Charter Revision Commission working draft', rev1, users.alice)
console.log('Rev 2: Fork v2026 from v2021')

// Alice updates the preamble to note this is a working revision
const rev3 = editNode('v2026', rev2, 'root', null, 0, '', 0,
  'Town of Millbrook Charter',
  'Charter of the Town of Millbrook. Originally adopted November 2, 2021. Under revision by the 2026 Charter Revision Commission.',
  'Update preamble for 2026 revision', users.alice)
console.log('Rev 3: Alice updates preamble')

// ============================================================
// Phase 3: Subcommittee branches
// ============================================================

const rev4 = forkVersion('budget-sub', 'Budget Subcommittee', 'Finance article revisions', rev3, users.bob)
addVersionMember(db, 'budget-sub', users.bob, 'editor')
addVersionMember(db, 'budget-sub', users.carol, 'editor')
console.log('Rev 4: Fork budget-sub')

const rev5 = forkVersion('personnel-sub', 'Personnel Subcommittee', 'Executive branch revisions', rev3, users.dave)
addVersionMember(db, 'personnel-sub', users.dave, 'editor')
addVersionMember(db, 'personnel-sub', users.edward, 'editor')
console.log('Rev 5: Fork personnel-sub')

const rev6 = forkVersion('gen-prov-sub', 'General Provisions Subcommittee', 'General provisions and charter review', rev3, users.frannie)
addVersionMember(db, 'gen-prov-sub', users.frannie, 'editor')
console.log('Rev 6: Fork gen-prov-sub')

// ============================================================
// Phase 4: Budget Subcommittee work
// ============================================================

// Bob's working branch
const rev7 = forkVersion('bob-budget', "Bob's Budget Working", 'Bob working on fiscal year and annual budget', rev4, users.bob)

const rev8 = editNode('bob-budget', rev7, 'root/4000/401', 'root/4000', 0, '4-1', 2,
  'Fiscal Year',
  'The fiscal year of the Town shall begin on July 1 and end on June 30. All departmental budgets shall align to this cycle.',
  'Clarify fiscal year alignment', users.bob)

const rev9 = editNode('bob-budget', rev8, 'root/4000/402', 'root/4000', 1, '4-2', 2,
  'Annual Budget',
  'The Town Manager shall submit a proposed annual budget to the Board of Selectmen no later than 150 days before the Annual Town Meeting. The budget shall include a summary of all anticipated revenues and proposed expenditures.',
  'Extend budget deadline to 150 days, add revenue summary requirement', users.bob)
console.log('Revs 7-9: Bob edits fiscal year and budget sections')

// Carol's working branch
const rev10 = forkVersion('carol-budget', "Carol's Budget Working", 'Carol working on capital planning and borrowing', rev4, users.carol)

const rev11 = editNode('carol-budget', rev10, 'root/4000/403', 'root/4000', 2, '4-3', 2,
  'Capital Planning',
  'The Town Manager shall prepare a five-year capital improvement program annually. Projects exceeding $50,000 shall require Town Meeting approval.',
  'Add $50k threshold for capital projects', users.carol)

// Carol adds a new section: Borrowing
const borrowingNode = node('Borrowing', 'The Town may borrow money for capital purposes by a two-thirds vote of Town Meeting, in accordance with applicable law.')
const rev12 = createRevision(db, {
  versionId: 'carol-budget', parentId: rev11, message: 'Add borrowing section',
  createdBy: users.carol,
  entries: [{ path: 'root/4000/404', nodeId: borrowingNode, parentPath: 'root/4000', sortKey: 3, marker: '4-4', depth: 2 }],
})
console.log('Revs 10-12: Carol edits capital planning, adds borrowing section')

// Merge Bob + Carol -> budget-sub
const bobTree = getTree(db, rev9)
const carolTree = getTree(db, rev12)
const budgetMerged = mergeTrees(bobTree, carolTree, ['root/4000/403', 'root/4000/404'])
// Also include Bob's changes (already in bobTree as base)
const rev13 = mergeRevisions('budget-sub', rev4, [rev9, rev12], budgetMerged,
  'Merge Bob and Carol budget work', users.bob)
console.log('Rev 13: Merge bob-budget + carol-budget -> budget-sub')

createTag(db, { documentId: DOC_ID, name: 'budget-ready-for-review', revisionId: rev13, createdBy: users.bob })
console.log('Tagged rev 13: budget-ready-for-review')

// ============================================================
// Phase 5: Personnel Subcommittee work
// ============================================================

// Dave's working branch
const rev14 = forkVersion('dave-personnel', "Dave's Personnel Working", 'Board of Selectmen revisions', rev5, users.dave)

const rev15 = editNode('dave-personnel', rev14, 'root/3000/301', 'root/3000', 0, '3-1', 2,
  'Board of Selectmen',
  'The Board of Selectmen shall consist of five members elected for staggered three-year terms. No person shall serve more than three consecutive terms.',
  'Add term limits for Selectmen', users.dave)

const rev16 = editNode('dave-personnel', rev15, 'root/3000/302', 'root/3000', 1, '3-2', 2,
  'Town Manager',
  'The Town Manager shall be appointed by the Board of Selectmen and shall serve as the chief administrative officer of the Town. The appointment shall require a four-fifths vote.',
  'Require supermajority for Town Manager appointment', users.dave)
console.log('Revs 14-16: Dave adds term limits and supermajority requirement')

// Edward's working branch
const rev17 = forkVersion('edward-personnel', "Edward's Personnel Working", 'Appointments and new ethics section', rev5, users.edward)

const rev18 = editNode('edward-personnel', rev17, 'root/3000/303', 'root/3000', 2, '3-3', 2,
  'Appointments',
  'The Town Manager shall appoint and may remove all department heads. Removals shall require a public hearing with at least 14 days notice.',
  'Add public hearing requirement for removals', users.edward)
console.log('Revs 17-18: Edward strengthens appointment/removal process')

// Merge Dave + Edward -> personnel-sub
const daveTree = getTree(db, rev16)
const edwardTree = getTree(db, rev18)
const personnelMerged = mergeTrees(daveTree, edwardTree, ['root/3000/303'])
const rev19 = mergeRevisions('personnel-sub', rev5, [rev16, rev18], personnelMerged,
  'Merge Dave and Edward personnel work', users.dave)
console.log('Rev 19: Merge dave-personnel + edward-personnel -> personnel-sub')

createTag(db, { documentId: DOC_ID, name: 'personnel-ready-for-review', revisionId: rev19, createdBy: users.dave })
console.log('Tagged rev 19: personnel-ready-for-review')

// ============================================================
// Phase 6: General Provisions — still in progress
// ============================================================

// Frannie's working branch (not yet merged back)
const rev20 = forkVersion('frannie-genprov', "Frannie's Working", 'General provisions updates', rev6, users.frannie)

const rev21 = editNode('frannie-genprov', rev20, 'root/5000/501', 'root/5000', 0, '5-1', 2,
  'Severability',
  'If any provision of this Charter is held invalid by a court of competent jurisdiction, the other provisions shall not be affected thereby. The invalidity shall be confined to the specific provision held to be invalid.',
  'Strengthen severability language', users.frannie)

const rev22 = editNode('frannie-genprov', rev21, 'root/5000/503', 'root/5000', 2, '5-3', 2,
  'Charter Review',
  'At least once every ten years, the Board of Selectmen shall appoint a Charter Review Committee of not fewer than nine residents to review the Charter and propose amendments. The Committee shall hold at least three public hearings.',
  'Add committee size minimum and public hearing requirement', users.frannie)
console.log('Revs 20-22: Frannie working on general provisions (still in progress)')

// ============================================================
// Summary
// ============================================================

const allRevs = db.prepare(`
  SELECT r.seq, r.message, v.name as version, r.merge_sources
  FROM revisions r JOIN versions v ON v.id = r.version_id
  WHERE v.document_id = ? ORDER BY r.seq
`).all(DOC_ID)

console.log(`\n=== ${allRevs.length} revisions created ===`)
for (const r of allRevs) {
  const merge = r.merge_sources ? ' [MERGE]' : ''
  console.log(`  Rev ${r.seq}: ${r.version} — ${r.message}${merge}`)
}

const tags = db.prepare('SELECT name, revision_id FROM tags WHERE document_id = ?').all(DOC_ID)
console.log(`\n${tags.length} tags`)

const versions = db.prepare('SELECT id, name, locked FROM versions WHERE document_id = ?').all(DOC_ID)
console.log(`${versions.length} versions: ${versions.map(v => `${v.name}${v.locked ? ' (locked)' : ''}`).join(', ')}`)

console.log('\nSeed complete.')
db.close()
