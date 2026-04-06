Merging
=======

When a branch is ready to be incorporated, Articulate provides a three-way merge that automatically resolves non-conflicting changes and presents conflicts for human review.


### Starting a Merge ###

There are two ways to reach the merge view:

1. **From a branch** -- click **Merge** in the revision controls bar.  This pre-fills the source (ours) with the current branch revision and the target (theirs) with the published version's head.
2. **From the Document Overview** -- click **Merge** in a branch row in the Branches table.

The merge view is at `/:docId/merge` with optional query parameters `from`, `into`, and `target`.


### Preview ###

Enter the two revision sequence numbers ("Ours" and "Theirs") and click **Preview Merge**.  The system finds the Lowest Common Ancestor (LCA) of the two revisions and performs a three-way comparison:

- **Auto-merged entries** -- nodes that changed on only one side, or changed to the same result on both sides.  These are resolved automatically.
- **Conflicts** -- nodes that changed differently on both sides, or were deleted on one side and modified on the other.

The summary bar shows the count of auto-merged entries and conflicts, plus the LCA revision number.


### Resolving Conflicts ###

Each conflict shows the ours and theirs versions side by side, with inline diffs highlighting what changed relative to the base (LCA).  Three resolution options are available:

- **Use Ours** -- keep the version from revision A.
- **Use Theirs** -- keep the version from revision B.
- **Edit** -- opens a text editor pre-filled with one side's content.  You can hand-edit the text and apply it as the resolution.

Resolved conflicts are dimmed and marked with a green border.


### Committing ###

Once all conflicts are resolved:

1. Select the **target version** where the merged revision should be created.
2. Enter a **merge message** describing the merge.
3. Click **Commit Merge**.

The system creates a new revision on the target version containing the fully merged document tree.  The revision's `merge_sources` field records both source revision IDs for audit purposes.

After committing, you are taken to the new merged revision.


### Conflict Types ###

| Type | Meaning |
| :--- | :------ |
| `modify` | Both sides changed the same node differently |
| `add` | Both sides added a node at the same path with different content |
| `delete-modify` | One side deleted a node while the other modified it |
