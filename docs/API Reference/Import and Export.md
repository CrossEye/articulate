Import and Export
=================


### Import ###

```
POST /api/v1/documents/:docId/import
```

Imports a document from the canonical JSON format.  Creates the document, an "Original" version, and a published initial revision.

**Request body:** The canonical import JSON (see Users Guide > Importing for format details).

**Response:** `201`
```json
{
  "ok": true,
  "documentId": "andover-charter",
  "versionId": "original",
  "revisionId": "abc123...",
  "nodeCount": 263
}
```

**Errors:**
- `400` -- Validation failed, with `details` array listing specific issues.


### Export (Planned) ###

Export endpoints will be available after Milestone 9:

```
GET /api/v1/revisions/:revisionId/export/html          -- single-file HTML
GET /api/v1/revisions/:revisionId/export/tiddlywiki     -- single-file TiddlyWiki
GET /api/v1/revisions/:revisionId/export/docx           -- Word document
GET /api/v1/diff/:revId1/:revId2/export/html            -- comparison HTML
```
