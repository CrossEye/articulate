Data Model
==========

Articulate uses a git-like data model where documents are trees of content-addressed nodes, tracked through branches (versions) and immutable snapshots (revisions).


### Core Entities ###

| Entity      | Git analogy | Description                                        |
| :---------- | :---------- | :------------------------------------------------- |
| Document    | Repository  | A single legal/policy document                     |
| Version     | Branch      | A named line of work (e.g., "Main", "Budget Draft") |
| Revision    | Commit      | An immutable snapshot of the full document tree     |
| Node        | Blob        | A content-addressed unit of text (section, clause)  |
| Tree Entry  | Tree        | A node's position in a revision's document tree     |


### Content-Addressed Nodes ###

Every node is identified by a SHA-256 hash of its canonical content:

```javascript
hash(JSON.stringify({ body, caption, nodeType, metadata }))
```

This means:

- Two revisions that contain the same text at the same path share the same node row in the database.
- Editing a node always produces a new node ID (different hash).
- The `nodes` table is append-only; old nodes are never deleted.


### Copy-on-Write Tree Snapshots ###

Each revision has a complete set of `tree_entries` recording every node's position.  When a new revision is created:

1. All tree entries from the parent revision are copied to the new revision.
2. Changed entries are upserted (inserted or replaced).
3. Deleted entries are removed.

This means each revision is a self-contained snapshot -- querying "what does this revision look like?" is a single `SELECT` on `tree_entries`, with no recursive parent-chasing.

The storage overhead is modest because `tree_entries` rows are small (path + foreign key), and actual content is shared through the `nodes` table.


### Path Convention ###

Paths use slash-delimited segments derived from the document's natural hierarchy:

```
root/ch2/s203/C/3
```

Each segment corresponds to one level of the hierarchy.  The `marker` field on each tree entry preserves the display label (e.g., `"A"`, `"III"`, `"s203"`), which may differ from the path segment.


### Storage Estimates ###

A document like the Andover Charter has approximately 253 sections.  At 10 revisions across 5 versions, that produces roughly 12,650 tree entry rows -- trivial for SQLite.
