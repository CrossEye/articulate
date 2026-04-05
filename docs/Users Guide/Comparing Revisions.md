Comparing Revisions
===================

Articulate lets you compare any two revisions of a document to see what changed.


### Quick Diff ###

In the revision controls bar at the top of the document view, click **Diff** to compare the current revision with its parent.  This shows exactly what changed in the most recent edit.


### Revision History ###

Click **History** to expand the revision history panel.  This lists all revisions for the current version, newest first, showing:

- The revision ID (truncated)
- The revision message (if any)
- The creation date
- A "diff" link to compare with the parent revision

Each revision row has radio buttons in columns A and B.  Select one revision in each column, then click **Compare selected** to see the diff between any two revisions.


### Reading the Diff ###

The diff view shows three sections:

- **Added** -- nodes that exist in the newer revision but not the older one.  Shown with a green left border.
- **Removed** -- nodes that exist in the older revision but not the newer one.  Shown with a red left border.
- **Modified** -- nodes that exist in both revisions but have different content.  Shown with a yellow left border and a line-by-line diff of the body text.

For modified nodes, individual lines are highlighted:

- Green background with `+` prefix: added lines
- Red background with `-` prefix: removed lines
- Grey text: unchanged context lines

If a node's caption changed, the old caption is shown with strikethrough and the new caption is shown alongside it.


### Summary Bar ###

At the top of the diff, a summary shows the total count of added, removed, modified, and unchanged nodes, giving a quick sense of the scope of changes.
