import { html } from 'htm/preact'
import { useState } from 'preact/hooks'
import { state } from '../state.js'
import { navigate } from '../router.js'
import api from '../api.js'

const LoginPage = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  // Force password change state
  const [forceChange, setForceChange] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const result = await api.post('/auth/login', {
        username,
        password,
      })
      if (result.forcePasswordChange) {
        setForceChange(true)
        setLoading(false)
        return
      }
      state.currentUser.value = result.user
      navigate('/')
    } catch (err) {
      setError(err.message || 'Login failed')
      setLoading(false)
    }
  }

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    setError(null)
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    setLoading(true)
    try {
      await api.patch('/auth/me/password', {
        current: password,
        newPassword,
      })
      // Re-fetch current user
      const data = await api.get('/auth/me')
      state.currentUser.value = data.user
      navigate('/')
    } catch (err) {
      setError(err.message || 'Password change failed')
      setLoading(false)
    }
  }

  if (forceChange) {
    return html`
      <main class="main-content auth-page">
        <div class="auth-card">
          <h1>Change Password</h1>
          <p class="text-muted">You must change your password before continuing.</p>
          ${error && html`<div class="auth-error">${error}</div>`}
          <form onsubmit=${handlePasswordChange}>
            <label class="auth-label">
              New Password
              <input type="password" class="auth-input" value=${newPassword}
                oninput=${(e) => setNewPassword(e.target.value)} required minlength="6" />
            </label>
            <label class="auth-label">
              Confirm Password
              <input type="password" class="auth-input" value=${confirmPassword}
                oninput=${(e) => setConfirmPassword(e.target.value)} required minlength="6" />
            </label>
            <button type="submit" class="auth-btn" disabled=${loading}>
              ${loading ? 'Saving\u2026' : 'Set New Password'}
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
        ${error && html`<div class="auth-error">${error}</div>`}
        <form onsubmit=${handleLogin}>
          <label class="auth-label">
            Username
            <input type="text" class="auth-input" value=${username}
              oninput=${(e) => setUsername(e.target.value)} required autofocus />
          </label>
          <label class="auth-label">
            Password
            <input type="password" class="auth-input" value=${password}
              oninput=${(e) => setPassword(e.target.value)} required />
          </label>
          <button type="submit" class="auth-btn" disabled=${loading}>
            ${loading ? 'Logging in\u2026' : 'Log In'}
          </button>
        </form>
      </div>
    </main>
  `
}

export default LoginPage
