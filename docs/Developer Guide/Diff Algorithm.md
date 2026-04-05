Diff Algorithm
==============

Articulate compares revisions at two levels: structural (tree) and textual (node body).


### Tree Diff ###

Since nodes are content-addressed (SHA-256), comparing two revision trees is a map operation:

1. Build a path-keyed map of each revision's `tree_entries`.
2. For each path in revision A:
   - If not in B: **removed**.
   - If in B with the same `node_id`: **unchanged** (identical content hash).
   - If in B with a different `node_id`: **modified**.
3. For each path in B not in A: **added**.

This runs in O(n) time where n is the total number of tree entries across both revisions.


### Text Diff ###

For modified nodes, the algorithm produces a line-level diff of the body text using the classic LCS (longest common subsequence) approach:

1. Split both bodies into lines.
2. Build a dynamic programming table of LCS lengths.
3. Backtrack to produce a sequence of `equal`, `add`, and `remove` operations.

Each operation carries the line text.  The diff view renders these with green (added), red (removed), or grey (unchanged) highlighting.

Caption changes are detected separately and shown inline with `<del>` / `<ins>` markup.


### API ###

    GET /api/v1/diff/:revA/:revB

Returns:

```json
{
  "from": { "id": "...", "message": "...", "created_at": "..." },
  "to":   { "id": "...", "message": "...", "created_at": "..." },
  "summary": { "added": 0, "removed": 0, "modified": 1, "unchanged": 7 },
  "added": [ ... ],
  "removed": [ ... ],
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


### Client Navigation ###

Users can reach the diff view in three ways:

1. **Diff button** in the revision controls bar -- compares current revision with its parent.
2. **History panel** -- click "diff" next to any revision to compare it with its parent.
3. **Compare selected** -- select two revisions with radio buttons and click "Compare selected" to diff any pair.

The diff URL pattern is `/:docId/:versionSlug/diff/:revA/:revB`.
