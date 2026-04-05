Revision Chain
==============

The revision chain is the core mechanism that enables non-destructive editing in Articulate.  Every edit creates a new revision rather than mutating the existing one.


### How Edits Create Revisions ###

When a node is modified through the editing UI:

1. The client sends a `PUT /api/v1/revisions/:revisionId/nodes/:path` request with the updated `body` and `caption`.
2. The server creates a new content-addressed node (SHA-256 hash of body + caption + type + metadata).
3. If the hash matches the existing node, no revision is created (`changed: false`).
4. Otherwise, a new revision is created via copy-on-write: all tree entries are copied from the parent revision, except the modified path which points to the new node.
5. The response includes `revisionId` and `changed: true`.

The client tracks the latest revision ID in `liveRevisionId` state.  Subsequent edits chain off this live revision rather than the original, building a linked list of revisions.


### Auto-Save ###

The `NodeContextView` component debounces edits with a 2-second delay.  Each auto-save calls `handleSave`, which:

1. Sends the PUT request against `liveRevisionId` (or falls back to the prop-level `revisionId`).
2. Updates `liveRevisionId` and the global `state.currentRevision` signal.
3. Reloads the tree to reflect any structural changes.

This means rapid typing creates at most one revision per 2-second pause, not one per keystroke.


### Copy-on-Write Efficiency ###

A revision with *N* tree entries that modifies one node creates a new revision sharing *N-1* entries with its parent.  Only the changed entry is new.  The `createRevision` function in `src/server/db/revisions.js` handles this:

```
INSERT INTO tree_entries (revision_id, path, ...)
  SELECT :newRevId, path, node_id, parent_path, sort_key, marker, depth
  FROM tree_entries
  WHERE revision_id = :parentId
```

Then it upserts the changed entries on top.


### Advisory Edit Locks ###

Edit locks live in the `edit_locks` table:

| Column        | Purpose                                    |
| :------------ | :----------------------------------------- |
| `revision_id` | Revision being edited (part of PK)         |
| `path`        | Node path being edited (part of PK)        |
| `user_id`     | Who holds the lock                         |
| `acquired_at` | When the lock was acquired                 |
| `expires_at`  | Auto-expiry time (default: 5 minutes)      |

Lock lifecycle:

1. **Acquire** -- `POST /api/v1/revisions/:revId/locks/:path` with `{ userId }`.  Returns `{ acquired: true }` or `{ acquired: false, holder, expiresAt }`.
2. **Renew** -- `PATCH /api/v1/revisions/:revId/locks/:path` extends the expiry.  The client renews every 3 minutes.
3. **Release** -- `DELETE /api/v1/revisions/:revId/locks/:path?userId=...` removes the lock.
4. **Expiry** -- Expired locks are cleaned up on the next acquire attempt.

Locks are advisory.  The PUT endpoint does not check locks -- it is the client's responsibility to acquire a lock before editing and warn on conflicts.


### Save Points and Publishing ###

**Save points** create a new revision via `POST /api/v1/versions/:versionId/revisions` with a user-supplied message and empty changes.  This snapshots the current tree state with a meaningful label.

**Publishing** via `PATCH /api/v1/revisions/:revisionId/publish` sets `published = 1`.  Published revisions are immutable -- the nodes router should reject edits to published revisions (enforcement to be added in a future milestone).
