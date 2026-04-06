Tags
====

Tags are named bookmarks pointing to a specific revision within a document.  Tags are unique per document and movable.


### List Tags ###

```
GET /api/v1/documents/:docId/tags
```

Returns all tags for a document, each joined with the revision's sequence number.

**Response:**
```json
[
  {
    "name": "budget-ready",
    "document_id": "sample-charter",
    "revision_id": "abc123...",
    "created_at": "2026-04-05T10:00:00.000Z",
    "created_by": null,
    "seq": 5
  }
]
```


### Create Tag ###

```
POST /api/v1/documents/:docId/tags
```

**Request body:**
```json
{
  "name": "first-draft",
  "revisionId": "abc123..."
}
```

Alternatively, use `revisionSeq` instead of `revisionId` to reference a revision by its sequence number.

**Errors:**
- `400` -- Missing name or revision
- `404` -- Revision not found (when using `revisionSeq`)


### Move Tag ###

```
PATCH /api/v1/documents/:docId/tags/:name
```

**Request body:**
```json
{
  "revisionId": "def456..."
}
```


### Delete Tag ###

```
DELETE /api/v1/documents/:docId/tags/:name
```

**Response:** `204 No Content`
