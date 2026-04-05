Documents
=========

Documents are the top-level entities in Articulate.  Each document represents a single legal or policy document (e.g., a town charter, a policy manual).


### List Documents ###

```
GET /api/v1/documents
```

Returns an array of all documents.

**Response:**
```json
[
  {
    "id": "andover-charter",
    "title": "Town of Andover Charter",
    "created_at": "2026-01-15T10:30:00.000Z",
    "metadata": null
  }
]
```


### Get Document ###

```
GET /api/v1/documents/:docId
```

Returns a single document by ID.

**Response:** Same shape as a single item in the list response.

**Errors:**
- `404` -- Document not found


### Create Document ###

```
POST /api/v1/documents
```

**Request body:**
```json
{
  "id": "andover-charter",
  "title": "Town of Andover Charter",
  "metadata": { "style": "charter" }
}
```

Both `id` and `title` are required.  `metadata` is an optional JSON object for document-level configuration.

**Response:** `201` with the created document.
