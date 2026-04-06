// Three-way merge for revision trees.
// Pure functions — no DB access. Callers provide lookup helpers.

// Walk the ancestor chain of a revision, crossing version fork boundaries.
// Returns an array of revision IDs from the given rev back to the root.
const collectAncestors = (revId, getRevision, getVersion) => {
  const ancestors = new Set()
  let current = revId
  while (current) {
    if (ancestors.has(current)) break // cycle guard
    ancestors.add(current)
    const rev = getRevision(current)
    if (!rev) break
    if (rev.parent_id) {
      current = rev.parent_id
    } else {
      // No parent — check if this version was forked from another revision
      const ver = getVersion(rev.version_id)
      current = ver?.forked_from || null
    }
  }
  return ancestors
}

// Find the Lowest Common Ancestor of two revisions.
// Walks revA's full ancestry, then walks revB upward until hitting a match.
const findLCA = (revIdA, revIdB, getRevision, getVersion) => {
  const ancestorsA = collectAncestors(revIdA, getRevision, getVersion)

  let current = revIdB
  const visited = new Set()
  while (current) {
    if (visited.has(current)) break
    visited.add(current)
    if (ancestorsA.has(current)) return current
    const rev = getRevision(current)
    if (!rev) break
    if (rev.parent_id) {
      current = rev.parent_id
    } else {
      const ver = getVersion(rev.version_id)
      current = ver?.forked_from || null
    }
  }
  return null
}

// Three-way merge of tree entry arrays.
// Each tree is an array of { path, node_id, parent_path, sort_key, marker, depth, caption }.
// Returns { merged: [...entries], conflicts: [...] }
const mergeTrees = (treeBase, treeA, treeB) => {
  const baseMap = new Map(treeBase.map(e => [e.path, e]))
  const mapA = new Map(treeA.map(e => [e.path, e]))
  const mapB = new Map(treeB.map(e => [e.path, e]))

  const allPaths = new Set([...baseMap.keys(), ...mapA.keys(), ...mapB.keys()])

  const merged = []
  const conflicts = []

  for (const path of allPaths) {
    const base = baseMap.get(path)
    const ours = mapA.get(path)
    const theirs = mapB.get(path)

    const oursChanged = base ? (ours ? ours.node_id !== base.node_id : true) : !!ours
    const theirsChanged = base ? (theirs ? theirs.node_id !== base.node_id : true) : !!theirs

    if (base && ours && theirs) {
      // Existed in all three
      if (!oursChanged && !theirsChanged) {
        // Unchanged in both
        merged.push(base)
      } else if (oursChanged && !theirsChanged) {
        // Changed only in ours
        merged.push(ours)
      } else if (!oursChanged && theirsChanged) {
        // Changed only in theirs
        merged.push(theirs)
      } else if (ours.node_id === theirs.node_id) {
        // Both changed to the same thing (converged)
        merged.push(ours)
      } else {
        // Both changed differently — conflict
        conflicts.push({ path, type: 'modify', base, ours, theirs })
      }
    } else if (base && !ours && !theirs) {
      // Removed by both — no conflict, just remove
    } else if (base && ours && !theirs) {
      if (oursChanged) {
        // Modified in ours, removed in theirs — conflict
        conflicts.push({ path, type: 'delete-modify', base, ours, theirs: null })
      } else {
        // Unchanged in ours, removed in theirs — accept removal
      }
    } else if (base && !ours && theirs) {
      if (theirsChanged) {
        // Removed in ours, modified in theirs — conflict
        conflicts.push({ path, type: 'delete-modify', base, ours: null, theirs })
      } else {
        // Removed in ours, unchanged in theirs — accept removal
      }
    } else if (!base && ours && theirs) {
      // Added in both
      if (ours.node_id === theirs.node_id) {
        merged.push(ours)
      } else {
        conflicts.push({ path, type: 'add', base: null, ours, theirs })
      }
    } else if (!base && ours && !theirs) {
      // Added only in ours
      merged.push(ours)
    } else if (!base && !ours && theirs) {
      // Added only in theirs
      merged.push(theirs)
    }
  }

  return { merged, conflicts }
}

export { findLCA, mergeTrees, collectAncestors }
