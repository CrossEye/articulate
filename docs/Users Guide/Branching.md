Branching
=========

Articulate supports lightweight branching so that working groups can make changes independently and merge them back later.


### Versions vs. Branches ###

There are two kinds of version in Articulate:

- **Versions** represent politically significant milestones (e.g., "Version 2024", "Version 2027").  They are created infrequently and typically correspond to formal adoption events like a referendum.
- **Branches** are lightweight working copies (e.g., "Budget Subcommittee", "Scott's Draft").  They are created freely, edited collaboratively, and merged back when ready.

Both are stored in the same `versions` table and use the same revision chain mechanism.  The difference is semantic: the `kind` field is either `'version'` or `'branch'`.


### Creating a Branch ###

There are two ways to create a branch:

1. **From the Document Overview page** -- click **New Branch** in the Branches section.  Enter a name and optionally a source revision number.  If no source is given, the branch starts empty.

2. **From the Revision Controls bar** -- click **Fork** while viewing any revision.  This creates a branch from that exact revision, copying its full document tree.

The new branch starts with one revision whose tree is identical to the source.  Edits on the branch create new revisions independently of the source.


### Tags ###

Tags are named bookmarks that point to a specific revision.  Unlike branches, tags do not have their own revision chain -- they are simply labels.

- Click **Tag** in the revision controls to create a tag on the current revision.
- Tags appear as badges next to the revision number and in the History panel.
- Tags are unique per document.  Creating a tag with an existing name moves it to the new revision.

Typical uses: "budget-ready-for-review", "sent-to-legal", "first-draft".


### Locking ###

A version can be locked to prevent new revisions.  This is a guard rail, not a hard constraint -- locked versions can be unlocked when necessary (for example, to fix a typo on a published version).

The published version is automatically locked after migration.  Locking and unlocking is done via the API:

```
PATCH /api/v1/documents/:docId/versions/:versionId/lock
{ "locked": true }
```

When a version is locked:

- The Save Revision and Publish buttons are hidden in the UI.
- The API returns `409 Conflict` if a revision is attempted.
- A "Locked" badge appears in the header and on the document overview page.
