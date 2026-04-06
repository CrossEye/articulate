Diff and Merge
==============

### Diff ###

Compare two revisions by sequence number within a document.

```
GET /api/v1/documents/:docId/diff/:seqA/:seqB
```

**Response:**
```json
{
  "from": { "id": "...", "seq": 1, "message": "...", "created_at": "..." },
  "to":   { "id": "...", "seq": 2, "message": "...", "created_at": "..." },
  "summary": { "added": 0, "removed": 0, "modified": 1, "unchanged": 7 },
  "added": [],
  "removed": [],
  "modified": [
    {
      "path": "root/3000",
      "from": { "body": "...", "caption": "..." },
      "to":   { "body": "...", "caption": "..." },
      "lines": [
        { "type": "remove", "value": "old line" },
        { "type": "add", "value": "new line" }
      ],
      "captionChanged": false
    }
  ]
}
```

**Errors:**
- `404` -- Revision not found


### Merge Preview ###

Preview a three-way merge between two revisions.  The system finds their Lowest Common Ancestor (LCA) and computes auto-merged entries and conflicts.

```
POST /api/v1/documents/:docId/merge/preview
```

**Request body:**
```json
{
  "seqA": 8,
  "seqB": 9
}
```

**Response:**
```json
{
  "lca": { "id": "...", "seq": 2 },
  "from": { "id": "...", "seq": 8 },
  "to":   { "id": "...", "seq": 9 },
  "merged": [ ... ],
  "conflicts": [
    {
      "path": "root/3000/1",
      "type": "modify",
      "base":   { "node_id": "...", "body": "...", "caption": "..." },
      "ours":   { "node_id": "...", "body": "...", "caption": "..." },
      "theirs": { "node_id": "...", "body": "...", "caption": "..." }
    }
  ],
  "summary": { "auto": 8, "conflicts": 1 }
}
```

**Errors:**
- `404` -- Revision not found
- `409` -- No common ancestor found


### Merge Commit ###

Commit a merge after resolving all conflicts.

```
POST /api/v1/documents/:docId/merge/commit
```

**Request body:**
```json
{
  "seqA": 8,
  "seqB": 9,
  "targetVersionId": "budget-rewrite",
  "message": "Merge main into budget-rewrite",
  "resolutions": {
    "root/3000/1": "theirs"
  }
}
```

Each resolution is either:
- `"ours"` -- use the entry from revision A
- `"theirs"` -- use the entry from revision B
- `{ "body": "...", "caption": "..." }` -- create a new node with hand-edited content

**Response:** `201` with the created revision.

The revision's `merge_sources` field is populated with the IDs of both source revisions.

**Errors:**
- `400` -- Missing required fields or unresolved conflicts
- `404` -- Revision or target version not found
- `409` -- No common ancestor found
