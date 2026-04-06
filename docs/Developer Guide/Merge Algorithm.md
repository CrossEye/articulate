Merge Algorithm
===============

Articulate implements three-way merge for revision trees.  The algorithm is in `src/shared/merge.js` as pure functions with no database dependency.


### Lowest Common Ancestor (LCA) ###

Before merging, the system finds the most recent revision that is an ancestor of both sides.  The algorithm:

1. Walk revision A's `parent_id` chain, collecting all ancestors into a set.
2. When a revision has no `parent_id`, check its version's `forked_from` field to jump across version boundaries (e.g., from a branch's first revision to the main version's revision it was forked from).
3. Walk revision B's chain the same way, stopping at the first ID found in A's ancestor set.

This correctly handles cross-version ancestry.  For example, if a branch was forked from Rev 2 of the main version, and both sides have since advanced, the LCA is Rev 2.


### Three-Way Tree Merge ###

Given three trees (base, ours, theirs) as arrays of `{ path, node_id, ... }`:

1. Build path-keyed maps for all three trees.
2. For each unique path across all three maps, classify the change:

| Base | Ours | Theirs | Result |
| :--- | :--- | :----- | :----- |
| Same | Same | Same | Keep base (unchanged) |
| Same | Changed | Same | Take ours |
| Same | Same | Changed | Take theirs |
| Same | Changed (X) | Changed (X) | Take either (converged) |
| Same | Changed (X) | Changed (Y) | **Conflict** (modify) |
| Exists | Missing | Missing | Remove (both deleted) |
| Exists | Missing | Same | Remove (ours deleted) |
| Exists | Same | Missing | Remove (theirs deleted) |
| Exists | Missing | Changed | **Conflict** (delete-modify) |
| Exists | Changed | Missing | **Conflict** (delete-modify) |
| Missing | Added (X) | Missing | Take ours |
| Missing | Missing | Added (X) | Take theirs |
| Missing | Added (X) | Added (X) | Take either (converged) |
| Missing | Added (X) | Added (Y) | **Conflict** (add) |

"Changed" means the `node_id` differs from base.  Since nodes are content-addressed, identical `node_id` means identical content.

The function returns `{ merged: [...], conflicts: [...] }`.


### Conflict Resolution ###

Conflicts are resolved by the caller (the merge commit endpoint) using a `resolutions` map:

- `'ours'` -- use the tree entry from revision A
- `'theirs'` -- use the tree entry from revision B
- `{ body, caption }` -- create a new content-addressed node and use its ID

The resolved entries are combined with auto-merged entries to form the complete tree for the merge revision.


### Merge Revision ###

The merge commit creates a revision using `createInitialRevision` (full tree, not incremental copy-on-write) with:

- `parentId` set to the target version's current head revision
- `mergeSources` set to `[revA.id, revB.id]` as a JSON array

This ensures the merge revision chains correctly in the target version's history while recording its dual parentage for future reference.
