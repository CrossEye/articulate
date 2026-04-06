import { html } from 'htm/preact'
import { signal } from '@preact/signals'
import { state } from '../state.js'
import { navigate } from '../router.js'
import api from '../api.js'

const LoginPage = () => {
  const username = signal('')
  const password = signal('')
  const error = signal(null)
  const loading = signal(false)

  // Force password change state
  const forceChange = signal(false)
  const newPassword = signal('')
  const confirmPassword = signal('')

  const handleLogin = async (e) => {
    e.preventDefault()
    error.value = null
    loading.value = true
    try {
      const result = await api.post('/auth/login', {
        username: username.value,
        password: password.value,
      })
      if (result.forcePasswordChange) {
        forceChange.value = true
        loading.value = false
        return
      }
      state.currentUser.value = result.user
      navigate('/')
    } catch (err) {
      error.value = err.message || 'Login failed'
      loading.value = false
    }
  }

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    error.value = null
    if (newPassword.value.length < 6) {
      error.value = 'Password must be at least 6 characters'
      return
    }
    if (newPassword.value !== confirmPassword.value) {
      error.value = 'Passwords do not match'
      return
    }
    loading.value = true
    try {
      await api.patch('/auth/me/password', {
        current: password.value,
        newPassword: newPassword.value,
      })
      // Re-fetch current user
      const data = await api.get('/auth/me')
      state.currentUser.value = data.user
      navigate('/')
    } catch (err) {
      error.value = err.message || 'Password change failed'
      loading.value = false
    }
  }

  if (forceChange.value) {
    return html`
      <main class="main-content auth-page">
        <div class="auth-card">
          <h1>Change Password</h1>
          <p class="text-muted">You must change your password before continuing.</p>
          ${error.value && html`<div class="auth-error">${error.value}</div>`}
          <form onsubmit=${handlePasswordChange}>
            <label class="auth-label">
              New Password
              <input type="password" class="auth-input" value=${newPassword.value}
                oninput=${(e) => { newPassword.value = e.target.value }} required minlength="6" />
            </label>
            <label class="auth-label">
              Confirm Password
              <input type="password" class="auth-input" value=${confirmPassword.value}
                oninput=${(e) => { confirmPassword.value = e.target.value }} required minlength="6" />
            </label>
            <button type="submit" class="auth-btn" disabled=${loading.value}>
              ${loading.value ? 'Saving\u2026' : 'Set New Password'}
            </button>
          </form>
        </div>
      </main>
    `
  }

  return html`
    <main class="main-content auth-page">
      <div class="auth-card">
        <h1>Log In</h1>
        ${error.value && html`<div class="auth-error">${error.value}</div>`}
        <form onsubmit=${handleLogin}>
          <label class="auth-label">
            Username
            <input type="text" class="auth-input" value=${username.value}
              oninput=${(e) => { username.value = e.target.value }} required autofocus />
          </label>
          <label class="auth-label">
            Password
            <input type="password" class="auth-input" value=${password.value}
              oninput=${(e) => { password.value = e.target.value }} required />
          </label>
          <button type="submit" class="auth-btn" disabled=${loading.value}>
            ${loading.value ? 'Logging in\u2026' : 'Log In'}
          </button>
        </form>
      </div>
    </main>
  `
}

export default LoginPage
