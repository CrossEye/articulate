Versions
========

Versions are named lines of work on a document.  Each version has a head revision (the latest snapshot) and can be forked from any existing revision.

A version's `kind` is either `'version'` (politically significant milestones) or `'branch'` (lightweight working copies).


### List Versions ###

```
GET /api/v1/documents/:docId/versions
```

Returns all versions for a document, newest first.

**Response:**
```json
[
  {
    "id": "main",
    "document_id": "andover-charter",
    "name": "Main",
    "description": "Official version",
    "head_rev": "abc123...",
    "forked_from": null,
    "kind": "version",
    "locked": 1,
    "created_at": "2026-01-15T10:30:00.000Z"
  }
]
```


### Get Version ###

```
GET /api/v1/documents/:docId/versions/:versionId
```

**Errors:**
- `404` -- Version not found


### Create Version (Fork) ###

```
POST /api/v1/documents/:docId/versions
```

**Request body:**
```json
{
  "id": "budget-rewrite",
  "name": "Budget Rewrite",
  "description": "Proposed changes to finance chapter",
  "kind": "branch",
  "forkedFrom": "abc123..."
}
```

`id` and `name` are required.

| Field | Default | Description |
| :---- | :------ | :---------- |
| `kind` | `'version'` | `'version'` or `'branch'` |
| `forkedFrom` | none | Revision ID to fork from |
| `forkedFromSeq` | none | Revision sequence number to fork from (alternative to `forkedFrom`) |

If a fork source is provided, the new version starts with a copy of that revision's tree and an initial revision with the message "Forked from Rev N".

**Response:** `201` with the created version.

**Errors:**
- `400` -- Missing `id` or `name`, or invalid `kind`
- `404` -- Source revision not found (when using `forkedFromSeq`)


### Update Version ###

```
PATCH /api/v1/documents/:docId/versions/:versionId
```

**Request body:** Any subset of `{ name, description }`.


### Lock / Unlock ###

```
PATCH /api/v1/documents/:docId/versions/:versionId/lock
```

**Request body:**
```json
{ "locked": true }
```

Set `locked` to `true` to lock or `false` to unlock.  Locking prevents new revisions (the API returns `409 Conflict`).  Unlocking is always allowed -- locking is a guard rail, not a hard constraint.

**Errors:**
- `400` -- Missing `locked` field
- `404` -- Version not found
