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
import { setWorkflowStatus } from '../src/server/db/versions.js'

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
  ['scott',   'Scott Sauyet',    'admin'],
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

const forkBranch = (id, name, description, sourceRevId, createdBy, parentVersionId) => {
  createVersion(db, { id, documentId: DOC_ID, name, description, forkedFrom: sourceRevId, createdBy, kind: 'branch', parentVersionId })
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

const advanceWorkflow = (versionId, fromStatus, toStatus, userId, note) => {
  db.prepare(
    `INSERT INTO workflow_log (id, version_id, from_status, to_status, changed_by, note)
     VALUES (lower(hex(randomblob(16))), ?, ?, ?, ?, ?)`
  ).run(versionId, fromStatus, toStatus, userId, note)
  setWorkflowStatus(db, versionId, toStatus)
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

// v2026 is a top-level version (kind='version'), not a branch
createVersion(db, { id: 'v2026', documentId: DOC_ID, name: 'Version 2026', description: '2026 Charter Revision Commission working draft', forkedFrom: rev1, createdBy: users.alice, kind: 'version' })
const tree2021 = getTree(db, rev1)
const rev2 = createInitialRevision(db, {
  versionId: 'v2026', parentId: rev1, message: 'Fork: Version 2026', createdBy: users.alice,
  entries: tree2021.map(e => ({ path: e.path, nodeId: e.node_id, parentPath: e.parent_path, sortKey: e.sort_key, marker: e.marker, depth: e.depth })),
})
console.log('Rev 2: Fork v2026 from v2021')

// Alice works on a branch off v2026 to update the preamble
const rev3a = forkBranch('alice-preamble', "Alice's Preamble Update", 'Update preamble for 2026 revision', rev2, users.alice, 'v2026')
const rev3 = editNode('alice-preamble', rev3a, 'root', null, 0, '', 0,
  'Town of Millbrook Charter',
  'Charter of the Town of Millbrook. Originally adopted November 2, 2021. Under revision by the 2026 Charter Revision Commission.',
  'Update preamble for 2026 revision', users.alice)
// Merge preamble update into v2026
const preambleTree = getTree(db, rev3)
const rev3m = mergeRevisions('v2026', rev2, [rev3], preambleTree.map(e => ({
  path: e.path, nodeId: e.node_id, parentPath: e.parent_path,
  sortKey: e.sort_key, marker: e.marker, depth: e.depth,
})), 'Merge preamble update', users.alice)
console.log('Revs 3: Alice updates preamble via branch, merges to v2026')

// ============================================================
// Phase 3: Subcommittee branches
// ============================================================

const rev4 = forkBranch('budget-sub', 'Budget Subcommittee', 'Finance article revisions', rev3m, users.bob, 'v2026')
addVersionMember(db, 'budget-sub', users.bob, 'editor')
addVersionMember(db, 'budget-sub', users.carol, 'editor')
console.log('Rev 4: Fork budget-sub')

const rev5 = forkBranch('personnel-sub', 'Personnel Subcommittee', 'Executive branch revisions', rev3m, users.dave, 'v2026')
addVersionMember(db, 'personnel-sub', users.dave, 'editor')
addVersionMember(db, 'personnel-sub', users.edward, 'editor')
console.log('Rev 5: Fork personnel-sub')

const rev6 = forkBranch('gen-prov-sub', 'General Provisions Subcommittee', 'General provisions and charter review', rev3m, users.frannie, 'v2026')
addVersionMember(db, 'gen-prov-sub', users.frannie, 'editor')
console.log('Rev 6: Fork gen-prov-sub')

// ============================================================
// Phase 4: Budget Subcommittee work
// ============================================================

// Bob's working branch
const rev7 = forkBranch('bob-budget', "Bob's Budget Branch", 'Bob working on fiscal year and annual budget', rev4, users.bob, 'budget-sub')

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
const rev10 = forkBranch('carol-budget', "Carol's Budget Branch", 'Carol working on capital planning and borrowing', rev4, users.carol, 'budget-sub')

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

// Budget subcommittee advances through workflow
advanceWorkflow('budget-sub', null, 'draft', users.bob, 'Budget subcommittee work initiated')
advanceWorkflow('budget-sub', 'draft', 'committee-review', users.bob, 'Finance article changes are ready for commission review')
advanceWorkflow('budget-sub', 'committee-review', 'first-reading', users.alice, 'Finance revisions reviewed and approved for first reading')
console.log('budget-sub advanced to first-reading')

// ============================================================
// Phase 5: Personnel Subcommittee work
// ============================================================

// Dave's working branch
const rev14 = forkBranch('dave-personnel', "Dave's Personnel Branch", 'Board of Selectmen revisions', rev5, users.dave, 'personnel-sub')

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
const rev17 = forkBranch('edward-personnel', "Edward's Personnel Branch", 'Appointments and new ethics section', rev5, users.edward, 'personnel-sub')

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

// Personnel subcommittee advances through workflow (further behind)
advanceWorkflow('personnel-sub', null, 'draft', users.dave, 'Personnel subcommittee work initiated')
advanceWorkflow('personnel-sub', 'draft', 'committee-review', users.dave, 'Executive branch revisions ready for commission review')
console.log('personnel-sub advanced to committee-review')

// ============================================================
// Phase 6: General Provisions — still in progress
// ============================================================

// Frannie's working branch (not yet merged back)
const rev20 = forkBranch('frannie-genprov', "Frannie's Branch", 'General provisions updates', rev6, users.frannie, 'gen-prov-sub')

const rev21 = editNode('frannie-genprov', rev20, 'root/5000/501', 'root/5000', 0, '5-1', 2,
  'Severability',
  'If any provision of this Charter is held invalid by a court of competent jurisdiction, the other provisions shall not be affected thereby. The invalidity shall be confined to the specific provision held to be invalid.',
  'Strengthen severability language', users.frannie)

const rev22 = editNode('frannie-genprov', rev21, 'root/5000/503', 'root/5000', 2, '5-3', 2,
  'Charter Review',
  'At least once every ten years, the Board of Selectmen shall appoint a Charter Review Committee of not fewer than nine residents to review the Charter and propose amendments. The Committee shall hold at least three public hearings.',
  'Add committee size minimum and public hearing requirement', users.frannie)
console.log('Revs 20-22: Frannie working on general provisions (still in progress)')

// General provisions subcommittee — still in draft
advanceWorkflow('gen-prov-sub', null, 'draft', users.frannie, 'General provisions subcommittee work underway')
console.log('gen-prov-sub advanced to draft')

// ============================================================
// Policy Manual — second document
// ============================================================

const PM_ID = 'millbrook-policy-manual'
createDocument(db, { id: PM_ID, title: 'Millbrook Employee Policy Manual' })

// HR Director is carol; alice is the Commission Chair who approves final readings
// Policies are organized into chapters

const pm = {
  root:  node('Millbrook Employee Policy Manual', 'Policies governing employment with the Town of Millbrook. Adopted by the Board of Selectmen. Effective date of each chapter noted in policy header.'),
  ch1:   node('Chapter 1: Employment', 'Policies governing the employment relationship between the Town and its employees.'),
  p101:  node('1.01 Equal Employment Opportunity', 'The Town of Millbrook is an equal opportunity employer. All employment decisions shall be made without regard to race, color, religion, sex, national origin, age, disability, or any other protected characteristic.'),
  p102:  node('1.02 At-Will Employment', 'Unless covered by a collective bargaining agreement or an individual written employment contract, all Town employees are employed at will and may be terminated at any time for any lawful reason.'),
  p103:  node('1.03 Background Checks', 'All new hires and volunteers in positions of trust shall be subject to a background check prior to commencement of duties.'),
  ch2:   node('Chapter 2: Compensation & Benefits', 'Policies governing compensation, pay grades, and employee benefits.'),
  p201:  node('2.01 Pay Schedule', 'Town employees are paid bi-weekly. The pay period ends on Saturday; paychecks are issued the following Friday.'),
  p202:  node('2.02 Overtime', 'Non-exempt employees shall receive overtime pay at one and one-half times their regular rate for hours worked in excess of 40 hours per week, in accordance with the Fair Labor Standards Act.'),
  p203:  node('2.03 Health Insurance', 'Full-time employees working 30 or more hours per week are eligible for the Town health insurance plan. The Town contributes 75% of the employee-only premium.'),
  ch3:   node('Chapter 3: Workplace Conduct', 'Policies governing standards of conduct and workplace behavior.'),
  p301:  node('3.01 Code of Conduct', 'All Town employees are expected to conduct themselves professionally and ethically at all times, both in the workplace and while representing the Town.'),
  p302:  node('3.02 Harassment and Discrimination', 'The Town prohibits harassment and discrimination in any form. Employees who experience or witness harassment should report it to their supervisor or the Human Resources Director.'),
  p303:  node('3.03 Social Media Policy', 'Employees shall not post content that discloses confidential Town information, disparages the Town, or could be construed as an official Town statement without prior authorization.'),
  ch4:   node('Chapter 4: Leave Policies', 'Policies governing employee leave entitlements.'),
  p401:  node('4.01 Annual Leave', 'Full-time employees accrue annual leave at a rate of 10 days per year for the first five years of service, increasing to 15 days per year thereafter.'),
  p402:  node('4.02 Sick Leave', 'Full-time employees accrue sick leave at a rate of one day per month, up to a maximum accrual of 90 days.'),
  p403:  node('4.03 Family and Medical Leave', 'Employees who have completed 12 months of service and worked at least 1,250 hours in the past year are eligible for up to 12 weeks of unpaid Family and Medical Leave.'),
}

const pmEntries = [
  { path: 'root',          nodeId: pm.root,  parentPath: null,    sortKey: 0, marker: '',    depth: 0 },
  { path: 'root/1000',     nodeId: pm.ch1,   parentPath: 'root',  sortKey: 0, marker: '1',   depth: 1 },
  { path: 'root/1000/101', nodeId: pm.p101,  parentPath: 'root/1000', sortKey: 0, marker: '1-1', depth: 2 },
  { path: 'root/1000/102', nodeId: pm.p102,  parentPath: 'root/1000', sortKey: 1, marker: '1-2', depth: 2 },
  { path: 'root/1000/103', nodeId: pm.p103,  parentPath: 'root/1000', sortKey: 2, marker: '1-3', depth: 2 },
  { path: 'root/2000',     nodeId: pm.ch2,   parentPath: 'root',  sortKey: 1, marker: '2',   depth: 1 },
  { path: 'root/2000/201', nodeId: pm.p201,  parentPath: 'root/2000', sortKey: 0, marker: '2-1', depth: 2 },
  { path: 'root/2000/202', nodeId: pm.p202,  parentPath: 'root/2000', sortKey: 1, marker: '2-2', depth: 2 },
  { path: 'root/2000/203', nodeId: pm.p203,  parentPath: 'root/2000', sortKey: 2, marker: '2-3', depth: 2 },
  { path: 'root/3000',     nodeId: pm.ch3,   parentPath: 'root',  sortKey: 2, marker: '3',   depth: 1 },
  { path: 'root/3000/301', nodeId: pm.p301,  parentPath: 'root/3000', sortKey: 0, marker: '3-1', depth: 2 },
  { path: 'root/3000/302', nodeId: pm.p302,  parentPath: 'root/3000', sortKey: 1, marker: '3-2', depth: 2 },
  { path: 'root/3000/303', nodeId: pm.p303,  parentPath: 'root/3000', sortKey: 2, marker: '3-3', depth: 2 },
  { path: 'root/4000',     nodeId: pm.ch4,   parentPath: 'root',  sortKey: 3, marker: '4',   depth: 1 },
  { path: 'root/4000/401', nodeId: pm.p401,  parentPath: 'root/4000', sortKey: 0, marker: '4-1', depth: 2 },
  { path: 'root/4000/402', nodeId: pm.p402,  parentPath: 'root/4000', sortKey: 1, marker: '4-2', depth: 2 },
  { path: 'root/4000/403', nodeId: pm.p403,  parentPath: 'root/4000', sortKey: 2, marker: '4-3', depth: 2 },
]

// PM version 1 (current published)
createVersion(db, { id: 'pm-v1', documentId: PM_ID, name: 'Version 1.0', description: 'Initial policy manual, adopted 2023', createdBy: users.alice })
const pmRev1 = createInitialRevision(db, {
  versionId: 'pm-v1', message: 'Initial policy manual', createdBy: users.alice, entries: pmEntries,
})
publishRevision(db, pmRev1)
lockVersion(db, 'pm-v1')
db.prepare('UPDATE documents SET published_version = ? WHERE id = ?').run('pm-v1', PM_ID)
console.log(`PM Rev 1: initial policy manual — ${pmEntries.length} nodes, locked`)

// PM working version (kind='version', unlocked)
const pmTree1 = getTree(db, pmRev1)
createVersion(db, { id: 'pm-v2', documentId: PM_ID, name: 'Version 2.0 (draft)', description: '2025 annual policy review', forkedFrom: pmRev1, createdBy: users.alice, kind: 'version' })
const pmRev2 = createInitialRevision(db, {
  versionId: 'pm-v2', parentId: pmRev1, message: 'Fork: Version 2.0 working', createdBy: users.alice,
  entries: pmTree1.map(e => ({ path: e.path, nodeId: e.node_id, parentPath: e.parent_path, sortKey: e.sort_key, marker: e.marker, depth: e.depth })),
})
console.log('PM Rev 2: Fork pm-v2 from pm-v1')

const pmFork = (id, name, description, sourceRevId, createdBy, parentVersionId) => {
  createVersion(db, { id, documentId: PM_ID, name, description, forkedFrom: sourceRevId, createdBy, kind: 'branch', parentVersionId })
  const tree = getTree(db, sourceRevId)
  return createInitialRevision(db, {
    versionId: id, parentId: sourceRevId, message: `Fork: ${name}`, createdBy,
    entries: tree.map(e => ({ path: e.path, nodeId: e.node_id, parentPath: e.parent_path, sortKey: e.sort_key, marker: e.marker, depth: e.depth })),
  })
}

const pmEdit = (versionId, parentRevId, nodePath, parentPath, sortKey, marker, depth, caption, body, message, createdBy) => {
  const nodeId = node(caption, body)
  return createRevision(db, {
    versionId, parentId: parentRevId, message, createdBy,
    entries: [{ path: nodePath, nodeId, parentPath, sortKey, marker, depth }],
  })
}

// Branch 1: Compensation update (fully through pipeline — approved)
const pmBr1 = pmFork('pm-comp-update', 'Compensation Update 2025', 'Annual COLA and benefits review', pmRev2, users.carol, 'pm-v2')
const pmBr1r1 = pmEdit('pm-comp-update', pmBr1, 'root/2000/201', 'root/2000', 0, '2-1', 2,
  '2.01 Pay Schedule',
  'Town employees are paid bi-weekly. The pay period ends on Saturday; paychecks are issued the following Friday. Direct deposit is required for all new employees hired after January 1, 2025.',
  'Require direct deposit for new hires', users.carol)
const pmBr1r2 = pmEdit('pm-comp-update', pmBr1r1, 'root/2000/203', 'root/2000', 2, '2-3', 2,
  '2.03 Health Insurance',
  'Full-time employees working 30 or more hours per week are eligible for the Town health insurance plan. The Town contributes 80% of the employee-only premium, effective January 1, 2025.',
  'Increase Town health insurance contribution to 80%', users.carol)
advanceWorkflow('pm-comp-update', null, 'draft', users.carol, 'Compensation changes ready for review')
advanceWorkflow('pm-comp-update', 'draft', 'committee-review', users.carol, 'Compensation and benefits updates submitted')
advanceWorkflow('pm-comp-update', 'committee-review', 'first-reading', users.alice, 'Compensation update approved for first reading')
advanceWorkflow('pm-comp-update', 'first-reading', 'second-reading', users.alice, 'No objections at first reading; proceeding to second reading')
advanceWorkflow('pm-comp-update', 'second-reading', 'approved', users.alice, 'Compensation Update 2025 approved unanimously')
console.log('PM: Compensation Update branch — approved')

// Branch 2: Conduct policy modernization (at second-reading)
const pmBr2 = pmFork('pm-conduct-update', 'Conduct Policy Update', 'Modernize harassment and social media policies', pmRev2, users.dave, 'pm-v2')
const pmBr2r1 = pmEdit('pm-conduct-update', pmBr2, 'root/3000/302', 'root/3000', 1, '3-2', 2,
  '3.02 Harassment and Discrimination',
  'The Town prohibits all forms of harassment and discrimination. This includes workplace bullying and retaliation against employees who report violations. Complaints shall be investigated within 30 days.',
  'Add anti-retaliation clause and 30-day investigation requirement', users.dave)
const pmBr2r2 = pmEdit('pm-conduct-update', pmBr2r1, 'root/3000/303', 'root/3000', 2, '3-3', 2,
  '3.03 Social Media Policy',
  'Employees shall not post content that discloses confidential Town information, disparages the Town, or could be construed as an official Town statement. Violations may result in discipline up to and including termination.',
  'Add explicit discipline clause to social media policy', users.dave)
advanceWorkflow('pm-conduct-update', null, 'draft', users.dave, 'Conduct policy modernization ready for review')
advanceWorkflow('pm-conduct-update', 'draft', 'committee-review', users.dave, 'Updated harassment and social media policies submitted')
advanceWorkflow('pm-conduct-update', 'committee-review', 'first-reading', users.alice, 'Conduct policies approved for first reading')
advanceWorkflow('pm-conduct-update', 'first-reading', 'second-reading', users.alice, 'First reading passed; one amendment requested')
console.log('PM: Conduct Policy Update branch — at second-reading')

// Branch 3: Leave policy expansion (at first-reading)
const pmBr3 = pmFork('pm-leave-expansion', 'Leave Policy Expansion', 'Add bereavement and jury duty leave', pmRev2, users.edward, 'pm-v2')
const bereavementNode = node('4.04 Bereavement Leave', 'Employees shall be granted up to three paid days of bereavement leave upon the death of an immediate family member (spouse, child, parent, sibling, or grandparent). One additional day is granted for travel exceeding 100 miles.')
const juryNode = node('4.05 Jury Duty Leave', 'Employees summoned for jury duty shall be granted paid leave for the duration of their service, not to exceed 30 days per calendar year. Employees must provide the Town with a copy of the jury summons.')
const pmBr3r1 = createRevision(db, {
  versionId: 'pm-leave-expansion', parentId: pmBr3, message: 'Add bereavement leave policy',
  createdBy: users.edward,
  entries: [{ path: 'root/4000/404', nodeId: bereavementNode, parentPath: 'root/4000', sortKey: 3, marker: '4-4', depth: 2 }],
})
const pmBr3r2 = createRevision(db, {
  versionId: 'pm-leave-expansion', parentId: pmBr3r1, message: 'Add jury duty leave policy',
  createdBy: users.edward,
  entries: [{ path: 'root/4000/405', nodeId: juryNode, parentPath: 'root/4000', sortKey: 4, marker: '4-5', depth: 2 }],
})
advanceWorkflow('pm-leave-expansion', null, 'draft', users.edward, 'New leave policies drafted')
advanceWorkflow('pm-leave-expansion', 'draft', 'committee-review', users.edward, 'Bereavement and jury duty leave policies submitted for review')
advanceWorkflow('pm-leave-expansion', 'committee-review', 'first-reading', users.alice, 'Leave expansion approved for first reading')
console.log('PM: Leave Policy Expansion branch — at first-reading')

// Branch 4: Background check revision (at committee-review)
const pmBr4 = pmFork('pm-background-check', 'Background Check Update', 'Expand background check scope', pmRev2, users.carol, 'pm-v2')
const pmBr4r1 = pmEdit('pm-background-check', pmBr4, 'root/1000/103', 'root/1000', 2, '1-3', 2,
  '1.03 Background Checks',
  'All new hires, volunteers in positions of trust, and contractors with unescorted access to Town facilities shall be subject to a CORI and SORI background check prior to commencement of duties. Checks shall be renewed every three years.',
  'Expand background checks to contractors; add renewal requirement', users.carol)
advanceWorkflow('pm-background-check', null, 'draft', users.carol, 'Background check policy revision drafted')
advanceWorkflow('pm-background-check', 'draft', 'committee-review', users.carol, 'Expanded background check policy submitted')
console.log('PM: Background Check Update branch — at committee-review')

// Branch 5: FMLA update (still in draft)
const pmBr5 = pmFork('pm-fmla-update', 'FMLA Update', 'Align with state PFML law', pmRev2, users.frannie, 'pm-v2')
const pmBr5r1 = pmEdit('pm-fmla-update', pmBr5, 'root/4000/403', 'root/4000', 2, '4-3', 2,
  '4.03 Family and Medical Leave',
  'Employees who have completed 12 months of service and worked at least 1,250 hours in the past year are eligible for up to 12 weeks of unpaid Federal Family and Medical Leave. Employees may also be eligible for paid leave under the Massachusetts Paid Family and Medical Leave (PFML) program.',
  'Add reference to Massachusetts PFML program', users.frannie)
advanceWorkflow('pm-fmla-update', null, 'draft', users.frannie, 'FMLA/PFML alignment draft in progress')
console.log('PM: FMLA Update branch — in draft')

// Branch 6: At-will employment revision — rejected
const pmBr6 = pmFork('pm-at-will-revision', 'At-Will Revision', 'Remove at-will clause for senior staff', pmRev2, users.bob, 'pm-v2')
const pmBr6r1 = pmEdit('pm-at-will-revision', pmBr6, 'root/1000/102', 'root/1000', 1, '1-2', 2,
  '1.02 Employment Status',
  'Department heads and senior administrators shall serve under written contracts with defined terms and may only be terminated for cause as defined in their individual contracts.',
  'Convert senior staff to contract employment', users.bob)
advanceWorkflow('pm-at-will-revision', null, 'draft', users.bob, 'Proposal to convert senior staff to contract employment')
advanceWorkflow('pm-at-will-revision', 'draft', 'committee-review', users.bob, 'At-will revision submitted for consideration')
advanceWorkflow('pm-at-will-revision', 'committee-review', 'first-reading', users.alice, 'Advancing for first reading to allow public comment')
advanceWorkflow('pm-at-will-revision', 'first-reading', 'second-reading', users.alice, 'First reading complete; proceeding to second reading')
advanceWorkflow('pm-at-will-revision', 'second-reading', 'rejected', users.alice, 'Rejected: legal counsel advises significant liability exposure; recommend returning to at-will model')
console.log('PM: At-Will Revision branch — rejected')

console.log('\nPolicy manual complete.')

// ============================================================
// Summary
// ============================================================

for (const docId of [DOC_ID, PM_ID]) {
  const allRevs = db.prepare(`
    SELECT r.seq, r.message, v.name as version, r.merge_sources
    FROM revisions r JOIN versions v ON v.id = r.version_id
    WHERE v.document_id = ? ORDER BY r.seq
  `).all(docId)
  console.log(`\n=== ${docId}: ${allRevs.length} revisions ===`)
  for (const r of allRevs) {
    const merge = r.merge_sources ? ' [MERGE]' : ''
    console.log(`  Rev ${r.seq}: ${r.version} — ${r.message}${merge}`)
  }
}

const wfBranches = db.prepare(`
  SELECT v.id, v.name, v.workflow_status, d.title as doc
  FROM versions v JOIN documents d ON d.id = v.document_id
  WHERE v.kind = 'branch' AND v.workflow_status IS NOT NULL
  ORDER BY d.id, v.workflow_status
`).all()
console.log(`\nWorkflow statuses (${wfBranches.length} branches with status):`)
for (const b of wfBranches) console.log(`  [${b.workflow_status}] ${b.doc}: ${b.name}`)

console.log('\nSeed complete.')
db.close()
