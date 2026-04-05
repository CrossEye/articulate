Versions
========

Versions are branches of work on a document.  Each version has a head revision (the latest snapshot) and can be forked from any existing revision.


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
  "forkedFrom": "abc123..."
}
```

`id` and `name` are required.  If `forkedFrom` is provided, the new version starts with a copy of that revision's tree.

**Response:** `201` with the created version.


### Update Version ###

```
PATCH /api/v1/documents/:docId/versions/:versionId
```

**Request body:** Any subset of `{ name, description }`.
