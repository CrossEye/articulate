import { html } from 'htm/preact'
import { useState, useEffect } from 'preact/hooks'
import { state } from '../state.js'
import api from '../api.js'


// Refresh the sidebar comment counts after any mutation
const refreshCounts = (versionId) =>
  api.get(`/versions/${versionId}/comments/counts`)
    .then(counts => { state.commentCounts.value = counts })
    .catch(() => {})

const CommentThread = ({ versionId, path }) => {
  if (!state.showComments.value) return null

  const [comments, setComments] = useState([])
  const [reviews, setReviews] = useState([])
  const [open, setOpen] = useState(false)
  const [body, setBody] = useState('')
  const [replyTo, setReplyTo] = useState(null)
  const [replyBody, setReplyBody] = useState('')
  const [busy, setBusy] = useState(false)

  const user = state.currentUser.value
  const version = state.currentVersion.value
  const isReadOnly = !user

  const load = async () => {
    const [c, r] = await Promise.all([
      api.get(`/versions/${versionId}/comments?path=${encodeURIComponent(path)}`),
      api.get(`/versions/${versionId}/reviews?path=${encodeURIComponent(path)}`),
    ])
    setComments(c)
    setReviews(r)
  }

  useEffect(() => {
    if (open) load()
  }, [open, versionId, path])

  const handleOpen = () => setOpen(!open)

  const handlePost = async () => {
    if (!body.trim()) return
    setBusy(true)
    await api.post(`/versions/${versionId}/comments`, { path, body: body.trim() })
    setBody('')
    await load()
    await refreshCounts(versionId)
    setBusy(false)
  }

  const handleReply = async (parentId) => {
    if (!replyBody.trim()) return
    setBusy(true)
    await api.post(`/versions/${versionId}/comments`, {
      path, body: replyBody.trim(), parentId,
    })
    setReplyTo(null)
    setReplyBody('')
    await load()
    setBusy(false)
  }

  const handleResolve = async (commentId, resolved) => {
    await api.patch(`/versions/${versionId}/comments/${commentId}/resolve`, { resolved })
    await load()
    await refreshCounts(versionId)
  }

  const handleDelete = async (commentId) => {
    await api.delete(`/versions/${versionId}/comments/${commentId}`)
    await load()
    await refreshCounts(versionId)
  }

  const handleReview = async (status) => {
    const existing = reviews.find(r => r.user_id === user?.id)
    if (existing?.status === status) {
      // Toggle off
      await api.delete(`/versions/${versionId}/reviews?path=${encodeURIComponent(path)}`)
    } else {
      await api.put(`/versions/${versionId}/reviews`, { path, status })
    }
    await load()
  }

  // Split comments into threads
  const topLevel = comments.filter(c => !c.parent_id)
  const byParent = new Map()
  for (const c of comments) {
    if (c.parent_id) {
      const list = byParent.get(c.parent_id) || []
      list.push(c)
      byParent.set(c.parent_id, list)
    }
  }

  const unresolvedCount = topLevel.filter(c => !c.resolved).length
  const myReview = reviews.find(r => r.user_id === user?.id)
  const approvedCount = reviews.filter(r => r.status === 'approved').length
  const changesCount = reviews.filter(r => r.status === 'changes-requested').length

  const reviewSummary = [
    approvedCount > 0 && `${approvedCount} approved`,
    changesCount > 0 && `${changesCount} changes requested`,
  ].filter(Boolean).join(' · ')

  return html`
    <div class="comment-thread">
      <button class="comment-thread__toggle" onclick=${handleOpen}>
        ${open ? '▾' : '▸'} Comments
        ${unresolvedCount > 0 && html`<span class="comment-thread__badge">${unresolvedCount}</span>`}
        ${reviews.length > 0 && !open && html`<span class="comment-thread__review-summary">${reviewSummary}</span>`}
      </button>

      ${open && html`
        <div class="comment-thread__body">

          ${reviews.length > 0 && html`
            <div class="comment-thread__reviews">
              ${reviews.map(r => html`
                <span class="review-badge review-badge--${r.status}" key=${r.user_id}
                  title="${r.display_name || r.username}: ${r.status}">
                  ${r.status === 'approved' ? '✓' : '✗'} ${r.display_name || r.username}
                </span>
              `)}
            </div>
          `}

          ${user && version?.kind === 'branch' && html`
            <div class="comment-thread__review-actions">
              <button class="btn btn--xs ${myReview?.status === 'approved' ? 'btn--active' : ''}"
                onclick=${() => handleReview('approved')}>
                ${myReview?.status === 'approved' ? '✓ Approved' : 'Approve'}
              </button>
              <button class="btn btn--xs ${myReview?.status === 'changes-requested' ? 'btn--active' : ''}"
                onclick=${() => handleReview('changes-requested')}>
                ${myReview?.status === 'changes-requested' ? '✗ Changes Requested' : 'Request Changes'}
              </button>
            </div>
          `}

          ${topLevel.length === 0 && html`
            <p class="comment-thread__empty">No comments yet.</p>
          `}

          ${topLevel.map(c => html`
            <${CommentItem}
              key=${c.id}
              comment=${c}
              replies=${byParent.get(c.id) || []}
              user=${user}
              replyTo=${replyTo}
              replyBody=${replyBody}
              onReply=${() => { setReplyTo(c.id); setReplyBody('') }}
              onReplyBodyChange=${(v) => setReplyBody(v)}
              onReplySubmit=${() => handleReply(c.id)}
              onCancelReply=${() => setReplyTo(null)}
              onResolve=${handleResolve}
              onDelete=${handleDelete}
              busy=${busy}
            />
          `)}

          ${user && html`
            <div class="comment-new">
              <textarea class="comment-new__input" rows="2"
                placeholder="Add a comment…"
                value=${body}
                onInput=${(e) => setBody(e.target.value)}
                onKeyDown=${(e) => e.key === 'Enter' && e.ctrlKey && handlePost()}
              />
              <button class="btn btn--sm btn--primary" onclick=${handlePost}
                disabled=${busy || !body.trim()}>
                Comment
              </button>
            </div>
          `}
        </div>
      `}
    </div>
  `
}

const CommentItem = ({ comment: c, replies, user, replyTo, replyBody, onReply, onReplyBodyChange, onReplySubmit, onCancelReply, onResolve, onDelete, busy }) => {
  const isAuthor = user?.id === c.user_id
  const isAdmin = user?.role === 'admin'
  const canDelete = isAuthor || isAdmin

  return html`
    <div class="comment-item ${c.resolved ? 'comment-item--resolved' : ''}">
      <div class="comment-item__header">
        <span class="comment-item__who">${c.display_name || c.username}</span>
        <span class="comment-item__date">${new Date(c.created_at + 'Z').toLocaleDateString()}</span>
        ${c.resolved && html`<span class="comment-item__resolved-badge">Resolved</span>`}
        <span class="comment-item__actions">
          ${!c.resolved && user && html`
            <button class="btn btn--xs" onclick=${() => onResolve(c.id, true)}>Resolve</button>
          `}
          ${c.resolved && (isAuthor || isAdmin) && html`
            <button class="btn btn--xs" onclick=${() => onResolve(c.id, false)}>Re-open</button>
          `}
          ${canDelete && html`
            <button class="btn btn--xs btn--danger" onclick=${() => onDelete(c.id)}>Delete</button>
          `}
        </span>
      </div>
      <p class="comment-item__body">${c.body}</p>

      ${replies.map(r => html`
        <div class="comment-reply" key=${r.id}>
          <div class="comment-item__header">
            <span class="comment-item__who">${r.display_name || r.username}</span>
            <span class="comment-item__date">${new Date(r.created_at + 'Z').toLocaleDateString()}</span>
            <span class="comment-item__actions">
              ${(user?.id === r.user_id || isAdmin) && html`
                <button class="btn btn--xs btn--danger" onclick=${() => onDelete(r.id)}>Delete</button>
              `}
            </span>
          </div>
          <p class="comment-item__body">${r.body}</p>
        </div>
      `)}

      ${user && (replyTo === c.id
        ? html`
          <div class="comment-reply-form">
            <textarea class="comment-new__input" rows="2"
              placeholder="Reply…"
              value=${replyBody}
              onInput=${(e) => onReplyBodyChange(e.target.value)}
              onKeyDown=${(e) => e.key === 'Enter' && e.ctrlKey && onReplySubmit()}
            />
            <div class="comment-reply-form__buttons">
              <button class="btn btn--sm btn--primary" onclick=${onReplySubmit}
                disabled=${busy || !replyBody.trim()}>Reply</button>
              <button class="btn btn--sm" onclick=${onCancelReply}>Cancel</button>
            </div>
          </div>
        `
        : html`<button class="comment-item__reply-btn" onclick=${onReply}>Reply</button>`
      )}
    </div>
  `
}

export default CommentThread
