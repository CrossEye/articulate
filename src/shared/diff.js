// Line-level diff using the classic LCS (longest common subsequence) algorithm.
// Returns an array of { type, value } where type is 'equal', 'add', or 'remove'.

const diffLines = (a, b) => {
  const aLines = a.split('\n')
  const bLines = b.split('\n')

  // Build LCS table
  const m = aLines.length
  const n = bLines.length
  const dp = Array.from({ length: m + 1 }, () => new Uint16Array(n + 1))

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = aLines[i - 1] === bLines[j - 1]
        ? dp[i - 1][j - 1] + 1
        : Math.max(dp[i - 1][j], dp[i][j - 1])
    }
  }

  // Backtrack to produce diff
  const result = []
  let i = m, j = n
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && aLines[i - 1] === bLines[j - 1]) {
      result.push({ type: 'equal', value: aLines[i - 1] })
      i--; j--
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      result.push({ type: 'add', value: bLines[j - 1] })
      j--
    } else {
      result.push({ type: 'remove', value: aLines[i - 1] })
      i--
    }
  }

  return result.reverse()
}

// Diff two revision trees. Each tree is an array of { path, node_id, marker, caption, ... }.
// Returns { added, removed, modified, unchanged } arrays of entries,
// where modified entries include { path, from, to, lines }.
const diffTrees = (treeA, treeB, getNode) => {
  const mapA = new Map(treeA.map(e => [e.path, e]))
  const mapB = new Map(treeB.map(e => [e.path, e]))

  const added = []
  const removed = []
  const modified = []
  const unchanged = []

  for (const [path, entryA] of mapA) {
    const entryB = mapB.get(path)
    if (!entryB) {
      removed.push(entryA)
    } else if (entryA.node_id === entryB.node_id) {
      unchanged.push(entryA)
    } else {
      const nodeA = getNode(entryA.node_id)
      const nodeB = getNode(entryB.node_id)
      const lines = diffLines(nodeA.body || '', nodeB.body || '')
      modified.push({
        path,
        from: { ...entryA, ...nodeA },
        to: { ...entryB, ...nodeB },
        lines,
        captionChanged: nodeA.caption !== nodeB.caption,
      })
    }
  }

  for (const [path, entryB] of mapB) {
    if (!mapA.has(path)) {
      added.push(entryB)
    }
  }

  return { added, removed, modified, unchanged }
}

export { diffLines, diffTrees }
