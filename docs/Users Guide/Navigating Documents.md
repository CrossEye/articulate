Navigating Documents
====================

Articulate represents documents as trees of nodes.  Each node is a section, clause, or other unit of content, nested within a hierarchy.


### URL Structure ###

Every view in Articulate has a bookmarkable URL:

| URL pattern                                | What it shows                          |
| :----------------------------------------- | :------------------------------------- |
| `/`                                        | Home page with document list           |
| `/:docId`                                  | Document overview with version list    |
| `/:docId/:versionSlug`                     | Latest revision of a version           |
| `/:docId/:versionSlug/:path`               | Specific node within a version         |
| `/docs`                                    | Documentation home                     |
| `/docs/:path`                              | Specific documentation page            |

You can share URLs or bookmark them to return to a specific view later.


### Tree Sidebar ###

The tree sidebar on the left shows the full document hierarchy.  It is always visible when viewing a version.

- **Expand/collapse** -- Click the ▸/▾ arrows to show or hide children.
- **Select a node** -- Click a node's label to navigate to it.
- **Active highlight** -- The currently selected node is highlighted with a blue background.

Top-level nodes (chapters) are expanded by default.  Deeper levels start collapsed so you can see the full outline at a glance.


### Breadcrumbs ###

The breadcrumb bar above the content area traces the path from the root to the current node.  Each breadcrumb is clickable -- use it to quickly navigate up the hierarchy.


### Context View ###

When you select a node, the content area shows the node itself plus previews of its children.  This gives you context: you can see what's in a section without expanding every child in the tree.

Children are shown with an indented left border to visually distinguish them from the selected node.


### Cross-References ###

Legal documents frequently reference other sections.  In Articulate, cross-references appear as clickable links in the text.  Clicking one navigates to the referenced node.

Cross-references use the format `[[path]]` in the source Markdown, which renders as the target node's caption by default.  Authors can override the display text with `[[path|custom text]]`.
