Articulate
==========

Articulate is a collaborative editing system for hierarchical legal and policy documents, with git-like branching, revision history, diff, and merge workflows.


### Status ###

Project scaffold in progress.


### Planned Stack ###

- Node.js + Express backend
- SQLite (better-sqlite3)
- Preact + HTM frontend
- esbuild for bundling



Repository Layout (Planned)
----------------------------

- src/server: API, data model, import/export, auth, diff/merge
- src/client: UI components, router, state, styles
- src/shared: shared utilities (paths, hashing, markers)
- scripts: migration/import/admin helper scripts
- data: local SQLite database (gitignored)



Quick Start (Placeholder)
--------------------------

1. Install Node.js 20+.
2. Install dependencies:
   npm install
3. Start development server:
   npm run dev



License
-------

MIT
