import { html } from 'htm/preact'
import { signal } from '@preact/signals'
import { useEffect } from 'preact/hooks'
import { state } from '../state.js'
import { navigate } from '../router.js'
import api from '../api.js'

const InvitePage = ({ params }) => {
  const token = params['0'] || params.token
  const invite = signal(null)
  const error = signal(null)
  const loading = signal(true)

  const username = signal('')
  const password = signal('')
  const displayName = signal('')
  const submitting = signal(false)

  useEffect(() => {
    api.get(`/invites/accept/${token}`)
      .then(data => {
        invite.value = data
        loading.value = false
      })
      .catch(err => {
        error.value = err.message || 'Invalid invite'
        loading.value = false
      })
  }, [token])

  const handleSubmit = async (e) => {
    e.preventDefault()
    error.value = null
    if (password.value.length < 6) {
      error.value = 'Password must be at least 6 characters'
      return
    }
    submitting.value = true
    try {
      const result = await api.post(`/invites/accept/${token}`, {
        username: username.value,
        password: password.value,
        displayName: displayName.value || undefined,
      })
      state.currentUser.value = result.user
      navigate('/')
    } catch (err) {
      error.value = err.message || 'Registration failed'
      submitting.value = false
    }
  }

  if (loading.value) {
    return html`<main class="main-content auth-page"><p>Loading\u2026</p></main>`
  }

  if (error.value && !invite.value) {
    return html`
      <main class="main-content auth-page">
        <div class="auth-card">
          <h1>Invalid Invite</h1>
          <p class="auth-error">${error.value}</p>
          <a href="/login" onclick=${(e) => { e.preventDefault(); navigate('/login') }}>Go to login</a>
        </div>
      </main>
    `
  }

  return html`
    <main class="main-content auth-page">
      <div class="auth-card">
        <h1>Create Account</h1>
        <p class="text-muted">You've been invited as <strong>${invite.value.role}</strong>.</p>
        ${error.value && html`<div class="auth-error">${error.value}</div>`}
        <form onsubmit=${handleSubmit}>
          <label class="auth-label">
            Username
            <input type="text" class="auth-input" value=${username.value}
              oninput=${(e) => { username.value = e.target.value }} required autofocus />
          </label>
          <label class="auth-label">
            Display Name (optional)
            <input type="text" class="auth-input" value=${displayName.value}
              oninput=${(e) => { displayName.value = e.target.value }} />
          </label>
          <label class="auth-label">
            Password
            <input type="password" class="auth-input" value=${password.value}
              oninput=${(e) => { password.value = e.target.value }} required minlength="6" />
          </label>
          <button type="submit" class="auth-btn" disabled=${submitting.value}>
            ${submitting.value ? 'Creating account\u2026' : 'Create Account'}
          </button>
        </form>
      </div>
    </main>
  `
}

export default InvitePage
