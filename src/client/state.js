import { signal, computed } from '@preact/signals'

const state = {
  // Document list (for overview)
  documents: signal([]),

  // Currently selected document, version, revision
  currentDoc: signal(null),
  currentVersion: signal(null),
  currentRevision: signal(null),
  currentRevisionSeq: signal(null),
  currentDiff: signal(null),

  // Tree structure for current revision
  treeData: signal(null),

  // Currently focused node path
  currentPath: signal(null),

  // Node content cache: path -> { entry, node }
  nodeCache: signal(new Map()),

  // Auth
  currentUser: signal(null),
  authChecked: signal(false),

  // Comment counts per path for current version (unresolved top-level only)
  commentCounts: signal({}),

  // Whether comments are visible globally (toggled by user, persisted to localStorage)
  showComments: signal(false),

  // Loading / error state
  loading: signal(false),
  error: signal(null),

  // Docs state
  docsTree: signal(null),
  docsContent: signal(null),
  docsPath: signal(null),
}

// Build a nested tree from flat tree_entries
const buildNestedTree = computed(() => {
  const flat = state.treeData.value
  if (!flat || flat.length === 0) return null

  const byPath = new Map()
  for (const entry of flat) {
    byPath.set(entry.path, { ...entry, children: [] })
  }

  const roots = []
  for (const entry of flat) {
    const node = byPath.get(entry.path)
    if (entry.parent_path && byPath.has(entry.parent_path)) {
      byPath.get(entry.parent_path).children.push(node)
    } else {
      roots.push(node)
    }
  }

  return roots
})

export { state, buildNestedTree }
