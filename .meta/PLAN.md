Articulate -- Implementation Plan
==================================

Articulate is a collaborative editing tool for hierarchical legal and policy documents. It is **not** the canonical home of those documents -- it is the workspace where teams draft, review, compare, and merge changes. The official documents are *generated* from Articulate as exports (HTML, TiddlyWiki, Word) and live in whatever format the organization requires.



1. Data Model
-------------


### 1.1 Core Concepts ###

The system models hierarchical legal/policy documents as trees of **nodes**. Changes are tracked through **versions** (branches) containing **revisions** (immutable snapshots). This mirrors a git-like model: versions are branches, revisions are commits.

**Key insight from the reference projects**: The Andover Charter uses a 4-level fixed hierarchy (Charter > Chapter > Section > Subsection > Sub-subsection) with fields like `chapter`, `section`, `subsection`, `sub-subsection` on each tiddler. The RHAM policy manual uses a more flexible parenthesized-path naming convention (`Policy1331(s2)(A)`) where parent-child relationships are derived from title prefixes -- a child is any tiddler whose title equals the parent's title plus `(marker)`. Articulate should generalize the RHAM approach: arbitrary-depth nesting expressed through a path of segments, with parent-child relationships stored explicitly in the database rather than derived from naming conventions.


### 1.2 SQLite Schema ###

```sql
-- The document itself (one per deployment initially, but multi-document ready)
CREATE TABLE documents (
  id          TEXT PRIMARY KEY,          -- e.g., 'Andover2027Charter'
  title       TEXT NOT NULL,
  created_at  TEXT NOT NULL DEFAULT (datetime('now')),
  metadata    TEXT                       -- JSON blob for arbitrary doc-level config
);

-- A node is one semantic unit of content (section, subsection, clause, etc.)
-- Nodes are IMMUTABLE once part of a published revision.
-- Content-addressed by hash for structural sharing across revisions.
CREATE TABLE nodes (
  id          TEXT PRIMARY KEY,          -- content-hash (SHA-256 of canonical form)
  body        TEXT NOT NULL,             -- the actual text content (Markdown or plain text)
  caption     TEXT NOT NULL DEFAULT '',  -- display title, e.g., "Board of Selectmen"
  node_type   TEXT NOT NULL DEFAULT 'section',  -- 'section', 'clause', 'definition', etc.
  metadata    TEXT                       -- JSON: display-style, annotations, etc.
);

-- A tree snapshot: one row per node-in-a-tree.
-- This is the adjacency list for a particular revision's document tree.
-- Structural sharing: if a subtree is unchanged between revisions,
-- the same node IDs appear in both revisions' tree_entries.
CREATE TABLE tree_entries (
  revision_id TEXT NOT NULL REFERENCES revisions(id),
  path        TEXT NOT NULL,             -- e.g., 'ch2/s203/C/3' -- slash-delimited path
  node_id     TEXT NOT NULL REFERENCES nodes(id),
  parent_path TEXT,                      -- e.g., 'ch2/s203/C' (NULL for root)
  sort_key    INTEGER NOT NULL,          -- ordering among siblings
  marker      TEXT NOT NULL DEFAULT '',  -- display marker: 'A', 's2', '3', 'III', etc.
  depth       INTEGER NOT NULL,          -- 0 for root, 1 for chapters, etc.
  PRIMARY KEY (revision_id, path)
);
CREATE INDEX idx_tree_parent ON tree_entries(revision_id, parent_path);
CREATE INDEX idx_tree_node   ON tree_entries(node_id);

-- A version is a branch of work (a team's working copy)
CREATE TABLE versions (
  id          TEXT PRIMARY KEY,          -- slug, e.g., 'budget-rewrite'
  document_id TEXT NOT NULL REFERENCES documents(id),
  name        TEXT NOT NULL,
  description TEXT,
  created_at  TEXT NOT NULL DEFAULT (datetime('now')),
  created_by  TEXT,                      -- user ID
  forked_from TEXT REFERENCES revisions(id),  -- the revision this branch started from
  head_rev    TEXT REFERENCES revisions(id)   -- latest revision on this branch
);

-- A revision is an immutable snapshot of the full document tree
CREATE TABLE revisions (
  id          TEXT PRIMARY KEY,          -- ULID or UUID
  version_id  TEXT NOT NULL REFERENCES versions(id),
  parent_id   TEXT REFERENCES revisions(id),  -- previous revision in this version
  message     TEXT,                       -- commit-message-style summary
  created_at  TEXT NOT NULL DEFAULT (datetime('now')),
  created_by  TEXT,
  published   INTEGER NOT NULL DEFAULT 0, -- 0=draft, 1=published (immutable)
  merge_sources TEXT                      -- JSON array of revision IDs if this is a merge
);
CREATE INDEX idx_rev_version ON revisions(version_id);
CREATE INDEX idx_rev_parent  ON revisions(parent_id);

-- Users
CREATE TABLE users (
  id          TEXT PRIMARY KEY,
  username    TEXT UNIQUE NOT NULL,
  display_name TEXT,
  password_hash TEXT,                          -- nullable: only set for local auth
  oauth_provider TEXT,                         -- 'google', 'github', 'facebook', or NULL for local
  oauth_id   TEXT,                             -- provider-specific user ID
  role        TEXT NOT NULL DEFAULT 'viewer',  -- 'admin', 'editor', 'viewer'
  force_password_change INTEGER NOT NULL DEFAULT 0,  -- 1 for default admin and fresh invites
  created_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Invite tokens (one-time links for user onboarding and password recovery)
CREATE TABLE invite_tokens (
  token       TEXT PRIMARY KEY,               -- random URL-safe token
  role        TEXT NOT NULL DEFAULT 'editor',  -- role assigned on acceptance
  created_by  TEXT NOT NULL REFERENCES users(id),
  expires_at  TEXT NOT NULL,
  used_at     TEXT,                            -- NULL until redeemed
  used_by     TEXT REFERENCES users(id)        -- user created from this invite
);

-- Team membership -- which users can see/edit which versions
CREATE TABLE version_members (
  version_id  TEXT NOT NULL REFERENCES versions(id),
  user_id     TEXT NOT NULL REFERENCES users(id),
  role        TEXT NOT NULL DEFAULT 'editor',  -- 'editor' or 'viewer'
  PRIMARY KEY (version_id, user_id)
);

-- Comments (tied to version + path, persist across revisions within a version)
CREATE TABLE comments (
  id          TEXT PRIMARY KEY,
  version_id  TEXT NOT NULL REFERENCES versions(id),
  path        TEXT NOT NULL,             -- node path the comment is attached to
  user_id     TEXT NOT NULL REFERENCES users(id),
  body        TEXT NOT NULL,
  parent_id   TEXT REFERENCES comments(id),  -- for threading
  resolved    INTEGER NOT NULL DEFAULT 0,
  created_at  TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at  TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX idx_comments_version_path ON comments(version_id, path);

-- Edit locks (advisory, for conflict prevention -- not real-time)
CREATE TABLE edit_locks (
  revision_id TEXT NOT NULL,
  path        TEXT NOT NULL,
  user_id     TEXT NOT NULL REFERENCES users(id),
  acquired_at TEXT NOT NULL DEFAULT (datetime('now')),
  expires_at  TEXT NOT NULL,
  PRIMARY KEY (revision_id, path)
);
```


### 1.3 Tree Snapshot Strategy: Structural Sharing ###

The critical design decision is how to store tree snapshots efficiently.

**Chosen approach: Content-addressed nodes + per-revision adjacency list.**

- Each `node` is identified by a hash of its content. If two revisions contain the same text for Section 203C, they reference the same `node` row.
- The `tree_entries` table records the structure (parent-child, ordering) per revision. When a revision changes only 3 nodes out of 250, the new revision's `tree_entries` are created by copying the unchanged rows and inserting/updating the changed ones.
- This is a "copy-on-write adjacency list" -- simple to query, simple to diff, and the duplication is only in the lightweight `tree_entries` rows (path + foreign key), not the content.

**Why not a Merkle tree?** A Merkle tree (where each internal node's hash includes its children's hashes) would give efficient change detection but makes queries like "give me the children of this path" require recursive lookups. The adjacency list approach with indexed `parent_path` is simpler for SQL and perfectly adequate for documents with at most a few hundred nodes.

**Storage estimate**: The Andover Charter has ~253 section tiddlers. At ~10 revisions across 5 versions, that is roughly 253 x 50 = 12,650 `tree_entries` rows -- trivial for SQLite.


### 1.4 Path Convention ###

Paths use slash-delimited segments derived from the document's natural hierarchy. For the Andover Charter:
- `ch1` (Chapter 1)
- `ch2/s203` (Section 203)
- `ch2/s203/C` (Subsection C)
- `ch2/s203/C/3` (Sub-subsection 3)

For the RHAM policy manual (single-policy deployment):
- `s1` (Section 1)
- `s2` (Section 2)
- `s2/A` (Subsection A)

The `marker` field on each `tree_entry` preserves the display label (e.g., `A`, `III`, `s2`, `1`), which may differ from the path segment. Path segments are URL-safe slugified versions of markers.



2. API Design
-------------

All endpoints are prefixed with `/api/v1`. Responses are JSON. Authentication via session cookies (simple for self-hosted).


### 2.1 Documents ###

```
GET    /api/v1/documents                     -- list all documents
GET    /api/v1/documents/:docId              -- get document metadata
POST   /api/v1/documents                     -- create document (admin)
```


### 2.2 Versions (Branches) ###

```
GET    /api/v1/documents/:docId/versions                     -- list versions
GET    /api/v1/documents/:docId/versions/:versionId          -- version detail + head revision
POST   /api/v1/documents/:docId/versions                     -- create version (fork from a revision)
         body: { name, description, forkedFrom: revisionId }
PATCH  /api/v1/documents/:docId/versions/:versionId          -- update name/description
```


### 2.3 Revisions ###

```
GET    /api/v1/versions/:versionId/revisions                 -- list revisions in version
GET    /api/v1/revisions/:revisionId                         -- revision metadata
POST   /api/v1/versions/:versionId/revisions                 -- create new revision
         body: { message, parentId, changes: [...] }
PATCH  /api/v1/revisions/:revisionId/publish                 -- publish (make immutable)
```


### 2.4 Tree & Nodes ###

```
GET    /api/v1/revisions/:revisionId/tree                    -- full tree structure (no content)
GET    /api/v1/revisions/:revisionId/tree/:path              -- subtree at path
GET    /api/v1/revisions/:revisionId/nodes/:path             -- node content at path
GET    /api/v1/revisions/:revisionId/nodes/:path/context     -- node + siblings + parent (for editing view)
PUT    /api/v1/revisions/:revisionId/nodes/:path             -- update node content (creates new draft revision)
         body: { body, caption, metadata }
POST   /api/v1/revisions/:revisionId/nodes/:path/children    -- add child node
DELETE /api/v1/revisions/:revisionId/nodes/:path             -- remove node (and children)
POST   /api/v1/revisions/:revisionId/nodes/:path/move        -- reorder/reparent
         body: { newParentPath, newSortKey }
```


### 2.5 Diff & Merge ###

```
GET    /api/v1/diff?from=:revId1&to=:revId2                 -- two-way diff
         returns: { added: [...], removed: [...], modified: [{path, wordDiff}], moved: [...] }
GET    /api/v1/diff/common-ancestor?revs=:revId1,:revId2    -- find common ancestor revision
POST   /api/v1/merge                                         -- create merge revision
         body: { targetVersionId, sources: [{revisionId, paths: [...]}], ancestor: revId, message }
```


### 2.6 Import/Export ###

```
POST   /api/v1/documents/:docId/import                        -- import from canonical JSON format
         body: JSON document matching the import schema (Section 6.2)
GET    /api/v1/revisions/:revisionId/export/html              -- single-file HTML export
GET    /api/v1/revisions/:revisionId/export/tiddlywiki        -- single-file TiddlyWiki export
GET    /api/v1/revisions/:revisionId/export/docx              -- Word document export
GET    /api/v1/diff/:revId1/:revId2/export/html               -- comparison HTML export
```


### 2.7 Auth ###

```
GET    /api/v1/auth/providers                -- list available OAuth providers
GET    /api/v1/auth/:provider                -- initiate OAuth flow (redirect)
GET    /api/v1/auth/:provider/callback       -- OAuth callback
POST   /api/v1/auth/local/login              -- local fallback: { username, password } -> session cookie
POST   /api/v1/auth/logout
GET    /api/v1/auth/me                        -- current user info
PATCH  /api/v1/auth/password                  -- change password (required on first login when force_password_change)
POST   /api/v1/invites                        -- generate invite link (admin)
         body: { role }
GET    /api/v1/invites                        -- list active invites (admin)
DELETE /api/v1/invites/:token                 -- revoke invite (admin)
POST   /api/v1/invites/:token/accept          -- redeem invite: { username, displayName, password }
POST   /api/v1/users                          -- create user (admin)
PATCH  /api/v1/users/:userId                  -- update user
```


### 2.8 Comments ###

```
GET    /api/v1/versions/:versionId/comments                   -- all comments in version
GET    /api/v1/versions/:versionId/comments/:path             -- comments on a specific node
POST   /api/v1/versions/:versionId/comments/:path             -- add comment
         body: { body, parentCommentId? }
PATCH  /api/v1/comments/:commentId                            -- edit or resolve a comment
         body: { body?, resolved? }
DELETE /api/v1/comments/:commentId                            -- delete comment (author or admin)
```


### 2.9 History (DAG) ###

```
GET    /api/v1/documents/:docId/history       -- full revision DAG for branch visualization
         returns: { nodes: [{id, versionId, parentId, mergeSources, published, createdAt}], edges: [...] }
```



3. Frontend Architecture
------------------------


### 3.1 Technology Choice ###

**Preact** with **HTM** (tagged template literals instead of JSX -- no build step required for development, though a simple bundler will be used for production). Preact signals for state management. This keeps the stack lightweight and aligns with the functional JS preference.


### 3.2 Routing ###

URL structure mirrors the bookmarkable requirement:

```
/:docId                                       -- document overview, version list
/:docId/:versionSlug                          -- latest revision of version
/:docId/:versionSlug/rev/:revNum              -- specific revision
/:docId/:versionSlug/rev/:revNum/:path...     -- specific node within revision
/:docId/compare/:revId1/:revId2              -- diff view
/:docId/merge                                 -- merge workspace
/:docId/history                               -- DAG visualization
```

A lightweight router (e.g., `preact-router` or a custom ~50-line hash/history router) maps these to page components.


### 3.3 Component Hierarchy ###

```
App
  TopBar                    -- document title, user menu, version selector
  Router
    DocumentOverview        -- version list, DAG mini-view
    RevisionView            -- the main editing/reading view
      TreeSidebar           -- collapsible outline navigator (always visible)
      ContentArea
        NodeBreadcrumbs     -- ch2 > s203 > C > 3
        NodeContextView     -- parent node + siblings in read-only
          NodeReadOnly      -- rendered node content
          NodeEditor        -- textarea/contenteditable for the active node
            EditorToolbar   -- bold, italic, cross-ref insertion, etc.
        NodeChildren        -- child nodes in read-only below the edited node
    DiffView
      DiffHeader            -- revision selectors, toggle inline/side-by-side
      DiffTree              -- structural diff (added/removed/moved nodes)
      DiffContent           -- word-level diff within changed nodes
    MergeWorkspace
      AncestorSelector      -- pick common ancestor
      SourcePanel(s)        -- one per source revision, checkboxes per node
      MergePreview          -- live preview of merged result
      ConflictResolver      -- when same node changed in multiple sources
    HistoryGraph            -- SVG/Canvas DAG visualization
    CommentPanel            -- threaded comments on the current node
      CommentThread         -- single thread with replies
      CommentEditor         -- new comment / reply form
      ReviewStatus          -- per-node approve/request-changes indicators
    DocsPage                -- in-app documentation viewer
      DocsSidebar           -- TOC tree navigation
      DocsContent           -- rendered Markdown content panel
    LoginPage               -- OAuth provider selection + optional local login
    AdminPanel              -- user management, version permissions
```


### 3.4 State Management ###

Use Preact signals for reactive state:

```js
// Global application state
const appState = {
  currentDoc: signal(null),
  currentVersion: signal(null),
  currentRevision: signal(null),
  currentPath: signal(null),
  editingPath: signal(null),       // which node is in edit mode (null = read-only)
  treeData: signal(null),          // cached tree structure
  dirtyNodes: signal(new Map()),   // unsaved edits: path -> {body, caption}
  user: signal(null),
}
```

The "one-click to switch editing" behavior: clicking any node's marker/header in the context view sets `editingPath` to that node's path. The previous node's edits are auto-saved (optimistic PUT to the API, with the response creating a new draft revision under the hood).


### 3.5 Editing Model ###

Editing happens on **unpublished revisions** only. When a user edits a node:

1. Frontend PUTs the change to the API.
2. Backend creates a new `node` row (content-addressed), creates a new `revision` row (child of current), copies `tree_entries` from parent revision with the changed entry updated, and advances the version's `head_rev`.
3. This is invisible to the user -- they see a continuous editing session. The revision chain is auto-compacted when the user explicitly "saves" or "publishes" (squash intermediate auto-save revisions into one).

This gives undo-for-free (revert to any prior auto-save revision) without burdening the user with manual save points.



4. Implementation Milestones
-----------------------------


### Milestone 0: Project Skeleton (1 week) ###

- Initialize Node.js project with ESM modules
- Set up directory structure: `src/server/`, `src/client/`, `src/shared/`, `scripts/`, `docs/`
- SQLite setup with `better-sqlite3` (synchronous, fast, no async complexity)
- Basic Express server with static file serving
- Preact + HTM client build pipeline (esbuild -- fast, zero-config)
- Dev server with live reload
- Scaffold `docs/` directory with initial structure (see Section 11)
- Docs server route: `/api/v1/docs` serving tree, content, and static assets from `docs/`
- Initial documentation: project overview (`index.md`), architecture overview, tech stack, and coding standards

**Dependencies**: None.


### Milestone 1: Data Model & Core API (2 weeks) ###

- Implement all SQLite tables and migrations
- Database access layer: pure functions, no ORM -- `db.getTree(revisionId)`, `db.createNode(body, caption)`, etc.
- Content hashing for nodes
- Revision creation with tree_entries copy-on-write
- REST endpoints for documents, versions, revisions, tree, nodes
- Seed script that creates a sample document manually
- API tests using Node's built-in test runner
- **Docs**: Write Data Model guide (schema, content addressing, structural sharing), API Reference for documents/versions/revisions/tree/nodes endpoints

**Dependencies**: Milestone 0.


### Milestone 2: Import (1 week) ###

- Canonical JSON import handler: validate and ingest the import format (Section 6.2)
- TiddlyWiki `.tid` file parser (shared utility for reference conversions)
- TiddlyWiki-to-Markdown markup converter (strip macros/widgets, convert formatting)
- Reference conversion scripts: Andover Charter and RHAM Policy Manual (in `scripts/`)
- Creates initial document + version ("original") + published revision from imported data
- **Docs**: Write Import guide covering the canonical format, reference conversion patterns, and guidance for converting from other sources (Word, AI-assisted)

**Dependencies**: Milestone 1.


### Milestone 3: Document Tree View & Reading Mode (2 weeks) ###

- TreeSidebar component: collapsible outline, highlights current node
- Router implementation with bookmarkable URLs
- NodeContextView: renders parent + siblings + children around the focused node
- NodeBreadcrumbs
- Basic CSS layout (sidebar + content area)
- Markdown rendering for node bodies (using a lightweight library like `marked` or `markdown-it`)
- In-app docs viewer component with sidebar TOC and content panel (served from the docs API route)
- **Docs**: Write Users Guide "Getting Started" and "Navigating Documents"; update Architecture doc with client-side component structure

**Dependencies**: Milestone 1 (API must be working). Milestone 2 is helpful for real data but not strictly required.


### Milestone 4: In-Context Editing (2 weeks) ###

- NodeEditor component with textarea and basic toolbar
- One-click editing switch between sibling/child nodes
- Auto-save to API (debounced, creates revision chain)
- Edit lock acquisition/release (advisory)
- Add/remove/reorder nodes in the tree
- Marker auto-increment (port `next-marker.js` logic from the RHAM plugin)
- Revision save/publish workflow (squash auto-saves, add message, publish)
- Shortcode rendering pipeline: pluggable registry, built-in shortcodes for cross-references and basic computed content (Section 5.8)
- **Docs**: Write Users Guide "Editing" (editing workflow, auto-save, publishing, shortcodes); Developer Guide "Revision Chain" (auto-save squashing, content addressing)

**Dependencies**: Milestone 3.


### Milestone 5: Two-Way Diff (2 weeks) ###

- Tree-level diff algorithm: compare two revisions' `tree_entries` to find added, removed, modified, and moved nodes
- Word-level diff within modified nodes (use `diff-match-patch` library or similar)
- DiffView component: side-by-side and inline modes
- Revision selector UI (pick any two revisions to compare)
- URL-addressable diffs (`/:docId/compare/:revId1/:revId2`)
- **Docs**: Write Users Guide "Comparing Revisions"; Developer Guide "Diff Algorithm" (structural diff, word-level diff, move detection)

**Dependencies**: Milestone 3 (needs node rendering). The diff algorithm work can begin in parallel with Milestone 4.


### Milestone 6: Branching & Permissions (2 weeks) ###

- Version creation UI (fork from a published revision)
- Auth system: OAuth providers (Google, GitHub, Facebook) via Passport.js, with local-password fallback (bcrypt) for air-gapped deployments
- Bootstrap flow: default admin account with forced password change on first login
- Invite system: admin generates one-time invite links (with role), invite page for choosing username/password
- Session management (express-session with SQLite store)
- Login page with provider selection and optional local login
- Middleware for route protection
- Version membership management
- Published vs. unpublished revision visibility rules
- **Docs**: Write Users Guide "Branching" (creating versions, forking, permissions); Admin Guide for user management and invites; API Reference for auth, invite, and version membership endpoints

**Dependencies**: Milestone 1 (API). Can be developed in parallel with Milestones 3-5 on the backend side.

_Deferred: SMTP integration for automated invite emails and self-service password reset. The invite-link mechanism is designed so that adding email delivery later requires no changes to the token or acceptance flow._


### Milestone 7: Multi-Way Merge (2.5 weeks) ###

- Common ancestor finding (walk revision DAG backwards to find LCA)
- Three-way diff: ancestor vs. source A, ancestor vs. source B
- MergeWorkspace UI: select source revisions, pick per-node which source to take
- Conflict detection (same node modified in multiple sources)
- ConflictResolver component
- Merge preview (live rendering of the result)
- Merge commit creation (new revision with `merge_sources` populated)
- **Docs**: Write Users Guide "Merging" (merge workflow, conflict resolution); Developer Guide "Merge Algorithm" (LCA finding, three-way diff, conflict detection)

**Dependencies**: Milestone 5 (diff algorithm), Milestone 6 (branching).


### Milestone 7.5: Commenting & Review (1.5 weeks) ###

- New `comments` table: tied to a version + node path (comments persist across revisions within a version, not tied to a single revision)
- Threaded comments on any node
- Comment states: open, resolved
- Review workflow: per-node approve/request-changes, with roll-up status on the revision
- Notification indicators in the TreeSidebar (nodes with unresolved comments)
- **Docs**: Write Users Guide "Reviewing" (commenting, approving, resolving); API Reference for comment endpoints

**Dependencies**: Milestone 6 (auth and permissions). Can begin in parallel with Milestone 7.


### Milestone 8: Branch Visualization (1 week) ###

- DAG data structure from revision history
- SVG rendering of the branch/merge graph (use `dagre` or similar for layout, or a custom simple layout since these DAGs will be small)
- Interactive: click a revision node to navigate to it
- Color-code by version
- **Docs**: Write Users Guide "History" (reading the DAG, navigating revisions)

**Dependencies**: Milestone 6.


### Milestone 9: Branch-Centric Model (1.5 weeks) ###

Reframe the system so that **versions** are stable trunks and **branches** are where all work happens. Revisions remain the immutable plumbing but recede from the default UI. A version only advances via merges from branches (admin-only).

**Schema changes:**
- Add `parent_version_id` column to `versions` — the version or branch this was forked from (as opposed to `forked_from`, which points to a specific revision). This gives a clean hierarchy: Version 2026 → Budget Subcommittee → Bob's Working.
- Use the existing `kind` column: `'version'` for top-level trunks, `'branch'` for working branches.

**Server changes:**
- Enforce that direct edits (node save, add child, delete) can only target a branch, not a version. Versions are read-only except via merge.
- Merge-into-version requires `requireAdmin` (or, later, the two-person proposal flow from Milestone 11).
- New endpoint or modification to existing: list branches for a version (`GET /versions/:id/branches`), with nesting.
- Fork endpoint creates a branch by default; creating a new top-level version is admin-only.

**Client changes — Document Overview:**
- Top-level shows versions (2021, 2026) as permanent landmarks.
- Under each version, show its branch tree — subcommittees, individual working branches.
- Each branch shows its tip state (latest revision), creator, and status (active / merged / stale).
- "Fork Branch" button on any branch or version.
- "Merge into Version" button (admin-only) on branches.

**Client changes — Branch View (replaces current RevisionView as default):**
- Default view shows the branch tip — the current state of the document tree.
- Editing happens here: the user edits "the branch," not "revision 14."
- Sidebar shows the branch name, fork point, and a compact summary (e.g., "3 revisions, last edited 2h ago").
- "History" is a drill-down that expands to show individual revisions, diffs between them, etc.

**Client changes — Revision History (secondary view):**
- Accessible from the branch view via a "Show history" or "Revisions" link.
- Timeline of revisions within the branch, with messages and diffs.
- Still navigable — you can view any past revision — but it's not the entry point.

**Branch DAG updates:**
- The existing DAG visualization (Milestone 8) should group revisions by branch, showing branches as lanes with merge arrows between them.
- Collapsible: by default show branch-level nodes (each branch as one item), expand to see individual revisions.

**Seed script:**
- Update to set `kind = 'branch'` and `parent_version_id` on working branches.
- Top-level versions (v2021, v2026) remain `kind = 'version'`.

**Dependencies**: Milestone 8 (auth — needed for admin-only merge-to-version).


### Milestone 10: Export (2.5 weeks) ###

- **HTML export**: server-side rendering into a standalone HTML file with inlined CSS, table of contents, anchor-linked cross-references
- **TiddlyWiki export**: generate a single-file TW with document tiddlers tagged `articulate-doc`, read-only template, round-trip-ready field conventions
- **Word (.docx) export**: heading-level mapping, TOC, marker/caption headers, basic Markdown formatting preserved
- **Comparison HTML export**: two-revision diff with side-by-side/inline toggle (CSS-only, no JS)
- Download endpoints + UI for all formats
- TW re-import converter script (`scripts/convert-tw.js`)
- **Docs**: Write Users Guide "Exporting" (all formats, comparison exports, round-tripping via TW)

**Dependencies**: Milestone 3 (rendering), Milestone 5 (diff rendering for comparison exports).


### Milestone 11: Polish & Hardening (1-2 weeks) ###

- Error handling throughout
- Loading states, optimistic UI
- Mobile-responsive layout
- Keyboard shortcuts (navigate tree, save, switch editing node)
- Print stylesheet
- Docker configuration
- **Two-person version lock/unlock**: Replace direct lock/unlock with a proposal-approval flow. A `proposals` table tracks requests (lock, unlock, potentially other privileged actions). The proposer cannot also approve. Hybrid role model: admins can propose/approve globally; version members with an "owner" role can propose/approve for their own versions. Notification via a lightweight inbox query on session restore (TopBar badge). No websockets needed.
- **Docs**: Write Deployment guide (Docker, manual setup); full review and update pass across all docs; ensure cross-references are consistent

**Dependencies**: All previous milestones.

**Total estimated timeline: 19-23 weeks** for a solo developer working part-time, or 10-12 weeks full-time.



5. Key Technical Decisions and Trade-offs
-----------------------------------------


### 5.1 Content-Addressed Nodes vs. Mutable Rows ###

**Decision**: Content-addressed (hash-based IDs).

**Trade-off**: Slightly more complex write path (hash the content, check if node already exists, create if not) but huge storage wins when the same content appears across revisions, and enables cheap equality checks during diffing. If two revisions point to the same `node_id` at the same `path`, that node is definitively unchanged -- no content comparison needed.


### 5.2 Full Tree Copy vs. Delta Storage for Revisions ###

**Decision**: Full copy of `tree_entries` per revision (with shared `node_id` references).

**Trade-off**: More rows in `tree_entries` (N_nodes x N_revisions) but dead-simple queries. For a 250-node document with 100 total revisions, that is 25,000 rows -- SQLite handles millions without breaking a sweat. Delta storage (storing only changes) would save space but make every tree query require reconstructing from a chain of deltas -- an unnecessary complication.


### 5.3 Markdown vs. Rich Text vs. Plain Text ###

**Decision**: Markdown for node content, with a small set of Articulate-specific extensions (cross-references to other nodes via `[[path]]` syntax).

**Trade-off**: Markdown is familiar, diffable (it is plain text), and renders well. Legal documents sometimes need tables and precise formatting that Markdown handles adequately. A WYSIWYG editor could be added later as a Markdown-generating layer (e.g., Milkdown, Toast UI Editor), but the storage format should remain Markdown for diffability.


### 5.4 Auto-Save Revision Chain vs. Explicit Save ###

**Decision**: Auto-save creates a revision chain, which is squashed on explicit save/publish.

**Trade-off**: More revisions to manage, but the user never loses work and the squash step ensures the published history stays clean. The intermediate revisions can be garbage-collected after squash.


### 5.5 Server-Side Rendering for Export vs. Client-Side ###

**Decision**: Server-side. The export must produce a standalone HTML file. Using the same rendering logic (Markdown-to-HTML) on the server ensures consistent output. The server can inline styles and scripts to produce a truly self-contained file.


### 5.6 SQLite vs. PostgreSQL ###

**Decision**: SQLite via `better-sqlite3`.

**Trade-off**: Single-writer limitation is acceptable for a small-team collaboration tool (writes are serialized but fast). The simplicity of deployment (single file, no database server) is a major win for self-hosting. If scaling becomes necessary, the pure-function database layer makes swapping to PostgreSQL feasible.


### 5.7 Auth Strategy ###

**Decision**: OAuth providers (Google, GitHub, Facebook) via Passport.js, with session-based storage (`express-session` backed by SQLite). Local password auth as a fallback for air-gapped deployments.

**Bootstrap flow**: First launch creates a default admin account with a forced password-change on first login. The admin onboards users by generating one-time invite links (with a role assignment). The invite link leads to a "choose your password" page. No email infrastructure is required -- the admin copies the link and shares it however they like.

**Password reset**: Deferred. For now, an admin can generate a new invite link for a locked-out user (same mechanism, reused). When SMTP support is added later, it unlocks both automated invite emails and self-service password reset. The invite-link design means the email layer is just a delivery method for links that already exist.

**Trade-off**: OAuth adds a dependency on external providers and requires callback URL configuration, but eliminates the burden of password management for most users. Session-based storage keeps things simple for a single-server deployment. The local-password fallback (bcrypt) with invite links ensures the system works without external dependencies.


### 5.8 Extension / Shortcode System ###

**Decision**: A lightweight shortcode syntax (`{{macro-name arg1 arg2}}`) recognized by the Markdown rendering pipeline, with a pluggable registry of render functions. Ship a small set of built-ins (cross-references via `[[path]]` are already one; others might include conditional display, last-updated timestamps, computed section numbers). Defer a full plugin/extension API to post-v1.

**Trade-off**: A shortcode system is far simpler than a full plugin architecture but covers the most common extensibility needs for legal documents (dynamic references, computed content, conditional display). The registry design means adding new shortcodes later is just adding a function to a map, so the architecture doesn't need to change when a full extension system is designed.



6. The Import Story
-------------------


### 6.1 Design Philosophy ###

Articulate defines a **canonical JSON import format** (Section 6.2) as the single entry point for all document ingestion. Rather than building bespoke importers for every source format, the strategy is:

1. **Reference conversions** for the Andover Charter and RHAM Policy Manual (Section 6.3) serve as worked examples that document the patterns involved in converting hierarchical documents.
2. **Conversion guidance and tooling** (Section 6.4) helps users get their own documents into the import format, including helpers for well-structured Word documents and prompt templates for AI tools (Claude, etc.) that can generate the import JSON from arbitrary source formats.
3. **TiddlyWiki round-trip by convention**: Articulate's TW export (Section 7.2) tags document tiddlers with a consistent marker so that re-import is trivial -- a single TW filter selects all document tiddlers, and a lightweight converter produces the import JSON.

The goal is to make the import format well-documented and simple enough that conversion scripts are short, AI tools can generate it reliably, and human intervention is expected and manageable.


### 6.2 Canonical Import Format ###

```json
{
  "title": "Andover Town Charter 2027",
  "nodes": [
    {
      "path": "ch1",
      "caption": "Chapter I. Incorporation and General Powers",
      "body": "",
      "marker": "1",
      "children": [
        {
          "path": "ch1/s101",
          "caption": "Section 101. Incorporation",
          "body": "All of the inhabitants dwelling within...",
          "marker": "101"
        }
      ]
    }
  ]
}
```

The format is deliberately flat and explicit: every node declares its path, caption, body (Markdown), display marker, and children. No naming conventions or tag-based inference is required -- the hierarchy is spelled out.


### 6.3 Reference Conversions ###

The Andover Charter and RHAM Policy Manual serve as the two reference conversion examples, each illustrating a different pattern:

**Andover Charter** -- field-based hierarchy. Tiddlers carry explicit `chapter`, `section`, `subsection`, `sub-subsection` fields and level-specific tags. The conversion maps these fields to path segments (`ch{N}/s{NNN}/{sub}/{subsub}`), strips TiddlyWiki macro calls (`<<sections>>`, `<<subsections>>`), converts cross-reference macros to `[[path]]` links, and converts TiddlyWiki formatting (`''bold''`, `//italic//`) to Markdown.

**RHAM Policy Manual** -- prefix-based hierarchy. Parent-child relationships are derived from title prefixes (`Policy1331(s2)(A)` is a child of `Policy1331(s2)`). The conversion parses parenthesized markers into path segments and handles special sections (`(history)`, `(legal)`) as node metadata.

Both conversions are implemented as standalone scripts in `scripts/` and documented in the Developer Guide as patterns for others to follow.


### 6.4 Conversion Guidance ###

Beyond the reference scripts, the project provides:

- **Word document helpers**: A utility that reads a well-structured `.docx` file (using heading levels as hierarchy) and produces a draft import JSON. Human review and correction is expected -- automated conversion gets the structure roughly right, but legal documents often have quirks that require judgment.
- **AI prompt templates**: Documented prompts and Claude skill definitions that help AI tools read a source document (PDF, HTML, plain text, etc.) and generate the canonical import JSON. The import format is designed to be simple enough that an LLM can produce it reliably with a one-shot example.
- **TW re-import converter**: A small script that takes tiddlers exported from an Articulate-generated TiddlyWiki (selected by the `articulate-doc` tag) and converts them to import JSON. This is intentionally trivial because the TW export format (Section 7.2) is designed for round-tripping.



7. The Export Story
-------------------


### 7.1 Single-Revision HTML Export ###

Generate a standalone HTML file containing:

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>{Document Title} -- {Version Name} Rev {N}</title>
  <style>
    /* All CSS inlined here -- no external dependencies */
    /* Adapted from the charter's print stylesheet */
    body { font-family: Georgia, serif; max-width: 8.5in; margin: auto; }
    .node { margin-left: 1.5em; }
    .node-marker { float: left; padding-right: 0.5em; font-weight: bold; }
    .toc { /* ... */ }
    @media print { /* page breaks, headers, etc. */ }
  </style>
</head>
<body>
  <header>
    <h1>{Document Title}</h1>
    <p class="meta">Version: {name} | Revision {n} | {date} | Generated by Articulate</p>
  </header>
  <nav class="toc">
    <!-- Auto-generated table of contents with anchor links -->
  </nav>
  <main>
    <!-- Recursively rendered document tree -->
    <div class="node depth-0" id="ch1">
      <h2>Chapter I. Incorporation and General Powers</h2>
      <div class="node depth-1" id="ch1-s101">
        <h3>Section 101. Incorporation</h3>
        <div class="node-body"><p>All of the inhabitants...</p></div>
      </div>
    </div>
  </main>
  <footer>
    <p>Exported from Articulate on {date}</p>
  </footer>
</body>
</html>
```

Internal cross-references (`[[ch2/s203]]`) are converted to anchor links (`#ch2-s203`).


### 7.2 TiddlyWiki Export ###

Generate a single-file TiddlyWiki containing the document as tiddlers. The exported TW serves two purposes: (a) a read-only browsable document with a default template, and (b) a format designed for easy re-import into Articulate.

**Tiddler conventions for round-tripping**:
- Each node becomes a tiddler tagged `articulate-doc`
- Tiddler title follows the path convention (e.g., `ch2/s203/C`)
- Fields include `caption`, `marker`, `sort-key`, `depth`, `parent-path`
- Body is the node's Markdown content
- A root tiddler tagged `articulate-doc-root` carries document-level metadata (title, version, revision)

Re-import is trivial: filter `[tag[articulate-doc]]`, read the fields, and produce the canonical import JSON. A small converter script is provided (Section 6.4).

The exported TW includes a read-only template with a collapsible outline view, styled for the document type. No editing capabilities -- it is a publication format.


### 7.3 Word (.docx) Export ###

Generate a `.docx` file using a library like `docx`. This is the most familiar format for lawyers, committee members, and municipal staff. The export includes:

- Heading levels mapped from node depth
- Table of contents generated from the heading structure
- Markers and captions rendered as section headers
- Cross-references converted to Word internal bookmarks where possible, or plain text with section numbers
- Basic formatting preserved from Markdown (bold, italic, lists, tables)

Word export is one-directional -- there is no commitment to re-importing a Word file that has been edited externally, though the Word import helper (Section 6.4) can assist with structured documents.


### 7.4 Comparison HTML Export ###

A two-revision comparison export includes:

- A toggle (CSS-only, no JS required) between side-by-side and inline diff views
- Color-coded changes: green background for additions, red with strikethrough for deletions, yellow for modifications
- Word-level highlighting within modified nodes
- A summary section at the top listing all changed, added, and removed nodes
- Navigation links between changed sections

The CSS-only toggle uses a hidden checkbox + sibling selectors to switch between `display: flex` (side-by-side) and `display: block` (inline) on the diff container. This means the exported file requires zero JavaScript.


### 7.5 Export Implementation ###

The server renders exports using the same Markdown pipeline used for the web UI. Endpoints:

```
GET /api/v1/revisions/:revId/export/html
GET /api/v1/revisions/:revId/export/tiddlywiki
GET /api/v1/revisions/:revId/export/docx
GET /api/v1/diff/:revId1/:revId2/export/html
```



8. Directory Structure
----------------------

```
articulate/
  package.json
  esbuild.config.js          -- build configuration
  src/
    server/
      index.js               -- Express app setup, middleware
      db/
        migrations.js         -- schema creation/versioning
        documents.js          -- document CRUD
        versions.js           -- version CRUD
        revisions.js          -- revision creation, tree snapshots
        nodes.js              -- content-addressed node storage
        users.js              -- auth-related queries
        comments.js           -- comment CRUD, threading, resolution
        diff.js               -- tree diff computation
        merge.js              -- merge logic, LCA finding
      routes/
        documents.js
        versions.js
        revisions.js
        nodes.js
        diff.js
        merge.js
        auth.js
        comments.js
        docs.js               -- serves docs tree, content, and static assets
        export.js
      import/
        generic.js            -- canonical JSON import format handler
        tiddlywiki.js         -- .tid file parser (shared by reference conversions)
        markup.js             -- TiddlyWiki-to-Markdown converter
      export/
        html.js               -- single-file HTML renderer
        template.js           -- HTML template with inlined CSS
        diff-html.js          -- comparison HTML renderer
        tiddlywiki.js         -- single-file TiddlyWiki generator
        docx.js               -- Word document generator
      middleware/
        auth.js               -- session validation, role checks
        errors.js             -- error handling
    client/
      index.js                -- entry point, router setup
      app.js                  -- root App component
      state.js                -- Preact signals, global state
      router.js               -- lightweight URL router
      api.js                  -- fetch wrapper for API calls
      components/
        TopBar.js
        TreeSidebar.js
        NodeBreadcrumbs.js
        NodeContextView.js
        NodeReadOnly.js
        NodeEditor.js
        EditorToolbar.js
        DiffView.js
        DiffTree.js
        DiffContent.js
        MergeWorkspace.js
        SourcePanel.js
        ConflictResolver.js
        HistoryGraph.js
        CommentPanel.js
        CommentThread.js
        CommentEditor.js
        ReviewStatus.js
        DocsPage.js
        DocsSidebar.js
        DocsContent.js
        LoginPage.js
        VersionList.js
      lib/
        markdown.js           -- Markdown rendering with cross-ref extension
        diff.js               -- client-side word diff (for preview)
        dag-layout.js         -- DAG graph layout for history view
      styles/
        main.css
        tree.css
        editor.css
        diff.css
        print.css
    shared/
      paths.js                -- path parsing/building utilities
      hash.js                 -- content hashing (shared between import and API)
      markers.js              -- marker increment logic (ported from next-marker.js)
  scripts/
    convert-charter.js        -- reference conversion: Andover charter tiddlers -> import JSON
    convert-rham.js           -- reference conversion: RHAM policy tiddlers -> import JSON
    convert-tw.js             -- convert Articulate-exported TW tiddlers -> import JSON
    convert-docx.js           -- convert structured Word document -> draft import JSON
    create-user.js            -- CLI script to create admin user
    migrate.js                -- run database migrations
  docs/
    index.md                  -- project overview / docs home page
    index.html                -- Docsify entry point (for static site hosting)
    _sidebar.md               -- Docsify sidebar (kept in sync with directory structure)
    _toc.json                 -- top-level section ordering
    Users Guide/
      _toc.json
      index.md
      Getting Started.md
      Navigating Documents.md
      Editing.md
      Branching.md
      Comparing Revisions.md
      Merging.md
      History.md
      Exporting.md
      Importing.md
    Developer Guide/
      _toc.json
      index.md
      Architecture.md
      Tech Stack.md
      Coding Standards.md
      Data Model.md
      Server.md
      Client.md
      Diff Algorithm.md
      Merge Algorithm.md
      Testing.md
    API Reference/
      _toc.json
      index.md
      Documents.md
      Versions.md
      Revisions.md
      Tree and Nodes.md
      Diff and Merge.md
      Import and Export.md
      Auth.md
    Deployment/
      _toc.json
      index.md
      Docker.md
      Manual Setup.md
  data/
    articulate.db             -- SQLite database (gitignored)
  Dockerfile                  -- for self-hosting
  docker-compose.yml
```



9. Diff Algorithm Detail
-------------------------

The two-way diff operates in two phases:

**Phase 1 -- Structural diff**: Compare `tree_entries` of revision A and revision B.
- For each path in A, look up the same path in B.
  - Same path, same node_id: **unchanged** (skip).
  - Same path, different node_id: **modified** (proceed to Phase 2).
  - Path in A not in B: **removed**.
  - Path in B not in A: **added**.
- Detect **moves**: if a node_id appears in both revisions but at different paths, it was moved (not removed + added).

**Phase 2 -- Word-level diff**: For modified nodes, compute a word-level diff between the two node bodies using a standard diff algorithm (Myers or patience diff). Present as inline insertions/deletions.

**Phase 1.5 -- Renumber cascade detection**: When a node is inserted or deleted among siblings, the remaining siblings often need their markers renumbered (e.g., insert new 203(C), old C→D, D→E, E→F). Because nodes are content-addressed, the same `node_id` appearing at a different path is already detected as a "move." The enhancement is to recognize a set of consecutive sibling moves as a single **renumber operation**: "inserted 203(C), renumbered D→E, E→F, F→G." The diff output groups these into one entry rather than showing each renamed sibling as a separate modification, which would otherwise obscure the one meaningful change (the insertion) under a cascade of noise.

**Three-way diff for merging**: Given ancestor A, and two derived revisions B and C:
- Compute diff(A, B) and diff(A, C).
- For each path:
  - Changed in B only: take B's version.
  - Changed in C only: take C's version.
  - Changed in both B and C: **conflict** -- user must resolve.
  - Changed in one, deleted in other: **conflict**.
  - Added in both with same content: auto-merge.
  - Added in both with different content: **conflict**.



10. Cross-Reference System
--------------------------

Legal documents heavily cross-reference other sections. In the Andover Charter, `<<Section 305B>>` links to Section 305B. In Articulate, cross-references use a lightweight syntax:

```markdown
See [[ch3/s305/B]] for details on the Board of Finance.
See [[ch3/s305/B|the Board's powers]] for an override display text.
```

By default, `[[path]]` renders using the target node's **caption** (e.g., "Section 305B. Powers of the Board of Finance"). The `[[path|display text]]` form allows explicit override text.

In the web UI, cross-references render as clickable navigation links. In HTML exports, they become anchor links (`#ch3-s305-B`). In TiddlyWiki exports, they become TW-style links. In Word exports, they become bookmarked cross-references where possible, or plain text with section numbers.

When a node is moved or renumbered, cross-references pointing to it can be identified by querying all nodes whose body contains the old path, and offering a bulk-update operation.



11. Documentation System
-------------------------


### 11.1 Dual-Purpose Docs ###

Documentation lives in a `docs/` directory at the project root and serves two purposes from a single set of markdown files:

1. **In-app help** -- An Express route (`/api/v1/docs`) serves the docs tree and rendered content via API. A client-side docs viewer component provides a sidebar TOC and content panel within the application itself.

2. **Static documentation site** -- The same markdown files power a Docsify site (via `docs/index.html`) for standalone browsing or GitHub Pages hosting.


### 11.2 Directory Conventions ###

- **Title-cased directories** are doc sections visible in the TOC (e.g., `Users Guide/`, `Developer Guide/`).
- **Lowercase-initial names** are filtered out of the TOC -- used for internal/scratch content, plans, and assets.
- Each directory contains an `index.md` (section overview) and a `_toc.json` (array of names controlling display order).
- Markdown files within a section are individual doc pages.


### 11.3 Docs Server Route ###

The docs route provides three endpoints:

```
GET  /api/v1/docs/tree              -- nested TOC as JSON
GET  /api/v1/docs/content/:path     -- rendered doc content (supports .md, .html, .json format extensions)
GET  /api/v1/docs/_static/*         -- images and other assets
```

The server uses a custom Marked renderer that resolves internal links relative to the current document's directory, opens external links in new tabs, and renders mermaid code blocks as diagrams.


### 11.4 Docs as Living Documentation ###

Documentation is not a final-milestone task. Each milestone includes specific doc deliverables, and existing docs are updated whenever the feature they describe changes. The goal is that at any point in development, the docs accurately reflect the current state of the system.


### 11.5 Doc Sections ###

| Section         | Audience   | Content                                                            |
| :-------------- | :--------- | :----------------------------------------------------------------- |
| Users Guide     | End users  | Task-oriented guides: getting started, editing, branching, merging |
| Developer Guide | Developers | Architecture, data model, algorithms, coding standards             |
| API Reference   | Developers | Endpoint-by-endpoint REST API documentation                        |
| Deployment      | Admins     | Docker setup, manual installation, configuration                   |

----------


### Critical Files for Implementation ###

- `C:/Users/scott/Dev/Andover/Charter/2024/semiofficial/tiddlers/Section1013A(1).tid` -- exemplifies the deepest nesting pattern and field structure that the charter importer must parse (fields: `chapter`, `section`, `subsection`, `sub-subsection`, `tags`)
- `C:/Users/scott/Dev/Tiddlywiki/RHAM_Policies/plugins/crosseye/outline/procedures/sections.tid` -- the RHAM outline rendering procedure that demonstrates prefix-based parent-child resolution (`[all[tiddlers]prefix<currentTiddler>] :filter[removeprefix<..currentTiddler>split[(]count[]match[2]]`), which is the core pattern Articulate's tree model generalizes
- `C:/Users/scott/Dev/Tiddlywiki/RHAM_Policies/plugins/crosseye/outline/filters/next-marker.js` -- marker increment logic handling numeric, alphabetic, s-numbered, and Roman numeral sequences, to be ported to `src/shared/markers.js`
- `C:/Users/scott/Dev/Tiddlywiki/RHAM_Policies/plugins/crosseye/outline/widgets/action-archive-outline.js` -- the archive/snapshot pattern (serializing a tree of tiddlers into a compound format), which informs the revision snapshot design
- `C:/Users/scott/Dev/Andover/Charter/2024/semiofficial/Prompt.md` -- the original problem statement and requirements that motivated this project, serving as the reference specification
