import { html } from 'htm/preact'
import { useState, useEffect } from 'preact/hooks'
import { state } from '../state.js'
import { navigate } from '../router.js'
import api from '../api.js'

const RevisionControls = ({ revisionId, versionId, docId, versionSlug }) => {
  const [showPublish, setShowPublish] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [showFork, setShowFork] = useState(false)
  const [showTag, setShowTag] = useState(false)
  const [revisions, setRevisions] = useState([])
  const [revDetail, setRevDetail] = useState(null)
  const [publishMessage, setPublishMessage] = useState('')
  const [message, setMessage] = useState('')
  const [forkName, setForkName] = useState('')
  const [tagName, setTagName] = useState('')
  const [busy, setBusy] = useState(false)
  const [publishedSeq, setPublishedSeq] = useState(null)
  const [tags, setTags] = useState([])

  useEffect(() => {
    api.get(`/revisions/${revisionId}`)
      .then(rev => {
        setRevDetail(rev)
        state.currentRevisionSeq.value = rev.seq
      })
      .catch(() => setRevDetail(null))
  }, [revisionId])

  // Load tags for the document
  useEffect(() => {
    api.get(`/documents/${docId}/tags`)
      .then(setTags)
      .catch(() => setTags([]))
  }, [docId])

  // Find the published version's head seq for cross-version comparison
  useEffect(() => {
    api.get(`/documents/${docId}`)
      .then(doc => {
        if (!doc.published_version || doc.published_version === versionId) return null
        return api.get(`/documents/${docId}/versions`)
          .then(versions => {
            const pub = versions.find(v => v.id === doc.published_version)
            return pub?.head_rev ? api.get(`/revisions/${pub.head_rev}`) : null
          })
      })
      .then(rev => setPublishedSeq(rev?.seq || null))
      .catch(() => setPublishedSeq(null))
  }, [docId, versionId])

  const parentSeq = revDetail?.parent_seq
  const seq = revDetail?.seq
  const version = state.currentVersion.value
  const locked = !!version?.locked

  // Tags on the current revision
  const revTags = tags.filter(t => t.revision_id === revisionId)

  const handlePublish = async () => {
    if (!publishMessage.trim()) return
    setBusy(true)
    await api.patch(`/revisions/${revisionId}/publish`, { message: publishMessage.trim() })
    setBusy(false)
    setShowPublish(false)
    setPublishMessage('')
    const rev = await api.get(`/revisions/${revisionId}`)
    setRevDetail(rev)
  }

  const handleNewRevision = async () => {
    if (!message.trim()) return
    setBusy(true)
    try {
      const result = await api.post(`/versions/${versionId}/revisions`, {
        message: message.trim(),
        changes: [],
      })
      if (result.id) {
        state.currentRevision.value = result.id
      }
      setMessage('')
    } catch (err) {
      alert(err.message)
    }
    setBusy(false)
  }

  const handleShowHistory = async () => {
    if (!showHistory) {
      const revs = await api.get(`/versions/${versionId}/revisions`)
      setRevisions(revs)
    }
    setShowHistory(!showHistory)
  }

  const handleFork = async () => {
    if (!forkName.trim()) return
    setBusy(true)
    const id = forkName.trim().toLowerCase().replace(/\s+/g, '-')
    try {
      const ver = await api.post(`/documents/${docId}/versions`, {
        id,
        name: forkName.trim(),
        kind: 'branch',
        forkedFrom: revisionId,
      })
      setShowFork(false)
      setForkName('')
      navigate(`/${docId}/${ver.id}`)
    } catch (err) {
      alert(err.message)
    }
    setBusy(false)
  }

  const handleTag = async () => {
    if (!tagName.trim()) return
    setBusy(true)
    try {
      await api.post(`/documents/${docId}/tags`, {
        name: tagName.trim(),
        revisionId,
      })
      setShowTag(false)
      setTagName('')
      const updated = await api.get(`/documents/${docId}/tags`)
      setTags(updated)
    } catch (err) {
      alert(err.message)
    }
    setBusy(false)
  }

  return html`
    <div class="revision-controls">
      <span class="revision-controls__id" title=${revisionId}>
        Rev ${seq || '?'}
      </span>
      ${revTags.map(t => html`<span class="tag-badge" key=${t.name}>${t.name}</span>`)}

      ${locked && html`<span class="status-badge status-badge--locked">Locked</span>`}

      ${!locked && !showPublish && html`
        <button class="btn btn--sm" onclick=${() => setShowPublish(true)}>Publish</button>
      `}
      ${showPublish && html`
        <div class="revision-controls__publish">
          <input class="revision-controls__message" type="text"
            placeholder="Describe this revision..."
            value=${publishMessage}
            onInput=${(e) => setPublishMessage(e.target.value)}
            onKeyDown=${(e) => e.key === 'Enter' && handlePublish()}
            style="width: 280px" />
          <button class="btn btn--primary btn--sm" onclick=${handlePublish}
            disabled=${busy || !publishMessage.trim()}>Confirm Publish</button>
          <button class="btn btn--sm" onclick=${() => setShowPublish(false)}>Cancel</button>
        </div>
      `}

      ${parentSeq && html`
        <button class="btn btn--sm" onclick=${() => navigate(`/${docId}/${versionSlug}/rev/${seq}/diff/${parentSeq}/${seq}`)}>
          Diff
        </button>
      `}

      ${publishedSeq && seq && html`
        <button class="btn btn--sm" onclick=${() => navigate(`/${docId}/${versionSlug}/rev/${seq}/diff/${publishedSeq}/${seq}`)}>
          Compare to published
        </button>
      `}

      ${!showFork
        ? html`<button class="btn btn--sm" onclick=${() => setShowFork(true)}>Fork</button>`
        : html`
          <div class="branch-form branch-form--inline">
            <input class="branch-form__input" type="text" placeholder="Branch name..."
              value=${forkName} onInput=${(e) => setForkName(e.target.value)}
              onKeyDown=${(e) => e.key === 'Enter' && handleFork()} />
            <button class="btn btn--primary btn--sm" onclick=${handleFork}
              disabled=${busy || !forkName.trim()}>Create</button>
            <button class="btn btn--sm" onclick=${() => setShowFork(false)}>Cancel</button>
          </div>
        `
      }

      ${!showTag
        ? html`<button class="btn btn--sm" onclick=${() => setShowTag(true)}>Tag</button>`
        : html`
          <div class="branch-form branch-form--inline">
            <input class="branch-form__input" type="text" placeholder="Tag name..."
              value=${tagName} onInput=${(e) => setTagName(e.target.value)}
              onKeyDown=${(e) => e.key === 'Enter' && handleTag()} />
            <button class="btn btn--primary btn--sm" onclick=${handleTag}
              disabled=${busy || !tagName.trim()}>Create</button>
            <button class="btn btn--sm" onclick=${() => setShowTag(false)}>Cancel</button>
          </div>
        `
      }

      ${version?.kind === 'branch' && seq && html`
        <button class="btn btn--sm" onclick=${() => {
          // Navigate to merge view with this branch's head as "ours"
          const params = new URLSearchParams({ from: seq })
          // Try to pre-fill "into" with published version's head seq
          if (publishedSeq) params.set('into', publishedSeq)
          if (versionId) params.set('target', versionId)
          navigate(`/${docId}/merge?${params}`)
        }}>Merge</button>
      `}

      <button class="btn btn--sm" onclick=${handleShowHistory}>
        ${showHistory ? 'Hide History' : 'History'}
      </button>

      ${!locked && html`
        <div class="revision-controls__save">
          <input class="revision-controls__message" type="text"
            placeholder="Revision note..."
            value=${message}
            onInput=${(e) => setMessage(e.target.value)}
            onKeyDown=${(e) => e.key === 'Enter' && handleNewRevision()} />
          <button class="btn btn--sm" onclick=${handleNewRevision}
            disabled=${busy || !message.trim()}>Save Revision</button>
        </div>
      `}

      ${showHistory && html`
        <${RevisionHistory}
          revisions=${revisions}
          currentId=${revisionId}
          docId=${docId}
          versionSlug=${versionSlug}
          tags=${tags}
        />
      `}
    </div>
  `
}

const RevisionHistory = ({ revisions, currentId, docId, versionSlug, tags }) => {
  const [selectedA, setSelectedA] = useState(null)
  const [selectedB, setSelectedB] = useState(null)

  const seqById = new Map(revisions.map(r => [r.id, r.seq]))
  const tagsByRevId = new Map()
  for (const t of tags) {
    const list = tagsByRevId.get(t.revision_id) || []
    list.push(t.name)
    tagsByRevId.set(t.revision_id, list)
  }

  const handleCompare = () => {
    if (selectedA && selectedB && selectedA !== selectedB) {
      const a = seqById.get(selectedA)
      const b = seqById.get(selectedB)
      if (a && b) {
        const sorted = [a, b].sort((x, y) => x - y)
        const revSeq = seqById.get(currentId) || sorted[1]
        navigate(`/${docId}/${versionSlug}/rev/${revSeq}/diff/${sorted[0]}/${sorted[1]}`)
      }
    }
  }

  return html`
    <div class="revision-history">
      <div class="revision-history__toolbar">
        <button class="btn btn--primary btn--sm" onclick=${handleCompare}
          disabled=${!selectedA || !selectedB || selectedA === selectedB}>
          Compare selected
        </button>
      </div>
      <table class="revision-history__table">
        <thead>
          <tr>
            <th>A</th>
            <th>B</th>
            <th>#</th>
            <th>Message</th>
            <th>Tags</th>
            <th>Date</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          ${revisions.map(rev => html`
            <tr class=${rev.id === currentId ? 'revision-history__current' : ''}>
              <td><input type="radio" name="diffA" checked=${selectedA === rev.id} onchange=${() => setSelectedA(rev.id)} /></td>
              <td><input type="radio" name="diffB" checked=${selectedB === rev.id} onchange=${() => setSelectedB(rev.id)} /></td>
              <td class="revision-history__seq">${rev.seq || '?'}</td>
              <td>${rev.message || html`<span class="text-muted">-</span>`}</td>
              <td>${(tagsByRevId.get(rev.id) || []).map(name => html`<span class="tag-badge tag-badge--sm" key=${name}>${name}</span> `)}</td>
              <td class="revision-history__date">${new Date(rev.created_at + 'Z').toLocaleString()}</td>
              <td>
                ${rev.parent_id && seqById.get(rev.parent_id) && html`
                  <a class="revision-history__diff-link"
                    href="/${docId}/${versionSlug}/rev/${rev.seq}/diff/${seqById.get(rev.parent_id)}/${rev.seq}"
                    onclick=${(e) => { e.preventDefault(); navigate(`/${docId}/${versionSlug}/rev/${rev.seq}/diff/${seqById.get(rev.parent_id)}/${rev.seq}`) }}>
                    diff
                  </a>
                `}
              </td>
            </tr>
          `)}
        </tbody>
      </table>
    </div>
  `
}

export default RevisionControls
