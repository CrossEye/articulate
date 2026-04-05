Importing Documents
===================

Articulate uses a single canonical JSON format for all document imports.  Rather than building importers for every source format, the strategy is to convert your documents to this format using scripts, AI tools, or manual editing.


### The Import Format ###

An import file is a JSON object with a title and a nested tree of nodes:

```json
{
  "title": "My Town Charter",
  "nodes": [
    {
      "path": "ch1",
      "caption": "Chapter I. General Provisions",
      "body": "Content in Markdown...",
      "marker": "1",
      "children": [
        {
          "path": "s101",
          "caption": "Section 101. Incorporation",
          "body": "All inhabitants dwelling within...",
          "marker": "101"
        }
      ]
    }
  ]
}
```

Each node has:

| Field      | Required | Description                                    |
| :--------- | :------- | :--------------------------------------------- |
| `path`     | Yes      | URL-safe path segment for this node            |
| `body`     | Yes      | Content text (Markdown)                        |
| `caption`  | No       | Display title                                  |
| `marker`   | Yes*     | Display label (e.g., "A", "s203", "III")       |
| `children` | No       | Array of child nodes (same structure)          |
| `nodeType` | No       | "section" (default), "clause", "definition"    |
| `metadata` | No       | Arbitrary JSON for node-level configuration    |

*Marker is required for all nodes except the root.


### Using the API ###

```
POST /api/v1/documents/:docId/import
```

Send the JSON import body.  The server validates the structure, creates all nodes, and produces a published initial revision.


### Converting from TiddlyWiki ###

The project includes two reference conversion scripts in `scripts/`:

- **`convert-charter.js`** -- Converts Andover Charter tiddlers (field-based hierarchy with `chapter`, `section`, `subsection` fields).
- **`convert-rham.js`** -- Converts RHAM Policy Manual tiddlers (prefix-based hierarchy where `Policy1331(s2)(A)` is a child of `Policy1331(s2)`).

Run a conversion:

```bash
node scripts/convert-charter.js /path/to/tiddlers output.json
```

Then import:

```bash
curl -X POST http://localhost:3000/api/v1/documents/my-charter/import \
  -H 'Content-Type: application/json' \
  -d @output.json
```


### Converting from Other Sources ###

For documents in other formats:

- **Well-structured Word documents**: Use heading levels as hierarchy indicators.  A conversion utility (`scripts/convert-docx.js`) will be available in a future milestone.
- **AI-assisted conversion**: The import format is simple enough that an LLM can generate it from a document description.  Provide the format example above and ask the AI to produce the JSON.
- **Manual creation**: For small documents, writing the JSON by hand is straightforward.

The goal is that conversion scripts are short and purpose-built.  Human review is expected -- automated conversion gets the structure roughly right, but legal documents often have quirks that require judgment.
