Architecture
============

Articulate is a single-process web application with a clear server/client split.


### High-Level Overview ###

```
Browser  <-->  Express API  <-->  SQLite (better-sqlite3)
               |
               +-- Static file serving (dist/)
               +-- Docs serving (docs/)
```

The server is a Node.js process running Express.  It serves the REST API, the built client bundle, and the documentation.  All data lives in a single SQLite database file.

The client is a Preact + HTM single-page application, bundled by esbuild.  It communicates with the server exclusively through the JSON API.


### Directory Structure ###

```
src/
  server/          API, database, import/export, auth
    db/            Database access layer (one module per entity)
    routes/        Express route handlers
    import/        Document import handlers
    export/        Document export renderers
    middleware/    Auth, error handling
  client/          Preact UI
    components/    UI components
    lib/           Client-side utilities
    styles/        CSS
  shared/          Code shared between server and client
    paths.js       Path parsing/building
    hash.js        Content hashing
    markers.js     Marker sequence logic
scripts/           CLI utilities (conversion, migration, admin)
docs/              Documentation (serves both in-app and static site)
data/              SQLite database (gitignored)
```


### Design Principles ###

- **Git-like model**: versions are branches, revisions are commits, nodes are content-addressed.
- **Copy-on-write snapshots**: changing one node creates a new revision that shares unchanged nodes with its parent.
- **Documents are generated, not housed**: Articulate is the editing workspace; official documents live as HTML, TiddlyWiki, or Word exports.
- **Single-file deployment**: one SQLite database, one Node.js process, no external services.
