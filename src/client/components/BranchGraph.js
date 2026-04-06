import { html } from 'htm/preact'
import { useState, useEffect } from 'preact/hooks'
import { navigate } from '../router.js'
import api from '../api.js'
import { state } from '../state.js'

const LANE_WIDTH = 140
const ROW_HEIGHT = 44
const NODE_RADIUS = 8
const PAD = { top: 36, left: 40, right: 220, bottom: 24 }

const LANE_COLORS = [
  '#3b82f6', '#10b981', '#f59e0b', '#ef4444',
  '#8b5cf6', '#06b6d4', '#f97316', '#14b8a6',
]

const truncate = (s, n = 36) =>
  s && s.length > n ? s.slice(0, n) + '\u2026' : s

// Build layout data from raw API response
const layoutGraph = (versions, revisions, tags, publishedVersionId) => {
  // Assign lanes: published/main version first, then others by created_at
  const sorted = [...versions].sort((a, b) => {
    if (a.id === publishedVersionId) return -1
    if (b.id === publishedVersionId) return 1
    if (!a.forked_from && b.forked_from) return -1
    if (a.forked_from && !b.forked_from) return 1
    return a.created_at < b.created_at ? -1 : 1
  })
  const laneByVersion = new Map(sorted.map((v, i) => [v.id, i]))

  // Build revision lookup
  const revById = new Map(revisions.map(r => [r.id, r]))

  // Build tag lookup
  const tagsByRevId = new Map()
  for (const t of tags) {
    const list = tagsByRevId.get(t.revision_id) || []
    list.push(t.name)
    tagsByRevId.set(t.revision_id, list)
  }

  // Version lookup for fork edges
  const versionById = new Map(versions.map(v => [v.id, v]))

  // Assign rows by seq order (already sorted)
  const nodes = revisions.map((rev, rowIndex) => {
    const lane = laneByVersion.get(rev.version_id) ?? 0
    return {
      id: rev.id,
      seq: rev.seq,
      message: rev.message,
      created_at: rev.created_at,
      published: rev.published,
      version_id: rev.version_id,
      parent_id: rev.parent_id,
      merge_sources: rev.merge_sources,
      tags: tagsByRevId.get(rev.id) || [],
      lane,
      x: PAD.left + lane * LANE_WIDTH,
      y: PAD.top + rowIndex * ROW_HEIGHT,
      color: LANE_COLORS[lane % LANE_COLORS.length],
    }
  })

  const nodeById = new Map(nodes.map(n => [n.id, n]))

  // Build edges
  const edges = []
  for (const node of nodes) {
    // Parent edge
    if (node.parent_id && nodeById.has(node.parent_id)) {
      const parent = nodeById.get(node.parent_id)
      edges.push({ from: parent, to: node, type: 'parent' })
    }
    // Fork edge: no parent but version has forked_from
    if (!node.parent_id) {
      const ver = versionById.get(node.version_id)
      if (ver?.forked_from && nodeById.has(ver.forked_from)) {
        const source = nodeById.get(ver.forked_from)
        edges.push({ from: source, to: node, type: 'fork' })
      }
    }
    // Merge edges
    if (node.merge_sources) {
      for (const srcId of node.merge_sources) {
        if (nodeById.has(srcId)) {
          const source = nodeById.get(srcId)
          edges.push({ from: source, to: node, type: 'merge' })
        }
      }
    }
  }

  const laneCount = sorted.length
  const width = PAD.left + laneCount * LANE_WIDTH + PAD.right
  const height = PAD.top + nodes.length * ROW_HEIGHT + PAD.bottom

  const lanes = sorted.map((v, i) => ({
    version: v,
    x: PAD.left + i * LANE_WIDTH,
    color: LANE_COLORS[i % LANE_COLORS.length],
  }))

  return { nodes, edges, lanes, width, height }
}

const edgePath = (from, to) => {
  if (from.x === to.x) {
    // Same lane — straight line
    return `M ${from.x} ${from.y + NODE_RADIUS} L ${to.x} ${to.y - NODE_RADIUS}`
  }
  // Cross lane — bezier curve
  const midY = (from.y + to.y) / 2
  return `M ${from.x} ${from.y + NODE_RADIUS} C ${from.x} ${midY}, ${to.x} ${midY}, ${to.x} ${to.y - NODE_RADIUS}`
}

const BranchGraph = ({ params }) => {
  const { docId } = params
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Read highlight param from URL
  const highlightSeq = (() => {
    try {
      const url = new URL(location.href)
      const rev = url.searchParams.get('rev')
      return rev ? Number(rev) : null
    } catch { return null }
  })()

  useEffect(() => {
    setLoading(true)
    Promise.all([
      api.get(`/documents/${docId}`),
      api.get(`/documents/${docId}/history`),
    ]).then(([doc, history]) => {
      state.currentDoc.value = doc
      state.currentVersion.value = null
      state.currentRevision.value = null
      state.currentRevisionSeq.value = null
      state.currentDiff.value = null
      const layout = layoutGraph(history.versions, history.revisions, history.tags, doc.published_version)
      setData(layout)
      setLoading(false)
    }).catch(err => {
      setError(err.message)
      setLoading(false)
    })
  }, [docId])

  if (loading) return html`<main class="branch-graph"><p>Loading...</p></main>`
  if (error) return html`<main class="branch-graph"><p class="text-muted">Error: ${error}</p></main>`
  if (!data) return null

  const { nodes, edges, lanes, width, height } = data

  return html`
    <main class="branch-graph">
      <div class="branch-graph__nav">
        <a href="/${docId}" onclick=${(e) => { e.preventDefault(); navigate(`/${docId}`) }}>
          \u2190 Back to document
        </a>
      </div>

      <div class="branch-graph__container">
        <svg class="branch-graph__svg" viewBox="0 0 ${width} ${height}"
          width=${width} height=${height}>

          ${lanes.map(lane => html`
            <text key=${'lane-' + lane.version.id}
              class="branch-graph__lane-label"
              x=${lane.x} y=${16}
              fill=${lane.color}>
              ${lane.version.name}
              ${lane.version.kind === 'branch' ? ' (branch)' : ''}
            </text>
          `)}

          ${edges.map((edge, i) => html`
            <path key=${'edge-' + i}
              class=${'branch-graph__edge' + (edge.type === 'merge' ? ' branch-graph__edge--merge' : '')}
              d=${edgePath(edge.from, edge.to)}
              stroke=${edge.type === 'merge' ? edge.from.color : edge.to.color}
            />
          `)}

          ${nodes.map(node => {
            const versionId = node.version_id
            const isHighlighted = highlightSeq === node.seq
            return html`
              <g key=${node.id} class="branch-graph__node"
                onclick=${() => navigate(`/${docId}/${versionId}/rev/${node.seq}`)}>
                <title>${'Rev ' + node.seq + (node.message ? ' \u2014 ' + node.message : '') + '\n' + new Date(node.created_at + 'Z').toLocaleString()}</title>
                ${isHighlighted && html`
                  <circle class="branch-graph__current"
                    cx=${node.x} cy=${node.y} r=${NODE_RADIUS + 5}
                    stroke=${node.color} />
                `}
                <circle class="branch-graph__circle"
                  cx=${node.x} cy=${node.y} r=${NODE_RADIUS}
                  fill=${node.color} />
                <text class="branch-graph__seq"
                  x=${node.x + NODE_RADIUS + 6} y=${node.y + 4}>
                  ${node.seq}
                </text>
                <text class="branch-graph__message"
                  x=${node.x + NODE_RADIUS + 28} y=${node.y + 4}>
                  ${truncate(node.message) || ''}
                </text>
                ${node.tags.map((tag, ti) => html`
                  <rect key=${'tag-' + ti} class="branch-graph__tag-bg"
                    x=${node.x + NODE_RADIUS + 6 + ti * 70} y=${node.y + 8}
                    width=${Math.min(tag.length * 6.5 + 8, 66)} height=${14}
                    rx=${3} />
                  <text key=${'tagt-' + ti} class="branch-graph__tag-text"
                    x=${node.x + NODE_RADIUS + 10 + ti * 70} y=${node.y + 18}
                    font-size="9">
                    ${truncate(tag, 8)}
                  </text>
                `)}
              </g>
            `
          })}
        </svg>
      </div>
    </main>
  `
}

export default BranchGraph
