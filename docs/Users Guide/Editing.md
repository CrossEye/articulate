Editing
=======

Articulate provides in-context editing so you can modify content directly where you read it.


### Click to Edit ###

Click any node to open it in the editor.  The node's caption and body appear in editable fields, with a toolbar for common Markdown formatting.  Click the pencil icon (&#x270E;) on any child node to edit it in place.

While editing, the rest of the document remains visible around the editor for context.


### Editor Toolbar ###

The toolbar above the body field provides shortcuts for common formatting:

| Button | Inserts           | Markdown            |
| :----- | :---------------- | :------------------ |
| **B**  | Bold text         | `**selection**`     |
| *I*    | Italic text       | `*selection*`       |
| </>    | Inline code       | `` `selection` ``   |
| Xref   | Cross-reference   | `[[selection]]`     |

The toolbar wraps the current selection.  If nothing is selected, it inserts the markers at the cursor position.


### Saving Changes ###

Changes are saved automatically after a short pause (2 seconds of inactivity).  Each save creates a new revision in the revision chain, so no work is ever lost.

You can also save manually:

- Press **Ctrl+S** to save immediately
- Click the **Save** button
- Press **Escape** to stop editing (pending changes are discarded)

The revision indicator in the toolbar updates to show the latest revision ID as you edit.


### Save Points ###

Use the **Save Point** input in the revision bar to create a named snapshot.  Type a short message describing your changes and press **Enter** or click **Save Point**.  This creates a new revision with your message, making it easy to find specific points in the edit history later.


### Publishing ###

Click **Publish** to lock the current revision.  Publishing marks the revision as immutable -- no further edits can be made to it.  A confirmation prompt appears before publishing, since the action cannot be undone.

After publishing, further edits will automatically create a new draft revision branching from the published one.


### Adding and Removing Nodes ###

Below each node's content, you will find tree action buttons:

- **+ Add child** opens a form to create a new child node.  The marker field is pre-filled with the next logical value (e.g., if the last child is "s202", the suggestion is "s203").  Fill in the caption and body, then click **Add**.
- **Delete** removes the node and all of its children.  A confirmation dialog appears first.

Both operations create a new revision, so deletions can be recovered by navigating to an earlier revision.


### Edit Locks ###

When you begin editing a node, Articulate acquires an advisory lock to prevent conflicts.  If another user is editing the same node, you will see a message indicating who holds the lock and when it expires.

Locks expire automatically after 5 minutes of inactivity and are released when you finish editing.  They are advisory -- the system will warn you but will not forcibly prevent edits if a lock expires while you are still working.
