Tree and Nodes
==============

These endpoints read and modify the document tree within a specific revision.  Write operations (PUT, POST, DELETE) automatically create a new revision.


### Get Full Tree ###

```
GET /api/v1/revisions/:revisionId/tree
```

Returns all tree entries for a revision, sorted by depth and sort key.

**Response:**
```json
[
  { "path": "root", "node_id": "sha...", "parent_path": null, "sort_key": 0, "marker": "", "depth": 0 },
  { "path": "root/ch1", "node_id": "sha...", "parent_path": "root", "sort_key": 0, "marker": "ch1", "depth": 1 }
]
```


### Get Subtree ###

```
GET /api/v1/revisions/:revisionId/tree/:path
```

Returns children of the node at the given path.


### Get Node Content ###

```
GET /api/v1/revisions/:revisionId/nodes/:path
```

Returns the tree entry merged with the node content.

**Response:**
```json
{
  "path": "root/ch2/s202/A",
  "node_id": "sha...",
  "body": "The Town Manager shall prepare and submit...",
  "caption": "Budget",
  "node_type": "clause",
  "marker": "A",
  "depth": 3
}
```


### Get Node Context ###

```
GET /api/v1/revisions/:revisionId/context/:path
```

Returns the node, its siblings, and its children -- everything needed for the editing view.


### Update Node ###

```
PUT /api/v1/revisions/:revisionId/nodes/:path
```

**Request body:** `{ body?, caption?, metadata? }`

Creates a new content-addressed node and a new revision.  Returns the updated node with `revisionId` pointing to the new revision and `changed: true`.  If the content is identical, returns `changed: false` with no new revision.


### Add Child Node ###

```
POST /api/v1/revisions/:revisionId/children/:parentPath
```

**Request body:** `{ body, caption?, marker, nodeType?, metadata? }`

Creates a new node as a child of the specified parent.  The child is appended after existing siblings.

**Response:** `201` with the new node and `revisionId`.


### Delete Node ###

```
DELETE /api/v1/revisions/:revisionId/nodes/:path
```

Removes the node and all its descendants.  Creates a new revision.

**Response:** `{ revisionId, removed: ["path1", "path2", ...] }`
