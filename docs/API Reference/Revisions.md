Revisions
=========

Revisions are immutable snapshots of a document tree within a version.  Creating a revision copies the tree from the parent revision and applies changes.


### List Revisions ###

```
GET /api/v1/versions/:versionId/revisions
```

Returns all revisions in a version, newest first.


### Get Revision ###

```
GET /api/v1/revisions/:revisionId
```

**Response:**
```json
{
  "id": "abc123...",
  "version_id": "main",
  "parent_id": "def456...",
  "message": "Updated Section 203",
  "published": 0,
  "created_at": "2026-01-15T10:30:00.000Z"
}
```

**Errors:**
- `404` -- Revision not found


### Create Revision ###

```
POST /api/v1/versions/:versionId/revisions
```

**Request body:**
```json
{
  "message": "Restructured finance chapter",
  "changes": [
    {
      "action": "upsert",
      "path": "root/ch3",
      "nodeId": "sha256...",
      "parentPath": "root",
      "sortKey": 2,
      "marker": "ch3",
      "depth": 1
    },
    {
      "action": "remove",
      "path": "root/ch3/old-section"
    }
  ]
}
```

This is the low-level revision endpoint.  For most editing, use the node endpoints (Tree and Nodes) which handle node creation and revision creation together.

**Response:** `201` with the created revision.


### Publish Revision ###

```
PATCH /api/v1/revisions/:revisionId/publish
```

Marks a revision as published (immutable).  Published revisions cannot be further modified.
